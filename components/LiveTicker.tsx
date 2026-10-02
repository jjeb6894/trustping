import { MOCK_LIVE_ACTIVITY } from "@/lib/mock-data";
import { getAdapterById } from "@/lib/adapters";
import { TrustBadge } from "./TrustBadge";
import { tierForScore } from "@/lib/scoring";

/** Animated, auto-scrolling feed of recent (mock) verifications on the home page. */
export function LiveTicker() {
  // Duplicate the list so the CSS animation can loop seamlessly.
  const entries = [...MOCK_LIVE_ACTIVITY, ...MOCK_LIVE_ACTIVITY];

  return (
    <div className="ticker-mask relative h-[420px] overflow-hidden rounded-2xl border border-slate-100 bg-white/70 backdrop-blur">
      <div className="animate-ticker-scroll flex flex-col gap-3 p-4">
        {entries.map((entry, i) => {
          const adapter = getAdapterById(entry.platformId);
          const { label } = tierForScore(entry.score);
          return (
            <div
              key={`${entry.id}-${i}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  {adapter?.icon ?? "✨"}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    <span className="font-semibold">{entry.actor}</span> {entry.action}
                  </p>
                  <p className="text-xs text-slate-400">{adapter?.name} · {entry.timestamp}</p>
                </div>
              </div>
              <TrustBadge tier={entry.tier} label={`${entry.score}% · ${label}`} size="sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
