import { ProfileType } from "@/types/profile";

export function normalizeLocation(s?: string | null): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/[-_,/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * All known Kampala divisions, suburbs, and surrounding metro areas.
 * Any profile with a location matching any of these belongs to the Greater Kampala metropolitan area.
 */
export const KAMPALA_AREAS: string[] = [
  "banda", "bugolobi", "bukesa", "bukoto", "bunamwaya", "bunga",
  "busega", "buwate", "buwaate", "buziga", "bwaise", "central", "ggaba", "gaba",
  "kabalagala", "kabowa", "kampala", "kampala town", "old kampala", "kamwokya",
  "kansanga", "kanyanya", "kasubi", "katooke", "kawempe", "kazo", "kibuli",
  "kireka", "kirinnya", "kisaasi", "kisugu", "kitintale", "kiwatule", "kololo",
  "komamboga", "kulambiro", "kyaliwajjala", "kyambogo", "kyanja", "kyebando",
  "lubaga", "rubaga", "lugala", "lugogo", "lungujja", "luzira", "makerere",
  "makindye", "makyindye", "masajja", "masanafu", "mawanda road", "mbuya",
  "mengo", "mpererwe", "mulago", "munyonyo", "mutundwe", "mutungo", "muyenga",
  "naalya", "nabulagala", "nabweru", "naguru", "najjanankumbi", "najjera",
  "nakasero", "nakawa", "nakulabye", "nankulabye", "namasuba", "namirembe",
  "namungoona", "namuwongo", "nateete", "nkuba", "nsambya", "ntinda",
  "salaama", "salaama rd", "sir apollo kagwa", "wandegeya", "kalerwe", "kira",
  "zana", "seguku", "ndejje"
];

/**
 * Known areas/sub-locations for major Ugandan cities and districts.
 */
export const CITY_AREAS: Record<string, string[]> = {
  entebbe: [
    "entebbe", "entebbe road", "kajjansi", "kitende", "katabi", "abaita",
    "nkumba", "zana", "seguku", "namasuba", "lubowa"
  ],
  mukono: [
    "mukono", "seeta", "seeta mukono", "mbalala", "kyetume", "goma", "nama"
  ],
  jinja: [
    "jinja", "njeru", "bugembe", "kakira", "walukuba", "mbuya jinja"
  ],
  mbarara: [
    "mbarara", "kakoba", "kakyeka", "kamukuzi", "biharwe"
  ],
  "fort portal": [
    "fort portal", "fort-portal", "kabarole", "toro", "kasese"
  ],
  "fort-portal": [
    "fort portal", "fort-portal", "kabarole", "toro", "kasese"
  ],
  gulu: [
    "gulu", "layibi", "pece", "laroo", "bardege"
  ],
  mbale: [
    "mbale", "nkoma", "malukhu", "industrial"
  ],
  tororo: [
    "tororo", "malaba", "busia"
  ],
  wakiso: [
    "wakiso", "kira", "nansana", "gayaza", "gayaza road", "kakiri", "matugga", "kasangati"
  ],
  masaka: [
    "masaka", "nyendo", "kimanya", "katwe masaka"
  ],
  arua: [
    "arua", "oli", "ayivu"
  ],
  kasese: [
    "kasese", "hima"
  ],
  hoima: [
    "hoima", "kigorobya"
  ],
  lira: [
    "lira", "addu"
  ],
  soroti: [
    "soroti"
  ]
};

/**
 * Phonetic, spelling, and synonym aliases for Ugandan locations.
 */
export const AREA_ALIASES: Record<string, string[]> = {
  makindye: ["makyindye", "makindye"],
  makyindye: ["makyindye", "makindye"],
  nakulabye: ["nakulabye", "nankulabye"],
  nankulabye: ["nakulabye", "nankulabye"],
  rubaga: ["rubaga", "lubaga"],
  lubaga: ["rubaga", "lubaga"],
  gaba: ["gaba", "ggaba"],
  ggaba: ["gaba", "ggaba"],
  buwate: ["buwate", "buwaate"],
  buwaate: ["buwate", "buwaate"],
  gayaza: ["gayaza", "gayaza road"],
  "gayaza road": ["gayaza", "gayaza road"],
  kanyanya: ["kanyanya", "kanyanya bahai", "bahai road", "bahai"],
  kisaasi: ["kisaasi", "kisaasi bukoto", "bukoto road"],
  bukoto: ["bukoto", "kisaasi bukoto", "bukoto road"],
  salaama: ["salaama", "salaama rd"],
  "salaama rd": ["salaama", "salaama rd"],
  kira: ["kira", "kampala kira"],
  seeta: ["seeta", "seeta mukono", "mukono"],
  "seeta mukono": ["seeta", "seeta mukono", "mukono"],
  "fort portal": ["fort portal", "fort-portal"],
  "fort-portal": ["fort portal", "fort-portal"],
  entebbe: ["entebbe", "entebbe road"],
  "entebbe road": ["entebbe", "entebbe road"],
};

export interface MatchResult {
  profiles: ProfileType[];
  isFallback: boolean;
  matchType: "direct_suburb" | "nearby_suburb" | "city_kampala" | "city_direct" | "city_travel_fallback" | "all";
}

/**
 * Match profiles against a city and optional suburb with fuzzy keyword matching,
 * alias resolution, and intelligent outcall/travel fallback so users never see an empty page.
 */
export function matchProfilesByLocation(
  allProfiles: ProfileType[],
  city?: string,
  suburb?: string
): MatchResult {
  const normCity = normalizeLocation(city);
  const normSub = normalizeLocation(suburb);

  // 1. Suburb specified (e.g. /escorts-in/kampala/kololo or /escorts-in/kampala/najjera)
  if (normSub) {
    const subAliases = AREA_ALIASES[normSub] || [normSub];
    const directMatches = allProfiles.filter((p) => {
      const pLoc = normalizeLocation(p.location);
      return subAliases.some(
        (alias) => pLoc.includes(alias) || alias.includes(pLoc)
      );
    });

    if (directMatches.length > 0) {
      return {
        profiles: directMatches,
        isFallback: false,
        matchType: "direct_suburb",
      };
    }

    // If no direct profile exists in that exact suburb, show companions located across Kampala
    // or willing to do outcalls/incalls in Greater Kampala
    if (
      normCity === "kampala" ||
      KAMPALA_AREAS.some((a) => a.includes(normSub) || normSub.includes(a))
    ) {
      const nearbyKampala = allProfiles.filter((p) => {
        const pLoc = normalizeLocation(p.location);
        return (
          pLoc.includes("kampala") ||
          p.isPinned ||
          p.isVip ||
          KAMPALA_AREAS.some((area) => pLoc.includes(area))
        );
      });

      if (nearbyKampala.length > 0) {
        return {
          profiles: nearbyKampala,
          isFallback: true,
          matchType: "nearby_suburb",
        };
      }
    }
  }

  // 2. City specified (e.g. /escorts-in/kampala, /escorts-in/entebbe, /escorts-in/gulu)
  if (normCity) {
    // A. Kampala matches ALL Kampala suburbs and areas
    if (normCity === "kampala") {
      const kampalaMatches = allProfiles.filter((p) => {
        const pLoc = normalizeLocation(p.location);
        if (pLoc.includes("kampala")) return true;
        return KAMPALA_AREAS.some(
          (area) => pLoc.includes(area) || area.includes(pLoc)
        );
      });

      return {
        profiles: kampalaMatches.length > 0 ? kampalaMatches : allProfiles,
        isFallback: false,
        matchType: "city_kampala",
      };
    }

    // B. Other specific cities (Entebbe, Jinja, Mbarara, Fort Portal, Mukono, Wakiso, etc.)
    const lookupKey = normCity.replace(/-/g, " ");
    const relatedAreas =
      CITY_AREAS[lookupKey] ||
      CITY_AREAS[normCity] ||
      AREA_ALIASES[lookupKey] ||
      [lookupKey];

    const directMatches = allProfiles.filter((p) => {
      const pLoc = normalizeLocation(p.location);
      return relatedAreas.some((area) => {
        const normArea = normalizeLocation(area);
        return pLoc.includes(normArea) || normArea.includes(pLoc);
      });
    });

    if (directMatches.length > 0) {
      return {
        profiles: directMatches,
        isFallback: false,
        matchType: "city_direct",
      };
    }

    // C. If the city does not have local resident profiles yet (e.g. Gulu, Mbale, Tororo),
    // return verified profiles available for outcalls, travel bookings, and top companions
    // so no location button ever shows 0 profiles.
    const travelCompanions = allProfiles.filter((p) => {
      const pLoc = normalizeLocation(p.location);
      return (
        pLoc.includes("anywhere in uganda") ||
        pLoc.includes("uganda") ||
        p.isPinned ||
        p.isVip
      );
    });

    const fallbackList = travelCompanions.length >= 8
      ? travelCompanions
      : allProfiles.slice(0, 36);

    return {
      profiles: fallbackList,
      isFallback: true,
      matchType: "city_travel_fallback",
    };
  }

  return {
    profiles: allProfiles,
    isFallback: false,
    matchType: "all",
  };
}
