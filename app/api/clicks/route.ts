export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { executeD1Query } from "@/lib/d1";

const KINDS = new Set(["whatsapp", "call", "phone_copy"]);
const SURFACES = new Set([
  "card",
  "detail",
  "carousel",
  "gallery",
  "drawer",
  "other",
]);
const DEVICES = new Set(["mobile", "tablet", "desktop", "unknown"]);

const DEDUPE_MS = 30_000;
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 10;

/** Stable, non-reversible daily visitor token. Never persisted as a raw IP. */
function dailySalt(): string {
  return (
    process.env.CLICK_HASH_SALT ||
    process.env.CLOUDFLARE_D1_TOKEN ||
    "hex-click-events"
  );
}

async function hashValue(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function clientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

function locationFromPath(path: string | null): string {
  if (!path) return "home";
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "escorts-in") return parts.slice(1).join(" / ") || "home";
  if (parts[0] === "profile" || parts[0] === "category") return "profile detail";
  return parts[0] || "home";
}

/**
 * Forward one event per ACCEPTED click to PostHog. Server-to-server delivery is
 * intentional: the browser SDK can be blocked by trackers/ad blockers, and a
 * client capture plus this call would double-count. The visitor hash is used
 * as distinct_id so no IP or phone number leaves the server.
 */
async function capturePostHog(args: {
  visitorHash: string;
  profileId: string;
  profileName: string | null;
  kind: string;
  surface: string;
  path: string | null;
  device: string;
  location: string | null;
  at: string;
}): Promise<void> {
  try {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
    if (!key) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    try {
      await fetch(`${host.replace(/\/$/, "")}/i/v0/e/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: key,
          event: "contact_click",
          properties: {
            distinct_id: args.visitorHash,
            $device_type:
              args.device === "mobile"
                ? "Mobile"
                : args.device === "tablet"
                  ? "Tablet"
                  : "Desktop",
            $current_url: args.path ? `https://www.hexescortsug.com${args.path}` : undefined,
            profile_id: args.profileId,
            profile_name: args.profileName || undefined,
            channel: args.kind,
            surface: args.surface,
            location: args.location || locationFromPath(args.path),
            path: args.path || "/",
            device: args.device,
          },
          timestamp: args.at,
        }),
        signal: controller.signal,
        cache: "no-store",
      });
    } finally {
      clearTimeout(timer);
    }
  } catch {
    // Analytics is best-effort; D1 is the source of truth.
  }
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    if (!raw || raw.length > 2048) {
      return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
    }

    let body: any;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
    }

    const profileId = typeof body.profileId === "string" ? body.profileId.trim() : "";
    const kind = typeof body.kind === "string" ? body.kind : "";
    const surface = typeof body.surface === "string" ? body.surface : "other";
    const device = typeof body.device === "string" && DEVICES.has(body.device) ? body.device : "unknown";
    const profileName = typeof body.profileName === "string" ? body.profileName.slice(0, 120) : null;
    const path =
      typeof body.path === "string" && body.path.startsWith("/")
        ? body.path.slice(0, 200)
        : null;
    const location = typeof body.location === "string" ? body.location.slice(0, 120) : null;

    if (!profileId || profileId.length > 64 || !KINDS.has(kind) || !SURFACES.has(surface)) {
      return NextResponse.json({ ok: false, error: "invalid fields" }, { status: 400 });
    }

    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const visitorHash = await hashValue(`${day}|${clientIp(req)}|${dailySalt()}`);
    const sinceDedupe = new Date(now - DEDUPE_MS).toISOString();
    const sinceRate = new Date(now - RATE_WINDOW_MS).toISOString();
    const at = new Date(now).toISOString();

    // One round-trip: confirm the profile, check the 30s dedupe window, the
    // 10-minute per-visitor cap, and read identity fields for PostHog.
    const checks = await executeD1Query(
      `SELECT
         (SELECT COUNT(*) FROM profiles WHERE id = ? AND is_archived = 0) AS profile_ok,
         (SELECT name FROM profiles WHERE id = ?) AS profile_name,
         (SELECT location FROM profiles WHERE id = ?) AS profile_location,
         (SELECT COUNT(*) FROM click_events
            WHERE visitor_hash = ? AND profile_id = ? AND kind = ? AND created_at > ?) AS dupe,
         (SELECT COUNT(*) FROM click_events
            WHERE visitor_hash = ? AND created_at > ?) AS rate`,
      [profileId, profileId, profileId, visitorHash, profileId, kind, sinceDedupe, visitorHash, sinceRate]
    );

    const check = checks?.[0];
    if (!check || Number(check.profile_ok) === 0) {
      return NextResponse.json({ ok: false, error: "unknown profile" }, { status: 404 });
    }
    if (Number(check.dupe) > 0) {
      return NextResponse.json({ ok: true, deduped: true });
    }
    if (Number(check.rate) >= RATE_MAX) {
      return NextResponse.json({ ok: true, rateLimited: true });
    }

    await executeD1Query(
      `INSERT INTO click_events (profile_id, kind, surface, path, visitor_hash, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [profileId, kind, surface, path, visitorHash, at]
    );

    await capturePostHog({
      visitorHash,
      profileId,
      profileName: profileName || check.profile_name || null,
      kind,
      surface,
      path,
      device,
      location: location || check.profile_location || null,
      at,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Tracking must never surface an error to the visitor.
    return NextResponse.json({ ok: false, error: "tracking unavailable" }, { status: 200 });
  }
}

export function GET() {
  return NextResponse.json({ error: "method not allowed" }, { status: 405 });
}
