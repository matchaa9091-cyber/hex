/**
 * sync_d1_slim.mjs
 * Ultra-slim static profile bundle for server-side rendering.
 * Only keeps fields needed for SSR location matching + card display.
 * Heavy data (images, videos, services, bio, description) loads client-side from /api/profiles.
 */
import fs from 'fs';

const accountId = 'b07234f65853d0f9f8e6fa1896cf06db';
const databaseId = '9914bf44-9661-4a24-903f-d49c73d6b1fe';
const token = process.env.CLOUDFLARE_D1_TOKEN || '';

async function fetchFromD1() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Only select minimum fields needed for SSR
      sql: 'SELECT id, name, age, location, rating, profile_image, is_pinned, is_archived, is_vip, is_premium, is_ad, is_verified, body_type, complexion, height, phone, whatsapp FROM profiles WHERE is_archived = 0 ORDER BY is_pinned DESC, rating DESC;'
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`D1 API failed (${response.status}): ${errText}`);
  }

  const json = await response.json();
  const results = json.result?.[0]?.results || [];
  console.log(`Fetched ${results.length} active profiles from Cloudflare D1.`);

  const R2_PUBLIC_BASE = 'https://pub-aa01e6dca81f482ab084275e93025a99.r2.dev';

  function transformUrl(url) {
    if (!url) return '/placeholder.svg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/storage/profile-images/')) return `${R2_PUBLIC_BASE}${url}`;
    if (url.startsWith('/profile-images/')) return `${R2_PUBLIC_BASE}${url}`;
    if (url.startsWith('/')) return url;
    const match = url.match(/([a-zA-Z0-9.\-_]+\.(?:jpg|jpeg|png|webp|jfif|avif|mp4|mov))/i);
    if (match && match[1]) return `${R2_PUBLIC_BASE}/storage/profile-images/${match[1]}`;
    return url;
  }

  const mapped = results.map(p => ({
    id: String(p.id),
    name: p.name,
    age: p.age ?? undefined,
    height: p.height ?? undefined,
    bodyType: p.body_type ?? undefined,
    complexion: p.complexion ?? undefined,
    location: p.location,
    rating: Number(p.rating) || 4.5,
    profileImage: transformUrl(p.profile_image),
    // Keep only profileImage in images[] — single entry, tiny
    images: [transformUrl(p.profile_image)],
    shortBio: '',
    description: '',
    phone: p.phone ?? undefined,
    whatsapp: p.whatsapp ?? undefined,
    email: undefined,
    instagram: undefined,
    services: [],
    videos: [],
    reviews: [],
    isPinned: Boolean(p.is_pinned),
    isArchived: Boolean(p.is_archived),
    isVip: Boolean(p.is_vip),
    isPremium: Boolean(p.is_premium),
    isAd: Boolean(p.is_ad),
    isVerified: Boolean(p.is_verified),
    adImages: [],
  }));

  const fileContent = `import { ProfileType } from "@/types/profile";\n\n// SLIM static bundle for server-side rendering only.\n// Only id, name, age, location, rating, profileImage, flags are stored here.\n// All heavy data (images[], videos[], services[], bio, description) loads client-side from /api/profiles.\nexport const staticProfiles: ProfileType[] = ${JSON.stringify(mapped, null, 2)};\n`;

  const beforeSize = fs.existsSync('src/data/staticProfiles.ts')
    ? fs.statSync('src/data/staticProfiles.ts').size
    : 0;

  fs.writeFileSync('src/data/staticProfiles.ts', fileContent, 'utf8');

  const afterSize = fs.statSync('src/data/staticProfiles.ts').size;
  const reduction = beforeSize > 0 ? Math.round((1 - afterSize / beforeSize) * 100) : 0;
  console.log(`staticProfiles.ts: ${Math.round(beforeSize / 1024)}KB → ${Math.round(afterSize / 1024)}KB (${reduction}% reduction)`);
  console.log(`Saved ${mapped.length} profiles.`);
}

fetchFromD1().catch(e => {
  console.error('Sync failed:', e);
  process.exit(1);
});
