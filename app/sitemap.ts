import { MetadataRoute } from 'next';
import { staticProfiles } from '@/data/staticProfiles';
import { fetchAllProfiles } from '@/data/allProfiles';
import { CITY_AREAS, KAMPALA_AREAS } from '@/lib/locationMatcher';
import { CITY_SEO } from '@/data/locationSeo';

// Render on every request so profile edits/new profiles are reflected in
// lastmod immediately. The worker edge cache (keyed by DO generation) still
// absorbs repeat traffic; a successful write bumps the generation and the next
// sitemap request is a MISS that re-renders with fresh D1 data.
export const revalidate = 0;

const BASE_URL = 'https://www.hexescortsug.com';
const FALLBACK_LASTMOD = '2026-05-09T00:00:00.000Z';

// Fixed page dates: these only change when the corresponding page is edited.
const STATIC_LASTMOD = {
  home: '2026-11-17T00:00:00.000Z',
  about: '2026-11-10T00:00:00.000Z',
  faq: '2026-11-05T00:00:00.000Z',
  becomeEscort: '2026-11-10T00:00:00.000Z',
  vip: '2026-11-17T00:00:00.000Z',
  escortsIn: '2026-11-17T00:00:00.000Z',
  categories: '2026-11-17T00:00:00.000Z',
} as const;

// Keep sitemap city/suburb URLs aligned with the matcher and UI links. This
// prevents suburb names such as Zana or Namugongo becoming duplicate "city"
// pages alongside /escorts-in/kampala/<suburb>.
const cities = [
  'entebbe', 'jinja', 'mbarara', 'gulu', 'fort-portal', 'mbale', 'tororo', 'mukono',
  'masaka', 'arua', 'lira', 'kasese', 'hoima', 'soroti', 'wakiso', 'kabale', 'busia',
  'mubende', 'lugazi', 'mityana', 'bombo', 'kitgum', 'kotido', 'moroto'
];

const kampalaSuburbs = KAMPALA_AREAS.filter((area) => area !== 'kampala');

const slugify = (text: string) => text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

function toIso(value: unknown): string {
  if (!value) return FALLBACK_LASTMOD;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? FALLBACK_LASTMOD : value.toISOString();
  }
  const raw = String(value).trim();
  if (!raw) return FALLBACK_LASTMOD;
  // D1 created_at is stored as "YYYY-MM-DD HH:MM:SS".
  const normalised = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)
    ? `${raw.replace(' ', 'T')}Z`
    : raw;
  const date = new Date(normalised);
  return Number.isNaN(date.getTime()) ? FALLBACK_LASTMOD : date.toISOString();
}

function toMs(value: unknown): number {
  return new Date(toIso(value)).getTime();
}

function later(a: unknown, b: unknown): string {
  return toMs(a) >= toMs(b) ? toIso(a) : toIso(b);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch Profiles from Cloudflare D1
  let activeProfiles: any[] = [];
  try {
    const d1Profiles = await fetchAllProfiles(undefined, true);
    if (d1Profiles && d1Profiles.length > 0) {
      activeProfiles = d1Profiles;
    } else {
      activeProfiles = staticProfiles.filter(p => !p.isArchived);
    }
  } catch (e) {
    activeProfiles = staticProfiles.filter(p => !p.isArchived);
  }

  // Home, VIP, the location hub and category hubs all render profile data.
  // Move their lastmod to the most recent profile add/edit so Google sees a
  // fresh modification date after every write, not a stale fixed date.
  const latestProfileChange = activeProfiles.reduce((latest, p) => {
    const ms = toMs(p.updatedAt || p.createdAt);
    return ms > latest ? ms : latest;
  }, 0);
  const profileDrivenLastMod = (fixed: string) =>
    new Date(later(fixed, new Date(latestProfileChange).toISOString()));

  // Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: profileDrivenLastMod(STATIC_LASTMOD.home), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(STATIC_LASTMOD.about), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(STATIC_LASTMOD.faq), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/become-escort`, lastModified: new Date(STATIC_LASTMOD.becomeEscort), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/vip`, lastModified: profileDrivenLastMod(STATIC_LASTMOD.vip), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/escorts-in`, lastModified: profileDrivenLastMod(STATIC_LASTMOD.escortsIn), changeFrequency: 'weekly', priority: 0.85 },
    ...['massage', 'slim', 'curvy', 'thick'].map((category) => ({
      url: `${BASE_URL}/category/${category}`,
      lastModified: profileDrivenLastMod(STATIC_LASTMOD.categories),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ];

  const activeCities = new Set<string>();
  const activeSuburbs = new Set<string>();
  const activeCategoryCities = new Set<string>();
  const profileUrlMap = new Map<string, MetadataRoute.Sitemap[number]>();
  const locationLastMod = new Map<string, string>();
  const suburbLastMod = new Map<string, string>();
  const categoryLastMod = new Map<string, string>();

  activeProfiles.forEach(p => {
    const profileLastMod = toIso(p.updatedAt || p.createdAt);
    const profileLoc = (p.location || p.location === '' ? p.location : '').toLowerCase().trim();
    if (!profileLoc) return;

    let matchedCity = '';
    let matchedSuburb = '';

    // Check Kampala Suburbs first
    const foundSuburb = kampalaSuburbs.find(sub => profileLoc.includes(sub) || sub.includes(profileLoc));
    if (foundSuburb) {
      matchedCity = 'kampala';
      matchedSuburb = foundSuburb;
    } else {
      // Check other cities against their known suburbs/aliases.
      const foundCity = cities.find((c) => {
        const areas = CITY_AREAS[c] || [c];
        return areas.some((area) => profileLoc.includes(area) || area.includes(profileLoc));
      });
      if (foundCity) {
        matchedCity = foundCity;
      } else if (profileLoc.includes('kampala')) {
        matchedCity = 'kampala';
      } else {
        matchedCity = slugify(profileLoc);
      }
    }

    if (matchedCity) {
      activeCities.add(matchedCity);
      locationLastMod.set(matchedCity, later(locationLastMod.get(matchedCity) || FALLBACK_LASTMOD, profileLastMod));
    }
    if (matchedSuburb) {
      activeSuburbs.add(matchedSuburb);
      suburbLastMod.set(matchedSuburb, later(suburbLastMod.get(matchedSuburb) || FALLBACK_LASTMOD, profileLastMod));
    }

    // Build categories for this profile
    const categories: string[] = [];
    const bodyType = (p.body_type || p.bodyType || '').toLowerCase();
    if (bodyType.includes('slim')) categories.push('slim');
    if (bodyType.includes('curvy')) categories.push('curvy');
    if (bodyType.includes('thick')) categories.push('thick');

    if (p.is_vip || p.isVip || p.is_pinned || p.isPinned) categories.push('vip');

    const services = p.services || [];
    if (services.some((s: string) => s.toLowerCase().includes('massage'))) {
      categories.push('massage');
    }

    categories.forEach(cat => {
      if (matchedCity) {
        const categoryKey = `${cat}-escorts-in/${matchedCity}`;
        activeCategoryCities.add(categoryKey);
        categoryLastMod.set(categoryKey, later(categoryLastMod.get(categoryKey) || FALLBACK_LASTMOD, profileLastMod));
      }
    });

    const profileSlug = slugify(p.name);
    const existing = profileUrlMap.get(profileSlug);
    if (!existing) {
      profileUrlMap.set(profileSlug, {
        url: `${BASE_URL}/profile/${profileSlug}`,
        lastModified: new Date(profileLastMod),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }
  });

  // 3. Active Location Pages. Curated cities with shared editorial content are
  // always included, even when no profile is currently based there, because
  // they are legitimate travel/outcall landing pages.
  const curatedCities = new Set(
    Object.keys(CITY_SEO).map((key) => key.replace(/\s+/g, '-'))
  );
  const sitemapCities = new Set<string>([
    ...Array.from(activeCities),
    ...Array.from(curatedCities),
  ]);
  const locationUrls: MetadataRoute.Sitemap = Array.from(sitemapCities).map(city => ({
    url: `${BASE_URL}/escorts-in/${city}`,
    lastModified: new Date(locationLastMod.get(city) || STATIC_LASTMOD.escortsIn),
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  // 4. Active Suburb Pages
  const suburbUrls: MetadataRoute.Sitemap = Array.from(activeSuburbs).map(suburb => ({
    url: `${BASE_URL}/escorts-in/kampala/${slugify(suburb)}`,
    lastModified: new Date(suburbLastMod.get(suburb) || FALLBACK_LASTMOD),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 5. Active Category Pages
  const categoryUrls: MetadataRoute.Sitemap = Array.from(activeCategoryCities).map(path => ({
    url: `${BASE_URL}/${path}`,
    lastModified: new Date(categoryLastMod.get(path) || FALLBACK_LASTMOD),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const profileUrls = Array.from(profileUrlMap.values());
  return [...staticPages, ...locationUrls, ...suburbUrls, ...categoryUrls, ...profileUrls];
}
