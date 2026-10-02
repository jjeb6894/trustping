"use client";

import { useState } from "react";

export default function ClaimsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      listingUrl: String(form.get("listingUrl") ?? ""),
      claimantName: String(form.get("claimantName") ?? ""),
      claimantEmail: String(form.get("claimantEmail") ?? ""),
      amount: Math.round(Number(form.get("amount") ?? 0) * 100),
      description: String(form.get("description") ?? ""),
    };

    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not submit claim.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong submitting your claim.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Claim submitted</h1>
        <p className="mt-3 text-slate-600">
          Our team will review your Insured Verified claim and follow up by email.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">File an Insured Verified claim</h1>
      <p className="mt-2 text-slate-600">
        If a transaction on an Insured Verified listing went wrong, tell us what happened.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Listing URL</label>
          <input
            name="listingUrl"
            type="url"
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Your name</label>
            <input
              name="claimantName"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              name="claimantEmail"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Amount lost (USD)</label>
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">What happened?</label>
          <textarea
            name="description"
            rows={5}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
        </div>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit claim"}
        </button>
      </form>
    </div>
  );
}
