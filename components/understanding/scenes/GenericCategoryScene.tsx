"use client";

import type { FC } from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

function SafetyDiagram({ phase }: { phase: number }) {
  const deploy = phase > 0.35 && phase < 0.7;
  return (
    <g>
      <path
        d="M 350 55 L 310 75 L 320 120 L 350 140 L 380 120 L 390 75 Z"
        fill={SCENE_COLORS.accentSoft}
        stroke={SCENE_COLORS.accentStroke}
        strokeWidth={2}
      />
      <path
        d="M 350 70 L 325 85 L 332 115 L 350 128 L 368 115 L 375 85 Z"
        fill="none"
        stroke={SCENE_COLORS.secondary}
        strokeWidth={1.5}
        opacity={0.7}
      />
      {deploy && (
        <circle cx="350" cy="95" r={deploy ? 18 + (phase - 0.35) * 30 : 0} fill="rgba(200,76,49,0.2)" />
      )}
      <text x="318" y="165" fill={SCENE_COLORS.textSecondary} fontSize={10} fontFamily="monospace">
        passive protection layers
      </text>
    </g>
  );
}

function ComfortDiagram({ phase }: { phase: number }) {
  const flow = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;
  return (
    <g>
      <rect x="280" y="90" width="140" height="50" rx={8} fill="#252528" stroke="rgba(245,241,232,0.1)" />
      <rect x="300" y="75" width="40" height="20" rx={4} fill={SCENE_COLORS.accent} opacity={0.6} />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${320 + i * 25} 70 Q ${340 + i * 25} ${50 - flow * 10} ${360 + i * 25} 70`}
          fill="none"
          stroke={SCENE_COLORS.secondary}
          strokeWidth={2}
          opacity={0.4 + flow * 0.5}
        />
      ))}
      <text x="305" y="165" fill={SCENE_COLORS.textSecondary} fontSize={10} fontFamily="monospace">
        cabin comfort zone
      </text>
    </g>
  );
}

function TechDiagram({ phase }: { phase: number }) {
  const link = phase > 0.3 && phase < 0.75;
  return (
    <g>
      <rect x="250" y="85" width="44" height="70" rx={8} fill="#1a1a1e" stroke={SCENE_COLORS.textSecondary} />
      <rect x="406" y="75" width="100" height="60" rx={6} fill="#252528" stroke={SCENE_COLORS.accentStroke} />
      {link && (
        <>
          <path
            d="M 294 110 Q 350 80 406 105"
            fill="none"
            stroke={SCENE_COLORS.accent}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
          <circle cx="350" cy="92" r={6} fill={SCENE_COLORS.accent} opacity={0.6 + 0.4 * Math.sin(phase * 12)} />
        </>
      )}
      <text x="295" y="165" fill={SCENE_COLORS.textSecondary} fontSize={10} fontFamily="monospace">
        wireless link
      </text>
    </g>
  );
}

function ConvenienceDiagram({ phase }: { phase: number }) {
  const unlock = phase > 0.4;
  return (
    <g>
      <rect x="270" y="95" width="160" height="55" rx={6} fill="#252528" />
      <rect x="395" y="105" width="20" height="35" rx={3} fill="#1a1a1e" />
      <ellipse cx="310" cy="120" rx={22} ry={14} fill={SCENE_COLORS.secondary} opacity={0.8} />
      {unlock && (
        <text x="340" y="125" fill={SCENE_COLORS.accent} fontSize={11} fontFamily="monospace">
          unlock
        </text>
      )}
      <text x="295" y="165" fill={SCENE_COLORS.textSecondary} fontSize={10} fontFamily="monospace">
        keyless access
      </text>
    </g>
  );
}

function PerformanceDiagram({ phase }: { phase: number }) {
  const needle = -120 + phase * 240;
  return (
    <g>
      <circle cx="350" cy="110" r={50} fill="#1a1a1e" stroke={SCENE_COLORS.textSecondary} strokeWidth={2} />
      <line
        x1="350"
        y1="110"
        x2={350 + 38 * Math.cos((needle * Math.PI) / 180)}
        y2={110 + 38 * Math.sin((needle * Math.PI) / 180)}
        stroke={SCENE_COLORS.accent}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <text x="325" y="165" fill={SCENE_COLORS.textSecondary} fontSize={10} fontFamily="monospace">
        power band
      </text>
    </g>
  );
}

const DIAGRAMS: Record<string, FC<{ phase: number }>> = {
  "generic-safety": SafetyDiagram,
  "generic-comfort": ComfortDiagram,
  "generic-tech": TechDiagram,
  "generic-convenience": ConvenienceDiagram,
  "generic-performance": PerformanceDiagram,
};

export default function GenericCategoryScene({ scene }: { scene: string }) {
  const { phase } = useSceneTimeline(3);
  const Diagram = DIAGRAMS[scene] ?? SafetyDiagram;

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full">
      <circle cx="350" cy="100" r={70} fill="rgba(200,76,49,0.04)" />
      <Diagram phase={phase} />
    </svg>
  );
}
