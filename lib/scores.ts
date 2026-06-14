// All deterministic scoring for DriveScope lives here (spec hard rule).
// Every formula is documented inline; nothing here calls AI or randomness.

import type { Feature, Model, Variant } from "./types";
import { features, getTestData, getVariantsForModel, models, costParams } from "./data";

/* ---------------- Phase 3: Variant value verdict ----------------
 * valueScore = Σ(impactScore of gained features) / (priceDelta in lakh)
 *   ≥ 6  → excellent | 3–6 → fair | < 3 → badges
 */
export type Verdict = "excellent" | "fair" | "badges";

export function valueScore(gained: Feature[], priceDeltaInr: number): number {
  const lakh = priceDeltaInr / 100000;
  if (lakh <= 0) return Infinity;
  const impact = gained.reduce((s, f) => s + f.impactScore, 0);
  return impact / lakh;
}

export function verdictFor(score: number): Verdict {
  if (score >= 6) return "excellent";
  if (score >= 3) return "fair";
  return "badges";
}

export const VERDICT_COPY: Record<Verdict, { label: string; color: string }> = {
  excellent: { label: "Excellent value", color: "var(--positive)" },
  fair: { label: "Fair — depends on your usage", color: "var(--warning)" },
  badges: { label: "Paying mostly for badges", color: "var(--negative)" },
};

export function diffVariants(from: Variant, to: Variant) {
  const fromSet = new Set(from.featureIds);
  const toSet = new Set(to.featureIds);
  const gained = features.filter((f) => toSet.has(f.id) && !fromSet.has(f.id));
  const lost = features.filter((f) => fromSet.has(f.id) && !toSet.has(f.id));
  return { gained, lost, priceDelta: to.priceExShowroom - from.priceExShowroom };
}

/* ---------------- Phase 6: Radar axes, each normalized 1–10 ----------------
 * Normalization is linear min→max across the 10 models in the dataset, then
 * scaled to 1–10. Raw metrics per axis:
 *  Performance: best power/weight (PS per tonne) blended 50/50 with inverse best 0–100s
 *  Efficiency:  best realWorldFE across variants
 *  Safety:      NCAP adult stars (0 if unrated) * 2 + count of distinct safety features on top variant
 *  Features:    Σ impactScores of the best-equipped variant
 *  Space:       bootLitres/10 + wheelbaseMm/100, summed
 *  Ownership:   inverse of estimated 5yr running+depreciation cost of the mid variant
 */
export interface RadarScores {
  performance: number;
  efficiency: number;
  safety: number;
  features: number;
  space: number;
  ownership: number;
}

function topVariant(m: Model): Variant {
  const vs = getVariantsForModel(m.id);
  return vs.reduce((a, b) => (b.priceExShowroom > a.priceExShowroom ? b : a));
}

function midVariant(m: Model): Variant {
  const vs = [...getVariantsForModel(m.id)].sort((a, b) => a.priceExShowroom - b.priceExShowroom);
  return vs[Math.floor(vs.length / 2)];
}

function rawMetrics(m: Model) {
  const vs = getVariantsForModel(m.id);
  const top = topVariant(m);

  const bestPw = Math.max(...vs.map((v) => v.engine.ps / (v.kerbWeight / 1000)));
  const best100 = Math.min(...vs.map((v) => getTestData(v.id)?.zeroTo100.value ?? 99));
  const performance = bestPw / 2 + (100 - best100 * 5); // blends PS/t with 0-100

  const efficiency = Math.max(...vs.map((v) => v.realWorldFE));

  const safetyFeatureCount = features.filter(
    (f) => f.category === "safety" && top.featureIds.includes(f.id)
  ).length;
  const safety = (m.ncap.adultStars ?? 0) * 2 + safetyFeatureCount;

  const featureScore = top.featureIds.reduce(
    (s, id) => s + (features.find((f) => f.id === id)?.impactScore ?? 0),
    0
  );

  const space = m.dimensions.bootLitres / 10 + m.dimensions.wheelbaseMm / 100;

  const ownership = -estimate5yrCost(m, midVariant(m)); // lower cost → higher score
  return { performance, efficiency, safety, features: featureScore, space, ownership };
}

/** Simplified 5yr cost (Delhi, 12k km/yr) used ONLY for the radar ownership axis. */
export function estimate5yrCost(m: Model, v: Variant): number {
  const city = costParams.cities[0];
  const km = 12000, years = 5;
  const fuelPrice =
    v.fuel === "diesel"
      ? city.dieselPrice
      : v.fuel === "cng"
      ? city.cngPrice
      : v.fuel === "ev"
      ? city.evPrice
      : city.petrolPrice;
  const fuel = ((km * years) / v.realWorldFE) * fuelPrice;
  let insurance = 0;
  for (let y = 0; y < years; y++)
    insurance += v.priceExShowroom * costParams.insurance.firstYearRate *
      Math.pow(1 - costParams.insurance.annualDecline, y);
  const fuelMaintFactor =
    v.fuel === "diesel"
      ? costParams.dieselMaintenanceFactor
      : v.fuel === "ev"
      ? 0.45
      : v.fuel === "cng"
      ? 1.15
      : 1.0;
  const maint = costParams.maintenancePerYearByBrand[m.brandId] * fuelMaintFactor *
    costParams.maintenanceAgeScaling.slice(0, years).reduce((a, b) => a + b, 0);
  const tyres = Math.floor((km * years) / costParams.tyres.intervalKm) *
    (costParams.tyres.costPerSetMin + costParams.tyres.costPerSetMax) / 2;
  const brandRetention = costParams.retentionByBrand[m.brandId]?.[years - 1] ?? 0.55;
  const retention = v.fuel === "ev" ? brandRetention * 0.8 : brandRetention;
  const depreciation = v.priceExShowroom * (1 - retention);
  return fuel + insurance + maint + tyres + depreciation;
}

export function radarScores(modelIds: string[]): Record<string, RadarScores> {
  // Normalize across ALL 10 models so scores are stable regardless of selection.
  const all = models.map((m) => ({ id: m.id, raw: rawMetrics(m) }));
  const axes = ["performance", "efficiency", "safety", "features", "space", "ownership"] as const;
  const out: Record<string, RadarScores> = {};
  for (const { id, raw } of all) {
    if (!modelIds.includes(id)) continue;
    const scored = {} as RadarScores;
    for (const axis of axes) {
      const vals = all.map((a) => a.raw[axis]);
      const min = Math.min(...vals), max = Math.max(...vals);
      scored[axis] = max === min ? 5.5 : 1 + ((raw[axis] - min) / (max - min)) * 9;
    }
    out[id] = scored;
  }
  return out;
}
