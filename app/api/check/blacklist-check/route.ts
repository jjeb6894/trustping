import { NextResponse } from "next/server";

/**
 * Scammer Blacklist Database Check (stub).
 *
 * TODO: wire up real fraud/scam-report databases, e.g.:
 *   - Better Business Bureau Scam Tracker (https://www.bbb.org/scamtracker)
 *   - Have I Been Pwned-style community scam-report feeds
 *   - Internal TrustLink claims/reports table (see migrations/0001_init.sql)
 * Expected real flow: match the seller's name/email/phone/domain against
 * known fraud-report databases and TrustLink's own prior claims history.
 */
export async function POST(request: Request) {
  const { sellerId } = (await request.json().catch(() => ({}))) as { sellerId?: string };

  return NextResponse.json({
    type: "blacklistDatabaseCheck",
    stubbed: true,
    sellerId: sellerId ?? null,
    matches: [],
    note: "TODO: integrate real scam/fraud-report databases (BBB Scam Tracker) + internal claims history.",
  });
}
