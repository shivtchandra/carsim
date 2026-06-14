"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function PanoSunroofScene() {
  const { t, phase } = useSceneTimeline(3, [
    { at: 0, text: "Shade closed — cabin feels like a normal car." },
    { at: 3, text: "Slide the shade — panoramic glass brightens the whole cabin." },
    { at: 6, text: "Evening highway: open vent, not full sun. Ambience upgrade." },
  ], 10);

  // Sunroof sequence:
  // Phase 0.0 - 0.1: Closed
  // Phase 0.1 - 0.4: Shade opens
  // Phase 0.4 - 0.45: Pause
  // Phase 0.45 - 0.75: Glass slides open
  // Phase 0.75 - 0.85: Pause (fully open)
  // Phase 0.85 - 1.0: Close both smoothly to loop
  let shadeProgress = 0;
  let glassProgress = 0;

  if (phase >= 0.1 && phase < 0.4) {
    shadeProgress = (phase - 0.1) / 0.3;
  } else if (phase >= 0.4 && phase < 0.85) {
    shadeProgress = 1;
  } else if (phase >= 0.85) {
    const closeProgress = (phase - 0.85) / 0.15;
    shadeProgress = 1 - closeProgress;
  }

  if (phase >= 0.45 && phase < 0.75) {
    glassProgress = (phase - 0.45) / 0.3;
  } else if (phase >= 0.75 && phase < 0.85) {
    glassProgress = 1;
  } else if (phase >= 0.85) {
    const closeProgress = (phase - 0.85) / 0.15;
    glassProgress = 1 - closeProgress;
  }

  // Opening range: X = 250 to X = 410 (width 160px)
  const apertureWidth = 160;
  const xStart = 250;
  const xEnd = xStart + apertureWidth;

  // Shade slides to the right (hides under the rear roof)
  const shadeWidth = apertureWidth * (1 - shadeProgress);
  const shadeX = xStart + shadeProgress * apertureWidth;

  // Glass slides right, overlapping the rear roof (XOffset up to 120px)
  const glassXOffset = glassProgress * 120;

  // Light beam coordinates: from the open portion of the sunroof down to the cabin floor
  // Open portion: X goes from xStart (250) to xStart + shadeProgress * apertureWidth
  const openWidth = shadeProgress * apertureWidth;
  const lightOpacity = shadeProgress * 0.25;

  // Floating dust particles inside the cabin when sunroof opens
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const seed = Math.sin(i * 9.8) * 0.5 + 0.5; // 0 to 1
    const x = xStart + 20 + seed * 160 + Math.sin(t * 0.5 + i) * 8;
    const y = 70 + ((i * 7) % 60) - Math.cos(t * 0.3 + i) * 12;
    const size = 1 + (i % 2);
    const opacity = shadeProgress * (0.15 + 0.45 * Math.sin(t * 2 + i));
    return { x, y, size, opacity };
  });

  // Breeze flow lines (only when glass is open)
  const breezeLines = [
    { d: `M 240,42 Q 280,${46 + Math.sin(t * 4) * 4} 340,65`, opacity: glassProgress * 0.4 },
    { d: `M 270,42 Q 310,${44 + Math.cos(t * 4) * 4} 370,75`, opacity: glassProgress * 0.3 },
  ];

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      {/* Blueprint Grid */}
      <defs>
        <pattern id="blueprint-grid-sunroof" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
        {/* Sunlight gradient */}
        <linearGradient id="sunlight-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#35D6FF" stopOpacity={0.6} />
          <stop offset="40%" stopColor="#35D6FF" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#35D6FF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid-sunroof)" />

      {/* Axis and annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="20">SEC S-18 // PANORAMIC SUNROOF SCHEMATIC</text>
        <text x="10" y="32">SHADE: {Math.round(shadeProgress * 100)}% OPEN // GLASS: {Math.round(glassProgress * 100)}% OPEN</text>
        <line x1="5" y1="180" x2="695" y2="180" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <line x1="50" y1="10" x2="50" y2="190" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── SUNLIGHT CONE ── */}
      {openWidth > 0 && (
        <polygon
          points={`${xStart},50 ${xStart + openWidth},50 ${xStart + openWidth + 30},148 ${xStart - 30},148`}
          fill="url(#sunlight-gradient)"
          opacity={lightOpacity}
        />
      )}

      {/* ── CAR BODY OUTLINE (Automotive Schematic Cutaway) ── */}
      <path
        d="M 100,150 
           L 130,150 
           L 155,115 
           L 210,65 
           L 250,50 
           L 410,50 
           L 490,50 
           L 550,110 
           L 570,150 
           Z"
        fill="none"
        stroke="rgba(79, 107, 138, 0.4)"
        strokeWidth={1.5}
      />
      {/* Floor & Engine separation */}
      <line x1="130" y1="150" x2="550" y2="150" stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1.5} />
      <line x1="155" y1="115" x2="210" y2="115" stroke="rgba(79, 107, 138, 0.2)" strokeWidth={1} strokeDasharray="3 3" />

      {/* ── SUNROOF ASSEMBLY MECHANICS ── */}
      {/* Sunroof frame boundary guides */}
      <line x1={xStart} y1={46} x2={xEnd} y2={46} stroke="rgba(79, 107, 138, 0.2)" strokeWidth={1} strokeDasharray="2 2" />

      {/* Glass roof panel (slides back) */}
      <rect
        x={xStart + glassXOffset}
        y="42"
        width={apertureWidth}
        height="4"
        rx="1"
        fill="#35D6FF"
        stroke="#35D6FF"
        strokeWidth={0.5}
        opacity={0.8}
      />
      {/* Glazing details */}
      <line x1={xStart + glassXOffset + 15} y1="44" x2={xStart + glassXOffset + 35} y2="44" stroke="#0F0F11" strokeWidth={1} />
      <line x1={xStart + glassXOffset + 125} y1="44" x2={xStart + glassXOffset + 145} y2="44" stroke="#0F0F11" strokeWidth={1} />

      {/* Sunroof shade (retracts to the right) */}
      {shadeWidth > 0 && (
        <rect
          x={shadeX}
          y="48"
          width={shadeWidth}
          height={3}
          fill={SCENE_COLORS.secondary}
          opacity={0.9}
        />
      )}

      {/* ── SEATS & PASSENGER FIGURES ── */}
      {/* Front Seat */}
      <g>
        <path d="M 220,146 L 255,146" stroke={SCENE_COLORS.secondary} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M 225,146 L 215,96" stroke={SCENE_COLORS.secondary} strokeWidth={2} strokeLinecap="round" />
        {/* Driver */}
        <circle cx={228} cy={82} r={6} fill="#1E1E22" stroke={SCENE_COLORS.secondary} strokeWidth={1} />
        <path d="M 228,88 L 226,112 L 242,138" fill="none" stroke={SCENE_COLORS.secondary} strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
        {/* Steering Wheel */}
        <circle cx={256} cy={105} r={8} fill="none" stroke="rgba(245,241,232,0.15)" strokeWidth={1} />
      </g>

      {/* Rear Seat */}
      <g>
        <path d="M 325,146 L 360,146" stroke={SCENE_COLORS.secondary} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M 333,146 L 323,96" stroke={SCENE_COLORS.secondary} strokeWidth={2} strokeLinecap="round" />
        {/* Rear passenger */}
        <circle cx={338} cy={81} r={6} fill="#1E1E22" stroke={SCENE_COLORS.secondary} strokeWidth={1} />
        <path d="M 338,87 L 336,112 L 348,138" fill="none" stroke={SCENE_COLORS.secondary} strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
      </g>

      {/* ── BREEZE FLOW & PARTICLES ── */}
      {/* Animated dust/light particles */}
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill="#35D6FF"
          opacity={p.opacity}
        />
      ))}

      {/* Animated wind lines */}
      {breezeLines.map((b, i) => (
        <path
          key={i}
          d={b.d}
          fill="none"
          stroke="#35D6FF"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={b.opacity}
        />
      ))}

      {/* Status Verdict Banner */}
      <g transform="translate(480, 20)">
        <rect x="0" y="0" width="200" height="42" rx={6} fill="rgba(79, 107, 138, 0.05)" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <text x="10" y="15" fill={SCENE_COLORS.textPrimary} fontSize={9} fontFamily="monospace" fontWeight="bold">PANORAMIC SUNROOF STATE</text>
        <text x="10" y="27" fill={glassProgress > 0 ? "#35D6FF" : SCENE_COLORS.textSecondary} fontSize={8} fontFamily="monospace">
          GLASS: {glassProgress > 0 ? `${Math.round(glassProgress * 100)}% OPEN` : "CLOSED"}
        </text>
        <text x="10" y="37" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace">
          STATUS: {shadeProgress < 0.2 ? "CLOSED" : glassProgress > 0.8 ? "CABIN AIRY & BRIGHT" : "VENTILATING"}
        </text>
      </g>
    </svg>
  );
}
