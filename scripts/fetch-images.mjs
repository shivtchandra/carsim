// Fetches car photos listed in data/image-sources.json into public/images/cars/{id}.jpg.
// Default source is Wikimedia Commons search (freely licensed); a direct `url` overrides it.
// Credits are written back into image-sources.json. Re-runnable: existing files are skipped.
// Run: node scripts/fetch-images.mjs [--force]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, "data/image-sources.json");
const outDir = resolve(root, "public/images/cars");
mkdirSync(outDir, { recursive: true });
const force = process.argv.includes("--force");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const UA = "DriveScopeBot/1.0 (car decision platform; image seeding script)";

async function commonsSearch(query) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
    `&gsrsearch=${encodeURIComponent("filetype:bitmap " + query)}&gsrlimit=8&gsrnamespace=6` +
    "&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1280";
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data?.query?.pages ?? {});
  // prefer wide landscape jpgs
  const candidates = pages
    .map((p) => p.imageinfo?.[0])
    .filter((i) => i && /\.jpe?g$/i.test(i.url) && i.width > i.height && i.width >= 1000);
  if (candidates.length === 0) return null;
  const best = candidates[0];
  const meta = best.extmetadata ?? {};
  return {
    url: best.thumburl ?? best.url,
    credit: (meta.Artist?.value ?? "Wikimedia Commons").replace(/<[^>]+>/g, "").trim(),
    license: meta.LicenseShortName?.value ?? "see Commons",
  };
}

for (const src of manifest.sources) {
  const dest = resolve(outDir, `${src.modelId}.jpg`);
  if (existsSync(dest) && !force) {
    console.log(`skip  ${src.modelId} (exists)`);
    continue;
  }
  try {
    let pick = null;
    if (src.url) {
      pick = { url: src.url, credit: src.credit ?? "direct", license: src.license ?? "direct" };
    } else {
      await new Promise((r) => setTimeout(r, 3000)); // stay under Commons rate limits
      pick = await commonsSearch(src.query);
    }
    if (!pick) {
      console.log(`MISS  ${src.modelId} — no candidate found (silhouette fallback will show)`);
      continue;
    }
    const img = await fetch(pick.url, { headers: { "User-Agent": UA } });
    if (!img.ok) throw new Error(`HTTP ${img.status}`);
    writeFileSync(dest, Buffer.from(await img.arrayBuffer()));
    src.fetchedFrom = pick.url;
    src.credit = pick.credit;
    src.license = pick.license;
    console.log(`ok    ${src.modelId} ← ${pick.license} (${pick.credit.slice(0, 40)})`);
  } catch (e) {
    console.log(`FAIL  ${src.modelId}: ${e.message}`);
  }
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest updated with credits");
