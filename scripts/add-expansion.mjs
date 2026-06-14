// One-shot expansion: Renault + Nissan brands, 15 new models across 3 segments,
// variants generated from tier presets. Idempotent (skips existing ids). Shiva audits values.
import { readFileSync, writeFileSync } from "node:fs";

const brands = JSON.parse(readFileSync("data/brands.json", "utf8"));
const models = JSON.parse(readFileSync("data/models.json", "utf8"));
const variants = JSON.parse(readFileSync("data/variants.json", "utf8"));

for (const b of [
  { id: "renault", name: "Renault", country: "France", color: "#F7C600" },
  { id: "nissan", name: "Nissan", country: "Japan", color: "#C3002F" },
]) {
  if (!brands.some((x) => x.id === b.id)) brands.push(b);
}

// ---- feature tier presets (cumulative) ----
const BASE = ["airbags-6", "abs-ebd", "esc", "isofix", "hill-hold", "rear-defogger", "led-drl", "rear-camera"];
const MID = [...BASE, "touchscreen-8", "wireless-carplay", "auto-ac", "keyless-entry", "cruise-control", "alloy-16", "rear-ac-vents"];
const HIGH = [...MID.filter((f) => f !== "touchscreen-8" && f !== "alloy-16"), "touchscreen-10", "alloy-17", "auto-headlamps", "sunroof", "tpms", "connected-car", "wireless-charger", "digital-cluster", "auto-wipers", "leatherette-seats", "auto-dimming-irvm"];
const TOP = [...HIGH, "camera-360", "ventilated-seats", "powered-driver-seat", "premium-audio", "front-parking-sensors", "blind-spot"];
const ADAS = ["adas-l2", "aeb", "lane-keep", "adaptive-cruise"];
const TIERS = { base: BASE, mid: MID, high: HIGH, top: TOP };

const M = (id, brandId, name, segment, bodyStyle, min, max, ncap, boot, wb, aiSummary, pros, cons) => ({
  id, brandId, name, segment, bodyStyle,
  priceRange: { min, max },
  heroImage: `/images/cars/${id}.jpg`,
  aiSummary,
  ncap: ncap ? { agency: ncap[0], adultStars: ncap[1], childStars: ncap[2] } : { agency: null, adultStars: null, childStars: null },
  prosCons: { pros, cons },
  dimensions: { bootLitres: boot, wheelbaseMm: wb },
});

const NEW_MODELS = [
  // ---------- sub-4m SUVs ----------
  M("tata-nexon", "tata", "Nexon", "sub-4m-suv", "suv", 800000, 1550000, ["BNCAP", 5, 5], 382, 2498,
    "India's first 5-star crash-test SUV keeps its safety crown post-facelift, with a punchy 1.2 turbo and a frugal 1.5 diesel. The cabin tech leapt a generation in 2023.",
    ["5-star BNCAP with consistent crash record", "Petrol, diesel and EV sibling to choose from", "Strong value through the range"],
    ["Turbo-petrol is vocal when pushed", "DCA gearbox can hesitate in traffic", "Rear seat tighter than Punch's upright package"]),
  M("maruti-brezza", "maruti", "Brezza", "sub-4m-suv", "suv", 834000, 1410000, ["GNCAP", 4, 3], 328, 2500,
    "The Brezza trades outright pace for bulletproof running costs and the segment's best resale. The 1.5 NA petrol with the torque-converter auto is the relaxed pick.",
    ["Lowest running costs in class", "Smooth 6AT with paddle shifters", "Maruti service network everywhere"],
    ["Modest 103 PS performance", "No turbo or diesel option", "Boot smaller than rivals"]),
  M("hyundai-venue", "hyundai", "Venue", "sub-4m-suv", "suv", 794000, 1350000, ["GNCAP", 4, 3], 350, 2500,
    "The Venue packs three engines and big-car features into a city-friendly footprint. The 1.0 turbo DCT is the sweet spot; the diesel is the segment's quiet overachiever.",
    ["Three engine choices incl. diesel", "Feature list mirrors the Creta playbook", "Light controls, easy city car"],
    ["1.2 base petrol feels strained", "Rear seat width is tight", "Top trims overlap Creta pricing"]),
  M("kia-sonet", "kia", "Sonet", "sub-4m-suv", "suv", 800000, 1600000, [null, null, null], 385, 2500,
    "The Sonet is the Venue's flashier twin: same engines, sharper styling, bigger boot and more kit at the top end, including ventilated seats and a 360° camera.",
    ["Segment-best 385L boot", "Diesel AT is unique at this size", "Loaded top trims"],
    ["Firm low-speed ride", "Gets pricey fully loaded", "Rear bench better for two"]),
  M("tata-punch", "tata", "Punch", "sub-4m-suv", "suv", 613000, 1030000, ["GNCAP", 5, 4], 366, 2445,
    "A micro-SUV with a 5-star GNCAP score and genuine ground clearance, the Punch is the budget pick that doesn't feel like one. Just don't expect pace from the 88 PS 1.2.",
    ["5-star GNCAP at hatchback money", "Upright, commanding driving position", "Excellent bad-road ability"],
    ["88 PS means leisurely highway pace", "No turbo or diesel", "AMT can be jerky"]),
  M("renault-kiger", "renault", "Kiger", "sub-4m-suv", "suv", 600000, 1130000, ["GNCAP", 4, 2], 405, 2500,
    "The Kiger undercuts every rival while offering a willing 1.0 turbo and a 405L boot. Cabin plastics and refinement show where the money was saved.",
    ["Sharpest pricing in segment", "Big 405L boot", "Eager 1.0 turbo with CVT option"],
    ["Budget-grade cabin materials", "Three-cylinder thrum ever-present", "Thin dealer network"]),
  M("nissan-magnite", "nissan", "Magnite", "sub-4m-suv", "suv", 600000, 1140000, ["GNCAP", 4, 2], 336, 2500,
    "The Magnite is the Kiger's platform twin with bolder styling and similar value-first pricing. The turbo CVT combination is genuinely pleasant in town.",
    ["Aggressive pricing", "Smooth turbo-CVT pairing", "Distinctive styling for the money"],
    ["Interior plastics feel built to price", "Smallest boot of the twins", "Sparse service network"]),
  // ---------- midsize sedans ----------
  M("honda-city", "honda", "City", "midsize-sedan", "sedan", 1190000, 1640000, ["GNCAP", 4, 4], 506, 2600,
    "Three decades of refinement show: the City's 1.5 i-VTEC, huge rear seat and Honda Sensing ADAS make it the default sensible sedan. It rewards smooth drivers, not racers.",
    ["Benchmark rear-seat space and comfort", "Refined, rev-happy 1.5 petrol", "ADAS standard from mid trims"],
    ["No turbo or diesel option", "Road noise at highway speeds", "CVT drones when hustled"]),
  M("hyundai-verna", "hyundai", "Verna", "midsize-sedan", "sedan", 1100000, 1750000, ["GNCAP", 5, 5], 528, 2670,
    "The Verna pairs segment-best space with a genuinely quick 160 PS turbo and a 5-star GNCAP score. The polarising styling is the only gamble.",
    ["5-star GNCAP adult and child", "160 PS turbo is properly quick", "Longest wheelbase, biggest boot"],
    ["Love-or-hate styling", "NA petrol is just adequate", "Firm rear seat cushioning"]),
  M("vw-virtus", "volkswagen", "Virtus", "midsize-sedan", "sedan", 1150000, 1940000, ["GNCAP", 5, 5], 521, 2651,
    "The Virtus is the Taigun in a sharper suit: the same excellent TSIs, 5-star rating and balanced chassis with a proper 521L boot. The GT 1.5 DSG is a junior sports sedan.",
    ["5-star GNCAP rating", "1.5 TSI GT is the enthusiast bargain", "Composed high-speed manners"],
    ["Costlier servicing than Japanese rivals", "Rear seat under thigh support is average", "Feature list trails Koreans"]),
  M("skoda-slavia", "skoda", "Slavia", "midsize-sedan", "sedan", 1140000, 1910000, ["GNCAP", 5, 5], 521, 2651,
    "The Slavia mirrors the Virtus mechanically, trading a little flash for Skoda's slightly plusher cabin trim. Same 5 stars, same brilliant 1.5 TSI at the top.",
    ["5-star GNCAP rating", "Strong TSI engines", "Big boot and usable rear seat"],
    ["Three-cylinder idle thrum on 1.0", "Service network still growing", "Options pricing adds up"]),
  // ---------- bigger SUVs ----------
  M("mahindra-scorpio-n", "mahindra", "Scorpio-N", "midsize-suv", "suv", 1360000, 2450000, ["GNCAP", 5, 3], 460, 2750,
    "Body-on-frame presence with surprisingly sorted road manners, the Scorpio-N's 2.2 diesel and optional 4XPLOR 4WD make it the ladder-frame default. It is big, heavy and proud of it.",
    ["Imposing road presence and torque-rich diesel", "Optional genuine 4WD", "5-star GNCAP adult score"],
    ["Heavy steering and bulk in the city", "Third row is for occasional use", "Petrol is thirsty"]),
  M("mahindra-xuv700", "mahindra", "XUV700", "midsize-suv", "suv", 1400000, 2500000, ["GNCAP", 5, 4], 408, 2750,
    "The XUV700 brought ADAS and 200 PS to the mainstream. Monocoque comfort, seven seats and a muscular 2.2 diesel make it the do-everything family flagship.",
    ["200 PS petrol / 185 PS diesel muscle", "Full Level-2 ADAS on top trims", "Genuine 7-seat practicality"],
    ["Long waiting periods persist", "Some cabin rattles reported", "Boot small with third row up"]),
  M("tata-harrier", "tata", "Harrier", "midsize-suv", "suv", 1500000, 2600000, ["BNCAP", 5, 5], 445, 2741,
    "Land Rover-derived bones give the Harrier its planted feel; the facelift added a 5-star BNCAP score and big-screen tech. Diesel-only remains its defining choice.",
    ["5-star BNCAP adult and child", "Settled, big-car highway ride", "Striking design inside and out"],
    ["No petrol option at all", "Kryotec diesel is gruff at idle", "Patchy quality control history"]),
  M("mg-hector", "mg", "Hector", "midsize-suv", "suv", 1400000, 2300000, [null, null, null], 587, 2750,
    "The Hector sells space and screens per rupee: a limo-like rear seat, 587L boot and a 14-inch display define it. Dynamics are soft and unhurried by design.",
    ["Cavernous cabin and 587L boot", "Big feature list incl. ADAS", "Comfort-first ride"],
    ["Soft, roly-poly handling", "Petrol-CVT is merely adequate", "Weak resale retention"]),
];

// ---- variants: [id, modelId, name, fuel, trans, price, [cc,ps,nm,cyl,turbo], araiFE, kerb, tier, extras]
const V = [
  // Nexon
  ["nexon-smart-mt", "tata-nexon", "Smart 1.2T", "petrol", "MT", 800000, [1199, 120, 170, 3, true], 17.4, 1250, "base", []],
  ["nexon-pure-mt", "tata-nexon", "Pure 1.2T", "petrol", "MT", 950000, [1199, 120, 170, 3, true], 17.4, 1255, "mid", []],
  ["nexon-creative-mt", "tata-nexon", "Creative 1.2T", "petrol", "MT", 1150000, [1199, 120, 170, 3, true], 17.4, 1260, "high", ["air-purifier"]],
  ["nexon-creative-amt", "tata-nexon", "Creative 1.2T AMT", "petrol", "AMT", 1215000, [1199, 120, 170, 3, true], 17.2, 1270, "high", ["air-purifier"]],
  ["nexon-fearless-dct", "tata-nexon", "Fearless 1.2T DCT", "petrol", "DCT", 1450000, [1199, 120, 170, 3, true], 17.0, 1285, "top", ["air-purifier"]],
  ["nexon-pure-diesel-mt", "tata-nexon", "Pure 1.5D", "diesel", "MT", 1100000, [1497, 115, 260, 4, true], 23.2, 1350, "mid", []],
  ["nexon-creative-diesel-mt", "tata-nexon", "Creative 1.5D", "diesel", "MT", 1300000, [1497, 115, 260, 4, true], 23.2, 1355, "high", []],
  ["nexon-fearless-diesel-amt", "tata-nexon", "Fearless 1.5D AMT", "diesel", "AMT", 1550000, [1497, 115, 260, 4, true], 22.8, 1370, "top", []],
  // Brezza
  ["brezza-lxi-mt", "maruti-brezza", "LXi", "petrol", "MT", 834000, [1462, 103, 137, 4, false], 17.4, 1130, "base", []],
  ["brezza-vxi-mt", "maruti-brezza", "VXi", "petrol", "MT", 990000, [1462, 103, 137, 4, false], 17.4, 1140, "mid", []],
  ["brezza-zxi-mt", "maruti-brezza", "ZXi", "petrol", "MT", 1120000, [1462, 103, 137, 4, false], 17.4, 1150, "high", []],
  ["brezza-zxi-at", "maruti-brezza", "ZXi AT", "petrol", "AT", 1250000, [1462, 103, 137, 4, false], 19.0, 1170, "high", ["paddle-shifters"]],
  ["brezza-zxi-plus-mt", "maruti-brezza", "ZXi+", "petrol", "MT", 1300000, [1462, 103, 137, 4, false], 17.4, 1155, "top", []],
  ["brezza-zxi-plus-at", "maruti-brezza", "ZXi+ AT", "petrol", "AT", 1410000, [1462, 103, 137, 4, false], 19.0, 1185, "top", ["paddle-shifters"]],
  // Venue
  ["venue-e-mt", "hyundai-venue", "E 1.2", "petrol", "MT", 794000, [1197, 83, 114, 4, false], 17.0, 1100, "base", []],
  ["venue-s-mt", "hyundai-venue", "S 1.2", "petrol", "MT", 900000, [1197, 83, 114, 4, false], 17.0, 1110, "mid", []],
  ["venue-sx-turbo-mt", "hyundai-venue", "SX 1.0 Turbo", "petrol", "MT", 1150000, [998, 120, 172, 3, true], 18.1, 1170, "high", []],
  ["venue-sx-turbo-dct", "hyundai-venue", "SX 1.0 Turbo DCT", "petrol", "DCT", 1280000, [998, 120, 172, 3, true], 18.2, 1190, "high", ["paddle-shifters"]],
  ["venue-sx-o-turbo-dct", "hyundai-venue", "SX(O) 1.0 Turbo DCT", "petrol", "DCT", 1350000, [998, 120, 172, 3, true], 18.2, 1195, "top", ["paddle-shifters"]],
  ["venue-sx-diesel-mt", "hyundai-venue", "SX 1.5D", "diesel", "MT", 1250000, [1493, 116, 250, 4, true], 23.7, 1250, "high", []],
  // Sonet
  ["sonet-htk-mt", "kia-sonet", "HTK 1.2", "petrol", "MT", 800000, [1197, 83, 114, 4, false], 18.2, 1105, "base", []],
  ["sonet-htk-plus-mt", "kia-sonet", "HTK+ 1.2", "petrol", "MT", 950000, [1197, 83, 114, 4, false], 18.2, 1115, "mid", []],
  ["sonet-htx-turbo-dct", "kia-sonet", "HTX 1.0 Turbo DCT", "petrol", "DCT", 1300000, [998, 120, 172, 3, true], 18.7, 1190, "high", ["paddle-shifters"]],
  ["sonet-gtx-plus-turbo-dct", "kia-sonet", "GTX+ 1.0 Turbo DCT", "petrol", "DCT", 1580000, [998, 120, 172, 3, true], 18.7, 1200, "top", ["paddle-shifters", "aeb"]],
  ["sonet-htx-diesel-mt", "kia-sonet", "HTX 1.5D", "diesel", "MT", 1250000, [1493, 116, 250, 4, true], 24.1, 1255, "high", []],
  ["sonet-gtx-plus-diesel-at", "kia-sonet", "GTX+ 1.5D AT", "diesel", "AT", 1600000, [1493, 116, 250, 4, true], 18.6, 1265, "top", ["paddle-shifters", "aeb"]],
  // Punch
  ["punch-pure-mt", "tata-punch", "Pure", "petrol", "MT", 613000, [1199, 88, 115, 3, false], 18.8, 1030, "base", []],
  ["punch-adventure-mt", "tata-punch", "Adventure", "petrol", "MT", 750000, [1199, 88, 115, 3, false], 18.8, 1035, "mid", []],
  ["punch-accomplished-mt", "tata-punch", "Accomplished", "petrol", "MT", 900000, [1199, 88, 115, 3, false], 18.8, 1040, "high", []],
  ["punch-creative-amt", "tata-punch", "Creative AMT", "petrol", "AMT", 1030000, [1199, 88, 115, 3, false], 18.8, 1050, "high", []],
  // Kiger
  ["kiger-rxe-mt", "renault-kiger", "RXE 1.0", "petrol", "MT", 600000, [999, 72, 96, 3, false], 19.2, 1012, "base", []],
  ["kiger-rxt-mt", "renault-kiger", "RXT 1.0", "petrol", "MT", 750000, [999, 72, 96, 3, false], 19.2, 1020, "mid", []],
  ["kiger-rxz-turbo-mt", "renault-kiger", "RXZ 1.0 Turbo", "petrol", "MT", 1000000, [999, 100, 160, 3, true], 20.0, 1073, "high", []],
  ["kiger-rxz-turbo-cvt", "renault-kiger", "RXZ 1.0 Turbo CVT", "petrol", "CVT", 1130000, [999, 100, 160, 3, true], 19.3, 1095, "high", []],
  // Magnite
  ["magnite-xe-mt", "nissan-magnite", "XE 1.0", "petrol", "MT", 600000, [999, 72, 96, 3, false], 19.4, 1014, "base", []],
  ["magnite-xl-mt", "nissan-magnite", "XL 1.0", "petrol", "MT", 760000, [999, 72, 96, 3, false], 19.4, 1022, "mid", []],
  ["magnite-xv-premium-turbo-mt", "nissan-magnite", "XV Premium 1.0 Turbo", "petrol", "MT", 1010000, [999, 100, 160, 3, true], 19.4, 1075, "high", []],
  ["magnite-xv-premium-turbo-cvt", "nissan-magnite", "XV Premium 1.0 Turbo CVT", "petrol", "CVT", 1140000, [999, 100, 160, 3, true], 17.7, 1097, "high", []],
  // City
  ["city-sv-mt", "honda-city", "SV", "petrol", "MT", 1190000, [1498, 121, 145, 4, false], 17.8, 1153, "mid", []],
  ["city-v-mt", "honda-city", "V", "petrol", "MT", 1280000, [1498, 121, 145, 4, false], 17.8, 1160, "high", []],
  ["city-vx-cvt", "honda-city", "VX CVT", "petrol", "CVT", 1450000, [1498, 121, 145, 4, false], 18.4, 1180, "high", ["paddle-shifters", ...ADAS]],
  ["city-zx-cvt", "honda-city", "ZX CVT", "petrol", "CVT", 1640000, [1498, 121, 145, 4, false], 18.4, 1192, "top", ["paddle-shifters", ...ADAS]],
  // Verna
  ["verna-ex-mt", "hyundai-verna", "EX 1.5", "petrol", "MT", 1100000, [1497, 115, 144, 4, false], 18.6, 1160, "mid", []],
  ["verna-sx-mt", "hyundai-verna", "SX 1.5", "petrol", "MT", 1350000, [1497, 115, 144, 4, false], 18.6, 1170, "high", []],
  ["verna-sx-o-ivt", "hyundai-verna", "SX(O) 1.5 IVT", "petrol", "CVT", 1620000, [1497, 115, 144, 4, false], 19.6, 1195, "top", [...ADAS]],
  ["verna-sx-o-turbo-dct", "hyundai-verna", "SX(O) 1.5 Turbo DCT", "petrol", "DCT", 1750000, [1482, 160, 253, 4, true], 20.6, 1250, "top", ["paddle-shifters", "drive-modes", ...ADAS]],
  // Virtus
  ["virtus-comfortline-mt", "vw-virtus", "Comfortline 1.0 TSI", "petrol", "MT", 1150000, [999, 115, 178, 3, true], 19.4, 1167, "mid", []],
  ["virtus-highline-mt", "vw-virtus", "Highline 1.0 TSI", "petrol", "MT", 1300000, [999, 115, 178, 3, true], 19.4, 1175, "high", []],
  ["virtus-highline-at", "vw-virtus", "Highline 1.0 TSI AT", "petrol", "AT", 1420000, [999, 115, 178, 3, true], 18.1, 1195, "high", []],
  ["virtus-topline-at", "vw-virtus", "Topline 1.0 TSI AT", "petrol", "AT", 1600000, [999, 115, 178, 3, true], 18.1, 1200, "top", []],
  ["virtus-gt-plus-dsg", "vw-virtus", "GT Plus 1.5 TSI DSG", "petrol", "DCT", 1940000, [1498, 150, 250, 4, true], 18.7, 1260, "top", ["paddle-shifters", "drive-modes", "all-disc-brakes"]],
  // Slavia
  ["slavia-ambition-mt", "skoda-slavia", "Ambition 1.0 TSI", "petrol", "MT", 1140000, [999, 115, 178, 3, true], 19.5, 1170, "mid", []],
  ["slavia-style-mt", "skoda-slavia", "Style 1.0 TSI", "petrol", "MT", 1300000, [999, 115, 178, 3, true], 19.5, 1178, "high", []],
  ["slavia-style-at", "skoda-slavia", "Style 1.0 TSI AT", "petrol", "AT", 1420000, [999, 115, 178, 3, true], 18.2, 1198, "high", []],
  ["slavia-monte-carlo-dsg", "skoda-slavia", "Monte Carlo 1.5 TSI DSG", "petrol", "DCT", 1910000, [1498, 150, 250, 4, true], 18.7, 1262, "top", ["paddle-shifters", "drive-modes", "all-disc-brakes"]],
  // Scorpio-N
  ["scorpion-z2-petrol-mt", "mahindra-scorpio-n", "Z2 2.0T", "petrol", "MT", 1360000, [1997, 203, 370, 4, true], 13.0, 1850, "mid", []],
  ["scorpion-z4-petrol-mt", "mahindra-scorpio-n", "Z4 2.0T", "petrol", "MT", 1560000, [1997, 203, 370, 4, true], 13.0, 1860, "high", ["third-row"]],
  ["scorpion-z8-petrol-at", "mahindra-scorpio-n", "Z8 2.0T AT", "petrol", "AT", 1950000, [1997, 203, 370, 4, true], 12.5, 1900, "high", ["third-row"]],
  ["scorpion-z8l-petrol-at", "mahindra-scorpio-n", "Z8L 2.0T AT", "petrol", "AT", 2200000, [1997, 203, 370, 4, true], 12.5, 1910, "top", ["third-row"]],
  ["scorpion-z4-diesel-mt", "mahindra-scorpio-n", "Z4 2.2D", "diesel", "MT", 1660000, [2184, 175, 400, 4, true], 15.4, 1900, "high", ["third-row"]],
  ["scorpion-z8l-diesel-at-4wd", "mahindra-scorpio-n", "Z8L 2.2D AT 4WD", "diesel", "AT", 2450000, [2184, 175, 400, 4, true], 14.8, 1950, "top", ["third-row", "awd-4wd"]],
  // XUV700
  ["xuv700-mx-petrol-mt", "mahindra-xuv700", "MX 2.0T", "petrol", "MT", 1400000, [1997, 200, 380, 4, true], 13.0, 1750, "mid", []],
  ["xuv700-ax5-petrol-mt", "mahindra-xuv700", "AX5 2.0T", "petrol", "MT", 1700000, [1997, 200, 380, 4, true], 13.0, 1760, "high", ["third-row"]],
  ["xuv700-ax7-petrol-at", "mahindra-xuv700", "AX7 2.0T AT", "petrol", "AT", 2150000, [1997, 200, 380, 4, true], 12.6, 1800, "top", ["third-row", "pano-sunroof", ...ADAS]],
  ["xuv700-ax7l-petrol-at", "mahindra-xuv700", "AX7L 2.0T AT", "petrol", "AT", 2400000, [1997, 200, 380, 4, true], 12.6, 1810, "top", ["third-row", "pano-sunroof", "powered-tailgate", ...ADAS]],
  ["xuv700-ax5-diesel-mt", "mahindra-xuv700", "AX5 2.2D", "diesel", "MT", 1800000, [2184, 185, 450, 4, true], 16.0, 1810, "high", ["third-row"]],
  ["xuv700-ax7l-diesel-at", "mahindra-xuv700", "AX7L 2.2D AT", "diesel", "AT", 2500000, [2184, 185, 450, 4, true], 15.5, 1850, "top", ["third-row", "pano-sunroof", "powered-tailgate", ...ADAS]],
  // Harrier (diesel only)
  ["harrier-smart-diesel-mt", "tata-harrier", "Smart 2.0D", "diesel", "MT", 1500000, [1956, 170, 350, 4, true], 16.8, 1700, "mid", []],
  ["harrier-pure-diesel-mt", "tata-harrier", "Pure 2.0D", "diesel", "MT", 1700000, [1956, 170, 350, 4, true], 16.8, 1705, "high", ["air-purifier"]],
  ["harrier-fearless-diesel-at", "tata-harrier", "Fearless 2.0D AT", "diesel", "AT", 2300000, [1956, 170, 350, 4, true], 14.6, 1745, "top", ["pano-sunroof", "air-purifier", "paddle-shifters", "drive-modes", ...ADAS]],
  ["harrier-accomplished-diesel-at", "tata-harrier", "Accomplished 2.0D AT", "diesel", "AT", 2600000, [1956, 170, 350, 4, true], 14.6, 1750, "top", ["pano-sunroof", "air-purifier", "paddle-shifters", "drive-modes", "powered-tailgate", ...ADAS]],
  // Hector
  ["hector-style-petrol-mt", "mg-hector", "Style 1.5T", "petrol", "MT", 1400000, [1451, 143, 250, 4, true], 14.2, 1550, "mid", []],
  ["hector-smart-petrol-cvt", "mg-hector", "Smart 1.5T CVT", "petrol", "CVT", 1750000, [1451, 143, 250, 4, true], 13.7, 1580, "high", ["pano-sunroof"]],
  ["hector-sharp-pro-petrol-cvt", "mg-hector", "Sharp Pro 1.5T CVT", "petrol", "CVT", 2050000, [1451, 143, 250, 4, true], 13.7, 1590, "top", ["pano-sunroof", "powered-tailgate", ...ADAS]],
  ["hector-smart-diesel-mt", "mg-hector", "Smart 2.0D", "diesel", "MT", 1850000, [1956, 170, 350, 4, true], 16.4, 1640, "high", ["pano-sunroof"]],
  ["hector-sharp-pro-diesel-mt", "mg-hector", "Sharp Pro 2.0D", "diesel", "MT", 2300000, [1956, 170, 350, 4, true], 16.4, 1650, "top", ["pano-sunroof", "powered-tailgate", ...ADAS]],
];

let addedM = 0, addedV = 0;
for (const m of NEW_MODELS) {
  if (!models.some((x) => x.id === m.id)) { models.push(m); addedM++; }
}
const rw = (arai) => Math.round(arai * 0.72 * 10) / 10;
for (const [id, modelId, name, fuel, transmission, price, [cc, ps, nm, cylinders, turbo], fe, kerb, tier, extras] of V) {
  if (variants.some((x) => x.id === id)) continue;
  variants.push({
    id, modelId, name, fuel, transmission,
    priceExShowroom: price,
    engine: { cc, ps, nm, cylinders, turbo },
    claimedFE: fe,
    realWorldFE: rw(fe),
    kerbWeight: kerb,
    featureIds: [...new Set([...TIERS[tier], ...extras])],
  });
  addedV++;
}

writeFileSync("data/brands.json", JSON.stringify(brands, null, 2) + "\n");
writeFileSync("data/models.json", JSON.stringify(models, null, 2) + "\n");
writeFileSync("data/variants.json", JSON.stringify(variants, null, 2) + "\n");
console.log(`brands: ${brands.length}, +${addedM} models (${models.length}), +${addedV} variants (${variants.length})`);
