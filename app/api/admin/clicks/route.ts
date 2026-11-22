export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { executeD1Query } from "@/lib/d1";

/**
 * Server-gated aggregate contact analytics.
 * Requires the admin viewing key as `Authorization: Bearer <HX_ADMIN_KEY>`.
 * The key is a Worker secret (never committed) and the response is no-store.
 */
function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.HX_ADMIN_KEY;
  if (!expected) return false;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const headerKey = (req.headers.get("x-hx-admin-key") || "").trim();
  return token === expected || headerKey === expected;
}

type RangeKey = "today" | "yesterday" | "7d" | "30d";

const RANGE_LABELS: Record<RangeKey, string> = {
  today: "today",
  yesterday: "yesterday",
  "7d": "in the last 7 days",
  "30d": "in the last 30 days",
};

const DAY_MS = 24 * 60 * 60 * 1000;
// PostHog project 385893 is set to UTC, so its day starts at 00:00 UTC —
// 03:00 in East Africa (UTC+3). Match that boundary exactly so the admin tab
// and the PostHog dashboard agree on what "today" and "yesterday" mean.
/** Start of the current UTC day (= 03:00 EAT), expressed as a UTC instant. */
function posthogDayStart(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Resolve the requested range to a half-open [since, until) UTC window.
 * `days=7|30` is accepted as a legacy fallback for older admin tabs.
 */
function resolveRange(
  req: NextRequest,
  now: Date
): { key: RangeKey; since: Date; until: Date } {
  const raw = (req.nextUrl.searchParams.get("range") || "").trim();
  let key: RangeKey;
  if (raw === "today" || raw === "yesterday" || raw === "7d" || raw === "30d") {
    key = raw;
  } else {
    const legacy = Number(req.nextUrl.searchParams.get("days") || 30);
    key = legacy === 7 ? "7d" : "30d";
  }

  const todayStart = posthogDayStart(now);
  switch (key) {
    case "today":
      return {
        key,
        since: todayStart,
        until: new Date(todayStart.getTime() + DAY_MS),
      };
    case "yesterday":
      return {
        key,
        since: new Date(todayStart.getTime() - DAY_MS),
        until: todayStart,
      };
    case "7d":
      // PostHog's -7d starts 7 UTC days before today and includes today.
      return {
        key,
        since: new Date(todayStart.getTime() - 7 * DAY_MS),
        until: new Date(todayStart.getTime() + DAY_MS),
      };
    case "30d":
      // PostHog's -30d starts 30 UTC days before today and includes today.
      return {
        key,
        since: new Date(todayStart.getTime() - 30 * DAY_MS),
        until: new Date(todayStart.getTime() + DAY_MS),
      };
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const now = new Date();
  const { key, since, until } = resolveRange(req, now);
  const sinceIso = since.toISOString();
  const untilIso = until.toISOString();

  try {
    const [rows, totals] = await Promise.all([
      executeD1Query(
        `SELECT
           p.id AS profile_id,
           p.name AS name,
           p.location AS location,
           SUM(CASE WHEN ce.kind = 'whatsapp'   THEN 1 ELSE 0 END) AS whatsapp,
           SUM(CASE WHEN ce.kind = 'call'       THEN 1 ELSE 0 END) AS call,
           SUM(CASE WHEN ce.kind = 'phone_copy' THEN 1 ELSE 0 END) AS phone_copy,
           COUNT(*) AS total,
           MAX(ce.created_at) AS last_contact
         FROM click_events ce
         JOIN profiles p ON p.id = ce.profile_id
         WHERE ce.created_at >= ? AND ce.created_at < ?
         GROUP BY p.id, p.name, p.location
         ORDER BY total DESC
         LIMIT 500`,
        [sinceIso, untilIso]
      ),
      executeD1Query(
        `SELECT
           COUNT(*) AS total,
           SUM(CASE WHEN kind = 'whatsapp'   THEN 1 ELSE 0 END) AS whatsapp,
           SUM(CASE WHEN kind = 'call'       THEN 1 ELSE 0 END) AS call,
           SUM(CASE WHEN kind = 'phone_copy' THEN 1 ELSE 0 END) AS phone_copy,
           COUNT(DISTINCT profile_id) AS profiles,
           MAX(created_at) AS last_contact
         FROM click_events
         WHERE created_at >= ? AND created_at < ?`,
        [sinceIso, untilIso]
      ),
    ]);

    return NextResponse.json(
      {
        range: key,
        label: RANGE_LABELS[key],
        since: sinceIso,
        until: untilIso,
        rows: rows || [],
        totals: totals?.[0] || null,
        generatedAt: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Analytics unavailable" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
