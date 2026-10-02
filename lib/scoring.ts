import type { CheckResult, CheckType, TrustTier } from "@/types";

export const TIER_THRESHOLDS: { tier: TrustTier; min: number; label: string }[] = [
  { tier: "insured", min: 90, label: "Insured Verified" },
  { tier: "trusted", min: 70, label: "Trusted" },
  { tier: "caution", min: 40, label: "Caution" },
  { tier: "risk", min: 0, label: "High Risk" },
];

export function tierForScore(score: number): { tier: TrustTier; label: string } {
  const match = TIER_THRESHOLDS.find((t) => score >= t.min)!;
  return { tier: match.tier, label: match.label };
}

export const TIER_STYLES: Record<
  TrustTier,
  { bg: string; text: string; ring: string; dot: string }
> = {
  insured: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-tier-insured",
  },
  trusted: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    dot: "bg-tier-trusted",
  },
  caution: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-tier-caution",
  },
  risk: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
    dot: "bg-tier-risk",
  },
};

export const CHECK_LABELS: Record<CheckType, string> = {
  reverseImageSearch: "Reverse Image Search",
  aiImageDetection: "AI-Generated Image Detection",
  crossPlatformMatch: "Cross-Platform Identity Match",
  accountAgeHistory: "Account Age & History",
  reviewSentiment: "Review Sentiment Analysis",
  priceAnomalyDetection: "Price Anomaly Detection",
  metadataForensics: "Photo Metadata Forensics",
  domainAgeLookup: "Domain Age & WHOIS Lookup",
  duplicateListingScan: "Duplicate Listing Scan",
  contactInfoVerification: "Contact Info Verification",
  blacklistDatabaseCheck: "Scammer Blacklist Database Check",
  socialProofVerification: "Social Proof & Follower Authenticity",
  paymentRiskCheck: "Payment Method Risk Check",
  listingConsistencyCheck: "Listing Consistency Check",
  shippingPolicyRiskCheck: "Shipping & Refund Policy Risk Check",
};

const CHECK_WEIGHTS: Record<CheckType, number> = {
  reverseImageSearch: 1,
  aiImageDetection: 1,
  crossPlatformMatch: 0.8,
  accountAgeHistory: 1.2,
  reviewSentiment: 1,
  priceAnomalyDetection: 0.9,
  metadataForensics: 0.7,
  domainAgeLookup: 0.6,
  duplicateListingScan: 0.9,
  contactInfoVerification: 0.7,
  blacklistDatabaseCheck: 1.3,
  socialProofVerification: 0.8,
  paymentRiskCheck: 1.1,
  listingConsistencyCheck: 0.8,
  shippingPolicyRiskCheck: 0.6,
};

/**
 * Deterministic pseudo-random score generator seeded from the URL so the
 * same listing always gets the same mock result during local development.
 * TODO: replace with real provider calls (see app/api/check/*).
 */
export function seededScore(seed: string, min = 55, max = 99): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = (Math.abs(hash) % 1000) / 1000;
  return Math.round(min + normalized * (max - min));
}

/**
 * Runs the stubbed trust-check pipeline for a given set of applicable checks.
 * Each individual check is a stand-in for a real integration — see the
 * TODO comments in the app/api/check routes for what to wire up.
 */
export function runCheckPipeline(url: string, checks: CheckType[]): CheckResult[] {
  return checks.map((type) => {
    const score = seededScore(`${url}:${type}`);
    return {
      type,
      label: CHECK_LABELS[type],
      score,
      weight: CHECK_WEIGHTS[type],
      summary: stubSummary(type, score),
      stubbed: true,
    };
  });
}

function stubSummary(type: CheckType, score: number): string {
  switch (type) {
    case "reverseImageSearch":
      return score > 80
        ? "No duplicate listings found elsewhere using these photos."
        : "Similar images found on other listings — may indicate reused stock photos.";
    case "aiImageDetection":
      return score > 80
        ? "Images appear to be genuine, unedited photographs."
        : "Some images show signs of AI generation or heavy editing.";
    case "crossPlatformMatch":
      return score > 80
        ? "Seller identity consistent across linked platforms."
        : "Could not confirm a consistent identity across platforms.";
    case "accountAgeHistory":
      return score > 80
        ? "Established account with a clean history."
        : "Newer account or limited history available.";
    case "reviewSentiment":
      return score > 80
        ? "Overwhelmingly positive review sentiment."
        : "Mixed or sparse review sentiment detected.";
    case "priceAnomalyDetection":
      return score > 80
        ? "Price is consistent with similar listings in this category."
        : "Price is significantly below market average — common scam pattern.";
    case "metadataForensics":
      return score > 80
        ? "Photo metadata (EXIF) is consistent with an original, recent capture."
        : "Photo metadata is missing, stripped, or inconsistent with the listing claims.";
    case "domainAgeLookup":
      return score > 80
        ? "Associated domain/profile has an established registration history."
        : "Associated domain or profile was registered very recently.";
    case "duplicateListingScan":
      return score > 80
        ? "No identical listings found posted elsewhere under different sellers."
        : "The same listing text/photos appear under multiple seller names.";
    case "contactInfoVerification":
      return score > 80
        ? "Listed contact details are well-formed and reachable."
        : "Contact details are missing, malformed, or unreachable.";
    case "blacklistDatabaseCheck":
      return score > 80
        ? "No matches found in known scammer/fraud databases."
        : "Partial match found against reported scam or fraud reports.";
    case "socialProofVerification":
      return score > 80
        ? "Follower/engagement ratio looks organic and consistent."
        : "Follower count and engagement ratio suggest possible fake followers.";
    case "paymentRiskCheck":
      return score > 80
        ? "Only standard buyer-protected payment methods are requested."
        : "High-risk payment methods requested (wire transfer, gift cards, crypto).";
    case "listingConsistencyCheck":
      return score > 80
        ? "Title, description, and photos are consistent with each other."
        : "Mismatch detected between the listing's title, description, and photos.";
    case "shippingPolicyRiskCheck":
      return score > 80
        ? "Standard shipping/refund policy with no major red flags."
        : "No-return / cash-only / no-refund policy detected — elevated risk.";
    default:
      return "Check complete.";
  }
}

/** A check "passes" (gets a tick mark) once it clears this score threshold. */
export const CHECK_PASS_THRESHOLD = 70;

export function aggregateScore(checks: CheckResult[]): number {
  if (checks.length === 0) return 0;
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const weighted = checks.reduce((sum, c) => sum + c.score * c.weight, 0);
  return Math.round(weighted / totalWeight);
}
