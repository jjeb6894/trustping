/**
 * Known apex domains for the handful of international chains that recur
 * across multiple `data/local-brands/*.json` country files (`isGlobal:
 * true`). Used to show a real logo via LogoBubble instead of an emoji.
 * Country-local businesses intentionally have no entry here — they render
 * a clean colored-initial badge instead, since there's no real domain to
 * look a logo up by.
 */
export const GLOBAL_BRAND_DOMAINS: Record<string, string> = {
  Amazon: "amazon.com",
  eBay: "ebay.com",
  "Facebook Marketplace": "facebook.com",
  "McDonald's": "mcdonalds.com",
  Starbucks: "starbucks.com",
};

export function globalBrandDomain(name: string): string | undefined {
  return GLOBAL_BRAND_DOMAINS[name];
}
