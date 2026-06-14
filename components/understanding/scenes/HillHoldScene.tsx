"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function HillHoldScene() {
  // 10s loop with 3 steps
  const { t, phase } = useSceneTimeline(3, [
    { at: 0, text: "Stopped on a slope — foot on brake." },
    { at: 3.0, text: "Release brake — hill-hold keeps you still for ~2s." },
    { at: 6.0, text: "Clutch/accelerate smoothly. No rollback into the car behind." }
  ], 10);

  // Constants
  const slopeAngle = -8.5; // degrees
  const getSlopeY = (x: number, isBottom: boolean) => {
    const baselineY = isBottom ? 152 : 62;
    // Slopes up to the right
    return baselineY - (x - 180) * 0.15;
  };

  // State variables
  let topCarX = 220;
  let topWheelRot = 0;
  let topBrakeLocked = true;
  let topRolledBack = false;

  let bottomCarX = 220;
  let bottomWheelRot = 0;
  let bottomBrakeLocked = true;
  let bottomHoldActive = false;
  let bottomHoldCountdown = 2.0;

  let sceneOpacity = 1;

  if (t < 3.0) {
    // 1. Both cars stopped, brakes locked
    topCarX = 220;
    topWheelRot = 0;
    topBrakeLocked = true;
    topRolledBack = false;

    bottomCarX = 220;
    bottomWheelRot = 0;
    bottomBrakeLocked = true;
    bottomHoldActive = false;
    bottomHoldCountdown = 2.0;
    sceneOpacity = 1;
  } else if (t >= 3.0 && t < 5.5) {
    // 2. Brake released
    const p = (t - 3.0) / 2.5;

    // Top Car: rolls backward down the slope
    topCarX = 220 - p * 120; // rolls back to 100
    topWheelRot = -p * 360 * 1.5; // spins backward
    topBrakeLocked = false;
    topRolledBack = true;

    // Bottom Car: hill hold active (holds for 2.0 seconds, then releases)
    bottomCarX = 220;
    bottomWheelRot = 0;
    bottomBrakeLocked = true;
    bottomHoldActive = true;
    bottomHoldCountdown = Math.max(0, 2.0 - (t - 3.0));
  } else if (t >= 5.5 && t < 8.0) {
    // 3. Accelerate off
    const p = (t - 5.5) / 2.5;
    const easeP = p * p * (3 - 2 * p); // smooth acceleration

    // Top Car: remains stuck rolled back
    topCarX = 100;
    topWheelRot = 0;
    topBrakeLocked = false;
    topRolledBack = true;

    // Bottom Car: drives forward up the slope
    bottomCarX = 220 + easeP * 240; // drives to 460
    bottomWheelRot = easeP * 360 * 2.5;
    bottomBrakeLocked = false;
    bottomHoldActive = false;
    bottomHoldCountdown = 0;
  } else {
    // 4. Fade out and reset
    const fadeOutDuration = 0.8;
    const resetTime = 8.0;
    if (t >= resetTime && t < resetTime + fadeOutDuration) {
      sceneOpacity = 1 - (t - resetTime) / fadeOutDuration;
    } else {
      sceneOpacity = (t - (resetTime + fadeOutDuration)) / (10.0 - (resetTime + fadeOutDuration));
    }

    // Positions set to starting state
    topCarX = 220;
    topWheelRot = 0;
    topBrakeLocked = true;
    topRolledBack = false;

    bottomCarX = 220;
    bottomWheelRot = 0;
    bottomBrakeLocked = true;
    bottomHoldActive = false;
    bottomHoldCountdown = 2.0;
  }

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      <defs>
        <pattern id="blueprint-grid-hill" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
        <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-vermillion" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Blueprint Grid */}
      <rect width="100%" height="100%" fill="url(#blueprint-grid-hill)" />

      {/* Divider */}
      <line x1="10" y1="100" x2="690" y2="100" stroke="rgba(79, 107, 138, 0.18)" strokeWidth={1} strokeDasharray="4 4" />

      {/* Annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="15">SYS REF SEC-22 // HILL INCLINE ASSIST TEST</text>
        <text x="10" y="112">HOLD DURATION SPEC: 2000MS MAX // BRAKE PRESSURE: DETECTED</text>
        <line x1="45" y1="5" x2="45" y2="195" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── TOP SCENE: WITHOUT ASSIST ── */}
      <g opacity={sceneOpacity}>
        {/* Slope road line */}
        <line x1="10" y1={getSlopeY(10, false)} x2="690" y2={getSlopeY(690, false)} stroke={SCENE_COLORS.roadLine} strokeWidth={2} />
        
        {/* Labels */}
        <text x="50" y="25" fill={SCENE_COLORS.textSecondary} fontSize={9} fontFamily="monospace" fontWeight="bold">
          WITHOUT ASSIST
        </text>

        {/* Warning Indicator */}
        {topRolledBack && (
          <g>
            {/* Dashed collision boundary behind car */}
            <line
              x1="90"
              y1={getSlopeY(90, false) - 20}
              x2="90"
              y2={getSlopeY(90, false) + 10}
              stroke={SCENE_COLORS.negative}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            {topCarX <= 110 && (
              <text x="96" y="25" fill={SCENE_COLORS.negative} fontSize={8.5} fontFamily="monospace" fontWeight="bold" filter="url(#glow-vermillion)">
                WARNING: ROLLBACK / HAZARD ZONE
              </text>
            )}
            {/* Gravity vector arrow */}
            <path
              d={`M ${topCarX - 10} ${getSlopeY(topCarX - 10, false) - 5} L ${topCarX - 30} ${getSlopeY(topCarX - 30, false) - 2}`}
              fill="none"
              stroke={SCENE_COLORS.negative}
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
            />
            <text x={topCarX - 45} y={getSlopeY(topCarX - 45, false) - 8} fill={SCENE_COLORS.negative} fontSize={7} fontFamily="monospace">GRAVITY</text>
          </g>
        )}

        {/* Car Top Lane */}
        <g transform={`translate(0, ${getSlopeY(topCarX, false) - getSlopeY(topCarX, false)})`}>
          <BlueprintCar
            x={topCarX}
            y={getSlopeY(topCarX, false) - 26}
            color={topRolledBack ? SCENE_COLORS.negative : SCENE_COLORS.leadCar}
            wheelRotation={topWheelRot}
            caliperColor={SCENE_COLORS.negative}
            showCaliper={topBrakeLocked}
          />
        </g>
      </g>

      {/* ── BOTTOM SCENE: WITH HILL HOLD ── */}
      <g opacity={sceneOpacity}>
        {/* Slope road line */}
        <line x1="10" y1={getSlopeY(10, true)} x2="690" y2={getSlopeY(690, true)} stroke={SCENE_COLORS.roadLine} strokeWidth={2} />
        
        {/* Labels */}
        <text x="50" y="125" fill="#35D6FF" fontSize={9} fontFamily="monospace" fontWeight="bold">
          WITH HILL HOLD (ACTIVE)
        </text>

        {/* Hill Hold HUD overlay */}
        {bottomHoldActive && (
          <g transform={`translate(${bottomCarX + 90}, ${getSlopeY(bottomCarX, true) - 24})`}>
            {/* Countdown Badge */}
            <rect x="0" y="-2" width="76" height="18" rx="3" fill="rgba(53, 214, 255, 0.1)" stroke="#35D6FF" strokeWidth={1} filter="url(#glow-cyan)" />
            <text x="8" y="10" fill="#35D6FF" fontSize={8.5} fontFamily="monospace" fontWeight="bold">
              HOLD: {bottomHoldCountdown.toFixed(1)}s
            </text>
            <path
              d="M -10,7 L 0,7"
              stroke="#35D6FF"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          </g>
        )}

        {/* Drive off label */}
        {t >= 5.5 && t < 8.0 && (
          <text x="250" y="125" fill="#35D6FF" fontSize={8} fontFamily="monospace" fontWeight="bold">
            DRIVE OFF: SMOOTH TRACTION
          </text>
        )}

        {/* Car Bottom Lane */}
        <g transform={`translate(0, ${getSlopeY(bottomCarX, true) - getSlopeY(bottomCarX, true)})`}>
          <BlueprintCar
            x={bottomCarX}
            y={getSlopeY(bottomCarX, true) - 26}
            color={bottomHoldActive ? "#35D6FF" : SCENE_COLORS.accent}
            wheelRotation={bottomWheelRot}
            caliperColor="#35D6FF"
            showCaliper={bottomBrakeLocked}
          />
        </g>
      </g>
    </svg>
  );
}

// ── CUSTOM BLUEPRINT CAR SUB-COMPONENT ──
interface CarProps {
  x: number;
  y: number;
  color: string;
  wheelRotation: number;
  caliperColor: string;
  showCaliper: boolean;
}

function BlueprintCar({ x, y, color, wheelRotation, caliperColor, showCaliper }: CarProps) {
  const wheel1CX = x + 18;
  const wheel2CX = x + 62;
  const wheelCY = y + 21;
  const wheelR = 7.5;

  return (
    // Rotate the car group by the slope angle (-8.5 deg) around its center (approx x + 40, y + 15)
    <g transform={`rotate(-8.5, ${x + 40}, ${y + 15})`}>
      {/* Car Body path */}
      <path
        d={`M ${x},${y + 14} 
            L ${x + 8},${y + 14} 
            C ${x + 12},${y + 8} ${x + 20},${y + 2} ${x + 28},${y + 2} 
            L ${x + 48},${y + 2} 
            L ${x + 58},${y + 10} 
            L ${x + 74},${y + 10} 
            C ${x + 77},${y + 10} ${x + 80},${y + 12} ${x + 80},${y + 15} 
            L ${x + 80},${y + 19}
            L ${x + 70},${y + 19} 
            A 9 9 0 0 0 ${x + 53},${y + 19} 
            L ${x + 27},${y + 19} 
            A 9 9 0 0 0 ${x + 10},${y + 19} 
            L ${x},${y + 19} 
            Z`}
        fill="none"
        stroke={color}
        strokeWidth={1.25}
      />
      
      {/* Windshield / Windows */}
      <path
        d={`M ${x + 29},${y + 4} L ${x + 46},${y + 4} L ${x + 51},${y + 10} L ${x + 29},${y + 10} Z`}
        fill="rgba(79, 107, 138, 0.15)"
        stroke={color}
        strokeWidth={0.75}
      />

      {/* Wheels */}
      {[wheel1CX, wheel2CX].map((cx, i) => (
        <g key={i}>
          {/* Tire ring */}
          <circle cx={cx} cy={wheelCY} r={wheelR} fill="#141416" stroke={color} strokeWidth={1} />
          
          {/* Wheel Spokes */}
          <g transform={`rotate(${wheelRotation}, ${cx}, ${wheelCY})`}>
            <circle cx={cx} cy={wheelCY} r={wheelR * 0.4} fill="none" stroke={color} strokeWidth={0.5} />
            <line x1={cx - wheelR} y1={wheelCY} x2={cx + wheelR} y2={wheelCY} stroke={color} strokeWidth={0.5} />
            <line x1={cx} y1={wheelCY - wheelR} x2={cx} y2={wheelCY + wheelR} stroke={color} strokeWidth={0.5} />
          </g>
          
          {/* Brake Caliper lock */}
          {showCaliper && (
            <path
              d={`M ${cx - 2} ${wheelCY - wheelR - 1} A ${wheelR + 1} ${wheelR + 1} 0 0 1 ${cx + wheelR + 1} ${wheelCY - 2}`}
              fill="none"
              stroke={caliperColor}
              strokeWidth={2}
              strokeLinecap="round"
              filter={caliperColor === "#35D6FF" ? "url(#glow-cyan)" : undefined}
            />
          )}
        </g>
      ))}
    </g>
  );
}
