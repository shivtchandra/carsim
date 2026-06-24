/**
 * Apply Indian-market powertrain specs from scripts/lib/vehicle-spec-catalog.mjs
 * to variants.json.
 *
 * Run: node scripts/apply-vehicle-specs.mjs
 * Then: node scripts/audit-prices.mjs && node scripts/generate-test-data.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MODEL_RULES, POWERTRAINS } from "./lib/vehicle-spec-catalog.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const variantsPath = resolve(root, "data/variants.json");
const variants = JSON.parse(readFileSync(variantsPath, "utf8"));

function ruleMatches(variant, rule) {
  const m = rule.match ?? {};
  if (m.fuel && variant.fuel !== m.fuel) return false;
  if (m.name && !m.name.test(variant.name)) return false;
  return true;
}

function resolveRule(modelId, variant) {
  const rules = MODEL_RULES[modelId];
  if (!rules) return null;
  return rules.find((r) => ruleMatches(variant, r)) ?? null;
}

let specUpdates = 0;
let txUpdates = 0;
const unmatched = [];

for (const v of variants) {
  const rule = resolveRule(v.modelId, v);
  if (!rule) {
    if (MODEL_RULES[v.modelId]) unmatched.push(`${v.id} (${v.name})`);
    continue;
  }

  const pt = POWERTRAINS[rule.pt];
  if (!pt) {
    console.error(`Missing powertrain ${rule.pt} for ${v.id}`);
    continue;
  }

  v.engine = { ...pt.engine };
  v.claimedFE = pt.claimedFE;
  v.realWorldFE = pt.realWorldFE;
  v.kerbWeight = pt.kerbWeight;
  specUpdates++;

  if (rule.transmission && v.transmission !== rule.transmission) {
    v.transmission = rule.transmission;
    txUpdates++;
  }

  if (rule.hybrid) {
    v.hybrid = rule.hybrid;
  } else if (v.hybrid && !rule.hybrid) {
    delete v.hybrid;
  }
}

writeFileSync(variantsPath, JSON.stringify(variants, null, 2) + "\n");

if (unmatched.length) {
  console.warn(`Unmatched variants (${unmatched.length}):`);
  for (const u of unmatched.slice(0, 20)) console.warn(`  ${u}`);
  if (unmatched.length > 20) console.warn(`  ... and ${unmatched.length - 20} more`);
}

console.log(`Applied specs to ${specUpdates} variants (${txUpdates} transmission fixes).`);
