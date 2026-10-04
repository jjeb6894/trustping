import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { resolveCountryCode } from "@/lib/geo";
import { getCountryBrandData } from "@/lib/local-brands";
import { scoreLocalBrand } from "@/lib/local-brand-score";
import type { CountryBrandBoard } from "@/types";

/**
 * GET /api/local-brands[?country=MT] -> CountryBrandBoard
 *
 * Detects the visitor's country via IP (Cloudflare's `cf-ipcountry` header
 * in production — see lib/geo.ts) and returns that country's buying/selling
 * sites and everyday brands, each run through the automated (non-AI)
 * signal pipeline in lib/local-brand-score.ts. Trading/marketplace sites
 * are returned first since they're what a visitor is most likely to paste
 * a link from, followed by general consumer brands.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = resolveCountryCode(searchParams.get("country"), await headers());
  const data = getCountryBrandData(countryCode);

  const brands = data.brands
    .map(scoreLocalBrand)
    .sort((a, b) => {
      if (a.brand.segment !== b.brand.segment) {
        return a.brand.segment === "trading" ? -1 : 1;
      }
      return b.score - a.score;
    });

  const board: CountryBrandBoard = {
    countryCode: data.countryCode,
    countryName: data.countryName,
    flag: data.flag,
    brands,
  };

  return NextResponse.json(board);
}
