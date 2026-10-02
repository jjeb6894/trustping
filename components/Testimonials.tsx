const TESTIMONIALS = [
  {
    quote:
      "I almost bought a car with cloned photos from another listing. TrustPing's reverse image check caught it in seconds.",
    name: "Dana R.",
    role: "Buyer, AutoTrader",
  },
  {
    quote:
      "Getting Insured Verified on my Fiverr gig doubled my inbound inquiries. Buyers trust the badge.",
    name: "Marcus T.",
    role: "Freelancer, Fiverr",
  },
  {
    quote:
      "We use the Claims flow for every high-value sale now. It's the first marketplace-agnostic guarantee I've seen.",
    name: "Priya K.",
    role: "Reseller, eBay & Gumtree",
  },
];

export function Testimonials() {
  return (
    <section className="bg-trust-gradient py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">Trusted by careful buyers and sellers</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur"
            >
              <blockquote className="text-sm leading-relaxed text-slate-700">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-slate-900">
                {t.name}
                <span className="block text-xs font-normal text-slate-500">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
