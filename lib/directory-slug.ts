import type { DirectoryEntryPayload } from "@/types";

/**
 * Public claimed/listed pages (`/l/[slug]`) are stateless: the slug itself
 * encodes the payload as base64url JSON, so the link works immediately on
 * any Cloudflare Pages edge node without a database round trip.
 *
 * TODO: once D1 is wired up, swap this for a short random slug that's
 * looked up from a `directory_entries` table instead of encoding state in
 * the URL (see migrations/0001_init.sql for the existing listings/scores
 * tables this would join against).
 */

function toBase64Url(input: string): string {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(input, "utf-8").toString("base64")
      : btoa(unescape(encodeURIComponent(input)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const base64 = padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "=");
  return typeof Buffer !== "undefined"
    ? Buffer.from(base64, "base64").toString("utf-8")
    : decodeURIComponent(escape(atob(base64)));
}

function slugifyName(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "trustping"
  );
}

export function encodeDirectorySlug(payload: DirectoryEntryPayload): string {
  const prefix = slugifyName(payload.displayName);
  const token = toBase64Url(JSON.stringify(payload));
  return `${prefix}-${token}`;
}

export function decodeDirectorySlug(slug: string): DirectoryEntryPayload | null {
  const dashIndex = slug.indexOf("-");
  const token = dashIndex === -1 ? slug : slug.slice(dashIndex + 1);
  try {
    const parsed = JSON.parse(fromBase64Url(token));
    if (!parsed || typeof parsed !== "object" || !parsed.url || !parsed.displayName) return null;
    return parsed as DirectoryEntryPayload;
  } catch {
    return null;
  }
}
