import featureUnderstandingJson from "@/data/understanding/features.json";
import specUnderstandingJson from "@/data/understanding/specs.json";
import { getFeature } from "@/lib/data";
import type { Feature, FeatureUnderstanding, SpecUnderstanding, SpecUnderstandingKey } from "@/lib/types";
import { buildFallbackUnderstanding } from "./fallback";

export const featureUnderstandings = featureUnderstandingJson as FeatureUnderstanding[];
export const specUnderstandings = specUnderstandingJson as SpecUnderstanding[];

const featureMap = new Map(featureUnderstandings.map((u) => [u.featureId, u]));
const specMap = new Map(specUnderstandings.map((u) => [u.specKey, u]));

export const SCENE_FEATURE_IDS = new Set(featureUnderstandings.map((u) => u.featureId));

export function getFeatureUnderstanding(featureId: string, feature?: Feature): FeatureUnderstanding {
  const existing = featureMap.get(featureId);
  if (existing) return existing;
  const f = feature ?? getFeature(featureId);
  if (!f) throw new Error(`Unknown feature: ${featureId}`);
  return buildFallbackUnderstanding(f);
}

export function getSpecUnderstanding(specKey: SpecUnderstandingKey): SpecUnderstanding | undefined {
  return specMap.get(specKey);
}

export function hasCustomScene(featureId: string): boolean {
  return SCENE_FEATURE_IDS.has(featureId);
}

export { loadProfile, saveProfile, DEFAULT_PROFILE, formatProfileChip } from "./profile";
export type { DrivingProfile } from "./profile";
export { resolveContext } from "./context";
export type { ResolvedContext } from "./context";
