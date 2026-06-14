"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function RearSpaceScene({ wheelbaseMm = 2610 }: { wheelbaseMm?: number }) {
  // 10s loop
  const { phase } = useSceneTimeline(4, undefined, 10);

  // Determine room class
  const legroom = wheelbaseMm >= 2750 ? "generous" : wheelbaseMm >= 2560 ? "adequate" : "tight";

  // Scale wheelbase pixel length dynamically based on wheelbaseMm
  // Minimum wheelbase in DB is ~2450 (Exter), max is ~3000 (Ioniq 5)
  // Maps 2400mm -> 290px, 3000mm -> 450px
  const wheelbasePx = 290 + ((wheelbaseMm - 2400) * (450 - 290)) / (3000 - 2400);

  // Wheel center positions
  const xFront = 120;
  const xRear = xFront + wheelbasePx;

  // Seat positions scale with wheelbase
  const xFrontSeat = xFront + wheelbasePx * 0.34;
  const xRearSeat = xFront + wheelbasePx * 0.80;

  // Calculate knee gap in pixels and label
  const kneeGapPx = Math.max(8, (wheelbaseMm - 2400) * 0.08 + 12);
  const kneeRoomMm = Math.round((wheelbaseMm - 2400) * 0.35 + 30); // estimated knee clearance

  // Shin swing animation (only rear occupant moves legs to demonstrate clearance)
  const footSwing = Math.sin(phase * Math.PI * 2) * 6;

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      {/* Blueprint Grid */}
      <defs>
        <pattern id="blueprint-grid-rear" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid-rear)" />

      {/* Blueprint annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="20">SEC C-12 // CABIN DIMENSION INDEX</text>
        <text x="10" y="32">VERDICT: LEG room is {legroom.toUpperCase()}</text>
        <line x1="5" y1="180" x2="695" y2="180" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── GROUND AND WHEELS (BLUEPRINT STROKES) ── */}
      {/* Road level */}
      <line x1="50" y1="156" x2="650" y2="156" stroke="rgba(79, 107, 138, 0.3)" strokeWidth={1.5} />
      
      {/* Front Wheel */}
      <circle cx={xFront} cy={156} r={22} fill="#0F0F11" stroke={SCENE_COLORS.secondary} strokeWidth={1.5} />
      <circle cx={xFront} cy={156} r={18} fill="none" stroke="rgba(79, 107, 138, 0.3)" strokeWidth={1} />
      <circle cx={xFront} cy={156} r={6} fill={SCENE_COLORS.secondary} />
      
      {/* Rear Wheel (moves dynamically!) */}
      <circle cx={xRear} cy={156} r={22} fill="#0F0F11" stroke={SCENE_COLORS.secondary} strokeWidth={1.5} />
      <circle cx={xRear} cy={156} r={18} fill="none" stroke="rgba(79, 107, 138, 0.3)" strokeWidth={1} />
      <circle cx={xRear} cy={156} r={6} fill={SCENE_COLORS.secondary} />

      {/* ── WHEELBASE DIMENSION RULER ── */}
      <g>
        <line x1={xFront} y1={172} x2={xRear} y2={172} stroke={SCENE_COLORS.accent} strokeWidth={1} strokeDasharray="3 3" />
        <line x1={xFront} y1={168} x2={xFront} y2={176} stroke={SCENE_COLORS.accent} strokeWidth={1} />
        <line x1={xRear} y1={168} x2={xRear} y2={176} stroke={SCENE_COLORS.accent} strokeWidth={1} />
        <text x={(xFront + xRear) / 2} y={182} fill={SCENE_COLORS.accent} fontSize={9} fontFamily="monospace" textAnchor="middle">
          WHEELBASE: {wheelbaseMm} mm
        </text>
      </g>

      {/* ── CAR BODY OUTLINE (AUTOMOTIVE SCHEMATIC) ── */}
      <path
        d={`M ${xFront - 50},156 
           L ${xFront - 50},120 
           Q ${xFront - 45},80 ${xFront + 20},80 
           L ${xFront + 80},70 
           L ${xFront + 160},45 
           L ${xRear - 40},45 
           Q ${xRear + 30},45 ${xRear + 50},80 
           L ${xRear + 70},120 
           L ${xRear + 70},156 
           Z`}
        fill="none"
        stroke="rgba(79, 107, 138, 0.3)"
        strokeWidth={1.5}
      />

      {/* ── FRONT SEAT & DRIVER ── */}
      <g>
        {/* Front seat base & backrest */}
        <path d={`M ${xFrontSeat - 10},132 L ${xFrontSeat + 24},132`} stroke={SCENE_COLORS.secondary} strokeWidth={3} strokeLinecap="round" />
        <path d={`M ${xFrontSeat - 6},132 L ${xFrontSeat - 16},85`} stroke={SCENE_COLORS.secondary} strokeWidth={2.5} strokeLinecap="round" />
        {/* Driver silhouette */}
        <circle cx={xFrontSeat + 4} cy={72} r={6.5} fill="#1E1E22" stroke={SCENE_COLORS.secondary} strokeWidth={1} />
        <path d={`M ${xFrontSeat + 4},78 L ${xFrontSeat},102 L ${xFrontSeat + 16},130`} fill="none" stroke={SCENE_COLORS.secondary} strokeWidth={2} strokeLinecap="round" opacity={0.65} />
        {/* Steering Wheel */}
        <circle cx={xFrontSeat + 28} cy={95} r={10} fill="none" stroke="rgba(245,241,232,0.15)" strokeWidth={1.5} />
        <line x1={xFrontSeat + 16} y1={95} x2={xFrontSeat + 28} y2={95} stroke="rgba(245,241,232,0.15)" strokeWidth={1} />
      </g>

      {/* ── REAR SEAT & PASSENGER (KNEE SPACE DYNAMICS) ── */}
      <g>
        {/* Rear seat base & backrest */}
        <path d={`M ${xRearSeat - 10},134 L ${xRearSeat + 24},134`} stroke={SCENE_COLORS.secondary} strokeWidth={3} strokeLinecap="round" />
        <path d={`M ${xRearSeat - 2},134 L ${xRearSeat - 12},82`} stroke={SCENE_COLORS.secondary} strokeWidth={2.5} strokeLinecap="round" />
        
        {/* Rear Passenger Head & Torso */}
        <circle cx={xRearSeat + 6} cy={70} r={6.5} fill="#1E1E22" stroke={SCENE_COLORS.accent} strokeWidth={1} />
        {/* Spine */}
        <path d={`M ${xRearSeat + 6},76.5 L ${xRearSeat + 4},112`} fill="none" stroke={SCENE_COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        {/* Thigh (horizontal) */}
        <path d={`M ${xRearSeat + 4},112 L ${xRearSeat - 36},112`} fill="none" stroke={SCENE_COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        {/* Shin (swinging dynamically) */}
        <path 
          d={`M ${xRearSeat - 36},112 L ${xRearSeat - 42 + footSwing},146`} 
          fill="none" 
          stroke={SCENE_COLORS.accent} 
          strokeWidth={2} 
          strokeLinecap="round" 
        />
        {/* Foot */}
        <path d={`M ${xRearSeat - 42 + footSwing},146 L ${xRearSeat - 52 + footSwing},146`} fill="none" stroke={SCENE_COLORS.accent} strokeWidth={1.5} strokeLinecap="round" />
      </g>

      {/* ── KNEE SPACE MEASUREMENT RULER (GLOWING VERMILLION) ── */}
      <g>
        {/* Bounding box guide lines */}
        <line x1={xFrontSeat - 16} y1={85} x2={xFrontSeat - 16} y2={125} stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} strokeDasharray="2 2" />
        
        {/* Measurement arrows */}
        <line 
          x1={xFrontSeat - 16} 
          y1={112} 
          x2={xRearSeat - 36} 
          y2={112} 
          stroke={SCENE_COLORS.accent} 
          strokeWidth={1.5} 
        />
        <polygon points={`${xFrontSeat - 16},112 ${xFrontSeat - 10},109 ${xFrontSeat - 10},115`} fill={SCENE_COLORS.accent} />
        <polygon points={`${xRearSeat - 36},112 ${xRearSeat - 42},109 ${xRearSeat - 42},115`} fill={SCENE_COLORS.accent} />

        {/* Dynamic Knee Gap highlight background */}
        <rect 
          x={xFrontSeat - 12} 
          y={94} 
          width={(xRearSeat - 36) - (xFrontSeat - 12)} 
          height={32} 
          fill={SCENE_COLORS.accentSoft} 
          rx={4} 
          stroke={SCENE_COLORS.accentStroke} 
          strokeWidth={0.5}
          opacity={0.7}
        />
        <text 
          x={(xFrontSeat - 16 + xRearSeat - 36) / 2} 
          y={106} 
          fill={SCENE_COLORS.textPrimary} 
          fontSize={8} 
          fontFamily="monospace" 
          textAnchor="middle"
          fontWeight="bold"
        >
          KNEE GAP
        </text>
        <text 
          x={(xFrontSeat - 16 + xRearSeat - 36) / 2} 
          y={118} 
          fill={SCENE_COLORS.accent} 
          fontSize={8} 
          fontFamily="monospace" 
          textAnchor="middle"
        >
          ~{kneeRoomMm}mm
        </text>
      </g>

      {/* Info panel */}
      <g transform="translate(480, 20)">
        <rect x="0" y="0" width="200" height="42" rx={6} fill="rgba(79, 107, 138, 0.05)" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <text x="10" y="15" fill={SCENE_COLORS.textPrimary} fontSize={9} fontFamily="monospace" fontWeight="bold">REAR CABIN SPACE INDEX</text>
        <text x="10" y="27" fill={SCENE_COLORS.accent} fontSize={8} fontFamily="monospace">
          WHEELBASE: {wheelbaseMm} mm
        </text>
        <text x="10" y="37" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace">
          VERDICT: {legroom.toUpperCase()} Legroom
        </text>
      </g>
    </svg>
  );
}
