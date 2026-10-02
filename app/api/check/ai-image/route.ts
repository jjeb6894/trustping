import { NextResponse } from "next/server";

/**
 * AI-Generated Image Detection check (stub).
 *
 * TODO: wire up a real AI-image detection provider, e.g.:
 *   - Hive Moderation (https://docs.thehive.ai/docs/ai-generated-content-detection)
 *   - Sightengine "genai" model (https://sightengine.com/docs/genai-image-detection)
 * Expected real flow: submit each listing image to the provider and return
 * a per-image probability that it was AI-generated or heavily manipulated.
 */
export async function POST(request: Request) {
  const { imageUrls } = (await request.json().catch(() => ({}))) as {
    imageUrls?: string[];
  };

  return NextResponse.json({
    type: "aiImageDetection",
    stubbed: true,
    receivedImageCount: imageUrls?.length ?? 0,
    results: [],
    note: "TODO: integrate a real AI-image detection API (Hive Moderation, Sightengine genai, etc.).",
  });
}
