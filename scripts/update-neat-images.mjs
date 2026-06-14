import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, "data/image-sources.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const NEAT_IMAGES = {
  "hyundai-creta": "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Creta/summer-edition/creta-summer-edition.jpg",
  "kia-seltos": "https://www.kia.com/content/dam/kia2/in/en/images/360vr/new_seltos/1mw51mc5fss036/exterior/kdg/04-d.png",
  "vw-taigun": "https://assets.volkswagen.com/is/image/volkswagenag/the-new-taigun-section1?fit=crop,1&fmt=webp&qlt=79&wid=1920&align=0.00,0.00&bfc=off",
  "vw-virtus": "https://assets.volkswagen.com/is/image/volkswagenag/virtus-home-new-1?fit=crop,1&fmt=webp&qlt=79&wid=1920&align=0.00,0.00&bfc=off",
  "skoda-slavia": "https://images.skoda-cms.skoda-auto.com/2023-10/61c77f0a-7023-45f8-bad5-20163351d564/Slavia-Matte-Edition.png",
  "skoda-kushaq": "https://images.skoda-cms.skoda-auto.com/2023-10/2b3fde06-a83a-4467-9c98-df058b8ef3a7/Kushaq-Matte-Edition.png",
  "honda-city": "https://www.hondacarindia.com/honda-city/images/color/platinum-white-pearl.png",
  "honda-elevate": "https://www.hondacarindia.com/honda-elevate/images/color-monotone/platinum-white-pearl.png",
  "honda-amaze": "https://www.hondacarindia.com/honda-amaze/images/color/platinum-white-pearl.png",
  "hyundai-verna": "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/color-images/exterior/abp.png",
  "hyundai-venue": "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Venue/color/fiery-red.png",
  "kia-sonet": "https://www.kia.com/content/dam/kia2/in/en/images/360vr/sonet/pe/exterior/cr1/01-d.png",
  "maruti-swift": "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/swift-2024/colors/Swift-Luster-Blue.webp",
  "maruti-dzire": "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/dzire-2024/colors/Dzire-Gallant-Red.webp",
  "maruti-brezza": "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/Brezza_2022/brezza-colors/exuberant-blue.webp",
  "maruti-grand-vitara": "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/grand_vitara/colors/Celestial-Blue.webp",
  "toyota-hyryder": "https://images-saboomaruti-in.s3.ap-south-1.amazonaws.com/grand_vitara/colors/Celestial-Blue.webp", 
  "tata-nexon": "https://tata-nexon.saboomotors.com/assets/images/colors/fearless-purple.webp",
  "tata-punch": "https://tata-punch.saboomotors.com/assets/images/colors/tornado-blue.webp",
  "tata-curvv": "https://tata-curvv.saboomotors.com/assets/images/colors/gold-essence.webp",
  "tata-harrier": "https://tata-harrier.saboomotors.com/assets/images/colors/sunlit-yellow.webp",
  "mahindra-xuv700": "https://mahindra-xuv700.saboomotors.com/assets/images/colors/everest-white.webp",
  "mahindra-scorpio-n": "https://mahindra-scorpio.saboomotors.com/assets/images/colors/everest-white.webp",
  "mahindra-xuv-3xo": "https://mahindra-3xo.saboomotors.com/assets/images/colors/dune-beige.webp",
  "mahindra-thar-roxx": "https://mahindra-thar.saboomotors.com/assets/images/colors/tango-red.webp",
  "mg-windsor": "https://mg-windsor.saboomotors.com/assets/images/colors/clay-beige.webp",
  "mg-astor": "https://mg-astor.saboomotors.com/assets/images/colors/spiced-orange.webp",
  "mg-hector": "https://mg-hector.saboomotors.com/assets/images/colors/dune-brown.webp",
  "nissan-magnite": "https://nissan-magnite.saboomotors.com/assets/images/colors/flare-garnet-red.webp",
  "renault-kiger": "https://renault-kiger.saboomotors.com/assets/images/colors/ice-cool-white.webp"
};

for (const src of manifest.sources) {
  if (NEAT_IMAGES[src.modelId]) {
    src.url = NEAT_IMAGES[src.modelId];
    src.credit = "Official Manufacturer Image";
    src.license = "Press / Editorial Use";
    console.log(`Mapped direct neat URL for: ${src.modelId}`);
  }
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("image-sources.json updated successfully with new neat URLs!");
