import ProfileDetailPageClient from "@/screens/ProfileDetailPage";
import { fetchAllProfiles, fetchProfileById } from "@/data/allProfiles";
import type { Metadata, ResolvingMetadata } from 'next';
import { slugify } from "@/lib/utils";
import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 60; // Cache profile page for 60 seconds
export const dynamicParams = true;

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  
  const profile = await fetchProfileById(id);

  if (!profile) {
    return { title: 'Profile Not Found | Escorts UG' };
  }

  return {
    title: `${profile.name} | Verified Escort in ${profile.location}`,
    description: `Book ${profile.name}, a verified companion in ${profile.location}, Uganda. View pictures and services on Hex Escorts UG.`,
    keywords: `${profile.name}, escorts ${profile.location}, sexy girls ${profile.location}, hot girls Uganda, hex escorts, companions Uganda`,
    openGraph: {
      title: `${profile.name} - Verified Escort in ${profile.location}`,
      description: `Book ${profile.name}, a verified sexy companion located in ${profile.location}. Contact on Hex Escorts UG.`,
      images: [profile.profileImage],
    },
    alternates: {
      canonical: `https://www.hexescortsug.com/profile/${slugify(profile.name)}`,
    },
  }
}

export default async function Page({ params }: Props) {
  const { id } = params;
  
  const profile = await fetchProfileById(id);

  // SEO Optimization: If accessed via ID instead of Slug, redirect to Slug
  if (profile) {
    const profileSlug = slugify(profile.name);
    if (id !== profileSlug && id !== profile.id) {
       permanentRedirect(`/profile/${profileSlug}`);
    } else if (id === profile.id && id !== profileSlug) {
       permanentRedirect(`/profile/${profileSlug}`);
    }
  }

  const profileSlug = profile ? slugify(profile.name) : slugify(id);
  const canonicalUrl = `https://www.hexescortsug.com/profile/${profileSlug}`;
  const jsonLd = profile ? {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "url": canonicalUrl,
    "dateModified": profile.updatedAt || profile.createdAt || undefined,
    "mainEntity": {
      "@type": "Person",
      "name": profile.name,
      "url": canonicalUrl,
      "image": profile.profileImage,
      "description": profile.description || profile.shortBio || `${profile.name} - verified companion in ${profile.location}, Uganda.`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": profile.location,
        "addressCountry": "UG"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  } : null;

  const breadcrumbItems = [
    { label: "Escorts in Uganda", href: "/escorts-in" },
    ...(profile ? [{ label: profile.location, href: `/escorts-in/${slugify(profile.location)}` }] : []),
    { label: profile ? profile.name : id, href: `/profile/${profileSlug}`, current: true }
  ];

  return (
    <main className="min-h-screen bg-black pt-4 pb-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <ProfileDetailPageClient profileId={id} initialProfile={profile || undefined} />
      </div>
    </main>
  );
}