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
          <span className={cn("font-black tracking-tight flex items-center select-none", textSize === "xl" ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl")}>
            <span className="text-[#fff8f0] font-black mr-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              HEX
            </span>
            <span className="bg-gradient-to-r from-[#ff2079] via-[#ff6036] to-[#ff9800] bg-clip-text text-transparent font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              ESCORTS
            </span>
            <span className="ml-2 px-2.5 py-0.5 rounded-[12px] bg-[#2a081a] border-2 border-[#9b1b58] text-[#ffd700] text-[11px] sm:text-[13px] font-black tracking-wider leading-none shadow-[0_0_10px_rgba(155,27,88,0.3)]">
              UG
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
