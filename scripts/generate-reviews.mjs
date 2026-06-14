import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Load models and variants to know exactly what exists
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
  "2 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago",
  "2 months ago", "3 months ago", "4 months ago", "5 months ago", "6 months ago",
  "8 months ago", "10 months ago", "1 year ago", "1.5 years ago", "2 years ago"
];

// Seeded random number generator for deterministic results
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

for (const m of models) {
  const rand = createRandom(m.id);
  const modelId = m.id;
  const brandName = m.brandId.charAt(0).toUpperCase() + m.brandId.slice(1);
  const modelName = m.name;
  const fullName = `${brandName} ${modelName}`;

  // Get unique fuels and transmissions for this model from variants
  const modelVariants = variants.filter(v => v.modelId === modelId);
  const uniqueFuels = Array.from(new Set(modelVariants.map(v => v.fuel)));
  const uniqueTransmissions = Array.from(new Set(modelVariants.map(v => v.transmission)));

  const totalReviews = 40 + Math.floor(rand() * 11); // 40 to 50 reviews

  for (let i = 0; i < totalReviews; i++) {
    const source = SOURCES[Math.floor(rand() * SOURCES.length)];
    const username = USERNAMES[(Math.floor(rand() * USERNAMES.length) + i) % USERNAMES.length];
    const fuel = uniqueFuels[Math.floor(rand() * uniqueFuels.length)] || "petrol";
    const transmission = uniqueTransmissions[Math.floor(rand() * uniqueTransmissions.length)] || "MT";
    const date = DATES[Math.floor(rand() * DATES.length)];
    const upvotes = source === "Reddit"
      ? Math.floor(rand() * 320) + 5
      : source === "Team-BHP"
      ? Math.floor(rand() * 45) + 2
      : Math.floor(rand() * 15) + 1;

    let sentiment = "positive";
    const rVal = rand();
    if (rVal < 0.25) sentiment = "negative";
    else if (rVal < 0.45) sentiment = "mixed";

    let rating = 5;
    if (sentiment === "negative") rating = Math.floor(rand() * 2) + 1; // 1 or 2 stars
    else if (sentiment === "mixed") rating = 3; // 3 stars
    else rating = Math.floor(rand() * 2) + 4; // 4 or 5 stars

    // Generate realistic comment text
    let text = "";
    if (fuel === "ev") {
      const evPositive = [
        `Switched from a petrol car to this ${fullName} EV and the running cost is dirt cheap. I pay around ₹1.5 per km charging at home. Acceleration in sport mode is absolute madness, leaves traffic behind instantly.`,
        `The refinement is on another level. Zero noise, zero vibration. The single pedal drive works great in city traffic. On the highway, I get a solid 370km range with the larger battery pack.`,
        `Excellent urban commuter. The silent cabin, quick torque off the line, and cheap charging make it the perfect daily. DC fast charging at 50kW takes less than an hour to reach 80%.`,
        `Really happy with the cabin insulation. The EV powertrain makes the drive so relaxing. Adaptive regen is brilliant and helps squeeze out extra mileage in stop-go traffic.`,
        `The range prediction is very accurate. Took the ${modelName} EV for a 300km trip, started with 100% and reached with 18% left, cruising at 90 km/h with AC on.`
      ];
      const evNegative = [
        `The highway range on the ${fullName} EV drops drastically if you cross 90 km/h. Barely got 240km on my last expressway run. Public charging infrastructure is still a massive headache.`,
        `Had a major electrical glitch last week where the car refused to shift into Drive. Service center took three days just to run diagnostics. Tata/MG software is still super buggy.`,
        `Suspension feels too stiff due to the heavy battery pack weight. Speed bumps and sharp potholes crash directly into the cabin. It lacks the plushness of the petrol version.`,
        `The battery cooling fan is very loud when DC fast charging, and the charging port flap feels cheap and flimsy. Disappointed with the quality control at this price point.`
      ];
      const evMixed = [
        `The torque is fun and silent, but the rear seat floor is raised because of the battery pack, which compromises under-thigh support. Real range is 280-320km depending on how hard you drive.`,
        `Saves a lot of fuel money, but the initial premium is huge. You need to drive at least 15,000 km a year to break even. The touchscreen controls everything, which gets annoying while driving.`,
        `Nice performance and silent ride, but cabin plastics are hard and scratchy. Range drops by 20% in hot summer weather when the AC has to run on max cooling.`
      ];

      if (sentiment === "positive") text = evPositive[Math.floor(rand() * evPositive.length)];
      else if (sentiment === "negative") text = evNegative[Math.floor(rand() * evNegative.length)];
      else text = evMixed[Math.floor(rand() * evMixed.length)];
    } else if (fuel === "diesel") {
      const dieselPositive = [
        `The 1.5 diesel engine in the ${fullName} is a highway beast. The mid-range torque is addictive, makes overtaking long trucks a breeze. Plus, I easily get 18-20 km/l on long cruises.`,
        `If you do a lot of highway runs, the diesel is the default choice. The ${transmission} automatic gearbox matches the engine torque perfectly. Very refined and quiet cruiser.`,
        `Excellent fuel economy and punchy performance. The cabin is surprisingly quiet for a diesel, they have done a fantastic job with NVH levels. Suspension is perfect for bad Indian roads.`,
        `Driven my diesel ${modelName} for 15,000 km now. Absolutely zero issues. The highway fuel efficiency is crazy, easily getting 800+ km tank range.`
      ];
      const dieselNegative = [
        `With the new BS6 Phase 2 norms, the DPF warning light is a constant nightmare in city bumper-to-bumper traffic. I have to go for forced highway runs just to clear the soot.`,
        `The diesel clutch pedal in the manual version is quite heavy and has a long travel. My left knee starts aching after 30 minutes in city traffic. Wish I bought the automatic instead.`,
        `Diesel engine sounds quite clattery when cold, and you can feel vibrations through the gear lever and pedals. Service costs have also gone up compared to petrol.`,
        `Dealers are pushing accessories and quoting long waiting periods for the diesel variants. Plus, the 10-year diesel rule in NCR makes resale value highly uncertain.`
      ];
      const dieselMixed = [
        `Great mileage and torque, but the engine feels sluggish below 1500 RPM before the turbo kicks in. You need to downshift frequently in traffic. Highway cruising is brilliant though.`,
        `Strong engine but the manual gear shifts are slightly rubbery. The diesel grunt is audible inside the cabin when you accelerate hard, though it settles down fine at 100 km/h.`,
        `The diesel mileage is good (around 14 km/l in city, 19 on highway), but the price gap between petrol and diesel variants is hard to justify unless your monthly running is over 1500 km.`
      ];

      if (sentiment === "positive") text = dieselPositive[Math.floor(rand() * dieselPositive.length)];
      else if (sentiment === "negative") text = dieselNegative[Math.floor(rand() * dieselNegative.length)];
      else text = dieselMixed[Math.floor(rand() * dieselMixed.length)];
    } else if (fuel === "cng") {
      const cngPositive = [
        `The factory CNG setup in the ${fullName} is incredibly smooth. The transition from petrol to CNG is seamless, you barely notice it. Running costs are down to under ₹3 per km.`,
        `If you want a daily city commuter, this is it. CNG mileage is around 22-25 km/kg. The twin-cylinder tech means I still have usable boot space for weekend bags.`,
        `Extremely pocket-friendly commuter. The ride is comfortable, service is cheap, and filling up CNG takes less time now. The performance in city traffic is very adequate.`,
        `Very happy with the build quality and factory-fitted CNG safety features. Auto-cutoff works perfectly, and running cost is unmatched for a car of this size.`
      ];
      const cngNegative = [
        `Performance drops significantly once you switch to CNG. Climbing steep mall ramps or overtaking on highways requires planning and downshifting. The engine feels completely breathless.`,
        `CNG queues in my city are painful, sometimes I wait for 40 minutes just to refuel. Also, the rear suspension sagged after loading luggage and passengers, needs stiffer springs.`,
        `Absolutely zero boot space left due to the tank, you can't even fit a medium-sized suitcase. Plus, the engine thrums loudly when pulling under load in CNG mode.`,
        `Frequent service intervals for CNG filter replacement and spark plug checks are annoying. The savings in fuel are partially eaten up by extra maintenance.`
      ];
      const cngMixed = [
        `Runs very cheap, but you definitely feel the power drop compared to petrol mode. Sticking to city speeds is fine, but on the highway you'll find yourself switching back to petrol.`,
        `Cheap running cost, but the CNG cylinder adds a lot of weight at the back. The rear suspension bottoms out on larger speed breakers if three people are sitting behind.`,
        `Good for saving money but lacks any kind of driving excitement. Ground clearance reduces when fully loaded, though twin-cylinders are a neat design touch.`
      ];

      if (sentiment === "positive") text = cngPositive[Math.floor(rand() * cngPositive.length)];
      else if (sentiment === "negative") text = cngNegative[Math.floor(rand() * cngNegative.length)];
      else text = cngMixed[Math.floor(rand() * cngMixed.length)];
    } else {
      // Petrol / general reviews
      const petrolPositive = [
        `Loving my ${fullName} petrol. The engine is exceptionally refined and quiet at idle, sometimes I have to check the tachometer to see if it is running. The ride is soft and comfortable.`,
        `The petrol turbo engine has got genuine punch. The ${transmission} transmission shifts are lightning-quick and smooth. Extremely fun to drive on open highway stretches.`,
        `Very practical family car. Cabin space is class-leading, dashboard layout is clean, and the panoramic sunroof makes the interior feel huge. Service costs are predictable too.`,
        `Excellent driving dynamics. Handling is sharp, steering is light in the city but weighs up nicely on the highway. High-speed stability is reassuring and gives lots of confidence.`,
        `The ventilated seats are an absolute lifesaver in Indian summers. Infotainment screen is crisp, wireless Apple CarPlay works flawlessly without any lags.`
      ];
      const petrolNegative = [
        `Real-world city mileage is atrocious. The petrol automatic is giving me barely 8–9 km/l in heavy bumper-to-bumper traffic. Highway is better at 14 km/l, but still disappointing.`,
        `The suspension is tuned too soft. There is a lot of body roll around corners, and the car floats and bounces on wavy highway roads, making rear passengers feel car-sick.`,
        `Quality of interior plastics is a letdown for a car costing this much. There are annoying creaks from the dashboard and door pads when going over rough roads. Service center couldn't fix it.`,
        `The headlights throw is very poor. The white LED high beam looks fancy but has zero penetration in rainy or foggy conditions, making night highway driving quite scary.`,
        `The waiting period for the popular variants is ridiculous — dealers are quoting 4 months and forcing you to buy overpriced accessories and insurance from them to get early delivery.`
      ];
      const petrolMixed = [
        `The engine refinement is top-notch and features are great, but the 3-cylinder thrum at lower RPMs is slightly noticeable. Mileage is highly sensitive to throttle inputs (9 to 15 km/l).`,
        `Overall a solid packages, but the touchscreen infotainment is prone to random freezes. The cabin is spacious, but the middle rear seat is too narrow and firm for long journeys.`,
        `Good ride comfort at low speeds, but it feels floaty above 100 km/h. Feature list is huge, but some tech like wireless charger heats up the phone without charging it quickly.`,
        `The NA petrol is smooth and adequate in city, but feels flat and underpowered when fully loaded on the highway. You have to rev it hard to make quick overtakes.`
      ];

      // Blend with model-specific pros/cons if possible
      const pros = m.prosCons.pros;
      const cons = m.prosCons.cons;
      if (sentiment === "positive" && pros.length > 0) {
        const proText = pros[Math.floor(rand() * pros.length)].toLowerCase();
        petrolPositive.push(`Really love the ${proText} on the ${modelName}. It makes the daily ownership experience so much better. Highly recommend it!`);
      } else if (sentiment === "negative" && cons.length > 0) {
        const conText = cons[Math.floor(rand() * cons.length)].toLowerCase();
        petrolNegative.push(`The biggest issue is the ${conText}. It gets really annoying in daily usage and makes me regret not looking at other segment options.`);
      }

      if (sentiment === "positive") text = petrolPositive[Math.floor(rand() * petrolPositive.length)];
      else if (sentiment === "negative") text = petrolNegative[Math.floor(rand() * petrolNegative.length)];
      else text = petrolMixed[Math.floor(rand() * petrolMixed.length)];
    }

    detailedReviews.push({
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
}

// Write the dataset to disk
writeFileSync(resolve(root, "data/detailed-reviews.json"), JSON.stringify(detailedReviews, null, 2) + "\n");
console.log(`Generated ${detailedReviews.length} detailed reviews for ${models.length} models.`);
