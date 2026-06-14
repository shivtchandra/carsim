import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc, writeBatch } from "firebase/firestore";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const envPath = resolve(root, ".env.local");
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
}

async function seedArray(db, collectionName, items, getId) {
  const CHUNK = 450;
  for (let i = 0; i < items.length; i += CHUNK) {
    const batch = writeBatch(db);
    const chunk = items.slice(i, i + CHUNK);
    for (const item of chunk) {
      batch.set(doc(db, collectionName, getId(item)), item);
    }
    await batch.commit();
    console.log(`  ${collectionName}: ${Math.min(i + chunk.length, items.length)}/${items.length}`);
  }
}

async function seedObjectMap(db, collectionName, map, mergeModelId = false) {
  const entries = Object.entries(map);
  const CHUNK = 450;
  for (let i = 0; i < entries.length; i += CHUNK) {
    const batch = writeBatch(db);
    for (const [id, data] of entries.slice(i, i + CHUNK)) {
      batch.set(doc(db, collectionName, id), mergeModelId ? { modelId: id, ...data } : data);
    }
    await batch.commit();
    console.log(`  ${collectionName}: ${Math.min(i + CHUNK, entries.length)}/${entries.length}`);
  }
}

async function main() {
  const firebaseConfig = getFirebaseConfig();

  const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) {
    console.error("Missing Firebase env vars:", missing.join(", "));
    process.exit(1);
  }

  const db = getFirestore(initializeApp(firebaseConfig));

  console.log("Seeding Firestore project:", firebaseConfig.projectId);

  const brands = readJson("data/brands.json");
  const models = readJson("data/models.json");
  const variants = readJson("data/variants.json");
  const features = readJson("data/features.json");
  const testData = readJson("data/test-data.json");
  const ownerVoices = readJson("data/owner-voices.json");
  const vehicleDna = readJson("data/vehicle-dna.json");
  const understandingFeatures = readJson("data/understanding/features.json");
  const understandingSpecs = readJson("data/understanding/specs.json");
  const costParams = readJson("data/cost-params.json");
  const upgradeInsights = readJson("data/upgrade-insights.json");
  const imageSources = readJson("data/image-sources.json").sources ?? [];

  await seedArray(db, "brands", brands, (b) => b.id);
  await seedArray(db, "models", models, (m) => m.id);
  await seedArray(db, "variants", variants, (v) => v.id);
  await seedArray(db, "features", features, (f) => f.id);
  await seedArray(db, "testData", testData, (t) => t.variantId);
  await seedArray(db, "ownerVoices", ownerVoices, (o) => o.modelId);
  await seedObjectMap(db, "vehicleDna", vehicleDna, true);
  await seedArray(db, "understandingFeatures", understandingFeatures, (f) => f.featureId);
  await seedArray(db, "understandingSpecs", understandingSpecs, (s) => s.specKey);
  await seedArray(
    db,
    "upgradeInsights",
    upgradeInsights.map((row, i) => ({ id: `${row.fromId}__${row.toId}`, ...row })),
    (r) => r.id
  );
  await seedArray(db, "imageSources", imageSources, (s) => s.modelId);

  await setDoc(doc(db, "costParams", "default"), costParams);
  console.log("  costParams: 1/1");

  await setDoc(doc(db, "meta", "seed"), {
    seededAt: new Date().toISOString(),
    collections: {
      brands: brands.length,
      models: models.length,
      variants: variants.length,
      features: features.length,
      testData: testData.length,
      ownerVoices: ownerVoices.length,
      vehicleDna: Object.keys(vehicleDna).length,
      understandingFeatures: understandingFeatures.length,
      understandingSpecs: understandingSpecs.length,
      upgradeInsights: upgradeInsights.length,
      imageSources: imageSources.length,
      costParams: 1,
    },
  });
  console.log("  meta/seed: done");

  const total =
    brands.length +
    models.length +
    variants.length +
    features.length +
    testData.length +
    ownerVoices.length +
    Object.keys(vehicleDna).length +
    understandingFeatures.length +
    understandingSpecs.length +
    upgradeInsights.length +
    imageSources.length +
    2;

  console.log(`\nDone — ${total} documents written to Firestore.`);
}

main().catch((err) => {
  console.error("Seed failed:", err.message ?? err);
  process.exit(1);
});
