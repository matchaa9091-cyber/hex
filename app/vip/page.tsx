import { fetchAllProfiles } from "@/data/allProfiles";
import VipPage from "@/screens/VipPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP Escorts Uganda & Kampala | #1 Elite Verified Call Girls - Hex',
  description:
    'VIP Escorts Uganda & Kampala: Browse elite verified high-class call girls and executive escorts in Kampala and across Uganda. Authentic photos, 100% discretion & direct WhatsApp.',
  keywords:
    'vip escorts uganda, vip escorts kampala, elite escorts uganda, high class escorts kampala, vip call girls uganda, executive companions kampala, luxury hookups uganda, escorts uganda',
  alternates: {
    canonical: 'https://www.hexescortsug.com/vip',
  },
  openGraph: {
    title: 'VIP Escorts Uganda & Kampala | #1 Elite Verified Call Girls',
    description:
      'Browse elite verified high-class call girls and executive escorts in Kampala and across Uganda. Authentic photos, 100% discretion & direct WhatsApp.',
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
