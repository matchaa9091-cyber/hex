"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  textSize?: string;
}

export function Logo({ size = 42, className, textSize = "2xl" }: LogoProps) {
  const isSidebar = textSize === "sidebar";
  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("flex items-center", isSidebar ? "gap-2" : "gap-2.5 sm:gap-3")}>
        <div className="relative flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="Hex Escorts Uganda Logo" 
            width={isSidebar ? 36 : size}
            height={isSidebar ? 36 : size}
            className="object-cover rounded-full ring-[2.5px] ring-[#ff2079] shadow-[0_0_16px_rgba(255,32,121,0.6)]"
          />
        </div>
        <div className="flex items-center leading-none">
          <span className={cn(
            "font-black tracking-tight flex items-center select-none uppercase", 
            textSize === "xl" ? "text-xl sm:text-2xl" : isSidebar ? "text-lg xl:text-xl" : "text-2xl sm:text-3xl"
          )}>
            <span className="text-[#fff8f0] font-black mr-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              HEX
            </span>
            <span className="bg-gradient-to-r from-[#ff2079] via-[#ff6036] to-[#ff9800] bg-clip-text text-transparent font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              ESCORTS
            </span>
            <span className={cn(
              "rounded-[10px] sm:rounded-[12px] bg-[#2a081a] border-2 border-[#9b1b58] text-[#ffd700] font-black tracking-wider leading-none shadow-[0_0_12px_rgba(155,27,88,0.35)] flex items-center justify-center",
              isSidebar ? "ml-1.5 px-2 py-0.5 text-xs" : "ml-2 sm:ml-2.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm"
            )}>
              UG
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
