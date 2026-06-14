import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, "data/image-sources.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const directUrls = {
  "toyota-hyryder": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/4/4c/2022_Toyota_Urban_Cruiser_Hyryder_V_Hybrid_%28India%29_front_view.jpg",
    "credit": "Andra Febrian",
    "license": "CC BY-SA 4.0"
  },
  "mg-windsor": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/9/97/2024_Wuling_Cloud_EV_in_Pristine_White_taken_in_Bandung%2C_West_Java_40173_01.jpg",
    "credit": "Gofir",
    "license": "CC BY-SA 4.0"
  },
  "mahindra-thar-roxx": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Mahindra_Thar.jpg",
    "credit": "Wikimedia Commons",
    "license": "CC BY-SA 4.0"
  },
  "maruti-swift": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Suzuki_Swift_%282024%29_hybrid_IMG_2582.jpg",
    "credit": "NCS",
    "license": "CC BY-SA 4.0"
  },
  "honda-amaze": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Honda_Amaze_front_view.jpg",
    "credit": "Wikimedia Commons",
    "license": "CC BY-SA 4.0"
  }
};

for (const src of manifest.sources) {
  if (directUrls[src.modelId]) {
    src.url = directUrls[src.modelId].url;
    src.credit = directUrls[src.modelId].credit;
    src.license = directUrls[src.modelId].license;
    console.log(`Set direct URL for: ${src.modelId}`);
  }
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("image-sources.json updated with direct URLs!");
