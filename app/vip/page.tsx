import { fetchAllProfiles } from "@/data/allProfiles";
import VipPage from "@/screens/VipPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Uganda Escorts & Kampala Escorts | #1 Verified UG Call Girls",
  description:
    "Uganda Escorts & Kampala Escorts: Browse 100% verified Ugandan call girls in Kampala & countrywide. Genuine photos, verified direct WhatsApp & discreet hookups.",
  keywords:
    "uganda escorts, kampala escorts, escorts, ugandan escorts, escorts uganda, ug escorts, escorts in kampala, escorts in uganda, escort, escorts kampala",
  alternates: {
    canonical: 'https://www.hexescortsug.com/vip',
  },
  openGraph: {
    title: "Uganda Escorts & Kampala Escorts | #1 Verified UG Call Girls",
    description:
      "Browse 100% verified Ugandan call girls and escorts in Kampala, Entebbe, Jinja & across Uganda. Real photos, direct WhatsApp & discreet hookups.",
    url: 'https://www.hexescortsug.com/vip',
    siteName: 'Hex Escorts Uganda',
  },
};

export const revalidate = 60; // Cache VIP data for 60 seconds

export default async function Page() {
  // Deterministic seed per 5-minute block so Next.js ISR can properly cache server-side
  const seed = Math.floor(Date.now() / (1000 * 3600)).toString(36);
  const rawProfiles = await fetchAllProfiles(seed);
  return <VipPage initialProfiles={rawProfiles} shuffleSeed={seed} />;
}
