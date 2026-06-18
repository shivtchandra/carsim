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
  { "id": "bmw", "name": "BMW", "country": "Germany", "color": "#1C69D4" },
  { "id": "mercedes", "name": "Mercedes-Benz", "country": "Germany", "color": "#334155" },
  { "id": "volvo", "name": "Volvo", "country": "Sweden", "color": "#003057" }
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
    "id": "maruti-wagonr",
    "brandId": "maruti",
    "name": "WagonR",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 554500, "max": 742000 },
    "heroImage": "/images/cars/maruti-wagonr.jpg",
    "aiSummary": "The Maruti WagonR is India's default tall-boy hatchback, maximizing headroom and cabin space under a compact footprint. It offers extremely high fuel economy with low maintenance costs.",
    "ncap": { "agency": "GNCAP", "adultStars": 1, "childStars": 0 },
    "prosCons": {
      "pros": [
        "Incredible headroom and airy cabin feel",
        "Peppy and frugal 1.2L K-series petrol engine",
        "Easiest ingress and egress in segment"
      ],
      "cons": [
        "Weak structural safety rating (1-star GNCAP)",
        "Lightweight build catches crosswinds on highways",
        "Basic steering feel at higher speeds"
      ]
    },
    "dimensions": { "bootLitres": 341, "wheelbaseMm": 2435, "groundClearanceMm": 165, "lengthMm": 3655, "widthMm": 1620, "heightMm": 1675 }
  },
  {
    "id": "maruti-alto-k10",
    "brandId": "maruti",
    "name": "Alto K10",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 399000, "max": 596000 },
    "heroImage": "/images/cars/maruti-alto-k10.jpg",
    "aiSummary": "India's highest selling entry-level car nameplate, the Alto K10 pairs a highly responsive 1.0L engine with a lightweight body. It is extremely easy to navigate in dense city traffic.",
    "ncap": { "agency": "GNCAP", "adultStars": 2, "childStars": 0 },
    "prosCons": {
      "pros": [
        "Highly responsive and peppy K10C petrol engine",
        "Tiny turning radius makes it a breeze to park",
        "Lowest running and maintenance costs in India"
      ],
      "cons": [
        "Cramped rear seat legroom and narrow width",
        "Very basic safety rating and light sheet metal",
        "Steering does not self-center easily at low speeds"
      ]
    },
    "dimensions": { "bootLitres": 214, "wheelbaseMm": 2380, "groundClearanceMm": 160, "lengthMm": 3530, "widthMm": 1490, "heightMm": 1520 }
  },
  {
    "id": "hyundai-i10-nios",
    "brandId": "hyundai",
    "name": "Grand i10 Nios",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 592000, "max": 856000 },
    "heroImage": "/images/cars/hyundai-i10-nios.jpg",
    "aiSummary": "The Grand i10 Nios is a premium urban hatchback with class-leading NVH refinement, a smooth 4-cylinder engine, and a loaded cabin. It is a highly polished city commuter.",
    "ncap": { "agency": "GNCAP", "adultStars": 2, "childStars": 2 },
    "prosCons": {
      "pros": [
        "Extremely silent and vibration-free 4-cylinder engine",
        "Premium cabin materials and top-tier fit and finish",
        "Loaded with features like wireless charger and cooled glovebox"
      ],
      "cons": [
        "Average fuel efficiency in bumper-to-bumper city runs",
        "Suspension feels slightly soft on highway dips",
        "Rear headroom is tight for taller adults"
      ]
    },
    "dimensions": { "bootLitres": 260, "wheelbaseMm": 2450, "groundClearanceMm": 165, "lengthMm": 3815, "widthMm": 1680, "heightMm": 1520 }
  },
  {
    "id": "tata-tiago",
    "brandId": "tata",
    "name": "Tiago",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 565000, "max": 890000 },
    "heroImage": "/images/cars/tata-tiago.jpg",
    "aiSummary": "The Tata Tiago is a robustly built hatchback that offers 4-star safety, solid high-speed stability, and unique powertrain options like a factory-fitted twin-cylinder CNG kit.",
    "ncap": { "agency": "GNCAP", "adultStars": 4, "childStars": 3 },
    "prosCons": {
      "pros": [
        "Reassuring 4-star safety build and solid chassis poise",
        "Unique Twin-Cylinder CNG leaves usable boot space",
        "Plush low-speed ride quality over broken city roads"
      ],
      "cons": [
        "3-cylinder engine lacks refinement and thrums at idle",
        "AMT automatic feels slow during quick downshifts",
        "Rear legroom is average compared to WagonR"
      ]
    },
    "dimensions": { "bootLitres": 242, "wheelbaseMm": 2400, "groundClearanceMm": 170, "lengthMm": 3765, "widthMm": 1677, "heightMm": 1535 }
  },
  {
    "id": "tata-tigor",
    "brandId": "tata",
    "name": "Tigor",
    "segment": "compact-sedan",
    "bodyStyle": "sedan",
    "priceRange": { "min": 630000, "max": 955000 },
    "heroImage": "/images/cars/tata-tigor.jpg",
    "aiSummary": "Tata's compact sedan features a stylish coupe-like sloping roofline, a spacious 3-box cabin, and a large boot. It shares its safe DNA and robust chassis with the Tiago hatchback.",
    "ncap": { "agency": "GNCAP", "adultStars": 4, "childStars": 3 },
    "prosCons": {
      "pros": [
        "Attractive sloping notchback-style silhouette",
        "Large 419-litre boot with gas struts to maximize width",
        "Excellent high-speed straight-line stability"
      ],
      "cons": [
        "3-cylinder motor feels less refined than Dzire's engine",
        "AMT suffers from head-nod under hard throttle",
        "Rear seat width is tight for three adults"
      ]
    },
    "dimensions": { "bootLitres": 419, "wheelbaseMm": 2450, "groundClearanceMm": 170, "lengthMm": 3993, "widthMm": 1677, "heightMm": 1532 }
  },
  {
    "id": "mahindra-bolero-neo",
    "brandId": "mahindra",
    "name": "Bolero Neo",
    "segment": "sub-4m-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 990000, "max": 1215000 },
    "heroImage": "/images/cars/mahindra-bolero-neo.jpg",
    "aiSummary": "The Bolero Neo is a modern body-on-frame utility vehicle with rear-wheel drive and a robust mHawk100 engine. Top trims add a mechanical locking differential for impressive mud/sand off-road traction.",
    "ncap": { "agency": "GNCAP", "adultStars": 1, "childStars": 1 },
    "prosCons": {
      "pros": [
        "Rugged rear-wheel-drive body-on-frame architecture",
        "Mechanical locking differential helps crawl out of mud",
        "Spacious 7-seater layout under 4 meters length"
      ],
      "cons": [
        "Stiff, bouncy ride on tarmac with light passenger loads",
        "Dated safety package (1-star GNCAP rating)",
        "Cabin lacks modern styling and connectivity kit"
      ]
    },
    "dimensions": { "bootLitres": 384, "wheelbaseMm": 2680, "groundClearanceMm": 180, "lengthMm": 3995, "widthMm": 1795, "heightMm": 1817 }
  },
  {
    "id": "kia-ev6",
    "brandId": "kia",
    "name": "EV6",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 6095000, "max": 6595000 },
    "heroImage": "/images/cars/kia-ev6.jpg",
    "aiSummary": "Kia's flagship electric crossover features award-winning 800V ultra-fast charging, 325PS dual-motor AWD performance, and a striking futuristic shape. It is a highly premium long-range EV.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Blistering AWD performance (0-100 km/h in 5.2 seconds)",
        "Ultra-fast 800V charging (10% to 80% in 18 minutes)",
        "Long real-world range crossing 480km easily"
      ],
      "cons": [
        "Firm, sporty suspension crashes over deep city bumps",
        "Low headroom due to aerodynamic coupe roofline",
        "Gets expensive, pushing into luxury brand territory"
      ]
    },
    "dimensions": { "bootLitres": 520, "wheelbaseMm": 2900, "groundClearanceMm": 178, "lengthMm": 4695, "widthMm": 1890, "heightMm": 1550 }
  },
  {
    "id": "toyota-hilux",
    "brandId": "toyota",
    "name": "Hilux",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 3040000, "max": 3790000 },
    "heroImage": "/images/cars/toyota-hilux.jpg",
    "aiSummary": "The legendary Toyota Hilux pick-up is the global standard for mechanical toughness and utility. Powered by a heavy 2.8L diesel with 4WD, it features a massive rear cargo tub.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Legendary mechanical toughness and load-carrying capacity",
        "Punchy 2.8L mHawk-rival diesel with massive 4WD traction",
        "High water wading depth and rough terrain capability"
      ],
      "cons": [
        "Extremely long length (5.3m) makes city parking tough",
        "Stiff rear leaf springs bounce when unladen",
        "Rear seat backrest is upright and lacks recline"
      ]
    },
    "dimensions": { "bootLitres": 800, "wheelbaseMm": 3085, "groundClearanceMm": 216, "lengthMm": 5325, "widthMm": 1855, "heightMm": 1815 }
  },
  {
    "id": "renault-triber",
    "brandId": "renault",
    "name": "Triber",
    "segment": "sub-4m-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 600000, "max": 898000 },
    "heroImage": "/images/cars/renault-triber.jpg",
    "aiSummary": "The Renault Triber is a masterclass in cabin space packaging, offering a flexible 3-row, 7-seater layout under 4 meters length. The removable 3rd row makes it highly modular.",
    "ncap": { "agency": "GNCAP", "adultStars": 4, "childStars": 3 },
    "prosCons": {
      "pros": [
        "Superb modular cabin with removable third row",
        "Reassuring 4-star safety rating at this price point",
        "Comfortable ride with high ground clearance"
      ],
      "cons": [
        "1.0L naturally aspirated engine feels underpowered",
        "Cabin gets noisy under load at highway speeds",
        "AMT gearbox has sluggish shift transitions"
      ]
    },
    "dimensions": { "bootLitres": 84, "wheelbaseMm": 2636, "groundClearanceMm": 182, "lengthMm": 3990, "widthMm": 1739, "heightMm": 1643 }
  },
  {
    "id": "renault-kwid",
    "brandId": "renault",
    "name": "Kwid",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 470000, "max": 645000 },
    "heroImage": "/images/cars/renault-kwid.jpg",
    "aiSummary": "The Renault Kwid popularized the SUV-like styling package for entry-level hatchbacks. It features high ground clearance, an aggressive stance, and a highly practical digital cabin.",
    "ncap": { "agency": "GNCAP", "adultStars": 1, "childStars": 0 },
    "prosCons": {
      "pros": [
        "SUV-inspired design with high 184mm clearance",
        "Spacious 279-litre boot is great for a micro-hatch",
        "Frugal 1.0L engine is cheap to run daily"
      ],
      "cons": [
        "Weak structural safety rating (1-star GNCAP)",
        "Engine lacks refinement and vibrates at idle",
        "Rotary dial AMT is slow to respond"
      ]
    },
    "dimensions": { "bootLitres": 279, "wheelbaseMm": 2422, "groundClearanceMm": 184, "lengthMm": 3731, "widthMm": 1579, "heightMm": 1490 }
  },
  {
    "id": "nissan-x-trail",
    "brandId": "nissan",
    "name": "X-Trail",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 4992000, "max": 4992000 },
    "heroImage": "/images/cars/nissan-x-trail.jpg",
    "aiSummary": "The Nissan X-Trail is a premium family crossover featuring a unique 1.5L variable compression turbo petrol engine, a smooth CVT, and comfortable 3-row layout. It is imported as a premium CBU.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Advanced VC-Turbo variable compression engine technology",
        "Extremely comfortable seats and quiet, premium cabin",
        "High-grade safety build with 5-star EuroNCAP rating"
      ],
      "cons": [
        "Exorbitantly priced due to CBU import taxes",
        "Only available in a 2WD configuration in India",
        "Third row is extremely tight and lacks legroom"
      ]
    },
    "dimensions": { "bootLitres": 585, "wheelbaseMm": 2705, "groundClearanceMm": 210, "lengthMm": 4680, "widthMm": 1840, "heightMm": 1725 }
  },
  {
    "id": "mg-comet",
    "brandId": "mg",
    "name": "Comet EV",
    "segment": "compact-hatch",
    "bodyStyle": "suv",
    "priceRange": { "min": 699000, "max": 965000 },
    "heroImage": "/images/cars/mg-comet.jpg",
    "aiSummary": "The Comet EV is a quirky, ultra-compact 2-door electric city car. Under 3 meters in length, it is designed for effortless city maneuvers, easy parking, and very cheap running costs.",
    "ncap": { "agency": null, "adultStars": null, "childStars": null },
    "prosCons": {
      "pros": [
        "Ultra-compact dimensions make parking ridiculously easy",
        "Extremely low running costs (around ₹1 per km)",
        "Surprisingly premium dual-screen dashboard layout"
      ],
      "cons": [
        "Zero boot space with all 4 seats in place",
        "Not suited for highway use due to low 100km/h cap",
        "Low power battery pack does not support DC fast charging"
      ]
    },
    "dimensions": { "bootLitres": 10, "wheelbaseMm": 2010, "groundClearanceMm": 165, "lengthMm": 2974, "widthMm": 1505, "heightMm": 1640 }
  },
  {
    "id": "skoda-superb",
    "brandId": "skoda",
    "name": "Superb",
    "segment": "midsize-sedan",
    "bodyStyle": "sedan",
    "priceRange": { "min": 5400000, "max": 5400000 },
    "heroImage": "/images/cars/skoda-superb.jpg",
    "aiSummary": "The Skoda Superb is a benchmark luxury sedan that rivals cars costing double the price. It offers massive rear legroom, a unique wide-opening hatchback tailgate, and a punchy 2.0L TSI engine.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Limousine-grade rear legroom and seat comfort",
        "Cavernous 625L boot with unique liftback tailgate",
        "Smooth, punchy 2.0L TSI petrol with DSG auto"
      ],
      "cons": [
        "Very expensive import pricing in its latest avatar",
        "Low front chin scrapes easily on tall city speed breakers",
        "Firms up over low-speed bumps compared to old model"
      ]
    },
    "dimensions": { "bootLitres": 625, "wheelbaseMm": 2841, "groundClearanceMm": 138, "lengthMm": 4869, "widthMm": 1864, "heightMm": 1469 }
  },
  {
    "id": "skoda-octavia",
    "brandId": "skoda",
    "name": "Octavia",
    "segment": "midsize-sedan",
    "bodyStyle": "sedan",
    "priceRange": { "min": 2735000, "max": 3045000 },
    "heroImage": "/images/cars/skoda-octavia.jpg",
    "aiSummary": "A legendary nameplate among driving enthusiasts, the Octavia combines sharp European styling, rock-solid highway dynamics, and the potent 2.0L TSI engine with a lightning-fast DSG gearbox.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Brilliant, fast-shifting 2.0L TSI + DSG drivetrain",
        "Superb high-speed road manners and steering weight",
        "Practical and spacious liftback boot packaging"
      ],
      "cons": [
        "No manual gearbox option for purist buyers",
        "Stiff low-speed ride quality on 17-inch wheels",
        "Gets expensive at the top L&K trim level"
      ]
    },
    "dimensions": { "bootLitres": 600, "wheelbaseMm": 2680, "groundClearanceMm": 137, "lengthMm": 4689, "widthMm": 1829, "heightMm": 1469 }
  },
  {
    "id": "vw-tiguan",
    "brandId": "volkswagen",
    "name": "Tiguan",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 3517000, "max": 3517000 },
    "heroImage": "/images/cars/vw-tiguan.jpg",
    "aiSummary": "The Volkswagen Tiguan is a premium, understated SUV designed for drivers. It pairs the robust 2.0L TSI engine with 4MOTION all-wheel drive, offering flat high-speed cornering and solid dynamics.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Class-leading high-speed cornering stability and steering",
        "Standard 4MOTION all-wheel drive for slippery roads",
        "Clean, timeless styling with excellent cabin materials"
      ],
      "cons": [
        "Firm European ride crashes over sharp city potholes",
        "2.0L TSI gets very thirsty in heavy city traffic",
        "No hybrid or diesel engine option available"
      ]
    },
    "dimensions": { "bootLitres": 615, "wheelbaseMm": 2679, "groundClearanceMm": 200, "lengthMm": 4509, "widthMm": 1839, "heightMm": 1665 }
  },
  {
    "id": "jeep-wrangler",
    "brandId": "jeep",
    "name": "Wrangler",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 6765000, "max": 7165000 },
    "heroImage": "/images/cars/jeep-wrangler.jpg",
    "aiSummary": "The ultimate off-road icon, the Jeep Wrangler features a rugged body-on-frame build, removable doors/roof, and solid axles. The Rubicon variant adds sway bar disconnect and locking differentials.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 1, "childStars": 1 },
    "prosCons": {
      "pros": [
        "Incredible off-road capability (locking diffs, sway bar disconnect)",
        "Iconic, unmatched road presence and removable roof/doors",
        "Strong 2.0L turbo petrol with 400Nm torque"
      ],
      "cons": [
        "Heavy tyre noise and poor wind insulation at high speeds",
        "Firm, wallowy ride quality on standard highways",
        "Poor EuroNCAP crash safety score (1 star)"
      ]
    },
    "dimensions": { "bootLitres": 533, "wheelbaseMm": 3008, "groundClearanceMm": 244, "lengthMm": 4882, "widthMm": 1894, "heightMm": 1848 }
  },
  {
    "id": "byd-m6",
    "brandId": "byd",
    "name": "M6",
    "segment": "midsize-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 2490000, "max": 2990000 },
    "heroImage": "/images/cars/byd-m6.jpg",
    "aiSummary": "The BYD M6 is a premium 6-seater electric MPV designed for silent family cruising. Driven by BYD's ultra-safe Blade battery, it delivers a comfortable ride and 400+ km real-world range.",
    "ncap": { "agency": null, "adultStars": null, "childStars": null },
    "prosCons": {
      "pros": [
        "Silent, vibration-free electric powertrain is very relaxing",
        "Safe and long-lasting Blade battery technology",
        "Spacious captain seats in the second row"
      ],
      "cons": [
        "Third row under-thigh support is tight for tall adults",
        "Infotainment screen is loaded but locks basic controls",
        "Sparse highway charging support for long family trips"
      ]
    },
    "dimensions": { "bootLitres": 180, "wheelbaseMm": 2800, "groundClearanceMm": 170, "lengthMm": 4710, "widthMm": 1810, "heightMm": 1690 }
  },
  {
    "id": "bmw-3-series",
    "brandId": "bmw",
    "name": "3 Series Gran Limousine",
    "segment": "midsize-sedan",
    "bodyStyle": "sedan",
    "priceRange": { "min": 6060000, "max": 6260000 },
    "heroImage": "/images/cars/bmw-3-series.jpg",
    "aiSummary": "BMW's sporty sedan features an extended wheelbase (Gran Limousine) to combine executive rear-seat comfort with the brand's legendary rear-wheel-drive driving dynamics.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Class-leading rear-wheel-drive dynamics and punchy engines",
        "Generous, limousine-like rear cabin legroom",
        "Sleek and sporty M Sport styling details"
      ],
      "cons": [
        "Low ground clearance scrapes on sharp speed breakers",
        "Suspension is firm at lower city speeds",
        "Interior lacks physical buttons for climate control"
      ]
    },
    "dimensions": { "bootLitres": 480, "wheelbaseMm": 2961, "groundClearanceMm": 135, "lengthMm": 4823, "widthMm": 1827, "heightMm": 1441 }
  },
  {
    "id": "mercedes-c-class",
    "brandId": "mercedes",
    "name": "C-Class",
    "segment": "midsize-sedan",
    "bodyStyle": "sedan",
    "priceRange": { "min": 6185000, "max": 6900000 },
    "heroImage": "/images/cars/mercedes-c-class.jpg",
    "aiSummary": "Known as the 'Baby S-Class', the Mercedes C-Class offers a gorgeous portrait cockpit, exceptional highway cabin quietness, and highly fuel-efficient mild-hybrid engine options.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Stunning, luxury-yacht cockpit design with large screen",
        "Frugal diesel (C220d) cruises silently at high speed",
        "Solid, tank-like high-speed ride and safety suite"
      ],
      "cons": [
        "Rear seat headroom is tight due to sloping roof",
        "Mild hybrid gearbox can feel jerky in stop-go crawls",
        "Very expensive maintenance and service packages"
      ]
    },
    "dimensions": { "bootLitres": 455, "wheelbaseMm": 2865, "groundClearanceMm": 130, "lengthMm": 4751, "widthMm": 1820, "heightMm": 1438 }
  },
  {
    "id": "volvo-xc40-recharge",
    "brandId": "volvo",
    "name": "XC40 Recharge",
    "segment": "compact-suv",
    "bodyStyle": "suv",
    "priceRange": { "min": 5495000, "max": 5790000 },
    "heroImage": "/images/cars/volvo-xc40-recharge.jpg",
    "aiSummary": "The Volvo XC40 Recharge is a premium electric SUV featuring a boxy, Scandinavian look, industry-benchmark safety assists, and brutal 408PS twin-motor AWD acceleration.",
    "ncap": { "agency": "EuroNCAP", "adultStars": 5, "childStars": 5 },
    "prosCons": {
      "pros": [
        "Brutal 408PS twin-motor performance (0-100 in 4.8s)",
        "Benchmark active safety suite and ADAS functions",
        "Premium, understated cabin with sustainable materials"
      ],
      "cons": [
        "High rear cabin floor compromises passenger leg support",
        "Firm highway ride over expansion joints",
        "Infotainment system is fully touchscreen-driven"
      ]
    },
    "dimensions": { "bootLitres": 413, "wheelbaseMm": 2702, "groundClearanceMm": 175, "lengthMm": 4440, "widthMm": 1863, "heightMm": 1647 }
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
  // WagonR Variants
  { "id": "wagonr-lxi-mt", "modelId": "maruti-wagonr", "name": "LXi 1.0 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 554500, "engine": { "cc": 998, "ps": 67, "nm": 89, "cylinders": 3, "turbo": false }, "claimedFE": 24.3, "realWorldFE": 17.5, "kerbWeight": 810, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "wagonr-zxi-plus-amt", "modelId": "maruti-wagonr", "name": "ZXi+ 1.2 AMT", "fuel": "petrol", "transmission": "AMT", "priceExShowroom": 742000, "engine": { "cc": 1197, "ps": 90, "nm": 113, "cylinders": 4, "turbo": false }, "claimedFE": 24.4, "realWorldFE": 17.8, "kerbWeight": 850, "featureIds": [...MID] },

  // Alto K10 Variants
  { "id": "alto-lxi-mt", "modelId": "maruti-alto-k10", "name": "LXi 1.0 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 483000, "engine": { "cc": 998, "ps": 67, "nm": 89, "cylinders": 3, "turbo": false }, "claimedFE": 24.3, "realWorldFE": 17.5, "kerbWeight": 730, "featureIds": [...BASE.filter(f => f !== "rear-camera" && f !== "hill-hold")] },
  { "id": "alto-vxi-plus-amt", "modelId": "maruti-alto-k10", "name": "VXi+ 1.0 AMT", "fuel": "petrol", "transmission": "AMT", "priceExShowroom": 585000, "engine": { "cc": 998, "ps": 67, "nm": 89, "cylinders": 3, "turbo": false }, "claimedFE": 24.9, "realWorldFE": 18.0, "kerbWeight": 745, "featureIds": [...MID.filter(f => f !== "alloy-16" && f !== "rear-ac-vents")] },

  // Grand i10 Nios Variants
  { "id": "i10-era-mt", "modelId": "hyundai-i10-nios", "name": "Era 1.2 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 592000, "engine": { "cc": 1197, "ps": 83, "nm": 114, "cylinders": 4, "turbo": false }, "claimedFE": 20.1, "realWorldFE": 14.5, "kerbWeight": 930, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "i10-asta-mt", "modelId": "hyundai-i10-nios", "name": "Asta 1.2 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 795000, "engine": { "cc": 1197, "ps": 83, "nm": 114, "cylinders": 4, "turbo": false }, "claimedFE": 20.1, "realWorldFE": 14.5, "kerbWeight": 950, "featureIds": [...TOP.filter(f => f !== "pano-sunroof" && f !== "ventilated-seats")] },

  // Tata Tiago Variants
  { "id": "tiago-xe-mt", "modelId": "tata-tiago", "name": "XE 1.2 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 565000, "engine": { "cc": 1199, "ps": 86, "nm": 113, "cylinders": 3, "turbo": false }, "claimedFE": 19.0, "realWorldFE": 13.5, "kerbWeight": 980, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "tiago-xz-plus-cng", "modelId": "tata-tiago", "name": "XZ+ CNG MT", "fuel": "cng", "transmission": "MT", "priceExShowroom": 835000, "engine": { "cc": 1199, "ps": 73, "nm": 95, "cylinders": 3, "turbo": false }, "claimedFE": 26.5, "realWorldFE": 19.0, "kerbWeight": 1080, "featureIds": [...MID] },

  // Tata Tigor Variants
  { "id": "tigor-xm-mt", "modelId": "tata-tigor", "name": "XM 1.2 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 680000, "engine": { "cc": 1199, "ps": 86, "nm": 113, "cylinders": 3, "turbo": false }, "claimedFE": 19.0, "realWorldFE": 13.5, "kerbWeight": 1010, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "tigor-xz-plus-amt", "modelId": "tata-tigor", "name": "XZ+ 1.2 AMT", "fuel": "petrol", "transmission": "AMT", "priceExShowroom": 895000, "engine": { "cc": 1199, "ps": 86, "nm": 113, "cylinders": 3, "turbo": false }, "claimedFE": 19.6, "realWorldFE": 13.8, "kerbWeight": 1030, "featureIds": [...TOP.filter(f => f !== "pano-sunroof" && f !== "ventilated-seats" && f !== "camera-360")] },

  // Bolero Neo Variants
  { "id": "bolero-neo-n4-mt", "modelId": "mahindra-bolero-neo", "name": "N4 1.5 MT", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 990000, "engine": { "cc": 1493, "ps": 100, "nm": 260, "cylinders": 3, "turbo": true }, "claimedFE": 17.2, "realWorldFE": 12.8, "kerbWeight": 1560, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "bolero-neo-n10-opt-mt", "modelId": "mahindra-bolero-neo", "name": "N10 (O) 1.5 MT", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 1215000, "engine": { "cc": 1493, "ps": 100, "nm": 260, "cylinders": 3, "turbo": true }, "claimedFE": 17.2, "realWorldFE": 12.8, "kerbWeight": 1585, "featureIds": [...MID, "awd-4wd"] },

  // Kia EV6 Variants
  { "id": "ev6-gt-line-rwd", "modelId": "kia-ev6", "name": "GT Line RWD", "fuel": "ev", "transmission": "AT", "priceExShowroom": 6095000, "engine": { "cc": 0, "ps": 229, "nm": 350, "cylinders": 0, "turbo": false }, "claimedFE": 8.5, "realWorldFE": 6.2, "kerbWeight": 1930, "featureIds": [...TOP] },
  { "id": "ev6-gt-line-awd", "modelId": "kia-ev6", "name": "GT Line AWD", "fuel": "ev", "transmission": "AT", "priceExShowroom": 6595000, "engine": { "cc": 0, "ps": 325, "nm": 605, "cylinders": 0, "turbo": false }, "claimedFE": 8.2, "realWorldFE": 5.9, "kerbWeight": 2015, "featureIds": [...TOP, ...ADAS, "awd-4wd"] },

  // Toyota Hilux Variants
  { "id": "hilux-std-mt-4wd", "modelId": "toyota-hilux", "name": "Standard 2.8 MT 4WD", "fuel": "diesel", "transmission": "MT", "priceExShowroom": 3040000, "engine": { "cc": 2755, "ps": 204, "nm": 420, "cylinders": 4, "turbo": true }, "claimedFE": 12.0, "realWorldFE": 8.8, "kerbWeight": 2110, "featureIds": [...MID, "awd-4wd"] },
  { "id": "hilux-high-at-4wd", "modelId": "toyota-hilux", "name": "High 2.8 AT 4WD", "fuel": "diesel", "transmission": "AT", "priceExShowroom": 3790000, "engine": { "cc": 2755, "ps": 204, "nm": 500, "cylinders": 4, "turbo": true }, "claimedFE": 10.9, "realWorldFE": 8.2, "kerbWeight": 2160, "featureIds": [...TOP, "awd-4wd"] },

  // Renault Triber Variants
  { "id": "triber-rxl-mt", "modelId": "renault-triber", "name": "RXL 1.0 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 680000, "engine": { "cc": 999, "ps": 72, "nm": 96, "cylinders": 3, "turbo": false }, "claimedFE": 19.0, "realWorldFE": 13.2, "kerbWeight": 940, "featureIds": [...BASE.filter(f => f !== "rear-camera")] },
  { "id": "triber-rxz-amt", "modelId": "renault-triber", "name": "RXZ 1.0 AMT", "fuel": "petrol", "transmission": "AMT", "priceExShowroom": 890000, "engine": { "cc": 999, "ps": 72, "nm": 96, "cylinders": 3, "turbo": false }, "claimedFE": 18.2, "realWorldFE": 12.8, "kerbWeight": 965, "featureIds": [...MID] },

  // Renault Kwid Variants
  { "id": "kwid-rxt-mt", "modelId": "renault-kwid", "name": "RXT 1.0 MT", "fuel": "petrol", "transmission": "MT", "priceExShowroom": 550000, "engine": { "cc": 999, "ps": 68, "nm": 91, "cylinders": 3, "turbo": false }, "claimedFE": 21.7, "realWorldFE": 15.8, "kerbWeight": 760, "featureIds": [...BASE] },
  { "id": "kwid-climber-amt", "modelId": "renault-kwid", "name": "Climber 1.0 AMT", "fuel": "petrol", "transmission": "AMT", "priceExShowroom": 630000, "engine": { "cc": 999, "ps": 68, "nm": 91, "cylinders": 3, "turbo": false }, "claimedFE": 22.3, "realWorldFE": 16.2, "kerbWeight": 775, "featureIds": [...MID.filter(f => f !== "alloy-16" && f !== "rear-ac-vents")] },

  // Nissan X-Trail Variants
  { "id": "xtrail-turbo-cvt", "modelId": "nissan-x-trail", "name": "1.5 VC-Turbo CVT", "fuel": "petrol", "transmission": "CVT", "priceExShowroom": 4992000, "engine": { "cc": 1497, "ps": 163, "nm": 300, "cylinders": 3, "turbo": true }, "claimedFE": 13.7, "realWorldFE": 9.8, "kerbWeight": 1680, "featureIds": [...TOP] },

  // MG Comet EV Variants
  { "id": "comet-play-17", "modelId": "mg-comet", "name": "Play 17.3kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 788000, "engine": { "cc": 0, "ps": 42, "nm": 110, "cylinders": 0, "turbo": false }, "claimedFE": 11.5, "realWorldFE": 8.5, "kerbWeight": 815, "featureIds": [...BASE, "touchscreen-10"] },
  { "id": "comet-exclusive-fc-17", "modelId": "mg-comet", "name": "Exclusive FC 17.3kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 940000, "engine": { "cc": 0, "ps": 42, "nm": 110, "cylinders": 0, "turbo": false }, "claimedFE": 11.5, "realWorldFE": 8.5, "kerbWeight": 830, "featureIds": [...MID, "touchscreen-10"] },

  // Skoda Superb Variants
  { "id": "superb-lk-tsi-dsg", "modelId": "skoda-superb", "name": "L&K 2.0 TSI DSG", "fuel": "petrol", "transmission": "DCT", "priceExShowroom": 5400000, "engine": { "cc": 1984, "ps": 190, "nm": 320, "cylinders": 4, "turbo": true }, "claimedFE": 15.1, "realWorldFE": 10.2, "kerbWeight": 1560, "featureIds": [...TOP, ...ADAS] },

  // Skoda Octavia Variants
  { "id": "octavia-style-tsi-dsg", "modelId": "skoda-octavia", "name": "Style 2.0 TSI DSG", "fuel": "petrol", "transmission": "DCT", "priceExShowroom": 2735000, "engine": { "cc": 1984, "ps": 190, "nm": 320, "cylinders": 4, "turbo": true }, "claimedFE": 15.8, "realWorldFE": 10.8, "kerbWeight": 1430, "featureIds": [...HIGH] },
  { "id": "octavia-laurin-klement-tsi-dsg", "modelId": "skoda-octavia", "name": "L&K 2.0 TSI DSG", "fuel": "petrol", "transmission": "DCT", "priceExShowroom": 3045000, "engine": { "cc": 1984, "ps": 190, "nm": 320, "cylinders": 4, "turbo": true }, "claimedFE": 15.8, "realWorldFE": 10.8, "kerbWeight": 1450, "featureIds": [...TOP] },

  // VW Tiguan Variants
  { "id": "tiguan-elegance-tsi-dsg-4motion", "modelId": "vw-tiguan", "name": "Elegance 2.0 TSI 4MOTION", "fuel": "petrol", "transmission": "DCT", "priceExShowroom": 3517000, "engine": { "cc": 1984, "ps": 190, "nm": 320, "cylinders": 4, "turbo": true }, "claimedFE": 12.6, "realWorldFE": 8.5, "kerbWeight": 1700, "featureIds": [...TOP, "awd-4wd"] },

  // Jeep Wrangler Variants
  { "id": "wrangler-unlimited-petrol-at", "modelId": "jeep-wrangler", "name": "Unlimited 2.0 Petrol AT", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 6765000, "engine": { "cc": 1995, "ps": 270, "nm": 400, "cylinders": 4, "turbo": true }, "claimedFE": 12.1, "realWorldFE": 8.2, "kerbWeight": 2010, "featureIds": [...TOP, "awd-4wd"] },
  { "id": "wrangler-rubicon-petrol-at", "modelId": "jeep-wrangler", "name": "Rubicon 2.0 Petrol AT 4WD", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 7165000, "engine": { "cc": 1995, "ps": 270, "nm": 400, "cylinders": 4, "turbo": true }, "claimedFE": 11.4, "realWorldFE": 7.8, "kerbWeight": 2085, "featureIds": [...TOP, "awd-4wd"] },

  // BYD M6 Variants
  { "id": "m6-superior-55", "modelId": "byd-m6", "name": "Superior 55.4kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 2490000, "engine": { "cc": 0, "ps": 163, "nm": 310, "cylinders": 0, "turbo": false }, "claimedFE": 9.2, "realWorldFE": 6.8, "kerbWeight": 1780, "featureIds": [...HIGH] },
  { "id": "m6-superior-plus-71", "modelId": "byd-m6", "name": "Superior Plus 71.8kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 2990000, "engine": { "cc": 0, "ps": 204, "nm": 310, "cylinders": 0, "turbo": false }, "claimedFE": 9.0, "realWorldFE": 6.5, "kerbWeight": 1850, "featureIds": [...TOP, ...ADAS] },

  // BMW 3 Series Variants
  { "id": "3series-330li-m-sport", "modelId": "bmw-3-series", "name": "330Li M Sport", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 6060000, "engine": { "cc": 1998, "ps": 258, "nm": 400, "cylinders": 4, "turbo": true }, "claimedFE": 15.3, "realWorldFE": 10.5, "kerbWeight": 1580, "featureIds": [...TOP] },
  { "id": "3series-320ld-m-sport", "modelId": "bmw-3-series", "name": "320ld M Sport", "fuel": "diesel", "transmission": "AT", "priceExShowroom": 6260000, "engine": { "cc": 1995, "ps": 190, "nm": 400, "cylinders": 4, "turbo": true }, "claimedFE": 19.6, "realWorldFE": 13.8, "kerbWeight": 1620, "featureIds": [...TOP] },

  // Mercedes C-Class Variants
  { "id": "cclass-c200-petrol-at", "modelId": "mercedes-c-class", "name": "C200 Avantgarde", "fuel": "petrol", "transmission": "AT", "priceExShowroom": 6185000, "engine": { "cc": 1496, "ps": 204, "nm": 300, "cylinders": 4, "turbo": true }, "claimedFE": 16.9, "realWorldFE": 11.2, "kerbWeight": 1620, "featureIds": [...TOP] },
  { "id": "cclass-c220d-diesel-at", "modelId": "mercedes-c-class", "name": "C220d Avantgarde", "fuel": "diesel", "transmission": "AT", "priceExShowroom": 6385000, "engine": { "cc": 1999, "ps": 200, "nm": 440, "cylinders": 4, "turbo": true }, "claimedFE": 23.0, "realWorldFE": 15.5, "kerbWeight": 1690, "featureIds": [...TOP] },

  // Volvo XC40 Recharge Variants
  { "id": "xc40-recharge-single-motor", "modelId": "volvo-xc40-recharge", "name": "Single Motor 69kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 5495000, "engine": { "cc": 0, "ps": 238, "nm": 420, "cylinders": 0, "turbo": false }, "claimedFE": 9.3, "realWorldFE": 6.8, "kerbWeight": 2020, "featureIds": [...TOP] },
  { "id": "xc40-recharge-twin-motor", "modelId": "volvo-xc40-recharge", "name": "Twin Motor AWD 78kWh", "fuel": "ev", "transmission": "AT", "priceExShowroom": 579000, "engine": { "cc": 0, "ps": 408, "nm": 660, "cylinders": 0, "turbo": false }, "claimedFE": 8.9, "realWorldFE": 6.2, "kerbWeight": 2110, "featureIds": [...TOP, ...ADAS, "awd-4wd"] }
];

for (const nv of NEW_VARIANTS) {
  if (!variants.some(v => v.id === nv.id)) {
    variants.push(nv);
    console.log(`Added variant: ${nv.id}`);
  }
}

// ---- 4. Add ZeroTo100 & Braking Metrics to test-data.json ----
const NEW_TEST_DATA = [
  { "variantId": "wagonr-lxi-mt", "zeroTo100": { "value": 13.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "wagonr-zxi-plus-amt", "zeroTo100": { "value": 11.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 7.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.8, "source": "estimated-model", "estimated": true } },

  { "variantId": "alto-lxi-mt", "zeroTo100": { "value": 13.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "alto-vxi-plus-amt", "zeroTo100": { "value": 13.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.0, "source": "estimated-model", "estimated": true } },

  { "variantId": "i10-era-mt", "zeroTo100": { "value": 12.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "i10-asta-mt", "zeroTo100": { "value": 12.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 41.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "tiago-xe-mt", "zeroTo100": { "value": 13.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.6, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "tiago-xz-plus-cng", "zeroTo100": { "value": 15.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 10.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.0, "source": "estimated-model", "estimated": true } },

  { "variantId": "tigor-xm-mt", "zeroTo100": { "value": 13.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 8.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "tigor-xz-plus-amt", "zeroTo100": { "value": 14.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 9.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.2, "source": "estimated-model", "estimated": true } },

  { "variantId": "bolero-neo-n4-mt", "zeroTo100": { "value": 14.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 9.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 44.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "bolero-neo-n10-opt-mt", "zeroTo100": { "value": 14.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 9.5, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 44.2, "source": "estimated-model", "estimated": true } },

  { "variantId": "ev6-gt-line-rwd", "zeroTo100": { "value": 7.3, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 3.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "ev6-gt-line-awd", "zeroTo100": { "value": 5.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 2.6, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 37.2, "source": "estimated-model", "estimated": true } },

  { "variantId": "hilux-std-mt-4wd", "zeroTo100": { "value": 11.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "hilux-high-at-4wd", "zeroTo100": { "value": 10.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 6.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.8, "source": "estimated-model", "estimated": true } },

  { "variantId": "triber-rxl-mt", "zeroTo100": { "value": 15.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 10.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "triber-rxz-amt", "zeroTo100": { "value": 16.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 11.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.0, "source": "estimated-model", "estimated": true } },

  { "variantId": "kwid-rxt-mt", "zeroTo100": { "value": 14.1, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 9.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.8, "source": "estimated-model", "estimated": true } },
  { "variantId": "kwid-climber-amt", "zeroTo100": { "value": 14.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 9.6, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 42.8, "source": "estimated-model", "estimated": true } },

  { "variantId": "xtrail-turbo-cvt", "zeroTo100": { "value": 9.6, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.4, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 40.2, "source": "estimated-model", "estimated": true } },

  { "variantId": "comet-play-17", "zeroTo100": { "value": 15.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 11.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.5, "source": "estimated-model", "estimated": true } },
  { "variantId": "comet-exclusive-fc-17", "zeroTo100": { "value": 15.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 11.0, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "superb-lk-tsi-dsg", "zeroTo100": { "value": 7.7, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.1, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "octavia-style-tsi-dsg", "zeroTo100": { "value": 7.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 3.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "octavia-laurin-klement-tsi-dsg", "zeroTo100": { "value": 7.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 3.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.0, "source": "estimated-model", "estimated": true } },

  { "variantId": "tiguan-elegance-tsi-dsg-4motion", "zeroTo100": { "value": 7.9, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.3, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.2, "source": "estimated-model", "estimated": true } },

  { "variantId": "wrangler-unlimited-petrol-at", "zeroTo100": { "value": 8.1, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.6, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 43.8, "source": "estimated-model", "estimated": true } },
  { "variantId": "wrangler-rubicon-petrol-at", "zeroTo100": { "value": 8.5, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 44.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "m6-superior-55", "zeroTo100": { "value": 9.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 5.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.8, "source": "estimated-model", "estimated": true } },
  { "variantId": "m6-superior-plus-71", "zeroTo100": { "value": 8.6, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.8, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 39.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "3series-330li-m-sport", "zeroTo100": { "value": 6.2, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 3.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 37.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "3series-320ld-m-sport", "zeroTo100": { "value": 7.6, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 4.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 37.5, "source": "estimated-model", "estimated": true } },

  { "variantId": "cclass-c200-petrol-at", "zeroTo100": { "value": 7.3, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 3.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.0, "source": "estimated-model", "estimated": true } },
  { "variantId": "cclass-c220d-diesel-at", "zeroTo100": { "value": 7.3, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 3.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.0, "source": "estimated-model", "estimated": true } },

  { "variantId": "xc40-recharge-single-motor", "zeroTo100": { "value": 7.3, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 3.9, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 38.2, "source": "estimated-model", "estimated": true } },
  { "variantId": "xc40-recharge-twin-motor", "zeroTo100": { "value": 4.8, "source": "estimated-model", "estimated": true }, "sixtyTo100": { "value": 2.2, "source": "estimated-model", "estimated": true }, "braking100to0": { "value": 37.5, "source": "estimated-model", "estimated": true } }
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
    "modelId": "maruti-wagonr",
    "voices": [
      { "theme": "Cabin Space", "sentiment": "positive", "text": "WagonR's tall-boy design means incredible headroom and easy ingress/egress, making it highly loved by senior citizens." },
      { "theme": "Highway Handling", "sentiment": "negative", "text": "Feels lightweight at speeds above 80 km/h; crosswinds shake the car noticeably on flyovers." },
      { "theme": "Engine Pep", "sentiment": "positive", "text": "The 1.2L K-Series petrol engine is very peppy and fuel-efficient, easily pulling the lightweight car in town." }
    ]
  },
  {
    "modelId": "maruti-alto-k10",
    "voices": [
      { "theme": "Traffic Manners", "sentiment": "positive", "text": "Extremely easy to park and navigate in tight traffic lanes. The K10 engine has great low-end responsiveness." },
      { "theme": "Highway Safety", "sentiment": "negative", "text": "Build feels paper-thin, and the lack of basic safety structure raises concern on highways." },
      { "theme": "Cheap Maintenance", "sentiment": "positive", "text": "Very cheap running costs and Maruti's service network mean peace of mind for first-time buyers." }
    ]
  },
  {
    "modelId": "hyundai-i10-nios",
    "voices": [
      { "theme": "Refinement", "sentiment": "positive", "text": "Super silent 4-cylinder engine; idle is completely vibration-free, feels much more premium than 3-cylinder rivals." },
      { "theme": "Space", "sentiment": "negative", "text": "Rear seat is tight for three adults; best suited as a comfortable 4-seater." },
      { "theme": "Features", "sentiment": "positive", "text": "Interior fit and finish, wireless charging, and the crisp touchscreen look like they belong in a segment above." }
    ]
  },
  {
    "modelId": "tata-tiago",
    "voices": [
      { "theme": "Safety Poise", "sentiment": "positive", "text": "4-star GNCAP safety and heavy door thud feel very reassuring. It is the safest entry-level hatchback on sale." },
      { "theme": "Refinement thrums", "sentiment": "negative", "text": "The 3-cylinder Revotron engine vibrates at idle and gets noisy when revved past 3000 RPM." },
      { "theme": "CNG Boot", "sentiment": "positive", "text": "Tata's twin-cylinder CNG technology leaves usable boot space, unlike traditional CNG tanks." }
    ]
  },
  {
    "modelId": "tata-tigor",
    "voices": [
      { "theme": "Sedan Design", "sentiment": "positive", "text": "The sloping notchback roofline looks very attractive and makes the Tigor stand out from traditional boxy compact sedans." },
      { "theme": "AMT lag", "sentiment": "negative", "text": "The AMT gearbox has a noticeable head-nod effect during shifts, especially when overtaking quickly on highways." },
      { "theme": "Spacious Boot", "sentiment": "positive", "text": "Large 419-litre boot uses gas struts rather than hinges, meaning you can pack bags all the way to the edge." }
    ]
  },
  {
    "modelId": "mahindra-bolero-neo",
    "voices": [
      { "theme": "RWD Build", "sentiment": "positive", "text": "RWD layout and body-on-frame build make it exceptionally tough. The locking differential on top trim claws out of muddy ruts easily." },
      { "theme": "Bumpy Empty Ride", "sentiment": "negative", "text": "Suspension is stiff and bouncy when the car is empty; it only settles down once you have 5+ passengers on board." },
      { "theme": "TUV DNA", "sentiment": "positive", "text": "Much more modern and comfortable than the standard Bolero, though plastic quality is still basic." }
    ]
  },
  {
    "modelId": "kia-ev6",
    "voices": [
      { "theme": "800V Architecture", "sentiment": "positive", "text": "800V architecture charges from 10% to 80% in just 18 minutes on a 350kW charger. Real-world range easily crosses 480km." },
      { "theme": "Stiff Ride", "sentiment": "negative", "text": "Ride is very stiff on low profile tyres; sharp highway joints and expansion plates thud loudly into the cabin." },
      { "theme": "Concept Styling", "sentiment": "positive", "text": "Looks like a concept car rolling down the street. The rear sweep and curved LED cluster are masterfully drawn." }
    ]
  },
  {
    "modelId": "toyota-hilux",
    "voices": [
      { "theme": "Utilitarian Legend", "sentiment": "positive", "text": "Hilux is a global legend for a reason. You can haul heavy machinery in the back tub and climb vertical rock trails with absolute ease." },
      { "theme": "Gargantuan Length", "sentiment": "negative", "text": "Over 5.3 meters long! It is impossible to park in standard mall spaces and requires multiple reverse shunts." },
      { "theme": "Bouncy Leaf Springs", "sentiment": "mixed", "text": "Rear leaf springs are designed for heavy load; when unladen, the back of the pickup bounces and hops over speed bumps." }
    ]
  },
  {
    "modelId": "renault-triber",
    "voices": [
      { "theme": "Space Packaging", "sentiment": "positive", "text": "Incredible modular cabin under 4 meters! The removable third row turns the MPV into a cavernous luggage hauler." },
      { "theme": "Highway Load", "sentiment": "negative", "text": "The 1.0L naturally aspirated engine feels severely strained with 7 people on board, especially on uphill highway sweeps." },
      { "theme": "Value", "sentiment": "positive", "text": "The cheapest 7-seater on sale that feels like a modern family car rather than a commercial van." }
    ]
  },
  {
    "modelId": "renault-kwid",
    "voices": [
      { "theme": "SUV styling", "sentiment": "positive", "text": "SUV-inspired high ground clearance (184mm) and body cladding make it look bold and take bad potholes with ease." },
      { "theme": "Gearbox shift", "sentiment": "negative", "text": "The rotary dial AMT is slow to respond, with a noticeable lag when you step on the gas for quick overtaking." },
      { "theme": "Vibrations", "sentiment": "mixed", "text": "Decent cabin styling and a large screen, but engine noise and vibrations leak in heavily." }
    ]
  },
  {
    "modelId": "nissan-x-trail",
    "voices": [
      { "theme": "Engine Refinement", "sentiment": "positive", "text": "The VC-Turbo engine is an engineering marvel. It is smooth, punchy, and delivers great mid-range pull." },
      { "theme": "Import Pricing", "sentiment": "negative", "text": "Imported as a CBU, it is priced too high for a 3-cylinder crossover, crossing Fortuner diesel money." },
      { "theme": "Touring Comfort", "sentiment": "positive", "text": "Extremely comfortable slide/recline seats and premium soft-touch materials make it feel like a luxury tourer." }
    ]
  },
  {
    "modelId": "mg-comet",
    "voices": [
      { "theme": "Micro Dimensions", "sentiment": "positive", "text": "Under 3 meters! You can park it nose-in or fit into tiny gaps that hatchbacks like Swift cannot dream of." },
      { "theme": "No Boot space", "sentiment": "negative", "text": "With 4 people inside, there is absolutely zero space for even a laptop bag. You must fold the rear seats to carry bags." },
      { "theme": "Daily Frugality", "sentiment": "positive", "text": "Charging costs are next to nothing. Perfect city runabout for daily errands and office commutes." }
    ]
  },
  {
    "modelId": "skoda-superb",
    "voices": [
      { "theme": "Limousine Space", "sentiment": "positive", "text": "Rear legroom is limousine-grade. The ride is extremely cushiony, easily rivaling sedans costing twice as much." },
      { "theme": "Ground Clearance Chin", "sentiment": "negative", "text": "The long wheelbase and low front lip scrape on deep potholes and speed breakers if not crossed slowly." },
      { "theme": "Liftback Gate", "sentiment": "positive", "text": "The twin-door notchback tailgate opens wide like a hatchback, giving access to a cavernous 625-litre boot." }
    ]
  },
  {
    "modelId": "skoda-octavia",
    "voices": [
      { "theme": "Potent TSI", "sentiment": "positive", "text": "The 2.0L TSI + DSG combo is absolute magic. Gear shifts are lightning fast, and the car accelerates like a bullet." },
      { "theme": "Sparsity", "sentiment": "mixed", "text": "Owners love the car, but since Skoda stopped selling it locally, sourcing replacement parts takes longer now." },
      { "theme": "Expressway Grip", "sentiment": "positive", "text": "Steering weighs up beautifully, and the car feels glued to the road at triple-digit expressway speeds." }
    ]
  },
  {
    "modelId": "vw-tiguan",
    "voices": [
      { "theme": "Driver Focus", "sentiment": "positive", "text": "No body roll, taut chassis, and excellent high-speed highway poise make it a fantastic driver's SUV." },
      { "theme": "Stiffness", "sentiment": "negative", "text": "The ride is European-firm; it handles highway corners flat but thuds over sharp speed bumps in town." },
      { "theme": "Cabin Quality", "sentiment": "positive", "text": "Panoramic sunroof, large digital cockpit, and clean, high-quality cabin layout make it feel very premium." }
    ]
  },
  {
    "modelId": "jeep-wrangler",
    "voices": [
      { "theme": "Mechanical locks", "sentiment": "positive", "text": "The Rubicon climbs over massive boulders and crosses rivers effortlessly. Front/rear locking diffs and sway-bar disconnect are top-tier." },
      { "theme": "Highway noise", "sentiment": "negative", "text": "Heavy tyre whine from mud-terrain treads on asphalt, and boxy aerodynamics create loud wind noise at 100 km/h." },
      { "theme": "Stripped driving", "sentiment": "positive", "text": "Being able to strip off the roof panels and doors for open-air trail driving is a unique, unmatched experience." }
    ]
  },
  {
    "modelId": "byd-m6",
    "voices": [
      { "theme": "Glide Comfort", "sentiment": "positive", "text": "Quiet, silent electric glide. It is the most relaxing 3-row family vehicle for highway touring." },
      { "theme": "3rd row cushion", "sentiment": "negative", "text": "Third-row seats have low under-thigh support; adult passengers will find their knees pointing high on long trips." },
      { "theme": "Safe battery", "sentiment": "positive", "text": "Equipped with BYD's durable Blade battery and standard 6 airbags, it feels very safe and handles well." }
    ]
  },
  {
    "modelId": "bmw-3-series",
    "voices": [
      { "theme": "Limousine Rear", "sentiment": "positive", "text": "The Gran Limousine's longer wheelbase adds massive rear legroom, making it very comfortable for chauffeured owners." },
      { "theme": "RWD Dynamics", "sentiment": "positive", "text": "Handles corners like it's on rails. Rear-wheel drive dynamics and the punchy 258PS turbo petrol are absolute bliss." },
      { "theme": "Suspension Stiffness", "sentiment": "negative", "text": "M Sport suspension is stiff over city manhole covers, though it flattens out beautifully as speed climbs." }
    ]
  },
  {
    "modelId": "mercedes-c-class",
    "voices": [
      { "theme": "Cabin Splendor", "sentiment": "positive", "text": "The massive portrait touchscreen, ambient lighting, and metal vents make the cabin look like a multi-crore luxury yacht." },
      { "theme": "Highway Economy", "sentiment": "positive", "text": "The C220d diesel engine easily returns 18+ km/l on expressways, gliding silently at 120 km/h." },
      { "theme": "Maintenance pricing", "sentiment": "negative", "text": "Very expensive maintenance and service packages from dealers, even for basic wear and tear parts." }
    ]
  },
  {
    "modelId": "volvo-xc40-recharge",
    "voices": [
      { "theme": "Brutal Acceleration", "sentiment": "positive", "text": "The twin motor model pushes 408PS. Overtakes are instant, pinning you back into the seats like a high-end sports car." },
      { "theme": "Active Safety", "sentiment": "positive", "text": "Top-tier Volvo safety. Auto-braking has saved me twice in city traffic; lane centering is highly precise." },
      { "theme": "Rear Knee Support", "sentiment": "negative", "text": "The floor is slightly high due to battery placement, making the rear seat cushion feel short on knee support." }
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
  { "modelId": "maruti-wagonr", "query": "Suzuki Wagon R 2019 India", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "maruti-alto-k10", "query": "Suzuki Alto K10 2022", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "hyundai-i10-nios", "query": "Hyundai Grand i10 Nios", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "tata-tiago", "query": "Tata Tiago", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "tata-tigor", "query": "Tata Tigor", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "mahindra-bolero-neo", "query": "Mahindra Bolero Neo", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "kia-ev6", "query": "Kia EV6 2021", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "toyota-hilux", "query": "Toyota Hilux double cab 2020", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "renault-triber", "query": "Renault Triber", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "renault-kwid", "query": "Renault Kwid 2019", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "nissan-x-trail", "query": "Nissan X-Trail T33", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "mg-comet", "query": "Wuling Air EV", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "skoda-superb", "query": "Skoda Superb III", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "skoda-octavia", "query": "Skoda Octavia IV", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "vw-tiguan", "query": "Volkswagen Tiguan II facelift", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "jeep-wrangler", "query": "Jeep Wrangler JL Unlimited", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "byd-m6", "query": "BYD M6", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "bmw-3-series", "query": "BMW G20", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "mercedes-c-class", "query": "Mercedes-Benz W206", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" },
  { "modelId": "volvo-xc40-recharge", "query": "Volvo XC40 Recharge", "fetchedFrom": "", "credit": "Wikimedia Commons", "license": "CC-BY-SA" }
];

for (const is of NEW_IMAGE_SOURCES) {
  if (!imageSources.sources.some(s => s.modelId === is.modelId)) {
    imageSources.sources.push(is);
    console.log(`Added image source for: ${is.modelId}`);
  }
}

// ---- 7. Add Dimensions to model-body-dimensions.json ----
const NEW_DIMENSIONS = {
  "maruti-wagonr": { "lengthMm": 3655, "widthMm": 1620, "heightMm": 1675 },
  "maruti-alto-k10": { "lengthMm": 3530, "widthMm": 1490, "heightMm": 1520 },
  "hyundai-i10-nios": { "lengthMm": 3815, "widthMm": 1680, "heightMm": 1520 },
  "tata-tiago": { "lengthMm": 3765, "widthMm": 1677, "heightMm": 1535 },
  "tata-tigor": { "lengthMm": 3993, "widthMm": 1677, "heightMm": 1532 },
  "mahindra-bolero-neo": { "lengthMm": 3995, "widthMm": 1795, "heightMm": 1817 },
  "kia-ev6": { "lengthMm": 4695, "widthMm": 1890, "heightMm": 1550 },
  "toyota-hilux": { "lengthMm": 5325, "widthMm": 1855, "heightMm": 1815 },
  "renault-triber": { "lengthMm": 3990, "widthMm": 1739, "heightMm": 1643 },
  "renault-kwid": { "lengthMm": 3731, "widthMm": 1579, "heightMm": 1490 },
  "nissan-x-trail": { "lengthMm": 4680, "widthMm": 1840, "heightMm": 1725 },
  "mg-comet": { "lengthMm": 2974, "widthMm": 1505, "heightMm": 1640 },
  "skoda-superb": { "lengthMm": 4869, "widthMm": 1864, "heightMm": 1469 },
  "skoda-octavia": { "lengthMm": 4689, "widthMm": 1829, "heightMm": 1469 },
  "vw-tiguan": { "lengthMm": 4509, "widthMm": 1839, "heightMm": 1665 },
  "jeep-wrangler": { "lengthMm": 4882, "widthMm": 1894, "heightMm": 1848 },
  "byd-m6": { "lengthMm": 4710, "widthMm": 1810, "heightMm": 1690 },
  "bmw-3-series": { "lengthMm": 4823, "widthMm": 1827, "heightMm": 1441 },
  "mercedes-c-class": { "lengthMm": 4751, "widthMm": 1820, "heightMm": 1438 },
  "volvo-xc40-recharge": { "lengthMm": 4440, "widthMm": 1863, "heightMm": 1647 }
};

for (const [mid, dim] of Object.entries(NEW_DIMENSIONS)) {
  if (!dimensions[mid]) {
    dimensions[mid] = dim;
    console.log(`Added dimensions for: ${mid}`);
  }
}

// ---- 8. Add DNA to vehicle-dna.json ----
const NEW_DNAS = {
  "maruti-wagonr": {
    "archetype": "compact-hatch",
    "signatureElements": ["connected-drl", "boxy-profile"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 14,
    "proportions": { "boxiness": 0.5, "shoulderWidth": 0.9, "rideHeight": 0.95 }
  },
  "maruti-alto-k10": {
    "archetype": "compact-hatch",
    "signatureElements": ["connected-drl"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 13,
    "proportions": { "boxiness": 0.15, "shoulderWidth": 0.82, "rideHeight": 0.88 }
  },
  "hyundai-i10-nios": {
    "archetype": "compact-hatch",
    "signatureElements": ["parametric-grille", "split-headlamp"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 15,
    "proportions": { "boxiness": 0.12, "shoulderWidth": 0.92, "rideHeight": 0.88 }
  },
  "tata-tiago": {
    "archetype": "compact-hatch",
    "signatureElements": ["connected-drl"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 15,
    "proportions": { "boxiness": 0.15, "shoulderWidth": 0.92, "rideHeight": 0.9 }
  },
  "tata-tigor": {
    "archetype": "compact-sedan",
    "signatureElements": ["connected-drl"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 15,
    "proportions": { "boxiness": 0.12, "shoulderWidth": 0.92, "rideHeight": 0.9 }
  },
  "mahindra-bolero-neo": {
    "archetype": "offroad-box",
    "signatureElements": ["boxy-profile", "vertical-slat-grille"],
    "environment": "mountain-trail",
    "cameraPreset": "offroad-hero",
    "wheelInches": 15,
    "proportions": { "boxiness": 0.9, "shoulderWidth": 0.96, "rideHeight": 1.15 }
  },
  "kia-ev6": {
    "archetype": "ev-crossover",
    "signatureElements": ["tiger-nose-grille", "star-map-drl", "floating-roof", "flush-handles"],
    "environment": "futuristic-night",
    "cameraPreset": "ev-future",
    "wheelInches": 19,
    "proportions": { "boxiness": 0.1, "shoulderWidth": 1.05, "rideHeight": 0.95 }
  },
  "toyota-hilux": {
    "archetype": "midsize-suv",
    "signatureElements": ["boxy-profile", "muscle-shoulders", "vertical-slat-grille"],
    "environment": "mountain-trail",
    "cameraPreset": "offroad-hero",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.45, "shoulderWidth": 1.05, "rideHeight": 1.18 }
  },
  "renault-triber": {
    "archetype": "sub-4m-suv",
    "signatureElements": ["connected-drl"],
    "environment": "urban-family",
    "cameraPreset": "family-suv",
    "wheelInches": 15,
    "proportions": { "boxiness": 0.28, "shoulderWidth": 0.94, "rideHeight": 1.0 }
  },
  "renault-kwid": {
    "archetype": "compact-hatch",
    "signatureElements": ["connected-drl", "split-headlamp"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 14,
    "proportions": { "boxiness": 0.22, "shoulderWidth": 0.88, "rideHeight": 0.92 }
  },
  "nissan-x-trail": {
    "archetype": "premium-suv",
    "signatureElements": ["split-headlamp", "muscle-shoulders", "vertical-slat-grille"],
    "environment": "highway",
    "cameraPreset": "family-suv",
    "wheelInches": 20,
    "proportions": { "boxiness": 0.3, "shoulderWidth": 1.02, "rideHeight": 1.06 }
  },
  "mg-comet": {
    "archetype": "compact-hatch",
    "signatureElements": ["connected-drl", "boxy-profile"],
    "environment": "city",
    "cameraPreset": "sport-sedan",
    "wheelInches": 12,
    "proportions": { "boxiness": 0.85, "shoulderWidth": 0.84, "rideHeight": 0.9 }
  },
  "skoda-superb": {
    "archetype": "midsize-sedan",
    "signatureElements": ["fastback-sedan", "parametric-grille"],
    "environment": "expressway",
    "cameraPreset": "luxury-turntable",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.08, "shoulderWidth": 1.05, "rideHeight": 0.86 }
  },
  "skoda-octavia": {
    "archetype": "midsize-sedan",
    "signatureElements": ["fastback-sedan", "parametric-grille"],
    "environment": "expressway",
    "cameraPreset": "sport-sedan",
    "wheelInches": 17,
    "proportions": { "boxiness": 0.08, "shoulderWidth": 1.02, "rideHeight": 0.88 }
  },
  "vw-tiguan": {
    "archetype": "premium-suv",
    "signatureElements": ["vertical-slat-grille", "muscle-shoulders"],
    "environment": "expressway",
    "cameraPreset": "luxury-turntable",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.32, "shoulderWidth": 1.03, "rideHeight": 1.04 }
  },
  "jeep-wrangler": {
    "archetype": "offroad-box",
    "signatureElements": ["boxy-profile", "vertical-slat-grille", "round-headlamps"],
    "environment": "mountain-trail",
    "cameraPreset": "offroad-hero",
    "wheelInches": 17,
    "proportions": { "boxiness": 1.0, "shoulderWidth": 1.08, "rideHeight": 1.25 }
  },
  "byd-m6": {
    "archetype": "ev-crossover",
    "signatureElements": ["connected-drl", "floating-roof", "flush-handles"],
    "environment": "urban-family",
    "cameraPreset": "family-suv",
    "wheelInches": 17,
    "proportions": { "boxiness": 0.2, "shoulderWidth": 1.02, "rideHeight": 0.98 }
  },
  "bmw-3-series": {
    "archetype": "midsize-sedan",
    "signatureElements": ["connected-drl", "fastback-sedan", "muscle-shoulders"],
    "environment": "expressway",
    "cameraPreset": "sport-sedan",
    "wheelInches": 18,
    "proportions": { "boxiness": 0.05, "shoulderWidth": 1.02, "rideHeight": 0.86 }
  },
  "mercedes-c-class": {
    "archetype": "midsize-sedan",
    "signatureElements": ["fastback-sedan", "split-headlamp", "flush-handles"],
    "environment": "expressway",
    "cameraPreset": "luxury-turntable",
    "wheelInches": 17,
    "proportions": { "boxiness": 0.05, "shoulderWidth": 1.02, "rideHeight": 0.86 }
  },
  "volvo-xc40-recharge": {
    "archetype": "ev-crossover",
    "signatureElements": ["connected-drl", "boxy-profile", "roof-rails"],
    "environment": "futuristic-night",
    "cameraPreset": "ev-future",
    "wheelInches": 19,
    "proportions": { "boxiness": 0.4, "shoulderWidth": 1.05, "rideHeight": 1.02 }
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
