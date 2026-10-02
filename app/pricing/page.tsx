"use client";

import { useState } from "react";

const ONE_OFF = [
  {
    id: "one-off-check",
    name: "One-off Trust Check",
    price: "$4.99",
    description: "Instant automated check for a single listing or profile.",
    features: ["All 5 automated checks", "Trust Score + tier badge", "Insured Verified eligible"],
  },
  {
    id: "human-validation",
    name: "Human Validation",
    price: "$19.99",
    description: "A specialist manually reviews the listing on top of the automated pipeline.",
    features: ["Everything in one-off check", "Manual reviewer sign-off", "Priority claims support"],
  },
];

const SELLER_PLANS = [
  {
    id: "seller-starter",
    name: "Starter",
    price: "$9/mo",
    description: "For individual sellers who want ongoing trust badges.",
    features: ["5 checks / month", "Badge embed widget", "Email support"],
  },
  {
    id: "seller-pro",
    name: "Pro",
    price: "$29/mo",
    description: "For active sellers and small dealers.",
    features: ["50 checks / month", "Priority processing", "Dashboard analytics"],
    highlighted: true,
  },
  {
    id: "seller-business",
    name: "Business",
    price: "$99/mo",
    description: "For dealerships, agencies and high-volume sellers.",
    features: ["Unlimited checks", "API access", "Dedicated support"],
  },
];

function CheckoutButton({ planId, label }: { planId: string; label: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(data.error ?? "Stripe checkout is not configured yet.");
    } catch {
      setMessage("Something went wrong starting checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {loading ? "Starting checkout…" : label}
      </button>
      {message && <p className="mt-2 text-xs text-slate-500">{message}</p>}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">Simple, transparent pricing</h1>
        <p className="mt-3 text-slate-600">
          Pay per check, or subscribe as a seller to keep your listings continuously verified.
          Stripe test mode — no real charges.
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
              <CheckoutButton planId={plan.id} label={`Pay ${plan.price}`} />
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
              <CheckoutButton planId={plan.id} label={`Subscribe — ${plan.price}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
