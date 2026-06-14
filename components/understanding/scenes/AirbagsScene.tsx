"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function AirbagsScene() {
  // 10s loop
  const { t, phase } = useSceneTimeline(3, undefined, 10);

  // Timeline events:
  // Phase 0.0 - 0.2: Normal driving (occupants sit upright, no airbags)
  // Phase 0.20 - 0.25: Front bumper impact (expanding red ripple rings)
  // Phase 0.25 - 0.32: Airbags inflate rapidly (0.07s / 700ms in slow-mo)
  // Phase 0.32 - 0.60: Occupants move forward, cushion in airbags
  // Phase 0.60 - 0.80: Airbags deflate and fade out
  // Phase 0.80 - 1.0: Return to normal (loop reset)

  let impactStage = 0; // 0: none, 1: hitting, 2: post-impact
  let airbagScale = 0;
  let occupantLean = 0; // 0 to 1 scale of forward lean
  let airbagOpacity = 0;

  if (phase >= 0.2 && phase < 0.25) {
    impactStage = 1;
  } else if (phase >= 0.25) {
    impactStage = 2;
  }

  // Airbag inflation scale and opacity
  if (phase >= 0.25 && phase < 0.32) {
    const p = (phase - 0.25) / 0.07;
    airbagScale = p;
    airbagOpacity = p * 0.75;
  } else if (phase >= 0.32 && phase < 0.6) {
    airbagScale = 1;
    airbagOpacity = 0.75;
  } else if (phase >= 0.6 && phase < 0.8) {
    const p = (phase - 0.6) / 0.2;
    airbagScale = 1 - p * 0.3; // shrink slightly
    airbagOpacity = 0.75 * (1 - p); // fade out
  }

  // Occupant lean forward (slow-mo deceleration and rebound)
  if (phase >= 0.27 && phase < 0.4) {
    // Leaning forward into airbag
    const p = (phase - 0.27) / 0.13;
    occupantLean = Math.sin(p * Math.PI / 2);
  } else if (phase >= 0.4 && phase < 0.65) {
    // Holding contact, then bouncing back
    const p = (phase - 0.4) / 0.25;
    occupantLean = 1 - p;
  }

  // Impact ripple circle radius
  const rippleRadius = impactStage === 1 ? ((phase - 0.2) / 0.05) * 50 : 0;
  const rippleOpacity = impactStage === 1 ? 1 - (phase - 0.2) / 0.05 : 0;

  // Position coordinates
  const bumperX = 140;
  const bumperY = 120;

  // Occupant offsets based on lean
  const driverHeadX = 228 + occupantLean * 14;
  const driverHeadY = 82 + occupantLean * 6;
  const driverTorsoX = 226 + occupantLean * 6;

  const passengerHeadX = 338 + occupantLean * 10;
  const passengerHeadY = 81 + occupantLean * 4;
  const passengerTorsoX = 336 + occupantLean * 4;

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      {/* Blueprint Grid */}
      <defs>
        <pattern id="blueprint-grid-airbags" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid-airbags)" />

      {/* Axis and annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="20">SEC S-42 // PASSIVE SAFETY (6 AIRBAGS)</text>
        <text x="10" y="32">DEPLOYMENT TIME: 8ms // MULTI-ZONE PRESSURE SENSING</text>
        <line x1="5" y1="180" x2="695" y2="180" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <line x1="50" y1="10" x2="50" y2="190" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── CAR BODY OUTLINE (Automotive Schematic Cutaway) ── */}
      <path
        d="M 90,150 
           L 130,150 
           L 155,115 
           L 210,65 
           L 490,65 
           L 550,110 
           L 570,150 
           Z"
        fill="none"
        stroke="rgba(79, 107, 138, 0.4)"
        strokeWidth={1.5}
      />
      <line x1="130" y1="150" x2="550" y2="150" stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1.5} />

      {/* ── SEATS & DRIVER / PASSENGER ── */}
      {/* Front Seat */}
      <g>
        <path d="M 220,146 L 255,146" stroke={SCENE_COLORS.secondary} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M 225,146 L 215,96" stroke={SCENE_COLORS.secondary} strokeWidth={2} strokeLinecap="round" />
        
        {/* Driver Silhouette (moves during impact) */}
        <circle cx={driverHeadX} cy={driverHeadY} r={6} fill="#1E1E22" stroke={SCENE_COLORS.textSecondary} strokeWidth={1} />
        <path 
          d={`M ${driverHeadX},${driverHeadY + 6} L ${driverTorsoX},112 L 242,138`} 
          fill="none" 
          stroke={SCENE_COLORS.textSecondary} 
          strokeWidth={1.5} 
          strokeLinecap="round" 
        />
        {/* Steering Wheel */}
        <circle cx={256} cy={105} r={8} fill="none" stroke="rgba(245,241,232,0.15)" strokeWidth={1} />
        <line x1={248} y1={105} x2={256} y2={105} stroke="rgba(245,241,232,0.15)" strokeWidth={1} />
      </g>

      {/* Rear Seat */}
      <g>
        <path d="M 325,146 L 360,146" stroke={SCENE_COLORS.secondary} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M 333,146 L 323,96" stroke={SCENE_COLORS.secondary} strokeWidth={2} strokeLinecap="round" />
        
        {/* Rear Passenger Silhouette (moves during impact) */}
        <circle cx={passengerHeadX} cy={passengerHeadY} r={6} fill="#1E1E22" stroke={SCENE_COLORS.textSecondary} strokeWidth={1} />
        <path 
          d={`M ${passengerHeadX},${passengerHeadY + 6} L ${passengerTorsoX},112 L 348,138`} 
          fill="none" 
          stroke={SCENE_COLORS.textSecondary} 
          strokeWidth={1.5} 
          strokeLinecap="round" 
        />
      </g>

      {/* ── IMPACT RIPPLE ── */}
      {impactStage === 1 && (
        <g>
          <circle cx={bumperX} cy={bumperY} r={rippleRadius} fill="none" stroke={SCENE_COLORS.accent} strokeWidth={1.5} opacity={rippleOpacity} />
          <circle cx={bumperX} cy={bumperY} r={rippleRadius * 0.6} fill="none" stroke={SCENE_COLORS.accent} strokeWidth={1} opacity={rippleOpacity * 0.7} />
          <polygon points="120,115 140,105 130,120" fill={SCENE_COLORS.accent} opacity={0.3} />
        </g>
      )}

      {/* ── AIRBAG DEPLOYMENT (CYAN GLOWING BLUEPRINTS) ── */}
      {airbagOpacity > 0 && (
        <g opacity={airbagOpacity}>
          {/* 1. Driver Steering Wheel Airbag */}
          <circle
            cx={258}
            cy={101}
            r={24 * airbagScale}
            fill="rgba(53, 214, 255, 0.15)"
            stroke="#35D6FF"
            strokeWidth={1.5}
          />
          <circle
            cx={258}
            cy={101}
            r={18 * airbagScale}
            fill="none"
            stroke="#35D6FF"
            strokeWidth={0.5}
            strokeDasharray="2 2"
          />

          {/* 2. Front Passenger Airbag (from dashboard) */}
          <path
            d={`M 268,90 Q 295,${80 - 15 * airbagScale} 290,112 Q 268,118 268,90 Z`}
            fill="rgba(53, 214, 255, 0.12)"
            stroke="#35D6FF"
            strokeWidth={1.25}
            transform={`translate(0, 0) scale(${airbagScale}) translate(0, 0)`}
            transform-origin="268 90"
          />

          {/* 3 & 4. Side Curtain Airbag (along roofline, protecting all rows) */}
          <path
            d={`M 205,69 L 440,69 Q 445,${69 + 15 * airbagScale} 420,${69 + 15 * airbagScale} L 225,${69 + 15 * airbagScale} Q 200,${69 + 15 * airbagScale} 205,69 Z`}
            fill="rgba(53, 214, 255, 0.1)"
            stroke="#35D6FF"
            strokeWidth={1}
          />
          <line x1={310} y1="69" x2={310} y2={69 + 15 * airbagScale} stroke="#35D6FF" strokeWidth={0.5} strokeDasharray="1 1" />
          <text x="310" y={69 + 11 * airbagScale} fill="#35D6FF" fontSize={6} fontFamily="monospace" textAnchor="middle" opacity={airbagScale > 0.7 ? 0.8 : 0}>
            CURTAIN BAG
          </text>

          {/* 5 & 6. Torso/Side Airbags (from front seat outer bolster) */}
          <ellipse
            cx={208}
            cy={110}
            rx={10 * airbagScale}
            ry={18 * airbagScale}
            fill="rgba(53, 214, 255, 0.15)"
            stroke="#35D6FF"
            strokeWidth={1}
          />
        </g>
      )}

      {/* Info status display panel */}
      <g transform="translate(480, 20)">
        <rect x="0" y="0" width="200" height="42" rx={6} fill="rgba(79, 107, 138, 0.05)" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <text x="10" y="15" fill={SCENE_COLORS.textPrimary} fontSize={9} fontFamily="monospace" fontWeight="bold">PASSIVE CRASH PERFORMANCE</text>
        <text x="10" y="27" fill={airbagOpacity > 0 ? "#35D6FF" : SCENE_COLORS.textSecondary} fontSize={8} fontFamily="monospace">
          AIRBAGS: {airbagOpacity > 0 ? "DEPLOYED (6 CHANNELS)" : "STANDBY MODE"}
        </text>
        <text x="10" y="37" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace">
          STATUS: {phase < 0.2 ? "NORMAL COMMUTE" : phase < 0.25 ? "IMPACT REGISTERED" : phase < 0.6 ? "DECELERATION ABSORPTION" : "DISSIPATION COMPLETE"}
        </text>
      </g>
    </svg>
  );
}
