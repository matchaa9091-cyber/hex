import LocationPageClient from "@/screens/LocationPage";
import { fetchAllProfiles } from "@/data/allProfiles";
import type { Metadata } from 'next';
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 60; // Cache index data for 60 seconds

export const metadata: Metadata = {
  title: "Uganda Escorts & Kampala Escorts | #1 Verified UG Call Girls",
  description:
    "Uganda Escorts & Kampala Escorts: Browse 100% verified Ugandan call girls in Kampala & countrywide. Genuine photos, verified direct WhatsApp & discreet hookups.",
  keywords:
    "uganda escorts, kampala escorts, escorts, ugandan escorts, escorts uganda, ug escorts, escorts in kampala, escorts in uganda, escort, escorts kampala",
  alternates: {
    canonical: 'https://www.hexescortsug.com/escorts-in',
  },
  openGraph: {
    title: "Uganda Escorts & Kampala Escorts | #1 Verified UG Call Girls",
    description:
      "Browse 100% verified Ugandan call girls and escorts in Kampala, Entebbe, Jinja & across Uganda. Real photos, direct WhatsApp & discreet hookups.",
    url: 'https://www.hexescortsug.com/escorts-in',
    siteName: 'Hex Escorts Uganda',
  },
};

export default async function Page() {
  const seed = Math.floor(Date.now() / (1000 * 3600)).toString(36);
  const rawProfiles = await fetchAllProfiles(seed);

  const breadcrumbItems = [
    { label: "Escorts in Uganda", href: "/escorts-in", current: true }
  ];

  return (
    <main className="min-h-screen bg-black pt-4 pb-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
        <LocationPageClient 
          cityParam={undefined} 
          suburbParam={undefined}
          initialProfiles={rawProfiles} 
          shuffleSeed={seed} 
        />
      </div>
    </main>
  );
}
