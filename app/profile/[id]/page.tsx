import ProfileDetailPageClient from "@/screens/ProfileDetailPage";
import { fetchAllProfiles, fetchProfileById } from "@/data/allProfiles";
import type { Metadata, ResolvingMetadata } from 'next';
import { slugify } from "@/lib/utils";
import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getProfileType, PROFILE_TYPE_PAGES } from "@/lib/profile-type";
import type { ProfileType } from "@/types/profile";

export const revalidate = 60; // Cache profile page for 60 seconds
export const dynamicParams = true;

type Props = {
  params: { id: string }
}

function getProfileSeo(profile: ProfileType) {
  const profileType = getProfileType(profile);
  const page = PROFILE_TYPE_PAGES[profileType];
  const entity =
    profileType === "spa" ? "Spa" : profileType === "agency" ? "Escort Agency" : "Escort";
  const title = `${profile.name} | Verified ${entity} in ${profile.location}`;
  const description =
    profileType === "spa"
      ? `Visit ${profile.name}, a verified spa in ${profile.location}, Uganda. View pictures, services and contact details on Hex Escorts UG.`
      : profileType === "agency"
        ? `Browse ${profile.name}, a verified escort agency in ${profile.location}, Uganda. View profiles and direct contact details on Hex Escorts UG.`
        : `Book ${profile.name}, a verified companion in ${profile.location}, Uganda. View pictures and services on Hex Escorts UG.`;
  const ogDescription =
    profileType === "spa"
      ? `Visit ${profile.name}, a verified spa in ${profile.location}. Contact on Hex Escorts UG.`
      : profileType === "agency"
        ? `Browse ${profile.name}, a verified escort agency in ${profile.location}. Contact on Hex Escorts UG.`
        : `Book ${profile.name}, a verified sexy companion located in ${profile.location}. Contact on Hex Escorts UG.`;
  const keywords =
    profileType === "spa"
      ? `${profile.name}, spas ${profile.location}, massage ${profile.location}, spa Uganda, hex escorts, wellness Kampala`
      : profileType === "agency"
        ? `${profile.name}, escort agency ${profile.location}, agencies Uganda, companions Kampala, hex escorts`
        : `${profile.name}, escorts ${profile.location}, sexy girls ${profile.location}, hot girls Uganda, hex escorts, companions Uganda`;

  return { profileType, page, entity, title, description, ogDescription, keywords };
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

  const seo = getProfileSeo(profile);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `${profile.name} - Verified ${seo.entity} in ${profile.location}`,
      description: seo.ogDescription,
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
  const seo = profile ? getProfileSeo(profile) : null;
  const jsonLd = profile && seo ? {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "url": canonicalUrl,
    "dateModified": profile.updatedAt || profile.createdAt || undefined,
    "mainEntity": {
      "@type": seo.page.schemaType,
      "name": profile.name,
      "url": canonicalUrl,
      "image": profile.profileImage,
      "description": profile.description || profile.shortBio || `${profile.name} - verified ${seo.entity.toLowerCase()} in ${profile.location}, Uganda.`,
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

  const breadcrumbItems = seo
    ? [
        { label: seo.page.breadcrumb, href: seo.page.path },
        { label: profile ? profile.name : id, href: `/profile/${profileSlug}`, current: true },
      ]
    : [
        { label: "Escorts in Uganda", href: "/escorts-in" },
        { label: id, href: `/profile/${profileSlug}`, current: true },
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