"use client";

export type ContactKind = "whatsapp" | "call" | "phone_copy";
export type ContactSurface =
  | "card"
  | "detail"
  | "carousel"
  | "gallery"
  | "drawer"
  | "other";

interface TrackContactOptions {
  profileId: string;
  kind: ContactKind;
  surface: ContactSurface;
  profileName?: string;
  location?: string;
}

/**
 * Record a contact-intent tap. The first-party /api/clicks endpoint is the
 * single source of truth: it dedupes/rate-limits, writes the D1 row, and then
 * forwards one `contact_click` event to PostHog server-to-server. Capturing in
 * the browser as well would double-count, so this helper only sends the beacon.
 *
 * Fire-and-forget by design — a blocked beacon must never interfere with the
 * WhatsApp/call action.
 */
export function trackContact({
  profileId,
  kind,
  surface,
  profileName,
  location,
}: TrackContactOptions): void {
  if (typeof window === "undefined" || !profileId) return;

  const payloadObj = {
    profileId,
    kind,
    surface,
    path: window.location.pathname,
    device: detectDevice(),
    profileName: profileName || undefined,
    location: location || undefined,
  };

  try {
    const body = JSON.stringify(payloadObj);
    const payload =
      typeof Blob !== "undefined"
        ? new Blob([body], { type: "text/plain;charset=UTF-8" })
        : body;
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/clicks", payload);
    } else if (typeof fetch !== "undefined") {
      fetch("/api/clicks", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Beacons are best-effort.
  }
}

/** Coarse device label used by the PostHog "clicks by device" breakdown. */
function detectDevice(): "mobile" | "tablet" | "desktop" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent || "";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|iphone|android/i.test(ua)) return "mobile";
  if (ua) return "desktop";
  return "unknown";
}
