import { TrustBadge } from "@/components/TrustBadge";
import { LogoBubble } from "@/components/LogoBubble";
import { MOCK_LIVE_ACTIVITY } from "@/lib/mock-data";
import { adapterLogoDomain, getAdapterById } from "@/lib/adapters";

/**
 * Admin review queue (mock data). TODO: gate behind real admin auth and
 * back with a D1 query over `scores` where `human_validation_requested = 1`
 * and `claims` where `status IN ('pending','reviewing')`.
 */
export default function AdminPage() {
  const pendingHumanValidation = MOCK_LIVE_ACTIVITY.filter((e) => e.tier === "caution");
  const flagged = MOCK_LIVE_ACTIVITY.filter((e) => e.tier === "risk");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Admin review queue</h1>
      <p className="mt-2 text-slate-600">
        Items awaiting Human Validation or flagged as high-risk. Demo data only.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Pending Human Validation</h2>
        <div className="mt-4 space-y-3">
          {pendingHumanValidation.map((entry) => {
            const adapter = getAdapterById(entry.platformId);
            return (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <LogoBubble name={adapter?.name ?? "?"} domain={adapter ? adapterLogoDomain(adapter) : undefined} size={32} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {entry.actor} · {adapter?.name}
                    </p>
                    <p className="text-xs text-slate-400">{entry.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrustBadge tier={entry.tier} label={`${entry.score}%`} size="sm" />
                  <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-600">
                    Review
                  </button>
                </div>
              </div>
            );
          })}
          {pendingHumanValidation.length === 0 && (
            <p className="text-sm text-slate-400">Nothing pending right now.</p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Flagged high-risk listings</h2>
        <div className="mt-4 space-y-3">
          {flagged.map((entry) => {
            const adapter = getAdapterById(entry.platformId);
            return (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/40 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <LogoBubble name={adapter?.name ?? "?"} domain={adapter ? adapterLogoDomain(adapter) : undefined} size={32} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {entry.actor} · {adapter?.name}
                    </p>
                    <p className="text-xs text-slate-400">{entry.timestamp}</p>
                  </div>
                </div>
                <TrustBadge tier={entry.tier} label={`${entry.score}%`} size="sm" />
              </div>
            );
          })}
          {flagged.length === 0 && <p className="text-sm text-slate-400">No flagged listings.</p>}
        </div>
      </section>
    </div>
  );
}
