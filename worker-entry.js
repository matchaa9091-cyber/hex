import openNextWorker, {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "./.open-next/worker.js";
import { BUILD_ID } from "./scripts/build-id.generated.mjs";

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge };

const STALE_CACHE_NAME = "hex-stale-html-v1";
const FRESH_TTL_MS = 180 * 1000;

// Strip ONLY tracking parameters. Real parameters (admin, token, etc.) are
// preserved so private responses can never collide with public cache entries.
const TRACKING_PARAM =
  /^(utm_|fbclid$|gclid$|gclsrc$|dclid$|msclkid$|mc_cid$|mc_eid$|yclid$|igshid$|_rsc$|_ts$)/i;

function canonicalUrl(requestUrl) {
  const url = new URL(requestUrl);
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAM.test(key)) url.searchParams.delete(key);
  }
  url.hash = "";
  return url;
}

function cacheKey(url, generation) {
  const keyUrl = new URL(url.toString());
  keyUrl.searchParams.set("__hex_gen", String(generation || 1));
  return new Request(keyUrl.toString(), { method: "GET" });
}

// One strongly-consistent Durable Object holds the cache generation. Any
// successful profile write bumps it, instantly retiring every cached page and
// API response without enumerating paths.
export class CacheGeneration {
  constructor(state) {
    this.state = state;
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/bump") {
      const current = Number(await this.state.storage.get("generation")) || 1;
      const next = current + 1;
      await this.state.storage.put("generation", next);
      return new Response(String(next), { headers: { "cache-control": "no-store" } });
    }
    const current = Number(await this.state.storage.get("generation")) || 1;
    return new Response(String(current), { headers: { "cache-control": "no-store" } });
  }
}

function generationStub(env) {
  if (!env.CACHE_GENERATION) return null;
  return env.CACHE_GENERATION.get(env.CACHE_GENERATION.idFromName("global"));
}

async function getGeneration(env) {
  const stub = generationStub(env);
  if (!stub) return 1;
  try {
    const response = await stub.fetch("https://cache-generation.internal/get");
    const value = Number(await response.text());
    return Number.isFinite(value) && value > 0 ? value : 1;
  } catch (error) {
    console.error("[hex] cache generation read failed:", error);
    return 1;
  }
}

async function bumpGeneration(env) {
  const stub = generationStub(env);
  if (!stub) return 1;
  try {
    const response = await stub.fetch("https://cache-generation.internal/bump", {
      method: "POST",
    });
    const value = Number(await response.text());
    return Number.isFinite(value) && value > 0 ? value : 1;
  } catch (error) {
    console.error("[hex] cache generation bump failed:", error);
    return 1;
  }
}

const HTML_CACHE_PREFIX = "html-fallback/";
const HTML_CACHE_TTL_SECONDS = 86400;

function r2HtmlKey(url) {
  const path = url.pathname === "/" ? "/index" : url.pathname.replace(/\/+$/, "") || "/index";
  return `${HTML_CACHE_PREFIX}${url.hostname}${path}`;
}

async function readR2Html(env, url, generation) {
  try {
    const object = await env.NEXT_INC_CACHE_R2_BUCKET?.get(r2HtmlKey(url));
    if (!object) return null;
    if (
      object.customMetadata?.build !== BUILD_ID ||
      Number(object.customMetadata?.generation) !== generation
    ) {
      return null;
    }
    return await object.text();
  } catch (error) {
    console.error("[hex] R2 HTML read failed:", error);
    return null;
  }
}

async function writeR2Html(env, url, html, generation) {
  try {
    await env.NEXT_INC_CACHE_R2_BUCKET?.put(r2HtmlKey(url), html, {
      httpMetadata: {
        contentType: "text/html; charset=utf-8",
        cacheControl: `public, max-age=${HTML_CACHE_TTL_SECONDS}`,
      },
      customMetadata: { build: BUILD_ID, generation: String(generation) },
    });
  } catch (error) {
    console.error("[hex] R2 HTML write failed:", error);
  }
}


function isCachingAllowed(request, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (request.headers.has("cookie") || request.headers.has("authorization")) return false;
  if (url.searchParams.has("admin") || url.searchParams.has("token")) return false;
  if (
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-Prefetch") === "1" ||
    request.headers.get("Purpose") === "prefetch" ||
    request.headers.has("x-isr") ||
    request.headers.has("x-prerender-revalidate")
  ) {
    return false;
  }

  const path = url.pathname;
  return !(
    path.startsWith("/hx-ctrl") ||
    path.startsWith("/admin") ||
    path.startsWith("/api/upload") ||
    path.startsWith("/api/payments")
  );
}

function isHtmlRequest(request, url) {
  if (url.pathname.startsWith("/api/")) return false;
  if (request.headers.get("RSC") === "1") return false;
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html") || accept === "" || accept === "*/*";
}

function cachedAt(response) {
  const raw = response.headers.get("X-Hex-Cached-At");
  if (!raw) return 0;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

function isFresh(cached) {
  const at = cachedAt(cached);
  return at > 0 && Date.now() - at < FRESH_TTL_MS;
}

function cacheAge(cached) {
  const at = cachedAt(cached);
  return at > 0 ? Math.floor((Date.now() - at) / 1000) : -1;
}

function preparedResponse(response, maxAge) {
  const headers = new Headers(response.headers);
  headers.delete("set-cookie");
  headers.delete("vary");
  headers.set("X-Hex-Cached-At", String(Date.now()));
  headers.set("X-Hex-Build", BUILD_ID);
  // Browsers must always revalidate so admins see edits immediately. The
  // shared edge cache is still allowed to cache for maxAge seconds.
  headers.set("Cache-Control", `public, max-age=0, s-maxage=${maxAge}`);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function storeResponse(edgeCache, staleCache, key, response) {
  // Only HTML gets a long-lived stale copy; API payloads must never become
  // an emergency HTML fallback.
  const contentType = response.headers.get("content-type") || "";
  const jobs = [edgeCache.put(key, preparedResponse(response.clone(), 180))];
  if (contentType.includes("text/html")) {
    jobs.push(staleCache.put(key, preparedResponse(response.clone(), 86400)));
  }
  return Promise.allSettled(jobs);
}

async function refreshInBackground(
  request,
  env,
  context,
  edgeCache,
  staleCache,
  key,
  url,
  generation
) {
  try {
    const fresh = await openNextWorker.fetch(request, env, context);
    if (fresh && fresh.status === 200) {
      const cc = fresh.headers.get("cache-control") || "";
      if (!cc.includes("no-store") && !cc.includes("private")) {
        await storeResponse(edgeCache, staleCache, key, fresh);
        const contentType = fresh.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          await writeR2Html(env, url, await fresh.clone().text(), generation);
        }
      }
    }
  } catch (error) {
    console.error("[hex] background refresh failed:", error);
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (ch) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[ch] || ch;
  });
}

function emergencyHtml(url) {
  const canonical = `https://www.hexescortsug.com${url.pathname === "/" ? "/" : url.pathname}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hex Escorts Uganda</title><link rel="canonical" href="${escapeHtml(canonical)}"><style>body{font-family:system-ui,sans-serif;max-width:640px;margin:10vh auto;padding:0 20px;line-height:1.6;color:#222}a{color:#a00}</style></head><body><h1>Hex Escorts Uganda</h1><p>We are refreshing this page right now. Please try again in a moment.</p><p><a href="/">Return to the homepage</a></p></body></html>`;
}

async function serveFallback(request, url, staleCache, key, upstream) {
  try {
    const stale = await staleCache.match(key);
    if (stale) {
      if (stale.headers.get("X-Hex-Build") !== BUILD_ID) {
        await staleCache.delete(key);
      } else {
        const response = new Response(stale.body, stale);
        response.headers.set("X-Hex-Fallback", "stale");
        response.headers.set("Cache-Control", "public, max-age=0, s-maxage=60");
        return response; // HTTP 200 with real, previously rendered content
      }
    }
  } catch (error) {
    console.error("[hex] stale cache lookup failed:", error);
  }

  if (!isHtmlRequest(request, url)) {
    return upstream || new Response(JSON.stringify({ error: "temporarily unavailable" }), {
      status: 503,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }

  // Last resort: no cached render exists for this location yet. Still answer
  // with a valid 200 document instead of Cloudflare's Error 1102 page.
  return new Response(emergencyHtml(url), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "X-Hex-Fallback": "emergency",
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Lightweight generation probe. Clients poll this (tiny JSON, no Next.js
    // render, no D1) and refetch profiles only when a write bumped the DO.
    if (url.pathname === "/api/cache-generation") {
      const generation = await getGeneration(env);
      return new Response(JSON.stringify({ generation }), {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
          "X-Hex-Generation": String(generation),
        },
      });
    }

    const edgeCache = caches.default;
    const staleCache = await caches.open(STALE_CACHE_NAME);

    // Profile mutations: run the write first, then bump the single Durable
    // Object generation. The next request reads the new generation and misses
    // every cached page/API response, so all edits are visible immediately.
    const isProfileMutation =
      (request.method === "POST" || request.method === "PUT" || request.method === "DELETE") &&
      (url.pathname.startsWith("/api/profiles") || url.pathname.startsWith("/api/applications"));

    if (isProfileMutation) {
      const response = await openNextWorker.fetch(request, env, ctx);
      if (response && response.ok) {
        const generation = await bumpGeneration(env);
        const result = new Response(response.body, response);
        result.headers.set("X-Hex-Generation", String(generation));
        return result;
      }
      return response;
    }

    if (!isCachingAllowed(request, url)) {
      return openNextWorker.fetch(request, env, ctx);
    }

    const generation = await getGeneration(env);
    const key = cacheKey(canonicalUrl(url), generation);

    // 1. Edge lookup. Fresh entries are served directly and real stale entries
    //    are served immediately then refreshed in the background. Synthetic
    //    fallbacks are never allowed to stick: they fall through to a real
    //    render so a later request can upgrade the cached HTML.
    let cached = null;
    try {
      cached = await edgeCache.match(key);
    } catch (error) {
      console.error("[hex] edge cache lookup failed:", error);
    }

    if (cached) {
      if (cached.headers.get("X-Hex-Build") !== BUILD_ID) {
        ctx.waitUntil(Promise.allSettled([edgeCache.delete(key), staleCache.delete(key)]));
      } else if (cached.headers.get("X-Hex-Fallback")) {
        // Synthetic fallbacks are disposable. Drop them and try a real render.
        ctx.waitUntil(Promise.allSettled([edgeCache.delete(key), staleCache.delete(key)]));
      } else {
        const fresh = isFresh(cached);
        const response = new Response(cached.body, cached);
        response.headers.set("Cache-Control", "public, max-age=0, s-maxage=180");
        response.headers.set("X-Hex-Edge-Cache", fresh ? "HIT" : "STALE");
        response.headers.set("X-Hex-Cache-Age", String(cacheAge(cached)));
        response.headers.set("X-Hex-Generation", String(generation));
        if (!fresh) {
          ctx.waitUntil(
            refreshInBackground(request, env, ctx, edgeCache, staleCache, key, url, generation)
          );
        }
        return response;
      }
    }

    // 2. Global last-good HTML from R2. Only real renders are accepted here;
    //    synthetic fallback objects from older builds are ignored.
    const r2Html = await readR2Html(env, url, generation);
    if (r2Html && !r2Html.includes('name="hex-fallback"')) {
      const response = new Response(r2Html, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=0, s-maxage=180",
          "X-Hex-Fallback": "r2",
          "X-Hex-Edge-Cache": "STALE-GLOBAL",
          "X-Hex-Build": BUILD_ID,
          "X-Hex-Generation": String(generation),
        },
      });
      ctx.waitUntil(storeResponse(edgeCache, staleCache, key, response.clone()));
      ctx.waitUntil(
        refreshInBackground(request, env, ctx, edgeCache, staleCache, key, url, generation)
      );
      return response;
    }

    // 3. Cold render, wrapped so exceptions become a valid response. On the
    //    Paid plan this can render fully, so visitors always get real HTML.
    let upstream;
    try {
      upstream = await openNextWorker.fetch(request, env, ctx);
    } catch (error) {
      console.error("[hex] render failed for", url.pathname, error);
      return serveFallback(request, url, staleCache, key, null);
    }

    if (upstream && upstream.status >= 500) {
      console.error("[hex] render returned", upstream.status, "for", url.pathname);
      return serveFallback(request, url, staleCache, key, upstream);
    }

    if (upstream && upstream.status === 200) {
      const cc = upstream.headers.get("cache-control") || "";
      if (!cc.includes("no-store") && !cc.includes("private")) {
        ctx.waitUntil(storeResponse(edgeCache, staleCache, key, upstream));
        const contentType = upstream.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          ctx.waitUntil((async () => {
            await writeR2Html(env, url, await upstream.clone().text(), generation);
          })());
        }
      }
      const response = new Response(upstream.body, upstream);
      response.headers.set("X-Hex-Edge-Cache", "MISS");
      response.headers.set("X-Hex-Build", BUILD_ID);
      response.headers.set("X-Hex-Generation", String(generation));
      response.headers.set("Cache-Control", "public, max-age=0, s-maxage=180");
      return response;
    }

    return upstream;
  },
};
