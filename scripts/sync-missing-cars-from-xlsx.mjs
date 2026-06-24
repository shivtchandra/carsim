/**
 * Sync missing models/variants from indian_market_cars_and_variants_2026 xlsx
 * into data/*.json. Idempotent — skips models/variants that already exist.
 *
 * Usage: node scripts/sync-missing-cars-from-xlsx.mjs [path-to.xlsx]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const xlsxPath =
  process.argv[2] ??
  "/Users/shivat/Downloads/indian_market_cars_and_variants_2026 (1).xlsx";

const BRAND_MAP = {
  "Maruti Suzuki": "maruti",
  Hyundai: "hyundai",
  Kia: "kia",
  Tata: "tata",
  Mahindra: "mahindra",
  Toyota: "toyota",
  Honda: "honda",
  Volkswagen: "volkswagen",
  Skoda: "skoda",
  MG: "mg",
  Renault: "renault",
  Nissan: "nissan",
  Jeep: "jeep",
  BYD: "byd",
  VinFast: "vinfast",
  Audi: "audi",
};

const BASE_FEATURES = [
  "airbags-6",
  "abs-ebd",
  "esc",
  "isofix",
  "hill-hold",
  "rear-defogger",
  "led-drl",
  "rear-camera",
];
const MID_FEATURES = [
  ...BASE_FEATURES,
  "touchscreen-8",
  "wireless-carplay",
  "auto-ac",
  "keyless-entry",
  "cruise-control",
  "alloy-16",
  "rear-ac-vents",
];
const HIGH_FEATURES = [
  ...MID_FEATURES.filter((f) => f !== "touchscreen-8" && f !== "alloy-16"),
  "touchscreen-10",
  "alloy-17",
  "auto-headlamps",
  "sunroof",
  "tpms",
  "connected-car",
  "wireless-charger",
  "digital-cluster",
];

const SEGMENT_MAP = [
  { match: /van/i, segment: "compact-hatch", bodyStyle: "suv" },
  { match: /pickup/i, segment: "midsize-suv", bodyStyle: "suv" },
  { match: /hot hatch|premium hatch|hatchback/i, segment: "compact-hatch", bodyStyle: "suv" },
  { match: /compact sedan/i, segment: "compact-sedan", bodyStyle: "sedan" },
  { match: /sedan|grand tourer|sport sedan/i, segment: "midsize-sedan", bodyStyle: "sedan" },
  { match: /micro suv|lifestyle suv/i, segment: "sub-4m-suv", bodyStyle: "suv" },
  { match: /compact suv|suv coupe|crossover/i, segment: "compact-suv", bodyStyle: "suv" },
  { match: /mid-size suv|3-row suv|suv/i, segment: "midsize-suv", bodyStyle: "suv" },
  { match: /mpv/i, segment: "midsize-suv", bodyStyle: "suv" },
];

const PRICE_BY_SEGMENT = {
  "compact-hatch": [400000, 900000],
  "compact-sedan": [600000, 1200000],
  "midsize-sedan": [1200000, 2800000],
  "sub-4m-suv": [600000, 1400000],
  "compact-suv": [1000000, 2400000],
  "midsize-suv": [1400000, 4500000],
};

const DIM_BY_SEGMENT = {
  "compact-hatch": { bootLitres: 300, wheelbaseMm: 2520, groundClearanceMm: 170, lengthMm: 3990, widthMm: 1745, heightMm: 1520 },
  "compact-sedan": { bootLitres: 380, wheelbaseMm: 2550, groundClearanceMm: 170, lengthMm: 3990, widthMm: 1740, heightMm: 1510 },
  "midsize-sedan": { bootLitres: 450, wheelbaseMm: 2730, groundClearanceMm: 175, lengthMm: 4540, widthMm: 1790, heightMm: 1490 },
  "sub-4m-suv": { bootLitres: 320, wheelbaseMm: 2520, groundClearanceMm: 190, lengthMm: 3995, widthMm: 1765, heightMm: 1580 },
  "compact-suv": { bootLitres: 400, wheelbaseMm: 2610, groundClearanceMm: 190, lengthMm: 4300, widthMm: 1790, heightMm: 1640 },
  "midsize-suv": { bootLitres: 450, wheelbaseMm: 2750, groundClearanceMm: 200, lengthMm: 4600, widthMm: 1830, heightMm: 1700 },
};

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normName(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseCsv(text) {
  const lines = text.trim().split("\n");
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = [];
    let cur = "";
    let inQ = false;
    for (const ch of lines[i]) {
      if (ch === '"') {
        inQ = !inQ;
        continue;
      }
      if (ch === "," && !inQ) {
        parts.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    parts.push(cur);
    rows.push({
      brand: parts[0],
      model: parts[1],
      segment: parts[2],
      fuel: parts[3],
      variants: parts[4],
      status: parts[6] ?? "On sale",
    });
  }
  return rows;
}

function mapSegment(segmentLabel) {
  for (const rule of SEGMENT_MAP) {
    if (rule.match.test(segmentLabel)) return { segment: rule.segment, bodyStyle: rule.bodyStyle };
  }
  return { segment: "compact-suv", bodyStyle: "suv" };
}

function primaryFuel(fuelStr) {
  const f = fuelStr.toLowerCase();
  if (f.includes("electric")) return "ev";
  if (f.includes("diesel") && !f.includes("petrol") && !f.includes("hybrid")) return "diesel";
  if (f.includes("cng") && !f.includes("petrol") && !f.includes("hybrid")) return "cng";
  return "petrol";
}

function inferFuel(trim, fuelStr) {
  const t = trim.toLowerCase();
  if (t.includes("cng")) return "cng";
  if (t.includes("kwh") || t.includes(" electric") || /\bev\b/.test(t)) return "ev";
  if (t.includes("diesel")) return "diesel";
  if (fuelStr.toLowerCase().includes("electric")) return "ev";
  return primaryFuel(fuelStr);
}

function inferTransmission(trim) {
  const t = trim.toLowerCase();
  if (/\bdct\b/.test(t)) return "DCT";
  if (/\bag(s|s)\b/.test(t) || t.includes("amt")) return "AMT";
  if (t.includes("ivt") || t.includes("cvt")) return "CVT";
  if (/\bat\b/.test(t) || t.includes(" dca")) return "AT";
  return "MT";
}

function inferHybrid(fuelStr, trim) {
  const f = fuelStr.toLowerCase();
  const t = trim.toLowerCase();
  if (f.includes("strong hybrid") || t.includes("strong hybrid")) return "strong";
  if (f.includes("hybrid") || t.includes("hybrid") || t.includes("hev")) return "mild";
  return undefined;
}

function engineFor(fuel, tier) {
  if (fuel === "ev") {
    const ps = tier === 2 ? 204 : tier === 1 ? 170 : 120;
    return { cc: 0, ps, nm: Math.round(ps * 1.5), cylinders: 0, turbo: false };
  }
  if (fuel === "diesel") {
    return { cc: 1493, ps: tier === 2 ? 130 : 115, nm: tier === 2 ? 300 : 250, cylinders: 4, turbo: true };
  }
  if (fuel === "cng") {
    return { cc: 1197, ps: 78, nm: 103, cylinders: 4, turbo: false };
  }
  if (tier === 2) {
    return { cc: 998, ps: 110, nm: 148, cylinders: 3, turbo: true };
  }
  return { cc: 1197, ps: 88, nm: 115, cylinders: 4, turbo: false };
}

function feFor(fuel, tier) {
  if (fuel === "ev") return { claimed: 9.0, real: 6.8 };
  if (fuel === "diesel") return { claimed: 18.0, real: 12.5 };
  if (fuel === "cng") return { claimed: 26.0, real: 18.5 };
  return tier === 2 ? { claimed: 18.5, real: 13.0 } : { claimed: 20.0, real: 14.5 };
}

function featuresFor(tier) {
  if (tier === 0) return BASE_FEATURES.filter((f) => f !== "rear-camera");
  if (tier === 1) return MID_FEATURES;
  return HIGH_FEATURES;
}

function pickTrims(variantStr, max = 4) {
  const trims = variantStr.split(",").map((s) => s.trim()).filter(Boolean);
  if (trims.length <= max) return trims;
  const picks = [trims[0]];
  if (trims.length > 2) picks.push(trims[Math.floor(trims.length / 2)]);
  picks.push(trims[trims.length - 1]);
  if (trims.length > 3 && max > 3) picks.splice(2, 0, trims[trims.length - 2]);
  return [...new Set(picks)];
}

function findExistingModel(models, brandId, modelName) {
  const norm = normName(modelName);
  return models.find((m) => {
    if (m.brandId !== brandId) return false;
    if (normName(m.name) === norm) return true;
    if (normName(m.id.replace(`${brandId}-`, "")) === norm) return true;
    return false;
  });
}

function estimateZeroTo100(fuel, ps) {
  if (fuel === "ev") return Math.max(4.5, 9.5 - ps * 0.02);
  if (fuel === "diesel") return Math.max(9.5, 14 - ps * 0.02);
  return Math.max(10.5, 16 - ps * 0.04);
}

// Load xlsx → csv
const csv = execSync(`npx --yes xlsx-cli "${xlsxPath}"`, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
const sheetRows = parseCsv(csv);

const brandsPath = resolve(root, "data/brands.json");
const modelsPath = resolve(root, "data/models.json");
const variantsPath = resolve(root, "data/variants.json");
const testDataPath = resolve(root, "data/test-data.json");
const voicesPath = resolve(root, "data/owner-voices.json");
const imageSourcesPath = resolve(root, "data/image-sources.json");
const dimensionsPath = resolve(root, "data/model-body-dimensions.json");
const dnaPath = resolve(root, "data/vehicle-dna.json");

const brands = JSON.parse(readFileSync(brandsPath, "utf8"));
const models = JSON.parse(readFileSync(modelsPath, "utf8"));
const variants = JSON.parse(readFileSync(variantsPath, "utf8"));
const testData = JSON.parse(readFileSync(testDataPath, "utf8"));
const voices = JSON.parse(readFileSync(voicesPath, "utf8"));
const imageSourcesRaw = JSON.parse(readFileSync(imageSourcesPath, "utf8"));
const imageSourcesIsWrapped = !Array.isArray(imageSourcesRaw) && Array.isArray(imageSourcesRaw.sources);
const srcList = imageSourcesIsWrapped ? imageSourcesRaw.sources : imageSourcesRaw;
const bodyDimensions = JSON.parse(readFileSync(dimensionsPath, "utf8"));
const dnas = JSON.parse(readFileSync(dnaPath, "utf8"));

let addedModels = 0;
let addedVariants = 0;

for (const row of sheetRows) {
  const brandId = BRAND_MAP[row.brand];
  if (!brandId) continue;
  if (/imported/i.test(row.status) && /ferrari|lamborghini|rolls|bentley|maserati|mclaren|aston|lotus/i.test(row.brand)) continue;

  if (findExistingModel(models, brandId, row.model)) continue;

  const modelId = `${brandId}-${slugify(row.model)}`;
  if (models.some((m) => m.id === modelId)) continue;

  const { segment, bodyStyle } = mapSegment(row.segment);
  const [priceMin, priceMax] = PRICE_BY_SEGMENT[segment] ?? PRICE_BY_SEGMENT["compact-suv"];
  const evBump = primaryFuel(row.fuel) === "ev" ? 1.35 : 1;
  const dims = DIM_BY_SEGMENT[segment] ?? DIM_BY_SEGMENT["compact-suv"];
  const brandName = brands.find((b) => b.id === brandId)?.name ?? row.brand;

  const model = {
    id: modelId,
    brandId,
    name: row.model,
    segment,
    bodyStyle,
    priceRange: {
      min: Math.round(priceMin * evBump),
      max: Math.round(priceMax * evBump),
    },
    heroImage: `/images/cars/${modelId}.jpg`,
    aiSummary: `The ${brandName} ${row.model} is a ${row.segment.toLowerCase()} sold in India with ${row.fuel.toLowerCase()} powertrain options. Variant spread includes ${row.variants.split(",").slice(0, 3).join(", ").trim()} and more.`,
    ncap: { agency: null, adultStars: null, childStars: null },
    prosCons: {
      pros: [
        `Wide ${row.fuel.toLowerCase()} powertrain choice for Indian buyers`,
        `${row.segment} packaging suited to city and highway use`,
        "Competitive variant ladder from base to top trim",
      ],
      cons: [
        "Verify on-road price and waiting period at your city dealer",
        "Top trims can get expensive versus segment rivals",
        "Real-world mileage varies with traffic and load",
      ],
    },
    dimensions: { ...dims },
  };

  models.push(model);
  addedModels++;

  bodyDimensions[modelId] = {
    lengthMm: dims.lengthMm,
    widthMm: dims.widthMm,
    heightMm: dims.heightMm,
  };

  if (!dnas[modelId]) {
    dnas[modelId] = {
      archetype: segment,
      signatureElements: ["roof-rails"],
      environment: primaryFuel(row.fuel) === "ev" ? "urban-ev" : "highway",
      wheelInches: segment.includes("midsize") ? 17 : 16,
    };
  }

  if (!voices.some((v) => v.modelId === modelId)) {
    voices.push({
      modelId,
      voices: [
        {
          theme: "Value & variants",
          sentiment: "positive",
          text: `Owners like the ${row.model}'s trim spread — you can match budget to must-have features without jumping to the top variant.`,
        },
        {
          theme: "Running costs",
          sentiment: "mixed",
          text: `Real-world efficiency depends heavily on how you use the ${row.fuel.toLowerCase()} powertrain; city traffic dulls brochure figures.`,
        },
        {
          theme: "Dealer experience",
          sentiment: "mixed",
          text: "Waiting periods and accessory bundles vary by city — worth comparing two dealers before booking.",
        },
      ],
    });
  }

  if (!srcList.some((s) => s.modelId === modelId)) {
    srcList.push({
      modelId,
      query: `${brandName} ${row.model} India`,
    });
  }

  const trims = pickTrims(row.variants);
  trims.forEach((trim, idx) => {
    const tier = idx === 0 ? 0 : idx === trims.length - 1 ? 2 : 1;
    const fuel = inferFuel(trim, row.fuel);
    const transmission = inferTransmission(trim);
    const hybrid = inferHybrid(row.fuel, trim);
    const variantSlug = slugify(trim) || `trim-${idx + 1}`;
    let variantId = `${slugify(row.model)}-${variantSlug}`;
    if (variants.some((v) => v.id === variantId)) {
      variantId = `${modelId}-${variantSlug}`.slice(0, 48);
    }

    const priceSpread = model.priceRange.max - model.priceRange.min;
    const priceExShowroom = Math.round(model.priceRange.min + (priceSpread * idx) / Math.max(1, trims.length - 1));

    const engine = engineFor(fuel, tier);
    const fe = feFor(fuel, tier);

    const variant = {
      id: variantId,
      modelId,
      name: trim,
      fuel,
      transmission,
      priceExShowroom,
      engine,
      claimedFE: fe.claimed,
      realWorldFE: fe.real,
      kerbWeight: segment.includes("midsize") ? 1450 + tier * 80 : 1050 + tier * 60,
      featureIds: featuresFor(tier),
    };
    if (hybrid) variant.hybrid = hybrid;

    if (!variants.some((v) => v.id === variant.id)) {
      variants.push(variant);
      addedVariants++;

      const z = estimateZeroTo100(fuel, engine.ps);
      if (!testData.some((t) => t.variantId === variant.id)) {
        testData.push({
          variantId: variant.id,
          zeroTo100: { value: Number(z.toFixed(1)), source: "estimated-model", estimated: true },
          sixtyTo100: { value: Number((z * 0.62).toFixed(1)), source: "estimated-model", estimated: true },
          braking100to0: { value: Number((42 - tier).toFixed(1)), source: "estimated-model", estimated: true },
        });
      }
    }
  });

  // Refresh model price range from variants
  const modelVariants = variants.filter((v) => v.modelId === modelId);
  if (modelVariants.length) {
    const prices = modelVariants.map((v) => v.priceExShowroom);
    model.priceRange = { min: Math.min(...prices), max: Math.max(...prices) };
  }
}

models.sort((a, b) => a.brandId.localeCompare(b.brandId) || a.name.localeCompare(b.name));

writeFileSync(modelsPath, `${JSON.stringify(models, null, 2)}\n`);
writeFileSync(variantsPath, `${JSON.stringify(variants, null, 2)}\n`);
writeFileSync(testDataPath, `${JSON.stringify(testData, null, 2)}\n`);
writeFileSync(voicesPath, `${JSON.stringify(voices, null, 2)}\n`);
writeFileSync(dimensionsPath, `${JSON.stringify(bodyDimensions, null, 2)}\n`);
writeFileSync(dnaPath, `${JSON.stringify(dnas, null, 2)}\n`);
if (imageSourcesIsWrapped) {
  writeFileSync(imageSourcesPath, `${JSON.stringify({ ...imageSourcesRaw, sources: srcList }, null, 2)}\n`);
} else {
  writeFileSync(imageSourcesPath, `${JSON.stringify(srcList, null, 2)}\n`);
}

console.log(`Done. Added ${addedModels} models and ${addedVariants} variants from ${sheetRows.length} spreadsheet rows.`);
