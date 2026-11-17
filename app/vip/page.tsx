import { fetchAllProfiles, getGlobalShuffleSeed } from "@/data/allProfiles";
import { getCategorySeo } from "@/data/categorySeo";
import { buildItemListSchema } from "@/lib/listingSchema";
import Breadcrumbs from "@/components/Breadcrumbs";
import VipPage from "@/screens/VipPage";
import { Metadata } from 'next';

const vipSeo = getCategorySeo("vip");

export const metadata: Metadata = {
  title: vipSeo?.title || 'VIP Escorts in Uganda | Premium Kampala Companions',
  description:
    vipSeo?.description ||
    'VIP Escorts in Uganda: Browse hand-picked elite companions & call girls in Kampala & across Uganda. Discreet luxury hookups with verified WhatsApp contacts.',
  alternates: {
    canonical: 'https://www.hexescortsug.com/vip',
  },
  openGraph: {
    title: vipSeo?.title || 'VIP Escorts in Uganda | Premium Kampala Companions',
    description:
      vipSeo?.description ||
      'VIP Escorts in Uganda: Browse hand-picked elite companions & call girls in Kampala & across Uganda.',
    url: 'https://www.hexescortsug.com/vip',
    siteName: 'Hex Escorts Uganda',
    type: 'website',
  },
};

export const revalidate = 60; // Cache VIP data for 60 seconds

export default async function Page() {
  const seed = getGlobalShuffleSeed();
  const rawProfiles = await fetchAllProfiles(seed);
  const faqSchema = vipSeo
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": vipSeo.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      }
    : null;
  const itemListSchema = buildItemListSchema(
    rawProfiles.filter((profile) => profile.isVip || profile.isPinned),
    "VIP Escorts in Uganda"
  );

  return (
    <main className="min-h-screen bg-black pt-4 pb-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: "VIP Escorts", href: "/vip", current: true }]} />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        {itemListSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
          />
        )}
        <VipPage initialProfiles={rawProfiles} shuffleSeed={seed} />
      </div>
    </main>
  );
}
