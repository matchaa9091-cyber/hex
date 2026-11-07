import LocationPageClient from "@/screens/LocationPage";
import { staticProfiles } from "@/data/staticProfiles";
import { sortAndShuffleProfiles } from "@/data/allProfiles";
import type { Metadata } from 'next';
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 60; // Cache index data for 60 seconds

export const metadata: Metadata = {
  title: 'Escorts in Uganda | #1 Verified Uganda & Kampala Escorts - Hex',
  description: 'Find top verified escorts in Uganda with 100% genuine photos and direct WhatsApp contacts. Browse elite companions, discreet hookups, and call girls across Kampala, Entebbe, Jinja & countrywide.',
  keywords: 'escorts in uganda, uganda escorts, kampala escorts, ugandan escorts, ug escorts, verified escorts uganda, call girls uganda',
  alternates: {
    canonical: 'https://www.hexescortsug.com/escorts-in',
  }
};

export default async function Page() {
  const seed = Math.floor(Date.now() / (1000 * 60)).toString(36);
  const active = staticProfiles.filter(p => !p.isArchived);
  const rawProfiles = sortAndShuffleProfiles(active, seed);

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
