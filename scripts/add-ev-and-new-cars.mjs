import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Load all database files
const modelsPath = resolve(root, "data/models.json");
const variantsPath = resolve(root, "data/variants.json");
const testDataPath = resolve(root, "data/test-data.json");
const voicesPath = resolve(root, "data/owner-voices.json");
const imageSourcesPath = resolve(root, "data/image-sources.json");

const models = JSON.parse(readFileSync(modelsPath, "utf8"));
const variants = JSON.parse(readFileSync(variantsPath, "utf8"));
const testData = JSON.parse(readFileSync(testDataPath, "utf8"));
const voices = JSON.parse(readFileSync(voicesPath, "utf8"));
const imageSources = JSON.parse(readFileSync(imageSourcesPath, "utf8"));

// ---- 1. Update Existing Models (Expanding price range for EV variants) ----
const updatedModelsMap = {
  "hyundai-creta": { min: 1109900, max: 2470000 },
  "tata-curvv": { min: 999000, max: 1949000 },
  "tata-nexon": { min: 800000, max: 1749000 },
  "tata-punch": { min: 613000, max: 1259000 }
};

for (const m of models) {
  if (updatedModelsMap[m.id]) {
    m.priceRange = updatedModelsMap[m.id];
  }
}

// ---- 2. Add New Models ----
const NEW_MODELS = [
  {
    "id": "mg-windsor",
    "brandId": "mg",
    "name": "Windsor EV",
    "segment": "compact-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 1400000, "max": 1860000 },
    "heroImage": "/images/cars/mg-windsor.jpg",
    "aiSummary": "MG's Windsor EV is a comfort-oriented electric CUV with a massive 604L boot, lounge-like 135° reclining rear seats, and a huge 15.6-inch touchscreen. It is tailored for city commutes and spacious rear-seat comfort.",
    "ncap": { "agency": null, "adultStars": null, "childStars": null },
    "prosCons": {
      "pros": [
        "Sofa-like rear seats with 135° recline",
        "Huge 604L boot capacity",
        "Super spacious 2700mm wheelbase"
      ],
      "cons": [
        "No physical controls for AC and mirrors",
        "Highway range is average on smaller pack",
        "Soft suspension rolls in corners"
      ]
    },
    "dimensions": { "bootLitres": 604, "wheelbaseMm": 2700 }
  },
  {
    "id": "mahindra-thar-roxx",
    "brandId": "mahindra",
    "name": "Thar ROXX",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 1239000, "max": 2282000 },
    "heroImage": "/images/cars/mahindra-thar-roxx.jpg",
    "aiSummary": "The Thar ROXX is a 5-door lifestyle SUV that pairs legendary off-road capability with family-friendly comfort and a 5-star BNCAP safety rating. The mStallion petrol and mHawk diesel offer strong performance.",
    "ncap": { "agency": "BNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Imposing road presence and off-road capability",
        "Spacious 5-door cabin with panoramic sunroof",
        "5-star BNCAP safety rating with ADAS"
      ],
      "cons": [
        "Heavy steering and bulk in tight spaces",
        "Lumpy low-speed ride quality",
        "Diesel 4x4 gets expensive at top end"
      ]
    },
    "dimensions": { "bootLitres": 447, "wheelbaseMm": 2850 }
  },
  {
    "id": "maruti-swift",
    "brandId": "maruti",
    "name": "Swift",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 579000, "max": 964000 },
    "heroImage": "/images/cars/maruti-swift.jpg",
    "aiSummary": "The new 2024 Swift features Maruti's frugal Z12E 3-cylinder engine and standard 6 airbags. It remains the default fun-to-drive premium hatchback, balancing compact dimensions with excellent fuel efficiency.",
    "ncap": { "agency": "GNCAP", "adultStars": 3, "childStars": 3 },
    "prosCons": {
      "pros": [
        "Frugal 3-cylinder Z-series petrol (25+ km/l)",
        "Standard safety equipment (6 airbags, ESC)",
        "Sporty, agile handling in city traffic"
      ],
      "cons": [
        "Engine thrums at idle under load",
        "Boot space and cabin width are average",
        "Gets expensive at the top end"
      ]
    },
    "dimensions": { "bootLitres": 265, "wheelbaseMm": 2450 }
  },
  {
    "id": "maruti-dzire",
    "brandId": "maruti",
    "name": "Dzire",
    "segment": "compact-sedan",
    "bodyStyle": "sedan",
    "priceRange": { "min": 679000, "max": 1014000 },
    "heroImage": "/images/cars/maruti-dzire.jpg",
    "aiSummary": "The first sub-4m sedan to score a 5-star GNCAP rating, the 2024 Dzire pairs premium features like an electric sunroof and 360° camera with Maruti's highly efficient Z12E engine.",
    "ncap": { "agency": "GNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Unprecedented 5-star safety rating",
        "Frugal engine (24.8 km/l manual, 25.7 km/l AMT)",
        "Segment-first single pane sunroof"
      ],
      "cons": [
        "3-cylinder engine is less refined than the old 4-cylinder",
        "Top trims cross the ₹10 Lakh mark",
        "Rear seat width is tight for three adults"
      ]
    },
    "dimensions": { "bootLitres": 382, "wheelbaseMm": 2450 }
  },
  {
    "id": "honda-amaze",
    "brandId": "honda",
    "name": "Amaze",
    "segment": "compact-sedan",
    "bodyStyle": "sedan",
    "priceRange": { "min": 751000, "max": 1000000 },
    "heroImage": "/images/cars/honda-amaze.jpg",
    "aiSummary": "The third-generation Honda Amaze pairs a bold 3-box design with a refined 1.2 i-VTEC engine, a smooth CVT, and standard 6 airbags. Top trims add advanced safety tech (ADAS) to the compact sedan class.",
    "ncap": { "agency": "BNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Superb safety rating with standard 6 airbags",
        "Extremely smooth i-VTEC CVT gearbox combination",
        "Bold, mini-City design with spacious cabin"
      ],
      "cons": [
        "Refinement at higher highway speeds could be better",
        "No turbo or CNG options available",
        "Ride is soft and floats over high-speed dips"
      ]
    },
    "dimensions": { "bootLitres": 420, "wheelbaseMm": 2470 }
  }
];

for (const nm of NEW_MODELS) {
  if (!models.some(m => m.id === nm.id)) {
    models.push(nm);
    console.log(`Added model: ${nm.id}`);
  }
}

// ---- 3. Add New Variants ----
const BASE = ["airbags-6", "abs-ebd", "esc", "isofix", "hill-hold", "rear-defogger", "led-drl", "rear-camera"];
const MID = [...BASE, "touchscreen-8", "wireless-carplay", "auto-ac", "keyless-entry", "cruise-control", "alloy-16", "rear-ac-vents"];
const HIGH = [...MID.filter((f) => f !== "touchscreen-8" && f !== "alloy-16"), "touchscreen-10", "alloy-17", "auto-headlamps", "sunroof", "tpms", "connected-car", "wireless-charger", "digital-cluster", "auto-wipers", "leatherette-seats", "auto-dimming-irvm"];
const TOP = [...HIGH, "camera-360", "ventilated-seats", "powered-driver-seat", "premium-audio", "front-parking-sensors", "blind-spot"];
const ADAS = ["adas-l2", "aeb", "lane-keep", "adaptive-cruise"];

const NEW_VARIANTS = [
  // Hyundai Creta EV Variants
  {
    "id": "creta-ev-executive-42",
    "modelId": "hyundai-creta",
    "name": "EV Executive 42kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1803000,
    "engine": { "cc": 0, "ps": 135, "nm": 255, "cylinders": 0, "turbo": false },
    "claimedFE": 9.3,
    "realWorldFE": 6.7,
    "kerbWeight": 1580,
    "featureIds": [...MID]
  },
  {
    "id": "creta-ev-premium-51",
    "modelId": "hyundai-creta",
    "name": "EV Premium 51kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 2150000,
    "engine": { "cc": 0, "ps": 171, "nm": 255, "cylinders": 0, "turbo": false },
    "claimedFE": 9.2,
    "realWorldFE": 6.6,
    "kerbWeight": 1650,
    "featureIds": [...HIGH, "ventilated-seats"]
  },
  {
    "id": "creta-ev-excellence-51",
    "modelId": "hyundai-creta",
    "name": "EV Excellence 51kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 2470000,
    "engine": { "cc": 0, "ps": 171, "nm": 255, "cylinders": 0, "turbo": false },
    "claimedFE": 9.2,
    "realWorldFE": 6.6,
    "kerbWeight": 1660,
    "featureIds": [...TOP, ...ADAS]
  },
  // Tata Curvv EV Variants (Series X)
  {
    "id": "curvv-ev-accomplished-x-55",
    "modelId": "tata-curvv",
    "name": "EV Accomplished X 55",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1699000,
    "engine": { "cc": 0, "ps": 167, "nm": 215, "cylinders": 0, "turbo": false },
    "claimedFE": 9.1,
    "realWorldFE": 6.6,
    "kerbWeight": 1690,
    "featureIds": [...HIGH]
  },
  {
    "id": "curvv-ev-empowered-x-55",
    "modelId": "tata-curvv",
    "name": "EV Empowered X 55",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1919000,
    "engine": { "cc": 0, "ps": 167, "nm": 215, "cylinders": 0, "turbo": false },
    "claimedFE": 9.1,
    "realWorldFE": 6.6,
    "kerbWeight": 1700,
    "featureIds": [...TOP]
  },
  {
    "id": "curvv-ev-empowered-x-dark-55",
    "modelId": "tata-curvv",
    "name": "EV Empowered X 55 Dark",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1949000,
    "engine": { "cc": 0, "ps": 167, "nm": 215, "cylinders": 0, "turbo": false },
    "claimedFE": 9.1,
    "realWorldFE": 6.6,
    "kerbWeight": 1700,
    "featureIds": [...TOP]
  },
  // Tata Nexon EV Variants
  {
    "id": "nexon-ev-creative-plus-30",
    "modelId": "tata-nexon",
    "name": "EV Creative+ 30kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1249000,
    "engine": { "cc": 0, "ps": 129, "nm": 215, "cylinders": 0, "turbo": false },
    "claimedFE": 10.8,
    "realWorldFE": 7.8,
    "kerbWeight": 1400,
    "featureIds": [...MID]
  },
  {
    "id": "nexon-ev-fearless-plus-45",
    "modelId": "tata-nexon",
    "name": "EV Fearless+ 45kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1549000,
    "engine": { "cc": 0, "ps": 142, "nm": 215, "cylinders": 0, "turbo": false },
    "claimedFE": 10.9,
    "realWorldFE": 7.8,
    "kerbWeight": 1480,
    "featureIds": [...HIGH]
  },
  {
    "id": "nexon-ev-empowered-plus-45",
    "modelId": "tata-nexon",
    "name": "EV Empowered+ A 45kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1749000,
    "engine": { "cc": 0, "ps": 142, "nm": 215, "cylinders": 0, "turbo": false },
    "claimedFE": 10.9,
    "realWorldFE": 7.8,
    "kerbWeight": 1490,
    "featureIds": [...TOP, ...ADAS]
  },
  // Tata Punch EV Variants
  {
    "id": "punch-ev-smart-30",
    "modelId": "tata-punch",
    "name": "EV Smart 30kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 969000,
    "engine": { "cc": 0, "ps": 82, "nm": 114, "cylinders": 0, "turbo": false },
    "claimedFE": 10.5,
    "realWorldFE": 7.6,
    "kerbWeight": 1220,
    "featureIds": [...BASE]
  },
  {
    "id": "punch-ev-adventure-40",
    "modelId": "tata-punch",
    "name": "EV Adventure 40kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1099000,
    "engine": { "cc": 0, "ps": 122, "nm": 190, "cylinders": 0, "turbo": false },
    "claimedFE": 10.5,
    "realWorldFE": 7.6,
    "kerbWeight": 1340,
    "featureIds": [...MID, "sunroof"]
  },
  {
    "id": "punch-ev-empowered-plus-40",
    "modelId": "tata-punch",
    "name": "EV Empowered+ S 40kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1259000,
    "engine": { "cc": 0, "ps": 122, "nm": 190, "cylinders": 0, "turbo": false },
    "claimedFE": 10.5,
    "realWorldFE": 7.6,
    "kerbWeight": 1350,
    "featureIds": [...TOP]
  },
  // MG Windsor EV Variants
  {
    "id": "windsor-ev-excite-38",
    "modelId": "mg-windsor",
    "name": "Excite 38kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1400000,
    "engine": { "cc": 0, "ps": 136, "nm": 200, "cylinders": 0, "turbo": false },
    "claimedFE": 8.7,
    "realWorldFE": 6.3,
    "kerbWeight": 1550,
    "featureIds": [...MID]
  },
  {
    "id": "windsor-ev-exclusive-53",
    "modelId": "mg-windsor",
    "name": "Exclusive 53kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1620000,
    "engine": { "cc": 0, "ps": 136, "nm": 200, "cylinders": 0, "turbo": false },
    "claimedFE": 8.5,
    "realWorldFE": 6.1,
    "kerbWeight": 1600,
    "featureIds": [...HIGH]
  },
  {
    "id": "windsor-ev-essence-53",
    "modelId": "mg-windsor",
    "name": "Essence 53kWh",
    "fuel": "ev",
    "transmission": "AT",
    "priceExShowroom": 1860000,
    "engine": { "cc": 0, "ps": 136, "nm": 200, "cylinders": 0, "turbo": false },
    "claimedFE": 8.5,
    "realWorldFE": 6.1,
    "kerbWeight": 1610,
    "featureIds": [...TOP]
  },
  // Mahindra Thar ROXX Variants
  {
    "id": "thar-roxx-mx1-petrol-mt",
    "modelId": "mahindra-thar-roxx",
    "name": "MX1 2.0 Petrol MT RWD",
    "fuel": "petrol",
    "transmission": "MT",
    "priceExShowroom": 1299000,
    "engine": { "cc": 1997, "ps": 162, "nm": 330, "cylinders": 4, "turbo": true },
    "claimedFE": 12.4,
    "realWorldFE": 8.9,
    "kerbWeight": 1860,
    "featureIds": [...BASE]
  },
  {
    "id": "thar-roxx-mx5-diesel-mt",
    "modelId": "mahindra-thar-roxx",
    "name": "MX5 2.2 Diesel MT RWD",
    "fuel": "diesel",
    "transmission": "MT",
    "priceExShowroom": 1699000,
    "engine": { "cc": 2184, "ps": 152, "nm": 330, "cylinders": 4, "turbo": true },
    "claimedFE": 15.2,
    "realWorldFE": 10.9,
    "kerbWeight": 1950,
    "featureIds": [...MID, "alloy-16"]
  },
  {
    "id": "thar-roxx-ax7l-diesel-at-4wd",
    "modelId": "mahindra-thar-roxx",
    "name": "AX7L 2.2 Diesel AT 4WD",
    "fuel": "diesel",
    "transmission": "AT",
    "priceExShowroom": 2249000,
    "engine": { "cc": 2184, "ps": 175, "nm": 370, "cylinders": 4, "turbo": true },
    "claimedFE": 13.8,
    "realWorldFE": 9.9,
    "kerbWeight": 2040,
    "featureIds": [...TOP, ...ADAS, "awd-4wd", "pano-sunroof"]
  },
  // Maruti Suzuki Swift 2024 Variants
  {
    "id": "swift-lxi-mt",
    "modelId": "maruti-swift",
    "name": "LXi 1.2 MT",
    "fuel": "petrol",
    "transmission": "MT",
    "priceExShowroom": 579000,
    "engine": { "cc": 1197, "ps": 82, "nm": 112, "cylinders": 3, "turbo": false },
    "claimedFE": 24.8,
    "realWorldFE": 17.8,
    "kerbWeight": 920,
    "featureIds": [...BASE.filter(x => x !== "rear-camera")]
  },
  {
    "id": "swift-vxi-cng",
    "modelId": "maruti-swift",
    "name": "VXi 1.2 CNG",
    "fuel": "cng",
    "transmission": "MT",
    "priceExShowroom": 820000,
    "engine": { "cc": 1197, "ps": 70, "nm": 102, "cylinders": 3, "turbo": false },
    "claimedFE": 32.8,
    "realWorldFE": 23.6,
    "kerbWeight": 1010,
    "featureIds": [...MID.filter(x => x !== "touchscreen-10")]
  },
  {
    "id": "swift-zxi-plus-amt",
    "modelId": "maruti-swift",
    "name": "ZXi+ 1.2 AMT",
    "fuel": "petrol",
    "transmission": "AMT",
    "priceExShowroom": 950000,
    "engine": { "cc": 1197, "ps": 82, "nm": 112, "cylinders": 3, "turbo": false },
    "claimedFE": 25.7,
    "realWorldFE": 18.5,
    "kerbWeight": 945,
    "featureIds": [...TOP.filter(x => x !== "pano-sunroof" && x !== "powered-driver-seat" && x !== "blind-spot" && x !== "camera-360")]
  },
  // Maruti Suzuki Dzire 2024 Variants
  {
    "id": "dzire-lxi-mt",
    "modelId": "maruti-dzire",
    "name": "LXi 1.2 MT",
    "fuel": "petrol",
    "transmission": "MT",
    "priceExShowroom": 679000,
    "engine": { "cc": 1197, "ps": 82, "nm": 112, "cylinders": 3, "turbo": false },
    "claimedFE": 24.8,
    "realWorldFE": 17.8,
    "kerbWeight": 930,
    "featureIds": [...BASE.filter(x => x !== "rear-camera")]
  },
  {
    "id": "dzire-vxi-cng",
    "modelId": "maruti-dzire",
    "name": "VXi 1.2 CNG",
    "fuel": "cng",
    "transmission": "MT",
    "priceExShowroom": 874000,
    "engine": { "cc": 1197, "ps": 70, "nm": 102, "cylinders": 3, "turbo": false },
    "claimedFE": 33.7,
    "realWorldFE": 24.2,
    "kerbWeight": 1025,
    "featureIds": [...MID]
  },
  {
    "id": "dzire-zxi-plus-amt",
    "modelId": "maruti-dzire",
    "name": "ZXi+ 1.2 AMT",
    "fuel": "petrol",
    "transmission": "AMT",
    "priceExShowroom": 1014000,
    "engine": { "cc": 1197, "ps": 82, "nm": 112, "cylinders": 3, "turbo": false },
    "claimedFE": 25.7,
    "realWorldFE": 18.5,
    "kerbWeight": 960,
    "featureIds": [...TOP.filter(x => x !== "pano-sunroof")]
  },
  // Honda Amaze 2025 Variants
  {
    "id": "amaze-v-mt",
    "modelId": "honda-amaze",
    "name": "V 1.2 MT",
    "fuel": "petrol",
    "transmission": "MT",
    "priceExShowroom": 762000,
    "engine": { "cc": 1199, "ps": 90, "nm": 110, "cylinders": 4, "turbo": false },
    "claimedFE": 18.6,
    "realWorldFE": 13.4,
    "kerbWeight": 940,
    "featureIds": [...MID.filter(x => x !== "alloy-16" && x !== "auto-ac")]
  },
  {
    "id": "amaze-vx-cvt",
    "modelId": "honda-amaze",
    "name": "VX 1.2 CVT",
    "fuel": "petrol",
    "transmission": "CVT",
    "priceExShowroom": 890000,
    "engine": { "cc": 1199, "ps": 90, "nm": 110, "cylinders": 4, "turbo": false },
    "claimedFE": 18.3,
    "realWorldFE": 13.2,
    "kerbWeight": 965,
    "featureIds": [...HIGH.filter(x => x !== "pano-sunroof" && x !== "leatherette-seats")]
  },
  {
    "id": "amaze-zx-cvt",
    "modelId": "honda-amaze",
    "name": "ZX 1.2 CVT (ADAS)",
    "fuel": "petrol",
    "transmission": "CVT",
    "priceExShowroom": 995000,
    "engine": { "cc": 1199, "ps": 90, "nm": 110, "cylinders": 4, "turbo": false },
    "claimedFE": 18.3,
    "realWorldFE": 13.2,
    "kerbWeight": 975,
    "featureIds": [...TOP, ...ADAS]
  }
];

for (const nv of NEW_VARIANTS) {
  if (!variants.some(v => v.id === nv.id)) {
    variants.push(nv);
    console.log(`Added variant: ${nv.id}`);
  }
}

// ---- 4. Add ZeroTo100 & Braking Metrics to test-data.json ----
const NEW_TEST_DATA = [
  // Creta EV
  { "variantId": "creta-ev-executive-42", "zeroTo100": { "value": 8.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "creta-ev-premium-51", "zeroTo100": { "value": 7.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "creta-ev-excellence-51", "zeroTo100": { "value": 7.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.5, "source": "estimated-model", "estimated": true } },
  // Curvv EV
  { "variantId": "curvv-ev-accomplished-x-55", "zeroTo100": { "value": 8.6, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.6, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "curvv-ev-empowered-x-55", "zeroTo100": { "value": 8.6, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.6, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "curvv-ev-empowered-x-dark-55", "zeroTo100": { "value": 8.6, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.6, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.2, "source": "estimated-model", "estimated": true } },
  // Nexon EV
  { "variantId": "nexon-ev-creative-plus-30", "zeroTo100": { "value": 9.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "nexon-ev-fearless-plus-45", "zeroTo100": { "value": 8.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "nexon-ev-empowered-plus-45", "zeroTo100": { "value": 8.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.5, "source": "estimated-model", "estimated": true } },
  // Punch EV
  { "variantId": "punch-ev-smart-30", "zeroTo100": { "value": 11.0, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "punch-ev-adventure-40", "zeroTo100": { "value": 9.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.4, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "punch-ev-empowered-plus-40", "zeroTo100": { "value": 9.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.4, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.0, "source": "estimated-model", "estimated": true } },
  // Windsor EV
  { "variantId": "windsor-ev-excite-38", "zeroTo100": { "value": 9.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "windsor-ev-exclusive-53", "zeroTo100": { "value": 9.6, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.4, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "windsor-ev-essence-53", "zeroTo100": { "value": 9.6, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.4, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.0, "source": "estimated-model", "estimated": true } },
  // Thar ROXX
  { "variantId": "thar-roxx-mx1-petrol-mt", "zeroTo100": { "value": 10.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "thar-roxx-mx5-diesel-mt", "zeroTo100": { "value": 11.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "thar-roxx-ax7l-diesel-at-4wd", "zeroTo100": { "value": 10.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.1, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.8, "source": "estimated-model", "estimated": true } },
  // Swift
  { "variantId": "swift-lxi-mt", "zeroTo100": { "value": 12.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "swift-vxi-cng", "zeroTo100": { "value": 13.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "swift-zxi-plus-amt", "zeroTo100": { "value": 12.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.2, "source": "estimated-model", "estimated": true } },
  // Dzire
  { "variantId": "dzire-lxi-mt", "zeroTo100": { "value": 12.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.8, "source": "estimated-model", "estimated": true } },
  { "variantId": "dzire-vxi-cng", "zeroTo100": { "value": 13.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "dzire-zxi-plus-amt", "zeroTo100": { "value": 12.4, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.4, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.9, "source": "estimated-model", "estimated": true } },
  // Amaze
  { "variantId": "amaze-v-mt", "zeroTo100": { "value": 12.0, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "amaze-vx-cvt", "zeroTo100": { "value": 12.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.4, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.7, "source": "estimated-model", "estimated": true } },
  { "variantId": "amaze-zx-cvt", "zeroTo100": { "value": 12.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.4, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.7, "source": "estimated-model", "estimated": true } }
];

for (const td of NEW_TEST_DATA) {
  if (!testData.some(t => t.variantId === td.variantId)) {
    testData.push(td);
    console.log(`Added test-data for: ${td.variantId}`);
  }
}

// ---- 5. Add Owner Voices to owner-voices.json ----
const NEW_VOICES = [
  {
    "modelId": "mg-windsor",
    "voices": [
      { "theme": "Cabin comfort", "sentiment": "positive", "text": "Owners are thrilled with the lounge-like rear seats and high headroom; it feels like an upscale sofa." },
      { "theme": "Screens focus", "sentiment": "mixed", "text": "The massive 15.6-inch display is loved by techies, but older drivers find doing basics (like adjusting AC) on screens annoying." },
      { "theme": "City range", "sentiment": "positive", "text": "The 38kWh pack yields a reliable 230–250 km real range in city stop-and-go commuting, which fits most needs." },
      { "theme": "Soft suspension", "sentiment": "mixed", "text": "Very plush over bumps at low speed, but it feels floaty and rolls quite a bit on high-speed expressway curves." }
    ]
  },
  {
    "modelId": "mahindra-thar-roxx",
    "voices": [
      { "theme": "Road presence", "sentiment": "positive", "text": "Owners love the towering driving position and aggressive design; other road users give way instantly." },
      { "theme": "Family viability", "sentiment": "positive", "text": "Unlike the 3-door Thar, the 5-door Roxx is praised by spouses for its rear legroom and decent 447L boot." },
      { "theme": "Ride stiffness", "sentiment": "negative", "text": "It is built on a body-on-frame Scorpio-N chassis; low-speed ride over side-to-side bumps can toss passengers around." },
      { "theme": "Fuel economy", "sentiment": "mixed", "text": "The diesel delivers an acceptable 11–13 km/l in city traffic, but the petrol version gets very thirsty (7–9 km/l)." }
    ]
  },
  {
    "modelId": "maruti-swift",
    "voices": [
      { "theme": "Fuel efficiency", "sentiment": "positive", "text": "Owners consistently report 18–21 km/l in the city and 24+ km/l on highways — highly economical." },
      { "theme": "3-cylinder thrum", "sentiment": "mixed", "text": "Frugal engine, but some owners complain about mild cabin vibrations at idle compared to the previous 4-cylinder." },
      { "theme": "Standard safety", "sentiment": "positive", "text": "6 airbags and ESC standard across the range is highly appreciated for a budget hatchback." }
    ]
  },
  {
    "modelId": "maruti-dzire",
    "voices": [
      { "theme": "GNCAP rating", "sentiment": "positive", "text": "The historic 5-star crash safety score is the primary reason many safety-conscious buyers picked it." },
      { "theme": "Sunroof appeal", "sentiment": "positive", "text": "The segment-first single-pane electric sunroof is a massive hit with kids and younger buyers." },
      { "theme": "Refinement", "sentiment": "mixed", "text": "It shares the Swift's Z12E 3-cylinder engine; it is efficient but sounds vocal when revved hard." }
    ]
  },
  {
    "modelId": "honda-amaze",
    "voices": [
      { "theme": "Smooth CVT", "sentiment": "positive", "text": "The automatic version is widely praised as the smoothest and most stress-free commuter sedan under ₹10 Lakh." },
      { "theme": "Safety features", "sentiment": "positive", "text": "Standard 6 airbags and 5-star BNCAP capability give owners huge peace of mind." },
      { "theme": "Highway performance", "sentiment": "mixed", "text": "Excellent in town, but the NA i-VTEC lacks mid-range punch; it needs to be revved high to overtake on highways." }
    ]
  }
];

for (const nv of NEW_VOICES) {
  if (!voices.some(v => v.modelId === nv.modelId)) {
    voices.push(nv);
    console.log(`Added voices for: ${nv.modelId}`);
  }
}

// ---- 6. Add Search/Fetching Queries to image-sources.json ----
const NEW_IMAGE_SOURCES = [
  {
    "modelId": "mg-windsor",
    "query": "Baojun Cloud 2023",
    "fetchedFrom": "",
    "credit": "",
    "license": ""
  },
  {
    "modelId": "mahindra-thar-roxx",
    "url": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Mahindra_Thar.jpg",
    "credit": "Wikimedia Commons",
    "license": "CC BY-SA 4.0"
  },
  {
    "modelId": "maruti-swift",
    "query": "Suzuki Swift 2024 front",
    "fetchedFrom": "",
    "credit": "",
    "license": ""
  },
  {
    "modelId": "maruti-dzire",
    "query": "Maruti Suzuki Dzire",
    "fetchedFrom": "",
    "credit": "",
    "license": ""
  },
  {
    "modelId": "honda-amaze",
    "query": "Honda Amaze sedan",
    "fetchedFrom": "",
    "credit": "",
    "license": ""
  }
];

for (const nis of NEW_IMAGE_SOURCES) {
  if (!imageSources.sources.some(s => s.modelId === nis.modelId)) {
    imageSources.sources.push(nis);
    console.log(`Added image source query for: ${nis.modelId}`);
  }
}

// Write all databases back to disk
writeFileSync(modelsPath, JSON.stringify(models, null, 2) + "\n");
writeFileSync(variantsPath, JSON.stringify(variants, null, 2) + "\n");
writeFileSync(testDataPath, JSON.stringify(testData, null, 2) + "\n");
writeFileSync(voicesPath, JSON.stringify(voices, null, 2) + "\n");
writeFileSync(imageSourcesPath, JSON.stringify(imageSources, null, 2) + "\n");

console.log("All data seeding complete!");
