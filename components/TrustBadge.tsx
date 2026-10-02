import { TIER_STYLES } from "@/lib/scoring";
import type { TrustTier } from "@/types";

/** Clean inline SVG glyphs per tier — no emoji, so badges render consistently across platforms. */
function TierIcon({ tier, className }: { tier: TrustTier; className?: string }) {
  const common = { className, "aria-hidden": true, viewBox: "0 0 20 20", fill: "currentColor" } as const;
  switch (tier) {
    case "insured":
      return (
        <svg {...common}>
          <path d="M10 1.5 3 4v5.2c0 4.6 3 8.3 7 9.3 4-1 7-4.7 7-9.3V4l-7-2.5Zm-.9 11.8L6 10.2l1.1-1.1 2 1.9 4-4 1.1 1.1-5.1 5.2Z" />
        </svg>
      );
    case "trusted":
      return (
        <svg {...common}>
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.9-4.2 4.2a1 1 0 0 1-1.4 0L6 10.2a1 1 0 1 1 1.4-1.4l1 1 3.5-3.5a1 1 0 0 1 1.4 1.4Z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "caution":
      return (
        <svg {...common}>
          <path d="M10 2 1 17h18L10 2Zm0 5.5a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0V8.5a1 1 0 0 1 1-1Zm0 7.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
        </svg>
      );
    case "risk":
      return (
        <svg {...common}>
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.3 6.3a1 1 0 0 1 1.4 0L10 7.6l1.3-1.3a1 1 0 1 1 1.4 1.4L11.4 9l1.3 1.3a1 1 0 0 1-1.4 1.4L10 10.4l-1.3 1.3a1 1 0 0 1-1.4-1.4L8.6 9 7.3 7.7a1 1 0 0 1 0-1.4Z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
}

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
  const iconSize = { sm: "h-3 w-3", md: "h-3.5 w-3.5", lg: "h-4 w-4" }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ring-1 ${style.bg} ${style.text} ${style.ring} ${sizeClasses}`}
    >
      <TierIcon tier={tier} className={iconSize} />
      {label}
    </span>
  );
}
