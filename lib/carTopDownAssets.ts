/** Top-down PNG sprites for City Simulator (2D SVG layer only). */
export const TOP_DOWN_CAR_ASSETS: Record<string, string> = {
  "hyundai-creta": "/images/cars/creta_topdown.png",
};

/** Reference footprint the Creta sprite was authored for (mm). */
export const TOP_DOWN_REF = {
  modelId: "hyundai-creta",
  lengthMm: 4300,
  widthMm: 1790,
} as const;

/** SVG sprite size at reference scale (viewBox units). */
export const TOP_DOWN_REF_SPRITE = { width: 52, height: 26 } as const;

/** @deprecated 3D sims use GLB via lib/carGlbModels — kept empty intentionally. */
export const TOP_DOWN_3D: Record<string, string> = {};

export function hasTopDown3D(_modelId?: string) {
  return false;
}

export function getTopDownSpriteSize(lengthMm: number, widthMm: number) {
  const w = TOP_DOWN_REF_SPRITE.width * (lengthMm / TOP_DOWN_REF.lengthMm);
  const h = TOP_DOWN_REF_SPRITE.height * (widthMm / TOP_DOWN_REF.widthMm);
  return { width: w, height: h };
}

/** Collision half-extents in viewBox units, scaled to vehicle footprint. */
export function getTopDownCollisionHalfExtents(lengthMm: number, widthMm: number) {
  const lengthScale = lengthMm / TOP_DOWN_REF.lengthMm;
  const widthScale = widthMm / TOP_DOWN_REF.widthMm;
  return {
    halfLength: 21 * lengthScale,
    halfWidth: 9 * widthScale,
  };
}
