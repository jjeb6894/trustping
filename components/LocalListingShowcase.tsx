"use client";

import { TrustBadge } from "@/components/TrustBadge";
import { useCountryBrandBoard } from "@/hooks/useCountryBrandBoard";
import { LogoBubble } from "@/components/LogoBubble";
import { globalBrandDomain } from "@/lib/global-brand-domains";

/** Fake-but-plausible listing copy keyed by brand id, just for the mock screenshots below. */
const SAMPLE_LISTINGS: Record<string, { title: string; price: string; meta: string }> = {
  maltapark: { title: "iPhone 13 Pro – 128GB, like new", price: "€520", meta: "Sliema, Malta" },
  "autotrade-malta": {
    title: "2019 Toyota Corolla – full service history",
    price: "€14,200",
    meta: "Birkirkara, Malta",
  },
  marktplaats: { title: "Gazelle city bike – barely used", price: "€180", meta: "Amsterdam" },
  "bol-com": { title: "Dyson V11 cordless vacuum", price: "€329", meta: "Rotterdam" },
  autoscout24: { title: "2020 Volkswagen Golf – 1 owner", price: "€19,800", meta: "Utrecht" },
  "mobile-de": { title: "2018 BMW 3 Series – low mileage", price: "€21,500", meta: "Munich" },
  "ebay-kleinanzeigen": { title: "IKEA sofa – pickup only", price: "€90", meta: "Berlin" },
  gumtree: { title: "Sony PS5 console + 2 controllers", price: "£340", meta: "Manchester" },
  "autotrader-uk": { title: "2017 Ford Focus – MOT until 2026", price: "£8,950", meta: "Leeds" },
  "cars-com": { title: "2019 Honda Civic – clean title", price: "$16,400", meta: "Austin, TX" },
  ebay: { title: "Vintage leather jacket – size M", price: "$65", meta: "Worldwide shipping" },
  amazon: { title: "Noise-cancelling headphones (open box)", price: "$89", meta: "Third-party seller" },
  "facebook-marketplace": { title: "Dining table + 4 chairs", price: "$150", meta: "Local pickup" },
};
const DEFAULT_LISTING = { title: "Sample listing", price: "—", meta: "" };

/**
 * Shows a few mock "listing screenshot" cards from the detected country's
 * actual buying/selling sites, each stamped with a Verticified badge —
 * a prototype preview of how the badge may look on a listing.
 */
export function LocalListingShowcase() {
  const { board } = useCountryBrandBoard();
  if (!board) return null;

  const tradingSites = board.brands.filter((b) => b.brand.segment === "trading").slice(0, 3);
  if (tradingSites.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-bold text-slate-900">
        {board.flag} The badge, live on {board.countryName}&rsquo;s own listings
      </h2>
      <p className="mt-2 max-w-xl text-slate-600">
        A prototype preview of how a Verticified badge could appear on listings from the sites
        people in your region already use to buy and sell. Nothing here is a real verification.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {tradingSites.map((entry) => {
          const listing = SAMPLE_LISTINGS[entry.brand.id] ?? DEFAULT_LISTING;
          return (
            <div
              key={entry.brand.id}
              className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="flex h-32 items-center justify-center bg-trust-gradient">
                <LogoBubble name={entry.brand.name} domain={globalBrandDomain(entry.brand.name)} size={56} />
              </div>
              <div className="absolute right-3 top-3">
                <TrustBadge tier={entry.tier} label={`${entry.score} · ${entry.tierLabel}`} size="sm" />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {entry.brand.name}
                </p>
                <p className="mt-1 font-semibold text-slate-900">{listing.title}</p>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                  <span>{listing.meta}</span>
                  <span className="font-bold text-slate-900">{listing.price}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
