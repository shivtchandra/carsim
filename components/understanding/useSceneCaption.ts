"use client";

import { useSceneTimeline } from "./scenes/shared/useSceneTimeline";
import { LOOP_S } from "./scenes/shared/sceneTokens";

export function useSceneCaption(
  captions: { at: number; text: string }[] | undefined,
  loopSeconds = LOOP_S,
  stepCount = 3
): string {
  const { caption } = useSceneTimeline(stepCount, captions, loopSeconds);
  return caption;
}

export { LOOP_S } from "./scenes/shared/sceneTokens";
export { useSceneTimeline } from "./scenes/shared/useSceneTimeline";
