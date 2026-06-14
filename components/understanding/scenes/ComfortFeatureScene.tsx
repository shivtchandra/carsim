"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { CANVAS_H, CANVAS_W, SCENE_COLORS } from "./shared/sceneTokens";
import { CalloutBadge } from "./shared/ScenePrimitives";

export type ComfortSceneVariant =
  | "ventilated-seats"
  | "auto-ac"
  | "rear-ac-vents"
  | "sunroof"
  | "leatherette-seats"
  | "powered-driver-seat";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="absolute inset-0 h-full w-full bg-[#0F0F11]">
      <defs>
        <pattern id="comfort-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#comfort-grid)" />
      <text x="18" y="18" fill={SCENE_COLORS.textSecondary} fontSize={9} fontFamily="monospace">
        COMFORT // {label}
      </text>
      {children}
    </svg>
  );
}

function VentilatedSeatsVisual({ phase }: { phase: number }) {
  const active = phase > 0.28;
  const flow = active ? 0.35 + Math.sin(phase * 12) * 0.3 : 0;

  return (
    <Frame label="ventilated front seats">
      <rect x="200" y="52" width="300" height="108" rx="14" fill="#17171A" stroke="rgba(79,107,138,0.25)" strokeWidth={1.5} />
      {/* Driver seat */}
      <path d="M 230,130 L 250,70 L 310,62 L 340,130 Z" fill="#252528" stroke={SCENE_COLORS.secondary} strokeWidth={1} />
      <path d="M 240,95 L 300,88 L 320,115 L 250,120 Z" fill={active ? "rgba(53,214,255,0.08)" : "#1a1a1e"} stroke={active ? "#35D6FF" : SCENE_COLORS.secondary} strokeWidth={0.75} />
      {/* Perforation dots */}
      {Array.from({ length: 24 }).map((_, i) => (
        <circle key={i} cx={248 + (i % 6) * 10} cy={92 + Math.floor(i / 6) * 7} r={1.2} fill={active ? "#35D6FF" : SCENE_COLORS.textSecondary} opacity={0.5} />
      ))}
      {/* Passenger seat */}
      <path d="M 380,130 L 400,70 L 460,62 L 490,130 Z" fill="#252528" stroke={SCENE_COLORS.secondary} strokeWidth={1} />

      {active &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M 280 ${118 - i * 8} Q 290 ${88 - i * 10} 300 ${118 - i * 8}`}
            fill="none"
            stroke="#35D6FF"
            strokeWidth={1.5}
            opacity={flow - i * 0.15}
          />
        ))}

      <CalloutBadge x={430} y={42} text={active ? "seat fans blowing" : "perforated upholstery"} visible />
      <CalloutBadge x={430} y={62} text="back stays dry" visible={active && phase > 0.55} />
    </Frame>
  );
}

function AutoAcVisual({ phase }: { phase: number }) {
  const autoOn = phase > 0.25;
  const stable = phase > 0.55;
  const cabinTemp = autoOn ? (stable ? 22 : 28 - (phase - 0.25) * 20) : 34;

  return (
    <Frame label="automatic climate control">
      {/* Cabin outline */}
      <rect x="180" y="48" width="340" height="112" rx="14" fill="#17171A" stroke="rgba(79,107,138,0.25)" strokeWidth={1.5} />
      {/* AC panel */}
      <rect x="300" y="68" width="100" height="52" rx={6} fill="#121215" stroke="rgba(79,107,138,0.35)" strokeWidth={1} />
      <text x="350" y="82" fill={SCENE_COLORS.textPrimary} fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
        AUTO
      </text>
      <text x="350" y="98" fill={autoOn ? "#35D6FF" : SCENE_COLORS.textSecondary} fontSize={14} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
        {Math.round(cabinTemp)}°
      </text>
      <text x="350" y="112" fill={SCENE_COLORS.textSecondary} fontSize={6} fontFamily="monospace" textAnchor="middle">
        target 22°C
      </text>

      {/* Vent airflow */}
      {autoOn && (
        <>
          <path d="M 350,68 Q 320,48 280,58" fill="none" stroke="#35D6FF" strokeWidth={1.5} opacity={0.4 + Math.sin(phase * 8) * 0.2} />
          <path d="M 350,68 Q 380,48 420,58" fill="none" stroke="#35D6FF" strokeWidth={1.5} opacity={0.4 + Math.sin(phase * 8 + 1) * 0.2} />
        </>
      )}

      <CalloutBadge x={430} y={42} text={stable ? "temp locked — no fiddling" : autoOn ? "compressor adjusting" : "manual AC struggle"} visible />
    </Frame>
  );
}

function RearAcVentsVisual({ phase }: { phase: number }) {
  const blowing = phase > 0.3;
  const flow = blowing ? 0.4 + Math.sin(phase * 10) * 0.35 : 0;

  return (
    <Frame label="rear AC vents">
      <rect x="170" y="44" width="360" height="120" rx="14" fill="#17171A" stroke="rgba(79,107,138,0.25)" strokeWidth={1.5} />
      {/* Top-down cabin */}
      <rect x="210" y="68" width="280" height="72" rx={8} fill="#1a1a1e" />
      {/* Front seats */}
      <rect x="240" y="78" width="50" height="40" rx={6} fill="#252528" />
      <rect x="410" y="78" width="50" height="40" rx={6} fill="#252528" />
      {/* Rear seats */}
      <rect x="280" y="88" width="140" height="44" rx={6} fill="#252528" stroke={blowing ? "#35D6FF" : SCENE_COLORS.secondary} strokeWidth={blowing ? 1 : 0.5} />
      {/* Centre console tunnel vents */}
      <rect x="345" y="72" width="10" height="8" rx={2} fill={SCENE_COLORS.secondary} />
      {blowing &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M 350 ${80 + i * 6} Q 350 ${100 + i * 8} 350 ${118 + i * 4}`}
            fill="none"
            stroke="#35D6FF"
            strokeWidth={2}
            opacity={flow - i * 0.12}
            markerEnd="url(#arrow)"
          />
        ))}

      <CalloutBadge x={430} y={42} text={blowing ? "rear row gets direct air" : "front-only AC"} visible />
    </Frame>
  );
}

function SunroofVisual({ phase }: { phase: number }) {
  const open = phase > 0.32 ? Math.min(1, (phase - 0.32) / 0.35) : 0;
  const closing = phase > 0.78 ? (phase - 0.78) / 0.2 : 0;
  const progress = open * (1 - closing);

  return (
    <Frame label="electric sunroof">
      <rect x="180" y="48" width="340" height="112" rx="14" fill="#17171A" stroke="rgba(79,107,138,0.25)" strokeWidth={1.5} />
      {/* Roof */}
      <rect x="220" y="58" width="260" height="72" rx={6} fill="#252528" />
      {/* Glass panel slides back */}
      <rect x={240 + progress * 40} y="62" width={120 - progress * 20} height="28" rx={3} fill="rgba(53,214,255,0.15)" stroke="#35D6FF" strokeWidth={1} opacity={0.5 + progress * 0.5} />
      {/* Light beam */}
      {progress > 0.2 && (
        <path d="M 280,90 L 280,130 L 340,130 L 340,90 Z" fill="rgba(245,241,232,0.06)" opacity={progress * 0.8} />
      )}
      {/* Front seats silhouette */}
      <rect x="260" y="98" width="44" height="36" rx={5} fill="#1a1a1e" />
      <rect x="396" y="98" width="44" height="36" rx={5} fill="#1a1a1e" />

      <CalloutBadge x={430} y={42} text={progress > 0.5 ? "tilt / slide open" : "glass closed"} visible />
    </Frame>
  );
}

function LeatheretteVisual({ phase }: { phase: number }) {
  const spill = phase > 0.25 && phase < 0.65;
  const wiped = phase >= 0.65;
  const wipeProgress = wiped ? Math.min(1, (phase - 0.65) / 0.25) : 0;

  return (
    <Frame label="leatherette upholstery">
      <path d="M 220,130 L 250,62 L 420,62 L 480,130 Z" fill="#3d2b24" stroke={SCENE_COLORS.secondary} strokeWidth={1.5} />
      {/* Stitch lines */}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={260 + i * 45} y1="72" x2={250 + i * 48} y2="118" stroke="rgba(245,241,232,0.15)" strokeWidth={1} />
      ))}
      {spill && (
        <ellipse cx="340" cy="95" rx="22" ry="10" fill="rgba(200,76,49,0.35)" />
      )}
      {wiped && (
        <>
          <rect x={280 + wipeProgress * 80} y="78" width="36" height="40" rx={4} fill="rgba(53,214,255,0.08)" stroke="#35D6FF" strokeWidth={0.75} opacity={0.7} />
          <text x="350" y="100" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace" textAnchor="middle" opacity={wipeProgress}>
            wipe clean
          </text>
        </>
      )}
      <CalloutBadge x={430} y={42} text={wiped ? "spill wipes off fast" : spill ? "juice on seat" : "premium feel"} visible />
    </Frame>
  );
}

function PoweredSeatVisual({ phase }: { phase: number }) {
  const adjusting = phase > 0.28;
  const slide = adjusting ? Math.sin(phase * 6) * 12 : 0;
  const recline = adjusting && phase > 0.55 ? (phase - 0.55) * 25 : 0;

  return (
    <Frame label="powered driver seat">
      <g transform={`translate(${slide}, 0)`}>
        <path d={`M 240,130 L 260,${78 - recline * 0.3} L 360,${70 - recline * 0.5} L 390,130 Z`} fill="#252528" stroke={SCENE_COLORS.secondary} strokeWidth={1.5} />
        <rect x="268" y="88" width="90" height="36" rx={6} fill="#3d2b24" stroke="rgba(79,107,138,0.3)" strokeWidth={0.75} />
      </g>
      {/* Switch panel on door */}
      <rect x="420" y="88" width="48" height="56" rx={4} fill="#121215" stroke="rgba(79,107,138,0.35)" strokeWidth={1} />
      {["▲", "▼", "◀", "▶"].map((icon, i) => (
        <text key={i} x={444} y={102 + i * 12} fill={adjusting && i === Math.floor(phase * 8) % 4 ? "#35D6FF" : SCENE_COLORS.textSecondary} fontSize={8} fontFamily="monospace" textAnchor="middle">
          {icon}
        </text>
      ))}

      {adjusting && (
        <>
          <path d="M 390,108 L 418,108" fill="none" stroke="#35D6FF" strokeWidth={1.5} strokeDasharray="3 3" />
          <path d="M 320,72 L 320,52" fill="none" stroke="#35D6FF" strokeWidth={1.5} markerEnd="url(#arrow)" />
        </>
      )}

      <CalloutBadge x={430} y={42} text={adjusting ? "electric 6/8-way adjust" : "manual crank"} visible />
    </Frame>
  );
}

const VARIANTS: Record<ComfortSceneVariant, React.FC<{ phase: number }>> = {
  "ventilated-seats": VentilatedSeatsVisual,
  "auto-ac": AutoAcVisual,
  "rear-ac-vents": RearAcVentsVisual,
  sunroof: SunroofVisual,
  "leatherette-seats": LeatheretteVisual,
  "powered-driver-seat": PoweredSeatVisual,
};

const CAPTIONS: Record<ComfortSceneVariant, { at: number; text: string }[]> = {
  "ventilated-seats": [
    { at: 0, text: "Perforated seat leather lets air pass through the cushion." },
    { at: 3, text: "Built-in fans push air — your back stops sticking in summer." },
    { at: 6, text: "The comfort feature owners actually use daily in hot cities." },
  ],
  "auto-ac": [
    { at: 0, text: "Set 22°C once — the system manages fan speed and compressor." },
    { at: 3, text: "Cabin cools down without constant knob fiddling." },
    { at: 6, text: "Temperature stays stable through traffic and sun load." },
  ],
  "rear-ac-vents": [
    { at: 0, text: "Second row gets its own vents from the centre tunnel." },
    { at: 3, text: "Direct airflow reaches rear passengers — not just front-row cold." },
    { at: 6, text: "Essential for families in Indian heat — rear seats stay usable." },
  ],
  sunroof: [
    { at: 0, text: "Single electric glass panel above the front row." },
    { at: 3, text: "Tilt or slide open — cabin feels brighter and airier." },
    { at: 6, text: "Mostly a desirability upgrade; vent position beats full open in summer." },
  ],
  "leatherette-seats": [
    { at: 0, text: "Synthetic leather look with stitched panels and easier upkeep." },
    { at: 3, text: "Spills sit on the surface instead of soaking into fabric." },
    { at: 6, text: "Wipe clean in seconds — handy with kids and daily commute." },
  ],
  "powered-driver-seat": [
    { at: 0, text: "Electric motors adjust height, reach, and backrest angle." },
    { at: 3, text: "Fine-tune driving position without manual levers under the seat." },
    { at: 6, text: "Shared cars and long commutes — everyone finds their fit faster." },
  ],
};

export default function ComfortFeatureScene({ variant }: { variant: ComfortSceneVariant }) {
  const { phase } = useSceneTimeline(3, CAPTIONS[variant], 10);
  const Visual = VARIANTS[variant];
  return <Visual phase={phase} />;
}
