import { seededScore } from "@/lib/scoring";
import type { LocalBrand, LocalBrandSignalResult, LocalBrandSignalType } from "@/types";

/**
 * Automated (rule-based) signal checks for the homepage "Local Trust Board".
 *
 * These are deliberately NOT AI/LLM calls — each one is a fixed, repeatable
 * formula over data that would come from a real public API, seeded here so
 * the same brand always produces the same demo numbers. Every function has
 * a TODO marking the real integration it stands in for.
 */

function makeSignal(
  type: LocalBrandSignalType,
  label: string,
  brand: LocalBrand,
  min: number,
  max: number,
  summary: (score: number) => string
): LocalBrandSignalResult {
  const score = seededScore(`${brand.id}:${type}`, min, max);
  return { type, label, score, summary: summary(score), stubbed: true };
}

/**
 * TODO: replace with the Google Places API "Place Details" rating +
 * user_ratings_total fields (https://developers.google.com/maps/documentation/places/web-service/details).
 * Automation: normalize the 1-5 star rating and review volume into 0-100.
 */
export function googleMyBusinessSignal(brand: LocalBrand): LocalBrandSignalResult {
  return makeSignal("googleMyBusiness", "Google Business Profile rating", brand, 55, 98, (score) =>
    score > 80
      ? "Strong Google Business Profile rating with a healthy volume of reviews."
      : "Google Business Profile rating is mixed or based on few reviews."
  );
}

/**
 * TODO: replace with the Trustpilot Business Units API
 * (https://developers.trustpilot.com/business-units-api).
 * Automation: pull TrustScore (0-5) and convert to 0-100.
 */
export function trustpilotSignal(brand: LocalBrand): LocalBrandSignalResult {
  return makeSignal("trustpilot", "Trustpilot score", brand, 50, 97, (score) =>
    score > 80
      ? "Trustpilot TrustScore is consistently high."
      : "Trustpilot TrustScore shows room for improvement."
  );
}

/**
 * TODO: replace with a check-in/foot-traffic signal, e.g. Foursquare Places
 * API or Facebook Page Insights check-in counts.
 * Automation: rolling 90-day check-in volume normalized against category peers.
 */
export function checkInSignal(brand: LocalBrand): LocalBrandSignalResult {
  return makeSignal("checkIns", "Check-in / foot-traffic volume", brand, 45, 95, (score) =>
    score > 80
      ? "High, steady check-in volume compared to similar businesses."
      : "Check-in volume is lower than category average."
  );
}

/**
 * TODO: replace with a real keyword-frequency pass over pulled review text
 * (Google/Trustpilot review bodies). This is rule-based, not AI: count
 * occurrences of price/value keywords ("overpriced", "worth it", "cheap",
 * "good deal", etc.) and convert the positive/negative ratio to a score.
 */
const PRICE_VALUE_KEYWORDS = {
  positive: ["worth it", "good value", "fair price", "good deal"],
  negative: ["overpriced", "rip off", "too expensive", "hidden fees"],
};
export function priceValueSignal(brand: LocalBrand): LocalBrandSignalResult {
  // Stand-in for the keyword tally described above until real review text
  // is wired in — still a fixed formula, just seeded instead of counted.
  const score = seededScore(`${brand.id}:priceValue`, 50, 96);
  return {
    type: "priceValue",
    label: "Price/value keyword scan",
    score,
    summary:
      score > 80
        ? `Review text skews toward "${PRICE_VALUE_KEYWORDS.positive[0]}" style language.`
        : `Review text includes recurring "${PRICE_VALUE_KEYWORDS.negative[0]}" style complaints.`,
    stubbed: true,
  };
}

/**
 * TODO: replace with a complaint-resolution/returns-automation signal, e.g.
 * BBB complaint-response rate or a support-ticket SLA feed.
 * Automation: resolved-vs-opened ratio and average response time, normalized.
 */
export function afterSalesSignal(brand: LocalBrand): LocalBrandSignalResult {
  return makeSignal("afterSales", "After-sales support ease", brand, 45, 95, (score) =>
    score > 80
      ? "Returns/support requests are resolved quickly and consistently."
      : "Support/returns reports describe slower or inconsistent resolution."
  );
}
