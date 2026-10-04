const STEPS = [
  {
    step: "1",
    title: "Paste a link or search",
    description:
      "Drop in a listing or profile URL to preview the planned user flow.",
  },
  {
    step: "2",
    title: "We run the Trust Check pipeline",
    description:
      "The prototype displays sample signals; it does not perform real image, identity, account, or review checks.",
  },
  {
    step: "3",
    title: "Get a Trust Score & badge",
    description:
      "A simulated 0-100 score with a sample tier badge. It is not a real verification or financial guarantee.",
  },
  {
    step: "4",
    title: "Optional human validation",
    description:
      "Manual reviews are not available in this prototype.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
        <p className="mt-3 text-slate-600">
          Four steps between a sketchy link and real confidence.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-4">
        {STEPS.map((item) => (
          <div key={item.step} className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
              {item.step}
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
