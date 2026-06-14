"use client";

import React from "react";
import { useSceneTimelineValue } from "./shared/sceneTimelineContext";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function EscScene() {
  const { t } = useSceneTimelineValue();

  // Road geometry: S-curve double-lane change
  const getRoadY = (x: number, isBottom: boolean) => {
    const centerY = isBottom ? 150 : 50;
    if (x < 180) {
      return centerY;
    } else if (x >= 180 && x < 420) {
      const p = (x - 180) / 240;
      const amplitude = 18;
      // S-curve pattern (going up, crossing, going down, returning)
      return centerY - Math.sin(p * 2 * Math.PI) * amplitude;
    } else {
      return centerY;
    }
  };

  const getRoadAngle = (x: number) => {
    if (x < 180 || x >= 420) return 0;
    const p = (x - 180) / 240;
    const amplitude = 18;
    const slope = -amplitude * (Math.PI / 120) * Math.cos(p * 2 * Math.PI);
    return Math.atan(slope);
  };

  // State calculations
  let topCarX = 60;
  let topCarY = 50;
  let topAngle = 0;
  let topSpinOffset = 0;
  let topActive = true;
  let topLostControl = false;

  let bottomCarX = 60;
  let bottomCarY = 150;
  let bottomAngle = 0;
  let bottomEscActive = false;
  let brakeLF = false;
  let brakeRF = false;
  let brakeLR = false;
  let brakeRR = false;

  let sceneOpacity = 1;

  if (t < 3.2) {
    // 1. Both cars follow road normally
    const progress = t / 3.2;
    const currentX = 60 + progress * 224; // reaches 284 at t=3.2

    // Top Car
    topCarX = currentX;
    topCarY = getRoadY(topCarX, false);
    topAngle = getRoadAngle(topCarX);
    topSpinOffset = 0;
    topLostControl = false;

    // Bottom Car
    bottomCarX = currentX;
    bottomCarY = getRoadY(bottomCarX, true);
    bottomAngle = getRoadAngle(bottomCarX);
    bottomEscActive = false;
  } else if (t >= 3.2 && t < 6.0) {
    // 2. Swerve & Traction Loss
    const slideDuration = 2.8;
    const p = (t - 3.2) / slideDuration;

    // Top Car: Spins out of control and slides off the road
    topCarX = 284 + p * 90; // decelerates horizontally
    topCarY = getRoadY(284, false) - p * 28; // slides off road
    topSpinOffset = p * 420; // spins more than a full circle
    topAngle = getRoadAngle(284) + (topSpinOffset * Math.PI) / 180;
    topLostControl = true;

    // Bottom Car: ESC active, corrects path
    const pBottom = (t - 3.2) / slideDuration;
    bottomCarX = 284 + pBottom * 196; // continues further forward
    bottomCarY = getRoadY(bottomCarX, true);
    bottomAngle = getRoadAngle(bottomCarX);
    bottomEscActive = true;

    // Selective wheel braking logic based on phase of the swerve
    if (t >= 3.2 && t < 4.3) {
      // First turn: oversteer to the right, brake front-right wheel to correct yaw
      brakeRF = true;
      brakeLF = false;
      brakeLR = false;
      brakeRR = false;
    } else if (t >= 4.3 && t < 5.4) {
      // Counter-swerve: oversteer to the left, brake front-left wheel
      brakeLF = true;
      brakeRF = false;
      brakeLR = false;
      brakeRR = false;
    } else {
      // Small stabilization of rear wheel
      brakeRR = true;
      brakeLF = false;
      brakeRF = false;
      brakeLR = false;
    }
  } else if (t >= 6.0 && t < 8.0) {
    // 3. Post-swerve state
    // Top Car: Stopped spun out
    topCarX = 374;
    topCarY = getRoadY(284, false) - 28;
    topAngle = getRoadAngle(284) + (420 * Math.PI) / 180;
    topLostControl = true;

    // Bottom Car: Cruises away safely
    const extraP = (t - 6.0) / 2.0;
    bottomCarX = 480 + extraP * 140; // drives to 620
    bottomCarY = getRoadY(bottomCarX, true);
    bottomAngle = getRoadAngle(bottomCarX);
    bottomEscActive = false;
    brakeLF = false;
    brakeRF = false;
    brakeLR = false;
    brakeRR = false;
  } else {
    // 4. Fade out and reset
    const fadeOutDuration = 0.8;
    const resetTime = 8.0;
    if (t >= resetTime && t < resetTime + fadeOutDuration) {
      sceneOpacity = 1 - (t - resetTime) / fadeOutDuration;
    } else {
      sceneOpacity = (t - (resetTime + fadeOutDuration)) / (10.0 - (resetTime + fadeOutDuration));
    }

    // Positions reset
    topCarX = 60;
    topCarY = 50;
    topAngle = 0;
    topLostControl = false;

    bottomCarX = 60;
    bottomCarY = 150;
    bottomAngle = 0;
    bottomEscActive = false;
  }

  // Road Path D strings
  const roadPathTop = `M 0,50 L 180,50 C 220,26 260,26 300,50 C 340,74 380,74 420,50 L 700,50`;
  const roadPathBottom = `M 0,150 L 180,150 C 220,126 260,126 300,150 C 340,174 380,174 420,150 L 700,150`;

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      <defs>
        <pattern id="blueprint-grid-esc" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
        {/* Glow effects */}
        <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-vermillion" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Arrow Marker for Yaw Torque */}
        <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0,1.5 L 8,5 L 0,8.5 z" fill="#35D6FF" />
        </marker>
      </defs>

      {/* Blueprint Grid */}
      <rect width="100%" height="100%" fill="url(#blueprint-grid-esc)" />

      {/* Divider */}
      <line x1="10" y1="100" x2="690" y2="100" stroke="rgba(79, 107, 138, 0.18)" strokeWidth={1} strokeDasharray="4 4" />

      {/* Annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="15">SYS REF SEC-40 // DYNAMIC STABILITY SCANNER</text>
        <text x="10" y="112">ESC INTERVENTION CRITERIA: YAW ANGLE DELTA &gt; 5.0 DEG</text>
        <line x1="45" y1="5" x2="45" y2="195" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── TOP SCENE: WITHOUT ESC ── */}
      <g opacity={sceneOpacity}>
        {/* Road layout */}
        <path d={roadPathTop} fill="none" stroke="rgba(79, 107, 138, 0.16)" strokeWidth={32} strokeLinecap="round" />
        <path d={roadPathTop} fill="none" stroke="#121215" strokeWidth={30} strokeLinecap="round" />
        <path d={roadPathTop} fill="none" stroke="rgba(245, 241, 232, 0.18)" strokeWidth={1} strokeDasharray="5 5" />

        <text x="50" y="25" fill={SCENE_COLORS.textSecondary} fontSize={9} fontFamily="monospace" fontWeight="bold">
          WITHOUT ESC
        </text>

        {/* Skid marks trailing */}
        {t >= 3.2 && (
          <g opacity={Math.min(1, (t - 3.2) / 0.5)}>
            <path
              d="M 284,42 Q 320,32 374,15"
              fill="none"
              stroke={SCENE_COLORS.negative}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.65}
            />
            <path
              d="M 284,58 Q 320,48 374,31"
              fill="none"
              stroke={SCENE_COLORS.negative}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.65}
            />
          </g>
        )}

        {/* Warning label */}
        {topLostControl && (
          <g>
            <text x="120" y="25" fill={SCENE_COLORS.negative} fontSize={8.5} fontFamily="monospace" fontWeight="bold" filter="url(#glow-vermillion)">
              OVERSTEER SPINOUT // LOSS OF TRACTION
            </text>
            {/* Swivel Vector */}
            <circle cx="340" cy="30" r="14" fill="none" stroke={SCENE_COLORS.negative} strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
          </g>
        )}

        {/* Car Top Lane */}
        <BlueprintCarTop
          x={topCarX}
          y={topCarY}
          angleRad={topAngle}
          color={topLostControl ? SCENE_COLORS.negative : SCENE_COLORS.leadCar}
        />
      </g>

      {/* ── BOTTOM SCENE: WITH ESC ── */}
      <g opacity={sceneOpacity}>
        {/* Road layout */}
        <path d={roadPathBottom} fill="none" stroke="rgba(79, 107, 138, 0.16)" strokeWidth={32} strokeLinecap="round" />
        <path d={roadPathBottom} fill="none" stroke="#121215" strokeWidth={30} strokeLinecap="round" />
        <path d={roadPathBottom} fill="none" stroke="rgba(245, 241, 232, 0.18)" strokeWidth={1} strokeDasharray="5 5" />

        <text x="50" y="125" fill="#35D6FF" fontSize={9} fontFamily="monospace" fontWeight="bold">
          WITH ESC (STABILITY ACTIVE)
        </text>

        {/* ESC HUD Warning overlay */}
        {bottomEscActive && (
          <g>
            <text x="210" y="125" fill="#35D6FF" fontSize={8.5} fontFamily="monospace" fontWeight="bold" filter="url(#glow-cyan)">
              ESC ACTIVE: SELECTIVE WHEEL BRAKING
            </text>
            
            {/* Stabilizing Yaw Torque Indicator Overlay */}
            {/* Draws a curved arrow around the car representing torque correction */}
            <g transform={`translate(${bottomCarX}, ${bottomCarY}) rotate(${(bottomAngle * 180) / Math.PI})`}>
              <path
                d="M -16,-14 A 20 20 0 0 1 16,-14"
                fill="none"
                stroke="#35D6FF"
                strokeWidth={1.5}
                markerEnd="url(#arrow-cyan)"
                filter="url(#glow-cyan)"
              />
              <text x="0" y="-22" fill="#35D6FF" fontSize={6.5} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                YAW CORRECTION
              </text>
            </g>
          </g>
        )}

        {/* Car Bottom Lane */}
        <BlueprintCarTop
          x={bottomCarX}
          y={bottomCarY}
          angleRad={bottomAngle}
          color={bottomEscActive ? "#35D6FF" : SCENE_COLORS.accent}
          brakeLeftFront={brakeLF}
          brakeRightFront={brakeRF}
          brakeLeftRear={brakeLR}
          brakeRightRear={brakeRR}
          glowColor="#35D6FF"
        />
      </g>
    </svg>
  );
}

// ── TOP-DOWN BLUEPRINT CAR VIEW SUB-COMPONENT ──
interface CarTopProps {
  x: number;
  y: number;
  angleRad: number;
  color: string;
  brakeLeftFront?: boolean;
  brakeRightFront?: boolean;
  brakeLeftRear?: boolean;
  brakeRightRear?: boolean;
  glowColor?: string;
}

function BlueprintCarTop({
  x,
  y,
  angleRad,
  color,
  brakeLeftFront = false,
  brakeRightFront = false,
  brakeLeftRear = false,
  brakeRightRear = false,
  glowColor = "#35D6FF",
}: CarTopProps) {
  const carW = 40;
  const carH = 18;
  const angleDeg = (angleRad * 180) / Math.PI;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg}) translate(${-carW / 2}, ${-carH / 2})`}>
      {/* ── Wheels ── */}
      {/* Front-left Wheel (x=6, y=-2) */}
      <rect
        x={6}
        y={-2.5}
        width={7}
        height={2.5}
        rx={0.75}
        fill={brakeLeftFront ? glowColor : "#1A1A1E"}
        stroke={brakeLeftFront ? glowColor : color}
        strokeWidth={0.5}
      />
      {brakeLeftFront && (
        <circle cx={9.5} cy={-1.25} r={5.5} fill="none" stroke={glowColor} strokeWidth={1} filter="url(#glow-cyan)" opacity={0.8} />
      )}

      {/* Front-right Wheel (x=6, y=18) */}
      <rect
        x={6}
        y={18}
        width={7}
        height={2.5}
        rx={0.75}
        fill={brakeRightFront ? glowColor : "#1A1A1E"}
        stroke={brakeRightFront ? glowColor : color}
        strokeWidth={0.5}
      />
      {brakeRightFront && (
        <circle cx={9.5} cy={19.25} r={5.5} fill="none" stroke={glowColor} strokeWidth={1} filter="url(#glow-cyan)" opacity={0.8} />
      )}

      {/* Rear-left Wheel (x=27, y=-2) */}
      <rect
        x={27}
        y={-2.5}
        width={7}
        height={2.5}
        rx={0.75}
        fill={brakeLeftRear ? glowColor : "#1A1A1E"}
        stroke={brakeLeftRear ? glowColor : color}
        strokeWidth={0.5}
      />
      {brakeLeftRear && (
        <circle cx={30.5} cy={-1.25} r={5.5} fill="none" stroke={glowColor} strokeWidth={1} filter="url(#glow-cyan)" opacity={0.8} />
      )}

      {/* Rear-right Wheel (x=27, y=18) */}
      <rect
        x={27}
        y={18}
        width={7}
        height={2.5}
        rx={0.75}
        fill={brakeRightRear ? glowColor : "#1A1A1E"}
        stroke={brakeRightRear ? glowColor : color}
        strokeWidth={0.5}
      />
      {brakeRightRear && (
        <circle cx={30.5} cy={19.25} r={5.5} fill="none" stroke={glowColor} strokeWidth={1} filter="url(#glow-cyan)" opacity={0.8} />
      )}

      {/* ── Car Body ── */}
      <rect x={0} y={0} width={carW} height={carH} rx={3.5} fill="#141417" stroke={color} strokeWidth={1.25} />

      {/* Front Windshield glass */}
      <path d={`M 7,3 L 13,3 L 13,15 L 7,15 Z`} fill="rgba(79, 107, 138, 0.18)" stroke={color} strokeWidth={0.75} />
      {/* Rear Window glass */}
      <path d={`M 30,3 L 34,3 L 34,15 L 30,15 Z`} fill="rgba(79, 107, 138, 0.18)" stroke={color} strokeWidth={0.75} />

      {/* Side Mirrors */}
      <rect x={10} y={-4} width={2.2} height={1.5} rx={0.3} fill={color} />
      <rect x={10} y={20.5} width={2.2} height={1.5} rx={0.3} fill={color} />
    </g>
  );
}
