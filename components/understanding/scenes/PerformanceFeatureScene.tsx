"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { CANVAS_H, CANVAS_W, SCENE_COLORS } from "./shared/sceneTokens";
import { CalloutBadge } from "./shared/ScenePrimitives";

export type PerformanceSceneVariant =
  | "all-disc-brakes"
  | "paddle-shifters"
  | "drive-modes"
  | "alloy-17";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="absolute inset-0 h-full w-full bg-[#0F0F11]">
      <defs>
        <pattern id="perf-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#perf-grid)" />
      <text x="18" y="18" fill={SCENE_COLORS.textSecondary} fontSize={9} fontFamily="monospace">
        PERFORMANCE // {label}
      </text>
      {children}
    </svg>
  );
}

function AllDiscBrakesVisual({ phase }: { phase: number }) {
  const braking = phase > 0.32;
  const fade = phase > 0.58;
  const heat = braking ? 0.3 + Math.sin(phase * 14) * 0.25 : 0;

  return (
    <Frame label="all-wheel disc brakes">
      {/* Top-down car */}
      <rect x="250" y="58" width="200" height="84" rx={12} fill="#252528" stroke={SCENE_COLORS.secondary} strokeWidth={1} />
      {/* Four wheels with discs */}
      {[
        { cx: 278, cy: 72, label: "FL" },
        { cx: 422, cy: 72, label: "FR" },
        { cx: 278, cy: 128, label: "RL" },
        { cx: 422, cy: 128, label: "RR" },
      ].map((w) => (
        <g key={w.label}>
          <circle cx={w.cx} cy={w.cy} r={16} fill="#111318" stroke={SCENE_COLORS.secondary} strokeWidth={1.5} />
          <circle cx={w.cx} cy={w.cy} r={9} fill="none" stroke={braking ? SCENE_COLORS.accent : "#35D6FF"} strokeWidth={2} opacity={0.8} />
          {braking && (
            <circle cx={w.cx} cy={w.cy} r={11} fill="none" stroke="#f59e0b" strokeWidth={1.5} opacity={heat} />
          )}
          <text x={w.cx} y={w.cy + 3} fill={SCENE_COLORS.textSecondary} fontSize={6} fontFamily="monospace" textAnchor="middle">
            {w.label}
          </text>
        </g>
      ))}

      {/* Drum vs disc comparison inset */}
      <g transform="translate(480, 68)">
        <rect x="0" y="0" width="90" height="64" rx={4} fill="rgba(79,107,138,0.06)" stroke="rgba(79,107,138,0.2)" strokeWidth={0.75} />
        <text x="45" y="12" fill={SCENE_COLORS.textSecondary} fontSize={6} fontFamily="monospace" textAnchor="middle">
          rear drum vs disc
        </text>
        <circle cx="28" cy="38" r="14" fill="#1a1a1e" stroke={SCENE_COLORS.textSecondary} strokeWidth={1} />
        <rect x="18" y="32" width="20" height="12" rx={2} fill="#252528" />
        <circle cx="62" cy="38" r="14" fill="#1a1a1e" stroke="#35D6FF" strokeWidth={1} />
        <circle cx="62" cy="38" r="7" fill="none" stroke="#35D6FF" strokeWidth={1.5} />
      </g>

      <CalloutBadge x={430} y={42} text={fade ? "4-disc — less fade on ghats" : braking ? "even braking force" : "all corners ventilated"} visible />
    </Frame>
  );
}

function PaddleShiftersVisual({ phase }: { phase: number }) {
  const downshift = phase > 0.35 && phase < 0.72;
  const highlight = downshift ? "left" : phase >= 0.72 ? "right" : null;
  const rpm = downshift ? 4200 - (phase - 0.35) * 800 : 2800 + phase * 1200;

  return (
    <Frame label="paddle shifters">
      {/* Steering wheel */}
      <circle cx="320" cy="105" r="48" fill="none" stroke={SCENE_COLORS.secondary} strokeWidth={6} />
      <circle cx="320" cy="105" r="38" fill="#17171A" stroke="rgba(79,107,138,0.3)" strokeWidth={1} />
      {/* Paddles */}
      <rect x="268" y="88" width="14" height="34" rx={3} fill={highlight === "left" ? SCENE_COLORS.accent : "#252528"} stroke={highlight === "left" ? "#35D6FF" : SCENE_COLORS.secondary} strokeWidth={1} />
      <rect x="358" y="88" width="14" height="34" rx={3} fill={highlight === "right" ? SCENE_COLORS.accent : "#252528"} stroke={highlight === "right" ? "#35D6FF" : SCENE_COLORS.secondary} strokeWidth={1} />
      <text x="275" y="108" fill={SCENE_COLORS.textPrimary} fontSize={8} fontFamily="monospace" textAnchor="middle">−</text>
      <text x="365" y="108" fill={SCENE_COLORS.textPrimary} fontSize={8} fontFamily="monospace" textAnchor="middle">+</text>

      {/* RPM gauge */}
      <rect x="420" y="72" width="120" height="56" rx={6} fill="#121215" stroke="rgba(79,107,138,0.3)" strokeWidth={1} />
      <text x="480" y="88" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace" textAnchor="middle">
        RPM
      </text>
      <text x="480" y="108" fill={downshift ? "#35D6FF" : SCENE_COLORS.textPrimary} fontSize={16} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
        {Math.round(rpm)}
      </text>
      <text x="480" y="122" fill={SCENE_COLORS.textSecondary} fontSize={6} fontFamily="monospace" textAnchor="middle">
        {downshift ? "engine braking" : "manual override"}
      </text>

      {/* Hill descent hint */}
      {downshift && (
        <path d="M 180,140 Q 220,100 260,120" fill="none" stroke={SCENE_COLORS.accent} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />
      )}

      <CalloutBadge x={430} y={42} text={downshift ? "downshift on ghat descent" : "steering-mounted control"} visible />
    </Frame>
  );
}

function DriveModesVisual({ phase }: { phase: number }) {
  const mode = phase < 0.33 ? "ECO" : phase < 0.66 ? "NORMAL" : "SPORT";
  const throttle = mode === "ECO" ? 0.35 : mode === "NORMAL" ? 0.6 : 0.95;
  const response = mode === "ECO" ? 0.4 : mode === "NORMAL" ? 0.65 : 1;

  return (
    <Frame label="drive modes">
      {/* Mode dial */}
      <rect x="240" y="68" width="220" height="64" rx={8} fill="#17171A" stroke="rgba(79,107,138,0.25)" strokeWidth={1.5} />
      {(["ECO", "NORMAL", "SPORT"] as const).map((m, i) => (
        <g key={m}>
          <rect
            x={260 + i * 68}
            y="82"
            width="56"
            height="36"
            rx={6}
            fill={mode === m ? "rgba(200,76,49,0.2)" : "#121215"}
            stroke={mode === m ? SCENE_COLORS.accent : "rgba(79,107,138,0.25)"}
            strokeWidth={mode === m ? 1.5 : 0.75}
          />
          <text x={288 + i * 68} y="104" fill={mode === m ? SCENE_COLORS.accent : SCENE_COLORS.textSecondary} fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight={mode === m ? "bold" : "normal"}>
            {m}
          </text>
        </g>
      ))}

      {/* Throttle response curve */}
      <rect x="420" y="72" width="120" height="56" rx={6} fill="#121215" stroke="rgba(79,107,138,0.3)" strokeWidth={1} />
      <text x="480" y="86" fill={SCENE_COLORS.textSecondary} fontSize={6} fontFamily="monospace" textAnchor="middle">
        throttle map
      </text>
      <path
        d={`M 432,118 Q ${448 + response * 20},${118 - response * 30} 528,${118 - response * 42}`}
        fill="none"
        stroke="#35D6FF"
        strokeWidth={2}
      />
      <line x1="432" y1="118" x2="528" y2="118" stroke="rgba(79,107,138,0.2)" strokeWidth={0.75} />

      <CalloutBadge x={430} y={42} text={mode === "SPORT" ? "sharper response" : mode === "ECO" ? "softer in traffic" : "balanced daily"} visible />
    </Frame>
  );
}

function Alloy17Visual({ phase }: { phase: number }) {
  const spin = phase * Math.PI * 4;
  const showCut = phase > 0.3;

  return (
    <Frame label="17 inch alloy wheels">
      <g transform="translate(300, 105)">
        {/* Tyre */}
        <circle r="52" fill="#1a1a1e" stroke="#252528" strokeWidth={8} />
        {/* Alloy rim */}
        <circle r="34" fill="#2a2a30" stroke={SCENE_COLORS.secondary} strokeWidth={2} />
        {/* Spokes */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = spin + (i * Math.PI * 2) / 5;
          return (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={Math.cos(angle) * 30}
              y2={Math.sin(angle) * 30}
              stroke={showCut ? "#d4d4d8" : SCENE_COLORS.secondary}
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
        {/* Diamond-cut face highlight */}
        {showCut && (
          <circle r="22" fill="none" stroke="rgba(245,241,232,0.35)" strokeWidth={3} strokeDasharray="8 6" />
        )}
        <circle r="8" fill="#111318" stroke={SCENE_COLORS.secondary} strokeWidth={1} />
      </g>

      {/* Size callout */}
      <g transform="translate(430, 78)">
        <line x1="0" y1="40" x2="0" y2="0" stroke="#35D6FF" strokeWidth={1.5} />
        <line x1="-6" y1="0" x2="6" y2="0" stroke="#35D6FF" strokeWidth={1} />
        <line x1="-6" y1="40" x2="6" y2="40" stroke="#35D6FF" strokeWidth={1} />
        <text x="14" y="24" fill="#35D6FF" fontSize={9} fontFamily="monospace">
          17&quot;
        </text>
      </g>

      {/* Steel vs alloy inset */}
      <g transform="translate(480, 130)" opacity={phase > 0.55 ? 1 : 0.4}>
        <text x="45" y="0" fill={SCENE_COLORS.textSecondary} fontSize={6} fontFamily="monospace" textAnchor="middle">
          vs steel wheel
        </text>
        <circle cx="22" cy="18" r="12" fill="#3f3f46" stroke={SCENE_COLORS.textSecondary} strokeWidth={1} />
        <circle cx="68" cy="18" r="12" fill="#2a2a30" stroke="#35D6FF" strokeWidth={1} />
      </g>

      <CalloutBadge x={430} y={42} text={showCut ? "diamond-cut face" : "lighter than steel"} visible />
    </Frame>
  );
}

const VARIANTS: Record<PerformanceSceneVariant, React.FC<{ phase: number }>> = {
  "all-disc-brakes": AllDiscBrakesVisual,
  "paddle-shifters": PaddleShiftersVisual,
  "drive-modes": DriveModesVisual,
  "alloy-17": Alloy17Visual,
};

const CAPTIONS: Record<PerformanceSceneVariant, { at: number; text: string }[]> = {
  "all-disc-brakes": [
    { at: 0, text: "Disc brakes on all four wheels — not drums at the rear." },
    { at: 3, text: "Even braking force across corners under repeated stops." },
    { at: 6, text: "Better fade resistance on ghat descents and spirited driving." },
  ],
  "paddle-shifters": [
    { at: 0, text: "Paddles behind the wheel let you shift manually in an automatic." },
    { at: 3, text: "Downshift on a hill descent — engine braking saves the foot brake." },
    { at: 6, text: "Hold a gear for overtakes; otherwise most owners rarely touch them." },
  ],
  "drive-modes": [
    { at: 0, text: "Eco softens throttle for traffic and fuel savings." },
    { at: 3, text: "Normal is the daily default — balanced response." },
    { at: 6, text: "Sport sharpens throttle and sometimes steering — modest but noticeable." },
  ],
  "alloy-17": [
    { at: 0, text: "17-inch alloy wheels — lighter and sharper looking than steel." },
    { at: 3, text: "Diamond-cut face catches light — the brochure look buyers notice." },
    { at: 6, text: "Slightly firmer ride than smaller wheels; marginally better grip." },
  ],
};

export default function PerformanceFeatureScene({ variant }: { variant: PerformanceSceneVariant }) {
  const { phase } = useSceneTimeline(3, CAPTIONS[variant], 10);
  const Visual = VARIANTS[variant];
  return <Visual phase={phase} />;
}
