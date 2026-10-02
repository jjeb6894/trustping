import { NextResponse } from "next/server";

/**
 * Account Age & History check (stub).
 *
 * TODO: wire up real account-history signals, e.g.:
 *   - Parse "member since" / "joined" dates directly from the adapter's
 *     selectors (several adapters already define a `joinedDate` selector).
 *   - For vehicles, cross-reference VIN history (NHTSA vPIC, Carfax-style
 *     report APIs) via the autotrader/cars-com adapters' `vin` selector.
 * Expected real flow: compute an account-age score + flag prior suspensions
 * or listing removals where that data is available.
 */
export async function POST(request: Request) {
  const { platformId, joinedDate } = (await request.json().catch(() => ({}))) as {
    platformId?: string;
    joinedDate?: string;
  };

  return NextResponse.json({
    type: "accountAgeHistory",
    stubbed: true,
    platformId: platformId ?? null,
    joinedDate: joinedDate ?? null,
    flags: [],
    note: "TODO: integrate real account-history / VIN-history data sources.",
  });
}
