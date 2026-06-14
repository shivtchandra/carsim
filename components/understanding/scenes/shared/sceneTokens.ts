/** Shared tokens for Understanding Mode Layer 1 viewports. */

export const LOOP_S = 10;

export const SCENE_COLORS = {
  viewportBg: "#0F0F11",
  road: "#17171A",
  roadLine: "rgba(245,241,232,0.22)",
  roadEdge: "rgba(245,241,232,0.35)",
  textPrimary: "#F5F1E8",
  textSecondary: "#9CA3AF",
  /** Vermillion — matches --accent */
  accent: "#C84C31",
  accentSoft: "rgba(200, 76, 49, 0.15)",
  accentStroke: "rgba(200, 76, 49, 0.55)",
  /** Steel blue — matches --secondary */
  secondary: "#4F6B8A",
  secondarySoft: "rgba(79, 107, 138, 0.2)",
  warning: "#d97706",
  warningSoft: "rgba(217, 119, 6, 0.15)",
  warningStroke: "rgba(217, 119, 6, 0.55)",
  negative: "#C84C31",
  negativeSoft: "rgba(200, 76, 49, 0.15)",
  leadCar: "#3F3F46",
  bike: "#FBBF24",
} as const;

export const MONO_CLASS = "font-mono text-[11px] tracking-wide";

export const CANVAS_W = 700;
export const CANVAS_H = 200;
