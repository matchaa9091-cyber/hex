export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reviews & Trust | How We Verify Profiles on Hex Escorts UG",
  description:
    "How profile verification works on Hex Escorts UG, how to read ratings and feedback, and how to report a listing. Honest information, no invented testimonials.",
  keywords:
    "verified escorts Uganda reviews, escort profile verification, Hex Escorts trust, report fake profile Uganda, companion feedback",
  alternates: { canonical: "https://www.hexescortsug.com/reviews" },
};

const schema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Reviews & Trust on Hex Escorts UG",
      description: "How verification, ratings and reporting work on the Hex Escorts UG directory.",
      url: "https://www.hexescortsug.com/reviews",
      datePublished: "2026-11-17",
      dateModified: "2026-11-17",
      author: { "@type": "Organization", name: "Hex Escorts Uganda", url: "https://www.hexescortsug.com" },
      publisher: { "@type": "Organization", name: "Hex Escorts Uganda", url: "https://www.hexescortsug.com" },
      mainEntityOfPage: "https://www.hexescortsug.com/reviews",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hexescortsug.com/" },
        { "@type": "ListItem", position: 2, name: "Reviews & trust", item: "https://www.hexescortsug.com/reviews" },
      ],
    },
  ],
});

const sections = [
  {
    heading: "What we mean by verified",
    body: "Verification means a profile has been reviewed before publication: the photos, the written details and the contact information are checked for consistency. It is a screening step, not a promise about any individual booking. A verified badge tells you the listing passed our review; it does not replace the short confirmation routine described in our safe booking checklist.",
  },
  {
    heading: "How to read ratings and feedback",
    body: "Some profiles show a rating or feedback from earlier clients. Treat these as one signal among several rather than a final verdict. Read the wording, look at the date, and compare it with the rest of the profile. A single glowing line says less than a profile whose details are consistent, whose photos match the description and whose answers to your questions are clear.",
  },
  {
    heading: "Why we do not publish invented testimonials",
    body: "You will not find anonymous, generic testimonials on this page. Fake reviews are misleading and are treated as spam by search engines. Where feedback is shown on a profile, it belongs to that listing and should be read in context. If you have a genuine experience to report, contact us directly — we would rather investigate one real report than display a hundred unverifiable quotes.",
  },
  {
    heading: "How to leave feedback or report a problem",
    body: "Use the report option on any profile if something looks wrong: an impersonation, a mismatched photo, a rate that changed, or behaviour that made you uncomfortable. Include the profile name and a short description of what happened. Reports are reviewed and patterns across reports are how problem listings are removed. Feedback that helps keep the directory accurate is always welcome.",
  },
  {
    heading: "Keeping the directory trustworthy",
    body: "Trust is maintained by three things: screening profiles before they go live, listening to reports from visitors, and removing listings that no longer meet the standard. We also mark unknown location pages as noindex so that thin or duplicate pages do not clutter search results. The result is a directory where the pages you find are the ones worth reading.",
  },
  {
    heading: "Your part in the process",
    body: "Confirm the person, the rate, the meeting type and the location before you travel. Keep your own transport, protect your privacy and never share personal details beyond what the meeting requires. If you are new to this, read the safe booking checklist or the rates and booking guide first. A few minutes of preparation prevents most problems.",
  },
];

const faqs = [
  {
    question: "Does a verified badge guarantee a booking will go well?",
    answer:
      "No. Verification means the listing passed our review. It does not replace confirming identity, rate, meeting point and timing directly with the companion before you meet.",
  },
  {
    question: "Can I trust the ratings on a profile?",
    answer:
      "Ratings are one signal, not a verdict. Read the wording and date, and compare them with the rest of the profile and the answers you receive.",
  },
  {
    question: "How do I report a suspicious profile?",
    answer:
      "Use the report option on the profile or contact our support team with the profile name and a short description. Reports are reviewed and problem listings are removed.",
  },
  {
    question: "Why are there no testimonials on this page?",
    answer:
      "Because invented testimonials are misleading and count as spam. Genuine feedback belongs on the specific profile and can be supported by a real report.",
  },
];

const Page = () => (
  <div className="container mx-auto px-4 py-6 lg:pl-72">
    <div className="lg:hidden h-16" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
    <article className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link href="/" prefetch={false} className="hover:text-pink-400">Home</Link>
        <span className="mx-2">/</span>
        <span>Reviews &amp; trust</span>
      </nav>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">Trust centre · 5 min read</p>
      <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">Reviews, verification and trust</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        A directory is only as useful as the trust you can place in its listings. Here is exactly
        what verification means here, how to read feedback, and how to report something that is not right.
      </p>

      {sections.map((section, index) => (
        <section key={section.heading} className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">{index + 1}. {section.heading}</h2>
          <p className="leading-relaxed text-muted-foreground">{section.body}</p>
        </section>
      ))}

      <aside className="my-8 rounded-lg border border-pink-500/20 bg-muted/30 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pink-400">Related pages</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          <li><Link href="/guides/safe-booking-checklist" prefetch={false} className="text-sm text-pink-300 hover:underline">Safe booking checklist</Link></li>
          <li><Link href="/price-guide" prefetch={false} className="text-sm text-pink-300 hover:underline">Rates &amp; booking guide</Link></li>
          <li><Link href="/faq" prefetch={false} className="text-sm text-pink-300 hover:underline">Frequently asked questions</Link></li>
          <li><Link href="/about" prefetch={false} className="text-sm text-pink-300 hover:underline">About Hex Escorts UG</Link></li>
          <li><Link href="/category/vip" prefetch={false} className="text-sm text-pink-300 hover:underline">VIP companions</Link></li>
          <li><Link href="/escorts-in" prefetch={false} className="text-sm text-pink-300 hover:underline">Browse all profiles</Link></li>
        </ul>
      </aside>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Common questions</h2>
        <div className="space-y-5">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="mb-1 font-semibold text-white">{faq.question}</h3>
              <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  </div>
);

export default Page;
