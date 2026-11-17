"use client";

import { ProfileGrid } from "@/components/profiles/ProfileGrid";
import { useAllProfiles } from "@/hooks/use-all-profiles";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { MapPin, Sparkles, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileType } from "@/types/profile";
import { slugify, cn } from "@/lib/utils";
import { matchProfilesByLocation, locationMatches, KAMPALA_AREAS, CITY_AREAS } from "@/lib/locationMatcher";
import { getCitySeo, TOP_CITY_SLUGS } from "@/data/locationSeo";
import { categoryPath, getCategorySeo, CATEGORY_SLUGS } from "@/data/categorySeo";

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

const DEFAULT_GUIDE_LINKS = [
  { label: "Safe booking checklist", href: "/guides/safe-booking-checklist" },
  { label: "Rates & booking guide", href: "/price-guide" },
  { label: "Reviews & trust", href: "/reviews" },
];

const CITY_GUIDE_LINKS: Record<string, { label: string; href: string }[]> = {
  kampala: [{ label: "Kampala by neighbourhood", href: "/guides/kampala-by-neighbourhood" }, ...DEFAULT_GUIDE_LINKS],
  entebbe: [{ label: "Entebbe airport stopover", href: "/guides/entebbe-airport-stopover" }, ...DEFAULT_GUIDE_LINKS],
  jinja: [{ label: "Jinja weekend guide", href: "/guides/jinja-weekend" }, ...DEFAULT_GUIDE_LINKS],
};

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
  const INITIAL_PROFILES_COUNT = 10;
  const [visibleCount, setVisibleCount] = useState(INITIAL_PROFILES_COUNT);
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

  // City counts - fast single-pass counting
  const cityCounts = useMemo(() => {
    const map: Record<string, number> = {};
    if (!allProfiles.length) return map;
    for (let i = 0; i < allProfiles.length; i++) {
      const loc = allProfiles[i].location;
      if (!loc) continue;
      for (let j = 0; j < ALL_UGANDA_CITIES.length; j++) {
        const c = ALL_UGANDA_CITIES[j];
        if (locationMatches(loc, c.slug)) {
          map[c.slug] = (map[c.slug] || 0) + 1;
        }
      }
    }
    return map;
  }, [allProfiles]);

  const categorySeo = getCategorySeo(category);
  const categorySlug = categorySeo?.slug || (category ? slugify(category) : "");
  const categoryLabel =
    categorySeo?.name ||
    (category ? category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "");

  const getLocationTitle = () => {
    if (!city) return categorySeo?.heading || (category ? `${categoryLabel} Escorts in Uganda` : "All Locations in Uganda");

    const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (!suburb) return category ? `${categoryLabel} Escorts in ${cityName}` : `${cityName} Escorts`;

    const suburbName = suburb.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `${categoryLabel ? `${categoryLabel} ` : ""}Escorts in ${suburbName}, ${cityName}`;
  };

  const currentDisplayName = matchResult.locationDisplayName || getLocationTitle();
  const featuredIds = locationProfiles.filter(p => p.isPinned).map(p => p.id);

  const meta = getCitySeo(city);
  const isKampalaView = !city || city.toLowerCase() === 'kampala';
  const locationHref = (location: string) =>
    categorySlug ? categoryPath(categorySlug, location) : `/escorts-in/${location}`;
  const categoryHubHref = (slug: string) => (slug === "vip" ? "/vip" : `/category/${slug}`);
  const pageIntro = categorySeo
    ? city && !suburb
      ? `${categorySeo.name} companions available for incalls, hotel outcalls, and private meetups in ${currentDisplayName}.`
      : categorySeo.intro
    : meta && !suburb
      ? meta.intro
      : null;

  const displayedProfiles = isMounted ? locationProfiles.slice(0, visibleCount) : locationProfiles.slice(0, INITIAL_PROFILES_COUNT);
  const hasMoreProfiles = locationProfiles.length > displayedProfiles.length;

  return (
    <div className="min-h-screen bg-background pt-[88px] sm:pt-[98px] lg:pt-6">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 text-white tracking-tight">
                {meta && !category && !suburb ? meta.heading : getLocationTitle()}
              </h1>
              {pageIntro && (
                <p className="text-sm sm:text-base text-gray-200 mb-2 max-w-3xl leading-relaxed">{pageIntro}</p>
              )}
              
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
                    <Link prefetch={false} href={locationHref("kampala")} className="text-[11px] text-pink-400 hover:underline">
                      View All Kampala ({cityCounts["kampala"] || 81})
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Link
                    prefetch={false}
                    href={locationHref("kampala")}
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
                        href={locationHref(`kampala/${s.slug}`)}
                        prefetch={false}
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
                      <Link href={locationHref("kampala")} className="px-3 py-1 rounded-full bg-pink-600/30 text-pink-300 border border-pink-500/30 hover:bg-pink-600 hover:text-white transition-colors">
                        Browse Kampala Escorts ({cityCounts["kampala"] || 81})
                      </Link>
                      <Link href={locationHref("entebbe")} className="px-3 py-1 rounded-full bg-pink-600/30 text-pink-300 border border-pink-500/30 hover:bg-pink-600 hover:text-white transition-colors">
                        Browse Entebbe Escorts ({cityCounts["entebbe"] || 4})
                      </Link>
                      <Link href={locationHref("mukono")} className="px-3 py-1 rounded-full bg-pink-600/30 text-pink-300 border border-pink-500/30 hover:bg-pink-600 hover:text-white transition-colors">
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
                <ProfileGrid profiles={displayedProfiles} featuredIds={featuredIds} />
                {hasMoreProfiles && (
                  <div className="pt-6 pb-2 text-center">
                    <Button
                      onClick={() => setVisibleCount((prev) => prev + 10)}
                      className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-500 text-white font-bold px-8 py-3 rounded-full text-sm shadow-[0_4px_20px_rgba(236,72,153,0.35)] transition-all hover:scale-105 active:scale-95"
                    >
                      Load More Verified Companions ({locationProfiles.length - displayedProfiles.length} remaining)
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-gray-950/60 rounded-2xl border border-gray-900">
                <MapPin className="w-8 h-8 text-pink-400 mx-auto mb-3 opacity-60" />
                <h2 className="text-lg font-bold text-white mb-2">No escorts listed for this location yet</h2>
                <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                  Check out our verified escorts across Uganda or select another city from the directory.
                </p>
                <Button asChild className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-full text-xs px-6">
                  <Link href={locationHref("kampala")}>Browse Kampala Escorts</Link>
                </Button>
              </div>
            )}
            
            {/* City / Suburb Editorial / About Text */}
            {meta && !suburb && !category && (
              <div className="mt-12 p-6 bg-gray-950/70 rounded-2xl border border-gray-800 text-muted-foreground prose prose-invert max-w-none shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">About {meta.heading}</h2>
                <div className="text-xs sm:text-sm leading-relaxed space-y-4 text-gray-300">
                  {meta.body.map((para, i) => <p key={i}>{para}</p>)}
                </div>
                {meta.nearbyAreas.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-gray-800">
                    <h3 className="text-sm font-bold text-white mb-3">Popular areas in {meta.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {meta.nearbyAreas.map((area) => (
                        <Link
                          key={area.slug}
                          href={locationHref(`${meta.slug}/${area.slug}`)}
                          prefetch={false}
                          className="px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-300 hover:border-pink-500/40 hover:text-pink-300 transition-colors"
                        >
                          {area.label} Escorts
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-6 pt-5 border-t border-gray-800">
                  <h3 className="text-sm font-bold text-white mb-3">Planning your visit</h3>
                  <div className="flex flex-wrap gap-2">
                    {(CITY_GUIDE_LINKS[meta.slug] || DEFAULT_GUIDE_LINKS).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={false}
                        className="px-3 py-1.5 rounded-full bg-pink-950/30 border border-pink-500/20 text-xs text-pink-200 hover:bg-pink-600 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {meta && !suburb && !category && meta.faqs.length > 0 && (
              <section className="mt-8 p-6 bg-gray-950/70 rounded-2xl border border-gray-800 shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                  Frequently asked questions about {meta.name} escorts
                </h2>
                <div className="space-y-5">
                  {meta.faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="text-sm font-bold text-white mb-1.5">{faq.question}</h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-gray-300">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {categorySeo && !suburb && (
              <div className="mt-12 p-6 bg-gray-950/70 rounded-2xl border border-gray-800 text-muted-foreground prose prose-invert max-w-none shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                  {city ? `${categorySeo.name} Escorts in ${currentDisplayName}` : categorySeo.heading}
                </h2>
                <div className="text-xs sm:text-sm leading-relaxed space-y-4 text-gray-300">
                  {categorySeo.body.map((para, i) => <p key={i}>{para}</p>)}
                </div>
                <div className="mt-6 pt-5 border-t border-gray-800">
                  <h3 className="text-sm font-bold text-white mb-3">Browse {categorySeo.name} escorts by city</h3>
                  <div className="flex flex-wrap gap-2">
                    {TOP_CITY_SLUGS.map((slug) => {
                      const cityInfo = ALL_UGANDA_CITIES.find((item) => item.slug === slug);
                      if (!cityInfo) return null;
                      return (
                        <Link
                          key={slug}
                          href={locationHref(slug)}
                          prefetch={false}
                          className="px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-300 hover:border-pink-500/40 hover:text-pink-300 transition-colors"
                        >
                          {cityInfo.name}
                        </Link>
                      );
                    })}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-5 mb-3">Related categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySeo.related.map((slug) => {
                      const related = getCategorySeo(slug);
                      if (!related) return null;
                      return (
                        <Link
                          key={slug}
                          href={categoryHubHref(slug)}
                          prefetch={false}
                          className="px-3 py-1.5 rounded-full bg-pink-950/30 border border-pink-500/20 text-xs text-pink-200 hover:bg-pink-600 hover:text-white transition-colors"
                        >
                          {related.name} Escorts
                        </Link>
                      );
                    })}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-5 mb-3">Planning your booking</h3>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_GUIDE_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={false}
                        className="px-3 py-1.5 rounded-full bg-pink-950/30 border border-pink-500/20 text-xs text-pink-200 hover:bg-pink-600 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {categorySeo && !suburb && categorySeo.faqs.length > 0 && (
              <section className="mt-8 p-6 bg-gray-950/70 rounded-2xl border border-gray-800 shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                  Frequently asked questions about {categorySeo.name.toLowerCase()} escorts
                </h2>
                <div className="space-y-5">
                  {categorySeo.faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="text-sm font-bold text-white mb-1.5">{faq.question}</h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-gray-300">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {suburb && (
              <div className="mt-12 p-6 bg-gray-950/70 rounded-2xl border border-gray-800 text-muted-foreground prose prose-invert max-w-none shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Verified Escorts in {currentDisplayName}</h2>
                <div className="text-xs sm:text-sm leading-relaxed space-y-4 text-gray-300">
                  <p>
                    Looking for genuine companionship in {currentDisplayName}? Hex Escorts UG connects you with verified independent call girls and VIP companions who reside in or cater directly to {currentDisplayName}.
                  </p>
                  <p>
                    Whether you are hosting at an apartment or staying at a local hotel, our companions offer discreet incall and outcall services with real photos and verified direct WhatsApp contact.
                  </p>
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
                    href={locationHref(c.slug)}
                    prefetch={false} 
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
  );
};

export default LocationPage;
