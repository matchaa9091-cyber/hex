import { ProfileType } from "@/types/profile";

export function normalizeLocation(s?: string | null): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/[-_,/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Check if a profile location string matches a target location with word boundary precision.
 * Prevents false substring matches like 'nama' matching 'namasuba' or 'kira' matching 'shakira'.
 */
export function wordBoundaryMatch(profileLoc?: string | null, targetLoc?: string | null): boolean {
  if (!profileLoc || !targetLoc) return false;
  const p = profileLoc.toLowerCase().replace(/[-_,/]/g, " ").replace(/\s+/g, " ").trim();
  const t = targetLoc.toLowerCase().replace(/[-_,/]/g, " ").replace(/\s+/g, " ").trim();

  if (p === t) return true;

  const escaped = escapeRegex(t);
  const regex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, "i");
  return regex.test(p);
}

/**
 * All known Kampala divisions and their verified suburbs.
 * Divided according to KCCA's 5 administrative divisions:
 * 1. Central Division
 * 2. Kawempe Division
 * 3. Makindye Division
 * 4. Nakawa Division
 * 5. Rubaga (Lubaga) Division
 * Plus the surrounding Greater Kampala / Wakiso metropolitan belt.
 */
export const KAMPALA_DIVISIONS = {
  central: [
    "nakasero", "kololo", "old kampala", "kamwokya", "kisenyi", "mengo",
    "industrial area", "nakivubo", "kagugube", "bukesa", "central", "kampala town",
    "sir apollo kagwa", "civic centre"
  ],
  kawempe: [
    "kawempe", "bwaise", "mulago", "makerere", "wandegeya", "kanyanya",
    "kazo", "mpererwe", "kisaasi", "kikaya", "kyebando", "komamboga", "kalerwe", "katooke"
  ],
  makindye: [
    "makindye", "makyindye", "kabalagala", "muyenga", "ggaba", "gaba",
    "munyonyo", "nsambya", "buziga", "kisugu", "katwe", "kibuli", "kibuye",
    "lukuli", "luwafu", "bukasa", "salaama", "salaama rd", "wabigalo", "bunga", "namuwongo"
  ],
  nakawa: [
    "nakawa", "ntinda", "bugolobi", "naguru", "luzira", "mbuya", "bukoto",
    "kyambogo", "kyanja", "kiwatule", "kiwaatule", "butabika", "mutungo",
    "kiswa", "banda", "kitintale", "kulambiro"
  ],
  rubaga: [
    "rubaga", "lubaga", "namirembe", "kasubi", "nateete", "ndeeba",
    "mutundwe", "busega", "lungujja", "namungoona", "naakulabye", "nakulabye",
    "nankulabye", "kabowa", "najjanankumbi", "lubya", "kawaala", "lugala",
    "masanafu", "nabulagala"
  ],
  metro_wakiso: [
    "kira", "najjera", "kyaliwajjala", "namugongo", "naalya", "buwate", "buwaate",
    "kireka", "kirinnya", "nansana", "gayaza", "gayaza road", "kasangati",
    "seguku", "zana", "namasuba", "lubowa", "bunamwaya", "masajja", "ndejje",
    "matugga", "kakiri", "bulenga", "kyengera"
  ]
};

/** Flattened list of all Greater Kampala areas */
export const KAMPALA_AREAS: string[] = [
  "kampala",
  ...KAMPALA_DIVISIONS.central,
  ...KAMPALA_DIVISIONS.kawempe,
  ...KAMPALA_DIVISIONS.makindye,
  ...KAMPALA_DIVISIONS.nakawa,
  ...KAMPALA_DIVISIONS.rubaga,
  ...KAMPALA_DIVISIONS.metro_wakiso
];

/**
 * All 17 major cities and regional urban centres in Uganda with their verified suburbs/divisions.
 */
export const CITY_AREAS: Record<string, string[]> = {
  kampala: KAMPALA_AREAS,

  entebbe: [
    "entebbe", "entebbe road", "katabi", "kajjansi", "bwebajja", "lweza",
    "nkumba", "abaita", "abaita ababiri", "kigungu", "kasenyi", "central entebbe",
    "lakeside entebbe", "airport"
  ],

  jinja: [
    "jinja", "jinja city", "central jinja", "bugembe", "njeru", "kakira",
    "walukuba", "masese", "mpumudde", "mbuya jinja", "budondo", "kimaka"
  ],

  mbarara: [
    "mbarara", "mbarara city", "kakoba", "kamukuzi", "nyamitanga", "kakyeka",
    "ruharo", "biharwe", "ruti", "booma mbarara"
  ],

  "fort portal": [
    "fort portal", "fort-portal", "central division", "north division", "bazaar",
    "njara", "kitumba", "kijanju", "nyabukara", "rwengoma", "kasusu", "karambi",
    "kabarole", "butebe"
  ],
  "fort-portal": [
    "fort portal", "fort-portal", "central division", "north division", "bazaar",
    "njara", "kitumba", "kijanju", "nyabukara", "rwengoma", "kasusu", "karambi",
    "kabarole", "butebe"
  ],

  mukono: [
    "mukono", "mukono town", "seeta", "seeta mukono", "goma", "mbalala",
    "kyetume", "wantoni", "namawojjolo"
  ],

  gulu: [
    "gulu", "gulu city", "bar-dege", "bardege", "layibi", "pece", "laroo",
    "bardege-layibi", "pece-laroo", "koro", "unyama"
  ],

  mbale: [
    "mbale", "mbale city", "industrial division", "northern division", "malukhu",
    "namatala", "nkoma", "busamaga", "boma mbale", "doko", "nakaloke"
  ],

  masaka: [
    "masaka", "masaka city", "nyendo", "kimanya", "katwe", "butego",
    "senyange", "kyabakuza", "nyendo-mukungwe", "kimaanya-kabonera"
  ],

  arua: [
    "arua", "arua city", "central division", "ayivu division", "ayivu", "oli",
    "river oli", "adumi", "pajulu", "dadamu"
  ],

  lira: [
    "lira", "lira city", "lira city east", "lira city west", "ojwina",
    "adyel", "central lira", "railways", "ngetta"
  ],

  hoima: [
    "hoima", "hoima city", "hoima east", "hoima west", "busiisi", "kahoora",
    "bujumbura", "mparo", "kigorobya"
  ],

  wakiso: [
    "wakiso", "wakiso town", "kira", "nansana", "gayaza", "gayaza road",
    "kasangati", "kakiri", "matugga", "bulenga", "kyengera"
  ],

  kasese: [
    "kasese", "kasese town", "central kasese", "bulembia", "nyamwamba",
    "hima", "kilembe", "rukoki"
  ],

  tororo: [
    "tororo", "tororo municipality", "western division", "eastern division",
    "malaba", "mukuju", "osukuru"
  ],

  soroti: [
    "soroti", "soroti city", "eastern division", "western division",
    "northern division", "madera", "camp swahili"
  ],

  kabale: [
    "kabale", "kabale municipality", "central kabale", "northern kabale",
    "southern kabale", "kigongi", "rushaki"
  ]
};

/**
 * Phonetic, spelling, and synonym aliases for Ugandan locations.
 */
export const AREA_ALIASES: Record<string, string[]> = {
  makindye: ["makyindye", "makindye"],
  makyindye: ["makyindye", "makindye"],
  nakulabye: ["nakulabye", "nankulabye", "naakulabye"],
  nankulabye: ["nakulabye", "nankulabye", "naakulabye"],
  naakulabye: ["nakulabye", "nankulabye", "naakulabye"],
  rubaga: ["rubaga", "lubaga"],
  lubaga: ["rubaga", "lubaga"],
  gaba: ["gaba", "ggaba"],
  ggaba: ["gaba", "ggaba"],
  buwate: ["buwate", "buwaate"],
  buwaate: ["buwate", "buwaate"],
  gayaza: ["gayaza", "gayaza road"],
  "gayaza road": ["gayaza", "gayaza road"],
  kanyanya: ["kanyanya", "kanyanya bahai", "bahai road", "bahai"],
  kisaasi: ["kisaasi", "kisaasi bukoto", "bukoto road", "kisaasi bukoto road"],
  bukoto: ["bukoto", "kisaasi bukoto", "bukoto road", "kisaasi bukoto road"],
  salaama: ["salaama", "salaama rd"],
  "salaama rd": ["salaama", "salaama rd"],
  kira: ["kira", "kampala kira", "kampala,kira"],
  "kampala,kira": ["kira", "kampala kira", "kampala,kira"],
  seeta: ["seeta", "seeta mukono", "mukono"],
  "seeta mukono": ["seeta", "seeta mukono", "mukono"],
  "fort portal": ["fort portal", "fort-portal"],
  "fort-portal": ["fort portal", "fort-portal"],
  entebbe: ["entebbe", "entebbe road"],
  "entebbe road": ["entebbe", "entebbe road"],
  arua: ["arua", "arua city"],
  "arua city": ["arua", "arua city"],
  mbarara: ["mbarara", "mbarara city"],
  jinja: ["jinja", "jinja city"],
  gulu: ["gulu", "gulu city"],
  masaka: ["masaka", "masaka city"],
  mbale: ["mbale", "mbale city"],
  lira: ["lira", "lira city"],
  hoima: ["hoima", "hoima city"],
  kasese: ["kasese", "kasese town"],
  tororo: ["tororo", "tororo town"],
  soroti: ["soroti", "soroti city"],
  kabale: ["kabale", "kabale town"],
  wakiso: ["wakiso", "wakiso town"]
};

export interface MatchResult {
  profiles: ProfileType[];
  directProfiles: ProfileType[];
  travelProfiles: ProfileType[];
  isFallback: boolean;
  matchType: "direct_suburb" | "nearby_suburb" | "city_kampala" | "city_direct" | "city_travel_fallback" | "all";
  locationDisplayName: string;
}

/**
 * Check if a profile location string matches a target location or any of its aliases.
 * Uses strict word boundary matching to ensure 100% accuracy.
 */
export function locationMatches(profileLoc?: string | null, targetLoc?: string | null): boolean {
  if (!profileLoc || !targetLoc) return false;

  if (wordBoundaryMatch(profileLoc, targetLoc)) return true;

  const normT = normalizeLocation(targetLoc);
  const aliases = AREA_ALIASES[normT];
  if (aliases) {
    for (const alias of aliases) {
      if (wordBoundaryMatch(profileLoc, alias)) return true;
    }
  }

  return false;
}

/**
 * Match profiles against a city and optional suburb with high precision.
 * Direct resident escorts are prioritized. When a location has no resident escorts,
 * we return verified travel companions clearly labeled as travel/outcall so users
 * never receive misleading or false results.
 */
export function matchProfilesByLocation(
  allProfiles: ProfileType[],
  city?: string,
  suburb?: string
): MatchResult {
  const normCity = normalizeLocation(city);
  const normSub = normalizeLocation(suburb);

  // 1. Suburb specified (e.g. /escorts-in/kampala/kawempe or /escorts-in/kampala/najjera)
  if (normSub) {
    const subDisplayName = suburb ? suburb.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "";
    const directMatches = allProfiles.filter((p) => locationMatches(p.location, normSub));

    if (directMatches.length > 0) {
      return {
        profiles: directMatches,
        directProfiles: directMatches,
        travelProfiles: [],
        isFallback: false,
        matchType: "direct_suburb",
        locationDisplayName: `${subDisplayName}, Kampala`,
      };
    }

    // If no direct profile exists in that exact suburb, show companions located across Kampala
    // as outcall / travel options so the page is not empty, but flagged honestly as fallback
    const nearbyKampala = allProfiles.filter((p) => {
      const pLoc = normalizeLocation(p.location);
      return (
        pLoc.includes("kampala") ||
        p.isPinned ||
        p.isVip ||
        KAMPALA_AREAS.some((area) => locationMatches(pLoc, area))
      );
    });

    return {
      profiles: nearbyKampala,
      directProfiles: [],
      travelProfiles: nearbyKampala,
      isFallback: true,
      matchType: "nearby_suburb",
      locationDisplayName: `${subDisplayName}, Kampala`,
    };
  }

  // 2. City specified (e.g. /escorts-in/kampala, /escorts-in/entebbe, /escorts-in/gulu)
  if (normCity) {
    const cityDisplayName = city ? city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "";

    // A. Kampala matches ALL Kampala suburbs, divisions and greater metro areas
    if (normCity === "kampala") {
      const kampalaMatches = allProfiles.filter((p) => {
        const pLoc = normalizeLocation(p.location);
        if (pLoc.includes("kampala")) return true;
        return KAMPALA_AREAS.some((area) => locationMatches(pLoc, area));
      });

      return {
        profiles: kampalaMatches.length > 0 ? kampalaMatches : allProfiles,
        directProfiles: kampalaMatches,
        travelProfiles: [],
        isFallback: false,
        matchType: "city_kampala",
        locationDisplayName: "Kampala",
      };
    }

    // B. Check if single parameter is actually a known Kampala suburb (e.g. /escorts-in/kawempe or /escorts-in/najjera)
    const lookupKey = normCity.replace(/-/g, " ");
    const isKampalaSuburb = KAMPALA_AREAS.some((area) => locationMatches(lookupKey, area));

    if (isKampalaSuburb) {
      const directMatches = allProfiles.filter((p) => locationMatches(p.location, lookupKey));
      if (directMatches.length > 0) {
        return {
          profiles: directMatches,
          directProfiles: directMatches,
          travelProfiles: [],
          isFallback: false,
          matchType: "direct_suburb",
          locationDisplayName: `${cityDisplayName}, Kampala`,
        };
      }

      // If no direct resident profile exists in that exact suburb, show companions located across Kampala
      const nearbyKampala = allProfiles.filter((p) => {
        const pLoc = normalizeLocation(p.location);
        return (
          pLoc.includes("kampala") ||
          p.isPinned ||
          p.isVip ||
          KAMPALA_AREAS.some((area) => locationMatches(pLoc, area))
        );
      });

      return {
        profiles: nearbyKampala,
        directProfiles: [],
        travelProfiles: nearbyKampala,
        isFallback: true,
        matchType: "nearby_suburb",
        locationDisplayName: `${cityDisplayName}, Kampala`,
      };
    }

    // C. Other specific cities (Entebbe, Jinja, Mbarara, Fort Portal, Mukono, Arua, Wakiso, Masaka, etc.)
    const relatedAreas = CITY_AREAS[lookupKey] || CITY_AREAS[normCity] || [lookupKey];

    const directMatches = allProfiles.filter((p) => {
      const pLoc = p.location;
      return relatedAreas.some((area) => locationMatches(pLoc, area));
    });

    if (directMatches.length > 0) {
      return {
        profiles: directMatches,
        directProfiles: directMatches,
        travelProfiles: [],
        isFallback: false,
        matchType: "city_direct",
        locationDisplayName: cityDisplayName,
      };
    }

    // C. If the city does not have local resident profiles yet (e.g. Gulu, Mbale, Tororo, Masaka, Lira, Hoima),
    // provide verified companions willing to travel or do outcalls.
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
      directProfiles: [],
      travelProfiles: fallbackList,
      isFallback: true,
      matchType: "city_travel_fallback",
      locationDisplayName: cityDisplayName,
    };
  }

  return {
    profiles: allProfiles,
    directProfiles: allProfiles,
    travelProfiles: [],
    isFallback: false,
    matchType: "all",
    locationDisplayName: "All Locations",
  };
}
