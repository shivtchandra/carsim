"use client";

import { useEffect, useState } from "react";
import { LOOP_S } from "./sceneTokens";

export interface SceneTimeline {
  t: number;
  phase: number;
  activeStepIndex: number;
  caption: string;
}

function captionsKey(captions?: { at: number; text: string }[]) {
  if (!captions?.length) return "";
  return captions.map((c) => `${c.at}:${c.text}`).join("|");
}

export function useSceneTimeline(
  stepCount: number,
  captions?: { at: number; text: string }[],
  loopSeconds = LOOP_S
): SceneTimeline {
  const [state, setState] = useState<SceneTimeline>({
    t: 0,
    phase: 0,
    activeStepIndex: 0,
    caption: captions?.[0]?.text ?? "",
  });

  const captionSignature = captionsKey(captions);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = ((now - start) / 1000) % loopSeconds;
      const phase = t / loopSeconds;
      const activeStepIndex =
        stepCount > 0 ? Math.min(stepCount - 1, Math.floor(phase * stepCount)) : 0;
      const current = captions?.length
        ? [...captions].reverse().find((c) => t >= c.at)
        : undefined;

      setState({
        t,
        phase,
        activeStepIndex,
        caption: current?.text ?? captions?.[0]?.text ?? "",
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stepCount, captionSignature, loopSeconds]);

  return state;
}
