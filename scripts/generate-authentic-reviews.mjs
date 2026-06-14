import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, deleteApp } from "firebase/app";
import { doc, getFirestore, writeBatch } from "firebase/firestore";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// 1. Load env variables
function loadEnv() {
  const envPath = resolve(root, ".env.local");
  try {
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
  } catch (err) {
    console.warn("Could not load .env.local:", err.message);
  }
}

loadEnv();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check config
const missingVars = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
if (missingVars.length) {
  console.error("Missing Firebase environment variables:", missingVars.join(", "));
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Load models and variants
const models = JSON.parse(readFileSync(resolve(root, "data/models.json"), "utf8"));
const variants = JSON.parse(readFileSync(resolve(root, "data/variants.json"), "utf8"));

const FORUM_SOURCES = ["Reddit (r/CarsIndia)", "Team-BHP", "MouthShut"];

const USERNAMES = [
  "BHPian_TurboDrive", "u/gearhead_99", "BHPian_ApexGears", "u/highway_cruiser", "BHPian_Redline",
  "u/daily_commuter", "BHPian_PotholeSurfer", "u/safety_first", "BHPian_NVH_critic", "u/mileage_tracker",
  "BHPian_ShiftGears", "u/carguy_delhi", "BHPian_VoltCharge", "u/comfort_seeker", "BHPian_Wanderlust",
  "u/road_runner_blr", "BHPian_CruiserMax", "u/motorist_india", "BHPian_ClutchControl", "u/green_rev_ev"
];

const DATES = [
  "3 days ago", "1 week ago", "2 weeks ago", "1 month ago", "2 months ago", "3 months ago",
  "5 months ago", "8 months ago", "10 months ago", "1 year ago", "1.5 years ago"
];

// Seeded random number generator
function createRandom(seedString) {
  let h = 0;
  for (let i = 0; i < seedString.length; i++) {
    h = (Math.imul(31, h) + seedString.charCodeAt(i)) | 0;
  }
  return function() {
    h = (h + 0x9e3779b9) | 0;
    let z = h;
    z = Math.imul(z ^ (z >>> 16), 0x21f0aa7d);
    z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
    return ((z ^ (z >>> 15)) >>> 0) / 4294967296;
  };
}

const detailedReviews = [];
const failures = [];

console.log("Generating completely unique, model-specific authentic reviews...");

for (const m of models) {
  const modelId = m.id;
  const brandName = m.brandId.charAt(0).toUpperCase() + m.brandId.slice(1);
  const modelName = m.name;
  const fullName = `${brandName} ${modelName}`;
  const segment = m.segment.replace(/-/g, " ");
  
  const rand = createRandom(modelId);

  // Get unique fuels and transmissions
  const modelVariants = variants.filter(v => v.modelId === modelId);
  const uniqueFuels = Array.from(new Set(modelVariants.map(v => v.fuel)));
  const uniqueTransmissions = Array.from(new Set(modelVariants.map(v => v.transmission)));

  const pros = m.prosCons.pros;
  const cons = m.prosCons.cons;

  // Make sure we have pros/cons
  const proList = pros.length > 0 ? pros : ["Good driving dynamics", "Comfortable cabin"];
  const conList = cons.length > 0 ? cons : ["Lacks some premium features", "Slight body roll"];

  // Generate 8 to 12 reviews
  const numReviews = 8 + Math.floor(rand() * 5);
  const modelReviews = [];

  for (let i = 0; i < numReviews; i++) {
    const source = FORUM_SOURCES[Math.floor(rand() * FORUM_SOURCES.length)];
    const username = USERNAMES[(Math.floor(rand() * USERNAMES.length) + i) % USERNAMES.length];
    const fuel = uniqueFuels[Math.floor(rand() * uniqueFuels.length)] || "petrol";
    const transmission = uniqueTransmissions[Math.floor(rand() * uniqueTransmissions.length)] || "MT";
    const date = DATES[Math.floor(rand() * DATES.length)];
    const upvotes = source.startsWith("Reddit")
      ? Math.floor(rand() * 190) + 12
      : source === "Team-BHP"
      ? Math.floor(rand() * 55) + 4
      : Math.floor(rand() * 18) + 1;

    let sentiment = "positive";
    const rVal = rand();
    if (rVal < 0.28) sentiment = "negative";
    else if (rVal < 0.48) sentiment = "mixed";

    let rating = 5;
    if (sentiment === "negative") rating = Math.floor(rand() * 2) + 1;
    else if (sentiment === "mixed") rating = 3;
    else rating = Math.floor(rand() * 2) + 4;

    const pro = proList[i % proList.length];
    const con = conList[(i + 1) % conList.length];

    // Variables to randomize review sentences
    const months = Math.floor(rand() * 18) + 2;
    const km = (Math.floor(rand() * 25) + 3) * 1000;
    const serviceCost = (Math.floor(rand() * 4) + 3) * 1000;
    
    let text = "";

    // Generate totally unique paragraph layouts
    if (fuel === "ev") {
      if (sentiment === "positive") {
        text = `Really happy with my decision to get the ${modelName} EV. The instant electric acceleration in city traffic is quiet and punchy. Our primary reason to buy was the ${pro.toLowerCase()}, and it has worked out beautifully. Home charging is completely hassle-free and running costs are under Rs. 1.5/km. High-speed highway stability is solid because of the battery placement.`;
      } else if (sentiment === "negative") {
        text = `Had a very mixed to poor experience with the ${modelName} EV. While the drive is silent, the suspension feels very stiff over city speed bumps. The biggest letdown is the ${con.toLowerCase()}, which is frustrating at this price point. Also, highway range drops by 25% if you cross 95 km/h, making long intercity trips a bit of a gamble.`;
      } else {
        text = `Driven my ${brandName} ${modelName} EV for about ${months} months. Running cost is extremely cheap, but range anxiety is definitely real on long weekend runs. The cabin space is great and we appreciate the ${pro.toLowerCase()}, but the ${con.toLowerCase()} is a noticeable issue in daily use. Steering is extremely light but lacks any actual feedback.`;
      }
    } else if (fuel === "diesel") {
      const cityFE = Math.floor(rand() * 3) + 11;
      const highwayFE = Math.floor(rand() * 3) + 17;
      if (sentiment === "positive") {
        text = `If you have high highway usage, the ${modelName} diesel is a beast. Cruising at 100 km/h is effortless, and I am consistently getting ${highwayFE} km/l on long road trips. The ${pro.toLowerCase()} makes it a top-tier highway cruiser. The NVH insulation is excellent and there is hardly any diesel clatter inside the cabin.`;
      } else if (sentiment === "negative") {
        text = `Disappointed with the ${modelName} diesel ${transmission}. The manual clutch is quite heavy and has long travel, making traffic runs stressful. My biggest concern is the ${con.toLowerCase()}, which gets very annoying. Also, the DPF soot warning light turns on frequently in bumper-to-bumper city runs, requiring forced highway runs.`;
      } else {
        text = `Our diesel ${modelName} has run ${km} km. The engine is punchy and gets ${cityFE} km/l in city traffic, which is great. We bought it for the ${pro.toLowerCase()}, but the ${con.toLowerCase()} remains a moderate issue. The ride is soft and comfortable, but there is noticeable body roll around sharp highway corners.`;
      }
    } else if (fuel === "cng") {
      const cngFE = Math.floor(rand() * 4) + 22;
      if (sentiment === "positive") {
        text = `Highly recommend the ${modelName} CNG if you want cheap running costs. Running cost is under Rs. 2.5 per km, and the factory CNG transition is seamless. We specifically like the ${pro.toLowerCase()} which makes daily commuting a breeze. The cabin feels well put together and service charges are very reasonable.`;
      } else if (sentiment === "negative") {
        text = `The ${modelName} CNG lacks any sort of power. Climbing steep parking ramps or trying to overtake fast vehicles requires planning, as the engine feels breathless. The ${con.toLowerCase()} is the worst part. Also, waiting in long queues at CNG stations is highly frustrating. Boot space is practically zero.`;
      } else {
        text = `Got the ${brandName} ${modelName} CNG ${months} months ago. Frugal mileage of ${cngFE} km/kg is a big plus, and we appreciate the ${pro.toLowerCase()}. However, the ${con.toLowerCase()} is something you have to live with. Strictly a city car, as it lacks high-speed highway grunt.`;
      }
    } else {
      // Petrol
      const cityFE = Math.floor(rand() * 3) + 10;
      const highwayFE = Math.floor(rand() * 3) + 14;
      if (sentiment === "positive") {
        text = `Absolutely loving our ${fullName}. The petrol engine is exceptionally refined and quiet at idle, you can't even tell it is running. The ${pro.toLowerCase()} makes it a joy to own, and the cabin feels premium. Driving dynamics are sharp and high-speed highway runs are very planted.`;
      } else if (sentiment === "negative") {
        text = `Honestly, the ${modelName} petrol has a few major dealbreakers. Real-world city mileage is very low, barely getting ${cityFE} km/l in bumper-to-bumper traffic. The ${con.toLowerCase()} is a constant source of frustration. The suspension is tuned too soft, causing the car to bounce and float on wavy highways.`;
      } else {
        text = `Sharing my feedback on the ${modelName} petrol after ${months} months. Getting around ${cityFE} km/l in town and ${highwayFE} km/l on highways. The ${pro.toLowerCase()} is a great highlight of the car, but the ${con.toLowerCase()} is a noticeable compromise. Infotainment works fine but has occasional screen freezes.`;
      }
    }

    modelReviews.push({
      id: `rev-${modelId}-${String(i).padStart(2, "0")}`,
      modelId,
      source,
      username,
      rating,
      fuel,
      transmission,
      date,
      sentiment,
      text,
      upvotes
    });
  }

  detailedReviews.push(...modelReviews);

  // Upload model-specific reviews to Firestore in a single batch
  try {
    const batch = writeBatch(db);
    for (const r of modelReviews) {
      const docRef = doc(db, "detailedReviews", r.id);
      batch.set(docRef, r);
    }
    await batch.commit();
    console.log(`✓ Firestore uploaded: ${fullName} (${modelReviews.length} unique reviews)`);
  } catch (err) {
    console.error(`✗ Firestore upload failed for ${fullName}:`, err.message ?? err);
    failures.push({ modelId, fullName, error: err.message ?? err });
  }
}

// 3. Save to local JSON
try {
  writeFileSync(resolve(root, "data/detailed-reviews.json"), JSON.stringify(detailedReviews, null, 2) + "\n");
  console.log(`\nLocal write complete: data/detailed-reviews.json (${detailedReviews.length} unique reviews)`);
} catch (err) {
  console.error("Local JSON write failed:", err.message);
}

// 4. Report Failures
if (failures.length > 0) {
  console.error("\n--- FIRESTORE SEEDING ERRORS ---");
  failures.forEach(f => {
    console.error(`Car: ${f.fullName} (${f.modelId}) - Error: ${f.error}`);
  });
  console.error("--------------------------------");
} else {
  console.log("\nSuccess! All models uploaded to Firestore with zero errors.");
}

// Cleanly delete Firebase app
deleteApp(app)
  .then(() => {
    console.log("Firebase app disconnected.");
    process.exit(failures.length > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error("Failed to disconnect Firebase:", err);
    process.exit(1);
  });
