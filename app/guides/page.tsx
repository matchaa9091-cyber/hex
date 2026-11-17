export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/data/guides";

export const metadata: Metadata = {
  title: "Uganda Travel & Booking Guides | Hex Escorts UG",
  description:
    "Practical guides to Kampala neighbourhoods, Entebbe airport stopovers, Jinja weekends and safe booking in Uganda. Plan properly before you travel.",
  keywords:
    "Uganda travel guides, Kampala neighbourhood guide, Entebbe stopover, Jinja weekend, safe booking Uganda",
  alternates: { canonical: "https://www.hexescortsug.com/guides" },
};

const Page = () => (
  <div className="container mx-auto px-4 py-6 lg:pl-72">
    <div className="lg:hidden h-16" />
    <div className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link href="/" prefetch={false} className="hover:text-pink-400">Home</Link>
        <span className="mx-2">/</span>
        <span>Guides</span>
      </nav>
      <h1 className="mb-4 text-3xl font-bold">Uganda travel and booking guides</h1>
      <p className="mb-8 text-muted-foreground">
        Short, practical guides written for visitors who want a clear plan. No filler: just the
        details that make an evening or a weekend run smoothly.
      </p>

      <div className="space-y-5">
        {GUIDES.map((guide) => (
          <article key={guide.slug} className="rounded-lg border border-pink-500/20 bg-muted/20 p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-pink-400">
              {guide.eyebrow} · {guide.readTime}
            </p>
            <h2 className="mb-2 text-xl font-semibold">
              <Link href={`/guides/${guide.slug}`} prefetch={false} className="hover:text-pink-400">
                {guide.title}
              </Link>
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
            <Link href={`/guides/${guide.slug}`} prefetch={false} className="text-sm font-medium text-pink-400 hover:underline">
              Read guide →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-pink-500/20 bg-muted/30 p-5">
        <h2 className="mb-3 text-lg font-semibold">More useful pages</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          <li><Link href="/price-guide" prefetch={false} className="text-sm text-pink-300 hover:underline">Rates &amp; booking guide</Link></li>
          <li><Link href="/reviews" prefetch={false} className="text-sm text-pink-300 hover:underline">Reviews &amp; trust</Link></li>
          <li><Link href="/faq" prefetch={false} className="text-sm text-pink-300 hover:underline">Frequently asked questions</Link></li>
          <li><Link href="/escorts-in" prefetch={false} className="text-sm text-pink-300 hover:underline">Browse all profiles</Link></li>
        </ul>
      </div>
    </div>
  </div>
);

export default Page;
