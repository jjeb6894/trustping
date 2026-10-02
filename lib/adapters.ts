import type { PlatformAdapter, PlatformCategory } from "@/types";

// Statically imported so the adapter set is bundled at build time and works
// on the Cloudflare Workers runtime (no filesystem access at request time).
// Adding a new platform is as simple as dropping a new JSON file here and
// importing + appending it below — no other code changes required.
import ebay from "@/adapters/ebay.json";
import amazon from "@/adapters/amazon.json";
import gumtree from "@/adapters/gumtree.json";
import facebookMarketplace from "@/adapters/facebook-marketplace.json";
import autotrader from "@/adapters/autotrader.json";
import carsCom from "@/adapters/cars-com.json";
import linkedin from "@/adapters/linkedin.json";
import fiverr from "@/adapters/fiverr.json";
import instagram from "@/adapters/instagram.json";
import facebookInfluencer from "@/adapters/facebook-influencer.json";

export const ADAPTERS: PlatformAdapter[] = [
  ebay,
  amazon,
  gumtree,
  facebookMarketplace,
  autotrader,
  carsCom,
  linkedin,
  fiverr,
  instagram,
  facebookInfluencer,
] as PlatformAdapter[];

export const CATEGORY_LABELS: Record<PlatformCategory, string> = {
  marketplace: "Marketplaces",
  "car-sales": "Car Sales",
  professional: "Professional Profiles",
  "social-influencer": "Social / Influencer",
};

export const CATEGORY_ORDER: PlatformCategory[] = [
  "marketplace",
  "car-sales",
  "professional",
  "social-influencer",
];

export function getAdapterById(id: string): PlatformAdapter | undefined {
  return ADAPTERS.find((adapter) => adapter.id === id);
}

/** The canonical apex domain used for logo lookups (first non-www entry in `domains`). */
export function adapterLogoDomain(adapter: PlatformAdapter): string {
  const bare = adapter.domains.find((d) => !d.startsWith("www."));
  return (bare ?? adapter.domains[0]).replace(/^www\./, "");
}

/** Most checks run for any single listing (varies by platform category). */
export function maxChecksPerListing(): number {
  return Math.max(...ADAPTERS.map((adapter) => adapter.checks.length));
}

/** Resolve which platform adapter matches a pasted URL, if any. */
export function detectPlatform(inputUrl: string): PlatformAdapter | undefined {
  let url: URL;
  try {
    url = new URL(inputUrl.trim());
  } catch {
    return undefined;
  }

  const host = url.hostname.replace(/^www\./, "");
  const href = url.toString();

  // Prefer the most specific pattern match (e.g. Facebook Marketplace before
  // the generic Facebook/influencer adapter) by checking urlPatterns first.
  const byPattern = ADAPTERS.find((adapter) =>
    adapter.urlPatterns.some((pattern) => {
      try {
        return new RegExp(pattern).test(href);
      } catch {
        return false;
      }
    })
  );
  if (byPattern) return byPattern;

  return ADAPTERS.find((adapter) =>
    adapter.domains.some((domain) => host === domain.replace(/^www\./, ""))
  );
}

export function groupAdaptersByCategory(): Record<PlatformCategory, PlatformAdapter[]> {
  const grouped = {} as Record<PlatformCategory, PlatformAdapter[]>;
  for (const category of CATEGORY_ORDER) {
    grouped[category] = ADAPTERS.filter((adapter) => adapter.category === category);
  }
  return grouped;
}
