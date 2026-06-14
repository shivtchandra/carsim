"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { features } from "@/lib/data";
import { getFeatureUnderstanding } from "@/lib/understanding";
import AdasRoadScene, { type AdasSceneVariant } from "@/components/understanding/scenes/AdasRoadScene";
import SceneFrame from "@/components/understanding/scenes/shared/SceneFrame";
import { useSceneTimeline } from "@/components/understanding/scenes/shared/useSceneTimeline";

const ADAS_IDS: AdasSceneVariant[] = [
  "aeb",
  "adaptive-cruise",
  "lane-keep",
  "blind-spot",
  "adas-l2",
];

export default function AdasExplainer({ initialFeature }: { initialFeature?: string }) {
  const simFeatures = features.filter((f) => f.hasSimulation);
  const defaultId =
    initialFeature && ADAS_IDS.includes(initialFeature as AdasSceneVariant)
      ? (initialFeature as AdasSceneVariant)
      : "aeb";
  const [featureId, setFeatureId] = useState<AdasSceneVariant>(defaultId);

  const understanding = getFeatureUnderstanding(featureId);
  const captions = understanding.visual.captions ?? [];
  const { caption } = useSceneTimeline(understanding.visual.steps.length, captions);

  return (
    <div className="glass p-6">
      <div className="flex flex-wrap gap-2 mb-5">
        {simFeatures.map((f) => (
          <button
            key={f.id}
            onClick={() => setFeatureId(f.id as AdasSceneVariant)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors duration-200 min-h-[48px] ${
              f.id === featureId
                ? "border-[var(--accent)] text-primary bg-[var(--accent-glow)]"
                : "border-[rgba(22,22,22,0.12)] text-secondary hover:text-primary"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <SceneFrame label="ADAS SIM · 10s loop">
        <AdasRoadScene variant={featureId} />
      </SceneFrame>

      <div className="mt-4 rounded-lg border border-[rgba(22,22,22,0.08)] bg-[rgba(22,22,22,0.03)] px-4 py-2.5 min-h-[2.75rem] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-mono text-primary leading-snug"
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-xs text-secondary">
        Typical system behavior — timings vary by manufacturer.
      </p>
    </div>
  );
}
