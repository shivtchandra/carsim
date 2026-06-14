import * as THREE from "three";

/** Turn black/near-black pixels transparent — for top-down car PNGs on dark backgrounds. */
export function blackKeyTexture(source: THREE.Texture, threshold = 0.12): THREE.CanvasTexture {
  const img = source.image as HTMLImageElement | HTMLCanvasElement;
  const w = img.width;
  const h = img.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const px = imageData.data;
  for (let i = 0; i < px.length; i += 4) {
    const lum = Math.max(px[i], px[i + 1], px[i + 2]) / 255;
    px[i + 3] = lum < threshold ? 0 : 255;
  }
  ctx.putImageData(imageData, 0, 0);

  const keyed = new THREE.CanvasTexture(canvas);
  keyed.colorSpace = THREE.SRGBColorSpace;
  keyed.anisotropy = 8;
  keyed.minFilter = THREE.LinearMipmapLinearFilter;
  keyed.magFilter = THREE.LinearFilter;
  keyed.generateMipmaps = true;
  keyed.needsUpdate = true;
  return keyed;
}
