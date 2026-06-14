// Price audit (June 2026): rescales each model's variant price ladder linearly onto
// verified ex-showroom [min, max] anchors (web-sourced: carwale/cardekho/zigwheels/
// official price lists). Models without verified anchors are left untouched.
// Sources noted per line. Run: node scripts/audit-prices.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
  // Not re-verified (kept as-is): maruti-grand-vitara, toyota-hyryder, vw-taigun,
  // mg-astor, tata-punch, renault-kiger
};

const round1k = (n) => Math.round(n / 1000) * 1000 - 100; // Indian list style ₹X,XX,900

let changed = 0;
for (const [modelId, [newMin, newMax]] of Object.entries(VERIFIED)) {
  const ladder = variants.filter((v) => v.modelId === modelId);
  const oldMin = Math.min(...ladder.map((v) => v.priceExShowroom));
  const oldMax = Math.max(...ladder.map((v) => v.priceExShowroom));
  for (const v of ladder) {
    const t = oldMax === oldMin ? 0 : (v.priceExShowroom - oldMin) / (oldMax - oldMin);
    const next = round1k(newMin + t * (newMax - newMin));
    if (next !== v.priceExShowroom) {
      v.priceExShowroom = next;
      changed++;
    }
  }
  const m = models.find((x) => x.id === modelId);
  m.priceRange = { min: round1k(newMin), max: round1k(newMax) };
}

writeFileSync(variantsPath, JSON.stringify(variants, null, 2) + "\n");
writeFileSync(modelsPath, JSON.stringify(models, null, 2) + "\n");
console.log(`Rescaled ${Object.keys(VERIFIED).length} models, ${changed} variant prices updated.`);
