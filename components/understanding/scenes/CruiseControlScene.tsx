"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function CruiseControlScene() {
  // 10s loop with 3 steps
  const { t, phase } = useSceneTimeline(3, [
    { at: 0, text: "On the highway, tap SET at 100 km/h." },
    { at: 3.0, text: "Lift your foot — throttle holds steady." },
    { at: 6.0, text: "Tap brake or RES to adjust. Simple, no radar needed." }
  ], 10);

  // Animate values based on timeline
  let speed = 60;
  let footX = 230;
  let footY = 165;
  let footAngle = -20;
  let accelAngle = 0;
  let brakeAngle = 0;
  let cruiseStatus: "OFF" | "SETTING" | "ON" | "CANCELLED" = "OFF";

  if (t < 3.0) {
    // 1. Manual acceleration to 100 km/h
    const p = t / 3.0;
    speed = 60 + p * 40;
    
    // Foot pushes down on accelerator
    footX = 222 + 8 * p;
    footY = 158 - 3 * p;
    footAngle = -22 - 6 * p; // rotates down slightly
    accelAngle = 10 * p;     // pedal pivots down
    brakeAngle = 0;
    cruiseStatus = "OFF";
  } else if (t >= 3.0 && t < 3.8) {
    // 2. Set Cruise & lift off
    speed = 100;
    const p = (t - 3.0) / 0.8;
    
    // Foot moves away from accelerator to neutral position on floor
    footX = 230 - 30 * p;
    footY = 155 + 10 * p;
    footAngle = -28 + 18 * p; // relaxed angle
    accelAngle = 10 * (1 - p); // accelerator returns to 0
    brakeAngle = 0;
    cruiseStatus = "SETTING";
  } else if (t >= 3.8 && t < 6.0) {
    // 3. Cruise holding speed steady
    speed = 100;
    footX = 200;
    footY = 165;
    footAngle = -10; // resting
    accelAngle = 0;
    brakeAngle = 0;
    cruiseStatus = "ON";
  } else if (t >= 6.0 && t < 6.8) {
    // 4. Move foot to tap brake
    const p = (t - 6.0) / 0.8;
    speed = 100;
    
    // Foot rises and hovers over/presses brake pedal
    footX = 200 - 45 * p;
    footY = 165 - 20 * p;
    footAngle = -10 - 15 * p;
    accelAngle = 0;
    brakeAngle = 0;
    cruiseStatus = "ON";
  } else if (t >= 6.8 && t < 7.5) {
    // 5. Brake press & cruise cancel
    const p = (t - 6.8) / 0.7;
    speed = 100 - p * 15; // speed drops to 85
    
    footX = 155;
    footY = 145;
    footAngle = -25;
    accelAngle = 0;
    brakeAngle = 8 * Math.sin(p * Math.PI); // brake pedal pivots down then releases
    cruiseStatus = "CANCELLED";
  } else {
    // 6. Return foot back to neutral floor or prep start
    const p = (t - 7.5) / 2.5;
    speed = 85 - p * 25; // decelerates back to 60
    
    footX = 155 + 75 * p;
    footY = 145 + 20 * p;
    footAngle = -25 + 5 * p;
    accelAngle = 0;
    brakeAngle = 0;
    cruiseStatus = "OFF";
  }

  // Speedometer Dial calculations
  // Scale speed from 0 - 140 km/h to dial angles.
  // 0 km/h is at -220 degrees, 140 km/h is at 40 degrees.
  const maxDialSpeed = 140;
  const startAngle = 210; // deg
  const endAngle = -30;   // deg
  const rangeAngle = startAngle - endAngle; // 240 deg span
  const speedPercentage = Math.min(speed / maxDialSpeed, 1);
  const needleAngle = startAngle - speedPercentage * rangeAngle;
  
  // Calculate needle end position
  const dialCX = 520;
  const dialCY = 105;
  const dialR = 50;
  const needleLen = 38;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleX = dialCX + needleLen * Math.cos(needleRad);
  const needleY = dialCY - needleLen * Math.sin(needleRad);

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      <defs>
        <pattern id="blueprint-grid-cruise" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
        {/* Glow effect */}
        <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Blueprint Grid */}
      <rect width="100%" height="100%" fill="url(#blueprint-grid-cruise)" />

      {/* Axis annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="20">SEC T-18 // THROTTLE CONTROLLER SCHEMATIC</text>
        <text x="10" y="32">SYSTEM STATE: {cruiseStatus === "ON" ? "CRUISE LOCK ACTIVE" : cruiseStatus === "SETTING" ? "LOCK IN PROGRESS" : "MANUAL CONTROL"}</text>
        <line x1="5" y1="180" x2="695" y2="180" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <line x1="50" y1="10" x2="50" y2="190" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── FOOTWELL CABINET OUTLINE ── */}
      <g stroke="rgba(79, 107, 138, 0.25)" strokeWidth={1.5} fill="none">
        {/* Floor and firewall */}
        <path d="M 80,175 L 250,175 L 340,140 L 340,50 L 380,50" />
        {/* Console upper casing */}
        <path d="M 120,50 L 300,50 L 320,80" strokeDasharray="3 3" />
      </g>

      {/* ── PEDALS ── */}
      {/* 1. Brake Pedal (Pivot at 190, 65) */}
      <g transform={`rotate(${brakeAngle}, 190, 65)`}>
        {/* Pedal lever */}
        <line x1="190" y1="65" x2="178" y2="135" stroke="rgba(79, 107, 138, 0.5)" strokeWidth={3} strokeLinecap="round" />
        {/* Pedal pad */}
        <rect x="160" y="130" width="34" height="10" rx="2" fill="#1A1A1E" stroke="rgba(79, 107, 138, 0.8)" strokeWidth={1.25} />
        {/* Braking pressure visualizer (flashing red glow when active) */}
        {brakeAngle > 1 && (
          <circle cx="177" cy="135" r="8" fill="rgba(200, 76, 49, 0.25)" stroke="#C84C31" strokeWidth={1} />
        )}
      </g>

      {/* 2. Accelerator Pedal (Pivot at 295, 65) */}
      <g transform={`rotate(${accelAngle}, 295, 65)`}>
        {/* Pedal lever */}
        <line x1="295" y1="65" x2="280" y2="140" stroke="rgba(79, 107, 138, 0.5)" strokeWidth={2.2} strokeLinecap="round" />
        {/* Pedal pad */}
        <rect x="272" y="130" width="16" height="32" rx="2" fill="#1A1A1E" stroke="rgba(79, 107, 138, 0.8)" strokeWidth={1.25} />
      </g>

      {/* ── DRIVER'S SHOE/FOOT ── */}
      {/* Shoe heel acts as translation center */}
      <g transform={`translate(${footX}, ${footY}) rotate(${footAngle})`}>
        {/* Shoe Sole & Main Body */}
        {/* Drawn facing left towards the pedals */}
        <path
          d="M 0,0 
             C -6,-6 -8,-16 0,-22 
             C 4,-24 12,-24 16,-20 
             L 52,-10 
             C 58,-8 60,-4 58,-1 
             L 54,2 
             Z"
          fill="#1E1E24"
          stroke={SCENE_COLORS.textPrimary}
          strokeWidth={1.5}
        />
        {/* Stylized Sole Overlay */}
        <path d="M 0,0 L 54,2" stroke="#35D6FF" strokeWidth={2} opacity={0.65} />
        {/* Shoe laces / design stripes */}
        <line x1="20" y1="-18" x2="26" y2="-14" stroke="rgba(245, 241, 232, 0.4)" strokeWidth={1} />
        <line x1="24" y1="-20" x2="30" y2="-16" stroke="rgba(245, 241, 232, 0.4)" strokeWidth={1} />
        <circle cx="5" cy="-8" r="2.5" fill="#35D6FF" opacity={0.2} />
      </g>

      {/* ── THE SPEEDOMETER DIAL (DASHBOARD INSTRUMENT WIDGET) ── */}
      <g transform="translate(0, 0)">
        {/* Gauge Background Ring */}
        <circle cx={dialCX} cy={dialCY} r={dialR} fill="#09060D" stroke="rgba(79, 107, 138, 0.25)" strokeWidth={2.5} />
        
        {/* Speed Indicator Arc */}
        <path
          d={`M ${dialCX - 40} ${dialCY + 23} A 46 46 0 1 1 ${dialCX + 40} ${dialCY + 23}`}
          fill="none"
          stroke="rgba(79, 107, 138, 0.15)"
          strokeWidth={5}
          strokeLinecap="round"
        />

        {/* Speed Level Arc Overlay (Cyan) */}
        <path
          d={`M ${dialCX - 40} ${dialCY + 23} A 46 46 0 1 1 ${dialCX + 40} ${dialCY + 23}`}
          fill="none"
          stroke={cruiseStatus === "ON" || cruiseStatus === "SETTING" ? "#35D6FF" : SCENE_COLORS.accent}
          strokeWidth={5}
          strokeDasharray="210"
          strokeDashoffset={210 - speedPercentage * 195}
          strokeLinecap="round"
          opacity={0.8}
        />

        {/* Major Ticks */}
        {[0, 20, 40, 60, 80, 100, 120, 140].map((tSpeed) => {
          const tPerc = tSpeed / maxDialSpeed;
          const tAngle = startAngle - tPerc * rangeAngle;
          const tRad = (tAngle * Math.PI) / 180;
          const x1 = dialCX + (dialR - 6) * Math.cos(tRad);
          const y1 = dialCY - (dialR - 6) * Math.sin(tRad);
          const x2 = dialCX + (dialR - 2) * Math.cos(tRad);
          const y2 = dialCY - (dialR - 2) * Math.sin(tRad);
          return (
            <line key={tSpeed} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1} />
          );
        })}

        {/* Gauge Center Cap */}
        <circle cx={dialCX} cy={dialCY} r={4} fill={SCENE_COLORS.textPrimary} />

        {/* Needle */}
        <line
          x1={dialCX}
          y1={dialCY}
          x2={needleX}
          y2={needleY}
          stroke={cruiseStatus === "ON" || cruiseStatus === "SETTING" ? "#35D6FF" : SCENE_COLORS.textPrimary}
          strokeWidth={1.75}
          strokeLinecap="round"
          filter={cruiseStatus === "ON" ? "url(#cyan-glow)" : undefined}
        />

        {/* Digital Readout */}
        <text
          x={dialCX}
          y={dialCY + 14}
          textAnchor="middle"
          fill={SCENE_COLORS.textPrimary}
          fontSize={13}
          fontFamily="monospace"
          fontWeight="bold"
        >
          {Math.round(speed)}
        </text>
        <text
          x={dialCX}
          y={dialCY + 22}
          textAnchor="middle"
          fill={SCENE_COLORS.textSecondary}
          fontSize={6.5}
          fontFamily="monospace"
        >
          KM/H
        </text>
      </g>

      {/* ── CRUISE CONTROL INFOPANEL STATUS ── */}
      <g transform="translate(435, 160)">
        {/* Status indicator badges */}
        {cruiseStatus === "OFF" && (
          <g>
            <rect x="0" y="0" width="170" height="24" rx="4" fill="rgba(79, 107, 138, 0.08)" stroke="rgba(79, 107, 138, 0.3)" strokeWidth={1} />
            <text x="10" y="15" fill={SCENE_COLORS.textSecondary} fontSize={8.5} fontFamily="monospace" fontWeight="bold">
              CRUISE: INACTIVE (MANUAL)
            </text>
          </g>
        )}
        
        {cruiseStatus === "SETTING" && (
          <g>
            <rect x="0" y="0" width="170" height="24" rx="4" fill="rgba(53, 214, 255, 0.1)" stroke="#35D6FF" strokeWidth={1.25} />
            <circle cx="14" cy="12" r="3.5" fill="#35D6FF" className="animate-pulse" />
            <text x="24" y="15" fill="#35D6FF" fontSize={8.5} fontFamily="monospace" fontWeight="bold">
              SET LOCK: 100 KM/H
            </text>
          </g>
        )}

        {cruiseStatus === "ON" && (
          <g>
            <rect x="0" y="0" width="170" height="24" rx="4" fill="rgba(53, 214, 255, 0.12)" stroke="#35D6FF" strokeWidth={1.5} filter="url(#cyan-glow)" />
            <rect x="10" y="7" width="8" height="10" fill="#35D6FF" rx="1" />
            <text x="24" y="15" fill="#35D6FF" fontSize={8.5} fontFamily="monospace" fontWeight="bold">
              CRUISE ACTIVE · 100 KM/H
            </text>
          </g>
        )}

        {cruiseStatus === "CANCELLED" && (
          <g>
            <rect x="0" y="0" width="170" height="24" rx="4" fill="rgba(200, 76, 49, 0.15)" stroke="#C84C31" strokeWidth={1.25} />
            <text x="10" y="15" fill="#C84C31" fontSize={8.5} fontFamily="monospace" fontWeight="bold">
              CRUISE CANCELLED (BRAKE)
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
