import { readFileSync, writeFileSync } from "node:fs";

const bodyDims = JSON.parse(readFileSync("data/model-body-dimensions.json", "utf8"));
const models = JSON.parse(readFileSync("data/models.json", "utf8"));

let missing = 0;
for (const model of models) {
  const extra = bodyDims[model.id];
  if (!extra) {
    console.warn("Missing body dimensions for:", model.id);
    missing++;
    continue;
  }
  model.dimensions = { ...model.dimensions, ...extra };
}

writeFileSync("data/models.json", JSON.stringify(models, null, 2) + "\n");
console.log(`Updated ${models.length - missing}/${models.length} models`);
if (missing) process.exit(1);
