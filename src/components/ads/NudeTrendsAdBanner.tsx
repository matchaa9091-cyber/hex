"use client";

import React from "react";
import Image from "next/image";
import { Flame, ExternalLink, Radio } from "lucide-react";

interface NudeTrendsAdBannerProps {
  className?: string;
}

export function NudeTrendsAdBanner({ className = "" }: NudeTrendsAdBannerProps) {
  return (
    <div className={`w-full my-6 sm:my-8 ${className}`}>
      <a
        href="https://nudetrends.afrozex.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Nude Trends for Live Cams and Leaks"
        className="group relative block w-full rounded-2xl overflow-hidden border border-amber-500/50 bg-gradient-to-r from-black via-zinc-950 to-black shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all duration-300 hover:scale-[1.01]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-950/80 via-black to-amber-950/80 border-b border-amber-500/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent flex items-center gap-1 sm:text-sm">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 inline" />
              Nude Trends • Live Cams &amp; Leaks
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600/90 text-white uppercase tracking-widest animate-pulse">
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300 group-hover:text-amber-200 font-bold text-[11px] sm:text-xs">
            <span>Watch Live Shows</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Banner Image */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[360px] overflow-hidden bg-black">
          <Image
            src="/nudetrends-banner.jpg"
            alt="Nude Trends - Ugandan Sexy Babes, Live Cams & Adult Entertainment"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
            priority={false}
          />
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          
          {/* Call-to-action bar pinned at bottom of the banner */}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-[10px] sm:text-xs text-amber-300 font-semibold shadow-lg">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              <span>Free 24/7 Live Webcams &amp; Leaks</span>
            </div>
            <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-extrabold text-[10px] sm:text-xs px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)] uppercase tracking-wide group-hover:scale-105 transition-transform">
              Enter Site ➔
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
