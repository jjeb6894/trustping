"use client";

import { useEffect, useMemo, useState } from "react";
import { ALPHABET, BRAND_LETTERS } from "@/lib/brand-letters";

const CYCLE_MS = 4000;

interface Bubble {
  id: string;
  brand: string;
  left: number; // percent from left
  top: number; // percent from top
  minWidth: number; // px
  delay: number; // seconds
  duration: number; // seconds
}

function buildBubbles(letter: string): Bubble[] {
  const brands = BRAND_LETTERS[letter] ?? [];
  return brands.map((brand, i) => ({
    id: `${letter}-${brand}-${i}`,
    brand,
    left: 6 + Math.random() * 78,
    top: 18 + Math.random() * 56,
    minWidth: 76 + Math.random() * 40,
    delay: Math.random() * 0.7,
    duration: 3.4 + Math.random() * 1.3,
  }));
}

/**
 * Decorative A-Z carousel: cycles through letters, and for each one floats a
 * cluster of "favorite brand" bubbles that fade/drift in, then disappear
 * before the next letter takes over.
 */
export function BrandLetterCycle() {
  const [index, setIndex] = useState(0);
  const letter = ALPHABET[index];
  // Re-derive bubbles only when the letter changes; keys embed the letter so
  // React remounts fresh elements each cycle, restarting the CSS animation.
  const bubbles = useMemo(() => buildBubbles(letter), [letter]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ALPHABET.length);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto mt-10 h-64 w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-b from-brand-50/70 to-white">
      <p className="absolute left-1/2 top-3 -translate-x-1/2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Favorite brands, A to Z
      </p>
      <span
        key={letter}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-letter-cycle select-none text-8xl font-black text-brand-100"
      >
        {letter}
      </span>
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="absolute animate-bubble-float whitespace-nowrap rounded-full border border-brand-100 bg-white/95 px-3 py-1.5 text-center text-xs font-semibold text-slate-700 shadow-sm"
          style={{
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            minWidth: bubble.minWidth,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        >
          {bubble.brand}
        </span>
      ))}
    </div>
  );
}
