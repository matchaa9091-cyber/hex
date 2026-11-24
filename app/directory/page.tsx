import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllProfiles } from "@/data/allProfiles";
import { CITY_AREAS, KAMPALA_AREAS } from "@/lib/locationMatcher";
import { CATEGORY_SLUGS, categoryPath, getCategorySeo } from "@/data/categorySeo";
import { slugify } from "@/lib/utils";
import { GUIDES } from "@/data/guides";
import { PROFILE_TYPE_OPTIONS, PROFILE_TYPE_PAGES } from "@/lib/profile-type";

// Render fresh so new profiles appear in the directory immediately. The worker
// edge cache (keyed by the DO generation) absorbs repeat traffic.
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Full Uganda Directory | Profiles, Cities, Areas & Categories",
  description:
    "Browse every verified profile, city, Kampala neighbourhood and category on Hex Escorts UG. Direct links to all locations and companion categories across Uganda.",
  keywords:
    "Uganda escort directory, all Kampala areas, escorts by city, escort categories Uganda, verified profiles directory",
  alternates: { canonical: "https://www.hexescortsug.com/directory" },
};

const POPULAR_SUBURBS = [
  "kololo", "nakasero", "ntinda", "bugolobi", "kisaasi", "muyenga", "munyonyo",
  "makindye", "kasubi", "kawempe", "kyanja", "namasuba", "mengo", "rubaga",
  "old-kampala", "namugongo", "kiwatule", "makerere", "bukoto", "kitende",
];

function LinkGrid({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            prefetch={false}
            className="block rounded border border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-pink-500/40 hover:text-pink-300"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function DirectoryPage() {
  let profiles: { name: string; slug: string }[] = [];
  try {
    const data = await fetchAllProfiles(undefined, true);
    const seen = new Set<string>();
    profiles = data
      .map((profile) => ({ name: profile.name, slug: slugify(profile.name) }))
      .filter((item) => {
        if (!item.slug || seen.has(item.slug)) return false;
        seen.add(item.slug);
        return true;
      });
  } catch {
    profiles = [];
  }

  const cities = Array.from(new Set(Object.keys(CITY_AREAS).map((city) => slugify(city)))).sort();
  const suburbs = Array.from(new Set(KAMPALA_AREAS.map((area) => slugify(area)).filter((area) => area && area !== "kampala"))).sort();
  const focusSuburbs = Array.from(new Set([...POPULAR_SUBURBS, ...suburbs.slice(0, 12)]))
    .filter((slug) => suburbs.includes(slug));

  const categoryLinks = CATEGORY_SLUGS.map((slug) => ({
    label: `${getCategorySeo(slug)?.name || slug} companions`,
    href: `/category/${slug}`,
  }));

  const categoryCityLinks = CATEGORY_SLUGS.flatMap((category) =>
    cities.map((city) => ({
      label: `${getCategorySeo(category)?.name || category} in ${city.replace(/-/g, " ")}`,
      href: categoryPath(category, city),
    }))
  );

  const categorySuburbLinks = CATEGORY_SLUGS.flatMap((category) =>
    focusSuburbs.map((suburb) => ({
      label: `${getCategorySeo(category)?.name || category} in ${suburb.replace(/-/g, " ")}`,
      href: categoryPath(category, `kampala/${suburb}`),
    }))
  );

  const profileTypeLinks = PROFILE_TYPE_OPTIONS.map((option) => ({
    label: PROFILE_TYPE_PAGES[option.value].breadcrumb,
    href: PROFILE_TYPE_PAGES[option.value].path,
  }));

  const sections = [
    {
      title: "Profile types",
      intro: "Browse independent escorts, spas and escort agencies as separate verified listings.",
      links: profileTypeLinks,
    },
    {
      title: `All verified profiles (${profiles.length})`,
      intro: "Every active profile in the directory, with a direct link to the full profile page.",
      links: profiles.map((profile) => ({ label: profile.name, href: `/profile/${profile.slug}` })),
    },
    {
      title: `Cities (${cities.length})`,
      intro: "City hubs with local introduction, FAQs and all companions available in or travelling to each city.",
      links: cities.map((city) => ({
        label: city.replace(/\b\w/g, (c) => c.toUpperCase()),
        href: `/escorts-in/${city}`,
      })),
    },
    {
      title: `Kampala neighbourhoods (${suburbs.length})`,
      intro: "Greater Kampala areas, each with local listings and links to nearby neighbourhoods.",
      links: suburbs.map((suburb) => ({
        label: suburb.replace(/\b\w/g, (c) => c.toUpperCase()),
        href: `/escorts-in/kampala/${suburb}`,
      })),
    },
    {
      title: "Companion categories",
      intro: "Browse by category across the whole country.",
      links: categoryLinks,
    },
    {
      title: `Categories by city (${categoryCityLinks.length})`,
      intro: "Combine a category with a city to narrow the list to the companions you want.",
      links: categoryCityLinks,
    },
    {
      title: `Categories by Kampala area (${categorySuburbLinks.length})`,
      intro: "Popular neighbourhood and category combinations for shorter, more relevant results.",
      links: categorySuburbLinks,
    },
    {
      title: "Travel & booking guides",
      intro: "Practical guides for Kampala, Entebbe and Jinja, plus the safe booking checklist.",
      links: GUIDES.map((guide) => ({ label: guide.title, href: `/guides/${guide.slug}` })),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 lg:pl-72">
      <div className="lg:hidden h-16" />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
          <Link href="/" prefetch={false} className="hover:text-pink-400">Home</Link>
          <span className="mx-2">/</span>
          <span>Directory</span>
        </nav>
        <h1 className="mb-4 text-3xl font-bold">The complete Hex Escorts UG directory</h1>
        <p className="mb-3 max-w-3xl leading-relaxed text-muted-foreground">
          This page is the single index of everything on the site. Use it to jump straight to a
          verified profile, a city, a Kampala neighbourhood, or a category and location
          combination. It is also the fastest way to see the full breadth of coverage across
          Kampala, Entebbe, Jinja, Mbarara, Gulu, Fort Portal and the rest of Uganda.
        </p>
        <p className="mb-10 max-w-3xl leading-relaxed text-muted-foreground">
          Every profile is reviewed before publication and shows a direct contact method, so you
          can confirm availability and rates without going through an agency. City and area pages
          include local context, common questions and links to nearby places. If you are new to the
          site, start with the safe booking checklist or the rates and booking guide before you
          contact anyone.
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mb-10">
            <h2 className="mb-1 text-xl font-semibold">{section.title}</h2>
            <p className="mb-4 text-sm text-muted-foreground">{section.intro}</p>
            <LinkGrid links={section.links} />
          </section>
        ))}

        <div className="mb-10 rounded-lg border border-pink-500/20 bg-muted/30 p-5">
          <h2 className="mb-3 text-lg font-semibold">More ways to browse</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/guides" prefetch={false} className="text-pink-300 hover:underline">Guides</Link>
            <Link href="/price-guide" prefetch={false} className="text-pink-300 hover:underline">Rates &amp; booking</Link>
            <Link href="/reviews" prefetch={false} className="text-pink-300 hover:underline">Reviews &amp; trust</Link>
            <Link href="/faq" prefetch={false} className="text-pink-300 hover:underline">FAQ</Link>
            <Link href="/escorts-in" prefetch={false} className="text-pink-300 hover:underline">Location hub</Link>
            {profileTypeLinks.map((link) => (
              <Link key={link.href} href={link.href} prefetch={false} className="text-pink-300 hover:underline">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
