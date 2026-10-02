import { NextResponse } from "next/server";

/**
 * Listing Consistency Check (stub).
 *
 * TODO: wire up real title/description/photo consistency analysis, e.g.:
 *   - A vision model comparing photo contents against the listed
 *     title/category (e.g. "iPhone 14" listing with a photo of a laptop)
 *   - Simple keyword-overlap heuristics between title and description
 * Expected real flow: extract title, description, category, and photos via
 * the adapter's selectors, then flag mismatches between what's claimed and
 * what's shown.
 */
export async function POST(request: Request) {
  const { title, description } = (await request.json().catch(() => ({}))) as {
    title?: string;
    description?: string;
  };

  return NextResponse.json({
    type: "listingConsistencyCheck",
    stubbed: true,
    title: title ?? null,
    hasDescription: Boolean(description),
    mismatches: [],
    note: "TODO: integrate real title/description/photo consistency analysis.",
  });
}
