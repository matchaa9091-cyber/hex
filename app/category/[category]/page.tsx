import LocationPageClient from "@/screens/LocationPage";
import { fetchAllProfiles } from "@/data/allProfiles";
import type { Metadata } from 'next';
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 60; // Cache category pages for 60 seconds
export const dynamicParams = true;

type Props = {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = params.category
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return {
    title: `${categoryName} Escorts in Uganda | #1 Verified Companions - Hex Escorts`,
    description: `Looking for top verified ${categoryName.toLowerCase()} escorts and call girls in Uganda. Real photos, verified WhatsApp numbers & discreet VIP hookups in Kampala & countrywide.`,
    keywords: `${categoryName.toLowerCase()} escorts, ${categoryName.toLowerCase()} call girls uganda, hookups uganda, escorts in kampala`,
    openGraph: {
      title: `${categoryName} Escorts in Uganda - Hex Escorts UG`,
      description: `Browse verified ${categoryName.toLowerCase()} escorts and call girls in Uganda. 100% Real & Verified profiles.`,
      url: `https://www.hexescortsug.com/category/${params.category}`,
      siteName: 'Hex Escorts Uganda',
    },
    alternates: {
      canonical: `https://www.hexescortsug.com/category/${params.category}`,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = params.category.replace(/-/g, ' ');
  const categoryName = category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  const seed = Math.floor(Date.now() / (1000 * 3600)).toString(36);
  const rawProfiles = await fetchAllProfiles(seed);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How do I book ${categoryName.toLowerCase()} escorts in Uganda?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Browse verified ${categoryName.toLowerCase()} companions on Hex Escorts UG, view their photos, and tap the WhatsApp button to chat directly without middlemen.`
        }
      },
      {
        "@type": "Question",
        "name": `Are the photos of ${categoryName.toLowerCase()} call girls authentic?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes. Every profile undergoes rigorous photo verification to ensure you meet the exact person displayed.`
        }
      }
    ]
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/vip" },
    { label: `${categoryName} Escorts`, href: `/category/${params.category}`, current: true }
  ];

  return (
    <main className="min-h-screen bg-black pt-4 pb-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
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
