/**
 * Shared domain types for TrustPing.
 */

export type PlatformCategory =
  | "marketplace"
  | "car-sales"
  | "professional"
  | "social-influencer";

export type CheckType =
  | "reverseImageSearch"
  | "aiImageDetection"
  | "crossPlatformMatch"
  | "accountAgeHistory"
  | "reviewSentiment";

/** One row in an adapter's `selectors` map: a CSS selector + what it extracts. */
export interface AdapterSelector {
  selector: string;
  attribute?: string; // e.g. "src", "href" — omit for text content
  description: string;
}

/** A single supported platform, defined entirely by config (no code changes). */
export interface PlatformAdapter {
  id: string;
  name: string;
  category: PlatformCategory;
  domains: string[]; // hostnames (without protocol) this adapter matches
  urlPatterns: string[]; // regex strings tested against the full URL
  icon: string; // emoji or short glyph used in the mega-menu
  description: string;
  selectors: Record<string, AdapterSelector>;
  checks: CheckType[]; // which pipeline checks apply to this platform
  notes?: string;
}

export interface CheckResult {
  type: CheckType;
  label: string;
  score: number; // 0-100 contribution score for this individual check
  weight: number; // relative weight used when aggregating
  summary: string;
  detail?: string;
  stubbed: true; // every check in this scaffold is a stub pending real APIs
}

export type TrustTier = "insured" | "trusted" | "caution" | "risk";

export interface TrustScoreResult {
  id: string;
  url: string;
  platformId: string;
  platformName: string;
  score: number; // 0-100 aggregate
  tier: TrustTier;
  tierLabel: string;
  checks: CheckResult[];
  createdAt: string;
}

export interface LiveActivityEntry {
  id: string;
  actor: string; // masked username, e.g. "u***34"
  action: string; // e.g. "just listed a verified car"
  platformId: string;
  score: number;
  tier: TrustTier;
  timestamp: string;
}

export interface ClaimSubmission {
  id?: string;
  listingUrl: string;
  trustScoreId?: string;
  claimantName: string;
  claimantEmail: string;
  amount: number;
  currency: string;
  description: string;
  status?: "pending" | "reviewing" | "approved" | "denied";
}
