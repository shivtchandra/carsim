"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SceneTimeline } from "./useSceneTimeline";
import { useSceneTimeline } from "./useSceneTimeline";

const SceneTimelineContext = createContext<SceneTimeline | null>(null);

export function SceneTimelineProvider({
  stepCount,
  captions,
  loopSeconds,
  children,
}: {
  stepCount: number;
  captions?: { at: number; text: string }[];
  loopSeconds?: number;
  children: ReactNode;
}) {
  const timeline = useSceneTimeline(stepCount, captions, loopSeconds);
  return (
    <SceneTimelineContext.Provider value={timeline}>{children}</SceneTimelineContext.Provider>
  );
}

/** Use the shared Layer 1 timeline from VisualScene (preferred for animated scenes). */
export function useSceneTimelineValue(): SceneTimeline {
  const timeline = useContext(SceneTimelineContext);
  if (!timeline) {
    throw new Error("useSceneTimelineValue must be used inside SceneTimelineProvider");
  }
  return timeline;
}
