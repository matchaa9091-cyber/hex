export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategorySeo {
  slug: string;
  name: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  body: string[];
  faqs: CategoryFaq[];
  related: string[];
}

export const CATEGORY_SEO: Record<string, CategorySeo> = {
  vip: {
    slug: "vip",
    name: "VIP",
    title: "VIP Escorts in Uganda | Verified Premium Companions",
    description:
      "Browse verified VIP escorts and premium call girls in Kampala and across Uganda. Discreet companions for dinners, events, travel, and private hotel bookings.",
    heading: "VIP Escorts in Uganda",
    intro:
      "Hand-picked premium companions for executive dinners, events, travel, and discreet private bookings.",
    body: [
      "VIP listings are for visitors who want a more polished, reliable booking experience. These companions are typically comfortable with business dinners, hotel receptions, weekend travel, and private appointments where presentation and discretion matter. Many are based in Kampala, Entebbe, and other major Ugandan cities, while others travel for pre-arranged bookings.",
      "A VIP booking is not simply a higher price. It usually means clearer communication, a more established profile, and a companion who can adapt to different social settings. Confirm the type of booking you need, the dress code, the meeting location, and the expected duration before you agree. If you need a companion for a corporate event or a full evening out, explain that in your first message.",
      "Use the city links below to see VIP companions by location, or browse the wider directory if you want to compare other categories. Always confirm the companion's identity, rate, and availability directly on WhatsApp.",
    ],
    faqs: [
      {
        question: "What makes a VIP escort different?",
        answer:
          "VIP profiles are selected for a more polished booking experience, including discretion, presentation, and suitability for dinners, events, travel, and private hotel appointments.",
      },
      {
        question: "Can I book a VIP escort for a corporate event?",
        answer:
          "Yes, many VIP companions accept dinner and event bookings. Share the date, venue, dress code, and expected duration so the companion can confirm suitability.",
      },
      {
        question: "Are VIP escorts available outside Kampala?",
        answer:
          "Some VIP companions are based in Entebbe, Jinja, Mbarara, and other cities, while others travel. Check the city links and confirm travel arrangements directly.",
      },
    ],
    related: ["massage", "curvy", "slim"],
  },
  massage: {
    slug: "massage",
    name: "Massage",
    title: "Massage Escorts in Uganda | Verified Body-to-Body Companions",
    description:
      "Find verified massage escorts and body-to-body companions in Kampala and across Uganda. Browse profiles with real photos and direct WhatsApp contacts.",
    heading: "Massage Escorts in Uganda",
    intro:
      "Verified massage companions for relaxing incall and outcall appointments in Kampala and major Ugandan cities.",
    body: [
      "Massage listings are for visitors looking for a relaxing appointment with a verified companion. Profiles may include full-body massage, body-to-body massage, deep tissue, hot oil, or other wellness services. Availability and pricing vary by companion, so read the service list carefully before you contact anyone.",
      "Some massage companions work from a private incall location, while others travel to hotels and apartments. If you are booking an outcall, confirm the exact address, the expected travel time, and whether transport is included. For incall appointments, ask about the location and the available time slots before you travel.",
      "Massage bookings work best when expectations are clear. Confirm the type of massage, the duration, the agreed rate, and any extras in advance. Use the city links below to find companions near you, or browse the VIP category for premium companions.",
    ],
    faqs: [
      {
        question: "What types of massage do companions offer?",
        answer:
          "Services vary by profile and may include full-body, body-to-body, deep tissue, hot oil, and relaxation massage. Check each profile's service list and confirm the details directly.",
      },
      {
        question: "Can I book a massage outcall to my hotel?",
        answer:
          "Many massage companions offer hotel outcalls. Confirm the exact location, travel time, and whether transport is included before booking.",
      },
      {
        question: "How long does a massage booking last?",
        answer:
          "Durations vary by companion and service. Ask about the available session lengths and the full rate before confirming the appointment.",
      },
    ],
    related: ["vip", "slim", "curvy"],
  },
  slim: {
    slug: "slim",
    name: "Slim",
    title: "Slim Escorts in Uganda | Verified Petite Call Girls",
    description:
      "Browse verified slim and petite escorts in Kampala and across Uganda. Real photos, direct WhatsApp contacts, and discreet incall or outcall bookings.",
    heading: "Slim Escorts in Uganda",
    intro:
      "Verified slim and petite companions for dinner dates, hotel outcalls, and private meetups across Uganda.",
    body: [
      "Slim listings are for visitors who prefer a petite or slender body type. The companions below are filtered from the wider directory using their profile body type, so availability changes as new profiles are added. Many are based in Kampala and the surrounding areas, with some available in Entebbe, Jinja, Mbarara, and other cities.",
      "Body type is only one part of compatibility. Read the full profile for location, services, photos, and contact details, then confirm the booking directly on WhatsApp. If you are staying at a hotel, ask whether the companion offers outcalls and how long travel will take.",
      "Use the city links below to narrow the list, or compare other categories if you want a different body type or service. Confirm the rate and meeting details before you commit.",
    ],
    faqs: [
      {
        question: "Are slim escorts available in Kampala?",
        answer:
          "Yes. Kampala has the largest selection of slim companions, including neighborhoods such as Kololo, Ntinda, Bugolobi, Kisaasi, and Muyenga. Use the city and area links to narrow the list.",
      },
      {
        question: "Can I book a slim companion for an outcall?",
        answer:
          "Many slim companions offer hotel and apartment outcalls. Confirm the exact location, travel time, and rate before booking.",
      },
      {
        question: "How do I know the body type is accurate?",
        answer:
          "Profiles include body type and photos where available. Confirm the details directly on WhatsApp if body type is important to your booking.",
      },
    ],
    related: ["curvy", "thick", "vip"],
  },
  curvy: {
    slug: "curvy",
    name: "Curvy",
    title: "Curvy Escorts in Uganda | Verified Curvy Call Girls",
    description:
      "Find verified curvy escorts in Kampala and across Uganda. Browse profiles with real photos, direct WhatsApp contacts, and discreet hotel outcalls.",
    heading: "Curvy Escorts in Uganda",
    intro:
      "Verified curvy companions for dinner dates, hotel stays, and private bookings in Kampala and major cities.",
    body: [
      "Curvy listings are for visitors who prefer a fuller, curvy body type. The profiles below are filtered from the wider directory using the body type listed by each companion. Selection is strongest in Kampala, with additional companions in Entebbe, Jinja, Mbarara, and other cities.",
      "As with any booking, use the profile to check location, services, photos, and contact details before you message. Ask about incall or outcall availability, the agreed rate, and how long the companion needs to reach your hotel or apartment. Clear expectations make the booking easier for both sides.",
      "Browse the city links below to see curvy companions by location, or compare the slim, thick, and VIP categories for other options.",
    ],
    faqs: [
      {
        question: "Where can I find curvy escorts in Uganda?",
        answer:
          "Kampala has the largest selection, with additional profiles in Entebbe, Jinja, Mbarara, and other cities. Use the city links to narrow your search.",
      },
      {
        question: "Do curvy companions offer hotel outcalls?",
        answer:
          "Many do. Confirm the hotel location, travel time, and any transport cost before confirming the booking.",
      },
      {
        question: "Are curvy profiles verified?",
        answer:
          "Profiles are reviewed before listing, and companions are encouraged to use recent photos. Confirm identity and details directly on WhatsApp.",
      },
    ],
    related: ["thick", "slim", "vip"],
  },
  thick: {
    slug: "thick",
    name: "Thick",
    title: "Thick Escorts in Uganda | Verified Voluptuous Companions",
    description:
      "Browse verified thick and voluptuous escorts in Kampala and across Uganda. Real photos, direct WhatsApp contacts, and discreet incall or outcall bookings.",
    heading: "Thick Escorts in Uganda",
    intro:
      "Verified thick and voluptuous companions for dinner dates, private meetups, and hotel outcalls across Uganda.",
    body: [
      "Thick listings are for visitors who prefer a fuller, voluptuous body type. The companions below are filtered from the wider directory using the body type listed on their profile. Kampala has the strongest selection, with additional profiles in Entebbe, Jinja, Mbarara, and other major towns.",
      "Check the full profile before booking: location, services, photos, and direct WhatsApp contact. If you need an outcall, confirm the exact hotel or apartment, the expected travel time, and whether transport is included. For incall bookings, ask for the location and available times.",
      "Use the city links below to see thick companions by area, or compare the curvy, slim, and VIP categories for other options.",
    ],
    faqs: [
      {
        question: "Are thick escorts available in Kampala?",
        answer:
          "Yes. Kampala has the largest selection of thick companions. Use the city and suburb links to find someone near your hotel or apartment.",
      },
      {
        question: "Can I book a thick companion for an overnight stay?",
        answer:
          "Overnight availability varies by companion. Ask about the overnight rate and the start and end times before confirming.",
      },
      {
        question: "Do thick companions offer outcalls?",
        answer:
          "Many do. Confirm the exact location, travel time, and any transport fee before the booking.",
      },
    ],
    related: ["curvy", "slim", "vip"],
  },
};

export const CATEGORY_SLUGS = ["vip", "massage", "curvy", "thick", "slim"] as const;

export function normalizeCategoryKey(value?: string | null): string {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/-escorts$/i, "")
    .replace(/-escorts-in$/i, "")
    .replace(/\s+/g, "-");
}

export function getCategorySeo(value?: string | null): CategorySeo | null {
  const key = normalizeCategoryKey(value);
  return key ? CATEGORY_SEO[key] || null : null;
}

export function categoryPath(category: string, location?: string): string {
  const slug = normalizeCategoryKey(category);
  return `/${slug}-escorts-in${location ? `/${location}` : ""}`;
}
