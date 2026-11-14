"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
  textSize?: string;
}

/* ─── Christmas string-lights data ─── */
const LIGHTS = [
  "#ff3030", "#ffd700", "#00cc44", "#3399ff", "#ff69b4",
  "#ff3030", "#ffd700", "#00cc44", "#3399ff", "#ff69b4",
  "#ff3030", "#ffd700", "#00cc44", "#3399ff", "#ff69b4",
  "#ff3030", "#ffd700", "#00cc44",
];

/* ─── Snowflake positions (deterministic, no Math.random) ─── */
const FLAKES = [
  { left: "8%",  top: "18%", size: 11, opacity: 0.55, delay: "0s" },
  { left: "18%", top: "72%", size: 9,  opacity: 0.4,  delay: "1.2s" },
  { left: "30%", top: "30%", size: 8,  opacity: 0.5,  delay: "0.6s" },
  { left: "55%", top: "60%", size: 10, opacity: 0.45, delay: "1.8s" },
  { left: "70%", top: "20%", size: 9,  opacity: 0.5,  delay: "0.3s" },
  { left: "82%", top: "75%", size: 8,  opacity: 0.4,  delay: "2.1s" },
  { left: "92%", top: "40%", size: 11, opacity: 0.5,  delay: "0.9s" },
];

/* ─── Gold star sparkles ─── */
const STARS = [
  { left: "24%", top: "55%", delay: "0s" },
  { left: "48%", top: "80%", delay: "0.7s" },
  { left: "75%", top: "55%", delay: "1.4s" },
  { left: "90%", top: "75%", delay: "0.4s" },
];

export function Logo({ size = 42, className, textSize = "2xl" }: LogoProps) {
  const isXl = textSize === "xl";

  return (
    <div className={cn("flex items-center", className)}>
      {/* ══════════ OUTER CHRISTMAS WRAPPER ══════════ */}
      <div
        className="relative flex items-center"
        style={{ isolation: "isolate" }}
      >
        {/* ── Snowflakes (positioned inside wrapper) ── */}
        {FLAKES.map((f, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: f.left,
              top: f.top,
              fontSize: f.size,
              opacity: f.opacity,
              color: "#cce8ff",
              pointerEvents: "none",
              animation: `xmas-spin 6s linear infinite`,
              animationDelay: f.delay,
              zIndex: 0,
            }}
          >
            ❄
          </span>
        ))}

        {/* ── Gold sparkle stars ── */}
        {STARS.map((s, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              fontSize: 11,
              color: "#ffd700",
              pointerEvents: "none",
              animation: `xmas-pulse 2s ease-in-out infinite`,
              animationDelay: s.delay,
              zIndex: 0,
            }}
          >
            ✦
          </span>
        ))}

        {/* ════ STRING LIGHTS BAR (top of the whole header) ════ */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -14,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "flex-end",
            gap: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {/* Green garland / wire */}
          <svg
            width="100%"
            height="22"
            viewBox="0 0 400 22"
            preserveAspectRatio="none"
            style={{ position: "absolute", top: 0, left: 0, right: 0 }}
          >
            {/* wire */}
            <path
              d="M0 8 Q100 14 200 8 Q300 2 400 8"
              stroke="#2d7a2d"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* garland bumps */}
            {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400].map(
              (x, i) => (
                <ellipse
                  key={i}
                  cx={x}
                  cy={i % 2 === 0 ? 7 : 10}
                  rx="6"
                  ry="3.5"
                  fill="#2d7a2d"
                />
              )
            )}
          </svg>

          {/* Coloured bulbs */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 22,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              paddingLeft: 4,
              paddingRight: 4,
            }}
          >
            {LIGHTS.map((color, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* wire drop */}
                <span
                  style={{
                    width: 1.5,
                    height: i % 3 === 0 ? 7 : i % 3 === 1 ? 10 : 5,
                    background: "#555",
                    display: "block",
                  }}
                />
                {/* bulb */}
                <span
                  style={{
                    width: 9,
                    height: 13,
                    borderRadius: "50% 50% 40% 40%",
                    background: color,
                    boxShadow: `0 0 6px 2px ${color}99`,
                    display: "block",
                    animation: `xmas-bulb 1.8s ease-in-out infinite`,
                    animationDelay: `${(i * 0.11).toFixed(2)}s`,
                  }}
                />
              </span>
            ))}
          </div>
        </div>
        {/* ════ END STRING LIGHTS ════ */}

        {/* ════ MAIN LOGO ROW ════ */}
        <div
          className="flex items-center gap-2.5 sm:gap-3"
          style={{ position: "relative", zIndex: 1, paddingTop: 10 }}
        >
          {/* ── LOGO CIRCLE with Wreath + Santa Hat ── */}
          <div className="relative flex-shrink-0" style={{ marginTop: 6 }}>
            {/* Santa Hat — sits above the circle */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -18,
                left: "50%",
                transform: "translateX(-50%) rotate(-8deg)",
                fontSize: isXl ? 24 : 28,
                zIndex: 4,
                pointerEvents: "none",
                lineHeight: 1,
              }}
            >
              🎅
            </span>

            {/* Christmas Wreath ring */}
            <div
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                border: "5px solid #2d7a2d",
                boxShadow:
                  "0 0 0 2px #1a4f1a, 0 0 8px 2px rgba(45,122,45,0.6)",
                zIndex: 2,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              {/* Wreath berries + leaf dots */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i % 3 === 0 ? "#ff2020" : "#1a7a1a",
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translateY(-${(size + 8) / 2 - 1}px) translateX(-50%)`,
                    transformOrigin: "center",
                  }}
                />
              ))}
            </div>

            {/* Red bow at bottom of wreath */}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 12,
                zIndex: 5,
                pointerEvents: "none",
                lineHeight: 1,
              }}
            >
              🎀
            </span>

            {/* The actual logo image */}
            <img
              src="/logo.png"
              alt="Hex Escorts Uganda Logo"
              width={size}
              height={size}
              className="object-cover rounded-full ring-[2.5px] ring-[#ff2079] shadow-[0_0_16px_rgba(255,32,121,0.6)]"
              style={{ position: "relative", zIndex: 3 }}
            />
          </div>

          {/* ── TEXT: HEX ESCORTS UG ── */}
          <div className="flex items-center leading-none">
            <span
              className={cn(
                "font-black tracking-tight flex items-center select-none uppercase",
                isXl ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
              )}
            >
              {/* HEX with snow on top */}
              <span
                style={{ position: "relative", display: "inline-block" }}
                className="mr-1.5"
              >
                <span className="text-[#fff8f0] font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  HEX
                </span>
                {/* Snow lumps on HEX */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: -6,
                    left: 0,
                    right: 0,
                    height: 7,
                    background:
                      "radial-gradient(ellipse 55% 100% at 15% 100%, white 60%, transparent 61%)," +
                      "radial-gradient(ellipse 55% 100% at 50% 100%, white 60%, transparent 61%)," +
                      "radial-gradient(ellipse 55% 100% at 85% 100%, white 60%, transparent 61%)",
                    pointerEvents: "none",
                    borderRadius: "60% 60% 0 0",
                  }}
                />
              </span>

              {/* ESCORTS with snow on top */}
              <span
                style={{ position: "relative", display: "inline-block" }}
              >
                <span className="bg-gradient-to-r from-[#ff2079] via-[#ff6036] to-[#ff9800] bg-clip-text text-transparent font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  ESCORTS
                </span>
                {/* Snow lumps on ESCORTS */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: -6,
                    left: 0,
                    right: 0,
                    height: 7,
                    background:
                      "radial-gradient(ellipse 30% 100% at 7% 100%, white 60%, transparent 61%)," +
                      "radial-gradient(ellipse 30% 100% at 21% 100%, white 60%, transparent 61%)," +
                      "radial-gradient(ellipse 30% 100% at 35% 100%, white 60%, transparent 61%)," +
                      "radial-gradient(ellipse 30% 100% at 50% 100%, white 60%, transparent 61%)," +
                      "radial-gradient(ellipse 30% 100% at 65% 100%, white 60%, transparent 61%)," +
                      "radial-gradient(ellipse 30% 100% at 80% 100%, white 60%, transparent 61%)," +
                      "radial-gradient(ellipse 30% 100% at 93% 100%, white 60%, transparent 61%)",
                    pointerEvents: "none",
                    borderRadius: "60% 60% 0 0",
                  }}
                />
              </span>

              {/* Holly between ESCORTS and UG */}
              <span
                aria-hidden="true"
                style={{ fontSize: isXl ? 14 : 16, margin: "0 2px" }}
              >
                🍃
              </span>

              {/* UG badge with festive glow */}
              <span
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[12px] sm:rounded-[14px] bg-[#2a081a] border-2 border-[#9b1b58] text-[#ffd700] text-xs sm:text-sm font-black tracking-wider leading-none flex items-center justify-center"
                style={{
                  boxShadow:
                    "0 0 12px rgba(155,27,88,0.35), 0 0 20px rgba(255,215,0,0.25)",
                  marginLeft: 4,
                }}
              >
                UG
              </span>
            </span>
          </div>
        </div>
        {/* ════ END MAIN LOGO ROW ════ */}
      </div>

      {/* ── Keyframe styles injected once ── */}
      <style>{`
        @keyframes xmas-bulb {
          0%, 100% { opacity: 1; filter: brightness(1.1); }
          50%       { opacity: 0.5; filter: brightness(0.6); }
        }
        @keyframes xmas-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes xmas-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}
