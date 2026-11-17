import LocationPageClient from "@/screens/LocationPage";
import { fetchAllProfiles, getGlobalShuffleSeed } from "@/data/allProfiles";
import { getCategorySeo } from "@/data/categorySeo";
import { buildItemListSchema, getListingProfiles } from "@/lib/listingSchema";
import type { Metadata } from 'next';
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 60; // Cache category pages for 60 seconds
export const dynamicParams = true;

type Props = {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categorySeo = getCategorySeo(params.category);
  const categoryName =
    categorySeo?.name ||
    params.category
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const title = categorySeo?.title || `${categoryName} Escorts in Uganda | Verified Profiles`;
  const description =
    categorySeo?.description ||
    `${categoryName} Escorts in Uganda: Browse verified ${categoryName.toLowerCase()} escorts & call girls. Real photos, verified WhatsApp numbers & discreet VIP hookups in Kampala & countrywide.`;
  const canonical =
    (categorySeo?.slug || params.category) === 'vip'
      ? 'https://www.hexescortsug.com/vip'
      : `https://www.hexescortsug.com/category/${categorySeo?.slug || params.category}`;

  return {
    title,
    description,
    keywords: `${categoryName.toLowerCase()} escorts, ${categoryName.toLowerCase()} call girls uganda, hookups uganda, escorts in kampala`,
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
      index: true,
      follow: true,
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const categorySeo = getCategorySeo(params.category);
  const category = categorySeo?.slug || params.category.replace(/-/g, ' ');
  const categoryName =
    categorySeo?.name ||
    category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  const seed = getGlobalShuffleSeed();
  const rawProfiles = await fetchAllProfiles(seed);

  const faqItems = categorySeo?.faqs || [
    {
      question: `How do I book ${categoryName.toLowerCase()} escorts in Uganda?`,
      answer: `Browse verified ${categoryName.toLowerCase()} companions on Hex Escorts UG, view their photos, and tap the WhatsApp button to chat directly without middlemen.`,
    },
    {
      question: `Are the photos of ${categoryName.toLowerCase()} call girls authentic?`,
      answer: `Yes. Every profile undergoes rigorous photo verification to ensure you meet the exact person displayed.`,
    },
  ];

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

  const breadcrumbItems = [
    {
      label: `${categoryName} Escorts`,
      href: category === 'vip' ? '/vip' : `/category/${category}`,
      current: true,
    },
  ];

  const itemListSchema = buildItemListSchema(
    getListingProfiles(rawProfiles, undefined, undefined, category),
    `${categoryName} Escorts in Uganda`
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
          cityParam={undefined} 
          suburbParam={undefined}
          categoryParam={category}
          initialProfiles={rawProfiles} 
          shuffleSeed={seed} 
        />
      </div>
    </main>
  );
}
