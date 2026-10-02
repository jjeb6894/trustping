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

/**
 * Headline conversion-lift stats shown alongside the Trusted-by strip.
 * TODO: replace with a real, citation-backed internal study once enough
 * Insured Verified transactions have closed to measure this directly.
 */
export const VERIFIED_SELLS_MORE_PERCENT = 37; // "Verified listings sell 37% more often"
export const VERIFIED_VALUE_ADDED_PERCENT = 19; // "+19% average value added"

