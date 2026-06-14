// One-shot: appends diesel ladders for Creta, Seltos, Curvv, XUV 3XO to data/variants.json.
// featureIds are copied from the matching petrol trim. Idempotent (skips existing ids).
import { readFileSync, writeFileSync } from "node:fs";

const variants = JSON.parse(readFileSync("data/variants.json", "utf8"));
const byId = Object.fromEntries(variants.map((v) => [v.id, v]));
const rw = (arai) => Math.round(arai * 0.72 * 10) / 10;

// [id, modelId, name, trans, price, engine{cc,ps,nm,cyl}, claimedFE, kerb, copyFeaturesFrom]
const D = [
  // Hyundai Creta 1.5 U2 CRDi — 116 PS / 250 Nm
  ["creta-e-diesel-mt", "hyundai-creta", "E Diesel", "MT", 1200000, [1493, 116, 250, 4], 21.8, 1400, "creta-e-mt"],
  ["creta-ex-diesel-mt", "hyundai-creta", "EX Diesel", "MT", 1330000, [1493, 116, 250, 4], 21.8, 1402, "creta-ex-mt"],
  ["creta-s-diesel-mt", "hyundai-creta", "S Diesel", "MT", 1450000, [1493, 116, 250, 4], 21.8, 1405, "creta-s-mt"],
  ["creta-sx-diesel-mt", "hyundai-creta", "SX Diesel", "MT", 1660000, [1493, 116, 250, 4], 21.8, 1410, "creta-sx-mt"],
  ["creta-sx-diesel-at", "hyundai-creta", "SX Diesel AT", "AT", 1780000, [1493, 116, 250, 4], 19.1, 1430, "creta-sx-mt"],
  ["creta-sx-o-diesel-at", "hyundai-creta", "SX(O) Diesel AT", "AT", 2030000, [1493, 116, 250, 4], 19.1, 1440, "creta-sx-o-ivt"],
  // Kia Seltos 1.5 CRDi — 116 PS / 250 Nm
  ["seltos-htk-diesel-mt", "kia-seltos", "HTK Diesel", "MT", 1310000, [1493, 116, 250, 4], 20.7, 1405, "seltos-htk-mt"],
  ["seltos-htk-plus-diesel-mt", "kia-seltos", "HTK+ Diesel", "MT", 1460000, [1493, 116, 250, 4], 20.7, 1408, "seltos-htk-plus-mt"],
  ["seltos-htx-diesel-mt", "kia-seltos", "HTX Diesel", "MT", 1650000, [1493, 116, 250, 4], 20.7, 1412, "seltos-htx-mt"],
  ["seltos-htx-plus-diesel-at", "kia-seltos", "HTX+ Diesel AT", "AT", 1890000, [1493, 116, 250, 4], 18.5, 1435, "seltos-htx-plus-mt"],
  ["seltos-x-line-diesel-at", "kia-seltos", "X-Line Diesel AT", "AT", 2060000, [1493, 116, 250, 4], 18.5, 1440, "seltos-x-line-turbo-dct"],
  // Tata Curvv 1.5 Kryojet — 118 PS / 260 Nm
  ["curvv-pure-diesel-mt", "tata-curvv", "Pure 1.5D", "MT", 1170000, [1497, 118, 260, 4], 19.5, 1395, "curvv-pure-mt"],
  ["curvv-creative-diesel-mt", "tata-curvv", "Creative 1.5D", "MT", 1370000, [1497, 118, 260, 4], 19.5, 1400, "curvv-creative-mt"],
  ["curvv-creative-diesel-dct", "tata-curvv", "Creative 1.5D DCT", "DCT", 1470000, [1497, 118, 260, 4], 18.8, 1425, "curvv-creative-dct"],
  ["curvv-accomplished-diesel-dct", "tata-curvv", "Accomplished 1.5D DCT", "DCT", 1680000, [1497, 118, 260, 4], 18.8, 1430, "curvv-accomplished-dct"],
  // Mahindra XUV 3XO 1.5 diesel — 117 PS / 300 Nm
  ["3xo-mx2-diesel-mt", "mahindra-xuv-3xo", "MX2 Diesel", "MT", 999000, [1497, 117, 300, 4], 20.6, 1340, "3xo-mx2-mt"],
  ["3xo-mx3-diesel-mt", "mahindra-xuv-3xo", "MX3 Diesel", "MT", 1090000, [1497, 117, 300, 4], 20.6, 1345, "3xo-mx3-mt"],
  ["3xo-ax5-diesel-mt", "mahindra-xuv-3xo", "AX5 Diesel", "MT", 1250000, [1497, 117, 300, 4], 20.6, 1350, "3xo-ax5-mt"],
  ["3xo-ax7l-diesel-amt", "mahindra-xuv-3xo", "AX7L Diesel AMT", "AMT", 1580000, [1497, 117, 300, 4], 19.9, 1370, "3xo-ax7l-turbo-at"],
];

let added = 0;
for (const [id, modelId, name, transmission, price, [cc, ps, nm, cylinders], claimedFE, kerbWeight, copyFrom] of D) {
  if (byId[id]) continue;
  const donor = byId[copyFrom];
  if (!donor) throw new Error(`donor missing: ${copyFrom}`);
  variants.push({
    id, modelId, name,
    fuel: "diesel",
    transmission,
    priceExShowroom: price,
    engine: { cc, ps, nm, cylinders, turbo: true }, // all modern diesels are turbocharged
    claimedFE,
    realWorldFE: rw(claimedFE),
    kerbWeight,
    featureIds: [...donor.featureIds],
  });
  added++;
}

writeFileSync("data/variants.json", JSON.stringify(variants, null, 2) + "\n");
console.log(`added ${added} diesel variants; total ${variants.length}`);
