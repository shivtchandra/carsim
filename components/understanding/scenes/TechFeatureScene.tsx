"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { CANVAS_H, CANVAS_W, SCENE_COLORS } from "./shared/sceneTokens";
import { CalloutBadge } from "./shared/ScenePrimitives";

export type TechSceneVariant =
  | "digital-cluster"
  | "connected-car"
  | "wireless-charger"
  | "premium-audio";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="absolute inset-0 h-full w-full bg-[#0F0F11]">
      <defs>
        <pattern id="tech-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tech-grid)" />
      <text x="18" y="18" fill={SCENE_COLORS.textSecondary} fontSize={9} fontFamily="monospace">
        TECH // {label}
      </text>
      {children}
    </svg>
  );
}

function DigitalClusterVisual({ phase }: { phase: number }) {
  const digitalOn = phase > 0.22;
  const mapWidget = phase > 0.55;
  const speed = digitalOn ? Math.min(120, 40 + phase * 90) : 0;
  const needleAngle = -130 + (speed / 120) * 260;

  return (
    <Frame label="digital instrument cluster">
      <g stroke="rgba(79, 107, 138, 0.25)" strokeWidth={1} fill="none">
        <path d="M 120,165 L 200,95 L 320,70 L 520,70 L 620,120 L 680,165" />
        <circle cx="195" cy="108" r="34" />
      </g>

      {/* Cluster bezel behind wheel */}
      <rect x="118" y="58" width="154" height="88" rx="10" fill="#121215" stroke="rgba(79, 107, 138, 0.35)" strokeWidth={1.5} />

      {!digitalOn ? (
        <g opacity={1 - phase * 3}>
          <circle cx="195" cy="102" r="38" fill="#17171A" stroke={SCENE_COLORS.textSecondary} strokeWidth={1.5} />
          <line
            x1="195"
            y1="102"
            x2={195 + 28 * Math.cos((-40 * Math.PI) / 180)}
            y2={102 + 28 * Math.sin((-40 * Math.PI) / 180)}
            stroke={SCENE_COLORS.textPrimary}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <text x="195" y="148" fill={SCENE_COLORS.textSecondary} fontSize={8} fontFamily="monospace" textAnchor="middle">
            analog dials
          </text>
        </g>
      ) : (
        <g>
          <rect x="124" y="64" width="142" height="76" rx="6" fill="#09060D" stroke="rgba(53,214,255,0.25)" strokeWidth={1} />
          {/* Speed arc */}
          <path d="M 145,118 A 50,50 0 1 1 245,118" fill="none" stroke="rgba(79,107,138,0.2)" strokeWidth={6} />
          <path
            d="M 145,118 A 50,50 0 0 1 245,118"
            fill="none"
            stroke="#35D6FF"
            strokeWidth={4}
            strokeDasharray={`${(speed / 120) * 157} 157`}
          />
          <line
            x1="195"
            y1="118"
            x2={195 + 34 * Math.cos((needleAngle * Math.PI) / 180)}
            y2={118 + 34 * Math.sin((needleAngle * Math.PI) / 180)}
            stroke="#C84C31"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <text x="195" y="108" fill={SCENE_COLORS.textPrimary} fontSize={16} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            {Math.round(speed)}
          </text>
          <text x="195" y="120" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace" textAnchor="middle">
            km/h
          </text>
          {/* Fuel + temp bars */}
          <rect x="132" y="128" width="36" height="4" rx={2} fill="rgba(79,107,138,0.2)" />
          <rect x="132" y="128" width={24} height={4} rx={2} fill="#10b981" />
          <rect x="222" y="128" width="36" height="4" rx={2} fill="rgba(79,107,138,0.2)" />
          <rect x="234" y="128" width={18} height={4} rx={2} fill="#f59e0b" />
          {mapWidget && (
            <g opacity={Math.min(1, (phase - 0.55) * 4)}>
              <rect x="248" y="72" width="44" height="34" rx={3} fill="rgba(53,214,255,0.08)" stroke="rgba(53,214,255,0.35)" strokeWidth={0.75} />
              <path d="M 252,88 L 288,88 M 262,74 L 262,98" stroke="rgba(79,107,138,0.25)" strokeWidth={1.5} />
              <path d="M 262,92 L 262,88 L 278,88" fill="none" stroke="#35D6FF" strokeWidth={1.25} />
              <text x="270" y="82" fill="#35D6FF" fontSize={5} fontFamily="monospace" textAnchor="middle">
                turn →
              </text>
            </g>
          )}
        </g>
      )}

      <CalloutBadge x={420} y={42} text={digitalOn ? "full digital layout" : "boot sequence"} visible={phase > 0.1} />
      <CalloutBadge x={420} y={62} text="nav in sightline" visible={mapWidget} />
    </Frame>
  );
}

function ConnectedCarVisual({ phase }: { phase: number }) {
  const tapped = phase > 0.38;
  const cooling = phase > 0.55;
  const temp = cooling ? Math.max(24, 42 - (phase - 0.55) * 50) : 42;

  return (
    <Frame label="connected car app">
      {/* Phone */}
      <rect x="88" y="48" width="96" height="118" rx="12" fill="#141416" stroke={SCENE_COLORS.secondary} strokeWidth={1.5} />
      <rect x="96" y="58" width="80" height="98" rx={6} fill="#09060D" />
      <text x="136" y="74" fill={SCENE_COLORS.textPrimary} fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
        MY CAR
      </text>
      <rect x="104" y="82" width="64" height="22" rx={4} fill={tapped ? "rgba(200,76,49,0.25)" : "rgba(79,107,138,0.12)"} stroke={tapped ? SCENE_COLORS.accent : SCENE_COLORS.secondary} strokeWidth={1} />
      <text x="136" y="96" fill={tapped ? SCENE_COLORS.accent : SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace" textAnchor="middle">
        Pre-cool cabin
      </text>
      <rect x="104" y="110" width="64" height="16" rx={3} fill="rgba(79,107,138,0.1)" />
      <text x="136" y="121" fill={SCENE_COLORS.textSecondary} fontSize={6} fontFamily="monospace" textAnchor="middle">
        Locate · Lock · Geo
      </text>

      {/* Car side profile */}
      <g transform="translate(280, 88)">
        <rect x="0" y="28" width="220" height="44" rx={8} fill="#252528" />
        <rect x="18" y="8" width="70" height="28" rx={6} fill="#1a1a1e" />
        <rect x="130" y="12" width="72" height="24" rx={5} fill="#1a1a1e" />
        <circle cx="48" cy="72" r="14" fill="#111318" stroke={SCENE_COLORS.secondary} />
        <circle cx="172" cy="72" r="14" fill="#111318" stroke={SCENE_COLORS.secondary} />
        {cooling && (
          <>
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M 90 ${20 - i * 4} Q 110 ${8 - i * 6} 130 ${20 - i * 4}`}
                fill="none"
                stroke="#35D6FF"
                strokeWidth={1.5}
                opacity={0.35 + Math.sin(phase * 12 + i) * 0.25}
              />
            ))}
            <text x="110" y="52" fill="#35D6FF" fontSize={10} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              {temp.toFixed(0)}°C
            </text>
          </>
        )}
      </g>

      {tapped && !cooling && (
        <path d="M 184 110 Q 240 90 280 100" fill="none" stroke={SCENE_COLORS.accent} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.7} />
      )}

      <CalloutBadge x={450} y={42} text={cooling ? "AC running remotely" : tapped ? "command sent" : "open app"} visible />
    </Frame>
  );
}

function WirelessChargerVisual({ phase }: { phase: number }) {
  const placed = phase > 0.2;
  const charging = phase > 0.42;
  const battery = charging ? Math.min(100, 20 + (phase - 0.42) * 180) : 20;
  const pulse = charging ? 0.4 + Math.sin(phase * 14) * 0.35 : 0;

  return (
    <Frame label="wireless phone charger">
      <g stroke="rgba(79, 107, 138, 0.25)" strokeWidth={1} fill="none">
        <path d="M 200,170 L 260,150 L 440,150 L 500,170" />
        <rect x="280" y="132" width="140" height="22" rx={4} fill="#141416" stroke="rgba(79,107,138,0.3)" />
      </g>

      {/* Qi pad */}
      <rect x="300" y="118" width="100" height="28" rx={5} fill="#17171A" stroke={charging ? "rgba(53,214,255,0.5)" : SCENE_COLORS.secondary} strokeWidth={1.5} />
      <circle cx="350" cy="132" r="10" stroke="rgba(79,107,138,0.3)" strokeWidth={1} fill="none" />
      <path d="M 350,122 L 350,142 M 340,132 L 360,132" stroke="rgba(79,107,138,0.25)" strokeWidth={1} />

      {charging && (
        <circle cx="350" cy="132" r={18 + pulse * 12} fill="none" stroke="#35D6FF" strokeWidth={1.5} opacity={0.5 - pulse * 0.2} />
      )}

      {/* Phone */}
      <g transform={`translate(318, ${placed ? 108 : 168})`} opacity={placed ? 1 : Math.max(0, 1 - (0.2 - phase) * 5)}>
        <rect x="0" y="0" width="64" height="12" rx={3} fill="#1e1e24" stroke={SCENE_COLORS.secondary} strokeWidth={1.25} />
        <rect x="4" y="2" width="56" height="8" rx={1} fill="rgba(53,214,255,0.06)" />
        <rect x="48" y="3" width="10" height="6" rx={1} fill="#111318" />
        <rect x="49" y="4" width={battery * 0.08} height={4} rx={0.5} fill={charging ? "#35D6FF" : SCENE_COLORS.textSecondary} />
      </g>

      <CalloutBadge x={430} y={42} text={charging ? `charging · ${Math.round(battery)}%` : placed ? "Qi pad aligned" : "drop phone on pad"} visible />
    </Frame>
  );
}

function PremiumAudioVisual({ phase }: { phase: number }) {
  const playing = phase > 0.3;
  const pulse = playing ? Math.sin(phase * 10) * 0.5 + 0.5 : 0;

  return (
    <Frame label="premium audio system">
      {/* Cabin outline */}
      <rect x="180" y="52" width="340" height="108" rx={16} fill="#17171A" stroke="rgba(79,107,138,0.25)" strokeWidth={1.5} />
      <rect x="210" y="68" width="120" height="76" rx={8} fill="#1a1a1e" />
      <rect x="370" y="68" width="120" height="76" rx={8} fill="#1a1a1e" />

      {/* Speaker locations */}
      {[
        { x: 198, y: 78, label: "tweeter" },
        { x: 198, y: 118, label: "mid" },
        { x: 488, y: 78, label: "tweeter" },
        { x: 488, y: 118, label: "mid" },
        { x: 330, y: 142, label: "sub" },
      ].map((sp, i) => (
        <g key={i}>
          <circle
            cx={sp.x}
            cy={sp.y}
            r={sp.label === "sub" ? 10 : 7}
            fill={playing ? "rgba(200,76,49,0.2)" : "rgba(79,107,138,0.15)"}
            stroke={playing ? SCENE_COLORS.accent : SCENE_COLORS.secondary}
            strokeWidth={1}
          />
          {playing && (
            <>
              <circle cx={sp.x} cy={sp.y} r={12 + pulse * 8} fill="none" stroke={SCENE_COLORS.accent} strokeWidth={1} opacity={0.35 - pulse * 0.15} />
              {[0, 1, 2].map((w) => (
                <path
                  key={w}
                  d={`M ${sp.x + 14} ${sp.y} Q ${sp.x + 28 + w * 8} ${sp.y - 10 + w * 8} ${sp.x + 42 + w * 10} ${sp.y}`}
                  fill="none"
                  stroke={SCENE_COLORS.accent}
                  strokeWidth={1}
                  opacity={0.25 + pulse * 0.35}
                />
              ))}
            </>
          )}
        </g>
      ))}

      {/* Brand badge */}
      <rect x="308" y="88" width="84" height="28" rx={4} fill="rgba(200,76,49,0.08)" stroke="rgba(200,76,49,0.35)" strokeWidth={1} />
      <text x="350" y="106" fill={SCENE_COLORS.textPrimary} fontSize={9} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
        PREMIUM
      </text>

      {/* Waveform center */}
      {playing && (
        <g transform="translate(290, 96)">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x={i * 8}
              y={12 - (4 + pulse * 10 * Math.abs(Math.sin(i + phase * 8)))}
              width={4}
              height={8 + pulse * 16 * Math.abs(Math.sin(i + phase * 8))}
              rx={1}
              fill="#35D6FF"
              opacity={0.5 + pulse * 0.4}
            />
          ))}
        </g>
      )}

      <CalloutBadge x={430} y={42} text={playing ? "multi-speaker staging" : "speaker layout"} visible />
    </Frame>
  );
}

const VARIANTS: Record<TechSceneVariant, React.FC<{ phase: number }>> = {
  "digital-cluster": DigitalClusterVisual,
  "connected-car": ConnectedCarVisual,
  "wireless-charger": WirelessChargerVisual,
  "premium-audio": PremiumAudioVisual,
};

const CAPTIONS: Record<TechSceneVariant, { at: number; text: string }[]> = {
  "digital-cluster": [
    { at: 0, text: "Fully digital cluster replaces analog dials with a crisp LCD panel." },
    { at: 3, text: "Speed, fuel, and trip data render with sharper graphics and smoother needles." },
    { at: 6, text: "Navigation turn prompts and media info can sit in your direct sightline." },
  ],
  "connected-car": [
    { at: 0, text: "SIM-linked app connects to your car from anywhere." },
    { at: 3, text: "Tap remote pre-cool before you walk to the parking lot." },
    { at: 6, text: "Cabin starts cooling in summer — the feature owners actually use daily." },
  ],
  "wireless-charger": [
    { at: 0, text: "Drop your phone on the Qi pad in the centre console." },
    { at: 3, text: "Coil aligns and tops up battery without a cable." },
    { at: 6, text: "Handy with wireless CarPlay — keeps charge from draining on long drives." },
  ],
  "premium-audio": [
    { at: 0, text: "More speakers and amplification across doors, dash, and subwoofer." },
    { at: 3, text: "Music staging opens up — clearer vocals and tighter bass at moderate volume." },
    { at: 6, text: "Best felt on highway cruises; road noise still limits gains at very high speed." },
  ],
};

export default function TechFeatureScene({ variant }: { variant: TechSceneVariant }) {
  const { phase } = useSceneTimeline(3, CAPTIONS[variant], 10);
  const Visual = VARIANTS[variant];
  return <Visual phase={phase} />;
}
