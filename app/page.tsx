import HomePage from "@/screens/HomePage";
import { fetchAllProfiles, getGlobalShuffleSeed } from "@/data/allProfiles";
import { HOME_FAQS } from "@/data/homeFaqs";
import type { Metadata } from "next";

// Cache homepage for 60 seconds on Cloudflare edge
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Uganda Escorts & Kampala Escorts | #1 Verified UG Call Girls",
  description:
    "Uganda Escorts & Kampala Escorts: Browse 100% verified Ugandan call girls in Kampala & countrywide. Genuine photos, verified direct WhatsApp & discreet hookups.",
  keywords:
    "uganda escorts, kampala escorts, escorts, ugandan escorts, escorts uganda, ug escorts, escorts in uganda, escorts in kampala, escort, escorts kampala",
  alternates: {
    canonical: "https://www.hexescortsug.com/",
  },
  openGraph: {
    title: "Uganda Escorts & Kampala Escorts | #1 Verified UG Call Girls",
    description:
      "Browse 100% verified Ugandan call girls and escorts in Kampala, Entebbe, Jinja & across Uganda. Real photos, direct WhatsApp & discreet hookups.",
    url: "https://www.hexescortsug.com/",
    siteName: "Hex Escorts Uganda",
    type: "website",
    locale: "en_UG",
    images: [
      {
        url: "https://www.hexescortsug.com/logo.png",
        width: 1024,
        height: 1024,
        alt: "Uganda Escorts - Hex Escorts UG Logo",
      },
    ],
  },
};

export default async function Page() {
  const seed = getGlobalShuffleSeed();
  const allStatic = await fetchAllProfiles(seed);

  // Matches the visible homepage FAQ rendered from HOME_FAQS.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": HOME_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePage initialProfiles={allStatic} shuffleSeed={seed} />
    </>
  );
}
