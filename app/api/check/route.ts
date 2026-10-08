import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { detectPlatform } from "@/lib/adapters";
import { aggregateScore, runCheckPipeline, tierForScore } from "@/lib/scoring";
import type { TrustScoreResult } from "@/types";
import { saveAutoTraderPhoto } from "@/lib/listing-photo";

/**
 * Main Trust Check pipeline endpoint: POST { url } -> TrustScoreResult.
 *
 * This orchestrates the individual stubbed checks in app/api/check/*.
 * TODO: once real providers are wired up, this should:
 *   1. Fetch the listing HTML (respecting robots.txt / ToS, or use an
 *      official API where the platform provides one).
 *   2. Extract fields using the matched adapter's `selectors`.
 *   3. Call out to the individual check routes (or shared libs) with the
 *      extracted data instead of generating seeded mock scores.
 *   4. Persist the listing + score into D1 (see migrations/0001_init.sql).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { url?: string };
  const url = body.url?.trim();

  if (!url) {
    return NextResponse.json({ error: "Missing `url` in request body." }, { status: 400 });
  }

  const adapter = detectPlatform(url);
  if (!adapter) {
    return NextResponse.json(
      { error: "Unsupported platform. No matching adapter found for this URL." },
      { status: 422 }
    );
  }

  const photoUrl = adapter.id === "autotrader"
    ? await saveAutoTraderPhoto(url).catch(() => null)
    : null;

  const checks = runCheckPipeline(url, adapter.checks);
  const score = aggregateScore(checks);
  const { tier, label } = tierForScore(score);

  const result: TrustScoreResult = {
    id: randomUUID(),
    url,
    platformId: adapter.id,
    platformName: adapter.name,
    score,
    tier,
    tierLabel: label,
    checks,
    photoUrl: photoUrl ?? undefined,
    createdAt: new Date().toISOString(),
  };

  // TODO: INSERT INTO listings/scores (see lib/db.ts + migrations/0001_init.sql)
  // once a D1 binding is available in the deployed environment.

  return NextResponse.json(result);
}
