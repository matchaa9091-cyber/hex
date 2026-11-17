import LocationPageClient from "@/screens/LocationPage";
import { fetchAllProfiles, getGlobalShuffleSeed } from "@/data/allProfiles";
import { buildItemListSchema, getListingProfiles } from "@/lib/listingSchema";
import type { Metadata } from 'next';
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 60; // Cache index data for 60 seconds

export const metadata: Metadata = {
  title: 'Escorts in Uganda: Verified Kampala & Uganda Call Girls',
  description: 'Escorts in Uganda & Kampala call girls: Browse 100% verified Ugandan escorts with real photos and direct WhatsApp contacts across Kampala, Entebbe & nationwide.',
  keywords: 'escorts in uganda, uganda escorts, kampala escorts, ugandan escorts, ug escorts, verified escorts uganda, call girls uganda',
  alternates: {
    canonical: 'https://www.hexescortsug.com/escorts-in',
  }
};

export default async function Page() {
  const seed = getGlobalShuffleSeed();
  const rawProfiles = await fetchAllProfiles(seed);
  const itemListSchema = buildItemListSchema(
    getListingProfiles(rawProfiles),
    "Escorts in Uganda"
  );

  const breadcrumbItems = [
    { label: "Escorts in Uganda", href: "/escorts-in", current: true }
  ];

  return (
    <main className="min-h-screen bg-black pt-4 pb-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
        {itemListSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
          />
        )}
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
