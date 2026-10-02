import { TIER_STYLES } from "@/lib/scoring";
import type { TrustTier } from "@/types";

const TIER_ICON: Record<TrustTier, string> = {
  insured: "🛡️",
  trusted: "✅",
  caution: "⚠️",
  risk: "⛔",
};

interface TrustBadgeProps {
  tier: TrustTier;
  label: string;
  size?: "sm" | "md" | "lg";
}

/** Small badge used anywhere we need to show a tier at a glance (cards, ticker, nav). */
export function TrustBadge({ tier, label, size = "md" }: TrustBadgeProps) {
  const style = TIER_STYLES[tier];
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ring-1 ${style.bg} ${style.text} ${style.ring} ${sizeClasses}`}
    >
      <span aria-hidden>{TIER_ICON[tier]}</span>
      {label}
    </span>
  );
}
