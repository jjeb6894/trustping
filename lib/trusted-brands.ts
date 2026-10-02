/**
 * Universally recognized brands shown in the homepage "Trusted by" strip —
 * these are always included, everywhere, since the goal is instant
 * familiarity regardless of the visitor's country. The strip then adds a
 * couple of IP-detected local brands (see components/TrustedByStrip.tsx +
 * lib/geo.ts) so the page also feels native to each visitor's country.
 */
export interface TrustedByBrand {
  name: string;
  domain: string;
}

export const GLOBAL_TRUSTED_BRANDS: TrustedByBrand[] = [
  { name: "Cloudflare", domain: "cloudflare.com" },
  { name: "eBay", domain: "ebay.com" },
  { name: "Etsy", domain: "etsy.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Facebook Marketplace", domain: "facebook.com" },
  { name: "Fiverr", domain: "fiverr.com" },
];
