import type { ProfileCategoryType, ProfileType } from "@/types/profile";

export type { ProfileCategoryType } from "@/types/profile";

export const PROFILE_TYPE_VALUES: ProfileCategoryType[] = ["escort", "spa", "agency"];

export const PROFILE_TYPE_OPTIONS: Array<{
  value: ProfileCategoryType;
  label: string;
  description: string;
}> = [
  { value: "escort", label: "Escort", description: "Individual companion profile" },
  { value: "spa", label: "Spa", description: "Spa or massage venue" },
  { value: "agency", label: "Escort Agency", description: "Agency with multiple companions" },
];

type LegacyProfileShape = {
  name?: string | null;
  isAd?: boolean | number | string | null;
  adImages?: unknown;
};

/**
 * Resolve a durable profile type. Explicit saved values always win; only rows
 * that have never been saved through the type selector use the legacy
 * name/ad-based spa heuristic, preserving their current public appearance.
 */
export function normalizeProfileType(
  value: unknown,
  fallback: LegacyProfileShape = {}
): ProfileCategoryType {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "escort" || normalized === "spa" || normalized === "agency") {
      return normalized;
    }
  }

  const isLegacySpa =
    (fallback.name || "").toLowerCase().includes("spa") ||
    Boolean(fallback.isAd) ||
    fallback.isAd === 1 ||
    fallback.isAd === "1" ||
    fallback.isAd === "true" ||
    (Array.isArray(fallback.adImages) && fallback.adImages.length > 0);

  return isLegacySpa ? "spa" : "escort";
}

export function getProfileType(profile: ProfileType | LegacyProfileShape & { profileType?: unknown }): ProfileCategoryType {
  return normalizeProfileType((profile as { profileType?: unknown })?.profileType, profile);
}

export const PROFILE_TYPE_PAGES: Record<
  ProfileCategoryType,
  {
    path: string;
    breadcrumb: string;
    title: string;
    description: string;
    keywords: string;
    heading: string;
    intro: string;
    gridTitle: string;
    empty: string;
    schemaName: string;
    schemaType: "Person" | "HealthClub" | "Organization";
  }
> = {
  escort: {
    path: "/escorts-in",
    breadcrumb: "Escorts in Uganda",
    title: "Escorts in Uganda | Verified Kampala Companions",
    description:
      "Browse verified independent escorts and companions in Kampala and across Uganda, with direct WhatsApp contact details.",
    keywords: "escorts in uganda, uganda escorts, kampala escorts, verified companions uganda, hex escorts",
    heading: "Verified Escorts in Uganda",
    intro:
      "Independent companions across Kampala and Uganda. Open a profile to see photos, details and direct contact options.",
    gridTitle: "Escort profiles",
    empty: "No escort profiles are currently active. Check back soon.",
    schemaName: "Escorts in Uganda",
    schemaType: "Person",
  },
  spa: {
    path: "/spas",
    breadcrumb: "Spas in Uganda",
    title: "Spas in Uganda | Verified Massage & Wellness Spas",
    description:
      "Browse verified spas and massage venues in Kampala and across Uganda, with direct booking and WhatsApp contact details.",
    keywords: "spas in uganda, massage kampala, wellness spas kampala, uganda spa directory, hex escorts",
    heading: "Spas in Uganda",
    intro:
      "Verified spa and massage venues across Uganda. Open a venue profile to see its rooms, services and direct booking contact.",
    gridTitle: "Spa profiles",
    empty: "No spa profiles are currently active. Check back soon.",
    schemaName: "Spas in Uganda",
    schemaType: "HealthClub",
  },
  agency: {
    path: "/escorts-agency",
    breadcrumb: "Escort Agencies in Uganda",
    title: "Escort Agencies in Uganda | Verified Kampala Agencies",
    description:
      "Browse verified escort agencies in Kampala and across Uganda, with direct WhatsApp contact details and agency profiles.",
    keywords: "escort agencies uganda, kampala escort agency, uganda agencies, companion agencies kampala, hex escorts",
    heading: "Escort Agencies in Uganda",
    intro:
      "Verified agencies and companion collectives across Uganda. Open an agency profile to see its details and direct booking contact.",
    gridTitle: "Escort agency profiles",
    empty: "No escort agency profiles are currently active. Check back soon.",
    schemaName: "Escort Agencies in Uganda",
    schemaType: "Organization",
  },
};
