"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function TouchscreenScene() {
  // 10s loop — captions synced with VisualScene stepper
  const { t, phase } = useSceneTimeline(3, [
    { at: 0, text: "10.25-inch high-definition screen sits in your direct line of sight." },
    { at: 2.0, text: "Tap the right shortcut button to split the screen." },
    { at: 3.5, text: "Split Screen Mode: view navigation maps and media playback side by side." },
    { at: 5.5, text: "Tap the left sidebar to access camera shortcuts." },
    { at: 7.0, text: "Reverse camera feed displays active parking guides and sensor indicators." },
  ], 10);

  // States:
  // Phase 0.0 - 0.2: Navigation Mode
  // Phase 0.2 - 0.35: Finger moves to right toggle button & taps (ripple at 0.35)
  // Phase 0.35 - 0.55: Split Screen Mode (Map 70% + Media 30% with moving waveform)
  // Phase 0.55 - 0.7: Finger moves to left shortcut & taps (ripple at 0.7)
  // Phase 0.7 - 0.85: Reverse Camera Grid Mode
  // Phase 0.85 - 1.0: Closes/fades, transitions back to Navigation to loop

  let activeMode: "nav" | "split" | "camera" = "nav";
  if (phase >= 0.35 && phase < 0.7) {
    activeMode = "split";
  } else if (phase >= 0.7 && phase < 0.9) {
    activeMode = "camera";
  }

  // Finger coordinates
  let fingerX = 580;
  let fingerY = 160;
  let showFinger = false;
  let rippleX = 0;
  let rippleY = 0;
  let rippleVisible = false;
  let rippleScale = 0;

  if (phase >= 0.15 && phase < 0.38) {
    showFinger = true;
    const destX = 485;
    const destY = 95;
    if (phase < 0.35) {
      // Moving to Split Toggle
      const p = (phase - 0.15) / 0.2;
      fingerX = 580 + (destX - 580) * p;
      fingerY = 160 + (destY - 160) * p;
    } else {
      // Tapping and holding
      fingerX = destX;
      fingerY = destY;
      rippleX = destX;
      rippleY = destY;
      rippleVisible = true;
      rippleScale = (phase - 0.35) / 0.03;
    }
  } else if (phase >= 0.5 && phase < 0.73) {
    showFinger = true;
    const destX = 305;
    const destY = 95;
    if (phase < 0.7) {
      // Moving to Camera Toggle
      const p = (phase - 0.5) / 0.2;
      fingerX = 580 + (destX - 580) * p;
      fingerY = 160 + (destY - 160) * p;
    } else {
      // Tapping
      fingerX = destX;
      fingerY = destY;
      rippleX = destX;
      rippleY = destY;
      rippleVisible = true;
      rippleScale = (phase - 0.7) / 0.03;
    }
  }

  // Active media waveforms (sine waves)
  const wavePath1 = Array.from({ length: 15 })
    .map((_, i) => {
      const x = 440 + i * 3.5;
      const y = 92 + Math.sin(t * 8 + i * 0.7) * 4;
      return `${i === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  const wavePath2 = Array.from({ length: 15 })
    .map((_, i) => {
      const x = 440 + i * 3.5;
      const y = 92 - Math.sin(t * 6 + i * 0.5) * 3;
      return `${i === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      {/* Blueprint Grid */}
      <defs>
        <pattern id="blueprint-grid-screen" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid-screen)" />

      {/* Axis and annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="20">SEC T-31 // INFOTAINMENT & HUMAN INTERFACE</text>
        <text x="10" y="32">SCREEN WIDTH: 10.25 INCH // HD IPS PANEL // WIRELESS LINK ACTIVE</text>
        <line x1="5" y1="180" x2="695" y2="180" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <line x1="50" y1="10" x2="50" y2="190" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── DASHBOARD BACKGROUND GRAPHICS ── */}
      <g fill="none" stroke="rgba(79, 107, 138, 0.25)" strokeWidth="1">
        {/* Dashboard top contour */}
        <path d="M 50,160 L 120,130 L 250,55 L 530,55 L 650,110 L 680,160" />
        {/* Central cluster housing */}
        <path d="M 120,130 Q 185,45 250,55" strokeWidth="1.5" />
        
        {/* Steering Wheel Outline (Left Hand Drive cluster representation) */}
        <circle cx={185} cy={95} r={32} />
        <circle cx={185} cy={95} r={28} strokeDasharray="3 3" />
        <line x1="185" y1="95" x2="153" y2="95" />
        <line x1="185" y1="95" x2="217" y2="95" />
        <line x1="185" y1="95" x2="185" y2="127" />

        {/* HVAC Vents underneath the screen */}
        <rect x="290" y="142" width="200" height="10" rx="2" fill="#141416" />
        <line x1="340" y1="142" x2="340" y2="152" />
        <line x1="390" y1="142" x2="390" y2="152" />
        <line x1="440" y1="142" x2="440" y2="152" />
      </g>

      {/* ── THE 10"+ TOUCHSCREEN SCREEN HOUSING ── */}
      <g>
        {/* Glass Screen Frame */}
        <rect x="280" y="60" width="220" height="74" rx="6" fill="#131316" stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1.5} />
        
        {/* Active Screen Area (Dark background for contrast) */}
        <rect x="285" y="64" width="210" height="66" rx="4" fill="#09060D" />

        {/* Screen Content depending on active mode */}
        {activeMode === "nav" && (
          <g>
            {/* GPS Map Roads */}
            <path d="M 290,95 L 490,95 M 340,65 L 340,129 M 430,65 Q 450,90 420,125" fill="none" stroke="rgba(79, 107, 138, 0.2)" strokeWidth={3} />
            <path d="M 290,95 L 490,95 M 340,65 L 340,129" fill="none" stroke="#35D6FF" strokeWidth={1} opacity={0.6} />
            {/* Route path */}
            <path d="M 340,120 L 340,95 L 450,95" fill="none" stroke="#35D6FF" strokeWidth={2} strokeLinecap="round" />
            <polygon points="450,95 444,92 444,98" fill="#35D6FF" />
            
            {/* Navigation text box */}
            <rect x="290" y="68" width="45" height="18" rx="2" fill="rgba(53,214,255,0.08)" stroke="rgba(53,214,255,0.3)" strokeWidth={0.5} />
            <text x="294" y="77" fill="#35D6FF" fontSize={6} fontFamily="monospace">ETA: 12 min</text>
            <text x="294" y="83" fill={SCENE_COLORS.textSecondary} fontSize={5} fontFamily="monospace">Dist: 8.4 km</text>

            {/* Tap toggle highlight on right side */}
            <rect x="475" y="85" width="15" height="20" rx="3" fill="rgba(53,214,255,0.05)" stroke="#35D6FF" strokeWidth={0.5} strokeDasharray="2 2" />
            <text x="482.5" y="97" fill="#35D6FF" fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight="bold">+</text>
          </g>
        )}

        {activeMode === "split" && (
          <g>
            {/* Map shrunk to 70% width (X = 285 to 430) */}
            <path d="M 290,95 L 425,95 M 340,65 L 340,129" fill="none" stroke="rgba(79, 107, 138, 0.2)" strokeWidth={2.5} />
            <path d="M 340,120 L 340,95 L 395,95" fill="none" stroke="#35D6FF" strokeWidth={1.5} strokeLinecap="round" />
            
            {/* Split Screen boundary divider */}
            <line x1="430" y1="64" x2="430" y2="130" stroke="rgba(79, 107, 138, 0.3)" strokeWidth={1} />

            {/* Media Player Panel (X = 430 to 495) */}
            <rect x="432" y="66" width="61" height="62" rx="2" fill="rgba(15,15,17,0.4)" />
            <text x="462" y="74" fill={SCENE_COLORS.textPrimary} fontSize={6} fontFamily="monospace" textAnchor="middle">BLU-PRINT</text>
            <text x="462" y="80" fill={SCENE_COLORS.textSecondary} fontSize={5} fontFamily="monospace" textAnchor="middle">HYPER-BEAT</text>
            
            {/* Animated waveforms */}
            <path d={wavePath1} fill="none" stroke="#35D6FF" strokeWidth={1} />
            <path d={wavePath2} fill="none" stroke="#35D6FF" strokeWidth={0.5} opacity={0.6} />

            {/* Media controls mockup */}
            <circle cx="452" cy="115" r="3" fill={SCENE_COLORS.textSecondary} />
            <circle cx="462" cy="115" r="4.5" fill="#35D6FF" />
            <circle cx="472" cy="115" r="3" fill={SCENE_COLORS.textSecondary} />
          </g>
        )}

        {activeMode === "camera" && (
          <g>
            {/* Camera feed background */}
            <rect x="285" y="64" width="210" height="66" rx="4" fill="#0d0a13" />
            
            {/* Reverse Guidelines (Cyan-amber curved path) */}
            <path d="M 330,130 L 375,70 M 450,130 L 405,70" fill="none" stroke="#10b981" strokeWidth={1.5} opacity={0.7} />
            <path d="M 350,100 L 430,100" fill="none" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
            <path d="M 365,80 L 415,80" fill="none" stroke="#ef4444" strokeWidth={1.5} />

            {/* Top-down vehicle mockup overlay */}
            <rect x="465" y="72" width="22" height="42" rx="3" fill="#16161a" stroke="rgba(79, 107, 138, 0.4)" strokeWidth={0.75} />
            {/* Obstacle warning arc behind car */}
            <path d="M 467,118 Q 476,126 485,118" fill="none" stroke="#ef4444" strokeWidth={1.5} opacity={0.6 + 0.4 * Math.sin(t * 15)} />
            
            {/* Text badge */}
            <text x="295" y="76" fill="#ef4444" fontSize={6} fontFamily="monospace" fontWeight="bold">REAR CAMERA VIEW</text>
          </g>
        )}

        {/* Small Left Sidebar shortcuts (navigation, home, apps, settings) */}
        <rect x="285" y="64" width="16" height="66" fill="#0A0A0B" rx="1" />
        <circle cx={293} cy={74} r={2.5} fill="#35D6FF" />
        <circle cx={293} cy={88} r={2.5} fill={SCENE_COLORS.textSecondary} />
        <circle cx={293} cy={102} r={2.5} fill={SCENE_COLORS.textSecondary} />
        <circle cx={293} cy={116} r={2.5} fill={SCENE_COLORS.textSecondary} />
      </g>

      {/* ── INTERACTIVE FINGER & TAP RIPPLE ── */}
      {rippleVisible && (
        <circle
          cx={rippleX}
          cy={rippleY}
          r={Math.min(18, rippleScale * 18)}
          fill="none"
          stroke="#35D6FF"
          strokeWidth={1.5}
          opacity={1 - Math.min(1, rippleScale)}
        />
      )}

      {showFinger && (
        <g transform={`translate(${fingerX}, ${fingerY})`}>
          {/* Finger silhouette outline */}
          <path
            d="M 0,0 
               L 8,24 
               L 16,22 
               L 10,12 
               L 18,10
               L 20,4
               L 12,5
               L 9,2
               Z"
            fill="rgba(245,241,232,0.9)"
            stroke={SCENE_COLORS.secondary}
            strokeWidth={1}
            transform="scale(0.8) translate(-10, -5)"
          />
        </g>
      )}

      {/* Status Verdict Banner */}
      <g transform="translate(480, 20)">
        <rect x="0" y="0" width="200" height="42" rx={6} fill="rgba(79, 107, 138, 0.05)" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <text x="10" y="15" fill={SCENE_COLORS.textPrimary} fontSize={9} fontFamily="monospace" fontWeight="bold">INFOTAINMENT INTEGRATION</text>
        <text x="10" y="27" fill="#35D6FF" fontSize={8} fontFamily="monospace">
          LAYOUT: {activeMode === "nav" ? "FULL-SCREEN MAP" : activeMode === "split" ? "SPLIT-SCREEN PIP" : "REVERSE CAMERA"}
        </text>
        <text x="10" y="37" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace">
          SCREEN SIZE: 10.25 INCHES
        </text>
      </g>
    </svg>
  );
}
