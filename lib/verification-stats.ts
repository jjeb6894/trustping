import { seededScore } from "./scoring";

/**
 * Best-effort hostname extraction from whatever the user has typed so far
 * (works even before they've finished typing a valid URL, e.g. "ebay.com").
 */
export function extractHost(input: string): string | null {
  const trimmed = input.trim();
  if (trimmed.length < 4) return null;

  const candidates = [trimmed, `https://${trimmed.replace(/^https?:\/\//, "")}`];
  for (const candidate of candidates) {
    try {
      const host = new URL(candidate).hostname.replace(/^www\./, "");
      if (host.includes(".")) return host;
    } catch {
      // keep trying the next candidate
    }
  }
  return null;
}

/**
 * Deterministic "social proof" number — how many people have already run a
 * Trust Check against this host. Seeded so the same domain always shows the
 * same big number during local development.
 *
 * TODO: replace with `SELECT COUNT(*) FROM listings WHERE host = ?` against
 * the real D1 `listings` table once checks are persisted.
 */
export function alreadyVerifiedCount(host: string): number {
  return seededScore(`verified-count:${host}`, 1200, 48000);
}

export function formatVerifiedCount(count: number): string {
  return count.toLocaleString("en-US");
}
