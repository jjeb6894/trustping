const ONE_OFF = [
  {
    id: "one-off-check",
    name: "One-off Trust Check",
    price: "$4.99",
    description: "Planned one-off check; not currently offered.",
    features: ["Simulated checks only", "Sample score and tier", "No insurance coverage"],
  },
  {
    id: "human-validation",
    name: "Human Validation",
    price: "$19.99",
    description: "Planned manual review; not currently offered.",
    features: ["No reviewer is available", "No sign-off is issued", "Claims support is unavailable"],
  },
];

const SELLER_PLANS = [
  {
    id: "seller-starter",
    name: "Starter",
    price: "$9/mo",
    description: "Illustrative plan idea; not currently offered.",
    features: ["5 checks / month", "Badge embed widget", "Email support"],
  },
  {
    id: "seller-pro",
    name: "Pro",
    price: "$29/mo",
    description: "Illustrative plan idea; not currently offered.",
    features: ["50 checks / month", "Priority processing", "Dashboard analytics"],
    highlighted: true,
  },
  {
    id: "seller-business",
    name: "Business",
    price: "$99/mo",
    description: "Illustrative plan idea; not currently offered.",
    features: ["Unlimited checks", "API access", "Dedicated support"],
  },
];

function CheckoutButton() {
  return (
    <div>
      <button
        disabled
        className="w-full cursor-not-allowed rounded-full bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
      >
        Payments unavailable
      </button>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">Planned pricing</h1>
        <p className="mt-3 text-slate-600">
          These are draft plan ideas for the prototype. No checks, reviews, subscriptions, or
          payments are currently available.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {ONE_OFF.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
            <p className="mt-1 text-2xl font-bold text-brand-600">{plan.price}</p>
            <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CheckoutButton />
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-center text-2xl font-bold text-slate-900">
        Seller subscriptions
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {SELLER_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border bg-white p-6 shadow-sm ${
              plan.highlighted ? "border-brand-300 ring-2 ring-brand-100" : "border-slate-100"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
            <p className="mt-1 text-2xl font-bold text-brand-600">{plan.price}</p>
            <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CheckoutButton />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
