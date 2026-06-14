"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function GroundClearanceScene({ groundClearanceMm = 190 }: { groundClearanceMm?: number }) {
  // 10s loop
  const { t, phase } = useSceneTimeline(3, undefined, 10);

  const breakerMm = 130;
  const clears = groundClearanceMm >= breakerMm;

  // Let the car drive across the canvas from off-screen left to off-screen right
  const carX = -130 + phase * 960;

  // Wheel center coordinates relative to car center (wheelbase of 150px)
  const xFront = carX + 75;
  const xRear = carX - 75;

  // Speed breaker settings
  const breakerCenterX = 350;
  const breakerRadius = 80;
  const breakerPeakPx = 32.5; // 130mm * 0.25 (1mm = 0.25px scale)

  // Bump height function: parabolic shape centered at 350
  const getBumpHeight = (x: number) => {
    if (x < breakerCenterX - breakerRadius || x > breakerCenterX + breakerRadius) {
      return 0;
    }
    const pct = (x - breakerCenterX) / breakerRadius;
    return breakerPeakPx * (1 - pct * pct);
  };

  // Get wheel lifts
  const frontLift = getBumpHeight(xFront);
  const rearLift = getBumpHeight(xRear);

  // Wheel centers (road is at Y=150, tyre radius is 18px)
  const yFrontWheel = 150 - 18 - frontLift;
  const yRearWheel = 150 - 18 - rearLift;

  // Translation and pitch angle calculations
  const midY = (yFrontWheel + yRearWheel) / 2;
  const carAngle = Math.atan2(yFrontWheel - yRearWheel, 150);

  // Ground clearance math
  const clearancePx = groundClearanceMm * 0.25; // e.g. 190mm = 47.5px
  const underbodyY = midY + 18 - clearancePx;

  // Height of breaker at the car center
  const centerBumpHeight = getBumpHeight(carX);
  const centerBumpY = 150 - centerBumpHeight;

  // Collision detection & suspension lift simulation
  const scrapeAmount = underbodyY - centerBumpY; // positive = scraping (Y coordinates go down downwards)
  const isScraping = scrapeAmount > 0;
  const liftAmount = isScraping ? scrapeAmount : 0;

  // Adjusted car coordinates (pushed up by speed breaker if scraping)
  const adjustedMidY = midY - liftAmount;
  const adjustedUnderbodyY = underbodyY - liftAmount;

  // Wheel rotation in degrees
  const wheelRotation = (carX / 18) * (180 / Math.PI);

  // Spark generation (only when scraping)
  const sparks = isScraping
    ? Array.from({ length: 10 }).map((_, i) => {
        const seed = Math.sin(t * 60 + i * 12);
        const angle = -Math.PI / 2 + seed * (Math.PI / 4); // spray upwards and outwards
        const speed = 10 + Math.abs(Math.cos(t * 40 + i)) * 25;
        const length = 4 + Math.abs(seed) * 12;
        return {
          dx: Math.cos(angle) * speed * 0.5,
          dy: Math.sin(angle) * speed * 0.5,
          len: length,
        };
      })
    : [];

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      {/* Blueprint Grid Lines */}
      <defs>
        <pattern id="blueprint-grid-gc" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid-gc)" />

      {/* Axis and annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="20">SEC G-09 // GROUND CLEARANCE SCANNER</text>
        <text x="10" y="32">BREAKER HEIGHT: {breakerMm}mm // SIM MODE: ACTIVE</text>
        <line x1="5" y1="180" x2="695" y2="180" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <line x1="50" y1="10" x2="50" y2="190" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── ROAD AND SPEED BREAKER ── */}
      {/* Road level */}
      <line x1="5" y1="150" x2="695" y2="150" stroke="rgba(79, 107, 138, 0.3)" strokeWidth={1.5} />
      
      {/* Speed breaker shape */}
      <path 
        d={`M ${breakerCenterX - breakerRadius},150 Q ${breakerCenterX},${150 - breakerPeakPx} ${breakerCenterX + breakerRadius},150`} 
        fill="#18181b" 
        stroke="rgba(79, 107, 138, 0.5)" 
        strokeWidth={2} 
      />

      {/* Peak height dimension line */}
      <line x1={breakerCenterX} y1={150} x2={breakerCenterX} y2={150 - breakerPeakPx} stroke="rgba(79, 107, 138, 0.3)" strokeWidth={1} strokeDasharray="2 2" />
      <text x={breakerCenterX + 6} y={150 - breakerPeakPx + 12} fill={SCENE_COLORS.secondary} opacity={0.7} fontSize={8} fontFamily="monospace">
        {breakerMm}mm breaker
      </text>

      {/* ── CAR SCENARIO GROUP ── */}
      <g transform={`translate(${carX}, ${adjustedMidY}) rotate(${(carAngle * 180) / Math.PI}, 0, 0)`}>
        {/* Car body path (relative to wheel center line) */}
        {/* Underbody line sits at y = 18 - clearancePx */}
        <path
          d={`M -105,${18 - clearancePx} 
             L -92,${18 - clearancePx} 
             Q -70,-22 -48,${18 - clearancePx} 
             L 48,${18 - clearancePx} 
             Q 70,-22 92,${18 - clearancePx} 
             L 110,${18 - clearancePx} 
             L 112,-8 
             Q 110,-18 90,-20 
             L 65,-22 
             L 35,-50 
             Q 30,-52 -25,-52 
             L -60,-24 
             L -100,-22 
             Z`}
          fill="none"
          stroke={isScraping ? SCENE_COLORS.accent : "rgba(79, 107, 138, 0.6)"}
          strokeWidth={1.75}
        />

        {/* Windows and B-pillar */}
        <path
          d="M -20,-47 L 30,-45 L 56,-24 L -52,-26 Z"
          fill="none"
          stroke="rgba(79, 107, 138, 0.3)"
          strokeWidth={1}
        />
        <line x1={0} y1={-47} x2={0} y2={-25} stroke="rgba(79, 107, 138, 0.3)" strokeWidth={1.25} />

        {/* Handles */}
        <line x1={15} y1={-18} x2={25} y2={-18} stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1} />
        <line x1={-25} y1={-18} x2={-15} y2={-18} stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1} />

        {/* Light cues */}
        <line x1={112} y1={-8} x2={106} y2={-11} stroke={SCENE_COLORS.textPrimary} strokeWidth={1.5} opacity={0.7} />
        <line x1={-105} y1={-22} x2={-99} y2={-20} stroke={SCENE_COLORS.accent} strokeWidth={1.5} opacity={0.8} />

        {/* Underbody scraping glow */}
        {isScraping && (
          <path
            d={`M -40,${18 - clearancePx} L 40,${18 - clearancePx}`}
            stroke={SCENE_COLORS.accent}
            strokeWidth={3}
            opacity={0.4 + 0.3 * Math.sin(t * 30)}
          />
        )}

        {/* ── WHEELS ── */}
        {/* Rear Wheel */}
        <g transform={`translate(-70, 0) rotate(${wheelRotation})`}>
          <circle cx={0} cy={0} r={18} fill="#0F0F11" stroke="rgba(79, 107, 138, 0.7)" strokeWidth={1.5} />
          <circle cx={0} cy={0} r={14} fill="none" stroke="rgba(79, 107, 138, 0.2)" strokeWidth={1} />
          {/* Wheel spokes */}
          <line x1={-18} y1={0} x2={18} y2={0} stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1} />
          <line x1={0} y1={-18} x2={0} y2={18} stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1} />
          <circle cx={0} cy={0} r={4} fill={SCENE_COLORS.secondary} />
        </g>

        {/* Front Wheel */}
        <g transform={`translate(70, 0) rotate(${wheelRotation})`}>
          <circle cx={0} cy={0} r={18} fill="#0F0F11" stroke="rgba(79, 107, 138, 0.7)" strokeWidth={1.5} />
          <circle cx={0} cy={0} r={14} fill="none" stroke="rgba(79, 107, 138, 0.2)" strokeWidth={1} />
          {/* Wheel spokes */}
          <line x1={-18} y1={0} x2={18} y2={0} stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1} />
          <line x1={0} y1={-18} x2={0} y2={18} stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1} />
          <circle cx={0} cy={0} r={4} fill={SCENE_COLORS.secondary} />
        </g>
      </g>

      {/* ── SPARKS ANIMATION ── */}
      {isScraping && (
        <g transform={`translate(${carX}, ${150 - centerBumpHeight})`}>
          {sparks.map((s, i) => (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={s.dx}
              y2={s.dy}
              stroke={i % 2 === 0 ? "#FFD700" : SCENE_COLORS.accent}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.8}
            />
          ))}
        </g>
      )}

      {/* ── MEASUREMENT INDICATORS ── */}
      {/* Show clearance gap ruler when car is centered over the speed breaker */}
      {Math.abs(carX - breakerCenterX) < 60 && (
        <g>
          {clears ? (
            // Safe Clearance Ruler
            <g>
              <line
                x1={breakerCenterX}
                y1={centerBumpY}
                x2={breakerCenterX}
                y2={adjustedUnderbodyY}
                stroke={SCENE_COLORS.secondary}
                strokeWidth={1.5}
              />
              <polygon points={`${breakerCenterX},${centerBumpY} ${breakerCenterX - 3},${centerBumpY + 6} ${breakerCenterX + 3},${centerBumpY + 6}`} fill={SCENE_COLORS.secondary} />
              <polygon points={`${breakerCenterX},${adjustedUnderbodyY} ${breakerCenterX - 3},${adjustedUnderbodyY - 6} ${breakerCenterX + 3},${adjustedUnderbodyY - 6}`} fill={SCENE_COLORS.secondary} />
              
              <rect
                x={breakerCenterX + 8}
                y={(centerBumpY + adjustedUnderbodyY) / 2 - 9}
                width={74}
                height={18}
                rx={3}
                fill="rgba(15,15,17,0.85)"
                stroke={SCENE_COLORS.secondary}
                strokeWidth={0.5}
              />
              <text
                x={breakerCenterX + 45}
                y={(centerBumpY + adjustedUnderbodyY) / 2 + 3}
                fill={SCENE_COLORS.textPrimary}
                fontSize={8}
                fontFamily="monospace"
                textAnchor="middle"
              >
                +{groundClearanceMm - breakerMm}mm safe
              </text>
            </g>
          ) : (
            // Scraping Danger Marker
            <g>
              <rect
                x={breakerCenterX - 65}
                y={centerBumpY - 38}
                width={130}
                height={26}
                rx={4}
                fill="rgba(200,76,49,0.15)"
                stroke={SCENE_COLORS.accent}
                strokeWidth={1}
              />
              <text
                x={breakerCenterX}
                y={breakerCenterX - breakerMm} // center
                fill={SCENE_COLORS.accent}
                fontSize={9}
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                transform={`translate(0, ${centerBumpY - 26 - (breakerCenterX - breakerMm)})`}
              >
                SCRAPING WARNING
              </text>
              <text
                x={breakerCenterX}
                y={breakerCenterX - breakerMm} // center
                fill={SCENE_COLORS.textPrimary}
                fontSize={7}
                fontFamily="monospace"
                textAnchor="middle"
                transform={`translate(0, ${centerBumpY - 16 - (breakerCenterX - breakerMm)})`}
              >
                Deficit: {breakerMm - groundClearanceMm}mm
              </text>
            </g>
          )}
        </g>
      )}

      {/* Info display panel */}
      <g transform="translate(480, 20)">
        <rect x="0" y="0" width="200" height="42" rx={6} fill="rgba(79, 107, 138, 0.05)" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <text x="10" y="15" fill={SCENE_COLORS.textPrimary} fontSize={9} fontFamily="monospace" fontWeight="bold">GROUND CLEARANCE METRIC</text>
        <text x="10" y="27" fill={SCENE_COLORS.accent} fontSize={8} fontFamily="monospace">
          CLEARANCE: {groundClearanceMm} mm
        </text>
        <text x="10" y="37" fill={clears ? SCENE_COLORS.textSecondary : SCENE_COLORS.accent} fontSize={7} fontFamily="monospace">
          VERDICT: {clears ? "Clears typical breaker" : "Will scrape 130mm breaker"}
        </text>
      </g>
    </svg>
  );
}
