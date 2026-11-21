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
with **Today / Yesterday / Last 7 days / Last 30 days** filters and a refresh button.

The key is a Worker secret and is never committed. The admin API is
`GET /api/admin/clicks?range=today|yesterday|7d|30d` with
`Authorization: Bearer <key>`; all responses are `no-store`. Without the key it
returns 401. Today and Yesterday use Africa/Kampala (UTC+3) calendar-day
boundaries and return an explicit `since`/`until` window; 7d/30d are rolling
windows. The legacy `days=7|30` query param is still accepted for older tabs.

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

## PostHog dashboard (simplified 2026-11-22)

Dashboard **`Hex - Contact Analytics`** (id `2393932`) in PostHog project
`385893` now mirrors the admin Contact analytics tab. Open:
`https://us.posthog.com/project/385893/dashboard/2393932`

It has two sections and six tiles (last 30 days, event `contact_click`):

| Section | Tile | Definition |
|---|---|---|
| Overview | Total contacts | all `contact_click` events |
| Overview | WhatsApp taps | `channel = whatsapp` |
| Overview | Call taps (mobile) | `channel = call` |
| Overview | Phone copies (desktop) | `channel = phone_copy` |
| Overview | Escorts contacted | distinct `profile_name` |
| Per escort | Per-escort contacts | HogQL table: escort, whatsapp, calls, copies, total, last_contact |

The five overview tiles use the **BoldNumber** display so they read like the
admin stat cards; the per-escort tile is a real table with the same columns as
the admin table. The noisy trend/breakdown charts from the first version were
removed (old insights were soft-deleted, not just unlinked). Device/location
exploration is still possible from PostHog's event explorer when needed.

## Verification checklist

- `POST /api/clicks` with a live `profileId` → `200 {"ok":true}`.
- Repeating the same kind within 30s → `{"deduped":true}`, no new D1 row.
- Bad `kind`/`surface` → 400; unknown profile → 404.
- `GET /api/admin/clicks` without key → 401; with key → 200 + `no-store`.
- Admin tab renders totals and per-escort rows after entering the key.
- PostHog project activity shows `contact_click` with `channel`, `path`,
  `device` properties — VERIFIED 2026-11-22 via the PostHog REST API: 17 events
  present, escort breakdown returns 14 labels, device+channel breakdown returns
  `Mobile | whatsapp`, `Mobile | call`, `Desktop | whatsapp`, `Desktop | phone_copy`.
  Direct ingestion also returned `{"status":"Ok"}` from `/i/v0/e/`.
- Simplified dashboard verified via the PostHog query API: all six tiles return
  data (47 total, 38 WhatsApp, 10 calls, 1 phone copy, 34 distinct escorts, and
  a 37-row per-escort table with all six columns).
