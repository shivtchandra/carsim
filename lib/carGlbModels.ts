/** GLB assets for 3D simulators (Launch, Overtake, Braking, etc.). */
export const CAR_GLB_MODELS: Record<string, string> = {
  "hyundai-creta": "/models/hyundai-creta.glb",
  "kia-seltos": "/models/hyundai-creta.glb",
  "maruti-grand-vitara": "/models/hyundai-creta.glb",
  "toyota-hyryder": "/models/hyundai-creta.glb",
  "honda-elevate": "/models/hyundai-creta.glb",
  "vw-taigun": "/models/hyundai-creta.glb",
  "skoda-kushaq": "/models/hyundai-creta.glb",
  "tata-curvv": "/models/hyundai-creta.glb",
  "mahindra-xuv-3xo": "/models/hyundai-creta.glb",
  "mg-astor": "/models/hyundai-creta.glb",
  "mg-windsor": "/models/hyundai-creta.glb",
  "mg-zs-ev": "/models/hyundai-creta.glb",
  "vinfast-vf6": "/models/hyundai-creta.glb",
};

export function hasGlbModel(modelId?: string) {
  return !!modelId && modelId in CAR_GLB_MODELS;
}
