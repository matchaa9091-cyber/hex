import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import desktopData from "./christmasDesktopData.json";

const {
  snowDriftPath,
  garlandBasePath,
  garlandNeedles,
  garlandBerries,
  fairyLights,
  hangingBulbs,
  outerWreathLeaves,
  innerWreathLeaves,
  wreathBerryClusters,
  whiteDots,
} = desktopData;

const goldOrnaments = [
  { x: 88, y: 39.8 },
  { x: 278, y: 39.8 },
  { x: 468, y: 39.8 },
  { x: 658, y: 39.8 },
  { x: 848, y: 39.8 },
  { x: 1038, y: 39.8 }
];

const letterStars = [
  { cx: 278, cy: 178, r: 11, color: "#ffe27a" },
  { cx: 350, cy: 175, r: 12, color: "#ffffff" },
  { cx: 416, cy: 177, r: 11, color: "#ffe27a" },
  { cx: 468, cy: 176, r: 10, color: "#ffffff" },
  { cx: 520, cy: 174, r: 11, color: "#ffe27a" },
  { cx: 565, cy: 176, r: 10, color: "#ffffff" },
  { cx: 610, cy: 174, r: 12, color: "#ffe27a" },
  { cx: 665, cy: 176, r: 10, color: "#ffffff" },
  { cx: 718, cy: 174, r: 12, color: "#ffe27a" },
  { cx: 761, cy: 176, r: 10, color: "#ffffff" },
];

const snowflakeList = [
  { cx: 558, cy: 122, r: 16, op: 0.85 },
  { cx: 655, cy: 112, r: 14, op: 0.75 },
  { cx: 437, cy: 330, r: 18, op: 0.85 },
  { cx: 797, cy: 332, r: 16, op: 0.8 },
  { cx: 1022, cy: 306, r: 18, op: 0.85 },
  { cx: 1098, cy: 278, r: 14, op: 0.75 },
  { cx: 300, cy: 330, r: 15, op: 0.8 },
];

// Helper to generate 4-point sparkle star points
const getSparklePoints = (cx: number, cy: number, R: number) => {
  const r = +(R * 0.28).toFixed(2);
  return `${cx},${cy - R} ${+(cx + r).toFixed(2)},${+(cy - r).toFixed(2)} ${cx + R},${cy} ${+(cx + r).toFixed(2)},${+(cy + r).toFixed(2)} ${cx},${cy + R} ${+(cx - r).toFixed(2)},${+(cy + r).toFixed(2)} ${cx - R},${cy} ${+(cx - r).toFixed(2)},${+(cy - r).toFixed(2)}`;
};

export interface ChristmasLogoProps {
  className?: string;
}

export function ChristmasLogo({ className }: ChristmasLogoProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <svg
      viewBox="0 0 1124 364"
      width="100%"
      className={cn("w-full h-auto select-none block", className)}
      role="img"
      aria-label="HEX Escorts UG - home"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        {/* Instant zero-network typography */}
        <style>{`
          .xmas-font {
            font-family: 'Montserrat', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-weight: 900;
          }
        `}</style>

        {/* GPU-accelerated radial glows */}
        <radialGradient id="fairyGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4c8" stopOpacity="1" />
          <stop offset="35%" stopColor="#ffd678" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffd678" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="iconOuterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#ff0064" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff0064" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="bulbGlow_red" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8212b" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#e8212b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e8212b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bulbGlow_green" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2ecc40" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#2ecc40" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2ecc40" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bulbGlow_gold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc83d" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#ffc83d" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffc83d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bulbGlow_blue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3aa0ff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#3aa0ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3aa0ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bulbGlow_pink" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff5caa" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#ff5caa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff5caa" stopOpacity="0" />
        </radialGradient>

        {/* Hot Pink Icon Circle Radial Gradient */}
        <radialGradient id="iconRadialGlow" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ff2d6f" />
          <stop offset="100%" stopColor="#ff1f5a" />
        </radialGradient>
        <clipPath id="iconCircleClip">
          <circle cx="138" cy="210" r="92" />
        </clipPath>

        {/* ESCORTS Text Horizontal Gradient: #ff2e6e -> #ff5a2a -> #ff8a00 */}
        <linearGradient id="escortsGradient" x1="452" y1="0" x2="780" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff2e6e" />
          <stop offset="50%" stopColor="#ff5a2a" />
          <stop offset="100%" stopColor="#ff8a00" />
        </linearGradient>

        {/* Outer Holly Leaf Template */}
        <g id="outerHollyLeaf">
          <path
            d="M 0 0 C 8 -10 16 -13 24 -9 C 28 -7 32 -3 34 0 C 32 3 28 7 24 9 C 16 13 8 10 0 0 Z"
            fill="currentColor"
          />
          <line x1="0" y1="0" x2="28" y2="0" stroke="#6ec882" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Inner Holly Leaf Template */}
        <g id="innerHollyLeaf">
          <path
            d="M 0 0 C 7 -9 14 -12 21 -8 C 25 -6 28 -3 30 0 C 28 3 25 6 21 8 C 14 12 7 9 0 0 Z"
            fill="#229646"
          />
          <line x1="0" y1="0" x2="24" y2="0" stroke="#78d78c" strokeWidth="1" strokeLinecap="round" />
        </g>
      </defs>

      {/* 0. Seamless Header Background Rect */}
      <rect width="1124" height="364" fill="#1a1a1a" />

      {/* 1. LAYER: SNOW DRIFT (bottom edge) */}
      <path d={snowDriftPath} fill="#f4f8ff" />

      {/* 2. LAYER: SNOWFLAKES & WHITE DOTS (client hydrated) */}
      {isMounted && (
        <>
          {/* 2a. Small White Background Dots */}
          <g>
            {whiteDots.map((dot, idx) => (
              <circle key={idx} cx={dot.x} cy={dot.y} r={dot.r} fill="#ffffff" opacity={dot.op} />
            ))}
          </g>

          {/* 2b. Six-Arm White Snowflakes */}
          <g stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round">
            {snowflakeList.map((sf, idx) => (
              <g key={idx} transform={`translate(${sf.cx}, ${sf.cy})`} opacity={sf.op}>
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <g key={deg} transform={`rotate(${deg})`}>
                    <line x1="0" y1="0" x2="0" y2={-sf.r} />
                    <line x1="0" y1={-sf.r * 0.55} x2={-sf.r * 0.28} y2={-sf.r * 0.77} />
                    <line x1="0" y1={-sf.r * 0.55} x2={sf.r * 0.28} y2={-sf.r * 0.77} />
                  </g>
                ))}
              </g>
            ))}
          </g>
        </>
      )}

      {/* 3. LAYER: GARLAND (top) */}
      <g>
        {/* Base Stroke */}
        <path
          d={garlandBasePath}
          stroke="#105028"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {isMounted && (
          <>
            {/* Needles */}
            <g strokeWidth="2.6" strokeLinecap="round">
              {garlandNeedles.map((nd, idx) => (
                <line key={idx} x1={nd.x1} y1={nd.y1} x2={nd.x2} y2={nd.y2} stroke={nd.color} />
              ))}
            </g>

            {/* Garland Red Berries */}
            <g>
              {garlandBerries.map((b, idx) => (
                <g key={idx}>
                  <circle cx={b.x} cy={b.y} r="5.5" fill="#c81620" />
                  <circle cx={b.x - 1.8} cy={b.y - 1.8} r="1.8" fill="#ffffff" opacity="0.85" />
                </g>
              ))}
            </g>

            {/* Garland Gold Ornaments */}
            <g>
              {goldOrnaments.map((orn, idx) => (
                <g key={idx}>
                  <line x1={orn.x} y1={orn.y - 12} x2={orn.x} y2={orn.y - 9} stroke="#886611" strokeWidth="1.5" />
                  <rect x={orn.x - 3} y={orn.y - 11} width="6" height="3" rx="1" fill="#cca020" />
                  <circle cx={orn.x} cy={orn.y} r="9" fill="#ebb432" />
                  <circle cx={orn.x - 2.8} cy={orn.y - 2.8} r="2.5" fill="#fff9d0" opacity="0.9" />
                </g>
              ))}
            </g>

            {/* Garland Fairy Lights */}
            <g>
              {fairyLights.map((fl, idx) => (
                <g key={idx}>
                  <circle cx={fl.x} cy={fl.y} r="14" fill="url(#fairyGlowGrad)" />
                  <circle cx={fl.x} cy={fl.y} r="3.5" fill="#ffffff" />
                </g>
              ))}
            </g>
          </>
        )}
      </g>

      {/* 4. LAYER: HANGING COLOR BULBS (client hydrated) */}
      {isMounted && (
        <g>
          {hangingBulbs.map((bulb, idx) => (
            <g key={idx}>
              {/* Bulb Glow */}
              <circle cx={bulb.x} cy={bulb.by + 24} r="26" fill={`url(#bulbGlow_${bulb.key})`} />
              {/* Socket */}
              <rect x={bulb.x - 5} y={bulb.by - 1} width="10" height="10" rx="2" fill="#1e5f37" />
              {/* Neck Polygon */}
              <polygon
                points={`${bulb.x - 5},${bulb.by + 9} ${bulb.x + 5},${bulb.by + 9} ${bulb.x + 9},${bulb.by + 19} ${bulb.x - 9},${bulb.by + 19}`}
                fill={bulb.color}
              />
              {/* Bulb Sphere */}
              <circle cx={bulb.x} cy={bulb.by + 22} r="10.5" fill={bulb.color} />
              {/* Highlight */}
              <circle cx={bulb.x - 3.5} cy={bulb.by + 18.5} r="3" fill="#ffffff" opacity="0.85" />
            </g>
          ))}
        </g>
      )}

      {/* 5. LAYER: ICON CIRCLE + SILHOUETTE */}
      <g>
        {/* Soft Pink Glow & Background Circle */}
        <circle cx="138" cy="210" r="106" fill="url(#iconOuterGlow)" />
        <circle cx="138" cy="210" r="92" fill="url(#iconRadialGlow)" />
        {/* Silhouette Image Clipped to Circle */}
        <g clipPath="url(#iconCircleClip)">
          <image
            href="/logo.png"
            xlinkHref="/logo.png"
            x="42"
            y="114"
            width="192"
            height="192"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </g>

      {/* 6. LAYER: WREATH (client hydrated) */}
      {isMounted && (
        <g>
          {/* Outer Holly Leaves */}
          {outerWreathLeaves.map((leaf, idx) => (
            <use
              key={`outer-${idx}`}
              href="#outerHollyLeaf"
              x="0"
              y="0"
              transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot})`}
              color={leaf.color}
            />
          ))}

          {/* Inner Holly Leaves */}
          {innerWreathLeaves.map((leaf, idx) => (
            <use
              key={`inner-${idx}`}
              href="#innerHollyLeaf"
              x="0"
              y="0"
              transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot})`}
            />
          ))}

          {/* Wreath Berry Clusters (5 points around wreath) */}
          {wreathBerryClusters.map((cl, idx) => (
            <g key={idx}>
              <circle cx={cl.cx - 3.5} cy={cl.cy - 3} r="5.2" fill="#c81620" />
              <circle cx={cl.cx - 5} cy={cl.cy - 4.5} r="1.6" fill="#ffffff" opacity="0.85" />

              <circle cx={cl.cx + 3.5} cy={cl.cy - 2.5} r="5.2" fill="#c81620" />
              <circle cx={cl.cx + 2} cy={cl.cy - 4} r="1.6" fill="#ffffff" opacity="0.85" />

              <circle cx={cl.cx} cy={cl.cy + 3.5} r="5.2" fill="#c81620" />
              <circle cx={cl.cx - 1.5} cy={cl.cy + 2} r="1.6" fill="#ffffff" opacity="0.85" />
            </g>
          ))}

          {/* Red Bow at Lower-Left */}
          <g transform="translate(86, 296) rotate(12) scale(0.62)">
            {[-1, 1].map((sg) => (
              <React.Fragment key={sg}>
                {/* Loop */}
                <path d={`M 0 0 Q ${sg * 78} -52 ${sg * 68} 0 Q ${sg * 78} 52 0 0`} fill="#d61e2a" />
                {/* Inner Shade */}
                <path d={`M 0 0 Q ${sg * 52} -30 ${sg * 46} 0 Q ${sg * 52} 30 0 0`} fill="#a00e1c" />
                {/* Tail */}
                <polygon
                  points={`0,4 ${sg * 22},70 ${sg * 10},62 ${sg * 2},78 ${-sg * 8},6`}
                  fill="#d61e2a"
                />
              </React.Fragment>
            ))}
            {/* Knot */}
            <circle cx="0" cy="0" r="11" fill="#d61e2a" />
            <circle cx="-2.5" cy="-2.5" r="3.5" fill="#f8707a" opacity="0.85" />
          </g>
        </g>
      )}

      {/* 7. LAYER: SANTA HAT (client hydrated) */}
      {isMounted && (
        <g transform="translate(99.5, 112) rotate(-24) scale(0.7)">
          {/* Hat Body */}
          <path d="M -68 -12 Q -74 -100 22 -106 Q 72 -112 104 -52 Q 72 -44 68 -12 Z" fill="#d61e2a" />
          {/* Left Shade */}
          <path d="M -68 -12 Q -74 -100 22 -106 L -20 -12 Z" fill="#ac101e" />
          {/* Highlight */}
          <path d="M 10 -100 Q 60 -104 88 -62 Q 55 -92 10 -92 Z" fill="rgba(240,70,80,0.55)" />

          {/* Pom-Pom */}
          <circle cx="106" cy="-46" r="21" fill="#fafcff" />
          <circle cx="109" cy="-42" r="13" fill="#dee8f8" />
          <circle cx="100" cy="-52" r="8" fill="#ffffff" />

          {/* Fur Band */}
          <rect x="-80" y="-17" width="160" height="34" rx="10" fill="#fafcff" />
          {/* Fur Scallop Circles */}
          {[-72, -54, -36, -18, 0, 18, 36, 54, 72].map((x) => (
            <React.Fragment key={x}>
              <circle cx={x} cy="-17" r="11" fill="#fafcff" />
              <circle cx={x} cy="17" r="11" fill="#fafcff" />
            </React.Fragment>
          ))}
          {/* Fur Shade Circles */}
          {[-72, -54, -36, -18, 0, 18, 36, 54].map((x) => (
            <circle key={x} cx={x + 9} cy="6" r="8" fill="#dee8f8" />
          ))}
        </g>
      )}

      {/* 8. LAYER: TEXT (real <text>, heavy geometric sans) */}
      <g className="xmas-font">
        {/* Text Drop Shadow */}
        <text
          x="268"
          y="242"
          fontSize="72"
          fontWeight="900"
          textLength="156"
          lengthAdjust="spacing"
          fill="rgba(0,0,0,0.6)"
        >
          HEX
        </text>
        {/* "HEX" */}
        <text
          x="268"
          y="240"
          fontSize="72"
          fontWeight="900"
          textLength="156"
          lengthAdjust="spacing"
          fill="#ffffff"
        >
          HEX
        </text>

        {/* Text Drop Shadow */}
        <text
          x="452"
          y="242"
          fontSize="72"
          fontWeight="900"
          textLength="328"
          lengthAdjust="spacing"
          fill="rgba(0,0,0,0.6)"
        >
          ESCORTS
        </text>
        {/* "ESCORTS" */}
        <text
          x="452"
          y="240"
          fontSize="72"
          fontWeight="900"
          textLength="328"
          lengthAdjust="spacing"
          fill="url(#escortsGradient)"
        >
          ESCORTS
        </text>
      </g>

      {/* 9. LAYER: STARS ON/ABOVE LETTERS (client hydrated) */}
      {isMounted && (
        <g>
          {letterStars.map((st, idx) => (
            <polygon key={idx} points={getSparklePoints(st.cx, st.cy, st.r)} fill={st.color} />
          ))}
        </g>
      )}

      {/* 10. LAYER: UG BADGE */}
      <g>
        {/* Outer Glow Stroke */}
        <rect
          x="813"
          y="161"
          width="174"
          height="98"
          rx="49"
          fill="none"
          stroke="#ff1f7a"
          strokeWidth="6"
          opacity="0.35"
        />
        {/* Pill Background */}
        <rect
          x="816"
          y="164"
          width="168"
          height="92"
          rx="46"
          fill="#2a0a1e"
          stroke="#ff1f7a"
          strokeWidth="3"
        />
        {/* Text "UG" */}
        <text
          x="900"
          y="215"
          fill="#ffd400"
          fontSize="52"
          fontWeight="900"
          textAnchor="middle"
          dominantBaseline="central"
          className="xmas-font"
          style={{ letterSpacing: "2px" }}
        >
          UG
        </text>
      </g>

      {/* 11. LAYER: HOLLY ON UG BADGE (client hydrated) */}
      {isMounted && (
        <g transform="translate(822, 168)">
          {/* Leaf 1: 60/20/-150deg */}
          <g transform="rotate(-150)">
            <path d="M 0 0 C 15 -20 45 -20 60 0 C 45 20 15 20 0 0 Z" fill="#18803a" />
            <line x1="0" y1="0" x2="52" y2="0" stroke="#78d78c" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          {/* Leaf 2: 60/20/-35deg */}
          <g transform="rotate(-35)">
            <path d="M 0 0 C 15 -20 45 -20 60 0 C 45 20 15 20 0 0 Z" fill="#18803a" />
            <line x1="0" y1="0" x2="52" y2="0" stroke="#78d78c" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          {/* Leaf 3: 48/17/-95deg */}
          <g transform="rotate(-95)">
            <path d="M 0 0 C 12 -17 36 -17 48 0 C 36 17 12 17 0 0 Z" fill="#18803a" />
            <line x1="0" y1="0" x2="42" y2="0" stroke="#78d78c" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* 3 Red Berries */}
          <circle cx="-6" cy="-4" r="8.5" fill="#c81620" />
          <circle cx="-8.5" cy="-6.5" r="2.5" fill="#ff7da7" opacity="0.9" />

          <circle cx="8" cy="-5" r="8.5" fill="#c81620" />
          <circle cx="5.5" cy="-7.5" r="2.5" fill="#ff7da7" opacity="0.9" />

          <circle cx="0" cy="7" r="8.5" fill="#c81620" />
          <circle cx="-2.5" cy="4.5" r="2.5" fill="#ff7da7" opacity="0.9" />
        </g>
      )}

      {/* 12. LAYER: SPARKLES (Topmost, client hydrated) */}
      {isMounted && (
        <g>
          {/* Gold r13 at (262, 188) */}
          <polygon points={getSparklePoints(262, 188, 13)} fill="#ffe27a" />
          {/* White r14 at (1062, 206) */}
          <polygon points={getSparklePoints(1062, 206, 14)} fill="#ffffff" />
          {/* Gold r12 at (640, 308) */}
          <polygon points={getSparklePoints(640, 308, 12)} fill="#ffe27a" />
          {/* Gold r11 at (1000, 312) */}
          <polygon points={getSparklePoints(1000, 312, 11)} fill="#ffe27a" />
        </g>
      )}
    </svg>
  );
}

export default ChristmasLogo;
