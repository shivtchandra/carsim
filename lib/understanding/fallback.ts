import type { Feature, FeatureUnderstanding } from "@/lib/types";

const CATEGORY_SCENE: Record<Feature["category"], string> = {
  safety: "generic-safety",
  comfort: "generic-comfort",
  tech: "generic-tech",
  convenience: "generic-convenience",
  performance: "generic-performance",
};

/** Map impactScore 1–3 to practical/experience scores for fallback Layer 3. */
function scoresFromImpact(impact: number): { practical: number; experience: number } {
  if (impact >= 3) return { practical: 8, experience: 5 };
  if (impact === 2) return { practical: 6, experience: 5 };
  return { practical: 4, experience: 6 };
}

export function buildFallbackUnderstanding(feature: Feature): FeatureUnderstanding {
  const { practical, experience } = scoresFromImpact(feature.impactScore);
  return {
    featureId: feature.id,
    visual: {
      scene: CATEGORY_SCENE[feature.category],
      steps: [
        { label: feature.whatItIs.slice(0, 60) + (feature.whatItIs.length > 60 ? "…" : "") },
        { label: "Why it matters for ownership" },
        { label: "Who typically values it" },
      ],
    },
    context: {
      usefulIf: [feature.whoNeedsIt],
      notUsefulIf: ["Low priority if this doesn't match your driving pattern"],
    },
    value: {
      practicalScore: practical,
      experienceScore: experience,
      ownershipImpact: feature.impactScore as 1 | 2 | 3,
    },
  };
}
