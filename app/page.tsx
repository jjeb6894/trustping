import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { LiveTicker } from "@/components/LiveTicker";
import { TrustBadge } from "@/components/TrustBadge";
import { LocalListingShowcase } from "@/components/LocalListingShowcase";
import { LocalTrustBoard } from "@/components/LocalTrustBoard";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent verifications</h2>
            <p className="mt-2 max-w-md text-slate-600">
              A live look at listings and profiles getting checked right now across every
              supported platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <TrustBadge tier="insured" label="Insured Verified" />
              <TrustBadge tier="trusted" label="Trusted" />
              <TrustBadge tier="caution" label="Caution" />
              <TrustBadge tier="risk" label="High Risk" />
            </div>
          </div>
          <LiveTicker />
        </div>
      </section>

      <HowItWorks />
      <LocalListingShowcase />
      <LocalTrustBoard />
      <Testimonials />
    </>
  );
}
