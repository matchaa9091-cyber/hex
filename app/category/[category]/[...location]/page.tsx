import LocationPageClient from "@/screens/LocationPage";
import { fetchAllProfiles, getGlobalShuffleSeed } from "@/data/allProfiles";
import { getCategorySeo } from "@/data/categorySeo";
import { buildItemListSchema, getListingProfiles } from "@/lib/listingSchema";
import { isKnownLocation } from "@/lib/seoIndexing";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Metadata } from 'next';

export const revalidate = 60; // Cache category location data for 60 seconds
export const dynamicParams = true;

type Props = {
  params: { category: string, location: string[] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categorySeo = getCategorySeo(params.category);
  const categoryName =
    categorySeo?.name ||
    params.category.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  const city = params.location[0].replace(/-/g, ' ');
  const suburb = params.location[1] ? params.location[1].replace(/-/g, ' ') : null;

  const rawLocation = suburb ? `${suburb}, ${city}` : city;
  const locationName = rawLocation.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  const categorySlug = categorySeo?.slug || params.category;
  const canonical = `https://www.hexescortsug.com/${categorySlug}-escorts-in/${params.location.join('/')}`;

  const title = `${categoryName} Escorts in ${locationName} | Verified Profiles`;
  const description = `${categoryName} escorts in ${locationName}: browse verified call girls and companions with real photos, direct WhatsApp contacts, and discreet incall or outcall bookings.`;

  return {
    title,
    description,
    keywords: `${categoryName.toLowerCase()} escorts in ${locationName}, ${locationName} ${categoryName.toLowerCase()} call girls, ${categoryName.toLowerCase()} hookups ${locationName}`,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Hex Escorts Uganda',
      type: 'website',
    },
    alternates: {
      canonical,
    },
    robots: {
      index: isKnownLocation(city, suburb),
      follow: true,
    }
  }
}

export default async function CategoryLocationPage({ params }: Props) {
  const categorySeo = getCategorySeo(params.category);
  const category = categorySeo?.slug || params.category.replace(/-/g, ' ');
  const city = params.location[0].replace(/-/g, ' ');
  const suburb = params.location[1] ? params.location[1].replace(/-/g, ' ') : null;

  const rawLocation = suburb ? `${suburb}, ${city}` : city;
  const locationName = rawLocation.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  const categoryName =
    categorySeo?.name ||
    category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  const seed = getGlobalShuffleSeed();
  const rawProfiles = await fetchAllProfiles(seed);

  const faqItems = categorySeo?.faqs || [
    {
      question: `Are the ${categoryName.toLowerCase()} escorts in ${locationName} verified?`,
      answer: `Yes, all ${categoryName.toLowerCase()} escorts listed on Hex Escorts UG for ${locationName} go through a strict verification process to ensure authenticity, safety, and a premium experience.`,
    },
    {
      question: `How much do ${categoryName.toLowerCase()} escorts cost in ${locationName}?`,
      answer: `Prices vary depending on the companion, duration, and specific services. You can view individual rates on each verified profile for ${categoryName.toLowerCase()} escorts available in ${locationName}.`,
    },
    {
      question: `Can I book an outcall to my hotel in ${locationName}?`,
      answer: `Absolutely. Many of our high-class ${categoryName.toLowerCase()} call girls in ${locationName} offer discreet outcall services to premium hotels, apartments, and private residences.`,
    },
  ];

  // The visible FAQ in LocationPage uses the same shared category data.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const categoryHub = category === 'vip' ? '/vip' : `/category/${category}`;
  const hrefCategory = categorySeo?.slug || params.category;
  const currentPath = `/${hrefCategory}-escorts-in/${params.location.join('/')}`;
  const cityLabel = city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const breadcrumbItems = [
    { label: `${categoryName} Escorts`, href: categoryHub },
    ...(suburb
      ? [
          { label: cityLabel, href: `/${hrefCategory}-escorts-in/${params.location[0]}` },
          { label: suburb.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), href: currentPath, current: true },
        ]
      : [{ label: locationName, href: currentPath, current: true }]),
  ];

  const itemListSchema = buildItemListSchema(
    getListingProfiles(rawProfiles, city, suburb || undefined, category),
    `${categoryName} Escorts in ${locationName}`
  );

  return (
    <main className="min-h-screen bg-black pt-4 pb-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {itemListSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
          />
        )}
        <LocationPageClient
          cityParam={city}
          suburbParam={suburb || undefined}
          categoryParam={category}
          initialProfiles={rawProfiles}
          shuffleSeed={seed}
        />
      </div>
    </main>
  );
}
