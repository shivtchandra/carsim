"use client";

import { SCENE_COLORS } from "./sceneTokens";

/** Top-down car silhouette (matches simCanvas proportions). */
export function CarTop({
  x,
  y,
  w,
  h,
  color = SCENE_COLORS.accent,
  opacity = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  opacity?: number;
}) {
  const r = h * 0.3;
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={color} />
      <rect
        x={x + w * 0.3}
        y={y + h * 0.15}
        width={w * 0.32}
        height={h * 0.7}
        rx={h * 0.18}
        fill="rgba(245,241,232,0.22)"
      />
    </g>
  );
}

/** Side-profile car silhouette. */
export function CarSide({
  x,
  y,
  w,
  h,
  color = SCENE_COLORS.accent,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
}) {
  const bodyY = y + h * 0.35;
  const bodyH = h * 0.45;
  const cabinY = y;
  const cabinH = h * 0.5;
  return (
    <g>
      <rect x={x} y={bodyY} width={w} height={bodyH} rx={h * 0.2} fill={color} />
      <rect x={x + w * 0.25} y={cabinY} width={w * 0.5} height={cabinH} rx={h * 0.18} fill={color} />
      {[x + w * 0.22, x + w * 0.78].map((wx, i) => (
        <circle
          key={i}
          cx={wx}
          cy={y + h * 0.82}
          r={h * 0.18}
          fill="#0A0A0B"
          stroke="rgba(245,241,232,0.35)"
          strokeWidth={2}
        />
      ))}
    </g>
  );
}

export function RoadTopDown({
  width = 700,
  height = 200,
  scrollOffset = 0,
}: {
  width?: number;
  height?: number;
  scrollOffset?: number;
}) {
  const laneTop = height * 0.2;
  const laneH = height * 0.6;
  const centerY = laneTop + laneH / 2;
  return (
    <g>
      <rect x={0} y={laneTop} width={width} height={laneH} fill={SCENE_COLORS.road} />
      <line x1={0} y1={laneTop} x2={width} y2={laneTop} stroke={SCENE_COLORS.roadEdge} strokeWidth={2} />
      <line
        x1={0}
        y1={laneTop + laneH}
        x2={width}
        y2={laneTop + laneH}
        stroke={SCENE_COLORS.roadEdge}
        strokeWidth={2}
      />
      <line
        x1={0}
        y1={centerY}
        x2={width}
        y2={centerY}
        stroke={SCENE_COLORS.roadLine}
        strokeWidth={2}
        strokeDasharray="20 16"
        strokeDashoffset={-scrollOffset}
      />
    </g>
  );
}

export function CalloutBadge({
  x,
  y,
  text,
  variant = "accent",
  visible = true,
}: {
  x: number;
  y: number;
  text: string;
  variant?: "accent" | "warning" | "negative";
  visible?: boolean;
}) {
  if (!visible) return null;
  const styles = {
    accent: { fill: SCENE_COLORS.accentSoft, stroke: SCENE_COLORS.accentStroke, color: SCENE_COLORS.accent },
    warning: { fill: SCENE_COLORS.warningSoft, stroke: SCENE_COLORS.warningStroke, color: SCENE_COLORS.warning },
    negative: { fill: SCENE_COLORS.negativeSoft, stroke: SCENE_COLORS.accentStroke, color: SCENE_COLORS.negative },
  }[variant];
  const tw = Math.max(120, text.length * 7.5);
  return (
    <g>
      <rect x={x} y={y} width={tw} height={26} rx={13} fill={styles.fill} stroke={styles.stroke} />
      <text x={x + 14} y={y + 17} fill={styles.color} fontSize={12} fontFamily="ui-monospace, Menlo, monospace">
        {text}
      </text>
    </g>
  );
}

export function TyreWheel({
  cx,
  cy,
  rx = 28,
  ry = 18,
  warn = false,
  flat = false,
}: {
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  warn?: boolean;
  flat?: boolean;
}) {
  const scaleY = flat ? 0.65 : 1;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(1, ${scaleY}) translate(${-cx}, ${-cy})`}>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="#1a1a1e"
        stroke={warn ? SCENE_COLORS.warning : SCENE_COLORS.textSecondary}
        strokeWidth={2}
      />
      <ellipse cx={cx} cy={cy} rx={rx * 0.45} ry={ry * 0.45} fill="#252528" />
    </g>
  );
}

export function MeasureRuler({
  x,
  y,
  height,
  label,
}: {
  x: number;
  y: number;
  height: number;
  label: string;
}) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + height} stroke={SCENE_COLORS.textSecondary} strokeWidth={1} />
      <line x1={x - 4} y1={y} x2={x + 4} y2={y} stroke={SCENE_COLORS.textSecondary} strokeWidth={1} />
      <line x1={x - 4} y1={y + height} x2={x + 4} y2={y + height} stroke={SCENE_COLORS.textSecondary} strokeWidth={1} />
      <text x={x + 8} y={y + height / 2 + 4} fill={SCENE_COLORS.textSecondary} fontSize={10} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

/** Simple luggage silhouette. */
export function LuggageSilhouette({ x, y, w = 56, h = 32 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y + 6} width={w} height={h - 6} rx={4} fill={SCENE_COLORS.accent} opacity={0.85} />
      <rect x={x + w * 0.35} y={y} width={w * 0.3} height={10} rx={3} fill={SCENE_COLORS.accent} opacity={0.7} />
      <line x1={x + 8} y1={y + 14} x2={x + w - 8} y2={y + 14} stroke="rgba(22,22,22,0.25)" strokeWidth={1} />
    </g>
  );
}

/** Stick figure seated (side view). */
export function SeatFigure({
  x,
  y,
  scale = 1,
  color = SCENE_COLORS.secondary,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <circle cx={0} cy={-22} r={8} fill={color} opacity={0.8} />
      <line x1={0} y1={-14} x2={0} y2={8} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <line x1={0} y1={-4} x2={-14} y2={4} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={0} y1={-4} x2={12} y2={2} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={0} y1={8} x2={-10} y2={22} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={0} y1={8} x2={14} y2={20} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}
