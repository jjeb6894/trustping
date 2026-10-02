import { NextResponse } from "next/server";

/**
 * Photo Metadata Forensics check (stub).
 *
 * TODO: wire up real EXIF/metadata extraction, e.g.:
 *   - exifr (https://github.com/MikeKovarik/exifr) or exiftool for server-side parsing
 *   - Compare capture timestamp/device against listing creation date and seller history
 * Expected real flow: download each listing image, extract EXIF data, and
 * flag images with stripped metadata, mismatched timestamps, or signs of
 * being re-saved from a stock photo site.
 */
export async function POST(request: Request) {
  const { imageUrls } = (await request.json().catch(() => ({}))) as {
    imageUrls?: string[];
  };

  return NextResponse.json({
    type: "metadataForensics",
    stubbed: true,
    receivedImageCount: imageUrls?.length ?? 0,
    findings: [],
    note: "TODO: integrate real EXIF/metadata extraction (exifr, exiftool) and timestamp consistency checks.",
  });
}
