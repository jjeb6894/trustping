"use client";

import { LogoBubble } from "@/components/LogoBubble";
import { useCountryBrandBoard } from "@/hooks/useCountryBrandBoard";
import { GLOBAL_TRUSTED_BRANDS } from "@/lib/trusted-brands";
import { globalBrandDomain } from "@/lib/global-brand-domains";
import {
  LISTINGS_CHECKED_LABEL,
  VERIFIED_SELLS_MORE_PERCENT,
  VERIFIED_VALUE_ADDED_PERCENT,
} from "@/lib/site-meta";

interface TrustedByStripProps {
  logoSize?: number;
  dense?: boolean;
}

/**
 * "Trusted by" strip: always shows a handful of globally recognized brands
 * (so the page feels instantly familiar everywhere) plus 1-2 brands from
 * the visitor's IP-detected country (see lib/geo.ts + hooks/
 * useCountryBrandBoard.ts) — so the exact brand line-up differs per
 * country while the big household names stay constant.
 */
export function TrustedByStrip({ logoSize = 22, dense = false }: TrustedByStripProps) {
  const { board } = useCountryBrandBoard();

  const localExtras = (board?.brands ?? [])
    .filter((entry) => entry.brand.segment === "trading" && !entry.brand.isGlobal)
    .slice(0, 2);

  return (
    <div className={dense ? "space-y-2" : "space-y-4"}>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Trusted by
        </span>
        {GLOBAL_TRUSTED_BRANDS.map((brand) => (
          <span
            key={brand.name}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600"
          >
            <LogoBubble name={brand.name} domain={brand.domain} size={logoSize} shape="square" />
            {brand.name}
          </span>
        ))}
        {localExtras.map((entry) => (
          <span
            key={entry.brand.id}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600"
          >
            <LogoBubble
              name={entry.brand.name}
              domain={globalBrandDomain(entry.brand.name)}
              size={logoSize}
            />
            {entry.brand.name}
            {board && (
              <span className="text-xs font-normal text-slate-400">· {board.countryName}</span>
            )}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="font-semibold text-slate-900">
          {LISTINGS_CHECKED_LABEL} <span className="font-normal text-slate-500">listings verified</span>
        </span>
        <span className="h-4 w-px bg-slate-200" />
        <span className="font-semibold text-emerald-600">
          +{VERIFIED_SELLS_MORE_PERCENT}%{" "}
          <span className="font-normal text-slate-500">more sales on Verified listings</span>
        </span>
        <span className="h-4 w-px bg-slate-200" />
        <span className="font-semibold text-emerald-600">
          +{VERIFIED_VALUE_ADDED_PERCENT}%{" "}
          <span className="font-normal text-slate-500">average value added</span>
        </span>
      </div>
    </div>
  );
}
