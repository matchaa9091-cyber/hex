import HomePage from "@/screens/HomePage";
import { fetchAllProfiles } from "@/data/allProfiles";
import type { Metadata } from "next";
import { slugify } from "@/lib/utils";

// Cache homepage for 60 seconds on Cloudflare edge
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Uganda Escorts & Kampala Escorts | #1 Verified UG Call Girls",
  description:
    "Uganda Escorts & Kampala Escorts: Browse 100% verified Ugandan call girls in Kampala & countrywide. Genuine photos, verified direct WhatsApp & discreet hookups.",
  keywords:
    "uganda escorts, kampala escorts, escorts, ugandan escorts, escorts uganda, ug escorts, escorts in kampala, escorts in uganda, escort, escorts kampala",
  alternates: {
    canonical: "https://www.hexescortsug.com",
  },
  openGraph: {
    title: "Uganda Escorts & Kampala Escorts | #1 Verified UG Call Girls",
    description:
      "Browse 100% verified Ugandan call girls and escorts in Kampala, Entebbe, Jinja & across Uganda. Real photos, direct WhatsApp & discreet hookups.",
    url: "https://www.hexescortsug.com",
    siteName: "Hex Escorts Uganda",
    type: "website",
    locale: "en_UG",
    images: [
      {
        url: "https://www.hexescortsug.com/logo.png",
        width: 1024,
        height: 1024,
        alt: "Uganda Escorts - Hex Escorts UG Logo",
      },
    ],
  },
};

export default async function Page() {
  const seed = Math.floor(Date.now() / (1000 * 3600)).toString(36);
  const allStatic = await fetchAllProfiles(seed);

  // Slim down initial SSR payload to strictly respect Cloudflare Worker CPU limits:
  // 1. Spas (for featured ad banner carousel)
  // 2. VIP pinned profiles (for the Elite VIP section)
  // 3. First batch of ordinary profiles (16 items for instant first view)
  const spas = allStatic.filter(p => (p.name || '').toLowerCase().includes('spa') || (p.adImages && p.adImages.length > 0));
  const vipProfiles = allStatic.filter(p => p.isPinned);
  const ordinaryFirstBatch = allStatic.filter(p => !p.isPinned).slice(0, 16);

  const initialMap = new Map();
  [...spas, ...vipProfiles, ...ordinaryFirstBatch].forEach(p => initialMap.set(p.id, p));
  const initialProfiles = Array.from(initialMap.values());

  // Generate ItemList schema for Google SERP rich snippet carousel
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Verified Uganda Escorts & Kampala Call Girls",
    "description": "Directory of verified escorts and discreet call girls in Uganda and Kampala.",
    "numberOfItems": allStatic.length,
    "itemListElement": allStatic.slice(0, 15).map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": `${p.name} - Escort in ${p.location}`,
      "url": `https://www.hexescortsug.com/profile/${slugify(p.name)}`,
      "image": p.profileImage,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <HomePage initialProfiles={initialProfiles} shuffleSeed={seed} />
    </>
  );
}
