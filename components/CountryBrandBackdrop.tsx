"use client";

import { useMemo } from "react";
import { useCountryBrandBoard } from "@/hooks/useCountryBrandBoard";

const POSITIONS = [
  { left: "6%", top: "14%" },
  { left: "82%", top: "10%" },
  { left: "14%", top: "70%" },
  { left: "88%", top: "64%" },
  { left: "46%", top: "6%" },
  { left: "58%", top: "80%" },
  { left: "26%", top: "42%" },
  { left: "72%", top: "38%" },
  { left: "4%", top: "90%" },
  { left: "92%", top: "88%" },
];

/**
 * Decorative background layer for the Hero: based on IP geolocation (see
 * app/api/local-brands/route.ts + lib/geo.ts), shows the detected
 * country's most-used buying/selling sites first, then general brands,
 * as softly floating/fading bubbles behind the hero copy.
 */
export function CountryBrandBackdrop() {
  const { board } = useCountryBrandBoard();
  const bubbles = useMemo(() => board?.brands.slice(0, POSITIONS.length) ?? [], [board]);

  if (!board || bubbles.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-500 shadow-sm backdrop-blur">
        {board.flag} Trust signals near {board.countryName}
      </span>
      {bubbles.map((entry, i) => {
        const pos = POSITIONS[i % POSITIONS.length];
        const isTrading = entry.brand.segment === "trading";
        return (
          <span
            key={entry.brand.id}
            className={`absolute flex animate-brand-drift items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ${
              isTrading
                ? "bg-brand-50/90 text-brand-700 ring-brand-100"
                : "bg-white/80 text-slate-600 ring-slate-100"
            }`}
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: `${(i % 5) * 0.4}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          >
            <span aria-hidden>{entry.brand.icon}</span>
            {entry.brand.name}
            <span className="text-[10px] font-bold text-emerald-600">{entry.score}</span>
          </span>
        );
      })}
    </div>
  );
}
