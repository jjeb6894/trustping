import { NextResponse } from "next/server";

/**
 * Reverse Image Search check (stub).
 *
 * TODO: wire up a real reverse image search provider, e.g.:
 *   - Google Cloud Vision "Web Detection" (https://cloud.google.com/vision/docs/detecting-web)
 *   - TinEye API (https://tineye.com/api)
 * Expected real flow: fetch each listing image URL from the adapter's
 * `selectors.images`, submit to the provider, and score down if the same
 * image appears on unrelated listings/domains.
 */
export async function POST(request: Request) {
  const { imageUrls } = (await request.json().catch(() => ({}))) as {
    imageUrls?: string[];
  };

  return NextResponse.json({
    type: "reverseImageSearch",
    stubbed: true,
    receivedImageCount: imageUrls?.length ?? 0,
    matches: [],
    note: "TODO: integrate a real reverse image search API (Google Vision Web Detection, TinEye, etc.).",
  });
}
