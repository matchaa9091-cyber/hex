export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rates & Booking Guide Uganda | What Affects Companion Pricing",
  description:
    "Understand how companion rates work in Uganda: duration, incall or outcall, location, travel time and what to confirm before you book. Clear advice, no guesswork.",
  keywords:
    "escort rates Uganda, Kampala companion prices, booking guide Uganda, incall outcall rates, escort pricing explained",
  alternates: { canonical: "https://www.hexescortsug.com/price-guide" },
};

const schema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Rates & Booking Guide for Uganda",
      description: "How companion pricing works in Uganda and what to confirm before you book.",
      url: "https://www.hexescortsug.com/price-guide",
      datePublished: "2026-11-17",
      dateModified: "2026-11-17",
      author: { "@type": "Organization", name: "Hex Escorts Uganda", url: "https://www.hexescortsug.com" },
      publisher: { "@type": "Organization", name: "Hex Escorts Uganda", url: "https://www.hexescortsug.com" },
      mainEntityOfPage: "https://www.hexescortsug.com/price-guide",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hexescortsug.com/" },
        { "@type": "ListItem", position: 2, name: "Rates & booking guide", item: "https://www.hexescortsug.com/price-guide" },
      ],
    },
  ],
});

const sections = [
  {
    heading: "Why there is no single price list",
    body: "Companion pricing in Uganda is set by each individual, not by the directory. Rates depend on the person, the services they offer, the length of the booking and where the meeting happens. A fixed national price list would be misleading, so the useful question is not “what does an escort cost?” but “what does this rate include?”. Every profile on Hex Escorts UG shows the companion's own details and contact method, so the final agreement is always direct and transparent.",
  },
  {
    heading: "Duration is the biggest factor",
    body: "Most bookings are quoted for a defined block of time: a short visit, an evening, or an overnight. The starting time matters as much as the duration. Agree when the booking begins and when it ends, and ask how much notice is needed to extend it. If you are unsure how long you need, say so at the start rather than negotiating at the end of the meeting.",
  },
  {
    heading: "Incall or outcall changes the calculation",
    body: "An incall booking takes place at the companion's location and usually avoids travel time. An outcall means the companion travels to your hotel or residence, which can add transport cost and travel time. In Kampala, crossing the city in the evening can take far longer than expected, so a companion may charge more for a late outcall to Munyonyo than a short trip within Ntinda. Confirm the meeting type explicitly and ask whether transport is included.",
  },
  {
    heading: "Location and timing matter",
    body: "Kampala, Entebbe and Jinja each have different patterns. Airport-area bookings in Entebbe are often shaped by flight times, while Jinja bookings are usually tied to weekend stays. Late-night and last-minute requests may cost more simply because fewer companions are available. Reading the area guides before you book helps you choose a nearby profile and avoid paying for unnecessary travel.",
  },
  {
    heading: "What a clear quote should include",
    body: "A useful answer to a rate question covers five things: the total amount, the duration, the start time, the meeting type and anything charged separately. If a companion answers all five in one message, you have a reliable basis for the booking. If the answer is vague, ask again before making any plans. Never rely on a rate that was mentioned in passing or assumed from another profile.",
  },
  {
    heading: "Payment without pressure",
    body: "Agree the payment method and timing before you meet. Avoid sending money to an unverified profile, and be cautious of anyone who insists on an unusual method or a rushed transfer. A straightforward arrangement is a sign of a professional companion. If something about the payment conversation feels wrong, stop there — there is no shortage of alternatives on the directory.",
  },
  {
    heading: "Premium and VIP listings",
    body: "VIP companions are selected for a more polished booking experience: clearer communication, stronger profiles and suitability for dinners, events and travel. The rate may reflect that, but the same confirmation routine applies. Ask what is included, confirm the meeting details and treat the profile on its merits. Browse VIP companions across Uganda or narrow by city before you message.",
  },
];

const faqs = [
  {
    question: "Do all companions publish their rates?",
    answer:
      "Rates are set by each companion and shown on their own profile where available. Where a profile does not list a rate, contact the companion directly for a clear quote before making plans.",
  },
  {
    question: "Is transport included in an outcall rate?",
    answer:
      "It varies. Always ask whether transport is included, especially for late-night outcalls or longer distances between Kampala, Entebbe and Jinja.",
  },
  {
    question: "Why do late-night bookings cost more?",
    answer:
      "Fewer companions are available late at night and travel takes longer after dark. Some companions charge more for those hours; the rate should be stated clearly when you confirm.",
  },
  {
    question: "Should I pay a deposit?",
    answer:
      "Only pay in advance to someone you have verified and through a method you understand. Avoid unverified profiles and any arrangement that pressures you to transfer money quickly.",
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
        <span>Rates &amp; booking guide</span>
      </nav>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">Booking guide · 6 min read</p>
      <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">Rates &amp; booking guide for Uganda</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Pricing is personal, but the questions you should ask are not. This guide explains what
        affects a companion's rate and how to get a clear answer before you book anywhere in Uganda.
      </p>

      {sections.map((section, index) => (
        <section key={section.heading} className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold">{index + 1}. {section.heading}</h2>
          <p className="leading-relaxed text-muted-foreground">{section.body}</p>
        </section>
      ))}

      <aside className="my-8 rounded-lg border border-pink-500/20 bg-muted/30 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-pink-400">Plan the rest of your booking</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          <li><Link href="/guides/safe-booking-checklist" prefetch={false} className="text-sm text-pink-300 hover:underline">Safe booking checklist</Link></li>
          <li><Link href="/guides/kampala-by-neighbourhood" prefetch={false} className="text-sm text-pink-300 hover:underline">Kampala neighbourhoods</Link></li>
          <li><Link href="/guides/entebbe-airport-stopover" prefetch={false} className="text-sm text-pink-300 hover:underline">Entebbe airport stopover</Link></li>
          <li><Link href="/guides/jinja-weekend" prefetch={false} className="text-sm text-pink-300 hover:underline">Jinja weekend</Link></li>
          <li><Link href="/category/vip" prefetch={false} className="text-sm text-pink-300 hover:underline">VIP companions</Link></li>
          <li><Link href="/escorts-in" prefetch={false} className="text-sm text-pink-300 hover:underline">Browse all profiles</Link></li>
        </ul>
      </aside>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Rate questions answered</h2>
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
