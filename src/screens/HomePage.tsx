"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProfileGrid } from "@/components/profiles/ProfileGrid";
import { useAllProfiles } from "@/hooks/use-all-profiles";
import { ProfileType } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AdCarousel } from "@/components/profiles/AdCarousel";
import { Crown, ChevronDown } from "lucide-react";

const PAGE_SIZE = 24;
const cities = [
  { name: "Kampala", path: "/escorts-in/kampala" },
  { name: "Entebbe", path: "/escorts-in/entebbe" },
  { name: "Jinja", path: "/escorts-in/jinja" },
  { name: "Mbarara", path: "/escorts-in/mbarara" },
  { name: "Gulu", path: "/escorts-in/gulu" },
  { name: "Mbale", path: "/escorts-in/mbale" },
  { name: "Tororo", path: "/escorts-in/tororo" },
  { name: "Fort Portal", path: "/escorts-in/fort-portal" },
  { name: "Mukono", path: "/escorts-in/mukono" },
];

interface HomePageProps {
  initialProfiles?: ProfileType[];
  shuffleSeed?: string;
}

const HomePage = ({ initialProfiles = [], shuffleSeed }: HomePageProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showOtherEscorts, setShowOtherEscorts] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: queryProfiles } = useAllProfiles(initialProfiles, shuffleSeed);
  const allProfiles = queryProfiles || initialProfiles || [];

  const isInitialLoading = allProfiles.length === 0;

  // Split profiles into VIP and Ordinary
  const vipProfiles = allProfiles.filter(p => p.isPinned);
  const ordinaryProfiles = allProfiles.filter(p => !p.isPinned);
  
  const visibleOrdinary = ordinaryProfiles.slice(0, visibleCount);
  const hasMore = visibleCount < ordinaryProfiles.length;

  return (
    <div className="pt-20 lg:pt-6 min-h-screen max-w-[100vw] overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4">
        {/* SEO Header */}
        <div className="mb-6 sm:mb-8 overflow-x-hidden">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-primary mb-3 break-words">
            Uganda Escorts – #1 Verified Call Girls &amp; Discreet Companions
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mb-4 max-w-3xl leading-relaxed">
            Welcome to Hex Escorts UG, Uganda&apos;s leading directory for verified escorts and discreet call girls. Connect directly via WhatsApp with genuine models in Kampala, Entebbe, Jinja, and countrywide.
          </p>
          
          {/* Top Sliding Section */}
          <div className="w-full overflow-hidden mb-6">
            <AdCarousel profiles={allProfiles} />
          </div>

          <nav aria-label="Browse by city" className="flex flex-wrap gap-1.5 sm:gap-2">
            {cities.map((c) => (
              <Link
                key={c.name}
                href={c.path}
                className="text-[9px] sm:text-[11px] bg-gradient-to-r from-[#db0061] to-[#ff1493] text-white hover:from-[#ff1493] hover:to-[#db0061] px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-black transition-all duration-300 shadow-[0_2px_10px_rgba(255,20,147,0.3)] hover:shadow-[0_2px_15px_rgba(255,20,147,0.5)] hover:-translate-y-0.5 active:scale-95 text-center break-words max-w-full"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Profile Grid Section */}
        <div className="space-y-16 sm:space-y-24">
          
          {/* VIP SECTION */}
          {vipProfiles.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center sm:items-start">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-2xl sm:text-3xl lg:text-5xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-yellow-400 via-white to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] animate-pulse flex items-center gap-3"
                >
                  {/* Show Emoji on Mobile, Hide on Desktop */}
                  <span className="lg:hidden">👑</span>
                  {/* Show Icon on Desktop, Hide on Mobile */}
                  <Crown className="hidden lg:block w-14 h-14 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
                  Elite VIP Escorts
                </motion.h2>
                <div className="h-1 w-32 bg-gradient-to-r from-yellow-500 to-transparent mt-1" />
              </div>
              <ProfileGrid
                profiles={vipProfiles}
                featuredIds={vipProfiles.map(p => p.id)}
                loading={isInitialLoading}
              />
            </div>
          )}

          {/* OTHER SECTION */}
          <div className="space-y-6">
            <div className="flex flex-col items-center sm:items-start">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white/90 tracking-tight">
                Other Escorts
              </h2>
              <div className="h-0.5 w-24 bg-gray-700 mt-1" />
            </div>

            {!showOtherEscorts ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 bg-gradient-to-b from-gray-900/50 via-gray-900/30 to-black/60 rounded-2xl border border-gray-800 text-center space-y-4 shadow-xl">
                <p className="text-xs sm:text-sm text-gray-400 max-w-md">
                  Looking for more verified profiles? Tap below to explore standard escort listings.
                </p>
                <Button
                  onClick={() => setShowOtherEscorts(true)}
                  size="lg"
                  className="bg-gradient-to-r from-[#db0061] via-[#ff1493] to-[#db0061] hover:from-[#ff1493] hover:to-[#db0061] text-white font-black text-sm sm:text-base px-8 py-6 rounded-full shadow-[0_4px_20px_rgba(255,20,147,0.4)] hover:shadow-[0_4px_30px_rgba(255,20,147,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 cursor-pointer uppercase tracking-wider"
                >
                  <span>Other Escorts</span>
                  <ChevronDown className="w-5 h-5 animate-bounce" />
                </Button>
              </div>
            ) : (
              <>
                <ProfileGrid
                  profiles={visibleOrdinary}
                  loading={isInitialLoading}
                />

                {!isInitialLoading && hasMore && (
                  <div className="flex justify-center pt-8 pb-4">
                    <Button
                      onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white px-8 py-2 rounded-full font-semibold shadow-[0_0_18px_4px_rgba(236,72,153,0.55)] hover:shadow-[0_0_28px_8px_rgba(236,72,153,0.75)] transition-shadow duration-300"
                    >
                      Load More Profiles
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* FAQ Section for SEO Keywords */}
        <div className="mt-20 border-t border-gray-800 pt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-2">
              <h4 className="text-primary font-bold">How do I find verified Escorts in Kampala Uganda?</h4>
              <p className="text-sm text-gray-400">Finding verified Escorts in Kampala Uganda is easy on our Uganda escorts directory. Every companion listed as a Kampala call girl or Entebbe escorts has been manually vetted to ensure they are real and professional. We offer direct contacts for Ntinda escorts, Escorts in Ntinda, Call girls Najjera, escorts near Makerere, and Kawempe escorts.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-primary font-bold">Are the photos of Ugandan call girls 100% real?</h4>
              <p className="text-sm text-gray-400">Yes. We pride ourselves on being the only Uganda escort directory that enforces strict photo verification. When you book a sexy girl or Kampala call girls in Uganda from our site, you meet who you see.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-primary font-bold">Can I get direct WhatsApp contacts for hookups?</h4>
              <p className="text-sm text-gray-400">Absolutely. We provide direct WhatsApp links for every Kampala hookup, Entebbe escorts, Ntinda escorts, and Kawempe escorts listed. There are no middlemen, just direct contact between you and the companion.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-primary font-bold">Do you have VIP companions for high-end events?</h4>
              <p className="text-sm text-gray-400">Yes, our VIP section features elite Ugandan companions, Verified escorts Kampala (and verified escortd Kampala), and high-class call girls perfect for corporate dinners, travel companionship, and exclusive private encounters.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-primary font-bold">Is it discreet to book a hookup in Uganda?</h4>
              <p className="text-sm text-gray-400">Privacy is our #1 priority. Whether you are looking for an escort in Ntinda, Call girls Najjera, or escorts near Makerere, our platform ensures your search for hookups in Uganda remains 100% confidential.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-primary font-bold">Where can I find independent escorts in Jinja or Mbarara?</h4>
              <p className="text-sm text-gray-400">We have a growing directory of independent companions in Jinja, Mbarara, and Gulu. Simply filter by location to find the best call girls or Entebbe escorts available in your specific city.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-primary font-bold">What types of sexy girls in Uganda are available?</h4>
              <p className="text-sm text-gray-400">Our directory features a diverse range of **sexy escorts**, including **ebony** beauties, slim models, and curvy **Ugandan escorts**. Whether you want a college girl or a mature companion, we have the best **sexy girls** and Kampala call girls in the country.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-primary font-bold">How do I book a hookup with Uganda escorts?</h4>
              <p className="text-sm text-gray-400">You can book **escorts in Uganda** by contacting them directly via the WhatsApp numbers provided on their profiles. We make it easy to find **uganda escorts** and girls in uganda to fuck for quick hookups or overnight stays.</p>
            </div>
          </div>
        </div>

        {/* Popular Searches Bar */}
        <div className="mt-12 py-6 border-y border-gray-800/50">
          <p className="text-[10px] text-center text-gray-500 uppercase tracking-[0.3em] mb-4">Trending Searches</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] sm:text-xs font-medium text-gray-400">
            {["uganda escorts", "ugandan escorts", "sexy escorts", "sexy girls", "escorts in uganda", "ebony", "fuck girls", "kampala hookups", "entebbe call girls", "jinja escorts", "mbarara girls", "gulu hookups"].map((term) => (
              <span key={term} className="hover:text-primary cursor-default transition-colors">#{term.replace(/\s+/g, '')}</span>
            ))}
          </div>
        </div>

        {/* SEO Guide & Editorial Content Section */}
        <div className="mt-16 text-left prose prose-invert mx-auto max-w-4xl pt-8 pb-12 border-t border-gray-800">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center">
            Uganda Escorts: The Premier Directory of Verified Ugandan Call Girls
          </h2>
          
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-gray-300">
            <p>
              Welcome to <strong>Hex Escorts UG</strong>, the most reliable and trusted <strong>Uganda escorts</strong> directory. 
              Whether you are an international traveler visiting Uganda for business or leisure, an expatriate residing in Kampala, 
              or a local resident seeking discreet companionship, our platform brings together top-tier <strong>Ugandan call girls</strong>, 
              independent escorts, and VIP companions across all major cities and suburbs in Uganda.
            </p>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                100% Photo-Verified Ugandan Escorts (No Middlemen)
              </h3>
              <p>
                In an online classifieds market flooded with misleading photos and dishonest intermediaries, 
                <strong> Hex Escorts UG</strong> enforces a rigorous manual verification process. We ensure that every companion listed 
                has authentic, unedited photos so the person you see on our website is the exact companion you meet in person. 
                Best of all, we provide direct WhatsApp contact numbers with <strong>zero agency fees or commission middlemen</strong>. 
                You chat, negotiate rates, and arrange your date directly with the companion of your choice.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Top Locations for Escorts in Uganda
              </h3>
              <p className="mb-3">
                Our directory features comprehensive location-based listings so you can find sexy companions right in your neighborhood:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
                <li>
                  <Link href="/escorts-in/kampala" className="text-primary hover:underline font-semibold">Kampala Escorts</Link>: 
                  The center of Ugandan nightlife and luxury dining. Find verified call girls across Kololo, Nakasero, Bugolobi, 
                  Ntinda, Kiwatule, Najjera, Muyenga, Munyonyo, and Bukoto.
                </li>
                <li>
                  <Link href="/escorts-in/entebbe" className="text-primary hover:underline font-semibold">Entebbe Escorts</Link>: 
                  Ideal for travelers arriving via Entebbe International Airport or guests staying at lakeside beach resorts along Lake Victoria.
                </li>
                <li>
                  <Link href="/escorts-in/jinja" className="text-primary hover:underline font-semibold">Jinja Escorts</Link>: 
                  Companions for corporate retreats, weekend getaways, and adventure tours near the source of the River Nile.
                </li>
                <li>
                  <Link href="/escorts-in/mbarara" className="text-primary hover:underline font-semibold">Mbarara Escorts</Link>: 
                  Charming, sophisticated local companions serving Western Uganda&apos;s fast-growing commercial center.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Diverse Companionship Options to Match Your Desires
              </h3>
              <p>
                Every client has unique tastes, which is why our Uganda escorts directory categorizes models to match your specific preferences:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-white font-bold mb-1">Elite VIP Escorts</h4>
                  <p className="text-xs text-gray-400">
                    Stunning, multilingual models and high-class companions suited for diplomatic dinners, hotel stays, and private executive travel.
                  </p>
                </div>
                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-white font-bold mb-1">Ebony &amp; Curvy Beauties</h4>
                  <p className="text-xs text-gray-400">
                    Gorgeous, voluptuous Ugandan babes and slender models ready for discreet hookups, private hotel visits, or cozy home incalls.
                  </p>
                </div>
                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-white font-bold mb-1">Erotic Massage &amp; Spas</h4>
                  <p className="text-xs text-gray-400">
                    Trained masseuses providing sensual Nuru, Swedish, and full-body relaxation massage services in Kampala and Entebbe.
                  </p>
                </div>
                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-white font-bold mb-1">Girlfriend Experience (GFE)</h4>
                  <p className="text-xs text-gray-400">
                    Warm, passionate, and affectionate companionship focusing on emotional connection, relaxed dates, and intimacy.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                How to Book and Contact a Ugandan Escort Safely
              </h3>
              <p>
                Booking a companion on Hex Escorts UG is simple, safe, and discreet:
              </p>
              <ol className="list-decimal pl-5 space-y-2 mt-2 text-gray-400">
                <li><strong>Browse &amp; Select:</strong> Filter by city, suburb, or category to find your preferred companion.</li>
                <li><strong>Direct WhatsApp:</strong> Click the verified WhatsApp button on their profile to start a direct conversation.</li>
                <li><strong>State Your Requirements:</strong> Politely introduce yourself, specify whether you desire an incall or outcall, duration (short-time or overnight), and confirm rates upfront.</li>
                <li><strong>Meet Safely:</strong> Agree on a safe, mutually convenient location such as a verified hotel, private residence, or upscale apartment.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                100% Client Discretion &amp; Privacy Guaranteed
              </h3>
              <p>
                We understand that privacy is paramount. Hex Escorts UG does not require client account registration, 
                does not track personal user data, and never sells contact information. You can explore Uganda escorts 
                with complete confidentiality and peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
