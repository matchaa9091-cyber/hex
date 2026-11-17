export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDE_BY_SLUG, GUIDES } from "@/data/guides";
import GuidePage from "@/screens/GuidePage";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = GUIDE_BY_SLUG[params.slug];
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `https://www.hexescortsug.com/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: `https://www.hexescortsug.com/guides/${guide.slug}`,
      siteName: "Hex Escorts Uganda",
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const guide = GUIDE_BY_SLUG[params.slug];
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}
