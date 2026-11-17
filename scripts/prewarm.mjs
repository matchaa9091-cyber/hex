const BASE_URL = (process.env.PREWARM_BASE_URL || "https://www.hexescortsug.com").replace(/\/$/, "");
const PROFILE_LIMIT = Number(process.env.PREWARM_PROFILE_LIMIT || 20);
const CONCURRENCY = 4;
const REQUEST_TIMEOUT_MS = 20_000;

const PRIORITY_PATHS = [
  "/",
  "/vip",
  "/escorts-in",
  "/api/profiles",
  "/escorts-in/kampala",
  "/escorts-in/entebbe",
  "/escorts-in/jinja",
  "/escorts-in/mbarara",
  "/escorts-in/gulu",
  "/escorts-in/fort-portal",
  "/escorts-in/mbale",
  "/escorts-in/masaka",
  "/escorts-in/arua",
  "/escorts-in/mukono",
  "/escorts-in/wakiso",
  "/category/massage",
  "/category/slim",
  "/category/curvy",
  "/category/thick",
  "/guides",
  "/price-guide",
  "/reviews",
];

async function fetchText(path) {
  const response = await fetch(new URL(path, BASE_URL), {
    headers: { "user-agent": "HexPrewarm/1.0", accept: "text/html,application/xhtml+xml" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function sitemapPaths() {
  try {
    const xml = await fetchText("/sitemap.xml");
    return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)]
      .map((match) => match[1].trim())
      .filter((loc) => loc.startsWith(BASE_URL))
      .map((loc) => new URL(loc).pathname);
  } catch (error) {
    console.warn(`WARN sitemap: ${error.message}`);
    return [];
  }
}

function buildTargets(pathsFromSitemap) {
  const locations = pathsFromSitemap.filter((path) => path.startsWith("/escorts-in/")).slice(0, 25);
  const categories = pathsFromSitemap
    .filter((path) => path.startsWith("/category/") || /^\/(vip|massage|slim|curvy|thick)-escorts-in\//.test(path))
    .slice(0, 30);
  const profiles = pathsFromSitemap.filter((path) => path.startsWith("/profile/")).slice(0, PROFILE_LIMIT);
  const guides = pathsFromSitemap.filter((path) => path.startsWith("/guides/"));
  return [...new Set([...PRIORITY_PATHS, ...locations, ...categories, ...guides, ...profiles, "/sitemap.xml"])];
}

const failures = [];

async function warm(path) {
  const started = Date.now();
  try {
    const response = await fetch(new URL(path, BASE_URL), {
      headers: { "user-agent": "HexPrewarm/1.0", accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    await response.arrayBuffer();
    const ms = Date.now() - started;
    const cache = response.headers.get("x-hex-edge-cache") || "-";
    const fallback = response.headers.get("x-hex-fallback") || "-";

    if (!response.ok) {
      failures.push({ path, status: response.status });
      console.log(`FAIL ${path} -> ${response.status} (${ms}ms)`);
      return;
    }

    console.log(`OK   ${path} -> ${response.status} cache=${cache} fallback=${fallback} (${ms}ms)`);
  } catch (error) {
    failures.push({ path, error: error.message });
    console.log(`FAIL ${path} -> ${error.message}`);
  }
}

async function main() {
  const sitemap = await sitemapPaths();
  const targets = buildTargets(sitemap);
  console.log(`Prewarming ${targets.length} URLs on ${BASE_URL}`);

  const queue = [...targets];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const path = queue.shift();
        if (path) await warm(path);
      }
    })
  );

  if (failures.length) {
    console.warn(`Prewarm finished with ${failures.length} failure(s).`);
    if (process.env.PREWARM_STRICT === "1") process.exitCode = 1;
  } else {
    console.log("Prewarm complete. All targets returned 200.");
  }
}

await main();
