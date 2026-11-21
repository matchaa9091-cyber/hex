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

function daysToSince(days: number): string {
  const safe = [7, 30, 90].includes(days) ? days : 30;
  return new Date(Date.now() - safe * 24 * 60 * 60 * 1000).toISOString();
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const requested = Number(req.nextUrl.searchParams.get("days") || 30);
  const since = daysToSince(requested);
  const days = [7, 30, 90].includes(requested) ? requested : 30;

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
         WHERE ce.created_at >= ?
         GROUP BY p.id, p.name, p.location
         ORDER BY total DESC
         LIMIT 500`,
        [since]
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
         WHERE created_at >= ?`,
        [since]
      ),
    ]);

    return NextResponse.json(
      { days, since, rows: rows || [], totals: totals?.[0] || null, generatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Analytics unavailable" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
