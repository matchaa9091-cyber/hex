export interface CityFaq {
  question: string;
  answer: string;
}

export interface CitySeo {
  slug: string;
  name: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  body: string[];
  nearbyAreas: { label: string; slug: string }[];
  faqs: CityFaq[];
}

// Shared static SEO copy. Keep this module free of D1/profile access so it can
// be imported by both server metadata and the client listing screen.
export const CITY_SEO: Record<string, CitySeo> = {
  kampala: {
    slug: "kampala",
    name: "Kampala",
    title: "Kampala Escorts | Verified Call Girls & VIP Companions",
    description:
      "Browse verified Kampala escorts and call girls in Kololo, Nakasero, Ntinda, Bugolobi and across the city. Real photos, direct WhatsApp, discreet outcalls.",
    heading: "Kampala Escorts",
    intro:
      "Verified companions for dinner dates, hotel outcalls, and discreet private meetups across Kampala.",
    body: [
      "Kampala is Uganda's capital and its main business, hotel, and nightlife hub. Visitors usually stay around Kololo, Nakasero, Bugolobi, Ntinda, Kisaasi, Muyenga, Munyonyo, or along Entebbe Road, and each area has a different pace. Kololo and Nakasero suit executive travel and quiet hotel meets, while Ntinda, Kisaasi, and Bukoto have a younger, more relaxed social scene. Muyenga and Munyonyo are popular for weekend stays and lakeside dinners.",
      "Our Kampala listings include independent call girls, VIP companions, massage specialists, and travelling escorts who offer incalls and outcalls. Profiles show the companion's location, photos, services, and a direct WhatsApp contact so you can confirm availability without going through an agency. If you are staying in a hotel or serviced apartment, ask about outcall availability and any transport cost before confirming the booking.",
      "Traffic can change travel times quickly, especially around Jinja Road, Entebbe Road, and the city centre. Build in extra time for evening appointments and agree the meeting point in advance. Discretion matters, so choose a companion whose profile and communication style match what you need, confirm rates clearly, and keep the arrangement private.",
      "Use the suburb filter to narrow the list to a specific neighbourhood, or browse the VIP and massage categories below for a more focused selection.",
    ],
    nearbyAreas: [
      { label: "Kololo", slug: "kololo" },
      { label: "Nakasero", slug: "nakasero" },
      { label: "Ntinda", slug: "ntinda" },
      { label: "Bugolobi", slug: "bugolobi" },
      { label: "Muyenga", slug: "muyenga" },
      { label: "Munyonyo", slug: "munyonyo" },
      { label: "Kisaasi", slug: "kisaasi" },
      { label: "Makindye", slug: "makindye" },
    ],
    faqs: [
      {
        question: "Are Kampala escorts on Hex Escorts UG verified?",
        answer:
          "Profiles are reviewed before listing, and companions are encouraged to use recent photos and clear service details. Always confirm the person and rate directly on WhatsApp before booking.",
      },
      {
        question: "Can I book an outcall to a Kampala hotel?",
        answer:
          "Many Kampala companions offer outcalls to hotels, apartments, and private residences. Ask about outcall availability, travel time, and any transport fee when you make contact.",
      },
      {
        question: "Which Kampala areas have the most listings?",
        answer:
          "Kololo, Nakasero, Ntinda, Bugolobi, Kisaasi, Muyenga, Munyonyo, and Makindye are among the most active areas. Use the suburb filter to see companions near your location.",
      },
      {
        question: "What should I confirm before meeting a companion?",
        answer:
          "Confirm the companion's identity from the profile, the agreed rate, whether the booking is incall or outcall, the meeting location, and the expected duration before you travel.",
      },
    ],
  },
  entebbe: {
    slug: "entebbe",
    name: "Entebbe",
    title: "Entebbe Escorts | Verified Call Girls & Lakeside Companions",
    description:
      "Find verified Entebbe escorts and call girls near the airport, Lake Victoria, Katabi, Kajjansi, and Entebbe Road. Real photos and direct WhatsApp contacts.",
    heading: "Entebbe Escorts",
    intro:
      "Discreet companions for airport stopovers, lakeside weekends, and hotel outcalls in Entebbe.",
    body: [
      "Entebbe is Uganda's gateway city, built around Entebbe International Airport and the shores of Lake Victoria. Travellers often stop here for a night before a flight, a lakeside weekend, or a quiet break from Kampala. The main hotel and guesthouse areas sit around the airport, Entebbe town, Katabi, Kajjansi, and along Entebbe Road, which makes outcall bookings practical for short stays.",
      "Entebbe companions are a good fit for dinner dates, sunset drinks, weekend company, and discreet hotel visits. Some profiles are based in Entebbe itself, while others travel from Kampala or Wakiso for pre-arranged outcalls. Check the profile location and ask how long the companion needs to reach your hotel, especially during airport peak hours.",
      "Because many visitors are only in the city for a short time, clear communication is important. Confirm the meeting time, the exact hotel or residence, the agreed rate, and whether transport is included. For late-night arrivals, arrange the booking before you land rather than trying to organise everything after baggage claim.",
      "Browse the Entebbe profiles below or use the nearby area links to find companions around Kajjansi, Katabi, and Entebbe Road.",
    ],
    nearbyAreas: [
      { label: "Entebbe Town", slug: "central" },
      { label: "Katabi", slug: "katabi" },
      { label: "Kajjansi", slug: "kajjansi" },
      { label: "Entebbe Road", slug: "entebbe-road" },
      { label: "Kigungu", slug: "kigungu" },
      { label: "Lweza", slug: "lweza" },
    ],
    faqs: [
      {
        question: "Can I book an Entebbe escort near the airport?",
        answer:
          "Yes. Several Entebbe companions offer outcalls to airport hotels and nearby guesthouses. Share your arrival time and hotel location so the companion can confirm timing.",
      },
      {
        question: "Do Entebbe escorts offer overnight bookings?",
        answer:
          "Many do, but availability depends on the companion. Ask directly about overnight rates, start and end times, and whether breakfast or transport is included.",
      },
      {
        question: "Are Entebbe listings available on short notice?",
        answer:
          "Short-notice bookings are sometimes possible, especially for companions already in Entebbe. Contact the profile on WhatsApp as early as you can to avoid delays.",
      },
    ],
  },
  jinja: {
    slug: "jinja",
    name: "Jinja",
    title: "Jinja Escorts | Verified Call Girls & Nile Companions",
    description:
      "Browse verified Jinja escorts and call girls near the River Nile, Njeru, Bugembe, and Jinja city. Real photos, direct WhatsApp, and discreet outcalls.",
    heading: "Jinja Escorts",
    intro:
      "Verified companions for Nile weekends, adventure trips, dinner dates, and discreet hotel meetups in Jinja.",
    body: [
      "Jinja is Uganda's adventure capital, known for the Source of the Nile, white-water rafting, boat cruises, and riverside lodges. The city also has a busy commercial centre around Main Street, with nearby areas such as Njeru, Bugembe, Kakira, Walukuba, and Masese. Visitors come for weekend breaks, corporate retreats, and stopovers on the way to eastern Uganda.",
      "A Jinja companion can join you for a relaxed dinner, a riverside evening, or a private hotel meetup after a day on the water. Profiles listed here include independent call girls, travel companions, and massage specialists, with direct WhatsApp contact so you can confirm plans without an intermediary.",
      "If you are staying at a lodge outside the city centre, arrange transport early. Boda rides are quick for short trips, but evening journeys to outlying lodges can take longer. Confirm whether your companion offers incall, outcall, or both, and agree on the meeting point before you leave.",
      "Use the links below to explore nearby areas or browse the VIP and massage categories for a more specific selection.",
    ],
    nearbyAreas: [
      { label: "Jinja City", slug: "central" },
      { label: "Njeru", slug: "njeru" },
      { label: "Bugembe", slug: "bugembe" },
      { label: "Kakira", slug: "kakira" },
      { label: "Walukuba", slug: "walukuba" },
      { label: "Masese", slug: "masese" },
    ],
    faqs: [
      {
        question: "Are Jinja escorts available for weekend bookings?",
        answer:
          "Yes. Weekend and overnight bookings are common in Jinja, especially around holidays and adventure trips. Confirm availability and the full duration in advance.",
      },
      {
        question: "Can a Jinja companion meet me at a riverside lodge?",
        answer:
          "Many companions offer outcalls to lodges and hotels. Share the lodge name and location so transport time and any travel cost can be agreed before the booking.",
      },
      {
        question: "Do Jinja escorts offer massage services?",
        answer:
          "Some profiles list massage and wellness services. Check the services section on each profile and confirm the type of massage, duration, and rate directly.",
      },
    ],
  },
  mbarara: {
    slug: "mbarara",
    name: "Mbarara",
    title: "Mbarara Escorts | Verified Call Girls in Western Uganda",
    description:
      "Find verified Mbarara escorts and call girls in Kakoba, Kamukuzi, Nyamitanga, and around the city centre. Real photos and direct WhatsApp contacts.",
    heading: "Mbarara Escorts",
    intro:
      "Discreet companions for business trips, hotel stays, and private meetups in Mbarara and western Uganda.",
    body: [
      "Mbarara is the commercial heart of western Uganda and a common stop for travellers heading to Lake Mburo, Queen Elizabeth National Park, or the Rwenzori region. The city centre, Kakoba, Kamukuzi, and Nyamitanga are the main areas for hotels, restaurants, and business meetings, while the Mbarara–Ntungamo road connects the city to the wider western corridor.",
      "Mbarara has a growing hospitality scene and a steady flow of business travellers, university visitors, and tourists. Our listings include independent companions and travelling escorts who can join you for dinner, a hotel outcall, or a longer booking. Profiles include location details and direct WhatsApp contact so you can confirm availability before you arrive.",
      "If you are passing through on a road trip, book ahead and confirm the companion's location relative to your hotel. For overnight stays, ask about start and end times and any transport arrangement. Clear, respectful communication makes the booking smoother for both sides.",
      "Explore the Mbarara profiles below or follow the nearby links to browse other western Uganda locations.",
    ],
    nearbyAreas: [
      { label: "Kakoba", slug: "kakoba" },
      { label: "Kamukuzi", slug: "kamukuzi" },
      { label: "Nyamitanga", slug: "nyamitanga" },
      { label: "Ruti", slug: "ruti" },
      { label: "Biharwe", slug: "biharwe" },
    ],
    faqs: [
      {
        question: "Are Mbarara escorts available for hotel outcalls?",
        answer:
          "Many Mbarara companions offer outcalls to hotels and guesthouses around Kakoba, Kamukuzi, Nyamitanga, and the city centre. Confirm the exact location and timing first.",
      },
      {
        question: "Can I book a Mbarara companion for a road trip?",
        answer:
          "Some companions accept travel bookings, but this depends on the profile and duration. Discuss the route, overnight arrangements, and rate directly before confirming.",
      },
      {
        question: "How do I find a verified escort in Mbarara?",
        answer:
          "Choose a profile with clear photos and location details, then message the companion directly on WhatsApp to confirm identity, services, and the agreed rate.",
      },
    ],
  },
  gulu: {
    slug: "gulu",
    name: "Gulu",
    title: "Gulu Escorts | Verified Call Girls in Northern Uganda",
    description:
      "Browse verified Gulu escorts and call girls in Bar-Dege, Layibi, Pece, and Gulu city. Real photos, direct WhatsApp, and discreet hotel outcalls.",
    heading: "Gulu Escorts",
    intro:
      "Verified companions for business travel, NGO visits, dinner dates, and discreet hotel stays in Gulu.",
    body: [
      "Gulu is the main commercial and administrative centre of northern Uganda, serving the surrounding Acholi sub-region. The city has a compact centre with hotels, restaurants, and guesthouses, plus residential areas such as Bar-Dege, Layibi, and Pece. Gulu also has an airport and a steady flow of business, NGO, and government visitors.",
      "Companions listed for Gulu include local profiles and travelling escorts who accept pre-arranged outcalls. A companion can join you for dinner, a private hotel meetup, or a longer booking during your stay. Confirm whether the profile is based in Gulu or travelling from Kampala, because that affects timing and transport cost.",
      "Gulu is generally easier to navigate than Kampala, but evening transport still needs planning. Share your hotel name and agreed meeting time, and confirm the rate before the companion travels. For first-time visitors, a short dinner date is often a comfortable way to start.",
      "Browse the Gulu profiles below or use the nearby area links to see companions around Bar-Dege, Layibi, and Pece.",
    ],
    nearbyAreas: [
      { label: "Bar-Dege", slug: "bar-dege" },
      { label: "Layibi", slug: "layibi" },
      { label: "Pece", slug: "pece" },
      { label: "Gulu City", slug: "central" },
    ],
    faqs: [
      {
        question: "Are there verified escorts in Gulu?",
        answer:
          "Yes. Listings include local companions and travelling escorts. Check the profile location and contact the companion directly to confirm availability for your dates.",
      },
      {
        question: "Can I book a Gulu escort for an overnight stay?",
        answer:
          "Overnight bookings are available with some companions. Ask about the overnight rate, start and end times, and any transport arrangement before confirming.",
      },
      {
        question: "Do Gulu companions travel from Kampala?",
        answer:
          "Some do. Travelling companions usually charge extra for transport and need more notice. Confirm this before you agree to a booking.",
      },
    ],
  },
  "fort-portal": {
    slug: "fort-portal",
    name: "Fort Portal",
    title: "Fort Portal Escorts | Verified Call Girls & Tour Companions",
    description:
      "Find verified Fort Portal escorts and call girls near the Rwenzori mountains, crater lakes, and Toro. Real photos and direct WhatsApp contacts.",
    heading: "Fort Portal Escorts",
    intro:
      "Discreet companions for tourism trips, lodge stays, and private meetups in Fort Portal and the Toro region.",
    body: [
      "Fort Portal is Uganda's tourism city, set between the Rwenzori mountains, crater lakes, tea estates, and the cultural heart of Toro. Visitors use the city as a base for gorilla trekking, crater-lake drives, and hikes around Kibale and the Rwenzori foothills. The town centre has a relaxed pace, with hotels, lodges, and guesthouses spread across areas such as Bazaar, Kitumba, Rwengoma, and Nyabukara.",
      "A Fort Portal companion can join you for dinner, a lodge evening, or a private outcall after a day of sightseeing. The listings below include local profiles and travelling escorts, with direct WhatsApp contact so you can confirm whether they are based in town or need to travel.",
      "If you are staying at a lodge outside the centre, arrange transport in advance and share the exact location. Mountain roads and evening weather can slow travel, so build in extra time. Confirm the booking duration and rate before the companion sets off.",
      "Browse the Fort Portal profiles below or use the nearby links to explore other western Uganda cities.",
    ],
    nearbyAreas: [
      { label: "Bazaar", slug: "bazaar" },
      { label: "Kitumba", slug: "kitumba" },
      { label: "Rwengoma", slug: "rwengoma" },
      { label: "Nyabukara", slug: "nyabukara" },
      { label: "Kijanju", slug: "kijanju" },
    ],
    faqs: [
      {
        question: "Can I book a Fort Portal escort for a lodge stay?",
        answer:
          "Many companions offer outcalls to lodges and hotels. Share the lodge name and location so transport time and any travel cost can be agreed in advance.",
      },
      {
        question: "Are Fort Portal escorts available for tourism trips?",
        answer:
          "Some companions accept travel bookings for crater-lake drives, Kibale trips, and longer stays. Discuss the itinerary and rate directly before confirming.",
      },
      {
        question: "Do I need to book Fort Portal companions in advance?",
        answer:
          "Advance booking is recommended, especially on weekends and holidays. Travelling companions may need several hours or a day of notice.",
      },
    ],
  },
  mbale: {
    slug: "mbale",
    name: "Mbale",
    title: "Mbale Escorts | Verified Call Girls Near Mt. Elgon",
    description:
      "Browse verified Mbale escorts and call girls in Eastern Uganda near Mt. Elgon. Real photos, direct WhatsApp, and discreet hotel outcalls.",
    heading: "Mbale Escorts",
    intro:
      "Verified companions for business trips, Mt. Elgon visits, dinner dates, and private hotel meetups in Mbale.",
    body: [
      "Mbale is the main city of eastern Uganda, sitting at the foothills of Mount Elgon. It is known for its coffee trade, cool climate, and access to Sipi Falls, Wanale, and the wider Elgon region. The city centre has a mix of hotels, restaurants, and guesthouses, with residential areas spreading toward the surrounding suburbs.",
      "Companions listed for Mbale include local profiles and travelling escorts who accept pre-arranged outcalls. Whether you are in town for business, a conference, or a hiking trip, you can browse profiles and contact companions directly on WhatsApp to confirm availability.",
      "For out-of-town lodges, share the exact location and arrange transport early. Mountain weather can change quickly, and evening travel may take longer than expected. Confirm the rate, duration, and meeting point before the booking.",
      "Explore the Mbale profiles below or use the nearby links to browse other eastern Uganda locations.",
    ],
    nearbyAreas: [
      { label: "Mbale City", slug: "central" },
      { label: "Wanale", slug: "wanale" },
      { label: "Sipi", slug: "sipi" },
      { label: "Nakaloke", slug: "nakaloke" },
    ],
    faqs: [
      {
        question: "Are there verified escorts in Mbale?",
        answer:
          "Yes. Listings include local companions and travelling escorts. Check the profile location and confirm availability directly on WhatsApp.",
      },
      {
        question: "Can I book an Mbale escort near Sipi Falls?",
        answer:
          "Some companions accept outcalls to lodges around Sipi and Wanale, but transport time and cost must be agreed first. Ask before confirming.",
      },
      {
        question: "Do Mbale escorts offer overnight bookings?",
        answer:
          "Overnight availability varies by companion. Ask about the overnight rate and the start and end times before booking.",
      },
    ],
  },
  masaka: {
    slug: "masaka",
    name: "Masaka",
    title: "Masaka Escorts | Verified Call Girls in Greater Buganda",
    description:
      "Find verified Masaka escorts and call girls in Nyendo, Kimanya, Katwe, and Masaka city. Real photos and direct WhatsApp contacts.",
    heading: "Masaka Escorts",
    intro:
      "Discreet companions for business stops, hotel stays, and private meetups in Masaka and greater Buganda.",
    body: [
      "Masaka is a historic commercial centre in greater Buganda, positioned on the main route between Kampala and western Uganda. The city has a busy central market area, hotels, and guesthouses, with nearby neighbourhoods such as Nyendo, Kimanya, and Katwe. Travellers often stop here on the way to Lake Mburo, Mbarara, or the Tanzanian border.",
      "Our Masaka listings include independent companions and travelling escorts who can meet for dinner, a hotel outcall, or a longer booking. Profiles include location details and direct WhatsApp contact so you can confirm whether the companion is based locally or travelling.",
      "If you are passing through, book ahead and confirm the meeting time against your travel schedule. For overnight stays, ask about the full rate and any transport arrangement. A short, clear conversation before the booking avoids misunderstandings.",
      "Browse the Masaka profiles below or follow the links to explore nearby cities and other regions of Uganda.",
    ],
    nearbyAreas: [
      { label: "Nyendo", slug: "nyendo" },
      { label: "Kimanya", slug: "kimanya" },
      { label: "Katwe", slug: "katwe" },
      { label: "Masaka City", slug: "central" },
    ],
    faqs: [
      {
        question: "Are Masaka escorts available for hotel outcalls?",
        answer:
          "Many companions offer outcalls to hotels and guesthouses in Masaka. Confirm the hotel location, meeting time, and rate before the booking.",
      },
      {
        question: "Can I book a Masaka companion while travelling to Mbarara?",
        answer:
          "Yes, if the timing works for the companion. Share your schedule in advance and confirm whether the booking is for a short meetup or an overnight stay.",
      },
      {
        question: "How do I verify a Masaka escort profile?",
        answer:
          "Review the photos, location, and service details, then message the companion directly to confirm identity and the agreed rate.",
      },
    ],
  },
  arua: {
    slug: "arua",
    name: "Arua",
    title: "Arua Escorts | Verified Call Girls in West Nile",
    description:
      "Browse verified Arua escorts and call girls in Arua Central, Ayivu, and across West Nile. Real photos, direct WhatsApp, and discreet hotel outcalls.",
    heading: "Arua Escorts",
    intro:
      "Verified companions for business travel, border trade, dinner dates, and discreet hotel stays in Arua.",
    body: [
      "Arua is the commercial and cultural centre of Uganda's West Nile region, with strong trade links to the Democratic Republic of Congo and South Sudan. The city has a busy central business district, hotels, guesthouses, and a growing hospitality scene. Arua Central and Ayivu are among the main areas for visitors looking for accommodation and evening entertainment.",
      "Companions listed for Arua include local profiles and travelling escorts. Business travellers, NGO staff, and residents can browse profiles and contact companions directly on WhatsApp to confirm availability. If you are staying outside the city centre, share your exact location and arrange transport in advance.",
      "Arua is a regional hub, so schedules can change quickly. Confirm the meeting time, rate, and whether the booking is incall or outcall. For overnight bookings, agree the full duration and any transport cost before the companion travels.",
      "Explore the Arua profiles below or use the nearby links to browse other northern Uganda locations.",
    ],
    nearbyAreas: [
      { label: "Arua Central", slug: "central" },
      { label: "Ayivu", slug: "ayivu" },
      { label: "Arua City", slug: "arua-city" },
    ],
    faqs: [
      {
        question: "Are there verified escorts in Arua?",
        answer:
          "Yes. Listings include local companions and travelling escorts. Check the profile location and confirm availability directly on WhatsApp.",
      },
      {
        question: "Can I book an Arua escort for a hotel outcall?",
        answer:
          "Many companions offer outcalls to hotels and guesthouses. Share the hotel name and location so timing and any transport cost can be agreed first.",
      },
      {
        question: "Do Arua companions travel from Kampala?",
        answer:
          "Some do, but travel time and cost are significant. Ask about notice, transport, and the total rate before confirming the booking.",
      },
    ],
  },
  mukono: {
    slug: "mukono",
    name: "Mukono",
    title: "Mukono Escorts | Verified Call Girls & Seeta Companions",
    description:
      "Find verified Mukono escorts and call girls in Seeta, Ntawo, Nakisunga, and along the Kampala-Jinja highway. Real photos and direct WhatsApp.",
    heading: "Mukono Escorts",
    intro:
      "Discreet companions for hotel stays, university-area meetups, and private outcalls in Mukono and Seeta.",
    body: [
      "Mukono sits on the Kampala–Jinja highway and has become a busy extension of greater Kampala. The district includes Seeta, Ntawo, Nakisunga, and other fast-growing residential and commercial areas. Universities, industry, and easy access to Kampala make Mukono popular with students, professionals, and travellers who prefer to stay outside the capital.",
      "Companions listed for Mukono include local profiles and travelling escorts who offer incalls and outcalls. Seeta is one of the most active areas, with guesthouses, restaurants, and easy transport links. If you are staying near the highway, confirm whether the companion can reach your hotel or residence without a long detour.",
      "Because Mukono is spread out, share a precise location rather than just the town name. Confirm the meeting time and rate, and allow extra time during rush hour when traffic builds toward Kampala. For overnight bookings, agree the full duration in advance.",
      "Browse the Mukono profiles below or use the nearby links to explore Seeta and other locations along the Kampala–Jinja highway.",
    ],
    nearbyAreas: [
      { label: "Seeta", slug: "seeta" },
      { label: "Ntawo", slug: "ntawo" },
      { label: "Nakisunga", slug: "nakisunga" },
      { label: "Mukono Town", slug: "central" },
    ],
    faqs: [
      {
        question: "Are there verified escorts in Mukono and Seeta?",
        answer:
          "Yes. Listings include companions based in Mukono, Seeta, and nearby areas, plus travelling escorts. Check the profile location and confirm availability first.",
      },
      {
        question: "Can I book a Mukono escort for a hotel outcall?",
        answer:
          "Many companions offer outcalls to hotels and guesthouses. Share the exact location and confirm the meeting time and any transport cost.",
      },
      {
        question: "Do Mukono companions also cover Kampala?",
        answer:
          "Some do, especially companions based along the Kampala–Jinja highway. Ask about travel time and any additional transport fee before booking.",
      },
    ],
  },
  wakiso: {
    slug: "wakiso",
    name: "Wakiso",
    title: "Wakiso Escorts | Verified Call Girls Across Greater Kampala",
    description:
      "Find verified Wakiso escorts and call girls in Kira, Nansana, Gayaza, Kasangati, and across Greater Kampala. Real photos and direct WhatsApp.",
    heading: "Wakiso Escorts",
    intro:
      "Verified companions across Wakiso's fast-growing residential and business areas.",
    body: [
      "Wakiso District encircles Kampala and includes some of Uganda's most populated residential areas, including Kira, Nansana, Gayaza Road, and Kasangati. Many visitors choose Wakiso for quieter accommodation while staying within easy reach of the capital.",
      "Our Wakiso listings include independent companions and travelling escorts who offer incalls and outcalls across the district. Profiles show location details and direct WhatsApp contact so you can confirm availability and travel time.",
      "Because Wakiso covers a large area, always share a precise location and confirm the companion's distance before booking. Evening traffic can add significant travel time, especially on Gayaza Road and the Kampala–Hoima road.",
    ],
    nearbyAreas: [
      { label: "Kira", slug: "kira" },
      { label: "Nansana", slug: "nansana" },
      { label: "Gayaza Road", slug: "gayaza-road" },
      { label: "Kasangati", slug: "kasangati" },
    ],
    faqs: [
      {
        question: "Are Wakiso escorts available for outcalls?",
        answer:
          "Many Wakiso companions offer outcalls to homes, hotels, and apartments. Confirm the exact location and travel time before booking.",
      },
      {
        question: "Which Wakiso areas are most active?",
        answer:
          "Kira, Nansana, Gayaza Road, and Kasangati are among the most active areas. Use the area links to narrow your search.",
      },
    ],
  },
  tororo: {
    slug: "tororo",
    name: "Tororo",
    title: "Tororo Escorts | Verified Call Girls in Eastern Uganda",
    description:
      "Find verified Tororo escorts and call girls near the Malaba border and Eastern Uganda. Real photos and direct WhatsApp contacts.",
    heading: "Tororo Escorts",
    intro:
      "Discreet companions for business stops, border travel, and hotel stays in Tororo.",
    body: [
      "Tororo is an industrial and border hub in Eastern Uganda, close to the Malaba crossing into Kenya. The town attracts traders, transport workers, and business travellers who need convenient accommodation and evening company.",
      "Browse verified Tororo companions for hotel visits, short meetups, and discreet outcalls. Profiles include location details and direct WhatsApp contact so you can confirm availability before arrival.",
      "If you are crossing the border, allow extra time for immigration and transport. Confirm the meeting point and rate in advance, especially for late arrivals.",
    ],
    nearbyAreas: [
      { label: "Tororo Town", slug: "central" },
      { label: "Malaba", slug: "malaba" },
    ],
    faqs: [
      {
        question: "Are Tororo escorts available near the Malaba border?",
        answer:
          "Some companions offer outcalls near the border and surrounding hotels. Confirm travel time and any transport cost before booking.",
      },
      {
        question: "Can I book a Tororo companion on short notice?",
        answer:
          "Short-notice bookings are sometimes possible. Contact the companion on WhatsApp as early as you can to confirm.",
      },
    ],
  },
  lira: {
    slug: "lira",
    name: "Lira",
    title: "Lira Escorts | Verified Call Girls in Northern Uganda",
    description:
      "Browse verified Lira escorts and call girls in Lira City and the Lango sub-region. Real photos and direct WhatsApp contacts.",
    heading: "Lira Escorts",
    intro:
      "Verified companions for business travel, hotel stays, and private meetups in Lira.",
    body: [
      "Lira is the main commercial centre of the Lango sub-region in northern Uganda. The city has a compact centre with hotels, restaurants, and guesthouses serving business travellers and regional visitors.",
      "Our Lira listings include local companions and travelling escorts. Browse profiles, check the location, and contact the companion directly on WhatsApp to confirm availability.",
      "For out-of-town hotels, share the exact location and arrange transport early. Confirm the rate and duration before the booking.",
    ],
    nearbyAreas: [
      { label: "Lira City", slug: "central" },
      { label: "Lira East", slug: "lira-east" },
      { label: "Lira West", slug: "lira-west" },
    ],
    faqs: [
      {
        question: "Are there verified escorts in Lira?",
        answer:
          "Yes. Listings include local companions and travelling escorts. Confirm availability directly on WhatsApp.",
      },
      {
        question: "Can I book a Lira escort for an overnight stay?",
        answer:
          "Overnight availability varies. Ask about the rate and start and end times before confirming.",
      },
    ],
  },
  hoima: {
    slug: "hoima",
    name: "Hoima",
    title: "Hoima Escorts | Verified Call Girls in the Albertine Region",
    description:
      "Find verified Hoima escorts and call girls in Hoima Oil City and the Albertine region. Real photos and direct WhatsApp contacts.",
    heading: "Hoima Escorts",
    intro:
      "Discreet companions for oil-city business travel, hotel stays, and private meetups in Hoima.",
    body: [
      "Hoima is a fast-growing city in the Albertine region, driven by oil and gas activity and agriculture. The city has a growing hospitality sector serving engineers, contractors, and business travellers.",
      "Browse verified Hoima companions for dinner dates, hotel outcalls, and longer bookings. Profiles include location details and direct WhatsApp contact.",
      "If you are staying at a camp or lodge outside the city, confirm travel time and transport cost before booking. Advance notice is recommended for travelling companions.",
    ],
    nearbyAreas: [
      { label: "Hoima City", slug: "central" },
      { label: "Kabaale", slug: "kabaale" },
    ],
    faqs: [
      {
        question: "Are Hoima escorts available for business travellers?",
        answer:
          "Yes. Many companions offer hotel outcalls and evening meetups for business visitors. Confirm timing and rate in advance.",
      },
      {
        question: "Do Hoima companions travel to oil camps?",
        answer:
          "Some do, but transport time and cost must be agreed first. Ask before confirming the booking.",
      },
    ],
  },
  kasese: {
    slug: "kasese",
    name: "Kasese",
    title: "Kasese Escorts | Verified Call Girls Near Rwenzori",
    description:
      "Browse verified Kasese escorts and call girls near Queen Elizabeth National Park and the Rwenzori Mountains. Real photos and direct WhatsApp.",
    heading: "Kasese Escorts",
    intro:
      "Verified companions for tourism trips, hotel stays, and private meetups in Kasese.",
    body: [
      "Kasese is the gateway to Queen Elizabeth National Park and the Rwenzori Mountains in western Uganda. The town serves tourists, traders, and business travellers exploring the region.",
      "Our Kasese listings include local companions and travelling escorts. Browse profiles and contact companions directly to confirm availability for your dates.",
      "For lodge stays outside town, share the exact location and arrange transport early. Mountain weather and road conditions can affect travel time.",
    ],
    nearbyAreas: [
      { label: "Kasese Town", slug: "central" },
      { label: "Kilembe", slug: "kilembe" },
    ],
    faqs: [
      {
        question: "Are Kasese escorts available for lodge outcalls?",
        answer:
          "Some companions offer outcalls to lodges and hotels. Confirm the location, travel time, and rate before booking.",
      },
      {
        question: "Can I book a Kasese companion for a park visit?",
        answer:
          "Travel bookings depend on the companion and itinerary. Discuss the route and duration directly before confirming.",
      },
    ],
  },
  soroti: {
    slug: "soroti",
    name: "Soroti",
    title: "Soroti Escorts | Verified Call Girls in the Teso Region",
    description:
      "Find verified Soroti escorts and call girls in Soroti City and the Teso sub-region. Real photos and direct WhatsApp contacts.",
    heading: "Soroti Escorts",
    intro:
      "Discreet companions for business travel, hotel stays, and private meetups in Soroti.",
    body: [
      "Soroti is the educational and commercial heart of the Teso sub-region in eastern Uganda. The city has hotels, restaurants, and guesthouses serving regional visitors and business travellers.",
      "Browse verified Soroti companions for dinner dates, hotel outcalls, and longer bookings. Profiles include location details and direct WhatsApp contact.",
      "Confirm the meeting point and rate before the companion travels, especially for hotels outside the city centre.",
    ],
    nearbyAreas: [
      { label: "Soroti City", slug: "central" },
      { label: "Teso", slug: "teso" },
    ],
    faqs: [
      {
        question: "Are there verified escorts in Soroti?",
        answer:
          "Yes. Listings include local companions and travelling escorts. Confirm availability directly on WhatsApp.",
      },
      {
        question: "Can I book a Soroti escort for an overnight stay?",
        answer:
          "Overnight availability varies by companion. Ask about the rate and duration before confirming.",
      },
    ],
  },
  kabale: {
    slug: "kabale",
    name: "Kabale",
    title: "Kabale Escorts | Verified Call Girls Near Lake Bunyonyi",
    description:
      "Browse verified Kabale escorts and call girls near Lake Bunyonyi and southwestern Uganda. Real photos and direct WhatsApp contacts.",
    heading: "Kabale Escorts",
    intro:
      "Verified companions for highland getaways, lake stays, and private meetups in Kabale.",
    body: [
      "Kabale is a scenic highland town in southwestern Uganda, close to Lake Bunyonyi and the routes toward Rwanda and Bwindi. The area attracts tourists, hikers, and travellers looking for a quiet base in the hills.",
      "Our Kabale listings include local companions and travelling escorts. Browse profiles and contact companions directly to confirm availability for your dates.",
      "For lake lodges and rural stays, share the exact location and arrange transport in advance. Highland roads can be slow, especially after rain.",
    ],
    nearbyAreas: [
      { label: "Kabale Town", slug: "central" },
      { label: "Lake Bunyonyi", slug: "lake-bunyonyi" },
    ],
    faqs: [
      {
        question: "Are Kabale escorts available near Lake Bunyonyi?",
        answer:
          "Some companions accept outcalls to lake lodges. Confirm travel time and transport cost before booking.",
      },
      {
        question: "Can I book a Kabale companion for a Bwindi trip?",
        answer:
          "Travel bookings depend on the companion and itinerary. Discuss the route and duration directly before confirming.",
      },
    ],
  },
  "fort portal": {
    slug: "fort-portal",
    name: "Fort Portal",
    title: "Fort Portal Escorts | Verified Call Girls & Tour Companions",
    description:
      "Find verified Fort Portal escorts and call girls near the Rwenzori mountains, crater lakes, and Toro. Real photos and direct WhatsApp contacts.",
    heading: "Fort Portal Escorts",
    intro:
      "Discreet companions for tourism trips, lodge stays, and private meetups in Fort Portal and the Toro region.",
    body: [
      "Fort Portal is Uganda's tourism city, set between the Rwenzori mountains, crater lakes, tea estates, and the cultural heart of Toro. Visitors use the city as a base for gorilla trekking, crater-lake drives, and hikes around Kibale and the Rwenzori foothills.",
      "Browse verified Fort Portal companions for dinner dates, lodge outcalls, and longer bookings. Profiles include location details and direct WhatsApp contact.",
      "For lodges outside the centre, arrange transport in advance and share the exact location. Confirm the rate and duration before the booking.",
    ],
    nearbyAreas: [
      { label: "Bazaar", slug: "bazaar" },
      { label: "Kitumba", slug: "kitumba" },
      { label: "Rwengoma", slug: "rwengoma" },
    ],
    faqs: [
      {
        question: "Can I book a Fort Portal escort for a lodge stay?",
        answer:
          "Many companions offer outcalls to lodges and hotels. Share the lodge name and location so transport can be agreed.",
      },
      {
        question: "Are Fort Portal escorts available for tourism trips?",
        answer:
          "Some companions accept travel bookings. Discuss the itinerary and rate directly before confirming.",
      },
    ],
  },
};

export const TOP_CITY_SLUGS = [
  "kampala",
  "entebbe",
  "jinja",
  "mbarara",
  "gulu",
  "fort-portal",
  "mbale",
  "masaka",
  "arua",
  "mukono",
] as const;

export function normalizeCityKey(value?: string | null): string {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getCitySeo(value?: string | null): CitySeo | null {
  const key = normalizeCityKey(value);
  if (!key) return null;
  return (
    CITY_SEO[key] ||
    CITY_SEO[key.replace(/-/g, " ")] ||
    null
  );
}

export function isKnownCity(value?: string | null): boolean {
  return Boolean(getCitySeo(value));
}
