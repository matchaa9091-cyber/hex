export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideLink {
  label: string;
  href: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  eyebrow: string;
  readTime: string;
  published: string;
  intro: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  cityHub: GuideLink;
  categoryHub: GuideLink;
  nearby: GuideLink[];
}

/**
 * Static, editorial content. No D1/profile access here so these pages stay
 * cheap to render and can be cached at the edge like the other static routes.
 */
export const GUIDES: Guide[] = [
  {
    slug: "kampala-by-neighbourhood",
    title: "Kampala by Neighbourhood: A Practical Guide for Visitors",
    description:
      "Kololo, Nakasero, Ntinda, Bugolobi, Kisaasi, Muyenga and Munyonyo explained. Where to stay, how to move around, and when each Kampala area is at its best.",
    keywords:
      "Kampala neighbourhoods guide, Kololo escorts, Ntinda call girls, Bugolobi Kampala, Kisaasi, Muyenga, Munyonyo, Kampala travel guide",
    eyebrow: "City guide",
    readTime: "8 min read",
    published: "2026-11-17",
    intro:
      "Kampala is not one city in the way a visitor might expect. It is a cluster of hills and valleys, each with its own hotels, restaurants, traffic patterns and social rhythm. Choosing the right neighbourhood makes the difference between a relaxed evening and an hour spent stuck on Jinja Road. This guide breaks the city into practical areas for short-stay visitors, business travellers and anyone planning a discreet booking.",
    sections: [
      {
        heading: "Why the neighbourhood matters more than the city centre",
        paragraphs: [
          "Most first-time visitors book a hotel in the central business district because it sounds convenient. In practice, the city centre is a working area during the day and empties out quickly after six in the evening. Restaurants close early, the streets are less lively, and the hills make short distances feel much longer than they look on a map.",
          "The areas that work best for an evening out are the residential and entertainment pockets a short drive from the centre: Kololo, Nakasero, Ntinda, Bugolobi, Kisaasi, Muyenga and Munyonyo. Each has a different character, and each suits a different kind of visit. Decide what kind of evening you want first, then choose the area that fits it.",
          "The same logic applies to companionship bookings. A companion based in Ntinda may be a poor match for a hotel in Munyonyo at short notice, not because of willingness but because of distance and evening traffic. Checking the area before you message saves time on both sides.",
        ],
      },
      {
        heading: "Kololo and Nakasero: executive and quiet",
        paragraphs: [
          "Kololo and Nakasero are the closest areas to the centre that still feel residential. They are home to embassies, executive hotels, quiet restaurants and a calm evening atmosphere. Kololo is hilly and leafy, with several long-established hotels and apartments. Nakasero is more compact, with better walking access to the centre and a handful of reliable restaurants.",
          "These areas suit business travellers, older visitors and anyone who prefers a low-key dinner over a loud night out. Outcall bookings are straightforward because most hotels are used to receiving visitors and the roads are well known to drivers. Confirm the exact hotel name and the room arrangement in advance, since some hotels require the guest to meet visitors in the lobby.",
          "If you are staying in Kololo or Nakasero, browse companions based in the central and northern suburbs rather than the far south of the city. The shorter the distance, the more realistic a same-evening booking becomes.",
        ],
        bullets: [
          "Best for: business dinners, quiet hotel meets, early starts",
          "Typical stay: executive hotels and serviced apartments",
          "Book ahead if: you need an outcall after 21:00",
        ],
      },
      {
        heading: "Ntinda, Bukoto and Makerere: the social belt",
        paragraphs: [
          "Ntinda is the most active of Kampala's northern suburbs. It has a dense mix of bars, restaurants, guesthouses and short-let apartments, and it stays lively later than the centre. Bukoto and Makerere sit next to it and share much of the same energy, with a slightly more local feel around the university area.",
          "This belt suits visitors who want options within walking distance and do not want to commit to one venue for the whole evening. It is also where many independent companions are based, so the pool of nearby profiles is larger. That matters for same-day availability: more local options mean a shorter travel time and a more reliable arrival.",
          "The trade-off is noise. Some roads in Ntinda remain busy late into the night, so choose accommodation a street or two away from the main road if you value sleep. For a booking, agree on a precise meeting point rather than a general area, because several venues share similar names.",
        ],
      },
      {
        heading: "Bugolobi: the practical middle ground",
        paragraphs: [
          "Bugolobi sits between the centre and the northern suburbs and is one of the easiest areas to move around. It has a good concentration of hotels, apartments, restaurants and a supermarket, which makes it convenient for visitors staying more than a night. It is quieter than Ntinda but more active than Kololo after dark.",
          "Bugolobi works particularly well for a first trip to Kampala. You are close enough to the centre for daytime meetings, close enough to Ntinda for an evening out, and far enough from the main traffic arteries to avoid the worst gridlock. For outcall planning, it is a useful base because companions travelling from either direction can reach it in reasonable time.",
          "When you compare profiles, treat Bugolobi as a central meeting point rather than a strict location filter. A companion based in Kisaasi or Ntinda can usually reach Bugolobi with enough notice, while a companion in Munyonyo may need a longer window in the evening.",
        ],
      },
      {
        heading: "Kisaasi, Muyenga and Munyonyo: the southern hills",
        paragraphs: [
          "Kisaasi has become one of Kampala's most talked-about areas, with new restaurants, bars and guesthouses spread across the hill. It has a younger, more social atmosphere and is popular with visitors who want a lively evening without going downtown. Muyenga and Munyonyo are further south, closer to the lake, and are known for weekend stays, lakeside dinners and a slower pace.",
          "The southern hills are beautiful but they are also the most sensitive to traffic. A journey that takes fifteen minutes in the morning can take close to an hour in the evening, particularly around the junctions that feed onto Entebbe Road. If you are meeting someone in Muyenga or Munyonyo, set a generous arrival window and confirm the plan earlier in the day.",
          "These areas reward planning. Stay where you intend to spend the evening, or choose a companion already based nearby. Trying to cross Kampala twice in one night is the most common reason a booking runs late.",
        ],
      },
      {
        heading: "Getting around without wasting the evening",
        paragraphs: [
          "Ride-hailing apps are the most reliable way to move between Kampala's neighbourhoods. Agree the pickup point in advance using a landmark rather than a pin alone, because several hills have one-way systems and drivers may not be able to stop where you expect. Keep your phone charged and share your live location when meeting someone new.",
          "Allow more time than you think you need. Kampala traffic is unpredictable around Jinja Road, Entebbe Road and the city centre, and rain makes it worse. A sensible rule is to add thirty minutes to any evening journey and to confirm availability with your companion rather than assuming a quick cross-city trip is possible.",
          "If you are arriving from Entebbe, read the separate airport stopover guide before you plan the first night. The airport-to-city journey can take anywhere from forty minutes to more than two hours depending on the time of day.",
        ],
        bullets: [
          "Use a ride-hailing app with a named pickup landmark",
          "Add 30 minutes to every evening journey",
          "Confirm the meeting point, not just the neighbourhood",
          "Keep data and battery available for last-minute changes",
        ],
      },
      {
        heading: "Choosing a neighbourhood for a first booking",
        paragraphs: [
          "For a first booking, pick an area you already know or a hotel you have used before. Familiar surroundings make it easier to communicate clearly and to notice when something is different. Avoid meeting in a place neither party knows, especially late at night.",
          "Read the profile for location details and ask directly whether the companion offers incall or outcall in your chosen area. A clear answer before you travel is worth more than a cheaper rate agreed in a hurry. Check our safe booking checklist for the full pre-meeting routine.",
          "Finally, keep the arrangement private on both sides. Do not share personal details beyond what is needed for the meeting, and do not photograph or record anyone without their permission. Discretion is the basis of a good experience in Kampala as much as anywhere else.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which Kampala area is best for a first-time visitor?",
        answer:
          "Bugolobi and Kololo are the easiest starting points. Both have reliable hotels, straightforward transport and a calmer atmosphere than the centre, while still being close to Ntinda and the northern suburbs.",
      },
      {
        question: "How long does it take to cross Kampala in the evening?",
        answer:
          "Allow 30 to 60 minutes for most cross-city journeys, and longer in heavy rain or around Jinja Road and Entebbe Road. Confirm timing with your companion rather than relying on a morning journey time.",
      },
      {
        question: "Are outcalls common in Kampala hotels?",
        answer:
          "Yes. Most central and suburban hotels are used to receiving visitors. Ask about lobby meet-ups, ID requirements and any visitor policy when you confirm the booking.",
      },
      {
        question: "Is Ntinda better than Kololo for a night out?",
        answer:
          "Ntinda has more bars and a later, more social atmosphere. Kololo is quieter and better for a relaxed dinner. Neither is better in absolute terms; it depends on the kind of evening you want.",
      },
    ],
    cityHub: { label: "Kampala escorts", href: "/escorts-in/kampala" },
    categoryHub: { label: "VIP companions in Uganda", href: "/category/vip" },
    nearby: [
      { label: "Ntinda escorts", href: "/escorts-in/kampala/ntinda" },
      { label: "Bugolobi escorts", href: "/escorts-in/kampala/bugolobi" },
      { label: "Muyenga escorts", href: "/escorts-in/kampala/muyenga" },
      { label: "Entebbe escorts", href: "/escorts-in/entebbe" },
    ],
  },
  {
    slug: "entebbe-airport-stopover",
    title: "Entebbe Airport Stopover: What to Confirm Before You Land",
    description:
      "A practical plan for an Entebbe stopover: arrival timing, airport hotels, Katabi and Kajjansi, outcall planning, and the details to confirm before your flight touches down.",
    keywords:
      "Entebbe airport stopover, Entebbe escorts, airport hotel outcall, Katabi, Kajjansi, Entebbe Road, Uganda arrival guide",
    eyebrow: "City guide",
    readTime: "7 min read",
    published: "2026-11-17",
    intro:
      "Entebbe is the first and last place many visitors see in Uganda. Flights arrive late, passengers are tired, and the distance to Kampala can feel much longer than the map suggests. A short stopover does not have to be improvised. With a few decisions made before you land, you can turn a transit night into a calm, private and well-organised stay.",
    sections: [
      {
        heading: "Work out your real arrival window",
        paragraphs: [
          "Start with the scheduled landing time, then add time for Immigration, baggage and the walk to the arrivals hall. At busy periods this can take an hour or more. If you are connecting to another flight, check whether your baggage is checked through and whether you need to clear Immigration at all.",
          "Once you know when you will be free, work backwards. If you want someone to meet you at the hotel, give them the flight number and your expected time at the hotel rather than the landing time. A companion travelling from Kampala needs a realistic departure window, especially if your arrival is after dark.",
          "For very late arrivals, arrange everything before you fly. Airport Wi-Fi is not guaranteed to work when you need it, and a last-minute message after midnight is far less likely to get a clear answer than a confirmed plan made the day before.",
        ],
      },
      {
        heading: "Choosing where to stay near the airport",
        paragraphs: [
          "Entebbe accommodation falls into three practical groups. Airport-area hotels are the most convenient for an early flight and usually have 24-hour reception. Entebbe town has a wider choice of guesthouses and restaurants, with a short drive to the airport. Katabi and Kajjansi sit on the road towards Kampala and suit visitors who want a quieter lakeside base.",
          "If your priority is sleep before a morning departure, stay near the airport. If you have a full day or an overnight stopover, Entebbe town or Katabi gives you more room to move and a better selection of nearby profiles. The additional drive is usually worth it for a longer stay.",
          "Check whether the hotel has a visitor policy before you book. Most are relaxed, but some require a name at reception or a lobby meet-up. Knowing this in advance avoids an awkward conversation at the front desk.",
        ],
        bullets: [
          "Early flight: airport-area hotel",
          "Full stopover: Entebbe town or Katabi",
          "Quiet lakeside base: Kajjansi and Entebbe Road",
        ],
      },
      {
        heading: "Planning an outcall around a short stay",
        paragraphs: [
          "Outcalls in Entebbe are practical because most hotels are used to short-stay guests. The key is precision. Share the hotel name, the room type, your expected arrival time and whether you will be alone. Ask the companion to confirm travel time from their location before you agree on a start time.",
          "If you are arriving from Kampala, remember that the road can be slow in the evening and around the airport approach. A companion leaving central Kampala at six in the evening may take much longer than someone already in Entebbe or Wakiso. Local profiles are the safest choice for short-notice stopovers.",
          "Keep the first contact simple. Confirm the basics first: availability, rate, duration, meeting point and whether transport is included. Details can be refined later, but a clear first message prevents most misunderstandings.",
        ],
      },
      {
        heading: "What to confirm before your flight lands",
        paragraphs: [
          "Before you board, send a short message with your flight number, hotel and rough arrival window. Ask for a yes or no on availability rather than an open-ended reply. If you get a clear answer, confirm the rate and duration in the same conversation so nothing is left to assume when you are tired.",
          "Save the contact details offline. Screenshot the conversation and the profile so you can refer to it without relying on data roaming. If your phone will not work in Uganda, arrange a local number or WhatsApp access before you travel.",
          "Finally, decide what you will do if the flight is delayed. Agree a cutoff time with the companion and a simple way to reschedule. A plan that accounts for delay is far more reliable than one that assumes everything runs to schedule.",
        ],
        bullets: [
          "Flight number and expected hotel arrival time",
          "Rate, duration and what is included",
          "Hotel visitor policy and meeting point",
          "Delay cutoff and reschedule plan",
        ],
      },
      {
        heading: "Filling the hours between arrival and departure",
        paragraphs: [
          "Entebbe has more to offer than an overnight transit stop. The lakeside, the botanical gardens and the town centre are all close enough for a short visit if you have a few hours to spare. A relaxed afternoon makes more sense than a rushed drive into Kampala and back for a brief stopover.",
          "If you do want to visit Kampala, treat it as a separate plan with its own timing. Read the Kampala neighbourhood guide before you commit, because the city is best enjoyed when you have an evening free rather than a two-hour window.",
          "For a genuine short stopover, the simplest plan is usually the best: stay near the airport or in town, confirm one booking in advance, and leave enough time to rest before the next flight.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I book an Entebbe escort for a late arrival?",
        answer:
          "Often, yes, but confirm before you fly. Give the companion your flight number and expected hotel arrival time, and agree a cutoff if the flight is delayed.",
      },
      {
        question: "How far is Entebbe from Kampala?",
        answer:
          "Roughly 40 kilometres, but the journey varies widely. Allow 45 minutes in good conditions and considerably longer in the evening or during rain.",
      },
      {
        question: "Which area is best for an airport stopover?",
        answer:
          "Airport-area hotels for an early departure, Entebbe town for a full stopover, and Katabi or Kajjansi for a quieter lakeside stay with easier access to local profiles.",
      },
      {
        question: "Do Entebbe hotels allow visitors?",
        answer:
          "Most do, but policies differ. Ask about visitor ID, lobby meet-ups and any additional charge when you book your room.",
      },
    ],
    cityHub: { label: "Entebbe escorts", href: "/escorts-in/entebbe" },
    categoryHub: { label: "VIP companions", href: "/category/vip" },
    nearby: [
      { label: "Kajjansi escorts", href: "/escorts-in/kampala/kajjansi" },
      { label: "Katabi escorts", href: "/escorts-in/kampala/katabi" },
      { label: "Kampala escorts", href: "/escorts-in/kampala" },
      { label: "Wakiso escorts", href: "/escorts-in/wakiso" },
    ],
  },
  {
    slug: "jinja-weekend",
    title: "Jinja Weekend: Nile Lodges, Transport and Evening Planning",
    description:
      "Plan a Jinja weekend properly: how to get there from Kampala, where to stay around the Nile, which neighbourhoods to know, and how to organise a discreet evening.",
    keywords:
      "Jinja weekend guide, Jinja escorts, Nile lodges Uganda, Njeru, Bugembe, Kakira, Jinja nightlife, Kampala to Jinja",
    eyebrow: "City guide",
    readTime: "8 min read",
    published: "2026-11-17",
    intro:
      "Jinja is Uganda's weekend escape: white water, river lodges, a compact town centre and a slower pace than Kampala. It also attracts visitors who want one evening of company after a day on the Nile. The town is small enough to understand quickly, but transport and timing still matter. This guide covers the practical details so your weekend runs smoothly.",
    sections: [
      {
        heading: "Getting from Kampala to Jinja",
        paragraphs: [
          "Jinja is roughly 80 kilometres east of Kampala. By road, the journey usually takes two to three hours, depending on the time of day and the condition of the road out of the city. Leaving Kampala before the morning traffic builds makes a noticeable difference. Friday afternoon departures are the slowest.",
          "Private transport is the most flexible option for a weekend because it lets you stop where you like and return late without depending on a schedule. Public transport and shared vehicles are cheaper but less predictable, particularly for an evening return. If you plan to meet someone in the evening, arrange your own transport before you leave.",
          "If you are combining Jinja with other stops in eastern Uganda, allow a full day rather than a morning. The roads are fine, but the junctions and small towns along the way add time that is easy to underestimate.",
        ],
      },
      {
        heading: "Where to stay: river lodges versus town hotels",
        paragraphs: [
          "Jinja accommodation splits broadly into riverside lodges and town hotels. Lodges near the Nile are ideal if the point of the trip is the river itself: early starts, boat trips and a quiet evening with a view. They are often some distance from the centre, so plan transport for anything after dark.",
          "Town hotels are better if you want restaurants, bars and company within easy reach. The centre around Main Street is compact and walkable in daylight, and most meeting points are a short drive away. For a first weekend, a town hotel is the lower-effort choice.",
          "A hybrid works well for longer stays: two nights at a lodge for the river, then one night in town before the drive back. It gives you both experiences without spending the whole weekend in a vehicle.",
        ],
        bullets: [
          "River lodge: scenery, quiet, early starts",
          "Town hotel: restaurants, short transfers, easier evening plans",
          "Two-to-one split: best of both for a three-night stay",
        ],
      },
      {
        heading: "The neighbourhoods worth knowing",
        paragraphs: [
          "Jinja town centre is compact, with Main Street as its spine. Njeru sits across the river and is a short drive from the centre, with its own hotels and a more local feel. Bugembe and Kakira lie to the north-east and are associated with the sugar belt and a quieter residential setting. Walukuba and Masese are closer to the water and the industrial edges of town.",
          "For a visitor, the useful distinction is simple: stay in or near the centre if you want evening options, and use Njeru or Bugembe only if your accommodation or companion is already there. Crossing between areas is possible, but it adds a transfer to every plan.",
          "When you browse profiles, look for location details that match where you are staying. A companion based in Jinja town is a far better fit for a central hotel than one who would need to travel in from a distant lodge or from Kampala at short notice.",
        ],
      },
      {
        heading: "Planning the evening without over-planning",
        paragraphs: [
          "Jinja evenings are relaxed compared with Kampala, but they still need a basic structure. Decide where you will eat, where you will meet and how you will get back before you head out. Confirm the meeting point in the afternoon rather than after dinner, when phone battery and data may be low.",
          "If you are staying at a lodge away from town, ask reception about transport after dark. Not every property has a vehicle on site, and ride-hailing coverage can be thinner outside the centre. Arrange a driver in advance if you intend to be out late.",
          "Keep the booking itself straightforward. Confirm availability, rate, duration and whether the meeting is incall or outcall. A companion travelling to a riverside lodge needs the exact property name and a realistic arrival window, especially if the road is unlit.",
        ],
      },
      {
        heading: "What to do with the rest of the weekend",
        paragraphs: [
          "The Source of the Nile, boat cruises and white-water activities are the obvious daytime draws. Most operators start early, which leaves the late afternoon free for a relaxed meal and an unhurried evening. Planning the active part of the day before sunrise makes the whole weekend feel longer.",
          "If you are extending the trip, Kampala is an easy onward stop. Read the Kampala neighbourhood guide before you decide where to stay, and the airport stopover guide if you are flying out of Entebbe. Keeping the route simple makes the whole journey more enjoyable.",
          "Finally, respect the pace of the place. Jinja is a weekend town, and the best visits are the ones that leave room for the river rather than filling every hour with a plan.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long is the drive from Kampala to Jinja?",
        answer:
          "Usually two to three hours. Leave early in the morning or mid-morning to avoid the worst of the traffic out of Kampala, and allow extra time in rain.",
      },
      {
        question: "Is Jinja better for a day trip or a weekend?",
        answer:
          "A weekend is better. A day trip leaves very little time for the river and makes the evening feel rushed. Two nights gives you a full day on the water and a relaxed evening in town.",
      },
      {
        question: "Where should I stay for evening companionship in Jinja?",
        answer:
          "A hotel near the town centre keeps transfers short and gives you more nearby profiles to choose from. Riverside lodges suit a quieter stay but require transport planning after dark.",
      },
      {
        question: "Do Jinja companions travel to riverside lodges?",
        answer:
          "Some do, but confirm the exact property, travel time and transport cost in advance. Lodges outside the centre are less convenient for short-notice bookings.",
      },
    ],
    cityHub: { label: "Jinja escorts", href: "/escorts-in/jinja" },
    categoryHub: { label: "Massage companions", href: "/category/massage" },
    nearby: [
      { label: "Jinja town escorts", href: "/escorts-in/jinja" },
      { label: "Kampala escorts", href: "/escorts-in/kampala" },
      { label: "Mbarara escorts", href: "/escorts-in/mbarara" },
      { label: "VIP companions", href: "/category/vip" },
    ],
  },
  {
    slug: "safe-booking-checklist",
    title: "The Safe Booking Checklist: Verify, Confirm and Keep It Private",
    description:
      "A practical pre-meeting checklist for Uganda companionship: verify photos, confirm rates, agree incall or outcall, protect privacy, and spot the warning signs early.",
    keywords:
      "safe escort booking Uganda, verified escorts checklist, incall outcall confirm, escort verification, Kampala booking safety",
    eyebrow: "Safety guide",
    readTime: "6 min read",
    published: "2026-11-17",
    intro:
      "A good booking is mostly good communication. Almost every problem visitors run into can be traced to one of four things: a detail that was never confirmed, a photo that was never checked, a rate that was assumed, or privacy that was treated casually. This checklist turns those four areas into a short routine you can follow before every meeting in Uganda.",
    sections: [
      {
        heading: "Step one: verify the person and the profile",
        paragraphs: [
          "Start with the profile itself. Read the description, look at the photos and check that the location is consistent with where you plan to meet. A profile that claims a specific neighbourhood but cannot confirm basic details about it deserves a second look.",
          "Genuine companions are happy to confirm their identity in a way that works for both sides. Ask for a simple confirmation rather than demanding personal documents. If someone refuses every reasonable form of verification, or changes the story between messages, treat that as an answer.",
          "Our listings are reviewed before publication, but verification is a shared responsibility. Report anything that looks wrong so the profile can be checked. You can read more about the process on our reviews and trust page.",
        ],
      },
      {
        heading: "Step two: confirm the rate and what it covers",
        paragraphs: [
          "Never assume what a rate includes. Confirm the total amount, the duration, the starting time and anything that might be charged separately, such as transport or an extended session. Ask in plain language and keep the answer in writing.",
          "If a quote changes at the meeting without a clear reason, you are not obliged to continue. A companion who is clear about pricing from the start is usually clear about everything else too. Our rates and booking guide explains the common pricing structures in Uganda in more detail.",
          "Agree how payment will work before you meet. Do not send money to someone you have not verified, and avoid arrangements that create pressure once you arrive.",
        ],
        bullets: [
          "Total rate and duration",
          "Start and end time",
          "Transport or travel costs",
          "Payment method and timing",
        ],
      },
      {
        heading: "Step three: agree incall or outcall explicitly",
        paragraphs: [
          "Incall means you visit the companion's location. Outcall means the companion comes to you. Both are common in Kampala, Entebbe and Jinja, but they require different planning. Mixing them up is one of the most common sources of a failed booking.",
          "For an outcall, share the exact hotel or residence, the meeting point, and whether you will be met in the lobby or at the room. Ask about travel time and confirm that the companion is comfortable with the area. Hotel visitor policies vary, so check with reception first.",
          "For an incall, ask for the general area in advance and the exact address only once you have agreed the booking. Do not arrive early and do not bring anyone who was not part of the arrangement.",
        ],
      },
      {
        heading: "Step four: protect your privacy",
        paragraphs: [
          "Share only what is needed for the meeting. A first name or initial, the meeting location and the time are usually enough. Avoid volunteering your workplace, home address or personal social accounts, and do not ask for more personal detail than you would be comfortable sharing yourself.",
          "Do not take photographs or record audio or video without explicit permission. This protects both people and is a basic condition of a discreet booking. Delete any screenshots of conversations once the arrangement is complete.",
          "Use the messaging channel you agreed on and be careful about forwarding conversation details. If you are travelling, avoid leaving booking messages on a shared device or a work account.",
        ],
        bullets: [
          "Minimum personal information",
          "No photos or recordings without permission",
          "No screenshots left on shared devices",
          "One agreed communication channel",
        ],
      },
      {
        heading: "Step five: recognise the warning signs",
        paragraphs: [
          "Walk away if someone pressures you to decide immediately, refuses to confirm the rate, changes the meeting location repeatedly, or asks for money before any verification. These behaviours are not normal and they are not worth negotiating around.",
          "Also be cautious of profiles with inconsistent details, such as an age that changes, photos that look unrelated to the description, or a location that cannot be confirmed. A short, honest profile is a better sign than a long one full of claims.",
          "If something does go wrong, report it. Use the report option on the profile or contact support. Reports are reviewed, and patterns across reports are how problematic listings are removed.",
        ],
      },
      {
        heading: "A five-minute routine before you leave",
        paragraphs: [
          "Before you leave for any meeting, run through the basics once: identity confirmed, rate confirmed, meeting point confirmed, transport arranged, phone charged. It takes five minutes and removes most of the uncertainty from the evening.",
          "Tell a trusted person where you are going in general terms, without sharing private details. Keep your own transport so you are never dependent on someone else to leave. And trust your instinct: if something feels wrong, cancel. There is always another profile and another evening.",
          "For area-specific advice, read the Kampala neighbourhood guide, the Entebbe stopover guide or the Jinja weekend guide before you travel.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should I confirm before any booking?",
        answer:
          "Identity, total rate and duration, whether it is incall or outcall, the exact meeting point, and transport if an outcall is involved. Keep the answers in writing.",
      },
      {
        question: "Is it safe to pay in advance?",
        answer:
          "Only pay in advance to someone you have verified and through a method you understand. Never send money to an unverified profile, and avoid any arrangement that creates pressure.",
      },
      {
        question: "How do I report a suspicious profile?",
        answer:
          "Use the report option on the profile or contact our support team. Include what happened and the profile name so the listing can be reviewed.",
      },
      {
        question: "What does incall and outcall mean?",
        answer:
          "Incall means you visit the companion's location. Outcall means the companion travels to your hotel or residence. Confirm which one you have agreed before making travel plans.",
      },
    ],
    cityHub: { label: "Browse verified profiles", href: "/escorts-in" },
    categoryHub: { label: "VIP companions", href: "/category/vip" },
    nearby: [
      { label: "Kampala escorts", href: "/escorts-in/kampala" },
      { label: "Entebbe escorts", href: "/escorts-in/entebbe" },
      { label: "Jinja escorts", href: "/escorts-in/jinja" },
      { label: "Full FAQ", href: "/faq" },
    ],
  },
];

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(
  GUIDES.map((guide) => [guide.slug, guide])
);

export const GUIDE_LINKS: GuideLink[] = [
  { label: "Guides hub", href: "/guides" },
  ...GUIDES.map((guide) => ({ label: guide.title, href: `/guides/${guide.slug}` })),
  { label: "Rates & booking guide", href: "/price-guide" },
  { label: "Reviews & trust", href: "/reviews" },
];
