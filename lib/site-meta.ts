/**
 * Shared "we've been around a while" facts used across the marketing pages
 * (Hero stats, footer, testimonials). Centralized here so the founding
 * year and headline volume only need to change in one place.
 *
 * TODO: once real usage data exists in D1, replace LISTINGS_CHECKED with a
 * live aggregate query instead of this static placeholder figure.
 */
export const FOUNDED_YEAR = 2019;

export function yearsActive(now: Date = new Date()): number {
  return now.getFullYear() - FOUNDED_YEAR;
}

export const LISTINGS_CHECKED_LABEL = "2.4M+";
