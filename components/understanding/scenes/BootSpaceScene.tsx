"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function BootSpaceScene({ bootLitres = 400 }: { bootLitres?: number }) {
  // 10s loop
  const { phase } = useSceneTimeline(6, undefined, 10);
  
  // Calculate bags: Nexon (382L -> 3 bags), Creta (433L -> 4 bags), Ioniq (527L -> 5 bags), Q5 (520L -> 5 bags)
  const bags = Math.min(6, Math.max(2, Math.round(bootLitres / 100)));
  const showStroller = bootLitres >= 350;

  // Destination slots inside the trunk cutaway
  // Stacking order: bottom row (left, middle, right), then top row (left, middle, right)
  const slots = [
    { x: 235, y: 116 }, // Slot 0: Bottom-left
    { x: 295, y: 116 }, // Slot 1: Bottom-middle
    { x: 355, y: 116 }, // Slot 2: Bottom-right
    { x: 245, y: 86 },  // Slot 3: Top-left (offset slightly by seat angle)
    { x: 305, y: 86 },  // Slot 4: Top-middle
    { x: 365, y: 86 }   // Slot 5: Top-right
  ];

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      {/* Blueprint Grid Lines */}
      <defs>
        <pattern id="blueprint-grid-space" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid-space)" />

      {/* Axis and annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="20">SEC B-04 // CARGO BAY SCHEMATIC</text>
        <text x="10" y="32">MODEL SCALE: 1:15</text>
        <line x1="5" y1="180" x2="695" y2="180" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <line x1="50" y1="10" x2="50" y2="190" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── CAR BODY WORK CUTAWAY (SLATE BLUE BLUEPRINT STROKE) ── */}
      <g stroke="rgba(79, 107, 138, 0.4)" strokeWidth="1.5" fill="none">
        {/* Exterior Shell */}
        <path d="M 120,45 L 280,45 C 330,45 350,50 375,70 L 440,115 C 455,125 455,148 440,152 L 425,152 L 415,160 L 395,160 C 390,150 380,150 370,150 L 160,150" />
        {/* Bumper Cut */}
        <path d="M 440,152 L 435,175" strokeWidth="1" strokeDasharray="3 3" />
        {/* Seatback partition (slanted) */}
        <path d="M 215,150 L 235,70 L 210,70" stroke="rgba(79, 107, 138, 0.65)" strokeWidth="2" />
        {/* Rear Suspension Hump */}
        <path d="M 270,150 C 275,138 295,138 300,150" strokeWidth="1" />
      </g>

      {/* Bounding box of the Cargo Area */}
      <rect x="225" y="70" width="205" height="80" fill="rgba(79, 107, 138, 0.03)" stroke="rgba(79, 107, 138, 0.15)" strokeDasharray="4 4" rx={4} />
      <text x="235" y="65" fill={SCENE_COLORS.secondary} opacity={0.6} fontSize={8} fontFamily="monospace">
        [CARGO STORAGE BOUNDARY]
      </text>

      {/* ── SEQUENTIAL SUITCASE LOADING ANIMATION ── */}
      {Array.from({ length: bags }).map((_, i) => {
        const dest = slots[i];
        
        // Define animation window for suitcase i
        const startP = i * 0.1;
        const endP = startP + 0.08;
        
        let cx = 580;
        let cy = 80 + i * 12;
        let scale = 1;
        let opacity = 0;
        let rotate = 15;

        if (phase >= startP) {
          opacity = 1;
          if (phase < endP) {
            // Sliding in transition
            const progress = (phase - startP) / (endP - startP);
            // Add a curved bounce trajectory
            cx = 580 + progress * (dest.x - 580);
            cy = (80 + i * 12) + progress * (dest.y - (80 + i * 12)) - Math.sin(progress * Math.PI) * 25;
            rotate = 15 * (1 - progress);
          } else {
            // Locked in place
            cx = dest.x;
            cy = dest.y;
            rotate = 0;
          }
        }

        return (
          <g key={i} transform={`translate(${cx}, ${cy}) rotate(${rotate}, 28, 12)`} opacity={opacity} style={{ transition: "opacity 0.2s" }}>
            {/* Suitcase box */}
            <rect x={0} y={0} width={52} height={25} rx={3.5} fill={SCENE_COLORS.accent} stroke={SCENE_COLORS.accentStroke} strokeWidth={1} />
            {/* Suitcase rib lines */}
            <line x1={8} y1={5} x2={8} y2={20} stroke="rgba(15,15,17,0.3)" strokeWidth={1} />
            <line x1={16} y1={5} x2={16} y2={20} stroke="rgba(15,15,17,0.3)" strokeWidth={1} />
            <line x1={36} y1={5} x2={36} y2={20} stroke="rgba(15,15,17,0.3)" strokeWidth={1} />
            <line x1={44} y1={5} x2={44} y2={20} stroke="rgba(15,15,17,0.3)" strokeWidth={1} />
            {/* Leather corner pads */}
            <path d="M 0,5 L 5,0 M 0,20 L 5,25 M 52,5 L 47,0 M 52,20 L 47,25" stroke="rgba(245,241,232,0.2)" strokeWidth={0.75} />
            {/* Handle top */}
            <rect x={18} y={-3} width={16} height={3} rx={1} fill="#1a1a1e" stroke={SCENE_COLORS.accentStroke} strokeWidth={0.5} />
            {/* Handle pull-bar (telescopic) */}
            <line x1={21} y1={0} x2={21} y2={-3} stroke="#555" strokeWidth={0.75} />
            <line x1={31} y1={0} x2={31} y2={-3} stroke="#555" strokeWidth={0.75} />
            {/* Wheel hubs */}
            <circle cx={6} cy={25} r={2} fill="#000" />
            <circle cx={46} cy={25} r={2} fill="#000" />
          </g>
        );
      })}

      {/* ── STROLLER DYNAMIC UNFOLDING ANIMATION ── */}
      {showStroller && (
        (() => {
          const startP = 0.62;
          const endP = 0.74;
          
          let cx = 600;
          let cy = 110;
          let unfoldProgress = 0;
          let opacity = 0;

          if (phase >= startP) {
            opacity = 1;
            if (phase < endP) {
              const progress = (phase - startP) / (endP - startP);
              cx = 600 - progress * 240;
              cy = 110 + progress * 6;
              unfoldProgress = progress;
            } else {
              cx = 360;
              cy = 116;
              unfoldProgress = 1;
            }
          }

          const angle = (1 - unfoldProgress) * 45; // rotate back when folded

          return (
            <g transform={`translate(${cx}, ${cy}) rotate(${angle}, 15, 12)`} opacity={opacity} style={{ transition: "opacity 0.2s" }}>
              {/* Stroller Frame (Extends dynamically) */}
              <line x1="6" y1="22" x2={6 + unfoldProgress * 24} y2={22 - unfoldProgress * 20} stroke={SCENE_COLORS.secondary} strokeWidth={1.5} strokeLinecap="round" />
              <line x1="28" y1="22" x2={28 - unfoldProgress * 20} y2={22 - unfoldProgress * 20} stroke={SCENE_COLORS.secondary} strokeWidth={1.5} strokeLinecap="round" />
              {/* Push Handle */}
              <path d="M 6,22 L 20,4 C 21,2 24,2 26,4" fill="none" stroke={SCENE_COLORS.secondary} strokeWidth={1.5} strokeLinecap="round" opacity={unfoldProgress} />
              
              {/* Wheels (Grow & anchor) */}
              <circle cx="6" cy="22" r={4} fill="#0F0F11" stroke={SCENE_COLORS.secondary} strokeWidth={1} />
              <circle cx="6" cy="22" r={1.5} fill={SCENE_COLORS.secondary} />
              <circle cx="28" cy="22" r={4} fill="#0F0F11" stroke={SCENE_COLORS.secondary} strokeWidth={1} />
              <circle cx="28" cy="22" r={1.5} fill={SCENE_COLORS.secondary} />

              {/* Foldable Canopy (Spans open) */}
              <path 
                d={`M 14,8 Q ${14 + unfoldProgress * 14},${8 - unfoldProgress * 10} 24,12`} 
                fill="none" 
                stroke={SCENE_COLORS.secondary} 
                strokeWidth={1.25} 
                opacity={unfoldProgress} 
              />
              <path 
                d="M 14,8 L 24,12 L 18,22 Z" 
                fill={SCENE_COLORS.secondarySoft} 
                opacity={unfoldProgress * 0.4} 
              />

              {/* Text label */}
              {unfoldProgress > 0.8 && (
                <text x="0" y="-8" fill={SCENE_COLORS.secondary} fontSize={7} fontFamily="monospace" opacity={(unfoldProgress - 0.8) * 5}>
                  [STROLLER]
                </text>
              )}
            </g>
          );
        })()
      )}

      {/* Capacity Verdict display */}
      <g transform="translate(480, 20)">
        <rect x="0" y="0" width="200" height="42" rx={6} fill="rgba(79, 107, 138, 0.05)" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <text x="10" y="15" fill={SCENE_COLORS.textPrimary} fontSize={9} fontFamily="monospace" fontWeight="bold">LUGGAGE CAPACITY INDEX</text>
        <text x="10" y="27" fill={SCENE_COLORS.accent} fontSize={8} fontFamily="monospace">
          VOLUME: {bootLitres} Litres
        </text>
        <text x="10" y="37" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace">
          FITS: {bags} Cabin Bags {showStroller ? "+ 1 Stroller" : ""}
        </text>
      </g>
    </svg>
  );
}
