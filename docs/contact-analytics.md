# Per-escort contact analytics

Contact taps are recorded with **D1 as the source of truth** and mirrored to
**PostHog** for funnel/device analysis. Support WhatsApp links (forgot-passcode
and "become an escort") are deliberately excluded.

## What is tracked

| Event | Trigger | `channel` value |
|---|---|---|
| WhatsApp tap | Any per-profile `wa.me` link (card, detail, ad carousel) | `whatsapp` |
| Call tap | Mobile "Contact" button → `tel:` | `call` |
| Phone copy | Desktop "Contact" button → clipboard | `phone_copy` |

A click beacon (`POST /api/clicks`) carries `profileId`, `kind`, `surface`,
`path`, `device`, `profileName` and `location`. The route:

1. validates the fields and confirms the profile is live in D1,
2. dedupes the same visitor + profile + kind within 30 seconds,
3. caps a visitor at 10 accepted events per 10 minutes,
4. writes one row to `click_events`,
5. sends one server-to-server `contact_click` event to PostHog.

No raw IP or phone number is stored. `visitor_hash` is a daily-salted SHA-256
of the connecting IP and is also used as the PostHog `distinct_id`.

## Admin table

Open `https://www.hexescortsug.com/hx-ctrl-7k9`, sign in, then select the
**Contact analytics** tab. enter the analytics access key
(the `HX_ADMIN_KEY` Worker secret) and click **Unlock**. The table shows
WhatsApp taps, call taps, phone copies, total, and last-contact time per escort,
with 7 / 30 / 90-day filters and a refresh button.

The key is a Worker secret and is never committed. The admin API is
`GET /api/admin/clicks?days=7|30|90` with `Authorization: Bearer <key>`;
all responses are `no-store`. Without the key it returns 401.

## PostHog event schema

Event name: `contact_click`

| Property | Example | Purpose |
|---|---|---|
| `profile_id` | `9615e92a-…` | per-escort grouping |
| `profile_name` | `Anita` | readable label |
| `channel` | `whatsapp` \| `call` \| `phone_copy` | breakdown by intent |
| `surface` | `card` \| `detail` \| `carousel` | where the tap happened |
| `location` | `Kampala / Nakasero` | derived from the page path |
| `path` | `/escorts-in/kampala/nakasero` | clicks by location page |
| `device` | `mobile` \| `desktop` \| `tablet` | device breakdown |
| `$device_type` | `Mobile` | PostHog's standard device property |
| `$current_url` | full URL | standard URL breakdown |

Events are sent from the Worker (`/i/v0/e/`), not from the browser. This avoids
double counting and survives ad blockers / tracker-blocking browser settings.

## Creating the PostHog dashboard

The public project key cannot create dashboards; a PostHog **personal API key**
(or the UI) is required. In the PostHog UI:

1. **Dashboards → New Dashboard** → name it `Hex — Contact Clicks`.
2. Add these insights (event = `contact_click` for all three):
   - **Contact clicks by escort** — trend or bar chart, breakdown by
     `profile_name`, aggregate = count.
   - **Contact clicks by location page** — bar chart, breakdown by `path`
     (or `location` for a cleaner city-level view).
   - **Contact clicks by device and channel** — bar chart, breakdown by
     `$device_type`, then by `channel` as a secondary breakdown.
3. Optional fourth insight: **Contact intent over time** — trend, grouped by
   `channel`, last 30 days.

All insights use the same event, so a single saved view can be duplicated and
re-broken-down quickly.

## Verification checklist

- `POST /api/clicks` with a live `profileId` → `200 {"ok":true}`.
- Repeating the same kind within 30s → `{"deduped":true}`, no new D1 row.
- Bad `kind`/`surface` → 400; unknown profile → 404.
- `GET /api/admin/clicks` without key → 401; with key → 200 + `no-store`.
- Admin tab renders totals and per-escort rows after entering the key.
- PostHog project activity shows `contact_click` with `channel`, `path`,
  `device` properties (verify in the UI once a personal API key is available;
  direct ingestion was confirmed with `{"status":"Ok"}` from `/i/v0/e/`).
