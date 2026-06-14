"use client";

import { AnimatePresence, motion } from "framer-motion";
import { renderScene, type SceneSpecProps } from "./registry";
import SceneFrame from "./scenes/shared/SceneFrame";
import {
  SceneTimelineProvider,
  useSceneTimelineValue,
} from "./scenes/shared/sceneTimelineContext";

export default function VisualScene({
  scene,
  steps,
  captions,
  specProps,
}: {
  scene: string;
  steps: { label: string }[];
  captions?: { at: number; text: string }[];
  specProps?: SceneSpecProps;
}) {
  return (
    <SceneTimelineProvider stepCount={steps.length} captions={captions}>
      <VisualSceneContent scene={scene} steps={steps} specProps={specProps} />
    </SceneTimelineProvider>
  );
}

function VisualSceneContent({
  scene,
  steps,
  specProps,
}: {
  scene: string;
  steps: { label: string }[];
  specProps?: SceneSpecProps;
}) {
  const { activeStepIndex, caption } = useSceneTimelineValue();
  const displayCaption = caption || steps[activeStepIndex]?.label || steps[0]?.label || "";

  return (
    <div className="min-h-[200px]">
      <SceneFrame>{renderScene(scene, specProps)}</SceneFrame>

      <div className="mt-3 rounded-lg border border-[rgba(22,22,22,0.08)] bg-[rgba(22,22,22,0.03)] px-4 py-2.5 min-h-[2.75rem] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={displayCaption}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-mono text-primary leading-snug"
          >
            {displayCaption}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center gap-3">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className={`shrink-0 w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeStepIndex
                  ? "bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)] scale-125"
                  : "bg-[rgba(22,22,22,0.15)]"
              }`}
            />
            {i === activeStepIndex && (
              <span className="text-[10px] uppercase tracking-wider text-secondary truncate">
                {s.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
