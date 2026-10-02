import { TIER_STYLES } from "@/lib/scoring";
import type { TrustTier } from "@/types";

const TIER_COLORS: Record<TrustTier, string> = {
  insured: "#0ea86f",
  trusted: "#2f78f5",
  caution: "#e8a83c",
  risk: "#e2483d",
};

interface ScoreGaugeProps {
  score: number;
  tier: TrustTier;
  size?: number;
  label?: string;
}

/** Circular progress gauge showing a 0-100 Trust Score, color-coded by tier. */
export function ScoreGauge({ score, tier, size = 160, label }: ScoreGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);
  const color = TIER_COLORS[tier];
  const style = TIER_STYLES[tier];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#eef2f7"
            strokeWidth={12}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-slate-900">{clamped}</span>
          <span className="text-xs font-medium text-slate-400">/ 100</span>
        </div>
      </div>
      {label && (
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ring-1 ${style.bg} ${style.text} ${style.ring}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
