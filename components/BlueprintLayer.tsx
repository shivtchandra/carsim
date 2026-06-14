"use client";

import React from "react";
import { AtmosphereMood } from "./SpotlightLayer";

interface BlueprintLayerProps {
  mood?: AtmosphereMood;
}

export default function BlueprintLayer({ mood = "hero" }: BlueprintLayerProps) {
  // Normalize aliases
  const normalizedMood =
    mood === "reveal" ? "hero" :
    mood === "engineering" ? "lab" :
    mood === "ownership" ? "lifecycle" :
    mood === "simulator" ? "simulation" :
    mood === "anteroom" || mood === "cta" ? "luxury" :
    mood;

  // Render chassis/car outlines in Hero, Lab (Trim/Structural) and Simulation sections
  const showCarBlueprint = normalizedMood === "hero" || normalizedMood === "lab" || normalizedMood === "simulation";
  
  // Render financial grids / coordinate matrix in financial (Ownership) section
  const showFinancialGrid = normalizedMood === "financial" || normalizedMood === "lifecycle";

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
      {/* Editorial Grid Lines - horizontal spacing like notebook paper */}
      <div className="absolute inset-0 editorial-grid-lines opacity-[0.45]" />
      
      {showCarBlueprint && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Subtle scanning laser line */}
          <div className="absolute inset-x-0 h-[1px] bg-[#C74B32]/12 animate-scan-line-vertical" style={{ zIndex: 1 }} />
          
          <svg
            className="w-full h-full min-w-[1200px] max-w-[1600px] opacity-[0.16]"
            viewBox="0 0 1440 900"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            style={{ color: "#161616" }}
          >
            {/* 1. Dimensions Coordinates & Tech Grid */}
            <g strokeDasharray="3 9" className="opacity-50">
              {/* Vertical technical lines */}
              {[120, 240, 480, 720, 960, 1200, 1320].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="900" />
              ))}
              {/* Horizontal technical lines */}
              {[150, 300, 450, 600, 750].map((y) => (
                <line key={y} x1="0" y1={y} x2="1440" y2={y} />
              ))}
            </g>

            {/* 2. Sleek Editorial Side-View Car Blueprint (Path) */}
            <g transform="translate(180, 150) scale(1.08)">
              {/* Outer Car Silhouette Outline */}
              <path
                d="M 50 420 
                   C 70 420, 100 410, 120 370 
                   C 140 330, 160 300, 200 270 
                   C 250 230, 310 180, 450 160 
                   C 520 150, 580 150, 680 180 
                   C 780 210, 850 210, 920 270 
                   C 950 295, 990 310, 1020 335
                   C 1050 360, 1070 380, 1075 420
                   L 1090 420
                   C 1095 440, 1090 470, 1060 480
                   C 1040 485, 1000 485, 980 485
                   C 960 455, 940 420, 890 420
                   C 840 420, 820 455, 800 485
                   L 440 485
                   C 420 455, 400 420, 350 420
                   C 300 420, 280 455, 260 485
                   L 100 485
                   C 70 485, 50 460, 50 420 Z"
                strokeWidth="1.8"
                className="opacity-90"
              />

              {/* Window lines & A/B/C Pillars */}
              <path
                d="M 320 270 
                   L 460 178 
                   L 680 190 
                   L 840 270 
                   L 850 330 
                   L 300 330 Z"
                className="opacity-70"
              />
              {/* B-Pillar vertical divide */}
              <line x1="580" y1="172" x2="580" y2="330" className="opacity-70" />
              {/* C-Pillar divide */}
              <line x1="720" y1="192" x2="770" y2="330" className="opacity-50" />
              
              {/* Door panels outline */}
              <path d="M 280 330 L 260 440 C 265 470, 270 485, 280 485" className="opacity-40" />
              <path d="M 580 330 L 575 485" className="opacity-40" />
              <path d="M 870 330 L 890 420" className="opacity-40" />
              <line x1="280" y1="360" x2="860" y2="360" className="opacity-40" strokeDasharray="3 3" />

              {/* Rotating Blueprint Wheels */}
              {/* Wheel 1: Front (Left in SVG layout) */}
              <g transform="translate(350, 485)">
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="16s"
                    repeatCount="indefinite"
                  />
                  <circle cx="0" cy="0" r="62" fill="none" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="54" fill="none" strokeWidth="0.8" strokeDasharray="4 4" />
                  <circle cx="0" cy="0" r="16" fill="none" strokeWidth="1" />
                  {/* Spokes */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1="0"
                      x2={62 * Math.cos((i * Math.PI) / 4)}
                      y2={62 * Math.sin((i * Math.PI) / 4)}
                      strokeWidth="0.8"
                      className="opacity-70"
                    />
                  ))}
                </g>
              </g>

              {/* Wheel 2: Rear (Right in SVG layout) */}
              <g transform="translate(890, 485)">
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="16s"
                    repeatCount="indefinite"
                  />
                  <circle cx="0" cy="0" r="62" fill="none" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="54" fill="none" strokeWidth="0.8" strokeDasharray="4 4" />
                  <circle cx="0" cy="0" r="16" fill="none" strokeWidth="1" />
                  {/* Spokes */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1="0"
                      x2={62 * Math.cos((i * Math.PI) / 4)}
                      y2={62 * Math.sin((i * Math.PI) / 4)}
                      strokeWidth="0.8"
                      className="opacity-70"
                    />
                  ))}
                </g>
              </g>

              {/* Ground level line */}
              <line x1="0" y1="547" x2="1140" y2="547" strokeWidth="1" />
              {/* Shadow effect */}
              <ellipse cx="620" cy="547" rx="480" ry="12" className="opacity-20" style={{ fill: "currentColor" }} />

              {/* Technical Dimension Arrows */}
              <g stroke="#C74B32" strokeWidth="0.8" className="opacity-70">
                {/* Wheelbase Dimension line */}
                <line x1="350" y1="520" x2="890" y2="520" />
                <polygon points="350,520 360,517 360,523" fill="#C74B32" />
                <polygon points="890,520 880,517 880,523" fill="#C74B32" />
                
                {/* Total Length Dimension line */}
                <line x1="50" y1="570" x2="1090" y2="570" />
                <polygon points="50,570 60,567 60,573" fill="#C74B32" />
                <polygon points="1090,570 1080,567 1080,573" fill="#C74B32" />

                {/* Vertical Height Line */}
                <line x1="1120" y1="150" x2="1120" y2="547" />
                <polygon points="1120,150 1117,160 1123,160" fill="#C74B32" />
                <polygon points="1120,547 1117,537 1123,537" fill="#C74B32" />
              </g>

              {/* Dimension Labels in Burnt Vermillion */}
              <g fill="#C74B32" className="font-mono text-[9px] font-semibold tracking-widest opacity-80">
                <text x="580" y="514" textAnchor="middle">WHEELBASE: 2620 MM</text>
                <text x="570" y="564" textAnchor="middle">TOTAL LENGTH: 4460 MM</text>
                <text x="1130" y="350" transform="rotate(90, 1130, 350)" textAnchor="middle">HEIGHT: 1635 MM</text>
              </g>

              {/* Chassis structural callouts */}
              <g fill="#161616" className="font-mono text-[8px] opacity-40">
                <text x="210" y="250">FRONT OVERHANG: 870MM</text>
                <text x="940" y="250">REAR OVERHANG: 970MM</text>
                <text x="400" y="320">D-WISHBONE FRONT</text>
                <text x="750" y="320">MULTI-LINK REAR</text>
                <text x="50" y="140">DRIVESCOPE DIRECTIVE // BLUEPRINT-07a</text>
              </g>
            </g>

            {/* 3. Aerodynamic Wind Tunnel Vector Flow Lines (Airflow) */}
            {normalizedMood === "simulation" && (
              <g stroke="#C74B32" strokeWidth="1" strokeDasharray="20 180" className="blueprint-wind-vectors">
                <path d="M 0 320 C 200 320, 300 280, 420 280 C 500 280, 600 240, 720 240 C 850 240, 950 340, 1440 340" className="animate-wind-flow-1" />
                <path d="M 0 350 C 180 350, 280 310, 400 310 C 480 310, 580 260, 700 260 C 840 260, 920 380, 1440 380" className="animate-wind-flow-2" />
                <path d="M 0 280 C 250 280, 320 230, 460 210 C 560 190, 680 190, 800 230 C 900 270, 1000 300, 1440 300" className="animate-wind-flow-3" />
                <path d="M 0 440 C 150 440, 200 430, 260 410 C 300 390, 380 430, 500 430 C 650 430, 750 430, 840 410 C 900 395, 1020 440, 1440 440" className="animate-wind-flow-4" />
              </g>
            )}
          </svg>
        </div>
      )}

      {showFinancialGrid && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.14]">
          {/* Coordinates and finance lines background */}
          <svg className="w-full h-full min-w-[1024px]" viewBox="0 0 1440 900" stroke="#161616" strokeWidth="0.8" fill="none">
            <g strokeDasharray="4 12" strokeWidth="0.5">
              {[80, 200, 320, 440, 560, 680, 800, 920, 1040, 1160, 1280].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="900" />
              ))}
              {[100, 220, 340, 460, 580, 700, 820].map((y) => (
                <line key={y} x1="0" y1={y} x2="1440" y2={y} />
              ))}
            </g>
            
            {/* Blinking ledger intersections */}
            <g fill="#C74B32" stroke="#C74B32">
              <circle cx="320" cy="340" r="2.5" className="animate-ping" style={{ animationDuration: "3s" }} />
              <circle cx="320" cy="340" r="1.5" />
              <text x="330" y="337" fill="#161616" fontSize="8" fontFamily="monospace" className="opacity-50">NODE [P1.DEPR]</text>
              
              <circle cx="800" cy="460" r="2.5" className="animate-ping" style={{ animationDuration: "4s" }} />
              <circle cx="800" cy="460" r="1.5" />
              <text x="810" y="457" fill="#161616" fontSize="8" fontFamily="monospace" className="opacity-50">EST-INTEREST [5.4%]</text>

              <circle cx="1160" cy="220" r="2.5" className="animate-ping" style={{ animationDuration: "2.5s" }} />
              <circle cx="1160" cy="220" r="1.5" />
              <text x="1170" y="217" fill="#161616" fontSize="8" fontFamily="monospace" className="opacity-50">TCO-SUM [MAX]</text>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}
