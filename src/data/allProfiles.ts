import { ProfileType } from "@/types/profile";
import { mockProfiles } from "@/data/mockProfiles";
import { staticProfiles } from "@/data/staticProfiles";
import { slugify } from "@/lib/utils";
import { matchProfilesByLocation } from '@/lib/locationMatcher';

// Set this to true ONLY if you want to bypass Supabase entirely and use static data
const FORCE_STATIC_DATA = false;

export function createSeededRand(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296;
  };
}

export function shuffleArray<T>(array: T[], rand?: () => number): T[] {
  const arr = [...array];
  const r = rand || Math.random;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function sortAndShuffleProfiles(profiles: ProfileType[], seed?: string): ProfileType[] {
  if (!seed) return profiles;
  const rand = createSeededRand(seed);
  const pinned = profiles.filter(p => p.isPinned);
  const regular = profiles.filter(p => !p.isPinned);
  return [...shuffleArray(pinned, rand), ...shuffleArray(regular, rand)];
}

const R2_PUBLIC_BASE = "https://pub-aa01e6dca81f482ab084275e93025a99.r2.dev";

/**
 * Transforms ANY image reference to Cloudflare R2 Public CDN / local static path.
 */
function transformUrl(url: string | null | undefined): string {
  if (!url) return "/placeholder.svg";

  // Full HTTP/HTTPS URLs (including R2 CDN URLs) — keep exact URL as-is
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  // Relative storage paths
  if (url.startsWith("/storage/profile-images/")) {
    return `${R2_PUBLIC_BASE}${url}`;
  }
  if (url.startsWith("/profile-images/")) {
    return `${R2_PUBLIC_BASE}${url}`;
  }
  if (url.startsWith("/storage/")) {
    return `${R2_PUBLIC_BASE}${url}`;
  }

  // Root-relative paths (like /placeholder.svg) — keep as-is
  if (url.startsWith("/")) return url;

  // Extract filename from any string filename
  const match = url.match(/([a-zA-Z0-9.\-_]+\.(?:jpg|jpeg|png|webp|jfif|avif|mp4|mov))/i);
  if (match && match[1]) {
    return `${R2_PUBLIC_BASE}/storage/profile-images/${match[1]}`;
  }

  return url;
}

/**
 * Get active (non-archived) static profiles to use as offline fallback.
 */
function getActiveStaticProfiles() {
  return staticProfiles.filter(p => !p.isArchived);
}

function mapDbProfile(p: any): ProfileType {
  const images = (typeof p.images === "string" ? JSON.parse(p.images) : (p.images || [])).map(transformUrl);
  const adImages = (typeof p.ad_images === "string" ? JSON.parse(p.ad_images) : (p.ad_images || [])).map(transformUrl);
  const hasAdImgs = adImages.length > 0;

  return {
    id: String(p.id),
    name: p.name,
    age: p.age ?? undefined,
    height: p.height ?? undefined,
    bodyType: p.body_type ?? undefined,
    complexion: p.complexion ?? undefined,
    location: p.location,
    rating: Number(p.rating) || 4.5,
    profileImage: transformUrl(p.profile_image || (images.length > 0 ? images[0] : null)),
    images: images.length > 0 ? images : [transformUrl(p.profile_image)],
    shortBio: p.short_bio || "",
    description: p.description || "",
    phone: p.phone ?? undefined,
    whatsapp: p.whatsapp ?? undefined,
    email: p.email ?? undefined,
    instagram: p.instagram ?? undefined,
    services: typeof p.services === "string" ? JSON.parse(p.services) : (p.services || []),
    videos: (typeof p.videos === "string" ? JSON.parse(p.videos) : (p.videos || [])).map(transformUrl),
    reviews: [],
    isPinned: Boolean(p.is_pinned),
    isArchived: Boolean(p.is_archived),
    isVip: Boolean(p.is_vip),
    isPremium: Boolean(p.is_premium),
    isAd: Boolean(p.is_ad || hasAdImgs),
    isVerified: Boolean(p.is_verified),
    adImages,
  };
}

const ACCOUNT_ID = process.env.CLOUDFLARE_D1_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || "b07234f65853d0f9f8e6fa1896cf06db";
const DB_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || "9914bf44-9661-4a24-903f-d49c73d6b1fe";
const D1_TOKEN = process.env.CLOUDFLARE_D1_TOKEN;

async function fetchProfilesDirectFromD1(): Promise<ProfileType[] | null> {
  if (!D1_TOKEN) return null;

  try {
    const D1_URI = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`;
    const res = await fetch(D1_URI, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${D1_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: "SELECT * FROM profiles WHERE is_archived = 0 ORDER BY is_pinned DESC, created_at DESC;",
        params: [],
      }),
      signal: AbortSignal.timeout(2500),
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (data.success && data.result?.[0]?.results) {
      return data.result[0].results.map(mapDbProfile);
    }
  } catch (e) {
    console.error("Direct D1 query error in fetchProfilesDirectFromD1:", e);
  }
  return null;
}

async function fetchSingleProfileDirectFromD1(idOrSlug: string): Promise<ProfileType | null> {
  if (!D1_TOKEN) return null;

  try {
    const D1_URI = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`;
    const res = await fetch(D1_URI, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${D1_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: "SELECT * FROM profiles WHERE id = ? OR lower(name) = ? OR lower(replace(name, ' ', '-')) = ? LIMIT 1;",
        params: [idOrSlug, idOrSlug.toLowerCase(), idOrSlug.toLowerCase()],
      }),
      signal: AbortSignal.timeout(2000),
      next: { revalidate: 30 },
    });
    const data = await res.json();
    if (data.success && data.result?.[0]?.results?.[0]) {
      return mapDbProfile(data.result[0].results[0]);
    }
  } catch (e) {
    console.error("Single profile direct D1 query error:", e);
  }
  return null;
}

export async function fetchAllProfiles(seed?: string) {
  const fallback = getActiveStaticProfiles();

  // On the server, attempt to fetch fresh profiles from D1 (cached for 60s via Next.js ISR).
  // If D1 is reachable, use the live data; otherwise immediately use the static fallback.
  if (typeof window === "undefined") {
    try {
      const d1Profiles = await fetchProfilesDirectFromD1();
      if (d1Profiles && d1Profiles.length > 0) {
        return seed ? sortAndShuffleProfiles(d1Profiles, seed) : d1Profiles;
      }
    } catch (e) {
      console.warn("Direct D1 server fetch failed, using static fallback:", e);
    }
    return seed ? sortAndShuffleProfiles(fallback, seed) : fallback;
  }

  // On the client, fetch live profiles from the D1 API endpoint with no-store
  try {
    const apiRes = await fetch("/api/profiles", {
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (apiRes.ok) {
      const d1Profiles = await apiRes.json();
      if (Array.isArray(d1Profiles) && d1Profiles.length > 0) {
        const mapped = d1Profiles.map((p: any) => ({
          ...p,
          profileImage: transformUrl(p.profileImage),
          images: Array.isArray(p.images) ? p.images.map(transformUrl) : [],
          videos: Array.isArray(p.videos) ? p.videos.map(transformUrl) : [],
          adImages: Array.isArray(p.adImages) ? p.adImages.map(transformUrl) : [],
        }));
        return seed ? sortAndShuffleProfiles(mapped, seed) : mapped;
      }
    }
  } catch (e) {
    console.warn("Client D1 API fetch failed, using fallback:", e);
  }

  return seed ? sortAndShuffleProfiles(fallback, seed) : fallback;
}

export async function fetchProfileById(id: string) {
  const fallbackProfiles = getActiveStaticProfiles();
  const normalizedTarget = decodeURIComponent(id).toLowerCase().trim();
  const targetSlug = slugify(normalizedTarget);

  // 1. Try finding in allProfiles (fresh D1 or static fallback)
  try {
    const allProfiles = await fetchAllProfiles();
    const match = allProfiles.find((p: ProfileType) => 
      p.id === id || 
      slugify(p.name) === id || 
      p.name.toLowerCase().trim() === normalizedTarget ||
      slugify(p.name) === targetSlug
    );
    if (match) return match;
  } catch (err) {
    console.error("Fetch exception in fetchProfileById:", err);
  }

  // 2. Query D1 directly for this specific ID or slug (handles newly created profiles immediately!)
  try {
    const directMatch = await fetchSingleProfileDirectFromD1(id);
    if (directMatch) return directMatch;
    if (targetSlug !== id) {
      const slugMatch = await fetchSingleProfileDirectFromD1(targetSlug);
      if (slugMatch) return slugMatch;
    }
  } catch (err) {
    console.error("Direct D1 query in fetchProfileById failed:", err);
  }

  // 3. Fallback to staticProfiles
  return fallbackProfiles.find(p => 
    p.id === id || 
    slugify(p.name) === id || 
    p.name.toLowerCase().trim() === normalizedTarget ||
    slugify(p.name) === targetSlug
  ) || null;
}

// Smart & Fuzzy Fetcher for Location Pages using Cloudflare D1
export async function fetchProfilesByLocation(city: string, suburb?: string) {
  const fallbackAll = getActiveStaticProfiles();
  const fallbackResult = matchProfilesByLocation(fallbackAll, city, suburb);

  try {
    const allProfiles = await fetchAllProfiles();
    const result = matchProfilesByLocation(allProfiles, city, suburb);
    return result.profiles.length > 0 ? result.profiles : fallbackResult.profiles;
  } catch (err) {
    console.error(`Error fetching profiles for ${city} ${suburb || ''}:`, err);
    return fallbackResult.profiles;
  }
}
