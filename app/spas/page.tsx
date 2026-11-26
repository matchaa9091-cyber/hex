import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { fetchAllProfiles, getGlobalShuffleSeed } from "@/data/allProfiles";
import { buildItemListSchema } from "@/lib/listingSchema";
import { getProfileType, PROFILE_TYPE_PAGES } from "@/lib/profile-type";
import ProfileTypePage from "@/screens/ProfileTypePage";

export const revalidate = 60;

const page = PROFILE_TYPE_PAGES.spa;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  alternates: { canonical: `https://www.hexescortsug.com${page.path}` },
};

export default async function Page() {
  const seed = getGlobalShuffleSeed();
  const rawProfiles = await fetchAllProfiles(seed);
  const spaProfiles = rawProfiles.filter((profile) => getProfileType(profile) === "spa");
  const itemListSchema = buildItemListSchema(spaProfiles, page.schemaName, page.schemaType);

  return (
    <main className="spa-executive-page min-h-screen pt-4 pb-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: page.breadcrumb, href: page.path, current: true }]} />
        {itemListSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
          />
        )}
        <ProfileTypePage
          profileType="spa"
          initialProfiles={rawProfiles}
          shuffleSeed={seed}
        />
      </div>
    </main>
  );
}
