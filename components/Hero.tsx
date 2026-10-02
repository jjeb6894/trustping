import Link from "next/link";
import { CountryBrandBackdrop } from "@/components/CountryBrandBackdrop";
import { LogoBubble } from "@/components/LogoBubble";
import { ADAPTERS, maxChecksPerListing } from "@/lib/adapters";
import { FOUNDED_YEAR, LISTINGS_CHECKED_LABEL, yearsActive } from "@/lib/site-meta";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <CountryBrandBackdrop />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-brand-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Live verifications happening right now
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Paste a link. <br />
            Get a <span className="text-brand-500">Trust Score</span>.
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-600">
            TrustPing checks listings and profiles from eBay, Amazon, Facebook Marketplace,
            AutoTrader, LinkedIn, Instagram and more — then backs the highest-scoring
            transactions with real insurance.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/search"
              className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600"
            >
              Run a Trust Check
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-600"
            >
              See pricing
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <div>
              <p className="text-2xl font-bold text-slate-900">{FOUNDED_YEAR}</p>
              <p>Est. · {yearsActive()}+ years protecting trades</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{LISTINGS_CHECKED_LABEL}</p>
              <p>Listings checked to date</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{ADAPTERS.length}</p>
              <p>Deep-scanned platforms</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{maxChecksPerListing()}</p>
              <p>Independent checks per listing</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200/70 pt-6 text-xs font-medium uppercase tracking-wide text-slate-400">
            <span>Built on</span>
            <span className="flex items-center gap-1.5 normal-case tracking-normal text-slate-600">
              <LogoBubble name="Stripe" domain="stripe.com" size={18} shape="square" />
              Stripe payments
            </span>
            <span className="flex items-center gap-1.5 normal-case tracking-normal text-slate-600">
              <LogoBubble name="Cloudflare" domain="cloudflare.com" size={18} shape="square" />
              Cloudflare edge network
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
