# GSC re-indexing package (17 Nov 2026)

## Preflight — verified live before submission

Run `node scripts/audit-indexability.mjs` to reproduce:

```
Sitemap URLs: 415
HTTP 200: 415
Noindex: 0
Canonical mismatch: 0
Thin (<200 words): 0
Non-200 / network failures: 0
```

`robots.txt` returns 200, contains `Allow: /`, `Sitemap: https://www.hexescortsug.com/sitemap.xml`,
and only disallows `/api/`, `/admin/`, `/hx-ctrl-*`, `/location/`. The crawl probe
`/api/cache-generation` is explicitly allowed. Nothing needs changing before submission.

## Step 1 — submit the sitemap

1. Open Search Console → property `https://www.hexescortsug.com`.
2. **Sitemaps** → enter `sitemap.xml` → **Submit**.
3. Wait for status **Success** and check that "Discovered URLs" is at or near 415.

Do not submit each URL individually. The sitemap is the discovery mechanism; hand-requesting
all 415 would waste the daily crawl-request quota.

## Step 2 — hand-request the priority pages

Use **URL Inspection** → **Request Indexing**, in this order. Stop when GSC tells you the daily
limit is reached and continue the next day:

```
https://www.hexescortsug.com/
https://www.hexescortsug.com/directory
https://www.hexescortsug.com/guides
https://www.hexescortsug.com/guides/kampala-by-neighbourhood
https://www.hexescortsug.com/guides/entebbe-airport-stopover
https://www.hexescortsug.com/guides/jinja-weekend
https://www.hexescortsug.com/guides/safe-booking-checklist
https://www.hexescortsug.com/price-guide
https://www.hexescortsug.com/reviews
https://www.hexescortsug.com/escorts-in
https://www.hexescortsug.com/vip
https://www.hexescortsug.com/escorts-in/kampala
https://www.hexescortsug.com/escorts-in/entebbe
https://www.hexescortsug.com/escorts-in/jinja
https://www.hexescortsug.com/faq
```

The other 400 URLs will be discovered from `/directory`, the footer location hub and the sitemap.

## Step 3 — verify after 24–48 hours

- **Pages** report: indexed count should rise from the old 161-URL baseline toward 415.
- Re-run URL Inspection on `/directory` and one guide: expect "URL is available to Google" and
  "Page can be indexed".
- Check **Sitemaps** → `sitemap.xml` for any "Excluded by 'noindex'" entries — the preflight
  says there should be none.
- Expect no ranking change for at least a few days; Request Indexing queues a crawl, it does not
  guarantee immediate inclusion or ranking.

## Notes

- Deployed version `2d4594d3-0e65-4d41-80cc-6ac0cec3b489`, BUILD_ID `mwl18uxb-2uz4wt`,
  generation 12. No further deploy is required for indexing.
- Do not request indexing for `/api/*`, `/admin`, `/hx-ctrl-*`, or any URL with `admin`/`token`
  query parameters.
- I cannot submit these myself: there is no Search Console integration or Google OAuth access
  connected to this environment.
