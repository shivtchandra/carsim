// Ownership cost model (spec §5 Phase 5). All tunables live in data/cost-params.json.
import { costParams, getModel, getVariant, variants } from "./data";
import type { City, Fuel } from "./types";

/**
 * Estimated on-road price: ex-showroom + RTO (price-slab rate, diesel surcharge)
 * + first-year insurance + TCS above the threshold + misc charges.
 * State-averaged — always shown with the estimated badge.
 */
export function onRoadEstimate(priceExShowroom: number, fuel: Fuel, city?: City): number {
  const p = costParams.onRoad;
  const slab = p.rtoSlabs.find((s) => s.upTo === null || priceExShowroom <= s.upTo) ?? p.rtoSlabs[p.rtoSlabs.length - 1];
  const rtoRate = slab.rate + (fuel === "diesel" ? p.dieselSurcharge : 0);
  const insurance =
    priceExShowroom * costParams.insurance.firstYearRate * (city?.insuranceMultiplier ?? 1);
  const tcs = priceExShowroom > p.tcsThreshold ? priceExShowroom * p.tcsRate : 0;
  return priceExShowroom + priceExShowroom * rtoRate + insurance + tcs + p.miscCharges;
}

export interface YearCost {
  year: number;
  fuel: number;
  insurance: number;
  maintenance: number;
  tyres: number;
  depreciation: number;
}

export interface CostResult {
  variantId: string;
  years: YearCost[];
  totalFuel: number;
  totalInsurance: number;
  totalMaintenance: number;
  totalTyres: number;
  totalDepreciation: number;
  total: number;
  costPerKm: number;
}

export function computeCost(
  variantId: string,
  city: City,
  kmPerYear: number,
  years: number
): CostResult | null {
  const v = getVariant(variantId);
  const m = v && getModel(v.modelId);
  if (!v || !m) return null;

  const tyreSetCost = (costParams.tyres.costPerSetMin + costParams.tyres.costPerSetMax) / 2;
  const fuelPrice =
    v.fuel === "diesel"
      ? city.dieselPrice
      : v.fuel === "cng"
      ? city.cngPrice
      : v.fuel === "ev"
      ? city.evPrice
      : city.petrolPrice;
  const fuelMaintFactor =
    v.fuel === "diesel"
      ? costParams.dieselMaintenanceFactor
      : v.fuel === "ev"
      ? 0.45
      : v.fuel === "cng"
      ? 1.15
      : 1.0;
  const maintBase =
    (costParams.maintenancePerYearByBrand[m.brandId] ?? 9000) * fuelMaintFactor;
  const brandRetention = costParams.retentionByBrand[m.brandId] ?? [0.85, 0.78, 0.72, 0.66, 0.61, 0.56, 0.52, 0.48];
  const retention = v.fuel === "ev" ? brandRetention.map((r) => r * 0.8) : brandRetention;

  const out: YearCost[] = [];
  let tyreKmAccum = 0;
  for (let y = 1; y <= years; y++) {
    const fuel = (kmPerYear / v.realWorldFE) * fuelPrice;
    const insurance =
      v.priceExShowroom *
      costParams.insurance.firstYearRate *
      Math.pow(1 - costParams.insurance.annualDecline, y - 1) *
      city.insuranceMultiplier;
    const maintenance = maintBase * (costParams.maintenanceAgeScaling[y - 1] ?? 2.1);
    tyreKmAccum += kmPerYear;
    let tyres = 0;
    if (tyreKmAccum >= costParams.tyres.intervalKm) {
      tyres = tyreSetCost * Math.floor(tyreKmAccum / costParams.tyres.intervalKm);
      tyreKmAccum %= costParams.tyres.intervalKm;
    }
    // depreciation booked as the year-over-year retention drop
    const prevRet = y === 1 ? 1 : retention[y - 2];
    const depreciation = v.priceExShowroom * (prevRet - retention[y - 1]);
    out.push({ year: y, fuel, insurance, maintenance, tyres, depreciation });
  }

  const sum = (k: keyof Omit<YearCost, "year">) => out.reduce((s, x) => s + x[k], 0);
  const totalFuel = sum("fuel");
  const totalInsurance = sum("insurance");
  const totalMaintenance = sum("maintenance");
  const totalTyres = sum("tyres");
  const totalDepreciation = sum("depreciation");
  const total = totalFuel + totalInsurance + totalMaintenance + totalTyres + totalDepreciation;

  return {
    variantId,
    years: out,
    totalFuel,
    totalInsurance,
    totalMaintenance,
    totalTyres,
    totalDepreciation,
    total,
    costPerKm: total / (kmPerYear * years),
  };
}

/* ---- Petrol vs diesel decision (same car, two fuels) ----
 * Breakeven = price premium / fuel saving per km. Deterministic; all inputs from data. */
export interface FuelDecision {
  petrolId: string;
  dieselId: string;
  premium: number; // diesel ex-showroom minus petrol
  petrolFuelPerKm: number;
  dieselFuelPerKm: number;
  breakevenKm: number | null; // null if diesel never pays back
  breakevenYears: number | null;
}

export function fuelDecision(
  petrolId: string,
  dieselId: string,
  city: City,
  kmPerYear: number
): FuelDecision | null {
  const p = getVariant(petrolId);
  const d = getVariant(dieselId);
  if (!p || !d) return null;
  const petrolFuelPerKm = city.petrolPrice / p.realWorldFE;
  const dieselFuelPerKm = city.dieselPrice / d.realWorldFE;
  const premium = d.priceExShowroom - p.priceExShowroom;
  const savingPerKm = petrolFuelPerKm - dieselFuelPerKm;
  const breakevenKm = savingPerKm > 0 ? premium / savingPerKm : null;
  return {
    petrolId,
    dieselId,
    premium,
    petrolFuelPerKm,
    dieselFuelPerKm,
    breakevenKm,
    breakevenYears: breakevenKm !== null ? breakevenKm / kmPerYear : null,
  };
}

/** Petrol/diesel trim pairs that exist for a model (matched by closest trim name). */
export function dieselPairsForModel(modelId: string): { petrolId: string; dieselId: string; label: string }[] {
  const all = variants.filter((v) => v.modelId === modelId);
  const diesels = all.filter((v) => v.fuel === "diesel");
  const petrols = all.filter((v) => v.fuel === "petrol");
  const out: { petrolId: string; dieselId: string; label: string }[] = [];
  for (const dv of diesels) {
    const base = dv.name.replace(/\s*Diesel\s*(AT|AMT|DCT)?|\s*1\.5D\s*(DCT)?/gi, "").trim();
    const match =
      petrols.find((pv) => pv.name.toLowerCase().startsWith(base.toLowerCase()) && pv.transmission === dv.transmission) ??
      petrols.find((pv) => pv.name.toLowerCase().startsWith(base.toLowerCase()));
    if (match) out.push({ petrolId: match.id, dieselId: dv.id, label: `${base || dv.name}` });
  }
  return out;
}
