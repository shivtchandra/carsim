"use client";

import type { ReactNode } from "react";
import { SCENE_COLORS } from "./sceneTokens";

export default function SceneFrame({
  children,
  label = "SIM · 10s loop",
  framed = true,
}: {
  children: ReactNode;
  label?: string;
  /** When false, skip outer chrome (e.g. AdasExplainer already in glass card). */
  framed?: boolean;
}) {
  if (!framed) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: "16 / 9", background: SCENE_COLORS.viewportBg }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl border border-[rgba(22,22,22,0.12)] overflow-hidden bg-[#161616]/[0.04] p-2">
      <div className="flex items-center justify-between px-1 pb-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-secondary">
          {label}
        </span>
        <span className="font-mono text-[9px] text-secondary/60">viewport</span>
      </div>
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: "16 / 9", background: SCENE_COLORS.viewportBg }}
      >
        <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[rgba(200,76,49,0.4)] pointer-events-none z-10" aria-hidden />
        <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[rgba(200,76,49,0.4)] pointer-events-none z-10" aria-hidden />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[rgba(200,76,49,0.4)] pointer-events-none z-10" aria-hidden />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[rgba(200,76,49,0.4)] pointer-events-none z-10" aria-hidden />
        {children}
      </div>
    </div>
  );
}
