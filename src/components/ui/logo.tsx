"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  textSize?: string;
}

export function Logo({ size = 40, className, textSize = "2xl" }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center gap-2">
        <img 
          src="/logo.png" 
          alt="Hex Escorts Uganda Logo" 
          width={size}
          height={size}
          className="object-cover rounded-full shadow-[0_0_12px_rgba(236,72,153,0.35)] ring-2 ring-pink-500/50"
        />
        <div className="flex items-center leading-none">
          <span className={cn("font-black tracking-tight flex items-center", textSize === "xl" ? "text-lg sm:text-xl" : "text-xl sm:text-2xl")}>
            <span className="text-white font-black drop-shadow-sm mr-1">HEX</span>
            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent font-black drop-shadow-sm">ESCORTS</span>
            <span className="ml-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-pink-500/15 text-pink-300 border border-pink-500/30">
              UG
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
