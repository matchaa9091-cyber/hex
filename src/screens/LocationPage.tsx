"use client";

import { ProfileGrid } from "@/components/profiles/ProfileGrid";
import { useAllProfiles } from "@/hooks/use-all-profiles";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { useState, useEffect, useMemo } from "react";
import { Menu, ChevronDown, UserPlus, MapPin, Sparkles, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileType } from "@/types/profile";
import { slugify, cn } from "@/lib/utils";
import { matchProfilesByLocation, locationMatches, KAMPALA_AREAS, CITY_AREAS } from "@/lib/locationMatcher";

export const cityMeta: Record<string, { title: string; description: string; heading: string; body: string }> = {
  kampala: {
    title: "Kampala Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Kampala, Uganda. Browse authentic profiles from Kawempe, Kasubi, Kyanja, Kololo, Bukoto, Mengo, and all Greater Kampala divisions.",
    heading: "Escorts in Kampala",
    body: "Kampala is the vibrant capital of Uganda and our premier location for connecting with verified, high-class companions. Whether you are traveling for business, staying in upscale neighborhoods like Kololo, Nakasero, or Bugolobi, or experiencing the bustling nightlife of Kawempe, Kasubi, or Makindye, our diverse directory of Kampala escorts offers the perfect match for your specific desires. From elegant dinner dates and corporate event companions to private, discreet encounters, the companions listed on Hex Escorts UG are thoroughly vetted for authenticity. Kampala's fast-paced lifestyle demands flexible and professional companionship. Our platform features local beauties, university students, and professional models who know the city intimately. By browsing our verified profiles, you gain access to high-quality photos, detailed service lists, and genuine availability. We prioritize your privacy and safety, ensuring that every interaction is smooth and confidential. Choose from a variety of categories, including VIP companions, GFE (Girlfriend Experience) specialists, and travel companions ready to accompany you to luxury hotels or private residences across the metropolitan area. If you are looking for an unforgettable experience in Uganda's heartbeat, you have found the definitive directory.",
  },
  entebbe: {
    title: "Entebbe Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Entebbe, Uganda. Browse authentic companion profiles near Entebbe International Airport, Katabi, Kajjansi, and lakeside resorts.",
    heading: "Escorts in Entebbe",
    body: "Entebbe is renowned for its serene lakeside environment, luxurious resorts, and proximity to the Entebbe International Airport, making it a prime hub for traveling professionals, tourists, and expatriates. Our exclusive directory of Entebbe escorts provides you with access to verified, sophisticated companions perfectly suited for the relaxed yet upscale atmosphere of this beautiful peninsula. Whether you require a discreet companion for a relaxing weekend getaway at a Lake Victoria resort, a beautiful date for a sunset cruise, or unwinding after a long corporate flight, our profiles feature the most reliable and stunning companions in the area. Each profile is rigorously reviewed to ensure 100% authenticity, giving you ultimate peace of mind. Entebbe companions offer a wide variety of services tailored to your needs, from casual meetups to extensive overnight bookings at leading hotels.",
  },
  jinja: {
    title: "Jinja Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Jinja, the adventure capital of Uganda. Browse authentic companion profiles near the Nile source and Bugembe.",
    heading: "Escorts in Jinja",
    body: "Welcome to Jinja, the undisputed adventure capital of East Africa and the historic source of the River Nile. Whether you are visiting for thrilling white-water rafting, a scenic corporate retreat, or simply looking to escape the hustle of the capital, our premium directory of Jinja escorts is here to elevate your experience. Jinja boasts a vibrant community of beautiful, intelligent, and verified companions ready to help you unwind after a long day of adventure. From sharing a quiet drink overlooking the Nile to engaging in a passionate, private encounter in one of Jinja's boutique lodges, our verified profiles ensure you meet genuine companions with total discretion.",
  },
  mbarara: {
    title: "Mbarara Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Mbarara, western Uganda. Browse authentic companion profiles in Kakoba, Kamukuzi, and Nyamitanga.",
    heading: "Escorts in Mbarara",
    body: "Mbarara is the fastest-growing city in Western Uganda, a bustling center of commerce, agriculture, and hospitality. Our definitive directory of Mbarara escorts provides residents and visiting businessmen with direct access to the most beautiful and verified companions in the western region. Whether you are attending a conference, managing regional business, or simply enjoying the local hospitality, an elegant companion can transform your downtime into an unforgettable experience. Every escort undergoes our verification process, ensuring authentic photos and absolute discretion.",
  },
  "fort-portal": {
    title: "Fort Portal Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Fort Portal tourism city. Browse authentic companion profiles in the heart of Toro.",
    heading: "Escorts in Fort Portal",
    body: "Fort Portal is Uganda's designated tourism city, surrounded by the Rwenzori mountains, crater lakes, and lush tea estates. Our directory connects you with verified local companions in Fort Portal who understand the relaxed, picturesque charm of this western highland jewel. From weekend romantic getaways to private lodge appointments, connect safely and discreetly.",
  },
  "fort portal": {
    title: "Fort Portal Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Fort Portal tourism city. Browse authentic companion profiles in the heart of Toro.",
    heading: "Escorts in Fort Portal",
    body: "Fort Portal is Uganda's designated tourism city, surrounded by the Rwenzori mountains, crater lakes, and lush tea estates. Our directory connects you with verified local companions in Fort Portal who understand the relaxed, picturesque charm of this western highland jewel. From weekend romantic getaways to private lodge appointments, connect safely and discreetly.",
  },
  mukono: {
    title: "Mukono & Seeta Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Mukono and Seeta. Browse authentic companion profiles along the Kampala-Jinja highway.",
    heading: "Escorts in Mukono & Seeta",
    body: "Mukono is a bustling metropolitan center strategically located along the Kampala-Jinja highway, incorporating vibrant residential hubs like Seeta. Known for its universities, industrial growth, and quick access to the capital, Mukono attracts professionals and travelers seeking verified, private companionship without traveling all the way into Kampala centre.",
  },
  arua: {
    title: "Arua Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Arua City, West Nile. Browse authentic companion profiles in Arua Central and Ayivu.",
    heading: "Escorts in Arua City",
    body: "Arua is the bustling commercial and cultural metropolis of West Nile, connecting Uganda with DR Congo and South Sudan. Our verified Arua escort directory offers business travelers, NGO staff, and residents authentic companions for discreet evening dates, hotel visits, and personal relaxation.",
  },
  wakiso: {
    title: "Wakiso Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts across Wakiso District, including Kira, Nansana, Gayaza, and Kasangati.",
    heading: "Escorts in Wakiso",
    body: "Wakiso District encircles Kampala and is home to Uganda's most populous residential municipalities, including Kira, Nansana, and Gayaza Road. Our verified directory covers independent companions who reside and offer discreet appointments in Wakiso's upscale neighborhoods.",
  },
  gulu: {
    title: "Gulu Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Gulu, northern Uganda. Browse authentic companion profiles in Bar-Dege, Layibi, and Pece.",
    heading: "Escorts in Gulu",
    body: "Gulu is the central hub of Northern Uganda, a city with a unique character and a rapidly developing social scene. For those visiting Gulu on business, NGO missions, or leisure, our platform helps you connect with verified companions who are available locally or ready to travel for outcalls.",
  },
  masaka: {
    title: "Masaka Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Masaka City. Browse authentic companion profiles in Nyendo, Kimanya, and Katwe.",
    heading: "Escorts in Masaka",
    body: "Masaka is the historic commercial capital of Greater Southern Buganda, connecting Kampala with western border routes. Our directory helps visitors and locals find verified, authentic companions in Masaka for discreet social and private meetups.",
  },
  mbale: {
    title: "Mbale Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Mbale City, Eastern Uganda. Browse authentic companion profiles near Mt. Elgon.",
    heading: "Escorts in Mbale",
    body: "Mbale is the majestic eastern city situated at the foothills of Mount Elgon. Known for its pleasant climate, coffee trading, and cultural richness, our directory provides access to verified companions available in Mbale and surrounding areas.",
  },
  tororo: {
    title: "Tororo Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Tororo and Malaba border. Browse authentic companion profiles in Eastern Uganda.",
    heading: "Escorts in Tororo",
    body: "Tororo is a prominent industrial and border hub in Eastern Uganda near the Malaba Kenya border. Browse verified companions available for hotel visits and discreet companionship in Tororo town.",
  },
  lira: {
    title: "Lira Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Lira City. Browse authentic companion profiles in Lira East and West.",
    heading: "Escorts in Lira",
    body: "Lira is the primary commercial center of the Lango sub-region. Connect with verified companions for discreet outcalls and companionship in Lira.",
  },
  hoima: {
    title: "Hoima Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Hoima Oil City. Browse authentic companion profiles in Bunyoro.",
    heading: "Escorts in Hoima",
    body: "Hoima is Uganda's rapidly expanding oil city in the Albertine region. Our directory provides verified companions for visiting engineers, corporate executives, and business travelers.",
  },
  kasese: {
    title: "Kasese Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Kasese town near Rwenzori National Park.",
    heading: "Escorts in Kasese",
    body: "Kasese is the bustling gateway to Queen Elizabeth National Park and the Rwenzori Mountains. Browse verified companions for discreet companionship in Kasese.",
  },
  soroti: {
    title: "Soroti Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Soroti City, Teso sub-region.",
    heading: "Escorts in Soroti",
    body: "Soroti is the educational and commercial heart of the Teso sub-region in Eastern Uganda. Discover verified companions in Soroti.",
  },
  kabale: {
    title: "Kabale Escorts – Verified Profiles | Escorts UG",
    description: "Find verified escorts in Kabale, the Switzerland of Africa near Lake Bunyonyi.",
    heading: "Escorts in Kabale",
    body: "Kabale is the scenic highland hub of southwestern Uganda near the borders of Rwanda and Lake Bunyonyi. Connect with verified companions in Kabale.",
  }
};

const ALL_UGANDA_CITIES = [
  { slug: "kampala", name: "Kampala" },
  { slug: "entebbe", name: "Entebbe" },
  { slug: "mukono", name: "Mukono" },
  { slug: "jinja", name: "Jinja" },
  { slug: "mbarara", name: "Mbarara" },
  { slug: "fort-portal", name: "Fort Portal" },
  { slug: "arua", name: "Arua" },
  { slug: "wakiso", name: "Wakiso" },
  { slug: "gulu", name: "Gulu" },
  { slug: "masaka", name: "Masaka" },
  { slug: "mbale", name: "Mbale" },
  { slug: "tororo", name: "Tororo" },
  { slug: "lira", name: "Lira" },
  { slug: "hoima", name: "Hoima" },
  { slug: "kasese", name: "Kasese" },
  { slug: "soroti", name: "Soroti" },
  { slug: "kabale", name: "Kabale" },
];

interface LocationPageProps {
  cityParam?: string;
  suburbParam?: string;
  categoryParam?: string;
  initialProfiles?: ProfileType[];
  shuffleSeed?: string;
}

const LocationPage = ({ cityParam, suburbParam, categoryParam, initialProfiles, shuffleSeed }: LocationPageProps) => {
  const city = cityParam;
  const suburb = suburbParam;
  const category = categoryParam;
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: queryProfiles } = useAllProfiles(initialProfiles, shuffleSeed);
  const allProfiles = (queryProfiles && queryProfiles.length > 0) ? queryProfiles : (initialProfiles || []);

  // Match result using word-boundary precision
  const matchResult = useMemo(() => {
    const res = matchProfilesByLocation(allProfiles, city, suburb);
    let filtered = res.profiles;
    let filteredDirect = res.directProfiles;
    let filteredTravel = res.travelProfiles;

    // Filter by Category (Body Type or Services or VIP)
    if (category) {
      const cat = category.toLowerCase().replace(/-/g, ' ');
      const catFilter = (profile: ProfileType) => {
        const bodyTypeMatch = profile.bodyType?.toLowerCase() === cat || profile.bodyType?.toLowerCase().includes(cat);
        const serviceMatch = profile.services?.some(s => s.toLowerCase().includes(cat));
        const vipMatch = (cat === 'vip' || cat === 'premium') ? profile.isVip || profile.isPinned : false;
        return bodyTypeMatch || serviceMatch || vipMatch;
      };
      filtered = filtered.filter(catFilter);
      filteredDirect = filteredDirect.filter(catFilter);
      filteredTravel = filteredTravel.filter(catFilter);
    }

    return {
      ...res,
      profiles: filtered,
      directProfiles: filteredDirect,
      travelProfiles: filteredTravel
    };
  }, [allProfiles, city, suburb, category]);

  const locationProfiles = matchResult.profiles;
  const isFallbackLocation = matchResult.isFallback;

  // Active Kampala suburbs with count
  const activeKampalaSuburbs = useMemo(() => {
    if (!allProfiles.length) return [];
    const knownSuburbs = [
      "kawempe", "kasubi", "kyanja", "mengo", "bukoto", "makindye", "munyonyo",
      "rubaga", "salaama", "kisaasi", "makerere", "kololo", "ntinda", "bwaise",
      "kalerwe", "kansanga", "masanafu", "najjanankumbi", "namasuba", "nankulabye",
      "ndejje", "nsambya", "old kampala", "gayaza road", "kira", "zana"
    ];

    return knownSuburbs.map(sub => {
      const count = allProfiles.filter(p => locationMatches(p.location, sub)).length;
      const slug = sub.replace(/\s+/g, '-');
      const name = sub.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { slug, name, count };
    }).filter(s => s.count > 0);
  }, [allProfiles]);

  // City counts
  const cityCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of ALL_UGANDA_CITIES) {
      const res = matchProfilesByLocation(allProfiles, c.slug);
      map[c.slug] = res.directProfiles.length;
    }
    return map;
  }, [allProfiles]);

  const getLocationTitle = () => {
    const catName = category ? category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Escorts";
    if (!city) return category ? catName : "All Locations in Uganda";
    
    const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (!suburb) return `${catName} in ${cityName}`;
    
    const suburbName = suburb.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `${catName} in ${suburbName}, ${cityName}`;
  };

  const currentDisplayName = matchResult.locationDisplayName || getLocationTitle();
  const featuredIds = locationProfiles.filter(p => p.isPinned).map(p => p.id);

  const meta = city ? (cityMeta[city.toLowerCase()] || cityMeta[city.toLowerCase().replace(/-/g, ' ')]) : null;
  const isKampalaView = !city || city.toLowerCase() === 'kampala';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-black py-2 px-3 flex justify-between items-center lg:hidden">
        <Logo size={32} textSize="xl" />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowSidebar(!showSidebar)}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-pink-500/15 border border-pink-500/40 hover:bg-pink-500/25 active:scale-95 transition-all shadow-[0_0_12px_rgba(255,32,121,0.25)] flex-shrink-0"
          aria-label="Toggle navigation menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between items-center pointer-events-none">
            <span className="w-full h-[2.5px] rounded-full bg-gradient-to-r from-[#ff2079] via-[#ec4899] to-[#f472b6] shadow-[0_0_6px_rgba(255,32,121,0.7)]" />
            <span className="w-full h-[2.5px] rounded-full bg-gradient-to-r from-[#ff2079] via-[#ec4899] to-[#f472b6] shadow-[0_0_6px_rgba(255,32,121,0.7)]" />
            <span className="w-full h-[2.5px] rounded-full bg-gradient-to-r from-[#ff2079] via-[#ec4899] to-[#f472b6] shadow-[0_0_6px_rgba(255,32,121,0.7)]" />
          </div>
        </Button>
      </div>
      
      <div className="flex pt-12 lg:pt-0">
        {/* Desktop Sidebar: Complete Uganda Cities Directory */}
        <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed top-0 left-0 h-full w-64 bg-sidebar pt-12 lg:pt-4 z-20 transition-transform duration-300 overflow-y-auto border-r border-gray-900`}>
          <div className="p-4">
            <div className="hidden lg:block mb-6">
              <Logo textSize="xl" />
            </div>
            
            <div className="mb-4 pb-3 border-b border-gray-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Uganda Cities
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">Select a city to view local verified call girls</p>
            </div>

            <ul className="space-y-1 text-sm text-gray-300">
              {ALL_UGANDA_CITIES.map((c) => {
                const isSelected = city?.toLowerCase() === c.slug;
                const count = cityCounts[c.slug] || 0;

                return (
                  <li key={c.slug}>
                    <Link 
                      href={`/escorts-in/${c.slug}`}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                        isSelected
                          ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md font-bold"
                          : "hover:bg-gray-800/60 hover:text-pink-300 text-gray-300"
                      )}
                    >
                      <span>{c.name}</span>
                      {count > 0 ? (
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                          isSelected ? "bg-white/20 text-white" : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                        )}>
                          {count}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">Available</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-800/80">
              <Link 
                href="/escorts-in" 
                className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 font-semibold"
              >
                ← View All Locations in Uganda
              </Link>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 lg:pl-64 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 text-white tracking-tight">
                {meta && !category ? meta.heading : getLocationTitle()}
              </h1>
              
              <p className="text-xs sm:text-sm text-gray-300">
                {!isFallbackLocation ? (
                  <span>
                    Showing <strong className="text-pink-400 font-bold">{matchResult.directProfiles.length} verified resident escorts</strong> based directly in {currentDisplayName}.
                  </span>
                ) : (
                  <span>
                    Companions available for hotel visits, outcalls, and travel bookings in <strong className="text-pink-400 font-bold">{currentDisplayName}</strong>.
                  </span>
                )}
              </p>
            </div>

            {/* Suburbs Quick-Filter Bar (Shown on Kampala pages) */}
            {isKampalaView && activeKampalaSuburbs.length > 0 && (
              <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-black/40 border border-gray-800/80">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-pink-400" /> Filter by Kampala Suburb:
                  </span>
                  {suburb && (
                    <Link href="/escorts-in/kampala" className="text-[11px] text-pink-400 hover:underline">
                      View All Kampala ({cityCounts["kampala"] || 81})
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Link
                    href="/escorts-in/kampala"
                    className={cn(
                      "text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-bold transition-all",
                      !suburb
                        ? "bg-pink-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                        : "bg-gray-900 border border-gray-800 text-gray-300 hover:border-pink-500/40 hover:text-pink-300"
                    )}
                  >
                    All Kampala ({cityCounts["kampala"] || 81})
                  </Link>

                  {activeKampalaSuburbs.map((s) => {
                    const isSubSelected = suburb?.toLowerCase() === s.slug;
                    return (
                      <Link
                        key={s.slug}
                        href={`/escorts-in/kampala/${s.slug}`}
                        className={cn(
                          "text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1",
                          isSubSelected
                            ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]"
                            : "bg-gray-900 border border-gray-800 text-gray-300 hover:border-pink-500/40 hover:text-pink-300"
                        )}
                      >
                        <span>{s.name}</span>
                        <span className="text-[9px] px-1 rounded-full bg-black/40 font-semibold">{s.count}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fallback Notice: Displayed when a location has 0 local resident escorts */}
            {isFallbackLocation && (
              <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-black/60 border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 shrink-0 mt-0.5">
                    <Car className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
                      <span>No resident escorts currently based permanently in {currentDisplayName}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                      Looking for companionship in {currentDisplayName}? The verified escorts below offer <strong>outcalls, hotel visits, and travel bookings</strong> to {currentDisplayName}. Direct WhatsApp contact available on each profile.
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Link href="/escorts-in/kampala" className="px-3 py-1 rounded-full bg-pink-600/30 text-pink-300 border border-pink-500/30 hover:bg-pink-600 hover:text-white transition-colors">
                        Browse Kampala Escorts ({cityCounts["kampala"] || 81})
                      </Link>
                      <Link href="/escorts-in/entebbe" className="px-3 py-1 rounded-full bg-pink-600/30 text-pink-300 border border-pink-500/30 hover:bg-pink-600 hover:text-white transition-colors">
                        Browse Entebbe Escorts ({cityCounts["entebbe"] || 4})
                      </Link>
                      <Link href="/escorts-in/mukono" className="px-3 py-1 rounded-full bg-pink-600/30 text-pink-300 border border-pink-500/30 hover:bg-pink-600 hover:text-white transition-colors">
                        Browse Mukono Escorts ({cityCounts["mukono"] || 4})
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Grid */}
            {locationProfiles.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-900">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    {!isFallbackLocation ? `Verified Profiles in ${currentDisplayName}` : `Companions Available to Travel to ${currentDisplayName}`}
                  </h2>
                  <span className="text-[11px] text-gray-400">{locationProfiles.length} Profiles Available</span>
                </div>
                <ProfileGrid profiles={locationProfiles} featuredIds={featuredIds} />
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-gray-950/60 rounded-2xl border border-gray-900">
                <MapPin className="w-8 h-8 text-pink-400 mx-auto mb-3 opacity-60" />
                <h2 className="text-lg font-bold text-white mb-2">No escorts listed for this location yet</h2>
                <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                  Check out our verified escorts across Uganda or select another city from the directory.
                </p>
                <Button asChild className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-full text-xs px-6">
                  <Link href="/escorts-in/kampala">Browse Kampala Escorts</Link>
                </Button>
              </div>
            )}
            
            {/* City Editorial / About Text */}
            {meta && (
              <div className="mt-12 p-6 bg-gray-950/70 rounded-2xl border border-gray-800 text-muted-foreground prose prose-invert max-w-none shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">About {meta.heading}</h2>
                <div className="text-xs sm:text-sm leading-relaxed space-y-4 text-gray-300">
                  {meta.body.split('\n').map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>
            )}

            {/* Bottom Location Matrix */}
            <div className="mt-16 pt-8 border-t border-gray-800">
              <h3 className="text-sm sm:text-base font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-400" /> All Major Cities & Towns in Uganda
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
                {ALL_UGANDA_CITIES.map((c) => (
                  <Link 
                    key={c.slug} 
                    href={`/escorts-in/${c.slug}`} 
                    className="p-2 rounded-lg bg-gray-900/60 hover:bg-pink-950/40 border border-gray-850 hover:border-pink-500/30 text-gray-300 hover:text-pink-300 transition-colors flex items-center justify-between"
                  >
                    <span>Escorts in {c.name}</span>
                    {(cityCounts[c.slug] || 0) > 0 && (
                      <span className="text-[10px] text-pink-400 font-bold">({cityCounts[c.slug]})</span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800/60 flex items-center justify-between">
                <Link href="/" className="text-pink-400 hover:text-pink-300 font-semibold text-xs flex items-center gap-1.5">
                  ← Back to Uganda Escorts Home
                </Link>
                <Link href="/vip" className="text-amber-400 hover:text-amber-300 font-semibold text-xs flex items-center gap-1.5">
                  👑 View Elite VIP Escorts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSidebar && isMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default LocationPage;
