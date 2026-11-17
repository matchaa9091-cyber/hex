import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import mobileData from "./christmasMobileData.json";

// 840 x 195 viewBox
const W = 840;
const H = 195;

const {
  snowDriftMobilePath,
  garlandMobilePath,
  garlandMobileNeedles,
  fairyLightsMobile,
  hangingBulbsMobile,
  backgroundSnowMobile,
  wreathLeavesMobile,
  wreathInnerLeavesMobile,
  wreathBerryClustersMobile,
} = mobileData;

const CX_WREATH = 34;
const CY_WREATH = 118;
const R_WREATH = 52;

const sparklePointsMobile = [
  { cx: 660, cy: 75, R: 10, color: "#ffe27a" },
  { cx: 685, cy: 135, R: 8, color: "#ffffff" },
  { cx: 775, cy: 65, R: 9, color: "#ffe27a" },
];

const getSparklePoints = (cx: number, cy: number, R: number) => {
  const r = +(R * 0.28).toFixed(2);
  return `${cx},${cy - R} ${+(cx + r).toFixed(2)},${+(cy - r).toFixed(2)} ${cx + R},${cy} ${+(cx + r).toFixed(2)},${+(cy + r).toFixed(2)} ${cx},${cy + R} ${+(cx - r).toFixed(2)},${+(cy + r).toFixed(2)} ${cx - R},${cy} ${+(cx - r).toFixed(2)},${+(cy - r).toFixed(2)}`;
};

// Stars above/around letters replacing the cloud-like snow caps
// Letters: H (124), E (146), X (176), E (256), S (290), C (325), O (360), R (395), T (425), S (454)
const letterStarsMobile = [
  { cx: 124, cy: 90, r: 7.5, color: "#ffe27a" }, // Gold over H
  { cx: 148, cy: 87, r: 6.5, color: "#ffffff" }, // White over E
  { cx: 176, cy: 89, r: 8.0, color: "#ffe27a" }, // Gold over X
  { cx: 256, cy: 89, r: 7.0, color: "#ffffff" }, // White over E
  { cx: 292, cy: 87, r: 7.5, color: "#ffe27a" }, // Gold over S
  { cx: 326, cy: 89, r: 6.5, color: "#ffffff" }, // White over C
  { cx: 360, cy: 87, r: 8.0, color: "#ffe27a" }, // Gold over O
  { cx: 395, cy: 89, r: 7.0, color: "#ffffff" }, // White over R
  { cx: 425, cy: 87, r: 7.5, color: "#ffe27a" }, // Gold over T
  { cx: 454, cy: 89, r: 6.5, color: "#ffffff" }, // White over S
];

export interface ChristmasHeaderBannerProps {
  className?: string;
}

export function ChristmasHeaderBanner({ className }: ChristmasHeaderBannerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn("w-full h-full select-none block pointer-events-none", className)}
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <style>{`
          .xmas-mobile-font {
            font-family: 'Montserrat', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-weight: 900;
          }
        `}</style>

        {/* GPU-accelerated radial glows */}
        <radialGradient id="mFairyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4c8" stopOpacity="1" />
          <stop offset="40%" stopColor="#ffd678" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffd678" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="mBulbGlow_red" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8212b" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e8212b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mBulbGlow_green" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2ecc40" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#2ecc40" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mBulbGlow_gold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc83d" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffc83d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mBulbGlow_blue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3aa0ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3aa0ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mBulbGlow_pink" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff5caa" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ff5caa" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="mIconGlow" cx="50%" cy="50%" r="50%">
          <stop offset="65%" stopColor="#ff0064" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff0064" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="mIconRadial" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ff2d6f" />
          <stop offset="100%" stopColor="#ff1f5a" />
        </radialGradient>

        <clipPath id="mIconCircleClip">
          <circle cx={CX_WREATH} cy={CY_WREATH} r="46" />
        </clipPath>

        <linearGradient id="mEscortsGradient" x1="268" y1="0" x2="488" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff2e6e" />
          <stop offset="50%" stopColor="#ff5a2a" />
          <stop offset="100%" stopColor="#ff8a00" />
        </linearGradient>

        {/* Holly Leaf Templates */}
        <g id="mOuterHolly">
          <path d="M 0 0 C 5 -7 11 -9 16 -6 C 19 -5 22 -2 24 0 C 22 2 19 5 16 6 C 11 9 5 7 0 0 Z" fill="currentColor" />
          <line x1="0" y1="0" x2="20" y2="0" stroke="#6ec882" strokeWidth="0.9" strokeLinecap="round" />
        </g>
        <g id="mInnerHolly">
          <path d="M 0 0 C 4 -6 9 -8 14 -5 C 17 -4 19 -2 21 0 C 19 2 17 4 14 5 C 9 8 4 6 0 0 Z" fill="#229646" />
        </g>
      </defs>

      {/* 0. Seamless Header Background */}
      <rect width={W} height={H} fill="#1a1a1a" />

      {/* 1. Snow Drift along bottom edge (white) */}
      <path d={snowDriftMobilePath} fill="#f4f8ff" />

      {/* Client-hydrated decorative snow and snowflakes */}
      {isMounted && (
        <>
          {/* 2. White dots across the header */}
          <g>
            {backgroundSnowMobile.map((dot, idx) => (
              <circle key={idx} cx={dot.x} cy={dot.y} r={dot.r} fill="#ffffff" opacity={dot.op} />
            ))}
          </g>

          {/* Six-arm snowflakes across middle & right */}
          {[
            { cx: 620, cy: 110, r: 12, op: 0.8 },
            { cx: 700, cy: 68, r: 13, op: 0.85 },
            { cx: 765, cy: 138, r: 12, op: 0.75 },
          ].map((sf, idx) => (
            <g key={idx} transform={`translate(${sf.cx}, ${sf.cy})`} stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity={sf.op}>
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <line x1="0" y1="0" x2="0" y2={-sf.r} />
                  <line x1={0} y1={-sf.r * 0.55} x2={-sf.r * 0.28} y2={-sf.r * 0.77} />
                  <line x1={0} y1={-sf.r * 0.55} x2={sf.r * 0.28} y2={-sf.r * 0.77} />
                </g>
              ))}
            </g>
          ))}
        </>
      )}

      {/* 3. Upper Items: Garland ribbon */}
      <g>
        <path d={garlandMobilePath} stroke="#105028" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {isMounted && (
          <>
            <g strokeWidth="2" strokeLinecap="round">
              {garlandMobileNeedles.map((nd, idx) => (
                <line key={idx} x1={nd.x1} y1={nd.y1} x2={nd.x2} y2={nd.y2} stroke={nd.color} />
              ))}
            </g>
            {fairyLightsMobile.map((fl, idx) => (
              <g key={idx}>
                <circle cx={fl.x} cy={fl.y} r="9" fill="url(#mFairyGlow)" />
                <circle cx={fl.x} cy={fl.y} r="2.2" fill="#ffffff" />
              </g>
            ))}
          </>
        )}
      </g>

      {/* 4. Upper Items: Hanging Bulbs (client hydrated) */}
      {isMounted && (
        <g>
          {hangingBulbsMobile.map((b, idx) => (
            <g key={idx}>
              <circle cx={b.x} cy={b.by + 15} r="16" fill={`url(#mBulbGlow_${b.key})`} />
              <rect x={b.x - 3} y={b.by - 1} width="6" height="6" rx="1.5" fill="#1e5f37" />
              <polygon points={`${b.x - 3},${b.by + 5} ${b.x + 3},${b.by + 5} ${b.x + 5.5},${b.by + 12} ${b.x - 5.5},${b.by + 12}`} fill={b.color} />
              <circle cx={b.x} cy={b.by + 14} r="7" fill={b.color} />
              <circle cx={b.x - 2.2} cy={b.by + 11.5} r="1.8" fill="#ffffff" opacity="0.85" />
            </g>
          ))}
        </g>
      )}

      {/* 5. Logo & Wreath PULLED TO THE LEFT: center (58, 118) */}
      <g>
        {/* Pink Glow & Circle */}
        <circle cx={CX_WREATH} cy={CY_WREATH} r="54" fill="url(#mIconGlow)" />
        <circle cx={CX_WREATH} cy={CY_WREATH} r="46" fill="url(#mIconRadial)" />
        <g clipPath="url(#mIconCircleClip)">
          <image
            href="/logo.png"
            xlinkHref="/logo.png"
            x={CX_WREATH - 46}
            y={CY_WREATH - 46}
            width="92"
            height="92"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </g>

      {/* Wreath leaves & Bow (client hydrated) */}
      {isMounted && (
        <g>
          {wreathLeavesMobile.map((l, idx) => (
            <use
              key={`outer-${idx}`}
              href="#mOuterHolly"
              x="0"
              y="0"
              transform={`translate(${l.x}, ${l.y}) rotate(${l.rot})`}
              color={l.color}
            />
          ))}
          {wreathInnerLeavesMobile.map((l, idx) => (
            <use
              key={`inner-${idx}`}
              href="#mInnerHolly"
              x="0"
              y="0"
              transform={`translate(${l.x}, ${l.y}) rotate(${l.rot})`}
            />
          ))}
          {/* Berry clusters */}
          {wreathBerryClustersMobile.map((cl, idx) => (
            <g key={idx}>
              <circle cx={cl.cx - 2.5} cy={cl.cy - 2} r="3.6" fill="#c81620" />
              <circle cx={cl.cx + 2.5} cy={cl.cy - 1.8} r="3.6" fill="#c81620" />
              <circle cx={cl.cx} cy={cl.cy + 2.5} r="3.6" fill="#c81620" />
            </g>
          ))}
          {/* Red Bow at (10, 160) */}
          <g transform="translate(10, 160) rotate(12) scale(0.42)">
            {[-1, 1].map((sg) => (
              <React.Fragment key={sg}>
                <path d={`M 0 0 Q ${sg * 78} -52 ${sg * 68} 0 Q ${sg * 78} 52 0 0`} fill="#d61e2a" />
                <path d={`M 0 0 Q ${sg * 52} -30 ${sg * 46} 0 Q ${sg * 52} 30 0 0`} fill="#a00e1c" />
                <polygon points={`0,4 ${sg * 22},70 ${sg * 10},62 ${sg * 2},78 ${-sg * 8},6`} fill="#d61e2a" />
              </React.Fragment>
            ))}
            <circle cx="0" cy="0" r="11" fill="#d61e2a" />
            <circle cx="-2.5" cy="-2.5" r="3.5" fill="#f8707a" opacity="0.85" />
          </g>
        </g>
      )}

      {/* Santa Hat on Wreath top-left (client hydrated) */}
      {isMounted && (
        <g transform="translate(14, 70) rotate(-24) scale(0.44)">
          <path d="M -68 -12 Q -74 -100 22 -106 Q 72 -112 104 -52 Q 72 -44 68 -12 Z" fill="#d61e2a" />
          <path d="M -68 -12 Q -74 -100 22 -106 L -20 -12 Z" fill="#ac101e" />
          <path d="M 10 -100 Q 60 -104 88 -62 Q 55 -92 10 -92 Z" fill="rgba(240,70,80,0.55)" />
          <circle cx="106" cy="-46" r="21" fill="#fafcff" />
          <circle cx="109" cy="-42" r="13" fill="#dee8f8" />
          <circle cx="100" cy="-52" r="8" fill="#ffffff" />
          <rect x="-80" y="-17" width="160" height="34" rx="10" fill="#fafcff" />
          {[-72, -54, -36, -18, 0, 18, 36, 54, 72].map((x) => (
            <React.Fragment key={x}>
              <circle cx={x} cy="-17" r="11" fill="#fafcff" />
              <circle cx={x} cy="17" r="11" fill="#fafcff" />
            </React.Fragment>
          ))}
        </g>
      )}

      {/* 6. BIG, BOLD, PROMINENT TEXT: "HEX ESCORTS" PULLED TO THE LEFT */}
      <g className="xmas-mobile-font">
        {/* Drop shadow */}
        <text x="116" y="136" fontSize="54" fontWeight="900" textLength="110" lengthAdjust="spacing" fill="rgba(0,0,0,0.65)">
          HEX
        </text>
        <text x="116" y="134" fontSize="54" fontWeight="900" textLength="110" lengthAdjust="spacing" fill="#ffffff">
          HEX
        </text>

        <text x="244" y="136" fontSize="54" fontWeight="900" textLength="220" lengthAdjust="spacing" fill="rgba(0,0,0,0.65)">
          ESCORTS
        </text>
        <text x="244" y="134" fontSize="54" fontWeight="900" textLength="220" lengthAdjust="spacing" fill="url(#mEscortsGradient)">
          ESCORTS
        </text>
      </g>

      {/* Stars on/above letters replacing snow caps (client hydrated) */}
      {isMounted && (
        <g>
          {letterStarsMobile.map((st, idx) => (
            <polygon key={idx} points={getSparklePoints(st.cx, st.cy, st.r)} fill={st.color} />
          ))}
        </g>
      )}

      {/* 7. UG BADGE: PULLED TO THE LEFT (x=480, y=90) */}
      <g>
        <rect x="478" y="88" width="100" height="58" rx="29" fill="none" stroke="#ff1f7a" strokeWidth="4" opacity="0.4" />
        <rect x="480" y="90" width="96" height="54" rx="27" fill="#2a0a1e" stroke="#ff1f7a" strokeWidth="2.5" />
        <text
          x="528"
          y="120"
          fill="#ffd400"
          fontSize="30"
          fontWeight="900"
          textAnchor="middle"
          dominantBaseline="central"
          className="xmas-mobile-font"
          style={{ letterSpacing: "1.2px" }}
        >
          UG
        </text>
      </g>

      {/* Holly on UG badge (centered at x=484, y=92) */}
      {isMounted && (
        <g transform="translate(484, 92)">
          <g transform="rotate(-150) scale(0.62)">
            <path d="M 0 0 C 15 -20 45 -20 60 0 C 45 20 15 20 0 0 Z" fill="#18803a" />
          </g>
          <g transform="rotate(-35) scale(0.62)">
            <path d="M 0 0 C 15 -20 45 -20 60 0 C 45 20 15 20 0 0 Z" fill="#18803a" />
          </g>
          <circle cx="-3" cy="-2" r="5" fill="#c81620" />
          <circle cx="4.5" cy="-2.5" r="5" fill="#c81620" />
          <circle cx="0" cy="4" r="5" fill="#c81620" />
        </g>
      )}

      {/* 8. Star Sparkles on the right side */}
      {isMounted && (
        <g>
          {sparklePointsMobile.map((sp, idx) => (
            <polygon key={idx} points={getSparklePoints(sp.cx, sp.cy, sp.R)} fill={sp.color} />
          ))}
        </g>
      )}
    </svg>
  );
}

export default ChristmasHeaderBanner;
