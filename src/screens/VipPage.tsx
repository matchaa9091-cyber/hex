"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProfileGrid } from "@/components/profiles/ProfileGrid";
import { useAllProfiles } from "@/hooks/use-all-profiles";
import { ProfileType } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { getCategorySeo } from "@/data/categorySeo";
import { TOP_CITY_SLUGS } from "@/data/locationSeo";

const PAGE_SIZE = 10;

const VipPage = ({ initialProfiles = [], shuffleSeed }: { initialProfiles?: ProfileType[], shuffleSeed?: string }) => {
  const vipSeo = getCategorySeo("vip");
  const [isMounted, setIsMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: queryProfiles } = useAllProfiles(initialProfiles, shuffleSeed);
  const allProfiles = (queryProfiles && queryProfiles.length > 0) ? queryProfiles : (initialProfiles || []);
  
  // Match the sitemap and category filters: VIP or pinned profiles.
  const vipProfiles = allProfiles.filter(p => p.isVip || p.isPinned);

  const visibleProfiles = vipProfiles.slice(0, visibleCount);
  const hasMore = visibleCount < vipProfiles.length;
  const isInitialLoading = allProfiles.length === 0;

  // In VIP page, everyone is featured
  const featuredIds = vipProfiles.map(p => p.id);

  return (
    <div className="pt-[76px] sm:pt-[84px] lg:pt-6 min-h-screen bg-black">
      <div className="container mx-auto px-4">
        {/* VIP Header */}
        <div className="mb-8 text-center bg-gradient-to-b from-yellow-500/10 to-transparent p-8 rounded-2xl border border-yellow-500/20">
          <h1 className="text-3xl lg:text-5xl font-bold text-yellow-500 mb-4 flex items-center justify-center gap-3">
             <span className="animate-pulse">✨</span> Elite VIP Escorts <span className="animate-pulse">✨</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience true luxury with our hand-picked VIP companions. These elite escorts represent the pinnacle of beauty, charm, and professional service in Uganda.
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
                Load More VIPs ({vipProfiles.length - visibleProfiles.length} remaining)
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

        {vipSeo && (
          <>
            <section className="mt-12 p-6 bg-gray-950/70 rounded-2xl border border-yellow-500/20">
              <h2 className="text-lg sm:text-xl font-bold text-yellow-500 mb-4">Browse VIP escorts by city</h2>
              <div className="flex flex-wrap gap-2">
                {TOP_CITY_SLUGS.map((slug) => (
                  <Link
                    key={slug}
                    href={`/vip-escorts-in/${slug}`}
                    prefetch={false}
                    className="px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-300 hover:border-yellow-500/40 hover:text-yellow-300 transition-colors capitalize"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-yellow-500 mt-6 mb-4">Related categories</h2>
              <div className="flex flex-wrap gap-2">
                {vipSeo.related.map((slug) => (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    prefetch={false}
                    className="px-3 py-1.5 rounded-full bg-yellow-950/30 border border-yellow-500/20 text-xs text-yellow-200 hover:bg-yellow-600 hover:text-black transition-colors capitalize"
                  >
                    {slug} escorts
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-8 p-6 bg-gray-950/70 rounded-2xl border border-yellow-500/20">
              <h2 className="text-lg sm:text-xl font-bold text-yellow-500 mb-4">VIP escort questions</h2>
              <div className="space-y-5">
                {vipSeo.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-sm font-bold text-white mb-1.5">{faq.question}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default VipPage;
