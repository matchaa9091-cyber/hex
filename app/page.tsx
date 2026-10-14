import HomePage from "@/screens/HomePage";
import { fetchAllProfiles } from "@/data/allProfiles";
import type { Metadata } from "next";
import { slugify } from "@/lib/utils";

export const revalidate = 300; // Cache home data for 5 minutes

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
  // Deterministic seed per 5-minute block so Next.js ISR can properly cache server-side
  const seed = Math.floor(Date.now() / (1000 * 300)).toString(36);
  const rawProfiles = await fetchAllProfiles(seed);

  // Generate ItemList schema for Google SERP rich snippet carousel
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Verified Uganda Escorts & Kampala Call Girls",
    "description": "Directory of verified escorts and discreet call girls in Uganda and Kampala.",
    "numberOfItems": rawProfiles.length,
    "itemListElement": rawProfiles.slice(0, 15).map((p, idx) => ({
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
      <HomePage initialProfiles={rawProfiles} shuffleSeed={seed} />
    </>
  );
}
