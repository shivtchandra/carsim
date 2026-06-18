import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Load all database files
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
const imageSources = JSON.parse(readFileSync(imageSourcesPath, "utf8"));
const dimensions = JSON.parse(readFileSync(dimensionsPath, "utf8"));
const dnas = JSON.parse(readFileSync(dnaPath, "utf8"));

console.log("Loading files complete. Starting additions...");

// ---- 1. Add New Brands ----
const NEW_BRANDS = [
  { "id": "jeep", "name": "Jeep", "country": "USA", "color": "#153E15" },
  { "id": "byd", "name": "BYD", "country": "China", "color": "#E60012" }
];

for (const b of NEW_BRANDS) {
  if (!brands.some(x => x.id === b.id)) {
    brands.push(b);
    console.log(`Added brand: ${b.id}`);
  }
}

// ---- 2. Add New Models ----
const NEW_MODELS = [
  {
    "id": "tata-safari",
    "brandId": "tata",
    "name": "Safari",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 1619000, "max": 2734000 },
    "heroImage": "/images/cars/tata-safari.jpg",
    "aiSummary": "Tata's flagship 3-row SUV offers imposing road presence, premium comfort, and a strong 2.0L diesel engine. With a 5-star BNCAP safety rating, it is a highly capable family highway cruiser.",
    "ncap": { "agency": "BNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Spacious and luxurious 3-row cabin with captain seat option",
        "Commanding road presence and solid build quality",
        "Loaded with premium features like dual-zone climate and ADAS"
      ],
      "cons": [
        "Heavy steering at slow parking speeds",
        "Automatic transmission gets expensive",
        "No petrol or AWD/4WD options available"
      ]
    },
    "dimensions": { "bootLitres": 420, "wheelbaseMm": 2741, "groundClearanceMm": 205, "lengthMm": 4668, "widthMm": 1922, "heightMm": 1795 }
  },
  {
    "id": "tata-altroz",
    "brandId": "tata",
    "name": "Altroz",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 665000, "max": 1135000 },
    "heroImage": "/images/cars/tata-altroz.jpg",
    "aiSummary": "The Tata Altroz is a premium hatchback with a 5-star GNCAP rating, sporty handling, and a wide powertrain spread including a smooth dual-clutch automatic. It balances high-speed stability with robust safety.",
    "ncap": { "agency": "GNCAP", "adultStars": 5, "childStars": 3 },
    "prosCons": {
      "pros": [
        "Top-class 5-star safety rating",
        "Excellent high-speed stability and ride comfort",
        "Clean, premium design with wide-opening doors"
      ],
      "cons": [
        "Naturally aspirated petrol engine lacks punch",
        "Dual-clutch transmission is only on the non-turbo engine",
        "Fit and finish levels lag behind Hyundai i20"
      ]
    },
    "dimensions": { "bootLitres": 345, "wheelbaseMm": 2501, "groundClearanceMm": 165, "lengthMm": 3990, "widthMm": 1755, "heightMm": 1523 }
  },
  {
    "id": "mahindra-thar",
    "brandId": "mahindra",
    "name": "Thar 3-Door",
    "segment": "sub-4m-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 1135000, "max": 1760000 },
    "heroImage": "/images/cars/mahindra-thar.jpg",
    "aiSummary": "The legendary 3-door Thar is India's default lifestyle off-roader, featuring shift-on-the-fly 4WD, high ground clearance, and an imposing stance. RWD variants lower the entry price for urban buyers.",
    "ncap": { "agency": "GNCAP", "adultStars": 4, "childStars": 4 },
    "prosCons": {
      "pros": [
        "Unmatched off-road capability and water wading",
        "High seating position with excellent road view",
        "Strong petrol and diesel engine options"
      ],
      "cons": [
        "Bumpy, ladder-frame ride quality on tarmac",
        "Tough rear seat ingress and tiny boot space",
        "Wind noise at triple-digit speeds"
      ]
    },
    "dimensions": { "bootLitres": 150, "wheelbaseMm": 2450, "groundClearanceMm": 226, "lengthMm": 3985, "widthMm": 1820, "heightMm": 1844 }
  },
  {
    "id": "mahindra-scorpio-classic",
    "brandId": "mahindra",
    "name": "Scorpio Classic",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 1362000, "max": 1742000 },
    "heroImage": "/images/cars/mahindra-scorpio-classic.jpg",
    "aiSummary": "The Scorpio Classic keeps the iconic, rugged design alive with a refined 2.2L mHawk diesel engine. It's a favorite for its commanding road presence, body-on-frame durability, and robust suspension.",
    "ncap": { "agency": null, "adultStars": null, "childStars": null },
    "prosCons": {
      "pros": [
        "Imposing, retro-classic SUV design",
        "Punchy mHawk engine with great low-end pull",
        "Comfortable ride over broken rural roads"
      ],
      "cons": [
        "Basic features compared to modern monocoques",
        "Body roll in corners is pronounced",
        "No automatic or 4WD option anymore"
      ]
    },
    "dimensions": { "bootLitres": 460, "wheelbaseMm": 2680, "groundClearanceMm": 180, "lengthMm": 4456, "widthMm": 1820, "heightMm": 1995 }
  },
  {
    "id": "mahindra-bolero",
    "brandId": "mahindra",
    "name": "Bolero",
    "segment": "sub-4m-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 990000, "max": 1090000 },
    "heroImage": "/images/cars/mahindra-bolero.jpg",
    "aiSummary": "The legendary Mahindra Bolero is India's quintessential utility vehicle, known for its bulletproof metal body, reliable mHawk75 engine, and unmatched ability to traverse rough rural terrain.",
    "ncap": { "agency": null, "adultStars": null, "childStars": null },
    "prosCons": {
      "pros": [
        "Extremely rugged metal body panels",
        "Super reliable mechanicals and low maintenance",
        "Excellent resale value in semi-urban areas"
      ],
      "cons": [
        "Dated, utilitarian cabin and barebones console",
        "Underpowered engine for fast highway runs",
        "Lacks modern safety systems and comfort kit"
      ]
    },
    "dimensions": { "bootLitres": 400, "wheelbaseMm": 2680, "groundClearanceMm": 180, "lengthMm": 3995, "widthMm": 1745, "heightMm": 1880 }
  },
  {
    "id": "maruti-baleno",
    "brandId": "maruti",
    "name": "Baleno",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 666000, "max": 988000 },
    "heroImage": "/images/cars/maruti-baleno.jpg",
    "aiSummary": "Maruti's premium hatchback is a massive seller, prioritizing cabin space, high fuel efficiency, and a smooth K-series engine. Top trims add premium features like a 360-degree camera and HUD.",
    "ncap": { "agency": null, "adultStars": null, "childStars": null },
    "prosCons": {
      "pros": [
        "Frugal DualJet petrol with 22+ km/l average",
        "Spacious cabin with premium-looking dashboard",
        "Feature-packed top trims (360 camera, HUD)"
      ],
      "cons": [
        "Build feels light compared to Altroz or i20",
        "AMT is smooth but slower than DCT/CVT rivals",
        "No turbo-petrol enthusiast engine available"
      ]
    },
    "dimensions": { "bootLitres": 318, "wheelbaseMm": 2520, "groundClearanceMm": 170, "lengthMm": 3990, "widthMm": 1745, "heightMm": 1500 }
  },
  {
    "id": "maruti-fronx",
    "brandId": "maruti",
    "name": "Fronx",
    "segment": "sub-4m-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 751000, "max": 1304000 },
    "heroImage": "/images/cars/maruti-fronx.jpg",
    "aiSummary": "The Fronx is a stylish crossover that blends the Baleno's practicality with Grand Vitara-inspired SUV styling. The 1.0L BoosterJet turbo petrol offers brisk performance for enthusiast buyers.",
    "ncap": { "agency": null, "adultStars": null, "childStars": null },
    "prosCons": {
      "pros": [
        "Attractive coupe-SUV styling and stance",
        "Punchy 1.0 turbo engine with torque converter AT",
        "Frugal mileage and excellent ride comfort"
      ],
      "cons": [
        "Rear seat headroom is slightly tight due to sloping roof",
        "Interior design is identical to the cheaper Baleno",
        "Rear visibility is hampered by thick C-pillars"
      ]
    },
    "dimensions": { "bootLitres": 308, "wheelbaseMm": 2520, "groundClearanceMm": 190, "lengthMm": 3995, "widthMm": 1765, "heightMm": 1550 }
  },
  {
    "id": "maruti-ertiga",
    "brandId": "maruti",
    "name": "Ertiga",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 869000, "max": 1303000 },
    "heroImage": "/images/cars/maruti-ertiga.jpg",
    "aiSummary": "The Ertiga is India's most popular family MPV, delivering unmatched space efficiency and low running costs in a compact package. Smart hybrid and factory CNG variants make it highly economical.",
    "ncap": { "agency": "GNCAP", "adultStars": 3, "childStars": 3 },
    "prosCons": {
      "pros": [
        "Excellent 3-row packaging with slide and recline functions",
        "Highly efficient petrol and CNG variants",
        "Unbeatable value-for-money pricing"
      ],
      "cons": [
        "Lightweight build and average safety rating",
        "Full load highway performance is modest",
        "Frequent fleet usage dilutes premium personal appeal"
      ]
    },
    "dimensions": { "bootLitres": 209, "wheelbaseMm": 2740, "groundClearanceMm": 180, "lengthMm": 4395, "widthMm": 1735, "heightMm": 1690 }
  },
  {
    "id": "toyota-fortuner",
    "brandId": "toyota",
    "name": "Fortuner",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 3343000, "max": 5144000 },
    "heroImage": "/images/cars/toyota-fortuner.jpg",
    "aiSummary": "The Toyota Fortuner is an iconic full-size SUV that commands unmatched prestige and resale value. Powered by a brute 2.8L diesel with 500Nm torque, it has legendary reliability and off-road capability.",
    "ncap": { "agency": "ANCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Brutish road presence and exceptional resale value",
        "Legendary Toyota reliability and mechanical toughness",
        "Extremely capable 4x4 system with low range"
      ],
      "cons": [
        "Firm, bumpy ride quality over city roads",
        "Gets exceptionally expensive in top trims",
        "Interior cabin design feels dated for a ₹50 Lakh car"
      ]
    },
    "dimensions": { "bootLitres": 296, "wheelbaseMm": 2745, "groundClearanceMm": 225, "lengthMm": 4795, "widthMm": 1855, "heightMm": 1835 }
  },
  {
    "id": "hyundai-i20",
    "brandId": "hyundai",
    "name": "i20",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 704000, "max": 1121000 },
    "heroImage": "/images/cars/hyundai-i20.jpg",
    "aiSummary": "The Hyundai i20 is a feature-rich premium hatchback offering a very spacious cabin, sharp European styling, and premium NVH levels. The smooth IVT transmission is perfect for city traffic.",
    "ncap": { "agency": "GNCAP", "adultStars": 3, "childStars": 3 },
    "prosCons": {
      "pros": [
        "Striking styling and wide, comfortable cabin",
        "Segment-first features like Bose sound system",
        "Refined engine options and smooth automatic"
      ],
      "cons": [
        "GNCAP rating is average at 3 stars",
        "Frugal but unexciting base engine",
        "Top trims are expensive"
      ]
    },
    "dimensions": { "bootLitres": 311, "wheelbaseMm": 2580, "groundClearanceMm": 170, "lengthMm": 3995, "widthMm": 1775, "heightMm": 1505 }
  },
  {
    "id": "hyundai-tucson",
    "brandId": "hyundai",
    "name": "Tucson",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 2902000, "max": 3594000 },
    "heroImage": "/images/cars/hyundai-tucson.jpg",
    "aiSummary": "Hyundai's flagship SUV in India, the Tucson, features futuristic styling, a premium cabin with Level 2 ADAS, and a powerhouse 2.0L diesel engine that delivers effortless highway performance.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Incredibly refined and powerful 2.0L diesel engine",
        "Spacious, luxury-car-like cabin with ADAS L2",
        "Stunning parametric design that turns heads"
      ],
      "cons": [
        "No fuel-efficient hybrid option in India",
        "Firm low-speed ride on larger alloys",
        "Premium pricing bridges close to luxury brands"
      ]
    },
    "dimensions": { "bootLitres": 540, "wheelbaseMm": 2755, "groundClearanceMm": 181, "lengthMm": 4630, "widthMm": 1865, "heightMm": 1665 }
  },
  {
    "id": "kia-carens",
    "brandId": "kia",
    "name": "Carens",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 1052000, "max": 1967000 },
    "heroImage": "/images/cars/kia-carens.jpg",
    "aiSummary": "The Kia Carens mixes the comfort of an MPV with the styling cues of an SUV. It is packed with features like ventilated seats, one-touch electric tumble middle seats, and standard 6 airbags.",
    "ncap": { "agency": "GNCAP", "adultStars": 3, "childStars": 3 },
    "prosCons": {
      "pros": [
        "Excellent 3-row space and seat comfort",
        "Standard safety package (6 airbags, ESC, all-wheel discs)",
        "Refined engine options including turbo-petrol and diesel"
      ],
      "cons": [
        "Bland-looking base profile from side view",
        "Average 3-star safety score under older GNCAP protocol",
        "DCT automatic gets thirsty in heavy traffic"
      ]
    },
    "dimensions": { "bootLitres": 216, "wheelbaseMm": 2780, "groundClearanceMm": 195, "lengthMm": 4540, "widthMm": 1800, "heightMm": 1700 }
  },
  {
    "id": "jeep-compass",
    "brandId": "jeep",
    "name": "Compass",
    "segment": "compact-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 2069000, "max": 3267000 },
    "heroImage": "/images/cars/jeep-compass.jpg",
    "aiSummary": "The Jeep Compass combines premium European dynamics with rugged American heritage. Its ride and handling are class-leading, and the 2.0L Multijet diesel offers great touring capability.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Superb, benchmark ride quality and handling",
        "Solid, tank-like build and 5-star safety safety",
        "Premium interior cabin layout and materials"
      ],
      "cons": [
        "Slow-shifting automatic gearbox at city speeds",
        "Tight rear-seat legroom compared to cheaper rivals",
        "Jeep service costs can run high"
      ]
    },
    "dimensions": { "bootLitres": 438, "wheelbaseMm": 2636, "groundClearanceMm": 178, "lengthMm": 4405, "widthMm": 1818, "heightMm": 1640 }
  },
  {
    "id": "byd-atto3",
    "brandId": "byd",
    "name": "Atto 3",
    "segment": "compact-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 2499000, "max": 3399000 },
    "heroImage": "/images/cars/byd-atto3.jpg",
    "aiSummary": "BYD's Atto 3 is a premium electric SUV featuring their ultra-safe Blade Battery technology. With a 400+ km real-world range, quirky gym-themed interiors, and 204PS performance, it is a highly modern EV.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Effortless 204PS electric motor performance",
        "Safe, durable Blade Battery with fast charging support",
        "Excellent high-speed cabin insulation and ride"
      ],
      "cons": [
        "Quirky interior details (guitar strings, round vents) polarize",
        "Advanced driver assists are too intrusive on highways",
        "Sparse dealer network compared to Tata/Hyundai"
      ]
    },
    "dimensions": { "bootLitres": 440, "wheelbaseMm": 2720, "groundClearanceMm": 175, "lengthMm": 4455, "widthMm": 1875, "heightMm": 1615 }
  },
  {
    "id": "byd-seal",
    "brandId": "byd",
    "name": "Seal",
    "segment": "midsize-sedan",
    "bodyStyle": "sedan",
    "priceRange": { "min": 4100000, "max": 5300000 },
    "heroImage": "/images/cars/byd-seal.jpg",
    "aiSummary": "The BYD Seal is a premium electric sport sedan that delivers sports-car performance (530PS, AWD in top trim) and EuroNCAP safety. It is the segment benchmark for range, handling, and value.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Incredible sports car acceleration (0-100 in 3.8s for AWD)",
        "Spacious, premium cabin with rotating screen",
        "Stunning, low-slung aerodynamic design"
      ],
      "cons": [
        "Very low ground clearance scrapes on big speed bumps",
        "Firm suspension transmits sharp bumps in town",
        "Rear headroom is tight for tall passengers"
      ]
    },
    "dimensions": { "bootLitres": 400, "wheelbaseMm": 2920, "groundClearanceMm": 120, "lengthMm": 4800, "widthMm": 1875, "heightMm": 1460 }
  },
  {
    "id": "skoda-kodiaq",
    "brandId": "skoda",
    "name": "Kodiaq",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 3850000, "max": 4199000 },
    "heroImage": "/images/cars/skoda-kodiaq.jpg",
    "aiSummary": "The Skoda Kodiaq is a premium 7-seat SUV powered by a smooth 2.0L TSI petrol engine. With dynamic chassis control (DCC), solid luxury, and 4x4 traction, it offers luxury-SUV comfort at a lower price point.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Dynamic Chassis Control adaptive dampers cushion the ride",
        "Punchy 2.0L TSI petrol with smooth DSG gearbox",
        "Superbly crafted luxury interior and smart ergonomics"
      ],
      "cons": [
        "Third row is best left for small kids",
        "TSI engine gets thirsty when driven aggressively",
        "No hybrid or diesel option available"
      ]
    },
    "dimensions": { "bootLitres": 270, "wheelbaseMm": 2791, "groundClearanceMm": 192, "lengthMm": 4697, "widthMm": 1882, "heightMm": 1676 }
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
const HIGH = [...MID.filter(f => f !== "touchscreen-8" && f !== "alloy-16"), "touchscreen-10", "alloy-17", "auto-headlamps", "sunroof", "tpms", "connected-car", "wireless-charger", "digital-cluster", "auto-wipers", "leatherette-seats", "auto-dimming-irvm"];
const TOP = [...HIGH, "camera-360", "ventilated-seats", "powered-driver-seat", "premium-audio", "front-parking-sensors", "blind-spot"];
const ADAS = ["adas-l2", "aeb", "lane-keep", "adaptive-cruise"];

const NEW_VARIANTS = [
  // Tata Safari Variants
  { "id": "safari-smart-mt", "modelId": "tata-safari", "name": "Smart MT", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 1619000, "engine": { "cc": 1956, "ps": 170, "nm": 350, "cylinders": 4, "turbo": true }, "claimedFE": 16.3, "realWorldFE": 11.5, "kerbWeight": 1820, "featureIds": [...BASE] },
  { "id": "safari-adventure-plus-at", "modelId": "tata-safari", "name": "Adventure+ AT", "fuel": "diesel", "transmission": "AT", "priceExShowroom": 2249000, "engine": { "cc": 1956, "ps": 170, "nm": 350, "cylinders": 4, "turbo": true }, "claimedFE": 14.5, "realWorldFE": 10.2, "kerbWeight": 1850, "featureIds": [...HIGH] },
  { "id": "safari-accomplished-plus-at", "modelId": "tata-safari", "name": "Accomplished+ AT", "fuel": "diesel", "transmission": "AT", "priceExShowroom": 2734000, "engine": { "cc": 1956, "ps": 170, "nm": 350, "cylinders": 4, "turbo": true }, "claimedFE": 14.5, "realWorldFE": 10.2, "kerbWeight": 1860, "featureIds": [...TOP, ...ADAS] },

  // Tata Altroz Variants
  { "id": "altroz-xe-mt", "modelId": "tata-altroz", "name": "XE 1.2 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 664900, "engine": { "cc": 1199, "ps": 88, "nm": 115, "cylinders": 3, "turbo": false }, "claimedFE": 19.3, "realWorldFE": 13.8, "kerbWeight": 1036, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "altroz-xz-plus-iturbo", "modelId": "tata-altroz", "name": "XZ+ iTurbo MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 969000, "engine": { "cc": 1199, "ps": 110, "nm": 140, "cylinders": 3, "turbo": true }, "claimedFE": 18.5, "realWorldFE": 13.0, "kerbWeight": 1075, "featureIds": [...HIGH] },
  { "id": "altroz-xza-plus-dca", "modelId": "tata-altroz", "name": "XZA+ DCA", "fuel": "petrol", "transmission": "DCT", "priceExShowroom": 1100000, "engine": { "cc": 1199, "ps": 88, "nm": 115, "cylinders": 3, "turbo": false }, "claimedFE": 18.0, "realWorldFE": 12.5, "kerbWeight": 1090, "featureIds": [...TOP] },

  // Mahindra Thar 3-Door Variants
  { "id": "thar-ax-opt-diesel-mt", "modelId": "mahindra-thar", "name": "AX Opt MT RWD", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 1135000, "engine": { "cc": 1497, "ps": 118, "nm": 300, "cylinders": 4, "turbo": true }, "claimedFE": 15.2, "realWorldFE": 11.0, "kerbWeight": 1650, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "thar-lx-petrol-at-4wd", "modelId": "mahindra-thar", "name": "LX AT 4WD", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 1700000, "engine": { "cc": 1997, "ps": 150, "nm": 320, "cylinders": 4, "turbo": true }, "claimedFE": 11.5, "realWorldFE": 8.2, "kerbWeight": 1750, "featureIds": [...MID, "awd-4wd"] },
  { "id": "thar-lx-diesel-at-4wd", "modelId": "mahindra-thar", "name": "LX Diesel AT 4WD", "fuel": "diesel", "transmission": "AT", "priceExShowroom": 1760000, "engine": { "cc": 2184, "ps": 130, "nm": 300, "cylinders": 4, "turbo": true }, "claimedFE": 12.8, "realWorldFE": 9.1, "kerbWeight": 1780, "featureIds": [...MID, "awd-4wd"] },

  // Mahindra Scorpio Classic Variants
  { "id": "scorpio-classic-s-mt", "modelId": "mahindra-scorpio-classic", "name": "S MT", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 1362000, "engine": { "cc": 2184, "ps": 132, "nm": 300, "cylinders": 4, "turbo": true }, "claimedFE": 14.5, "realWorldFE": 10.5, "kerbWeight": 1820, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "scorpio-classic-s11-mt", "modelId": "mahindra-scorpio-classic", "name": "S11 MT", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 1742000, "engine": { "cc": 2184, "ps": 132, "nm": 300, "cylinders": 4, "turbo": true }, "claimedFE": 14.5, "realWorldFE": 10.5, "kerbWeight": 1850, "featureIds": [...MID] },

  // Mahindra Bolero Variants
  { "id": "bolero-b4-mt", "modelId": "mahindra-bolero", "name": "B4 MT", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 990000, "engine": { "cc": 1493, "ps": 76, "nm": 210, "cylinders": 3, "turbo": true }, "claimedFE": 16.0, "realWorldFE": 12.0, "kerbWeight": 1595, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "bolero-b6-opt-mt", "modelId": "mahindra-bolero", "name": "B6 Opt MT", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 1090000, "engine": { "cc": 1493, "ps": 76, "nm": 210, "cylinders": 3, "turbo": true }, "claimedFE": 16.0, "realWorldFE": 12.0, "kerbWeight": 1610, "featureIds": [...BASE] },

  // Maruti Suzuki Baleno Variants
  { "id": "baleno-sigma-mt", "modelId": "maruti-baleno", "name": "Sigma MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 666000, "engine": { "cc": 1197, "ps": 90, "nm": 113, "cylinders": 4, "turbo": false }, "claimedFE": 22.3, "realWorldFE": 16.2, "kerbWeight": 920, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "baleno-delta-amt", "modelId": "maruti-baleno", "name": "Delta AMT", "fuel": "petrol", "transmission": "AMT", "priceExShowroom": 800000, "engine": { "cc": 1197, "ps": 90, "nm": 113, "cylinders": 4, "turbo": false }, "claimedFE": 22.9, "realWorldFE": 16.5, "kerbWeight": 935, "featureIds": [...MID] },
  { "id": "baleno-alpha-amt", "modelId": "maruti-baleno", "name": "Alpha AMT", "fuel": "petrol", "transmission": "AMT", "priceExShowroom": 988000, "engine": { "cc": 1197, "ps": 90, "nm": 113, "cylinders": 4, "turbo": false }, "claimedFE": 22.9, "realWorldFE": 16.5, "kerbWeight": 960, "featureIds": [...TOP] },

  // Maruti Suzuki Fronx Variants
  { "id": "fronx-sigma-mt", "modelId": "maruti-fronx", "name": "Sigma MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 751000, "engine": { "cc": 1197, "ps": 90, "nm": 113, "cylinders": 4, "turbo": false }, "claimedFE": 21.8, "realWorldFE": 15.8, "kerbWeight": 965, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "fronx-delta-plus-amt", "modelId": "maruti-fronx", "name": "Delta+ AMT", "fuel": "petrol", "transmission": "AMT", "priceExShowroom": 888000, "engine": { "cc": 1197, "ps": 90, "nm": 113, "cylinders": 4, "turbo": false }, "claimedFE": 22.8, "realWorldFE": 16.2, "kerbWeight": 980, "featureIds": [...MID] },
  { "id": "fronx-alpha-turbo-at", "modelId": "maruti-fronx", "name": "Alpha 1.0 Turbo AT", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 1304000, "engine": { "cc": 998, "ps": 100, "nm": 148, "cylinders": 3, "turbo": true }, "claimedFE": 20.0, "realWorldFE": 14.1, "kerbWeight": 1030, "featureIds": [...TOP] },

  // Maruti Suzuki Ertiga Variants
  { "id": "ertiga-lxi-mt", "modelId": "maruti-ertiga", "name": "LXi MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 869000, "engine": { "cc": 1462, "ps": 103, "nm": 137, "cylinders": 4, "turbo": false }, "claimedFE": 20.5, "realWorldFE": 14.8, "kerbWeight": 1150, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "ertiga-zxi-cng", "modelId": "maruti-ertiga", "name": "ZXi CNG MT", "fuel": "cng", "transmission": "MT", "priceExShowroom": 1160000, "engine": { "cc": 1462, "ps": 88, "nm": 121, "cylinders": 4, "turbo": false }, "claimedFE": 26.1, "realWorldFE": 18.8, "kerbWeight": 1240, "featureIds": [...MID] },
  { "id": "ertiga-zxi-plus-at", "modelId": "maruti-ertiga", "name": "ZXi+ AT", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 1303000, "engine": { "cc": 1462, "ps": 103, "nm": 137, "cylinders": 4, "turbo": false }, "claimedFE": 20.3, "realWorldFE": 14.5, "kerbWeight": 1205, "featureIds": [...TOP] },

  // Toyota Fortuner Variants
  { "id": "fortuner-petrol-mt", "modelId": "toyota-fortuner", "name": "2.7 Petrol MT RWD", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 3343000, "engine": { "cc": 2694, "ps": 166, "nm": 245, "cylinders": 4, "turbo": false }, "claimedFE": 10.0, "realWorldFE": 7.2, "kerbWeight": 1880, "featureIds": [...MID] },
  { "id": "fortuner-diesel-at-4wd", "modelId": "toyota-fortuner", "name": "2.8 Diesel AT 4WD", "fuel": "diesel", "transmission": "AT", "priceExShowroom": 5144000, "engine": { "cc": 2755, "ps": 204, "nm": 500, "cylinders": 4, "turbo": true }, "claimedFE": 14.4, "realWorldFE": 9.8, "kerbWeight": 2180, "featureIds": [...TOP, "awd-4wd"] },

  // Hyundai i20 Variants
  { "id": "i20-era-mt", "modelId": "hyundai-i20", "name": "Era 1.2 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 704000, "engine": { "cc": 1197, "ps": 83, "nm": 115, "cylinders": 4, "turbo": false }, "claimedFE": 19.6, "realWorldFE": 14.2, "kerbWeight": 1010, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "i20-asta-opt-ivt", "modelId": "hyundai-i20", "name": "Asta (O) 1.2 IVT", "fuel": "petrol", "transmission": "CVT", "priceExShowroom": 1121000, "engine": { "cc": 1197, "ps": 88, "nm": 115, "cylinders": 4, "turbo": false }, "claimedFE": 19.6, "realWorldFE": 13.9, "kerbWeight": 1045, "featureIds": [...TOP] },

  // Hyundai Tucson Variants
  { "id": "tucson-platinum-petrol-at", "modelId": "hyundai-tucson", "name": "Platinum 2.0 Petrol AT", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 2902000, "engine": { "cc": 1999, "ps": 156, "nm": 192, "cylinders": 4, "turbo": false }, "claimedFE": 13.0, "realWorldFE": 9.1, "kerbWeight": 1550, "featureIds": [...HIGH] },
  { "id": "tucson-signature-diesel-at-awd", "modelId": "hyundai-tucson", "name": "Signature 2.0 Diesel AT AWD", "fuel": "diesel", "transmission": "AT", "priceExShowroom": 3594000, "engine": { "cc": 1997, "ps": 186, "nm": 416, "cylinders": 4, "turbo": true }, "claimedFE": 18.0, "realWorldFE": 12.3, "kerbWeight": 1680, "featureIds": [...TOP, ...ADAS, "awd-4wd"] },

  // Kia Carens Variants
  { "id": "carens-premium-petrol-mt", "modelId": "kia-carens", "name": "Premium 1.5 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 1052000, "engine": { "cc": 1497, "ps": 115, "nm": 144, "cylinders": 4, "turbo": false }, "claimedFE": 17.5, "realWorldFE": 12.2, "kerbWeight": 1220, "featureIds": [...BASE] },
  { "id": "carens-luxury-plus-turbo-dct", "modelId": "kia-carens", "name": "Luxury Plus 1.5 Turbo DCT", "fuel": "petrol", "transmission": "DCT", "priceExShowroom": 1867000, "engine": { "cc": 1482, "ps": 160, "nm": 253, "cylinders": 4, "turbo": true }, "claimedFE": 16.5, "realWorldFE": 11.8, "kerbWeight": 1315, "featureIds": [...TOP] },

  // Jeep Compass Variants
  { "id": "compass-sport-diesel-mt", "modelId": "jeep-compass", "name": "Sport 2.0 MT RWD", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 2069000, "engine": { "cc": 1956, "ps": 170, "nm": 350, "cylinders": 4, "turbo": true }, "claimedFE": 17.1, "realWorldFE": 12.1, "kerbWeight": 1530, "featureIds": [...MID] },
  { "id": "compass-model-s-diesel-at-4wd", "modelId": "jeep-compass", "name": "Model S 2.0 AT 4WD", "fuel": "diesel", "transmission": "AT", "priceExShowroom": 3267000, "engine": { "cc": 1956, "ps": 170, "nm": 350, "cylinders": 4, "turbo": true }, "claimedFE": 15.3, "realWorldFE": 10.5, "kerbWeight": 1680, "featureIds": [...TOP, "awd-4wd"] },

  // BYD Atto 3 Variants
  { "id": "atto3-dynamic-50", "modelId": "byd-atto3", "name": "Dynamic 50kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 2499000, "engine": { "cc": 0, "ps": 204, "nm": 310, "cylinders": 0, "turbo": false }, "claimedFE": 9.1, "realWorldFE": 6.8, "kerbWeight": 1680, "featureIds": [...HIGH] },
  { "id": "atto3-superior-60", "modelId": "byd-atto3", "name": "Superior 60kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 3399000, "engine": { "cc": 0, "ps": 204, "nm": 310, "cylinders": 0, "turbo": false }, "claimedFE": 8.9, "realWorldFE": 6.5, "kerbWeight": 1750, "featureIds": [...TOP, ...ADAS] },

  // BYD Seal Variants
  { "id": "seal-dynamic-rwd", "modelId": "byd-seal", "name": "Dynamic RWD 61kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 4100000, "engine": { "cc": 0, "ps": 204, "nm": 310, "cylinders": 0, "turbo": false }, "claimedFE": 9.4, "realWorldFE": 7.1, "kerbWeight": 1920, "featureIds": [...HIGH] },
  { "id": "seal-performance-awd", "modelId": "byd-seal", "name": "Performance AWD 82.5kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 5300000, "engine": { "cc": 0, "ps": 530, "nm": 670, "cylinders": 0, "turbo": false }, "claimedFE": 8.5, "realWorldFE": 6.2, "kerbWeight": 2185, "featureIds": [...TOP, ...ADAS, "awd-4wd"] },

  // Skoda Kodiaq Variants
  { "id": "kodiaq-style-tsi-at-4wd", "modelId": "skoda-kodiaq", "name": "Style 2.0 TSI AT 4WD", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 3850000, "engine": { "cc": 1984, "ps": 190, "nm": 320, "cylinders": 4, "turbo": true }, "claimedFE": 12.7, "realWorldFE": 8.5, "kerbWeight": 1775, "featureIds": [...HIGH, "awd-4wd"] },
  { "id": "kodiaq-laurin-klement-tsi-at-4wd", "modelId": "skoda-kodiaq", "name": "L&K 2.0 TSI AT 4WD", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 4199000, "engine": { "cc": 1984, "ps": 190, "nm": 320, "cylinders": 4, "turbo": true }, "claimedFE": 12.7, "realWorldFE": 8.5, "kerbWeight": 1790, "featureIds": [...TOP, "awd-4wd"] }
];

for (const nv of NEW_VARIANTS) {
  if (!variants.some(v => v.id === nv.id)) {
    variants.push(nv);
    console.log(`Added variant: ${nv.id}`);
  }
}

// ---- 4. Add ZeroTo100 & Braking Metrics to test-data.json ----
const NEW_TEST_DATA = [
  { "variantId": "safari-smart-mt", "zeroTo100": { "value": 11.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "safari-adventure-plus-at", "zeroTo100": { "value": 10.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "safari-accomplished-plus-at", "zeroTo100": { "value": 10.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.0, "source": "estimated-model", "estimated": true } },

  { "variantId": "altroz-xe-mt", "zeroTo100": { "value": 14.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 9.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "altroz-xz-plus-iturbo", "zeroTo100": { "value": 11.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "altroz-xza-plus-dca", "zeroTo100": { "value": 14.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 9.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.0, "source": "estimated-model", "estimated": true } },

  { "variantId": "thar-ax-opt-diesel-mt", "zeroTo100": { "value": 14.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 9.1, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 44.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "thar-lx-petrol-at-4wd", "zeroTo100": { "value": 10.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.1, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "thar-lx-diesel-at-4wd", "zeroTo100": { "value": 12.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.8, "source": "estimated-model", "estimated": true } },

  { "variantId": "scorpio-classic-s-mt", "zeroTo100": { "value": 13.0, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "scorpio-classic-s11-mt", "zeroTo100": { "value": 13.0, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.0, "source": "estimated-model", "estimated": true } },

  { "variantId": "bolero-b4-mt", "zeroTo100": { "value": 19.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 13.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 46.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "bolero-b6-opt-mt", "zeroTo100": { "value": 19.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 13.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 46.0, "source": "estimated-model", "estimated": true } },

  { "variantId": "baleno-sigma-mt", "zeroTo100": { "value": 11.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.8, "source": "estimated-model", "estimated": true } },
  { "variantId": "baleno-delta-amt", "zeroTo100": { "value": 12.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "baleno-alpha-amt", "zeroTo100": { "value": 12.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.2, "source": "estimated-model", "estimated": true } },

  { "variantId": "fronx-sigma-mt", "zeroTo100": { "value": 11.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "fronx-delta-plus-amt", "zeroTo100": { "value": 12.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "fronx-alpha-turbo-at", "zeroTo100": { "value": 9.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "ertiga-lxi-mt", "zeroTo100": { "value": 13.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "ertiga-zxi-cng", "zeroTo100": { "value": 15.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 10.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "ertiga-zxi-plus-at", "zeroTo100": { "value": 13.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "fortuner-petrol-mt", "zeroTo100": { "value": 12.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "fortuner-diesel-at-4wd", "zeroTo100": { "value": 9.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "i20-era-mt", "zeroTo100": { "value": 12.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.1, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "i20-asta-opt-ivt", "zeroTo100": { "value": 12.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.3, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.2, "source": "estimated-model", "estimated": true } },

  { "variantId": "tucson-platinum-petrol-at", "zeroTo100": { "value": 10.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.8, "source": "estimated-model", "estimated": true } },
  { "variantId": "tucson-signature-diesel-at-awd", "zeroTo100": { "value": 9.0, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.2, "source": "estimated-model", "estimated": true } },

  { "variantId": "carens-premium-petrol-mt", "zeroTo100": { "value": 11.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.8, "source": "estimated-model", "estimated": true } },
  { "variantId": "carens-luxury-plus-turbo-dct", "zeroTo100": { "value": 9.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.4, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "compass-sport-diesel-mt", "zeroTo100": { "value": 10.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "compass-model-s-diesel-at-4wd", "zeroTo100": { "value": 10.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.7, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "atto3-dynamic-50", "zeroTo100": { "value": 7.3, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 3.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.9, "source": "estimated-model", "estimated": true } },
  { "variantId": "atto3-superior-60", "zeroTo100": { "value": 7.3, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 3.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.9, "source": "estimated-model", "estimated": true } },

  { "variantId": "seal-dynamic-rwd", "zeroTo100": { "value": 7.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.1, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "seal-performance-awd", "zeroTo100": { "value": 3.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 1.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 36.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "kodiaq-style-tsi-at-4wd", "zeroTo100": { "value": 7.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "kodiaq-laurin-klement-tsi-at-4wd", "zeroTo100": { "value": 7.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.0, "source": "estimated-model", "estimated": true } }
];

for (const ntd of NEW_TEST_DATA) {
  if (!testData.some(td => td.variantId === ntd.variantId)) {
    testData.push(ntd);
    console.log(`Added test data for: ${ntd.variantId}`);
  }
}

// ---- 5. Add Owner Voices to owner-voices.json ----
const NEW_OWNER_VOICES = [
  {
    "modelId": "tata-safari",
    "voices": [
      { "theme": "Road Presence & Comfort", "sentiment": "positive", "text": "Owners consistently praise the imposing road presence and the plush captain seats in the middle row, making it an excellent highway cruiser." },
      { "theme": "City Maneuverability", "sentiment": "negative", "text": "The steering feels heavy at parking speeds and its sheer size makes negotiating tight city lanes and U-turns a chore." },
      { "theme": "Niggles", "sentiment": "mixed", "text": "Frequent complaints about minor infotainment software glitches, though subsequent updates have resolved most bugs." }
    ]
  },
  {
    "modelId": "tata-altroz",
    "voices": [
      { "theme": "Safety & Stability", "sentiment": "positive", "text": "5-star crash safety and rock-solid high-speed stability give owners massive confidence on highway drives." },
      { "theme": "Performance", "sentiment": "negative", "text": "The naturally aspirated 1.2L petrol engine is sluggish and feels underpowered when climbing inclines with a full load." },
      { "theme": "DCA Gearbox", "sentiment": "positive", "text": "The dual-clutch transmission is smooth and jerk-free, a huge upgrade over laggy AMTs." }
    ]
  },
  {
    "modelId": "mahindra-thar",
    "voices": [
      { "theme": "Off-road Heroics", "sentiment": "positive", "text": "Go-anywhere capability and massive ground clearance make it a blast for off-road excursions and weekend trails." },
      { "theme": "Tarmac Comfort", "sentiment": "negative", "text": "The cabin is bumpy and passenger comfort is poor for long highway trips due to ladder-frame suspension." },
      { "theme": "Rear Seat Access", "sentiment": "mixed", "text": "3-door layout makes ingress to the rear seats extremely awkward, but kids don't mind it." }
    ]
  },
  {
    "modelId": "mahindra-scorpio-classic",
    "voices": [
      { "theme": "Iconic Stance", "sentiment": "positive", "text": "The iconic tower tail-lamps and commanding hood view remain massive selling points for traditional SUV lovers." },
      { "theme": "Ride & Roll", "sentiment": "negative", "text": "High speed body roll is excessive, and the steering gets vague on expressway curves." },
      { "theme": "Engine Pull", "sentiment": "positive", "text": "The mHawk engine is extremely driveable, pulling cleanly from low revs without needing constant downshifts." }
    ]
  },
  {
    "modelId": "mahindra-bolero",
    "voices": [
      { "theme": "Indestructible Feel", "sentiment": "positive", "text": "The metal bumpers and robust chassis take a beating on rural roads without any rattles or panel gaps." },
      { "theme": "Interior Features", "sentiment": "negative", "text": "Extremely basic cabin with hard plastics, zero touchscreens, and old-school digital dashboard gauges." },
      { "theme": "Reliability", "sentiment": "positive", "text": "Unmatched mechanical reliability and spare parts availability in the remotest corners of the country." }
    ]
  },
  {
    "modelId": "maruti-baleno",
    "voices": [
      { "theme": "Mileage King", "sentiment": "positive", "text": "Fuel efficiency is exceptional, routinely returning 17-19 km/l in the city and over 22 km/l on highways." },
      { "theme": "Cabin Space", "sentiment": "positive", "text": "The cabin feels airy and the rear legroom is best-in-class, easily seating three adults in comfort." },
      { "theme": "Sheet Metal", "sentiment": "negative", "text": "Owners feel the body panels are thin and prone to minor door dings and scratches in tight parking." }
    ]
  },
  {
    "modelId": "maruti-fronx",
    "voices": [
      { "theme": "Stunning Looks", "sentiment": "positive", "text": "Coupe-like sloping roof and connected rear LED bar give it a very modern, head-turning look." },
      { "theme": "Boosterjet Performance", "sentiment": "positive", "text": "The 1.0L turbo petrol is snappy and eager, especially when paired with the 6-speed torque converter AT." },
      { "theme": "Headroom", "sentiment": "negative", "text": "Tall rear passengers note that the sloping roofline slightly compromises headroom compared to Baleno." }
    ]
  },
  {
    "modelId": "maruti-ertiga",
    "voices": [
      { "theme": "Practical Package", "sentiment": "positive", "text": "The absolute best value 7-seater in India. Third row headroom and legroom are genuinely usable by adults." },
      { "theme": "Frugal Running", "sentiment": "positive", "text": "The factory-fitted CNG version keeps running costs unbelievably low, making it the default fleet pick." },
      { "theme": "Highway Pace", "sentiment": "negative", "text": "With 7 people and luggage, overtaking at speeds above 90 km/h requires planning and downshifting." }
    ]
  },
  {
    "modelId": "toyota-fortuner",
    "voices": [
      { "theme": "Bulletproof Trust", "sentiment": "positive", "text": "Incredible durability. Many owners have clocked 2 lakh+ km with nothing but routine oil changes and brake pads." },
      { "theme": "Stiff Ride", "sentiment": "negative", "text": "The suspension is stiff and bouncy, tossing passengers around on city speed bumps and bad patches." },
      { "theme": "Road Clearance & Presence", "sentiment": "positive", "text": "Massive road presence clears traffic, and the 225mm ground clearance ignores water logging completely." }
    ]
  },
  {
    "modelId": "hyundai-i20",
    "voices": [
      { "theme": "Premium Feel", "sentiment": "positive", "text": "The interior materials, fit, and overall sound insulation feel a segment above. It feels like an imported hatchback." },
      { "theme": "Safety Score", "sentiment": "mixed", "text": "While loaded with 6 airbags and safety tech, the 3-star GNCAP score leaves some buyers wanting more." },
      { "theme": "Feature Richness", "sentiment": "positive", "text": "The Bose 7-speaker system, digital cluster, and electric sunroof make the cabin feel premium." }
    ]
  },
  {
    "modelId": "hyundai-tucson",
    "voices": [
      { "theme": "Diesel Powerhouse", "sentiment": "positive", "text": "The 186PS diesel motor has relentless mid-range torque, pushing the car like a rocket on the highway." },
      { "theme": "ADAS Usability", "sentiment": "mixed", "text": "Level 2 ADAS features like active lane assist work great on expressways but are too aggressive for city lanes." },
      { "theme": "Luxury Quietness", "sentiment": "positive", "text": "Extremely silent cabin, zero diesel rattle inside, and plush leatherette seating make it feel like a luxury SUV." }
    ]
  },
  {
    "modelId": "kia-carens",
    "voices": [
      { "theme": "One-touch Tumble", "sentiment": "positive", "text": "Electric double-tumble middle seat makes accessing the third row effortless even for elderly passengers." },
      { "theme": "DCT Fuel Apprehension", "sentiment": "negative", "text": "The punchy turbo petrol DCT returns single digit fuel efficiency (7-8 km/l) in heavy city bumper-to-bumper crawls." },
      { "theme": "Refined Engines", "sentiment": "positive", "text": "The 1.5L CRDi diesel is incredibly smooth and quiet, delivering a very relaxing driving experience." }
    ]
  },
  {
    "modelId": "jeep-compass",
    "voices": [
      { "theme": "European Dynamics", "sentiment": "positive", "text": "Ride and handling balance is phenomenal. The way it flat-curves highway bends at speed is unmatched." },
      { "theme": "Rear Legroom", "sentiment": "negative", "text": "The rear seat feels cramped for three adults, and knee-room is less than some SUVs costing half the price." },
      { "theme": "Solid Build", "sentiment": "positive", "text": "Doors shut with a heavy German thud. It feels exceptionally safe and built to last." }
    ]
  },
  {
    "modelId": "byd-atto3",
    "voices": [
      { "theme": "Blade Battery Safety", "sentiment": "positive", "text": "Blade battery technology gives peace of mind. Real-world range is a solid 400-420 km on a single charge." },
      { "theme": "Quirky Cabin", "sentiment": "mixed", "text": "The red string door pockets and rotating center screen are fun, though some passengers find it a bit toy-like." },
      { "theme": "EV Performance", "sentiment": "positive", "text": "Linear, instant acceleration makes overtaking a breeze. The cabin remains library-quiet at high speeds." }
    ]
  },
  {
    "modelId": "byd-seal",
    "voices": [
      { "theme": "Sports Car Speed", "sentiment": "positive", "text": "The 530PS AWD Performance model pulls like a supercar. 0-100 in 3.8s is mind-blowing at this price point." },
      { "theme": "Low Clearance", "sentiment": "negative", "text": "Ground clearance of 120mm is very low. You must crawl diagonally over even average speed bumps." },
      { "theme": "Modern Luxury", "sentiment": "positive", "text": "The cockpit looks like a jet fighter. Rotating 15.6-inch screen and ventilated sports seats are highly premium." }
    ]
  },
  {
    "modelId": "skoda-kodiaq",
    "voices": [
      { "theme": "DCC Suspensions", "sentiment": "positive", "text": "Dynamic Chassis Control makes a massive difference. Comfort mode floats over bumps; Sport mode firms it up for corners." },
      { "theme": "Thirsty Petrol", "sentiment": "negative", "text": "The 2.0L TSI petrol is a gem but returns 7-9 km/l in the city. Fuel stops are frequent on long drives." },
      { "theme": "Clever Details", "sentiment": "positive", "text": "Skoda's 'Simply Clever' features like door-edge protectors and umbrellas in doors are highly practical." }
    ]
  }
];

for (const ov of NEW_OWNER_VOICES) {
  if (!voices.some(v => v.modelId === ov.modelId)) {
    voices.push(ov);
    console.log(`Added owner voices for: ${ov.modelId}`);
  }
}

// ---- 6. Add Image Sources to image-sources.json ----
const NEW_IMAGE_SOURCES = [
  { "modelId": "tata-safari", "query": "Tata Safari 2023", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/f/ff/2023_Tata_Safari_XZ%2B_%28India%29_front_view.jpg" },
  { "modelId": "tata-altroz", "query": "Tata Altroz", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Tata_Altroz_Front-view.jpg" },
  { "modelId": "mahindra-thar", "query": "Mahindra Thar 2020", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Mahindra_Thar_LX_Hard_Top_RWD.jpg" },
  { "modelId": "mahindra-scorpio-classic", "query": "Mahindra Scorpio Classic", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mahindra_Scorpio_Classic_2022.jpg" },
  { "modelId": "mahindra-bolero", "query": "Mahindra Bolero Neo", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/8/87/Mahindra_Bolero_Neo_N10_Opt.jpg" },
  { "modelId": "maruti-baleno", "query": "Suzuki Baleno 2022", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/e/ed/2022_Suzuki_Baleno_GL_1.4_%28Chile%29_front_view.jpg" },
  { "modelId": "maruti-fronx", "query": "Suzuki Fronx", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/f/fe/2023_Suzuki_Fronx_GLX_1.5_front_view_%28Chile%29.jpg" },
  { "modelId": "maruti-ertiga", "query": "Suzuki Ertiga 2019", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/2/2f/2019_Suzuki_Ertiga_GL_1.5_front_view_%28Chile%29.jpg" },
  { "modelId": "toyota-fortuner", "query": "Toyota Fortuner 2017", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/8/80/Toyota_Fortuner_2.4_VRZ_2017_%28Chile%29_front_view.jpg" },
  { "modelId": "hyundai-i20", "query": "Hyundai i20 2020", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/b/ba/2020_Hyundai_i20_Premium_MHEV_1.0_Front.jpg" },
  { "modelId": "hyundai-tucson", "query": "Hyundai Tucson 2021", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/7/77/2021_Hyundai_Tucson_SEL_Front.jpg" },
  { "modelId": "kia-carens", "query": "Kia Carens 2022", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Kia_Carens_4th-gen_India_front-view.jpg" },
  { "modelId": "jeep-compass", "query": "Jeep Compass 2020", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/d/de/Jeep_Compass_Limited_1.4_Multiair_%28facelift%29_front.jpg" },
  { "modelId": "byd-atto3", "query": "BYD Atto 3", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/d/d4/BYD_Atto_3_front_view.jpg" },
  { "modelId": "byd-seal", "query": "BYD Seal", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/4/4c/BYD_Seal_front_view.jpg" },
  { "modelId": "skoda-kodiaq", "query": "Skoda Kodiaq 2017", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA", "url": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Skoda_Kodiaq_2.0_TDI_Style_4x4_front.jpg" }
];

for (const is of NEW_IMAGE_SOURCES) {
  if (!imageSources.sources.some(s => s.modelId === is.modelId)) {
    imageSources.sources.push(is);
    console.log(`Added image source for: ${is.modelId}`);
  }
}

// ---- 7. Add Dimensions to model-body-dimensions.json ----
const NEW_DIMENSIONS = {
  "tata-safari": { "lengthMm": 4668, "widthMm": 1922, "heightMm": 1795 },
  "tata-altroz": { "lengthMm": 3990, "widthMm": 1755, "heightMm": 1523 },
  "mahindra-thar": { "lengthMm": 3985, "widthMm": 1820, "heightMm": 1844 },
  "mahindra-scorpio-classic": { "lengthMm": 4456, "widthMm": 1820, "heightMm": 1995 },
  "mahindra-bolero": { "lengthMm": 3995, "widthMm": 1745, "heightMm": 1880 },
  "maruti-baleno": { "lengthMm": 3990, "widthMm": 1745, "heightMm": 1500 },
  "maruti-fronx": { "lengthMm": 3995, "widthMm": 1765, "heightMm": 1550 },
  "maruti-ertiga": { "lengthMm": 4395, "widthMm": 1735, "heightMm": 1690 },
  "toyota-fortuner": { "lengthMm": 4795, "widthMm": 1855, "heightMm": 1835 },
  "hyundai-i20": { "lengthMm": 3995, "widthMm": 1775, "heightMm": 1505 },
  "hyundai-tucson": { "lengthMm": 4630, "widthMm": 1865, "heightMm": 1665 },
  "kia-carens": { "lengthMm": 4540, "widthMm": 1800, "heightMm": 1700 },
  "jeep-compass": { "lengthMm": 4405, "widthMm": 1818, "heightMm": 1640 },
  "byd-atto3": { "lengthMm": 4455, "widthMm": 1875, "heightMm": 1615 },
  "byd-seal": { "lengthMm": 4800, "widthMm": 1875, "heightMm": 1460 },
  "skoda-kodiaq": { "lengthMm": 4697, "widthMm": 1882, "heightMm": 1676 }
};

for (const [mid, dim] of Object.entries(NEW_DIMENSIONS)) {
  if (!dimensions[mid]) {
    dimensions[mid] = dim;
    console.log(`Added dimensions for: ${mid}`);
  }
}

// ---- 8. Add DNA to vehicle-dna.json ----
const NEW_DNAS = {
  "tata-safari": {
    "archetype": "midsize-suv",
    "signatureElements": ["connected-drl", "floating-roof", "vertical-slat-grille", "clamshell-hood"],
    "environment": "highway",
    "cameraPreset": "family-suv",
    "wheelInches": 19,
    "proportions": { "boxiness": 0.45, "shoulderWidth": 1.09, "rideHeight": 1.08 }
  },
  "tata-altroz": {
    "archetype": "compact-hatch",
    "signatureElements": ["connected-drl", "floating-roof"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 16,
    "proportions": { "boxiness": 0.2, "shoulderWidth": 0.95, "rideHeight": 0.9 }
  },
  "mahindra-thar": {
    "archetype": "offroad-box",
    "signatureElements": ["round-headlamps", "boxy-profile", "vertical-slat-grille"],
    "environment": "mountain-trail",
    "cameraPreset": "offroad-hero",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.98, "rideHeight": 1.22, "shoulderWidth": 1.02 }
  },
  "mahindra-scorpio-classic": {
    "archetype": "midsize-suv",
    "signatureElements": ["vertical-slat-grille", "boxy-profile"],
    "environment": "mountain-trail",
    "cameraPreset": "family-suv",
    "wheelInches": 17,
    "proportions": { "boxiness": 0.8, "rideHeight": 1.15, "shoulderWidth": 1.05 }
  },
  "mahindra-bolero": {
    "archetype": "offroad-box",
    "signatureElements": ["boxy-profile", "vertical-slat-grille", "round-headlamps"],
    "environment": "mountain-trail",
    "cameraPreset": "offroad-hero",
    "wheelInches": 15,
    "proportions": { "boxiness": 0.99, "rideHeight": 1.15, "shoulderWidth": 0.92 }
  },
  "maruti-baleno": {
    "archetype": "compact-hatch",
    "signatureElements": ["connected-drl", "floating-roof"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 16,
    "proportions": { "boxiness": 0.1, "shoulderWidth": 0.94, "rideHeight": 0.88 }
  },
  "maruti-fronx": {
    "archetype": "sub-4m-suv",
    "signatureElements": ["connected-drl", "split-headlamp", "floating-roof"],
    "environment": "urban-family",
    "cameraPreset": "family-suv",
    "wheelInches": 16,
    "proportions": { "boxiness": 0.22, "shoulderWidth": 0.96, "rideHeight": 1.0 }
  },
  "maruti-ertiga": {
    "archetype": "midsize-suv",
    "signatureElements": ["connected-drl", "floating-roof"],
    "environment": "highway",
    "cameraPreset": "family-suv",
    "wheelInches": 15,
    "proportions": { "boxiness": 0.3, "shoulderWidth": 0.95, "rideHeight": 0.98 }
  },
  "toyota-fortuner": {
    "archetype": "midsize-suv",
    "signatureElements": ["vertical-slat-grille", "boxy-profile", "muscle-shoulders", "roof-rails"],
    "environment": "mountain-trail",
    "cameraPreset": "family-suv",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.5, "shoulderWidth": 1.06, "rideHeight": 1.14 }
  },
  "hyundai-i20": {
    "archetype": "compact-hatch",
    "signatureElements": ["parametric-grille", "split-headlamp", "floating-roof"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 16,
    "proportions": { "boxiness": 0.12, "shoulderWidth": 0.96, "rideHeight": 0.88 }
  },
  "hyundai-tucson": {
    "archetype": "midsize-suv",
    "signatureElements": ["parametric-grille", "split-headlamp", "floating-roof", "muscle-shoulders"],
    "environment": "expressway",
    "cameraPreset": "family-suv",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.28, "shoulderWidth": 1.05, "rideHeight": 1.02 }
  },
  "kia-carens": {
    "archetype": "midsize-suv",
    "signatureElements": ["tiger-nose-grille", "star-map-drl", "floating-roof"],
    "environment": "urban-family",
    "cameraPreset": "family-suv",
    "wheelInches": 16,
    "proportions": { "boxiness": 0.35, "shoulderWidth": 1.02, "rideHeight": 1.0 }
  },
  "jeep-compass": {
    "archetype": "compact-suv",
    "signatureElements": ["vertical-slat-grille", "muscle-shoulders", "boxy-profile"],
    "environment": "highway",
    "cameraPreset": "luxury-turntable",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.45, "shoulderWidth": 1.03, "rideHeight": 1.05 }
  },
  "byd-atto3": {
    "archetype": "ev-crossover",
    "signatureElements": ["connected-drl", "flush-handles", "floating-roof"],
    "environment": "futuristic-night",
    "cameraPreset": "ev-future",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.18, "shoulderWidth": 1.04, "rideHeight": 1.0 }
  },
  "byd-seal": {
    "archetype": "midsize-sedan",
    "signatureElements": ["connected-drl", "flush-handles", "fastback-sedan"],
    "environment": "futuristic-night",
    "cameraPreset": "sport-sedan",
    "wheelInches": 19,
    "proportions": { "boxiness": 0.05, "shoulderWidth": 1.05, "rideHeight": 0.88 }
  },
  "skoda-kodiaq": {
    "archetype": "premium-suv",
    "signatureElements": ["vertical-slat-grille", "muscle-shoulders", "roof-rails", "floating-roof"],
    "environment": "expressway",
    "cameraPreset": "luxury-turntable",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.35, "shoulderWidth": 1.05, "rideHeight": 1.04 }
  }
};

for (const [mid, dna] of Object.entries(NEW_DNAS)) {
  if (!dnas[mid]) {
    dnas[mid] = dna;
    console.log(`Added DNA for: ${mid}`);
  }
}

// Write everything back to disk
writeFileSync(brandsPath, JSON.stringify(brands, null, 2) + "\n");
writeFileSync(modelsPath, JSON.stringify(models, null, 2) + "\n");
writeFileSync(variantsPath, JSON.stringify(variants, null, 2) + "\n");
writeFileSync(testDataPath, JSON.stringify(testData, null, 2) + "\n");
writeFileSync(voicesPath, JSON.stringify(voices, null, 2) + "\n");
writeFileSync(imageSourcesPath, JSON.stringify(imageSources, null, 2) + "\n");
writeFileSync(dimensionsPath, JSON.stringify(dimensions, null, 2) + "\n");
writeFileSync(dnaPath, JSON.stringify(dnas, null, 2) + "\n");

console.log("\nDatabase files updated successfully!");
