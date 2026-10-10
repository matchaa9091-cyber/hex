import HomePage from "@/screens/HomePage";
import { fetchAllProfiles } from "@/data/allProfiles";
import type { Metadata } from "next";

export const revalidate = 300; // Cache home data for 5 minutes

export const metadata: Metadata = {
  title: "Uganda Escorts: #1 Verified Call Girls & Companions | Hex Escorts",
  description:
    "Uganda Escorts: Browse 100% verified Ugandan call girls in Kampala, Entebbe, Jinja & Mbarara. Real photos, verified direct WhatsApp contacts & discreet hookups.",
  alternates: {
    canonical: "https://www.hexescortsug.com",
  },
  openGraph: {
    title: "Uganda Escorts: #1 Verified Call Girls & Companions | Hex Escorts",
    description:
      "Browse 100% verified Ugandan call girls in Kampala, Entebbe, Jinja & Mbarara. Real photos, verified direct WhatsApp contacts & discreet hookups.",
    url: "https://www.hexescortsug.com",
    siteName: "Hex Escorts UG",
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
  return <HomePage initialProfiles={rawProfiles} shuffleSeed={seed} />;
}
