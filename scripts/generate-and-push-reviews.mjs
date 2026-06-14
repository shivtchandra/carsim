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

const USERNAMES = [
  "u/driving_ninja", "u/gear_head_delhi", "BHPian_TurboMax", "u/commute_ease", "u/highway_cruiser",
  "u/carguy_92", "u/mileage_tracker", "BHPian_Redline", "u/family_roadtrips", "u/city_zipper",
  "u/tech_on_wheels", "u/electric_soul", "BHPian_SafetyFirst", "u/automatic_only", "u/suspension_critic",
  "BHPian_MotorHead", "u/petrol_purist", "u/torque_addict", "BHPian_GreenDrive", "u/daily_commuter_blr",
  "u/enthusiast_pune", "BHPian_Wanderer", "u/mumbai_traffic_survivor", "u/gadget_freak", "u/ncap_fanatic",
  "u/value_seeker", "BHPian_ShiftGears", "u/mileage_king", "u/smooth_operator", "BHPian_VoltCharge",
  "u/clutch_rider", "u/highway_runner", "BHPian_Vroom", "u/weekend_explorer", "u/comfort_first",
  "u/sound_buff", "BHPian_PotholeSurfer", "u/cabin_silence", "u/headlight_tester", "u/practical_buyer",
  "BHPian_TorqueVector", "u/hatchback_lover", "u/sedan_guy", "u/suv_life", "BHPian_Cruising",
  "u/city_parker", "u/first_car_owner", "u/reliability_fan", "BHPian_ApexApex", "u/piston_head"
];

const SOURCES = ["Reddit", "Team-BHP", "MouthShut", "DriveScope Verified Owner"];

const DATES = [
  "2 days ago", "5 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago",
  "2 months ago", "3 months ago", "4 months ago", "5 months ago", "6 months ago",
  "8 months ago", "10 months ago", "1 year ago", "1.2 years ago", "1.5 years ago", "2 years ago"
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

console.log(`Starting generation of 150 reviews per model (total 40 models) & uploading to Firestore project "${firebaseConfig.projectId}"...`);

for (const m of models) {
  const modelId = m.id;
  const brandName = m.brandId.charAt(0).toUpperCase() + m.brandId.slice(1);
  const modelName = m.name;
  const fullName = `${brandName} ${modelName}`;

  const rand = createRandom(modelId);

  // Get unique fuels and transmissions
  const modelVariants = variants.filter(v => v.modelId === modelId);
  const uniqueFuels = Array.from(new Set(modelVariants.map(v => v.fuel)));
  const uniqueTransmissions = Array.from(new Set(modelVariants.map(v => v.transmission)));

  const modelReviews = [];
  const totalReviews = 150;

  for (let i = 0; i < totalReviews; i++) {
    const source = SOURCES[Math.floor(rand() * SOURCES.length)];
    const username = USERNAMES[(Math.floor(rand() * USERNAMES.length) + i) % USERNAMES.length];
    const fuel = uniqueFuels[Math.floor(rand() * uniqueFuels.length)] || "petrol";
    const transmission = uniqueTransmissions[Math.floor(rand() * uniqueTransmissions.length)] || "MT";
    const date = DATES[Math.floor(rand() * DATES.length)];
    const upvotes = source === "Reddit"
      ? Math.floor(rand() * 250) + 5
      : source === "Team-BHP"
      ? Math.floor(rand() * 50) + 2
      : Math.floor(rand() * 20) + 1;

    let sentiment = "positive";
    const rVal = rand();
    if (rVal < 0.28) sentiment = "negative";
    else if (rVal < 0.48) sentiment = "mixed";

    let rating = 5;
    if (sentiment === "negative") rating = Math.floor(rand() * 2) + 1;
    else if (sentiment === "mixed") rating = 3;
    else rating = Math.floor(rand() * 2) + 4;

    // Rich dynamic content mixing
    const openPhrases = [
      `Sharing my review of the ${fullName} after driving it for a while.`,
      `Here is my honest ownership experience with the ${modelName}.`,
      `Bought this car 3 months ago and wanted to give feedback.`,
      `My daily driver is a ${transmission} version.`,
      `Just finished a long highway road trip in our new ${modelName}.`,
      `Transitioned to this from my old hatchback, and I am mostly satisfied.`,
      `Thought I would share my feedback on this segment choice.`,
      `After 5,000 km on the odometer, here are my thoughts.`,
      `Writing this post to help prospective buyers looking at the ${modelName}.`
    ];

    const closePhrases = [
      `Overall, highly recommended for families looking at this segment.`,
      `Decent value for money, but make sure to test drive competitors first.`,
      `Great package but watch out for service network issues depending on your city.`,
      `Very satisfied with the purchase, zero regrets so far.`,
      `A solid product from ${brandName}, definitely worth shortlisting.`,
      `It has its minor quirks, but overall the strengths outshine the weaknesses.`,
      `Check your budget and variant differences before choosing.`,
      `If you want peace of mind, this is a very safe option.`
    ];

    let bodyText = "";
    if (fuel === "ev") {
      const evPoints = {
        positive: [
          "The instant torque is amazing and makes overtakes completely effortless. The cabin is silent as a tomb.",
          "Home charging is seamless and the running cost is exceptionally low, about ₹1.5/km. Regeneration works perfectly in traffic.",
          "The battery pack gives a very reliable range of 350-380 km in real-world driving. Fast charging is quick and convenient.",
          "Very smooth power delivery and the interior feels spacious. The battery weight gives it great highway stability."
        ],
        negative: [
          "The real range drops significantly to around 220 km if you drive at 100+ km/h on expressways. Public charging is still frustrating.",
          "The suspension is too stiff due to the heavy battery pack, causing crashes and thuds over sharp bumps.",
          "Had minor electrical bugs where the infotainment system randomly froze. Software updates from dealer are slow.",
          "Initial premium cost is quite high. It takes a lot of yearly running to break even compared to a petrol variant."
        ],
        mixed: [
          "The running cost savings are great, but the rear seat floor is slightly raised, which compromises long-distance leg comfort.",
          "Range is around 300 km which is fine for cities, but range anxiety is real on long highway routes.",
          "Very refined drive but the steering feels artificial and lacks feedback. Feature list is good though."
        ]
      };
      const arr = evPoints[sentiment];
      bodyText = arr[Math.floor(rand() * arr.length)];
    } else if (fuel === "diesel") {
      const dieselPoints = {
        positive: [
          "The mid-range torque is addicting, makes highway cruising exceptionally relaxing. The engine settles nicely at speed.",
          "Getting incredible highway mileage of 18-20 km/l. It is the perfect choice if you have high monthly usage.",
          "The refinement is surprisingly good for a diesel. NVH control inside the cabin is impressive.",
          "The automatic gearbox options pair brilliantly with this motor. Very effortless and torque-rich response."
        ],
        negative: [
          "The heavy clutch in the manual version is exhausting in stop-and-go city traffic. Go for the automatic.",
          "BS6 DPF warning light is a constant irritation if you only drive in the city. You have to take it to highways to clear soot.",
          "Cold start engine noise is loud and vibrations are felt through the pedals. Maintenance costs are also slightly high.",
          "Future of diesel passenger vehicles is uncertain with tightening norms, which might affect long-term resale value."
        ],
        mixed: [
          "Great mileage and punch, but there is noticeable turbo lag below 1500 RPM. You need to shift down in traffic.",
          "Power is excellent on open roads, but service costs are definitely higher than the petrol engine.",
          "The engine is frugal but feels slightly heavy in tight city handling compared to light petrol models."
        ]
      };
      const arr = dieselPoints[sentiment];
      bodyText = arr[Math.floor(rand() * arr.length)];
    } else if (fuel === "cng") {
      const cngPoints = {
        positive: [
          "Extremely economical to run. Running cost is under ₹2.5 per km. Factory CNG integration is clean and safe.",
          "Transition between petrol and CNG modes is seamless. The engine refinement remains very acceptable.",
          "Perfect for daily city commuting. CNG mileage is outstanding, easily delivering 24+ km/kg.",
          "The twin-cylinder setup is a game changer, leaving decent boot space for small bags compared to old single tanks."
        ],
        negative: [
          "Power drop in CNG mode is very obvious. It struggles on steep flyovers or when fully loaded with luggage.",
          "Refueling queues at CNG pumps are long and painful. Also, the rear suspension sagged under full load.",
          "Boot space is completely gone if you have the older single cylinder variant. Can't fit any large bags.",
          "Engine feels breathless on the highway, overtaking requires switching back to petrol mode manually."
        ],
        mixed: [
          "Saves a lot on fuel bills, but performance is slow. Good for sedate city drivers, not for enthusiasts.",
          "Economical running but ground clearance drops when loaded. CNG tank weight makes the rear bouncy over speed breakers.",
          "Refining is okay, but spark plug checks and filters need more frequent replacement at service."
        ]
      };
      const arr = cngPoints[sentiment];
      bodyText = arr[Math.floor(rand() * arr.length)];
    } else {
      // Petrol
      const petrolPoints = {
        positive: [
          "The engine is exceptionally refined and silent at idle. You can barely tell if the car is on.",
          "The turbo petrol option has got solid performance. Shifting is crisp and handling is quite responsive.",
          "Very smooth linear acceleration and the cabin ergonomics are excellent. The dashboard layout is clean.",
          "Excellent ride comfort and low-speed bump absorption. Perfect size for easy city parking."
        ],
        negative: [
          "Real-world city mileage is very low, barely 9-10 km/l in heavy traffic. Highly sensitive to driving style.",
          "Suspension is too soft, leading to floating and body roll at high highway speeds. Bounces on wavy roads.",
          "The interior dashboard plastics feel cheap and hard in some areas. Squeaks have started from door panels.",
          "LED headlights throw is weak during rainy nights. White light scatters and visibility is poor."
        ],
        mixed: [
          "Engine is smooth but the 3-cylinder version thrums at idle. Average mileage is around 11 km/l in the city.",
          "Ergonomics are great and features are loaded, but the middle rear seat is too narrow for adults.",
          "Good low-speed comfort but lacks stability at triple-digit highway speeds. The infotainment is a bit laggy."
        ]
      };
      const arr = petrolPoints[sentiment];
      bodyText = arr[Math.floor(rand() * arr.length)];
    }

    // Blend pros/cons if matching
    const pros = m.prosCons.pros;
    const cons = m.prosCons.cons;
    let extraPoint = "";
    if (sentiment === "positive" && pros.length > 0) {
      extraPoint = ` Specially love the ${pros[Math.floor(rand() * pros.length)].toLowerCase()}.`;
    } else if (sentiment === "negative" && cons.length > 0) {
      extraPoint = ` The biggest drawback is definitely the ${cons[Math.floor(rand() * cons.length)].toLowerCase()}.`;
    }

    const text = `${openPhrases[Math.floor(rand() * openPhrases.length)]} ${bodyText}${extraPoint} ${closePhrases[Math.floor(rand() * closePhrases.length)]}`;

    modelReviews.push({
      id: `rev-${modelId}-${String(i).padStart(3, "0")}`,
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

  // Push to local collector
  detailedReviews.push(...modelReviews);

  // Attempt Firestore batch write for this model
  try {
    const batch = writeBatch(db);
    for (const r of modelReviews) {
      const docRef = doc(db, "detailedReviews", r.id);
      batch.set(docRef, r);
    }
    await batch.commit();
    console.log(`✓ Firestore uploaded: ${fullName} (150 reviews)`);
  } catch (err) {
    console.error(`✗ Firestore upload failed for ${fullName}:`, err.message ?? err);
    failures.push({ modelId, fullName, error: err.message ?? err });
  }
}

// 3. Save to local JSON
try {
  writeFileSync(resolve(root, "data/detailed-reviews.json"), JSON.stringify(detailedReviews, null, 2) + "\n");
  console.log(`\nLocal write complete: data/detailed-reviews.json (${detailedReviews.length} total reviews)`);
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

// Terminate Firebase app cleanly
deleteApp(app)
  .then(() => {
    console.log("Firebase app disconnected.");
    process.exit(failures.length > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error("Failed to disconnect Firebase:", err);
    process.exit(1);
  });
