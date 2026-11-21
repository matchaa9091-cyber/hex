-- Per-escort contact-intent tracking.
-- One row per accepted WhatsApp tap, mobile tel: tap, or desktop phone copy.
-- No raw IP, phone number, or personal data is stored: visitor_hash is a
-- daily-salted hash of the connecting IP, used only for short-window dedupe.
CREATE TABLE IF NOT EXISTS click_events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id   TEXT NOT NULL,
  kind         TEXT NOT NULL CHECK (kind IN ('whatsapp', 'call', 'phone_copy')),
  surface      TEXT NOT NULL CHECK (surface IN ('card', 'detail', 'carousel', 'gallery', 'drawer', 'other')),
  path         TEXT,
  visitor_hash TEXT,
  created_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_click_events_profile_time
  ON click_events (profile_id, created_at);
CREATE INDEX IF NOT EXISTS idx_click_events_time
  ON click_events (created_at);
CREATE INDEX IF NOT EXISTS idx_click_events_visitor_time
  ON click_events (visitor_hash, created_at);
