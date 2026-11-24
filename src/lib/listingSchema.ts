import type { ProfileType } from "@/types/profile";
import { matchProfilesByLocation } from "@/lib/locationMatcher";
import { slugify } from "@/lib/utils";

const BASE_URL = "https://www.hexescortsug.com";
const MAX_ITEM_LIST_ENTRIES = 20;

// Mirrors the category filter in LocationPage so listing schema reflects the
// same visible profiles without an extra data request.
export function matchesCategory(profile: ProfileType, category?: string): boolean {
  if (!category) return true;

  const cat = category.toLowerCase().replace(/-/g, " ");
  const bodyTypeMatch =
    profile.bodyType?.toLowerCase() === cat || Boolean(profile.bodyType?.toLowerCase().includes(cat));
  const serviceMatch = profile.services?.some((service) => service.toLowerCase().includes(cat));
  const vipMatch = cat === "vip" || cat === "premium" ? Boolean(profile.isVip || profile.isPinned) : false;

  return Boolean(bodyTypeMatch || serviceMatch || vipMatch);
}

// Pure in-memory filtering over profiles the page already fetched. It does not
// add any D1 or API calls to the render path.
export function getListingProfiles(
  profiles: ProfileType[],
  city?: string,
  suburb?: string,
  category?: string
): ProfileType[] {
  const matched = matchProfilesByLocation(profiles, city, suburb).profiles;
  return category ? matched.filter((profile) => matchesCategory(profile, category)) : matched;
}

export function buildItemListSchema(
  profiles: ProfileType[],
  name: string,
  schemaType: "Person" | "HealthClub" | "Organization" = "Person"
) {
  const items = profiles.filter((profile) => profile.name).slice(0, MAX_ITEM_LIST_ENTRIES);
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "numberOfItems": items.length,
    "itemListElement": items.map((profile, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": schemaType,
        "name": profile.name,
        "url": `${BASE_URL}/profile/${slugify(profile.name)}`,
        ...(profile.profileImage ? { image: profile.profileImage } : {}),
      },
    })),
  };
}
