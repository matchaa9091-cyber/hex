import { staticProfiles } from "@/data/staticProfiles";
import {
  CITY_AREAS,
  KAMPALA_AREAS,
  locationMatches,
  normalizeLocation,
} from "@/lib/locationMatcher";

// Cities that appear in the sitemap but do not yet have detailed suburb data.
const EXTRA_SITEMAP_CITIES = new Set([
  "busia", "mubende", "lugazi", "mityana", "bombo", "kitgum", "kotido", "moroto",
]);

// Real locations already present in the directory, including Greater Kampala
// areas that are not part of the curated suburb lists (for example Kitende).
const STATIC_LOCATION_SLUGS = new Set(
  staticProfiles
    .map((profile) => normalizeLocation(profile.location))
    .filter(Boolean)
    .map((location) => location.replace(/\s+/g, "-"))
);

/**
 * Decide whether a location URL is a real, indexable place. Unknown location
 * URLs still render a 200 page with travel/outcall companions, but are marked
 * noindex so they do not create thin duplicate pages in search results.
 */
export function isKnownLocation(city?: string | null, suburb?: string | null): boolean {
  const normCity = normalizeLocation(city);
  if (!normCity) return false;

  const cityAreas = CITY_AREAS[normCity] || CITY_AREAS[normCity.replace(/\s+/g, "-")];
  const isKampalaArea = KAMPALA_AREAS.some((area) => locationMatches(normCity, area));
  const isStaticLocation = STATIC_LOCATION_SLUGS.has(normCity.replace(/\s+/g, "-"));
  const isKnownCity =
    Boolean(cityAreas) || EXTRA_SITEMAP_CITIES.has(normCity) || isKampalaArea || isStaticLocation;

  const normSuburb = normalizeLocation(suburb);
  if (!normSuburb) return isKnownCity;

  const areas = cityAreas || KAMPALA_AREAS;
  return isKnownCity && areas.some((area) => locationMatches(normSuburb, area));
}
