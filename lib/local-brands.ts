import type { CountryBrandData } from "@/types";

// Statically imported (same reasoning as lib/adapters.ts) so this works on
// the Cloudflare Workers runtime, which has no filesystem access at request
// time. Add a new country by dropping a JSON file here and registering it
// below — no other code changes required.
import mt from "@/data/local-brands/mt.json";
import nl from "@/data/local-brands/nl.json";
import de from "@/data/local-brands/de.json";
import gb from "@/data/local-brands/gb.json";
import us from "@/data/local-brands/us.json";
import fallback from "@/data/local-brands/default.json";

export const COUNTRY_BRAND_DATA: Record<string, CountryBrandData> = {
  MT: mt,
  NL: nl,
  DE: de,
  GB: gb,
  US: us,
} as Record<string, CountryBrandData>;

export const DEFAULT_COUNTRY_BRAND_DATA = fallback as CountryBrandData;

/** Looks up the local brand config for a country, falling back to a global default. */
export function getCountryBrandData(countryCode: string): CountryBrandData {
  return COUNTRY_BRAND_DATA[countryCode.toUpperCase()] ?? DEFAULT_COUNTRY_BRAND_DATA;
}
