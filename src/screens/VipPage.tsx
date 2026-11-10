"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProfileGrid } from "@/components/profiles/ProfileGrid";
import { useAllProfiles } from "@/hooks/use-all-profiles";
import { ProfileType } from "@/types/profile";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

const VipPage = ({ initialProfiles = [], shuffleSeed }: { initialProfiles?: ProfileType[], shuffleSeed?: string }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: queryProfiles } = useAllProfiles(initialProfiles, shuffleSeed);
  const allProfiles = (queryProfiles && queryProfiles.length > 0) ? queryProfiles : (initialProfiles || []);
  
  // Filter for ONLY VIP (Pinned) profiles
  const vipProfiles = allProfiles.filter(p => p.isPinned);

  const visibleProfiles = vipProfiles.slice(0, visibleCount);
  const hasMore = visibleCount < vipProfiles.length;
  const isInitialLoading = allProfiles.length === 0;

  // In VIP page, everyone is featured
  const featuredIds = vipProfiles.map(p => p.id);

  return (
    <div className="pt-20 lg:pt-6 min-h-screen bg-black">
      <div className="container mx-auto px-4">
        {/* Search-Intent VIP SEO Header */}
        <div className="mb-8 text-center bg-gradient-to-b from-yellow-500/10 to-transparent p-6 sm:p-8 rounded-2xl border border-yellow-500/20">
          <h1 className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black tracking-tight leading-[1.2] mb-3 break-words">
            <span className="flex flex-col sm:inline sm:flex-row sm:items-center justify-center">
              <span className="text-left sm:text-center inline-block bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm pb-1">
                Uganda Escorts
              </span>
              <span className="hidden sm:inline text-gray-400 font-light mx-2">&amp;</span>
              <span className="text-right sm:text-center inline-block text-white drop-shadow-sm">
                <span className="sm:hidden text-gray-400 font-light mr-1.5">&amp;</span>
                Kampala Escorts
              </span>
            </span>
            <span className="block text-lg sm:text-2xl lg:text-xl xl:text-2xl font-bold mt-2 text-gray-300">
              <span className="text-amber-400 font-extrabold mr-1.5 drop-shadow-sm">#1 Verified</span>
              <span className="text-gray-100">Call Girls</span>
              <span className="text-pink-400 mx-1.5 font-normal">&amp;</span>
              <span className="inline-block bg-gradient-to-r from-rose-300 to-pink-400 bg-clip-text text-transparent pb-0.5">
                VIP Companions
              </span>
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300/90 max-w-3xl mx-auto leading-relaxed">
            Welcome to <strong className="font-extrabold inline-flex items-center gap-1"><span className="text-[#fff8f0]">Hex</span><span className="bg-gradient-to-r from-[#ff2079] via-[#ff6036] to-[#ff9800] bg-clip-text text-transparent">Escorts</span><span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#2a081a] border border-[#9b1b58] text-[#ffd700]">UG</span></strong>, Uganda&apos;s leading platform for verified <strong className="text-pink-300 font-medium">Uganda escorts</strong>, <strong className="text-pink-300 font-medium">Kampala escorts</strong>, and discreet companions. Chat directly on WhatsApp with authentic independent models and elite VIP companions in Kampala, Entebbe, Jinja, and across the country.
          </p>
        </div>

        {/* Profile Grid */}
        <div className="space-y-8">
          <ProfileGrid
            profiles={visibleProfiles}
            title="💎 Featured VIPs"
            featuredIds={featuredIds}
            loading={isInitialLoading}
          />

          {!isInitialLoading && hasMore && (
            <div className="flex justify-center pt-2 pb-4">
              <Button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black px-8 py-2 rounded-full font-bold shadow-[0_0_18px_4px_rgba(234,179,8,0.4)] transition-all duration-300"
              >
                Load More VIPs
              </Button>
            </div>
          )}

          {!isInitialLoading && vipProfiles.length === 0 && (
            <div className="text-center py-20">
               <p className="text-yellow-500/50 text-xl">No VIP escorts currently active. Check back soon!</p>
               <Link href="/" className="text-primary hover:underline mt-4 inline-block">View All Profiles</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VipPage;
