import Link from "next/link";
import { TrustBadge } from "@/components/TrustBadge";
import { MOCK_LIVE_ACTIVITY } from "@/lib/mock-data";
import { getAdapterById } from "@/lib/adapters";

/**
 * Profile dashboard (mock data). TODO: replace with a real auth-gated
 * session + D1 query over `listings`/`scores` scoped to the logged-in user.
 */
export default function DashboardPage() {
  const myChecks = MOCK_LIVE_ACTIVITY.slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your dashboard</h1>
          <p className="mt-2 text-slate-600">
            Track past Trust Checks, subscription status and claims. (Demo data — no auth wired
            up yet.)
          </p>
        </div>
        <Link
          href="/search"
          className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Run a new check
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Plan</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Pro — $29/mo</p>
          <p className="mt-1 text-sm text-slate-500">Next billing: mock data</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Checks this month
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">12 / 50</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Open claims
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">0</p>
        </div>
      </div>

      <h2 className="mt-12 text-xl font-semibold text-slate-900">Recent Trust Checks</h2>
      <div className="mt-4 space-y-3">
        {myChecks.map((entry) => {
          const adapter = getAdapterById(entry.platformId);
          return (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  {adapter?.icon ?? "✨"}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{adapter?.name}</p>
                  <p className="text-xs text-slate-400">{entry.timestamp}</p>
                </div>
              </div>
              <TrustBadge tier={entry.tier} label={`${entry.score}%`} size="sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
