import LocationPageClient from "@/screens/LocationPage";
import { fetchAllProfiles, getGlobalShuffleSeed } from "@/data/allProfiles";
import { getCitySeo } from "@/data/locationSeo";
import { buildItemListSchema, getListingProfiles } from "@/lib/listingSchema";
import { isKnownLocation } from "@/lib/seoIndexing";
import type { Metadata } from 'next';
import Breadcrumbs from "@/components/Breadcrumbs";

// Cache location pages for 60 seconds on Cloudflare edge
export const revalidate = 60;
export const dynamicParams = true;

type Props = {
  params: { location: string[] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = params.location[0].replace(/-/g, ' ');
  const suburb = params.location[1] ? params.location[1].replace(/-/g, ' ') : null;
  
  const rawLocation = suburb ? `${suburb}, ${city}` : city;
  const locationName = rawLocation.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  const routePath = params.location.join('/');
  
  const citySeo = suburb ? null : getCitySeo(city);

  const pageTitle = citySeo?.title || `${locationName} Escorts | Verified Call Girls & Companions`;
  const pageDesc =
    citySeo?.description ||
    `Verified ${locationName} escorts and call girls with real photos, direct WhatsApp contacts, and discreet companionship in ${locationName}, Uganda.`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: `escorts in ${locationName}, ${locationName} escorts, call girls ${locationName}, hookups ${locationName}, ${locationName} escort girls`,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `https://www.hexescortsug.com/escorts-in/${routePath}`,
      siteName: 'Hex Escorts Uganda',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.hexescortsug.com/escorts-in/${routePath}`,
    },
    robots: {
      index: isKnownLocation(city, suburb),
      follow: true,
    }
  }
}

export default async function EscortsInLocationPage({ params }: Props) {
  const city = params.location[0].replace(/-/g, ' ');
  const suburb = params.location[1] ? params.location[1].replace(/-/g, ' ') : null;
  
  const rawLocation = suburb ? `${suburb}, ${city}` : city;
  const locationName = rawLocation.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  // Seed for deterministic shuffling (5-minute global block)
  const seed = getGlobalShuffleSeed();
  const rawProfiles = await fetchAllProfiles(seed);

  const citySeo = suburb ? null : getCitySeo(city);
  const faqItems = citySeo?.faqs || [
    {
      question: `Are the escorts in ${locationName} verified?`,
      answer: `Yes, all escorts listed on Hex Escorts UG for ${locationName} go through a strict verification process to ensure authenticity, safety, and a premium experience.`,
    },
    {
      question: `How much do escorts cost in ${locationName}?`,
      answer: `Prices vary depending on the companion, duration, and specific services. You can view individual rates on each verified profile for escorts available in ${locationName}.`,
    },
    {
      question: `Can I book an outcall to my hotel in ${locationName}?`,
      answer: `Absolutely. Many of our high-class call girls in ${locationName} offer discreet outcall services to premium hotels, apartments, and private residences.`,
    },
  ];

  // Generate FAQ Schema for Google Rich Snippets. The visible FAQ in
  // LocationPage uses the same shared city SEO data.
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

  const cityLabel = city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const breadcrumbItems = [
    { label: "Escorts in Uganda", href: "/escorts-in" },
    ...(suburb
      ? [
          { label: cityLabel, href: `/escorts-in/${params.location[0]}` },
          { label: suburb.charAt(0).toUpperCase() + suburb.slice(1), href: `/escorts-in/${params.location.join('/')}`, current: true },
        ]
      : city
        ? [{ label: cityLabel, href: `/escorts-in/${params.location.join('/')}`, current: true }]
        : []),
  ];

  const itemListSchema = buildItemListSchema(
    getListingProfiles(rawProfiles, city, suburb || undefined),
    `${locationName} Escorts`
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
          initialProfiles={rawProfiles} 
          shuffleSeed={seed} 
        />
      </div>
    </main>
  );
}
