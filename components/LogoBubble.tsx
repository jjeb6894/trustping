"use client";

import { useState } from "react";

const PALETTE = [
  "bg-brand-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-600",
];

function colorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

interface LogoBubbleProps {
  name: string;
  domain: string;
  size?: number;
}

/**
 * Renders a company's logo mark (via a public logo-lookup service, keyed by
 * domain) purely to visually identify well-known brands by name — not a
 * claim of affiliation or endorsement. Falls back to a colored initial
 * badge if the logo can't be loaded, so nothing ever renders as a broken
 * image icon.
 */
export function LogoBubble({ name, domain, size = 28 }: LogoBubbleProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full text-[10px] font-bold text-white ${colorFor(name)}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {name.charAt(0)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- third-party logo lookup, not an optimizable local/remote asset
    <img
      src={`https://logo.clearbit.com/${domain}?size=128`}
      alt={`${name} logo`}
      width={size}
      height={size}
      className="rounded-full bg-white object-contain ring-1 ring-slate-100"
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
