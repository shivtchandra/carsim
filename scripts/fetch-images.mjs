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

async function commonsSearch(query, { relaxed = false } = {}) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
    `&gsrsearch=${encodeURIComponent((relaxed ? "" : "filetype:bitmap ") + query)}&gsrlimit=${relaxed ? 12 : 8}&gsrnamespace=6` +
    "&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1280";
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data?.query?.pages ?? {});
  const candidates = pages
    .map((p) => p.imageinfo?.[0])
    .filter((i) => {
      if (!i || !/\.jpe?g$/i.test(i.url)) return false;
      if (relaxed) return i.width >= 640;
      return i.width > i.height && i.width >= 1000;
    });
  if (candidates.length === 0) return null;
  const best = candidates[0];
  const meta = best.extmetadata ?? {};
  return {
    url: best.thumburl ?? best.url,
    credit: (meta.Artist?.value ?? "Wikimedia Commons").replace(/<[^>]+>/g, "").trim(),
    license: meta.LicenseShortName?.value ?? "see Commons",
  };
}

async function findImage(src) {
  if (src.url) {
    return { url: src.url, credit: src.credit ?? "direct", license: src.license ?? "direct" };
  }
  const queries = [
    src.query,
    ...(src.fallbackQueries ?? []),
    `${src.query} car`,
    src.query?.replace(/ India.*$/i, ""),
  ].filter(Boolean);
  const seen = new Set();
  for (const q of queries) {
    if (seen.has(q)) continue;
    seen.add(q);
    const hit = await commonsSearch(q);
    if (hit) return hit;
    await new Promise((r) => setTimeout(r, 1200));
    const relaxed = await commonsSearch(q, { relaxed: true });
    if (relaxed) return relaxed;
  }
  return null;
}

for (const src of manifest.sources) {
  const dest = resolve(outDir, `${src.modelId}.jpg`);
  if (existsSync(dest) && !force) {
    console.log(`skip  ${src.modelId} (exists)`);
    continue;
  }
  try {
    await new Promise((r) => setTimeout(r, 3000)); // stay under Commons and upload rate limits
    let pick = null;
    pick = await findImage(src);
    if (!pick) {
      console.log(`MISS  ${src.modelId} — no candidate found (silhouette fallback will show)`);
      continue;
    }
    await new Promise((r) => setTimeout(r, 2000)); // sleep before downloading image to avoid rate limits
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
