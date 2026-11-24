-- Durable entity taxonomy for public Spa and Escort Agency listings.
-- NULL means "never explicitly typed"; readers use the legacy name/ad fallback
-- so existing profiles keep their current public appearance until an admin
-- saves a type from the profile editor.
ALTER TABLE profiles ADD COLUMN profile_type TEXT CHECK (profile_type IN ('escort', 'spa', 'agency'));

CREATE INDEX IF NOT EXISTS idx_profiles_profile_type ON profiles (profile_type);
