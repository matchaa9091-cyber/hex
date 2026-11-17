import Link from "next/link";
import type { Guide, GuideLink } from "@/data/guides";
import { GUIDES } from "@/data/guides";

const BASE = "https://www.hexescortsug.com";

function LinkList({ links, title }: { links: GuideLink[]; title: string }) {
  return (
    <aside className="my-8 rounded-lg border border-pink-500/20 bg-muted/30 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pink-400">{title}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              prefetch={false}
              className="text-sm text-gray-300 underline-offset-4 transition-colors hover:text-pink-400 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

const GuidePage = ({ guide }: { guide: Guide }) => {
  const url = `${BASE}/guides/${guide.slug}`;
  const relatedGuides = GUIDES.filter((item) => item.slug !== guide.slug).map((item) => ({
    label: item.title,
    href: `/guides/${item.slug}`,
  }));

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        url,
        datePublished: guide.published,
        dateModified: guide.published,
        inLanguage: "en",
        author: {
          "@type": "Organization",
          name: "Hex Escorts Uganda",
          url: BASE,
        },
        publisher: {
          "@type": "Organization",
          name: "Hex Escorts Uganda",
          url: BASE,
        },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE}/guides` },
          { "@type": "ListItem", position: 3, name: guide.title, item: url },
        ],
      },
    ],
  });

  return (
    <div className="container mx-auto px-4 py-6 lg:pl-72">
      <div className="lg:hidden h-16" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
          <Link href="/" prefetch={false} className="hover:text-pink-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/guides" prefetch={false} className="hover:text-pink-400">Guides</Link>
          <span className="mx-2">/</span>
          <span>{guide.eyebrow}</span>
        </nav>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">
          {guide.eyebrow} · {guide.readTime}
        </p>
        <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">{guide.title}</h1>
        <p className="mb-8 text-lg text-muted-foreground">{guide.intro}</p>

        <div className="mb-6 flex flex-wrap gap-3 text-xs">
          <Link href={guide.cityHub.href} prefetch={false} className="rounded-full border border-pink-500/40 px-3 py-1 text-pink-300 hover:bg-pink-500/10">
            {guide.cityHub.label}
          </Link>
          <Link href={guide.categoryHub.href} prefetch={false} className="rounded-full border border-pink-500/40 px-3 py-1 text-pink-300 hover:bg-pink-500/10">
            {guide.categoryHub.label}
          </Link>
          <Link href="/price-guide" prefetch={false} className="rounded-full border border-pink-500/40 px-3 py-1 text-pink-300 hover:bg-pink-500/10">
            Rates &amp; booking
          </Link>
        </div>

        {guide.sections.map((section, index) => (
          <section key={section.heading} className="mb-9">
            <h2 className="mb-3 text-2xl font-semibold">
              {index + 1}. {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 60)} className="mb-4 leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <LinkList title="Find who you need" links={[guide.cityHub, guide.categoryHub, ...guide.nearby]} />

        <section className="mb-9">
          <h2 className="mb-4 text-2xl font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {guide.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="mb-1 font-semibold text-white">{faq.question}</h3>
                <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <LinkList title="Related reading" links={[...relatedGuides, { label: "Safe booking checklist", href: "/guides/safe-booking-checklist" }, { label: "Reviews & trust", href: "/reviews" }]} />

        <div className="rounded-lg border border-pink-500/20 bg-muted/30 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold">Ready to browse?</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Verified profiles, direct contacts and coverage across Uganda.
          </p>
          <Link href="/escorts-in" prefetch={false} className="inline-block rounded-md bg-pink-600 px-5 py-2 text-sm font-semibold text-white hover:bg-pink-500">
            Browse all profiles
          </Link>
        </div>
      </article>
    </div>
  );
};

export default GuidePage;
