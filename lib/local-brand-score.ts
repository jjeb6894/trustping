import { tierForScore } from "@/lib/scoring";
import {
  afterSalesSignal,
  checkInSignal,
  googleMyBusinessSignal,
  priceValueSignal,
  trustpilotSignal,
} from "@/lib/local-brand-signals";
import type { LocalBrand, LocalBrandScore, LocalBrandSignalResult } from "@/types";

/** Fixed weights (no AI/ML tuning) combining the automated signals into one composite score. */
const SIGNAL_WEIGHTS: Record<string, number> = {
  googleMyBusiness: 1.2,
  trustpilot: 1,
  checkIns: 0.6,
  priceValue: 1,
  afterSales: 1,
};

/** Runs every automated signal check for a brand and combines them with the weights above. */
export function scoreLocalBrand(brand: LocalBrand): LocalBrandScore {
  const signals: LocalBrandSignalResult[] = [
    googleMyBusinessSignal(brand),
    trustpilotSignal(brand),
    checkInSignal(brand),
    priceValueSignal(brand),
    afterSalesSignal(brand),
  ];

  const totalWeight = signals.reduce((sum, s) => sum + (SIGNAL_WEIGHTS[s.type] ?? 1), 0);
  const weighted = signals.reduce((sum, s) => sum + s.score * (SIGNAL_WEIGHTS[s.type] ?? 1), 0);
  const score = Math.round(weighted / totalWeight);
  const { tier, label } = tierForScore(score);

  const byType = Object.fromEntries(signals.map((s) => [s.type, s.score])) as Record<
    string,
    number
  >;

  return {
    brand,
    score,
    tier,
    tierLabel: label,
    breakdown: {
      trust: byType.googleMyBusiness ?? 0,
      quality: byType.trustpilot ?? 0,
      afterSales: byType.afterSales ?? 0,
      price: byType.priceValue ?? 0,
      popularity: byType.checkIns ?? 0,
    },
    signals,
  };
}
