"use client";

import { TrustBadge } from "@/components/TrustBadge";
import { useCountryBrandBoard } from "@/hooks/useCountryBrandBoard";

const METRICS: { key: "trust" | "price" | "quality" | "afterSales" | "popularity"; label: string }[] = [
  { key: "trust", label: "Trust" },
  { key: "price", label: "Price/value" },
  { key: "quality", label: "Quality" },
  { key: "afterSales", label: "After-sales" },
  { key: "popularity", label: "Popularity" },
];

/**
 * Full "Local Trust Board": every brand/site for the visitor's detected
 * country (trading/marketplace sites first, then everyday brands), with
 * the automated signal breakdown (lib/local-brand-score.ts) shown as bars.
 * Entirely rule-based — no AI/LLM is used to produce these numbers.
 */
export function LocalTrustBoard() {
  const { board, loading } = useCountryBrandBoard();

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      </section>
    );
  }
  if (!board) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {board.flag} Local Trust Board — {board.countryName}
          </h2>
          <p className="mt-2 max-w-xl text-slate-600">
            Detected automatically from your connection. Every score below comes from fixed,
            automated checks (Google Business Profile rating, Trustpilot, check-in volume,
            price/value keyword scans, after-sales resolution rate) — not an AI model.
          </p>
        </div>
        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-100">
          Demo data — connect real providers via the TODOs in lib/local-brand-signals.ts
        </span>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {board.brands.map((entry) => (
          <div
            key={entry.brand.id}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {entry.brand.icon}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{entry.brand.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {entry.brand.segment === "trading" ? "Buying & selling" : "Everyday brand"} ·{" "}
                    {entry.brand.category}
                  </p>
                </div>
              </div>
              <TrustBadge tier={entry.tier} label={`${entry.score}`} size="sm" />
            </div>

            <div className="mt-4 space-y-2">
              {METRICS.map((metric) => {
                const value = entry.breakdown[metric.key];
                return (
                  <div key={metric.key} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-24 shrink-0">{metric.label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand-400"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right font-semibold text-slate-600">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
