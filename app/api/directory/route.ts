import { NextResponse } from "next/server";
import { detectPlatform } from "@/lib/adapters";
import { aggregateScore, runCheckPipeline, tierForScore, CHECK_PASS_THRESHOLD } from "@/lib/scoring";
import { encodeDirectorySlug } from "@/lib/directory-slug";
import type { DirectoryEntryPayload, DirectoryEntrySubmission, ListingKind } from "@/types";

const VALID_KINDS: ListingKind[] = ["profile", "company", "listing"];

/**
 * Publishes a Trust Check result as a shareable public page: POST
 * { url, kind, displayName, contactEmail } -> { slug, path }.
 *
 * Re-runs the same seeded pipeline used by /api/check (deterministic per
 * URL) so the published page always matches what the user just saw.
 *
 * TODO: once D1 is wired up, INSERT INTO a `directory_entries` table keyed
 * by a short random slug instead of encoding the payload into the slug
 * itself (see lib/directory-slug.ts).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<DirectoryEntrySubmission>;
  const url = body.url?.trim();
  const displayName = body.displayName?.trim();
  const contactEmail = body.contactEmail?.trim();
  const kind = body.kind;

  if (!url || !displayName || !contactEmail || !kind || !VALID_KINDS.includes(kind)) {
    return NextResponse.json(
      { error: "url, kind, displayName and contactEmail are all required." },
      { status: 400 }
    );
  }

  const adapter = detectPlatform(url);
  if (!adapter) {
    return NextResponse.json(
      { error: "Unsupported platform. No matching adapter found for this URL." },
      { status: 422 }
    );
  }

  const checks = runCheckPipeline(url, adapter.checks);
  const score = aggregateScore(checks);
  const { tier, label } = tierForScore(score);
  const checksPassed = checks.filter((c) => c.score >= CHECK_PASS_THRESHOLD).length;

  const payload: DirectoryEntryPayload = {
    kind,
    displayName,
    url,
    platformName: adapter.name,
    score,
    tier,
    tierLabel: label,
    checksPassed,
    checksTotal: checks.length,
    createdAt: new Date().toISOString(),
  };

  const slug = encodeDirectorySlug(payload);

  return NextResponse.json({ slug, path: `/l/${slug}` }, { status: 201 });
}
