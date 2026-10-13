import LocationPageClient from "@/screens/LocationPage";
import { fetchAllProfiles } from "@/data/allProfiles";
import type { Metadata } from 'next';
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 300; // Cache index data for 5 minutes

export const metadata: Metadata = {
  title: 'Escorts in Uganda | #1 Verified Uganda & Kampala Escorts - Hex',
  description: 'Find top verified escorts in Uganda with 100% genuine photos and direct WhatsApp contacts. Browse elite companions, discreet hookups, and call girls across Kampala, Entebbe, Jinja & countrywide.',
  keywords: 'escorts in uganda, uganda escorts, kampala escorts, ugandan escorts, ug escorts, verified escorts uganda, call girls uganda',
  alternates: {
    canonical: 'https://www.hexescortsug.com/escorts-in',
  }
};

export default async function Page() {
  // Deterministic seed per 5-minute block so Next.js ISR can properly cache server-side
  const seed = Math.floor(Date.now() / (1000 * 300)).toString(36);
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
