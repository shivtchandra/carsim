"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function TpmsScene() {
  // 10s loop
  const { t, phase } = useSceneTimeline(3, undefined, 10);

  // States:
  // Phase 0.0 - 0.3: Cruising, all tyres healthy at 33 PSI
  // Phase 0.3 - 0.65: Rear-Right tyre drops pressure from 33 to 20 PSI (slow puncture)
  // Phase 0.65 - 0.85: Low pressure warning flashes red, tyre sags
  // Phase 0.85 - 1.0: Resets back to healthy for loop

  let psiFL = 33;
  let psiFR = 33;
  let psiRL = 33;
  let psiRR = 33;
  let isWarning = false;
  let rrSagProgress = 0; // 0 to 1

  if (phase >= 0.3 && phase < 0.65) {
    const p = (phase - 0.3) / 0.35;
    psiRR = Math.round(33 - 13 * p);
    rrSagProgress = p;
  } else if (phase >= 0.65 && phase < 0.85) {
    psiRR = 20;
    isWarning = true;
    rrSagProgress = 1;
  } else if (phase >= 0.85) {
    const p = (phase - 0.85) / 0.15;
    psiRR = Math.round(20 + 13 * p);
    rrSagProgress = 1 - p;
  }

  // Sensor wireless pulse animation
  const pulseScale = (t * 2.5) % 1.5;
  const pulseOpacity = 1 - (pulseScale / 1.5);

  // Wheels positions
  // FL: (240, 70), FR: (460, 70)
  // RL: (240, 130), RR: (460, 130)
  const wheels = [
    { id: "fl", cx: 240, cy: 70, label: "FL", psi: psiFL, warn: false },
    { id: "fr", cx: 460, cy: 70, label: "FR", psi: psiFR, warn: false },
    { id: "rl", cx: 240, cy: 130, label: "RL", psi: psiRL, warn: false },
    { id: "rr", cx: 460, cy: 130, label: "RR", psi: psiRR, warn: isWarning },
  ];

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      {/* Blueprint Grid */}
      <defs>
        <pattern id="blueprint-grid-tpms" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid-tpms)" />

      {/* Axis and annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="20">SEC T-22 // TYRE PRESSURE MONITORING SYSTEM (TPMS)</text>
        <text x="10" y="32">SENSOR TYPE: ACTIVE VALVE-STEM // LINK RATE: 125kHz</text>
        <line x1="5" y1="180" x2="695" y2="180" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <line x1="50" y1="10" x2="50" y2="190" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── TOP-DOWN CHASSIS FRAME OUTLINE ── */}
      <g stroke="rgba(79, 107, 138, 0.3)" strokeWidth="1.25" fill="none">
        {/* Chassis outline */}
        <path d="M 270,55 L 430,55 Q 470,55 480,75 L 490,95 Q 490,105 490,105 L 480,125 Q 470,145 430,145 L 270,145 Q 230,145 220,125 L 210,105 Q 210,95 210,95 L 220,75 Q 230,55 270,55 Z" />
        {/* Axles and drivetrain schematic */}
        <line x1="240" y1="70" x2="460" y2="70" strokeWidth="1" />
        <line x1="240" y1="130" x2="460" y2="130" strokeWidth="1.5" />
        <line x1="350" y1="70" x2="350" y2="130" strokeWidth="1" strokeDasharray="3 3" />
        {/* Differential block */}
        <circle cx="350" cy="130" r="8" fill="#131316" />
      </g>

      {/* ── SENSOR TRANSMISSION SIGNAL WAVES ── */}
      {phase < 0.85 && (
        <g stroke="#35D6FF" strokeWidth="0.75" fill="none">
          {wheels.map((w) => {
            if (w.id === "rr" && isWarning) return null; // stop normal wave if warning
            // Draw expanding concentric arcs from wheel to differential center (receiver)
            const dx = 350 - w.cx;
            const dy = 130 - w.cy;
            const angle = Math.atan2(dy, dx);
            const wx = w.cx + Math.cos(angle) * (15 + pulseScale * 30);
            const wy = w.cy + Math.sin(angle) * (15 + pulseScale * 30);
            return (
              <circle
                key={w.id}
                cx={w.cx}
                cy={w.cy}
                r={20 + pulseScale * 40}
                opacity={pulseOpacity * 0.4}
                clipPath="url(#chassis-clip)"
              />
            );
          })}
        </g>
      )}

      {/* ── CHASSIS INSTRUMENT PANEL (Center Dash screen) ── */}
      <g transform="translate(320, 84)">
        <rect x="0" y="0" width="60" height="32" rx="4" fill="#0A0A0C" stroke={isWarning ? SCENE_COLORS.warning : "rgba(79, 107, 138, 0.4)"} strokeWidth={1} />
        {isWarning ? (
          <g>
            {/* Warning triangle */}
            <path d="M 30,5 L 42,25 L 18,25 Z" fill="rgba(217, 119, 6, 0.2)" stroke={SCENE_COLORS.warning} strokeWidth={1} />
            <text x="30" y="22" fill={SCENE_COLORS.warning} fontSize={6} fontFamily="monospace" textAnchor="middle" fontWeight="bold">!</text>
            <text x="30" y="29" fill={SCENE_COLORS.warning} fontSize={4.5} fontFamily="monospace" textAnchor="middle" opacity={0.6 + 0.4 * Math.sin(t * 12)}>LOW PRESSURE</text>
          </g>
        ) : (
          <g>
            <text x="30" y="15" fill={SCENE_COLORS.textPrimary} fontSize={7} fontFamily="monospace" textAnchor="middle" fontWeight="bold">TPMS</text>
            <text x="30" y="24" fill="#35D6FF" fontSize={6} fontFamily="monospace" textAnchor="middle" opacity={0.8}>ALL OK</text>
          </g>
        )}
      </g>

      {/* ── WHEELS AND TYRES ── */}
      {wheels.map((w) => {
        // Rear Right wheel sags/bulges outwards if pressure drops
        const isRR = w.id === "rr";
        const tyreW = 14 + (isRR ? rrSagProgress * 4 : 0); // tyre width bulges
        const tyreH = 26 - (isRR ? rrSagProgress * 2 : 0); // tyre profile collapses slightly
        
        const strokeColor = w.warn ? SCENE_COLORS.warning : "rgba(79, 107, 138, 0.7)";
        const tyreColor = w.warn ? "rgba(217,119,6,0.1)" : "#131316";

        return (
          <g key={w.id}>
            {/* Wheel Tyre Outline */}
            <rect
              x={w.cx - tyreW / 2}
              y={w.cy - tyreH / 2}
              width={tyreW}
              height={tyreH}
              rx={3}
              fill={tyreColor}
              stroke={strokeColor}
              strokeWidth={w.warn ? 1.5 : 1}
            />
            {/* Rim detail */}
            <rect
              x={w.cx - 3}
              y={w.cy - 8}
              width={6}
              height={16}
              rx={1}
              fill="none"
              stroke="rgba(79, 107, 138, 0.3)"
              strokeWidth={0.75}
            />

            {/* Pressure Text Overlay */}
            <rect
              x={w.cx - 25}
              y={w.cy + (w.cy < 100 ? -26 : 18)}
              width={50}
              height={12}
              rx={2}
              fill="rgba(15,15,17,0.8)"
              stroke={w.warn ? SCENE_COLORS.warning : "rgba(79, 107, 138, 0.15)"}
              strokeWidth={0.5}
            />
            <text
              x={w.cx}
              y={w.cy + (w.cy < 100 ? -18 : 26)}
              fill={w.warn ? SCENE_COLORS.warning : SCENE_COLORS.textPrimary}
              fontSize={7}
              fontFamily="monospace"
              textAnchor="middle"
              fontWeight={w.warn ? "bold" : "normal"}
            >
              {w.psi} PSI
            </text>
          </g>
        );
      })}

      {/* Warning Alert Banner */}
      <g transform="translate(480, 20)">
        <rect x="0" y="0" width="200" height="42" rx={6} fill="rgba(79, 107, 138, 0.05)" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <text x="10" y="15" fill={SCENE_COLORS.textPrimary} fontSize={9} fontFamily="monospace" fontWeight="bold">TYRE TELEMETRY INTERFACE</text>
        <text x="10" y="27" fill={isWarning ? SCENE_COLORS.warning : "#35D6FF"} fontSize={8} fontFamily="monospace">
          ALERT: {isWarning ? "LOW PRESSURE DETECTED" : "SENSORS SYNCED"}
        </text>
        <text x="10" y="37" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace">
          REAR RIGHT: {psiRR} PSI
        </text>
      </g>
    </svg>
  );
}
