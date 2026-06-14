"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { CANVAS_H, CANVAS_W, SCENE_COLORS } from "./shared/sceneTokens";
import { CalloutBadge, CarSide, CarTop } from "./shared/ScenePrimitives";

export type ConvenienceSceneVariant =
  | "rear-camera"
  | "camera-360"
  | "front-parking-sensors"
  | "auto-headlamps"
  | "auto-wipers"
  | "keyless-entry"
  | "auto-dimming-irvm"
  | "led-drl"
  | "rear-defogger";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="absolute inset-0 h-full w-full bg-[#0F0F11]">
      <rect width="100%" height="100%" fill={SCENE_COLORS.viewportBg} />
      <circle cx="350" cy="100" r="72" fill="rgba(200,76,49,0.05)" />
      <text x="18" y="18" fill={SCENE_COLORS.textSecondary} fontSize={9} fontFamily="monospace">
        CONVENIENCE // {label}
      </text>
      {children}
    </svg>
  );
}

function RearCameraVisual({ phase }: { phase: number }) {
  const guideOffset = phase < 0.35 ? 0 : phase < 0.75 ? (phase - 0.35) * 40 : 16;
  return (
    <Frame label="rear camera">
      <rect x="120" y="42" width="460" height="116" rx="14" fill="#17171A" stroke="rgba(245,241,232,0.1)" />
      <rect x="138" y="56" width="424" height="88" rx="8" fill="#111318" />
      <CarTop x={292} y={108} w={110} h={28} color="#4F6B8A" />
      <path d={`M 254 124 Q 350 ${74 + guideOffset} 446 124`} fill="none" stroke="#C84C31" strokeWidth={2.5} />
      <path d={`M 274 124 Q 350 ${92 + guideOffset * 0.65} 426 124`} fill="none" stroke="#d97706" strokeWidth={2} />
      <line x1="350" y1="58" x2="350" y2="144" stroke="rgba(245,241,232,0.18)" strokeDasharray="4 5" />
      <CalloutBadge x={470} y={42} text="parking guides active" visible={phase > 0.28} />
    </Frame>
  );
}

function Camera360Visual({ phase }: { phase: number }) {
  const pulse = 0.45 + Math.sin(phase * Math.PI * 2) * 0.2;
  return (
    <Frame label="360 camera">
      <rect x="210" y="50" width="280" height="100" rx="14" fill="#17171A" stroke="rgba(245,241,232,0.1)" />
      <CarTop x={310} y={74} w={80} h={52} color="#C84C31" />
      {[
        { x: 350, y: 34 },
        { x: 350, y: 146 },
        { x: 250, y: 100 },
        { x: 450, y: 100 },
      ].map((node, i) => (
        <g key={i}>
          <circle cx={node.x} cy={node.y} r={8} fill={SCENE_COLORS.secondary} />
          <line x1={node.x} y1={node.y} x2="350" y2="100" stroke={`rgba(79,107,138,${pulse})`} strokeDasharray="4 4" />
        </g>
      ))}
      <rect x="255" y="54" width="190" height="92" rx="10" fill="none" stroke="rgba(200,76,49,0.35)" strokeDasharray="6 5" />
      <CalloutBadge x={472} y={42} text="top view stitch" visible={phase > 0.22} />
    </Frame>
  );
}

function FrontSensorVisual({ phase }: { phase: number }) {
  const ping = phase < 0.35 ? 0 : phase < 0.7 ? (phase - 0.35) / 0.35 : 1;
  const opacity = 0.2 + ping * 0.8;
  return (
    <Frame label="front sensors">
      <CarSide x={190} y={78} w={210} h={62} color="#4F6B8A" />
      <rect x="498" y="86" width="26" height="54" rx="4" fill="#5B4A42" />
      {[0, 1, 2].map((ring) => (
        <path
          key={ring}
          d={`M ${390 + ring * 8} 110 Q ${448 + ring * 18} ${70 - ring * 6} ${498} 110`}
          fill="none"
          stroke={`rgba(200,76,49,${opacity - ring * 0.18})`}
          strokeWidth={2}
        />
      ))}
      <CalloutBadge x={455} y={38} text="beep rate rising" variant="warning" visible={phase > 0.35} />
    </Frame>
  );
}

function AutoHeadlampVisual({ phase }: { phase: number }) {
  const dark = phase > 0.32;
  const beamOpacity = dark ? 0.2 + (phase > 0.55 ? 0.35 : 0.18) : 0;
  return (
    <Frame label="auto headlamps">
      <rect x="0" y="0" width="700" height="200" fill={dark ? "#0B0D12" : "#18212D"} opacity={0.9} />
      <circle cx="560" cy="44" r="18" fill={dark ? "rgba(245,241,232,0.12)" : "#F3D9A6"} />
      <CarSide x={160} y={92} w={220} h={56} color="#C84C31" />
      <path d="M 370 114 L 520 80 L 520 148 Z" fill={`rgba(245,241,232,${beamOpacity})`} />
      <circle cx="372" cy="112" r="7" fill={dark ? "#F5F1E8" : "#4F6B8A"} />
      <CalloutBadge x={462} y={32} text={dark ? "low light detected" : "daylight"} visible />
    </Frame>
  );
}

function AutoWiperVisual({ phase }: { phase: number }) {
  const sweep = Math.sin(phase * Math.PI * 2) * 36;
  const rainVisible = phase > 0.2;
  return (
    <Frame label="rain wipers">
      <rect x="184" y="30" width="332" height="140" rx="18" fill="#1A1C22" stroke="rgba(245,241,232,0.1)" />
      {rainVisible &&
        Array.from({ length: 15 }).map((_, i) => (
          <line
            key={i}
            x1={220 + i * 18}
            y1={48 + (i % 4) * 10}
            x2={214 + i * 18}
            y2={66 + (i % 4) * 10}
            stroke="rgba(245,241,232,0.25)"
            strokeWidth={1.5}
          />
        ))}
      <g transform={`rotate(${sweep}, 350, 148)`}>
        <line x1="350" y1="148" x2="278" y2="92" stroke="#4F6B8A" strokeWidth={5} strokeLinecap="round" />
      </g>
      <g transform={`rotate(${-sweep * 0.9}, 350, 148)`}>
        <line x1="350" y1="148" x2="422" y2="92" stroke="#4F6B8A" strokeWidth={5} strokeLinecap="round" />
      </g>
      <CalloutBadge x={458} y={34} text="rain sensor active" visible={phase > 0.25} />
    </Frame>
  );
}

function KeylessVisual({ phase }: { phase: number }) {
  const unlock = phase > 0.4;
  return (
    <Frame label="keyless entry">
      <CarSide x={190} y={84} w={250} h={62} color="#4F6B8A" />
      <circle cx="464" cy="110" r="10" fill="#252528" stroke="rgba(245,241,232,0.2)" />
      <circle cx="110" cy="104" r="26" fill="rgba(200,76,49,0.12)" stroke="rgba(200,76,49,0.4)" />
      <path d="M 110 96 L 110 112 L 126 112" fill="none" stroke="#C84C31" strokeWidth={3} strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${140 + i * 12} 104 Q ${168 + i * 16} ${88 - i * 6} ${196 + i * 18} 104`}
          fill="none"
          stroke={`rgba(200,76,49,${unlock ? 0.7 - i * 0.2 : 0.18})`}
          strokeWidth={2}
        />
      ))}
      <CalloutBadge x={452} y={38} text={unlock ? "door unlocked" : "approach key"} visible />
    </Frame>
  );
}

function DimmingMirrorVisual({ phase }: { phase: number }) {
  const glare = phase > 0.3 && phase < 0.7;
  return (
    <Frame label="auto dimming mirror">
      <rect x="272" y="40" width="156" height="54" rx="18" fill={glare ? "#2A1E1D" : "#252528"} stroke="rgba(245,241,232,0.18)" />
      <rect x="344" y="18" width="12" height="24" rx="6" fill="#404040" />
      <circle cx="150" cy="108" r="16" fill="#4F6B8A" opacity={0.65} />
      <circle cx="552" cy="108" r={glare ? 28 : 18} fill={glare ? "rgba(245,241,232,0.4)" : "rgba(245,241,232,0.18)"} />
      <line x1="168" y1="108" x2="272" y2="68" stroke="rgba(245,241,232,0.16)" strokeDasharray="4 5" />
      <line x1="428" y1="68" x2="534" y2="108" stroke={glare ? "rgba(200,76,49,0.3)" : "rgba(245,241,232,0.12)"} strokeDasharray="4 5" />
      <CalloutBadge x={452} y={36} text={glare ? "glare reduced" : "normal reflect"} visible />
    </Frame>
  );
}

function LedDrlVisual({ phase }: { phase: number }) {
  const pulse = 0.35 + Math.sin(phase * Math.PI * 2) * 0.15;
  return (
    <Frame label="led drls & tail lamps">
      <CarSide x={160} y={88} w={280} h={58} color="#252528" />
      <rect x="166" y="108" width="16" height="8" rx="3" fill="#C84C31" opacity={0.75 + pulse} />
      <rect x="420" y="108" width="22" height="8" rx="3" fill="#F5F1E8" opacity={0.78 + pulse} />
      <path d="M 430 112 L 540 92" stroke={`rgba(245,241,232,${0.18 + pulse})`} strokeWidth={5} strokeLinecap="round" />
      <CalloutBadge x={456} y={34} text="signature lighting" visible />
    </Frame>
  );
}

function RearDefoggerVisual({ phase }: { phase: number }) {
  const clear = Math.min(1, Math.max(0, (phase - 0.35) / 0.45));
  return (
    <Frame label="rear defogger">
      <rect x="226" y="36" width="248" height="128" rx="18" fill="#16181D" stroke="rgba(245,241,232,0.14)" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect
          key={i}
          x="244"
          y={56 + i * 16}
          width={212}
          height={6}
          rx={3}
          fill={i < clear * 6 ? "rgba(79,107,138,0.18)" : "rgba(245,241,232,0.26)"}
        />
      ))}
      <path
        d="M 278 150 Q 350 108 422 150"
        fill="none"
        stroke="#4F6B8A"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <CalloutBadge x={460} y={38} text={phase > 0.38 ? "glass clearing" : "fogged rear view"} visible />
    </Frame>
  );
}

const VARIANTS: Record<ConvenienceSceneVariant, React.FC<{ phase: number }>> = {
  "rear-camera": RearCameraVisual,
  "camera-360": Camera360Visual,
  "front-parking-sensors": FrontSensorVisual,
  "auto-headlamps": AutoHeadlampVisual,
  "auto-wipers": AutoWiperVisual,
  "keyless-entry": KeylessVisual,
  "auto-dimming-irvm": DimmingMirrorVisual,
  "led-drl": LedDrlVisual,
  "rear-defogger": RearDefoggerVisual,
};

export default function ConvenienceFeatureScene({ variant }: { variant: ConvenienceSceneVariant }) {
  const { phase } = useSceneTimeline(3);
  const Visual = VARIANTS[variant];
  return <Visual phase={phase} />;
}
