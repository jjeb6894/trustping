"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { ScoreGauge } from "@/components/ScoreGauge";
import { TrustBadge } from "@/components/TrustBadge";
import type { TrustScoreResult } from "@/types";

function ResultsContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [result, setResult] = useState<TrustScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setError("No listing URL provided.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Could not check that link.");
        } else {
          setResult(data as TrustScoreResult);
        }
      } catch {
        if (!cancelled) setError("Something went wrong running the Trust Check.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center text-slate-500">
        Running Trust Check pipeline…
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-lg font-semibold text-red-600">{error ?? "No result found."}</p>
        <Link href="/search" className="mt-4 inline-block text-brand-600 hover:underline">
          Try another link
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/search" className="text-sm text-brand-600 hover:underline">
        ← Check another link
      </Link>
      <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 border-b border-slate-100 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {result.platformName}
            </p>
            <p className="mt-1 max-w-sm truncate text-sm text-slate-500">{result.url}</p>
            <div className="mt-4">
              <TrustBadge tier={result.tier} label={result.tierLabel} size="lg" />
            </div>
          </div>
          <ScoreGauge score={result.score} tier={result.tier} />
        </div>

        {result.tier === "insured" && (
          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-100">
            This listing qualifies for <strong>Insured Verified</strong> — TrustPing financially
            backs this transaction. {" "}
            <Link href="/claims" className="font-semibold underline">
              File a claim
            </Link>{" "}
            if something goes wrong.
          </div>
        )}

        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Check breakdown</h2>
          {result.checks.map((check) => (
            <div
              key={check.type}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-4"
            >
              <div>
                <p className="font-medium text-slate-900">{check.label}</p>
                <p className="mt-1 text-sm text-slate-600">{check.summary}</p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {check.score}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Request Human Validation
          </Link>
          <Link
            href="/claims"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-600"
          >
            File a claim
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsContent />
    </Suspense>
  );
}
