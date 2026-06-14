"use client";

import React, { useEffect, useRef } from "react";
import { Gauge, Radar, Shield, TrendingUp } from "lucide-react";

export default function UnifiedCanvas() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!parallaxRef.current) return;
      
      // Disable parallax on mobile/tablet for performance and layout safety
      if (window.innerWidth < 1024) {
        parallaxRef.current.style.transform = "";
        return;
      }

      const scrollY = window.scrollY;
      const yOffset = scrollY * -0.09; // 9% parallax speed (feels deep and subtle)
      
      parallaxRef.current.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Run once initially
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <div 
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 bg-[#F5F1E8]" 
      aria-hidden="true"
    >
      {/* 1. Global grid lines spanning entire height */}
      <div className="absolute inset-0 editorial-grid-lines opacity-[0.45]" />

      {/* 2. Parallax Layer (floats over the grid) */}
      <div 
        ref={parallaxRef} 
        className="absolute inset-0 w-full h-full"
        style={{ willChange: "transform" }}
      >
        {/* Unified F1 Blueprint Vertical Layout */}
        <div className="absolute inset-x-0 top-0 w-full flex justify-center">
        <svg
          className="w-full max-w-[1440px] opacity-[0.06] text-[#4F6B8A]"
          viewBox="0 0 1200 5200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* TECHNICAL CALIBRATION LINES */}
          <g strokeDasharray="3 9" className="opacity-40">
            {/* Verticals */}
            {[100, 300, 500, 600, 700, 900, 1100].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="5200" />
            ))}
            {/* Horizontals */}
            {[200, 600, 1000, 1400, 1800, 2200, 2600, 3000, 3400, 3800, 4200, 4600, 5000].map((y) => (
              <line key={y} x1="0" y1={y} x2="1200" y2={y} />
            ))}
          </g>

          {/* FRONT AERODYNAMIC SYSTEM (y = 100 to y = 600) */}
          <g id="front-wing">
            {/* Nose Cone outline */}
            <path d="M 600 150 C 585 220, 580 320, 575 480 C 570 560, 568 620, 565 720 L 635 720 C 632 620, 630 560, 625 480 C 620 320, 615 220, 600 150 Z" strokeWidth="1.8" />
            
            {/* Front Wing Assembly flaps */}
            {/* Left Main Plane */}
            <path d="M 578 350 L 250 350 L 250 420 L 576 400 Z" />
            <path d="M 578 365 L 260 365 L 260 405 L 577 390 Z" className="opacity-70" />
            <path d="M 578 380 L 270 380 L 270 395 L 578 385 Z" className="opacity-50" />
            {/* Right Main Plane */}
            <path d="M 622 350 L 950 350 L 950 420 L 624 400 Z" />
            <path d="M 622 365 L 940 365 L 940 405 L 623 390 Z" className="opacity-70" />
            <path d="M 622 380 L 930 380 L 930 395 L 622 385 Z" className="opacity-50" />

            {/* Endplates */}
            <rect x="245" y="320" width="5" height="120" rx="1" />
            <rect x="950" y="320" width="5" height="120" rx="1" />
            
            {/* Gurney flap lip */}
            <line x1="250" y1="350" x2="950" y2="350" strokeWidth="0.8" />
          </g>

          {/* FRONT SUSPENSION & TIRES (y = 700 to y = 1100) */}
          <g id="front-suspension">
            {/* Left Wheel */}
            <rect x="180" y="740" width="110" height="230" rx="10" strokeWidth="1.5" />
            {/* Inner rim lines */}
            <rect x="200" y="760" width="70" height="190" rx="4" className="opacity-60" />
            <circle cx="235" cy="855" r="16" className="opacity-55" />
            {/* Right Wheel */}
            <rect x="910" y="740" width="110" height="230" rx="10" strokeWidth="1.5" />
            <rect x="930" y="760" width="70" height="190" rx="4" className="opacity-60" />
            <circle cx="965" cy="855" r="16" className="opacity-55" />

            {/* Suspension Wishbones */}
            {/* Left upper wishbone */}
            <line x1="572" y1="760" x2="290" y2="820" strokeWidth="1.5" />
            {/* Left lower wishbone */}
            <line x1="570" y1="910" x2="290" y2="890" strokeWidth="1.5" />
            {/* Left pushrod */}
            <line x1="571" y1="910" x2="290" y2="820" strokeWidth="1" />
            {/* Left steering linkage */}
            <line x1="570" y1="860" x2="290" y2="860" strokeWidth="1" strokeDasharray="3 3" />

            {/* Right upper wishbone */}
            <line x1="628" y1="760" x2="910" y2="820" strokeWidth="1.5" />
            {/* Right lower wishbone */}
            <line x1="630" y1="910" x2="910" y2="890" strokeWidth="1.5" />
            {/* Right pushrod */}
            <line x1="629" y1="910" x2="910" y2="820" strokeWidth="1" />
            {/* Right steering linkage */}
            <line x1="630" y1="860" x2="910" y2="860" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* CHASSIS CELL & COCKPIT (y = 1100 to y = 2000) */}
          <g id="chassis-cockpit">
            {/* Chassis Monocoque widening */}
            <path d="M 565 720 C 565 920, 550 1100, 520 1350 C 500 1520, 500 1700, 505 2000 L 695 2000 C 700 1700, 700 1520, 680 1350 C 650 1100, 635 920, 635 720 Z" strokeWidth="1.8" />
            
            {/* Halo Protection Safety Cell */}
            <path d="M 600 1350 C 585 1400, 555 1580, 555 1660 C 555 1680, 560 1690, 570 1690 C 585 1690, 595 1580, 600 1500 C 605 1580, 615 1690, 630 1690 C 640 1690, 645 1680, 645 1660 C 645 1580, 615 1400, 600 1350 Z" strokeWidth="1.5" />
            
            {/* Cockpit opening capsule */}
            <rect x="545" y="1460" width="110" height="280" rx="55" />
            
            {/* Monocoque cross section structural bulkhead lines */}
            {[1180, 1300, 1420, 1540, 1660, 1780, 1900].map((y) => (
              <line key={y} x1="515" y1={y} x2="685" y2={y} className="opacity-35" />
            ))}

            {/* F1 Steering Wheel (Top View Detail) */}
            <g transform="translate(600, 1490)">
              <rect x="-24" y="-18" width="48" height="36" rx="8" strokeWidth="1.5" />
              {/* Handles */}
              <path d="-24 -10 C -30 -5, -30 5, -24 10" strokeWidth="2" />
              <path d="24 -10 C 30 -5, 30 5, 24 10" strokeWidth="2" />
              {/* HUD Screen */}
              <rect x="-12" y="-10" width="24" height="14" rx="2" className="opacity-70" />
              {/* Dial buttons */}
              <circle cx="-6" cy="10" r="2" />
              <circle cx="6" cy="10" r="2" />
              <circle cx="0" cy="10" r="2" />
            </g>

            {/* Driver seat mold outline */}
            <path d="M 560 1550 L 565 1710 C 565 1730, 635 1730, 635 1710 L 640 1550" className="opacity-60" />
          </g>

          {/* SIDEPODS & INTAKES (y = 1300 to y = 2600) */}
          <g id="sidepods">
            {/* Sidepod outer body limits (Coke-bottle shape) */}
            <path d="M 525 1150 C 470 1200, 420 1350, 420 1550 C 420 1850, 440 2150, 495 2450 C 500 2500, 502 2550, 505 2600" strokeWidth="1.8" />
            <path d="M 675 1150 C 730 1200, 780 1350, 780 1550 C 780 1850, 760 2150, 705 2450 C 700 2500, 698 2550, 695 2600" strokeWidth="1.8" />

            {/* Sidepod Intakes mouths */}
            <path d="M 520 1320 C 480 1320, 430 1340, 430 1380 L 505 1380" />
            <path d="M 680 1320 C 720 1320, 770 1340, 770 1380 L 695 1380" />
            
            {/* Radiator Cooling Matrix detail (Left sidepod) */}
            <g className="opacity-25">
              <line x1="440" y1="1450" x2="495" y2="1550" />
              <line x1="440" y1="1480" x2="495" y2="1580" />
              <line x1="440" y1="1510" x2="495" y2="1610" />
              <line x1="440" y1="1540" x2="495" y2="1640" />
              <line x1="440" y1="1570" x2="495" y2="1670" />
              {/* Radiator frame */}
              <rect x="435" y="1430" width="65" height="260" strokeDasharray="2 4" />
            </g>
            {/* Radiator Cooling Matrix detail (Right sidepod) */}
            <g className="opacity-25">
              <line x1="760" y1="1450" x2="705" y2="1550" />
              <line x1="760" y1="1480" x2="705" y2="1580" />
              <line x1="760" y1="1510" x2="705" y2="1610" />
              <line x1="760" y1="1540" x2="705" y2="1640" />
              <line x1="760" y1="1570" x2="705" y2="1670" />
              <rect x="700" y="1430" width="65" height="260" strokeDasharray="2 4" />
            </g>
          </g>

          {/* POWER UNIT SYSTEM (y = 2600 to y = 3700) */}
          <g id="power-unit">
            {/* Engine cover centerline ridge */}
            <line x1="600" y1="2000" x2="600" y2="3500" strokeWidth="1.5" strokeDasharray="15 5" />
            
            {/* V6 Engine block outline */}
            <rect x="550" y="2550" width="100" height="160" rx="4" strokeWidth="1.5" />
            {/* Cylinder bores (V6 configuration) */}
            {[2580, 2630, 2680].map((y) => (
              <g key={y}>
                <circle cx="568" cy={y} r="10" />
                <circle cx="632" cy={y} r="10" />
              </g>
            ))}

            {/* Turbocharger detail */}
            <circle cx="600" cy="2750" r="18" strokeWidth="1.2" />
            <circle cx="600" cy="2750" r="8" className="opacity-70" />
            {/* Impeller vanes */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={i}
                x1="600"
                y1="2750"
                x2={600 + 18 * Math.cos((i * Math.PI) / 3)}
                y2={2750 + 18 * Math.sin((i * Math.PI) / 3)}
                className="opacity-60"
              />
            ))}

            {/* Exhaust pipes manifolds curving back */}
            <path d="M 545 2580 C 520 2600, 520 2780, 582 2840" strokeWidth="1" className="opacity-80" />
            <path d="M 545 2630 C 525 2645, 525 2795, 582 2845" strokeWidth="1" className="opacity-80" />
            <path d="M 545 2680 C 530 2690, 530 2810, 582 2850" strokeWidth="1" className="opacity-80" />

            <path d="M 655 2580 C 680 2600, 680 2780, 618 2840" strokeWidth="1" className="opacity-80" />
            <path d="M 655 2630 C 675 2645, 675 2795, 618 2845" strokeWidth="1" className="opacity-80" />
            <path d="M 655 2680 C 670 2690, 670 2810, 618 2850" strokeWidth="1" className="opacity-80" />

            {/* Single Exhaust outlet tube running back to rear wing */}
            <path d="M 600 2868 L 600 3950" strokeWidth="2.2" />

            {/* Energy Store (Hybrid Battery Pack) */}
            <rect x="540" y="2950" width="120" height="140" rx="3" />
            <rect x="550" y="2960" width="100" height="120" rx="1" strokeDasharray="3 3" className="opacity-70" />
            <text x="600" y="3025" textAnchor="middle" fill="currentColor" fontSize="10" fontFamily="monospace" className="opacity-50">HYBRID BATTERY [ES]</text>

            {/* Gearbox Casing structure */}
            <rect x="560" y="3180" width="80" height="220" rx="4" strokeWidth="1.5" />
            <path d="M 560 3250 L 640 3250" />
            <path d="M 560 3320 L 640 3320" />
          </g>

          {/* REAR SUSPENSION & TIRES (y = 3500 to y = 4100) */}
          <g id="rear-suspension">
            {/* Left Rear Tire (Wider!) */}
            <rect x="150" y="3480" width="140" height="250" rx="10" strokeWidth="1.5" />
            <rect x="175" y="3500" width="90" height="210" rx="4" className="opacity-60" />
            <circle cx="220" cy="3605" r="18" className="opacity-55" />
            
            {/* Right Rear Tire */}
            <rect x="910" y="3480" width="140" height="250" rx="10" strokeWidth="1.5" />
            <rect x="935" y="3500" width="90" height="210" rx="4" className="opacity-60" />
            <circle cx="980" cy="3605" r="18" className="opacity-55" />

            {/* Rear Wishbones */}
            {/* Left upper wishbone */}
            <line x1="560" y1="3520" x2="290" y2="3580" strokeWidth="1.5" />
            {/* Left lower wishbone */}
            <line x1="560" y1="3670" x2="290" y2="3650" strokeWidth="1.5" />
            {/* Left drive shaft */}
            <line x1="560" y1="3610" x2="290" y2="3610" strokeWidth="1.8" />

            {/* Right upper wishbone */}
            <line x1="640" y1="3520" x2="910" y2="3580" strokeWidth="1.5" />
            {/* Right lower wishbone */}
            <line x1="640" y1="3670" x2="910" y2="3650" strokeWidth="1.5" />
            {/* Right drive shaft */}
            <line x1="640" y1="3610" x2="910" y2="3610" strokeWidth="1.8" />
          </g>

          {/* REAR AERODYNAMIC SYSTEM (y = 4100 to y = 4800) */}
          <g id="rear-wing">
            {/* Rear Wing Flaps assembly */}
            <rect x="290" y="4150" width="620" height="70" rx="2" strokeWidth="1.5" />
            <line x1="290" y1="4185" x2="910" y2="4185" strokeWidth="1" />
            
            {/* DRS Actuator pod */}
            <rect x="588" y="4125" width="24" height="45" rx="3" />
            <line x1="600" y1="4125" x2="600" y2="4170" strokeWidth="1" />

            {/* Endplates */}
            <rect x="285" y="4100" width="5" height="150" rx="1" />
            <rect x="910" y="4100" width="5" height="150" rx="1" />

            {/* Diffuser channels (vertical tunnel partitions strakes) */}
            <g className="opacity-80">
              {[500, 530, 560, 580, 600, 620, 640, 670, 700].map((x) => (
                <path key={x} d={`M ${x} 4220 C ${x} 4280, ${600 + (x - 600) * 1.3} 4350, ${600 + (x - 600) * 1.6} 4460`} strokeWidth="1" />
              ))}
              <rect x="440" y="4458" width="320" height="4" rx="2" />
            </g>
          </g>

          {/* ACCENT MEASUREMENT ANNOTATIONS (Burnt Vermillion #C84C31) */}
          <g stroke="#C84C31" strokeWidth="0.8" className="opacity-45">
            {/* Total Length Dim line */}
            <line x1="100" y1="100" x2="100" y2="4500" />
            <polygon points="100,100 97,112 103,112" fill="#C84C31" />
            <polygon points="100,4500 97,4488 103,4488" fill="#C84C31" />

            {/* Front Track Dim line */}
            <line x1="235" y1="710" x2="965" y2="710" />
            <polygon points="235,710 247,707 247,713" fill="#C84C31" />
            <polygon points="965,710 953,707 953,713" fill="#C84C31" />

            {/* Wheelbase Dim line */}
            <line x1="130" y1="855" x2="130" y2="3605" />
            <polygon points="130,855 127,867 133,867" fill="#C84C31" />
            <polygon points="130,3605 127,3593 133,3593" fill="#C84C31" />

            {/* Rear Track Dim line */}
            <line x1="220" y1="3440" x2="980" y2="3440" />
            <polygon points="220,3440 232,3437 232,3443" fill="#C84C31" />
            <polygon points="980,3440 968,3437 968,3443" fill="#C84C31" />
          </g>

          {/* DIMENSION LABELS IN MONO */}
          <g fill="#C84C31" className="font-mono text-[8px] tracking-[0.2em] font-semibold opacity-70">
            <text x="88" y="2300" transform="rotate(-90, 88, 2300)" textAnchor="middle">TOTAL LENGTH: 5600 MM</text>
            <text x="118" y="2230" transform="rotate(-90, 118, 2230)" textAnchor="middle">WHEELBASE: 3600 MM</text>
            <text x="600" y="698" textAnchor="middle">FRONT TRACK Width: 2000 MM</text>
            <text x="600" y="3428" textAnchor="middle">REAR TRACK Width: 2000 MM</text>
          </g>

          {/* ENGINE CALIBRATION STAMPS */}
          <g fill="currentColor" className="font-mono text-[7px] tracking-widest opacity-25">
            <text x="600" y="100">DRIVE SCOPE RESEARCH BLUEPRINT // F1 CHASSIS CELL // press_v09.26</text>
            <text x="255" y="345">WING FLAP SYSTEM [SECTION A-01] // ACTIVE FLAPS</text>
            <text x="945" y="345" textAnchor="end">AERO FLOW MODEL V.082 // DRAG REDUCTION INDEX</text>
            <text x="560" y="2480">POWERTRAIN GRID [PU.D-02]</text>
            <text x="500" y="4490">DIFFUSER CHANNEL TUNNELS [D.ST-04]</text>
          </g>
        </svg>
      </div>

      {/* 3. Major Chapter Watermark Elements (Opacity 2-3%, size 320px+) */}
      {/* Chapter 01: Hero / Specs (y ~ 12% of scrollheight) */}
      <div 
        className="absolute left-[8%] top-[12%] text-[#4F6B8A]/[0.03] pointer-events-none z-0"
        style={{ transform: "rotate(-12deg)" }}
      >
        <Gauge size={380} strokeWidth={0.3} />
      </div>

      {/* Chapter 02: Ownership (y ~ 32%) */}
      <div 
        className="absolute right-[8%] top-[32%] text-[#4F6B8A]/[0.03] pointer-events-none z-0"
        style={{ transform: "rotate(8deg)" }}
      >
        <TrendingUp size={380} strokeWidth={0.3} />
      </div>

      {/* Chapter 03: Compare (y ~ 54%) */}
      <div 
        className="absolute left-[10%] top-[54%] text-[#4F6B8A]/[0.03] pointer-events-none z-0"
        style={{ transform: "rotate(-8deg)" }}
      >
        <Radar size={380} strokeWidth={0.3} />
      </div>

      {/* Chapter 04: Simulator (y ~ 76%) */}
      <div 
        className="absolute right-[12%] top-[76%] text-[#4F6B8A]/[0.03] pointer-events-none z-0"
        style={{ transform: "rotate(12deg)" }}
      >
        <Shield size={380} strokeWidth={0.3} />
      </div>

      {/* 4. Technical Annotations in Margin (2% opacity) */}
      <div className="absolute top-[8%] left-10 font-mono text-[9px] text-[#161616]/[0.02] tracking-[0.3em] uppercase writing-vertical select-none pointer-events-none">
        SECTION A-01 // NOSE AERODYNAMICS
      </div>
      <div className="absolute top-[18%] right-10 font-mono text-[9px] text-[#161616]/[0.02] tracking-[0.3em] uppercase writing-vertical select-none pointer-events-none">
        FRONT SUSPENSION MATRIX // WISHBONE CELL
      </div>
      <div className="absolute top-[38%] left-10 font-mono text-[9px] text-[#161616]/[0.02] tracking-[0.3em] uppercase writing-vertical select-none pointer-events-none">
        MONOCOQUE DRIVER CONTAINER // CHASSIS CELL
      </div>
      <div className="absolute top-[58%] right-10 font-mono text-[9px] text-[#161616]/[0.02] tracking-[0.3em] uppercase writing-vertical select-none pointer-events-none">
        V6 POWER UNIT ASSEMBLY // THERMAL CORE
      </div>
      <div className="absolute top-[78%] left-10 font-mono text-[9px] text-[#161616]/[0.02] tracking-[0.3em] uppercase writing-vertical select-none pointer-events-none">
        REAR DIFFUSER STRAKES // EXHAUST EXIT
      </div>
      </div>
    </div>
  );
}
