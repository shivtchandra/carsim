// Price audit (June 2026): rescales each model's variant price ladder linearly onto
// verified ex-showroom [min, max] anchors (web-sourced: carwale/cardekho/zigwheels/
// official price lists). Models without verified anchors are left untouched.
// Sources noted per line. Run: node scripts/audit-prices.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PRICE_ANCHORS } from "./lib/vehicle-spec-catalog.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const variantsPath = resolve(root, "data/variants.json");
const modelsPath = resolve(root, "data/models.json");
const variants = JSON.parse(readFileSync(variantsPath, "utf8"));
const models = JSON.parse(readFileSync(modelsPath, "utf8"));

const L = 100000;
// Verified anchors, ex-showroom ₹ (June 2026). Shiva: audit and re-run.
const VERIFIED = {
  "hyundai-creta": [11.1 * L, 20.15 * L], // hyundai.com/in price page; SX(O) Turbo DCT DT ₹20.15L
  "kia-seltos": [10.99 * L, 20.21 * L], // kia.com/in: HTE ₹10.99L, X-Line (A) ₹20.21L
  "tata-curvv": [9.7 * L, 19.1 * L], // cardekho
  "tata-nexon": [7.32 * L, 14.22 * L], // cardekho
  "hyundai-venue": [7.94 * L, 15.82 * L], // cardekho (new-gen)
  "maruti-brezza": [8.26 * L, 13.01 * L], // carwale
  "kia-sonet": [7.33 * L, 14.0 * L], // kia.com/in
  "nissan-magnite": [5.65 * L, 11.4 * L], // 91wheels
  "honda-city": [12.5 * L, 17.0 * L], // autopunditz (2026 facelift, petrol ladder)
  "hyundai-verna": [10.98 * L, 17.5 * L], // cartoq
  "vw-virtus": [10.5 * L, 18.6 * L], // post-GST-2.0 cut
  "skoda-slavia": [10.3 * L, 18.2 * L], // post-GST-2.0 cut
  "mahindra-xuv-3xo": [7.54 * L, 14.89 * L], // carwale
  "honda-elevate": [11.05 * L, 16.4 * L], // cardekho
  "skoda-kushaq": [10.61 * L, 19.2 * L], // cardekho (Classic ₹10.61L)
  "mahindra-scorpio-n": [13.85 * L, 24.5 * L], // cardekho
  "mahindra-xuv700": [13.66 * L, 25.0 * L], // cardekho (XUV 7XO)
  "tata-harrier": [14.99 * L, 26.0 * L], // timesdrive
  "mg-hector": [13.99 * L, 23.0 * L], // cardekho
  // Newly synced models (June 2026, carwale/cardekho/v3cars)
  "maruti-alto-k10": [3.69 * L, 5.45 * L],
  "maruti-s-presso": [4.0 * L, 6.5 * L],
  "maruti-celerio": [5.37 * L, 7.14 * L],
  "maruti-wagon-r": [5.54 * L, 7.52 * L],
  "maruti-xl6": [11.61 * L, 14.52 * L],
  "maruti-jimny": [12.39 * L, 14.52 * L],
  "maruti-ignis": [5.84 * L, 8.48 * L],
  "maruti-invicto": [25.21 * L, 28.97 * L],
  "tata-tiago": [4.69 * L, 8.55 * L],
  "tata-tigor": [6.3 * L, 10.5 * L],
  "tata-nexon-ev": [12.49 * L, 17.49 * L],
  "tata-punch-ev": [9.99 * L, 14.99 * L],
  "tata-curvv-ev": [17.49 * L, 21.99 * L],
  "renault-kwid": [4.3 * L, 5.9 * L],
  "renault-triber": [5.76 * L, 9.17 * L],
  "renault-duster": [10.0 * L, 16.5 * L],
  "hyundai-alcazar": [14.51 * L, 21.25 * L],
  "hyundai-aura": [6.29 * L, 9.64 * L],
  "hyundai-grand-i10-nios": [5.84 * L, 9.14 * L],
  "hyundai-creta-electric": [17.99 * L, 24.0 * L],
  "kia-syros": [8.99 * L, 15.99 * L],
  "kia-carnival": [37.0 * L, 47.0 * L],
  "kia-ev6": [65.97 * L, 70.97 * L],
  "toyota-glanza": [6.81 * L, 10.0 * L],
  "toyota-rumion": [10.44 * L, 13.63 * L],
  "toyota-innova-hycross": [18.3 * L, 30.0 * L],
  "mg-comet-ev": [7.49 * L, 9.99 * L],
  "mg-gloster": [38.0 * L, 45.0 * L],
  "mg-hector-plus": [14.99 * L, 22.5 * L],
  "jeep-meridian": [24.99 * L, 34.99 * L],
  "nissan-tekton": [9.99 * L, 16.5 * L],
  "mahindra-xuv400": [15.49 * L, 17.69 * L],
  "mahindra-bolero-neo": [9.79 * L, 12.5 * L],
  // Audi India (June 2026, carwale/cardekho)
  "audi-q3": [43.67 * L, 53.0 * L],
  "audi-a4": [46.88 * L, 55.83 * L],
  "audi-a6": [64.81 * L, 71.66 * L],
  "audi-q5": [65.55 * L, 70.73 * L],
  "audi-q7": [87.17 * L, 96.15 * L],
  "audi-q3-sportback": [53.55 * L, 53.55 * L],
  "audi-q8": [113.0 * L, 115.0 * L],
  "audi-s5-sportback": [73.57 * L, 73.57 * L],
  "audi-rs-q8": [234.0 * L, 238.0 * L],
  "audi-e-tron-gt": [172.0 * L, 172.0 * L],
  "audi-rs-e-tron-gt": [195.0 * L, 195.0 * L],
  // Not re-verified (kept as-is): maruti-grand-vitara, toyota-hyryder, vw-taigun,
  // mg-astor, tata-punch, renault-kiger
  ...Object.fromEntries(
    Object.entries(PRICE_ANCHORS).map(([id, [minL, maxL]]) => [id, [minL * L, maxL * L]]),
  ),
};

const round1k = (n) => Math.round(n / 1000) * 1000 - 100; // Indian list style ₹X,XX,900

let changed = 0;
for (const [modelId, [newMin, newMax]] of Object.entries(VERIFIED)) {
  const ladder = variants.filter((v) => v.modelId === modelId);
  if (ladder.length === 0) continue;
  const oldMin = Math.min(...ladder.map((v) => v.priceExShowroom));
  const oldMax = Math.max(...ladder.map((v) => v.priceExShowroom));
  for (const v of ladder) {
    const t =
      oldMax === oldMin
        ? ladder.length === 1 && newMax !== newMin
          ? 1 // single top-spec variant → anchor to max
          : 0
        : (v.priceExShowroom - oldMin) / (oldMax - oldMin);
    const next = round1k(newMin + t * (newMax - newMin));
    if (next !== v.priceExShowroom) {
      v.priceExShowroom = next;
      changed++;
    }
  }
  const m = models.find((x) => x.id === modelId);
  if (m) {
    const prices = ladder.map((v) => v.priceExShowroom);
    m.priceRange = { min: Math.min(...prices), max: Math.max(...prices) };
  }
}

writeFileSync(variantsPath, JSON.stringify(variants, null, 2) + "\n");
writeFileSync(modelsPath, JSON.stringify(models, null, 2) + "\n");
console.log(`Rescaled ${Object.keys(VERIFIED).length} models, ${changed} variant prices updated.`);
