// Pre-submission indexability audit for GSC.
// Checks every URL in the live sitemap for HTTP 200, robots indexability and
// a self-referencing canonical. Exits non-zero if anything would be wasted
// crawl budget or would conflict in Search Console.
const BASE_URL = (process.env.AUDIT_BASE_URL || "https://www.hexescortsug.com").replace(/\/$/, "");
const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY || 4);
const TIMEOUT_MS = 20_000;
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

async function fetchWithRetry(url, attempts = 2) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fetch(url, {
        headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      if (i === attempts - 1) throw error;
    }
  }
}

async function audit(url) {
  try {
    const response = await fetchWithRetry(url);
    const html = await response.text();
    const robots = (html.match(/<meta[^>]*name=["']robots["'][^>]*>/i) || [""])[0];
    const canonical = (html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) || [])[1] || "";
    const noindex = /noindex/i.test(robots) || /noindex/i.test(response.headers.get("x-robots-tag") || "");
    const canonicalMatches = !canonical || new URL(canonical, url).pathname === new URL(url).pathname;
    return {
      url,
      status: response.status,
      noindex,
      canonical: canonical || null,
      canonicalMatches,
      words: html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length,
    };
  } catch (error) {
    return { url, status: 0, error: String(error), noindex: false, canonicalMatches: false };
  }
}

const sitemapResponse = await fetchWithRetry(`${BASE_URL}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());

const results = [];
let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const index = cursor;
    cursor += 1;
    results.push(await audit(urls[index]));
  }
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));

const non200 = results.filter((row) => row.status !== 200);
const noindex = results.filter((row) => row.noindex);
const mismatch = results.filter((row) => row.status === 200 && !row.canonicalMatches);
const thin = results.filter((row) => row.status === 200 && row.words < 200);

const byPath = (rows) => rows.map((row) => new URL(row.url).pathname);
console.log(`Sitemap URLs: ${urls.length}`);
console.log(`HTTP 200: ${results.filter((row) => row.status === 200).length}`);
console.log(`Noindex: ${noindex.length}`, byPath(noindex).slice(0, 20));
console.log(`Canonical mismatch: ${mismatch.length}`, byPath(mismatch).slice(0, 20));
console.log(`Thin (<200 words): ${thin.length}`, byPath(thin).slice(0, 20));
console.log(`Non-200 / network failures: ${non200.length}`, non200.slice(0, 20).map((row) => `${new URL(row.url).pathname} -> ${row.status || row.error}`));

const failed = non200.length > 0 || noindex.length > 0 || mismatch.length > 0;
if (failed) process.exitCode = 1;
