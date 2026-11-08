"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      try {
        const origin = window.location?.origin || "https://www.hexescortsug.com";
        let url = origin + pathname;
        if (searchParams && searchParams.toString()) {
          url = url + "?" + searchParams.toString();
        }
        if (posthog && typeof posthog.capture === "function") {
          posthog.capture("$pageview", {
            $current_url: url,
          });
        }
      } catch (err) {
        // Tracker failure must NEVER throw or block page rendering
      }
    }
  }, [pathname, searchParams]);

  return null;
}
