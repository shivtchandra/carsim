"use client";

import React from "react";

export type BackgroundMood = "hero" | "lab" | "ownership" | "simulator" | "comparison" | "cta";

interface BackgroundSystemProps {
  mood: BackgroundMood;
  className?: string;
  children?: React.ReactNode;
}

export default function BackgroundSystem({ mood, className = "", children }: BackgroundSystemProps) {
  return (
    <div className={`relative overflow-hidden w-full ${className}`} style={{ isolation: "isolate" }}>
      {mood === "hero"       && <RevealStage />}
      {mood === "lab"        && <EngineeringAnalysisRoom />}
      {mood === "ownership"  && <FinancialCommandCenter />}
      {mood === "simulator"  && <AutomotiveTestingLab />}
      {mood === "comparison" && <ComparisonTheater />}
      {mood === "cta"        && <ExecutiveAnteroom />}

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOM 01 — VEHICLE REVEAL STAGE
   ─────────────────────────────────────────────────────────────────
   You are standing in a private automotive concept reveal hall.
   The room is in total darkness except for what the lighting rig
   controls. One vehicle sits on a black podium. Three theatrical
   spotlights rig from the ceiling grid. A warm amber cone hits
   the rear quarter. A cold blue wash fills the left. Polished
   epoxy floor mirrors everything. Blueprint projections on the
   far wall are barely readable. Smoke machines low at the base.
══════════════════════════════════════════════════════════════════ */
function RevealStage() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* ── VOID BASE ─────────────────────────────────────────────
          The hall in absolute darkness before the rig fires. */}
      <div className="absolute inset-0" style={{ background: "#020204" }} />

      {/* ── CEILING RIG ───────────────────────────────────────────
          Overhead lighting grid — barely visible I-beams and track
          lighting rails, the infrastructure of the reveal. */}
      <div className="absolute top-0 inset-x-0" style={{ height: "20%", zIndex: 1 }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 180" preserveAspectRatio="none"
          style={{ opacity: 0.18 }}>
          {/* Main horizontal truss rail */}
          <rect x="0" y="14" width="1440" height="6" fill="rgba(255,255,255,0.08)" />
          <rect x="0" y="20" width="1440" height="1.5" fill="rgba(255,255,255,0.15)" />
          {/* Vertical drop rods for spot fixtures */}
          {[180, 360, 540, 720, 900, 1080, 1260].map(x => (
            <g key={x}>
              <rect x={x - 1} y="20" width="2" height="55" fill="rgba(255,255,255,0.07)" />
              {/* Spotlight head */}
              <ellipse cx={x} cy="78" rx="14" ry="8" fill="rgba(255,255,255,0.08)" />
              <ellipse cx={x} cy="76" rx="7" ry="4" fill="rgba(255,255,255,0.12)" />
            </g>
          ))}
          {/* Cross-bracing */}
          <line x1="0" y1="14" x2="1440" y2="14" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ── THEATRICAL SPOTLIGHT BEAMS ─────────────────────────────
          Three visible light columns descending from the rig.
          The warm centre beam hits where the car sits.
          Physics: light scatter makes the beam visible in haze. */}

      {/* Beam 1: primary warm amber — rear quarter of vehicle */}
      <div className="absolute" style={{
        top: 0, left: "55%", width: "38%", height: "100%",
        background: "conic-gradient(from 92deg at 55% -2%, transparent 55deg, rgba(255,150,40,0.03) 70deg, rgba(255,120,20,0.07) 82deg, rgba(255,140,30,0.09) 88deg, rgba(255,120,20,0.07) 94deg, rgba(255,150,40,0.03) 106deg, transparent 120deg)",
        transformOrigin: "55% 0%",
        zIndex: 1,
      }} />

      {/* Beam 2: secondary cool blue — fills left side of car */}
      <div className="absolute" style={{
        top: 0, left: "20%", width: "35%", height: "90%",
        background: "conic-gradient(from 90deg at 35% -5%, transparent 60deg, rgba(37,99,235,0.025) 74deg, rgba(60,120,255,0.05) 85deg, rgba(37,99,235,0.06) 90deg, rgba(60,120,255,0.05) 95deg, rgba(37,99,235,0.025) 106deg, transparent 118deg)",
        transformOrigin: "35% 0%",
        zIndex: 1,
      }} />

      {/* Beam 3: accent warm — tight hero pool on the front end */}
      <div className="absolute" style={{
        top: 0, left: "62%", width: "20%", height: "75%",
        background: "conic-gradient(from 91deg at 50% -3%, transparent 68deg, rgba(255,180,60,0.04) 80deg, rgba(255,160,40,0.08) 88deg, rgba(255,180,60,0.04) 96deg, transparent 108deg)",
        transformOrigin: "50% 0%",
        zIndex: 1,
      }} />

      {/* ── BACKLIGHT / HALO ──────────────────────────────────────
          The orange halo behind the vehicle — the signature reveal
          lighting that makes the car appear to glow from within.
          This is what makes a car launch feel cinematic. */}
      <div className="absolute" style={{
        top: "8%", left: "38%", width: "55%", height: "70%",
        background: "radial-gradient(ellipse 55% 65% at 65% 45%, rgba(255,90,10,0.22) 0%, rgba(255,60,0,0.10) 30%, rgba(200,40,0,0.04) 55%, transparent 70%)",
        filter: "blur(40px)",
        zIndex: 1,
      }} />
      {/* Inner hot-spot — the brightest point just behind the car body */}
      <div className="absolute" style={{
        top: "20%", left: "52%", width: "28%", height: "45%",
        background: "radial-gradient(ellipse at 50% 40%, rgba(255,120,30,0.18) 0%, rgba(255,80,10,0.08) 40%, transparent 70%)",
        filter: "blur(20px)",
        zIndex: 1,
      }} />

      {/* ── COOL SIDE FILL ────────────────────────────────────────
          Museum-style blue wash from camera-left. Prevents the
          shadowed side going dead black; adds depth to the form. */}
      <div className="absolute inset-y-0 left-0" style={{
        width: "45%",
        background: "linear-gradient(to right, rgba(20,60,180,0.07) 0%, rgba(37,99,235,0.04) 40%, transparent 100%)",
        filter: "blur(30px)",
        zIndex: 1,
      }} />

      {/* ── POLISHED FLOOR ────────────────────────────────────────
          Epoxy floor — vanishing point perspective grid that
          reflects the spotlights and the car above it. */}
      <div className="absolute bottom-0 inset-x-0" style={{ height: "42%", zIndex: 2 }}>
        {/* Floor surface — deep glossy black */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(2,2,4,1) 0%, rgba(4,4,8,0.9) 50%, transparent 100%)",
        }} />

        {/* Floor perspective grid — convergence to center vanishing point */}
        <svg width="100%" height="100%" viewBox="0 0 1440 400" preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, opacity: 0.14 }}>
          {/* Convergent lines from vanishing point (center top) */}
          {[-7,-5,-3,-1,0,1,3,5,7].map((i, idx) => (
            <line key={idx}
              x1={720 + i * 200} y1={0}
              x2={720 + i * 50} y2={400}
              stroke="rgba(255,255,255,0.6)" strokeWidth="0.5"
            />
          ))}
          {/* Horizontal cross lines at increasing intervals (perspective foreshortening) */}
          {[0.04, 0.12, 0.24, 0.40, 0.60, 0.80, 1.0].map((t, i) => (
            <line key={i} x1={0} y1={t * 400} x2={1440} y2={t * 400}
              stroke="rgba(255,255,255,0.4)" strokeWidth="0.4"
            />
          ))}
        </svg>

        {/* Floor spotlight reflections — mirror pools from the beams above */}
        <div className="absolute" style={{
          bottom: 0, left: "45%", width: "40%", height: "60%",
          background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,90,20,0.10) 0%, transparent 70%)",
          filter: "blur(20px)",
        }} />
        <div className="absolute" style={{
          bottom: 0, left: "25%", width: "30%", height: "40%",
          background: "radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.06) 0%, transparent 70%)",
          filter: "blur(15px)",
        }} />

        {/* Horizon line — where wall meets floor */}
        <div className="absolute top-0 inset-x-0 h-px" style={{
          background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 80%, transparent 100%)",
        }} />
      </div>

      {/* ── VOLUMETRIC FOG / HAZE ─────────────────────────────────
          Low-lying atmospheric haze at the base of the vehicle.
          Scatters light, adds depth, softens wheel contact. */}
      <div className="absolute" style={{
        bottom: "34%", left: "30%", width: "50%", height: "15%",
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.04) 0%, rgba(200,150,100,0.03) 40%, transparent 70%)",
        filter: "blur(25px)",
        zIndex: 3,
      }} />
      <div className="absolute" style={{
        bottom: "32%", left: "20%", width: "60%", height: "10%",
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,220,180,0.025) 0%, transparent 80%)",
        filter: "blur(30px)",
        zIndex: 3,
      }} />

      {/* ── FAR WALL: BLUEPRINT PROJECTIONS ──────────────────────
          Barely readable technical drawings projected on the wall
          behind the vehicle — adds depth and engineering context. */}
      <div className="absolute inset-0" style={{ zIndex: 0, opacity: 0.04 }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid meet">
          {/* Side profile outline */}
          <path d="M 700 480 Q 760 400 860 385 Q 960 375 1040 390 Q 1100 400 1130 440 L 1140 480 Z"
            fill="none" stroke="rgba(37,99,235,1)" strokeWidth="1.5" />
          <circle cx="780" cy="484" r="38" fill="none" stroke="rgba(37,99,235,1)" strokeWidth="1" />
          <circle cx="780" cy="484" r="16" fill="none" stroke="rgba(37,99,235,0.6)" strokeWidth="0.75" />
          <circle cx="1060" cy="484" r="38" fill="none" stroke="rgba(37,99,235,1)" strokeWidth="1" />
          <circle cx="1060" cy="484" r="16" fill="none" stroke="rgba(37,99,235,0.6)" strokeWidth="0.75" />
          {/* Dimension line */}
          <line x1="700" y1="520" x2="1140" y2="520" stroke="rgba(37,99,235,0.7)" strokeWidth="0.75" />
          <line x1="700" y1="514" x2="700" y2="526" stroke="rgba(37,99,235,0.7)" strokeWidth="0.75" />
          <line x1="1140" y1="514" x2="1140" y2="526" stroke="rgba(37,99,235,0.7)" strokeWidth="0.75" />
          <text x="920" y="538" fill="rgba(37,99,235,0.8)" fontSize="11" textAnchor="middle" fontFamily="monospace">4265 mm WB</text>
          {/* Overhead view */}
          <rect x="730" y="320" width="380" height="110" rx="50" fill="none" stroke="rgba(37,99,235,0.8)" strokeWidth="1.5" />
          <text x="920" y="308" fill="rgba(37,99,235,0.6)" fontSize="9" textAnchor="middle" fontFamily="monospace">PLAN VIEW — 1:25 SCALE</text>
          {/* Aerodynamic flow lines */}
          <path d="M 620 430 Q 800 380 1000 430 T 1200 400" fill="none" stroke="rgba(255,100,0,0.5)" strokeWidth="0.75" strokeDasharray="4 6" />
          <path d="M 620 445 Q 800 395 1000 445 T 1200 415" fill="none" stroke="rgba(255,100,0,0.4)" strokeWidth="0.75" strokeDasharray="4 6" />
          <path d="M 620 460 Q 800 410 1000 460 T 1200 430" fill="none" stroke="rgba(255,100,0,0.3)" strokeWidth="0.5" strokeDasharray="4 6" />
        </svg>
      </div>

      {/* ── WALL PANELS ───────────────────────────────────────────
          Dark architectural wall cladding panels receding into shadow. */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05, zIndex: 0 }}
        viewBox="0 0 1440 900" preserveAspectRatio="none">
        <line x1="0" y1="18%" x2="100%" y2="18%" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
        <line x1="0" y1="64%" x2="100%" y2="64%" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
        {[8, 22, 36, 50, 64, 78, 92].map(x => (
          <line key={x} x1={`${x}%`} y1="18%" x2={`${x}%`} y2="64%" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
        ))}
      </svg>

      {/* ── DEEP EDGE VIGNETTE ────────────────────────────────────
          Darkens the extreme edges — the room fades into void. */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 85% 80% at 55% 45%, transparent 30%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.95) 100%)",
        zIndex: 4,
      }} />

      <FilmGrain opacity={0.022} id="hero-grain" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOM 02 & 05 — ENGINEERING ANALYSIS ROOM
   ─────────────────────────────────────────────────────────────────
   You are in a glass-partitioned engineering analysis lab.
   Large format glass screens float from the ceiling on tension
   cables, showing live specification overlays. Engineers sit at
   dark workstations. Blueprint drawings pin every surface.
   Cold white fluorescent tubes behind glass ceiling panels cast
   an even, shadowless work light. The floor is polished concrete.
   Everything smells of thermal paste and fresh blueprints.
══════════════════════════════════════════════════════════════════ */
function EngineeringAnalysisRoom() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* ── BASE: industrial dark concrete ───────────────────────── */}
      <div className="absolute inset-0" style={{ background: "#050709" }} />

      {/* ── CONCRETE FLOOR TEXTURE ───────────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.025 }}>
        <filter id="concrete-eng">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#concrete-eng)" />
      </svg>

      {/* ── GLASS CEILING PANELS WITH FLUORESCENT TUBES BEHIND ──── */}
      <div className="absolute top-0 inset-x-0" style={{ height: "22%" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
        }} />
        <svg width="100%" height="100%" viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ opacity: 0.25 }}>
          {/* Glass ceiling grid lines */}
          {[0, 240, 480, 720, 960, 1200, 1440].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          ))}
          {[0, 66, 133, 200].map(y => (
            <line key={y} x1="0" y1={y} x2="1440" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          ))}
          {/* Fluorescent tubes — bright rectangles behind the glass */}
          {[120, 360, 600, 840, 1080, 1320].map(x => (
            <g key={x}>
              <rect x={x - 80} y="25" width="160" height="5" rx="2" fill="rgba(220,235,255,0.35)" />
              <rect x={x - 80} y="25" width="160" height="5" rx="2"
                fill="rgba(220,235,255,0.6)" style={{ filter: "blur(3px)" }} />
            </g>
          ))}
        </svg>
      </div>

      {/* ── FLUORESCENT LIGHT CONES ────────────────────────────────
          Even, shadowless cold white work-light washing down. */}
      {[16, 36, 56, 76].map((pct, i) => (
        <div key={i} className="absolute" style={{
          top: "3%", left: `${pct - 8}%`, width: "18%", height: "65%",
          background: `conic-gradient(from 94deg at 50% 0%, transparent 28deg, rgba(210,225,255,0.03) 40deg, rgba(220,235,255,0.05) 50deg, rgba(210,225,255,0.03) 60deg, transparent 72deg)`,
          transformOrigin: "50% 0%",
        }} />
      ))}

      {/* ── LARGE GLASS SPECIFICATION SCREENS ─────────────────────
          Floating screens suspended from ceiling showing live data. */}
      <svg className="absolute" style={{ top: "18%", left: "0", width: "100%", height: "55%", opacity: 0.07 }}
        viewBox="0 0 1440 500" preserveAspectRatio="none">
        {/* Suspension cables from ceiling */}
        {[200, 520, 840, 1160].map(x => (
          <g key={x}>
            <line x1={x + 60} y1="0" x2={x + 60} y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
            <line x1={x + 180} y1="0" x2={x + 180} y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
            {/* Screen frame */}
            <rect x={x} y="40" width="240" height="160" rx="3"
              fill="rgba(10,20,60,0.8)" stroke="rgba(100,140,255,0.4)" strokeWidth="0.75" />
            {/* Screen content: spec lines */}
            {[60, 76, 92, 108, 124, 140, 156].map(y => (
              <rect key={y} x={x + 16} y={y + 40} width={Math.random() * 100 + 80} height="4" rx="1"
                fill="rgba(37,99,235,0.5)" />
            ))}
            {/* Screen glow */}
            <rect x={x} y="40" width="240" height="160" rx="3"
              fill="rgba(37,99,235,0.04)" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
          </g>
        ))}
      </svg>

      {/* Glass screen ambient glow — blue wash from the data displays */}
      <div className="absolute" style={{
        top: "18%", inset: "18% 5% auto 5%", height: "45%",
        background: "radial-gradient(ellipse 90% 60% at 50% 20%, rgba(37,99,235,0.08) 0%, transparent 70%)",
        filter: "blur(30px)",
      }} />

      {/* ── GLASS PARTITION WALL: RIGHT SIDE ──────────────────────
          Vertical glass wall separating this bay from the next.
          Semi-transparent with mullion framing. */}
      <div className="absolute inset-y-0 right-0" style={{ width: "22%" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to left, rgba(20,40,100,0.06) 0%, transparent 100%)",
          borderLeft: "1px solid rgba(100,140,255,0.08)",
        }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 900" preserveAspectRatio="none" style={{ opacity: 0.12 }}>
          {/* Mullion vertical bars */}
          {[0, 50, 100, 150, 200].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="900" stroke="rgba(100,140,255,0.4)" strokeWidth="0.5" />
          ))}
          {[0, 150, 300, 450, 600, 750, 900].map(y => (
            <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="rgba(100,140,255,0.3)" strokeWidth="0.4" />
          ))}
          {/* Technical drawings on the glass */}
          <circle cx="100" cy="350" r="60" fill="none" stroke="rgba(37,99,235,0.5)" strokeWidth="1" />
          <circle cx="100" cy="350" r="25" fill="none" stroke="rgba(37,99,235,0.3)" strokeWidth="0.75" strokeDasharray="3 3" />
          <path d="M 20 600 L 60 560 L 140 560 L 180 600 L 180 650 L 20 650 Z"
            fill="none" stroke="rgba(37,99,235,0.4)" strokeWidth="1" />
        </svg>
      </div>

      {/* ── WORKSTATION DESK GLOW: BOTTOM ─────────────────────────
          Blue monitor glow rising from operator desks at the bottom. */}
      <div className="absolute bottom-0 inset-x-0" style={{ height: "28%" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(2,4,10,0.95) 0%, transparent 100%)",
        }} />
        <div className="absolute" style={{
          bottom: 0, left: "10%", width: "80%", height: "60%",
          background: "radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.10) 0%, transparent 70%)",
          filter: "blur(20px)",
        }} />
        {/* Desk edge line */}
        <div className="absolute" style={{
          bottom: "30%", left: "5%", right: "5%", height: "1px",
          background: "linear-gradient(to right, transparent, rgba(37,99,235,0.15) 30%, rgba(37,99,235,0.20) 50%, rgba(37,99,235,0.15) 70%, transparent)",
        }} />
      </div>

      {/* ── BLUEPRINT WALL: FAR BACKGROUND ───────────────────────── */}
      <div className="absolute inset-0" style={{ opacity: 0.05 }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <pattern id="bpFine" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(37,99,235,1)" strokeWidth="0.3" />
            </pattern>
            <pattern id="bpMajor" x="0" y="0" width="125" height="125" patternUnits="userSpaceOnUse">
              <path d="M 125 0 L 0 0 0 125" fill="none" stroke="rgba(37,99,235,1)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bpFine)" />
          <rect width="100%" height="100%" fill="url(#bpMajor)" />
          {/* Chassis drawing on wall */}
          <path d="M 100 600 Q 200 520 400 500 Q 600 485 800 495 Q 950 505 1050 540 L 1060 600 Z"
            fill="none" stroke="rgba(37,99,235,0.9)" strokeWidth="2" />
          <circle cx="240" cy="606" r="55" fill="none" stroke="rgba(37,99,235,0.7)" strokeWidth="1.5" />
          <circle cx="890" cy="606" r="55" fill="none" stroke="rgba(37,99,235,0.7)" strokeWidth="1.5" />
          {/* Dimension annotations */}
          <line x1="100" y1="650" x2="1060" y2="650" stroke="rgba(37,99,235,0.4)" strokeWidth="0.75" />
          <text x="580" y="668" fill="rgba(37,99,235,0.7)" fontSize="14" textAnchor="middle" fontFamily="monospace">2700 mm</text>
        </svg>
      </div>

      {/* Deep edge vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 90% 80% at 45% 45%, transparent 35%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.9) 100%)",
      }} />

      <FilmGrain opacity={0.03} id="lab-grain" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOM 03 — FINANCIAL COMMAND CENTER
   ─────────────────────────────────────────────────────────────────
   You are inside a deep-navy mission control room, the kind that
   manages billion-dollar fleet operations. Multiple rows of
   monitors show ownership cost data in real time. A massive floor-
   to-ceiling projection wall displays aggregated financial layers.
   Recessed downlights in the ceiling cast controlled pools of blue-
   white light on each operator station. The walls are acoustic-
   paneled. The feeling is intelligence, trust, and precision.
══════════════════════════════════════════════════════════════════ */
function FinancialCommandCenter() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* ── BASE: deep mission-control navy ───────────────────────── */}
      <div className="absolute inset-0" style={{ background: "#020810" }} />

      {/* ── PROJECTION WALL: THE DATA SURFACE ─────────────────────
          The massive display wall at the front of the command center.
          Shows stacked ownership cost layers as large projections. */}
      <div className="absolute top-0 inset-x-0" style={{ height: "65%" }}>
        {/* Main projection surface glow */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(10,30,100,0.20) 0%, rgba(5,15,60,0.12) 50%, transparent 100%)",
          filter: "blur(2px)",
        }} />

        {/* Monitor array: rows of screens */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 600"
          preserveAspectRatio="none" style={{ opacity: 0.12 }}>
          {/* Bottom row: operator monitors */}
          {[0,1,2,3,4,5].map(col => (
            <g key={col}>
              <rect x={col * 240 + 10} y="460" width="225" height="130" rx="3"
                fill="rgba(5,15,80,0.9)" stroke="rgba(37,99,235,0.4)" strokeWidth="0.75" />
              {/* Data lines on screen */}
              {[480, 500, 520, 540, 560].map(y => (
                <rect key={y} x={col * 240 + 24} y={y} width={Math.min(160, 60 + col * 20)} height="3" rx="1"
                  fill="rgba(37,99,235,0.6)" />
              ))}
              <rect x={col * 240 + 24} y="576" width="80" height="6" rx="2" fill="rgba(74,222,128,0.5)" />
            </g>
          ))}

          {/* Large projection: main ownership cost chart overlay */}
          <rect x="80" y="20" width="1280" height="400" rx="4"
            fill="rgba(2,8,30,0.6)" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
          {/* Projection grid */}
          {[100,200,300,400].map(y => (
            <line key={y} x1="80" y1={y} x2="1360" y2={y} stroke="rgba(37,99,235,0.15)" strokeWidth="0.4" />
          ))}
          {[240,480,720,960,1200].map(x => (
            <line key={x} x1={x} y1="20" x2={x} y2="420" stroke="rgba(37,99,235,0.12)" strokeWidth="0.4" />
          ))}
          {/* Data bars on large projection */}
          {[
            {x: 100, w: 900, col: "rgba(37,99,235,0.5)"},
            {x: 100, w: 650, col: "rgba(255,106,0,0.5)"},
            {x: 100, w: 500, col: "rgba(139,92,246,0.5)"},
            {x: 100, w: 350, col: "rgba(99,102,241,0.5)"},
            {x: 100, w: 800, col: "rgba(74,222,128,0.5)"},
          ].map((bar, i) => (
            <rect key={i} x={bar.x} y={70 + i * 66} width={bar.w} height="30" rx="2" fill={bar.col} />
          ))}
        </svg>

        {/* Projection ambient glow */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 30%, rgba(37,99,235,0.12) 0%, rgba(10,30,100,0.06) 50%, transparent 80%)",
          filter: "blur(40px)",
        }} />
      </div>

      {/* ── ACOUSTIC CEILING WITH RECESSED DOWNLIGHTS ─────────────
          Dark ceiling with controlled light pools over each station. */}
      <div className="absolute top-0 inset-x-0" style={{ height: "20%" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent 100%)",
        }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 180"
          preserveAspectRatio="none" style={{ opacity: 0.18 }}>
          <defs>
            <pattern id="acoustic-cmd" x="0" y="0" width="48" height="42" patternUnits="userSpaceOnUse">
              <polygon points="24,2 46,14 46,28 24,40 2,28 2,14"
                fill="none" stroke="rgba(37,99,235,0.3)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#acoustic-cmd)" />
          {/* Recessed downlights */}
          {[10, 22, 34, 46, 58, 70, 82, 94].map(pct => (
            <g key={pct}>
              <circle cx={`${pct}%`} cy="25" r="5" fill="rgba(200,220,255,0.5)" />
              <circle cx={`${pct}%`} cy="25" r="9" fill="rgba(200,220,255,0.12)" />
            </g>
          ))}
        </svg>
      </div>

      {/* Recessed downlight cones */}
      {[10, 22, 34, 46, 58, 70, 82, 94].map((pct, i) => (
        <div key={i} className="absolute" style={{
          top: "2%", left: `${pct - 6}%`, width: "14%", height: "55%",
          background: "conic-gradient(from 94deg at 50% 0%, transparent 35deg, rgba(37,99,235,0.04) 46deg, rgba(80,130,255,0.07) 50deg, rgba(37,99,235,0.04) 54deg, transparent 65deg)",
          transformOrigin: "50% 0%",
        }} />
      ))}

      {/* ── SIDE WALL DATA PANELS ─────────────────────────────────
          Vertical info panels on both side walls — nav bars,
          indicator lights, always-on status readouts. */}
      {["left-0", "right-0"].map((side, si) => (
        <div key={si} className="absolute inset-y-0" style={{
          [si === 0 ? "left" : "right"]: 0, width: "6%",
          background: `linear-gradient(to ${si === 0 ? "right" : "left"}, rgba(10,30,100,0.15) 0%, transparent 100%)`,
          borderRight: si === 0 ? "1px solid rgba(37,99,235,0.06)" : "none",
          borderLeft: si === 1 ? "1px solid rgba(37,99,235,0.06)" : "none",
        }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 900" preserveAspectRatio="none" style={{ opacity: 0.3 }}>
            {[100,200,300,400,500,600,700,800].map(y => (
              <g key={y}>
                <circle cx="40" cy={y} r="3" fill="rgba(37,99,235,0.6)" />
                <rect x="20" y={y - 8} width="40" height="3" rx="1" fill="rgba(37,99,235,0.2)" />
              </g>
            ))}
          </svg>
        </div>
      ))}

      {/* ── OPERATOR CONSOLE DESK ─────────────────────────────────
          The curved desk surface at the bottom of the room. */}
      <div className="absolute bottom-0 inset-x-0" style={{ height: "20%" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(0,0,5,1) 0%, rgba(0,2,12,0.85) 60%, transparent 100%)",
        }} />
        <div className="absolute" style={{
          top: "30%", left: "5%", right: "5%", height: "1px",
          background: "linear-gradient(to right, transparent, rgba(37,99,235,0.25) 20%, rgba(37,99,235,0.40) 50%, rgba(37,99,235,0.25) 80%, transparent)",
          boxShadow: "0 0 8px 2px rgba(37,99,235,0.15)",
        }} />
        <div className="absolute" style={{
          bottom: 0, left: "10%", width: "80%", height: "70%",
          background: "radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.12) 0%, transparent 70%)",
          filter: "blur(15px)",
        }} />
      </div>

      {/* ── VIGNETTE ──────────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 30%, rgba(0,0,5,0.75) 80%, rgba(0,0,5,0.95) 100%)",
      }} />

      <FilmGrain opacity={0.02} id="cmd-grain" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOM 04 — AUTOMOTIVE TESTING LAB
   ─────────────────────────────────────────────────────────────────
   You are inside an active aerodynamic testing facility.
   The wind tunnel mouth opens on the left — a massive circular
   aperture in raw concrete. Fine measurement grid lines are
   painted on every surface. Banks of phosphorescent green CRT
   performance monitors line the right wall. Air flow streamlines
   are visualised in real-time on overhead screens. Stacks of
   diagnostic equipment fill the background. Everything vibrates
   with the low hum of powerful fans.
══════════════════════════════════════════════════════════════════ */
function AutomotiveTestingLab() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* ── BASE: raw concrete dark ───────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: "#050709" }} />

      {/* Concrete texture */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.028 }}>
        <filter id="concrete-lab">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="5" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#concrete-lab)" />
      </svg>

      {/* ── WIND TUNNEL MOUTH ─────────────────────────────────────
          The massive circular intake structure on the left wall.
          Concentric rings of decreasing diameter — the bellmouth
          contraction that accelerates airflow into the test section. */}
      <div className="absolute inset-y-0 left-0" style={{ width: "48%", opacity: 0.18 }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 900" preserveAspectRatio="xMinYMid meet">
          {/* Outer structure rings */}
          {[420, 360, 300, 240, 185, 140, 105, 75, 52, 34].map((r, i) => (
            <circle key={i}
              cx="0" cy="450" r={r}
              fill="none"
              stroke={i < 3 ? "rgba(255,255,255,0.25)" : i < 6 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.12)"}
              strokeWidth={i < 3 ? "1.5" : "0.75"}
            />
          ))}
          {/* Radial spokes — structural supports */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
            <line key={i}
              x1={0} y1={450}
              x2={Math.cos((deg * Math.PI) / 180) * 420}
              y2={450 + Math.sin((deg * Math.PI) / 180) * 420}
              stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
            />
          ))}
          {/* Centre aperture label */}
          <text x="40" y="448" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="monospace">Ø 2.4m INTAKE</text>

          {/* Airflow direction arrows from mouth */}
          {[340, 380, 420, 460, 500, 540].map((y, i) => (
            <g key={i}>
              <line x1="60" y1={y} x2="650" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="8 6" />
              <polygon points={`650,${y} 640,${y - 4} 640,${y + 4}`} fill="rgba(255,255,255,0.06)" />
            </g>
          ))}
        </svg>

        {/* Wind tunnel glow — cool ambient from the aperture */}
        <div className="absolute inset-y-0 left-0" style={{
          width: "70%",
          background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(150,200,255,0.06) 0%, transparent 70%)",
          filter: "blur(30px)",
        }} />
      </div>

      {/* ── MEASUREMENT GRID ON WALLS ─────────────────────────────
          Fine calibration grid painted on the test section walls
          and floor — standard in any aerodynamics tunnel. */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.07 }}
        viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <pattern id="measFine" x="0" y="0" width="45" height="45" patternUnits="userSpaceOnUse">
            <path d="M 45 0 L 0 0 0 45" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
          </pattern>
          <pattern id="measCoarse" x="0" y="0" width="225" height="225" patternUnits="userSpaceOnUse">
            <path d="M 225 0 L 0 0 0 225" fill="none" stroke="rgba(255,255,255,1)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#measFine)" />
        <rect width="100%" height="100%" fill="url(#measCoarse)" />
        {/* Measurement callout labels on left ruler */}
        {[0, 225, 450, 675, 900].map((y, i) => (
          <g key={i}>
            <line x1="0" y1={y} x2="18" y2={y} stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
            <text x="22" y={y + 4} fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">{i * 500}</text>
          </g>
        ))}
      </svg>

      {/* ── PERFORMANCE MONITOR BANK: RIGHT WALL ──────────────────
          Green phosphor CRT monitors — old-school oscilloscope
          style displays showing live performance data. */}
      <div className="absolute inset-y-0 right-0" style={{ width: "25%", opacity: 0.85 }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 900" preserveAspectRatio="none" style={{ opacity: 0.22 }}>
          {/* Monitor racks */}
          {[0, 1, 2, 3].map(row => (
            <g key={row}>
              <rect x="20" y={row * 220 + 20} width="320" height="195" rx="4"
                fill="rgba(0,20,5,1)" stroke="rgba(0,180,70,0.5)" strokeWidth="0.75" />
              {/* CRT scanlines */}
              {Array.from({ length: 18 }, (_, i) => (
                <line key={i}
                  x1="28" y1={row * 220 + 35 + i * 10}
                  x2="332" y2={row * 220 + 35 + i * 10}
                  stroke="rgba(0,200,70,0.08)" strokeWidth="3"
                />
              ))}
              {/* Oscilloscope trace */}
              <polyline
                points={`28,${row * 220 + 115} 80,${row * 220 + 90} 130,${row * 220 + 135} 180,${row * 220 + 85} 230,${row * 220 + 120} 280,${row * 220 + 95} 332,${row * 220 + 115}`}
                fill="none" stroke="rgba(0,230,80,0.8)" strokeWidth="1.5"
              />
              {/* Monitor label */}
              <text x="175" y={row * 220 + 208} fill="rgba(0,200,70,0.5)" fontSize="8" textAnchor="middle" fontFamily="monospace">
                {["DRAG COEFF", "DOWNFORCE N", "BRAKE TEMP", "TYRE LOAD"][row]}
              </text>
            </g>
          ))}
        </svg>
        {/* Green phosphor ambient glow */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to left, rgba(0,180,60,0.08) 0%, transparent 100%)",
          filter: "blur(25px)",
        }} />
      </div>

      {/* ── AIRFLOW VISUALISATION LINES ───────────────────────────
          Horizontal streamlines from the tunnel mouth moving
          right — what engineers see when air flows through. */}
      <svg className="absolute" style={{ top: "30%", left: "30%", width: "50%", height: "40%", opacity: 0.08 }}
        viewBox="0 0 700 360" preserveAspectRatio="none">
        {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((y, i) => {
          const deflect = Math.sin(i * 0.6) * 20;
          return (
            <path key={i}
              d={`M 0 ${y} Q 200 ${y + deflect} 400 ${y - deflect * 0.5} T 700 ${y}`}
              fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" strokeDasharray="6 8"
            />
          );
        })}
      </svg>

      {/* ── OVERHEAD ANALYSIS SCREEN ─────────────────────────────── */}
      <div className="absolute top-0 inset-x-0" style={{ height: "18%" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, transparent 100%)",
        }} />
        <div className="absolute" style={{
          top: "15%", left: "35%", width: "30%", height: "60%",
          background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.10) 0%, transparent 80%)",
          filter: "blur(15px)",
        }} />
        {/* Screen glow strip */}
        <div className="absolute" style={{
          top: "20%", left: "30%", right: "30%", height: "3px",
          background: "rgba(37,99,235,0.25)",
          boxShadow: "0 0 12px 4px rgba(37,99,235,0.15)",
        }} />
      </div>

      {/* ── INDUSTRIAL FLOOR ──────────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0" style={{ height: "20%" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)",
        }} />
        {/* Yellow safety lines on floor */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-full" viewBox="0 0 1440 160" preserveAspectRatio="none" style={{ opacity: 0.12 }}>
          <line x1="0" y1="80" x2="1440" y2="80" stroke="#fbbf24" strokeWidth="2" strokeDasharray="40 20" />
          <line x1="0" y1="120" x2="1440" y2="120" stroke="#fbbf24" strokeWidth="1" strokeDasharray="20 40" />
        </svg>
      </div>

      {/* Deep vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 75% at 55% 50%, transparent 30%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0.92) 100%)",
      }} />

      <FilmGrain opacity={0.032} id="lab-wind-grain" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOM 05 — COMPARISON THEATER
   ─────────────────────────────────────────────────────────────────
   A darkened amphitheatre-style analysis room. A massive curved
   screen wall at the front shows side-by-side vehicle data. Rows
   of recessed blue-white downlights create cold pools on the
   floor. The space feels like a private screening room for
   engineering data — the kind where decisions get made.
══════════════════════════════════════════════════════════════════ */
function ComparisonTheater() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* ── BASE: dark theater ──────────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: "#040610" }} />

      {/* ── THE CURVED SCREEN WALL ─────────────────────────────────
          A massive concave display surface that wraps the viewer.
          Shows radar chart axes, vehicle silhouettes, data streams. */}
      <div className="absolute top-0 inset-x-0" style={{ height: "60%" }}>
        {/* Screen surface glow */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(37,99,235,0.14) 0%, rgba(20,50,140,0.06) 50%, transparent 85%)",
          filter: "blur(20px)",
        }} />

        {/* Curved screen frame + data overlay */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 540"
          preserveAspectRatio="none" style={{ opacity: 0.20 }}>
          {/* Screen curve — the concave shape */}
          <path d="M 0 20 Q 720 80 1440 20" fill="none" stroke="rgba(37,99,235,0.6)" strokeWidth="1.5" />
          <path d="M 0 530 Q 720 480 1440 530" fill="none" stroke="rgba(37,99,235,0.3)" strokeWidth="1" />

          {/* Radar chart overlay — the analysis visual */}
          <g transform="translate(720,270)">
            {/* Hexagonal radar rings */}
            {[180, 140, 100, 60].map((r, i) => (
              <polygon key={i}
                points={[0,1,2,3,4,5].map(j => {
                  const a = (j * 60 - 90) * Math.PI / 180;
                  return `${Math.cos(a) * r},${Math.sin(a) * r}`;
                }).join(" ")}
                fill="none" stroke="rgba(37,99,235,0.5)" strokeWidth={i === 0 ? "1" : "0.5"}
                strokeDasharray={i > 1 ? "3 3" : "none"}
              />
            ))}
            {/* Axis lines */}
            {[0,1,2,3,4,5].map(j => {
              const a = (j * 60 - 90) * Math.PI / 180;
              return <line key={j} x1={0} y1={0} x2={Math.cos(a) * 180} y2={Math.sin(a) * 180}
                stroke="rgba(37,99,235,0.25)" strokeWidth="0.5" />;
            })}
            {/* Data polygon — vehicle A */}
            <polygon
              points={[0,1,2,3,4,5].map(j => {
                const a = (j * 60 - 90) * Math.PI / 180;
                const r = [140, 120, 160, 100, 130, 110][j];
                return `${Math.cos(a) * r},${Math.sin(a) * r}`;
              }).join(" ")}
              fill="rgba(37,99,235,0.08)" stroke="rgba(37,99,235,0.7)" strokeWidth="1.5"
            />
            {/* Data polygon — vehicle B */}
            <polygon
              points={[0,1,2,3,4,5].map(j => {
                const a = (j * 60 - 90) * Math.PI / 180;
                const r = [110, 150, 90, 140, 100, 160][j];
                return `${Math.cos(a) * r},${Math.sin(a) * r}`;
              }).join(" ")}
              fill="rgba(255,106,0,0.06)" stroke="rgba(255,106,0,0.6)" strokeWidth="1.5"
            />
            {/* Axis labels */}
            {["SAFETY", "PERFORMANCE", "VALUE", "COMFORT", "EFFICIENCY", "TECHNOLOGY"].map((label, j) => {
              const a = (j * 60 - 90) * Math.PI / 180;
              return <text key={label} x={Math.cos(a) * 210} y={Math.sin(a) * 210}
                fill="rgba(37,99,235,0.6)" fontSize="10" textAnchor="middle" fontFamily="monospace">{label}</text>;
            })}
          </g>

          {/* Side data columns */}
          {[80, 1240].map((x, si) => (
            <g key={si}>
              {[80, 120, 160, 200, 240, 280, 320, 360, 400].map((y, i) => (
                <g key={i}>
                  <rect x={x} y={y} width={Math.random() * 80 + 40} height="5" rx="1"
                    fill={si === 0 ? "rgba(37,99,235,0.5)" : "rgba(255,106,0,0.5)"} />
                </g>
              ))}
              <text x={x} y={60} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
                {si === 0 ? "VEHICLE A" : "VEHICLE B"}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* ── ACOUSTIC CEILING WITH DOWNLIGHTS ───────────────────── */}
      <div className="absolute top-0 inset-x-0" style={{ height: "15%" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent 100%)",
        }} />
      </div>

      {/* Theater downlight cones */}
      {[15, 30, 45, 55, 70, 85].map((pct, i) => (
        <div key={i}>
          <div className="absolute" style={{
            top: "1%", left: `${pct}%`, transform: "translateX(-50%)",
            width: "6px", height: "6px", borderRadius: "50%",
            background: "rgba(180,210,255,0.7)",
            boxShadow: "0 0 10px 3px rgba(180,210,255,0.25)",
          }} />
          <div className="absolute" style={{
            top: "1%", left: `${pct - 8}%`, width: "18%", height: "50%",
            background: "conic-gradient(from 94deg at 50% 0%, transparent 36deg, rgba(37,99,235,0.035) 46deg, rgba(100,150,255,0.06) 50deg, rgba(37,99,235,0.035) 54deg, transparent 64deg)",
            transformOrigin: "50% 0%",
          }} />
        </div>
      ))}

      {/* ── TIERED FLOOR — amphitheatre steps ──────────────────── */}
      <div className="absolute bottom-0 inset-x-0" style={{ height: "25%" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(0,0,5,1) 0%, rgba(2,4,12,0.8) 60%, transparent 100%)",
        }} />
        <svg className="absolute bottom-0 left-0 right-0 w-full h-full" viewBox="0 0 1440 220"
          preserveAspectRatio="none" style={{ opacity: 0.15 }}>
          {/* Theater step tiers */}
          {[180, 140, 100, 60].map((y, i) => (
            <g key={i}>
              <line x1="0" y1={y} x2="1440" y2={y} stroke="rgba(37,99,235,0.5)" strokeWidth="0.75" />
              <rect x="0" y={y} width="1440" height="2" fill="rgba(37,99,235,0.05)" />
            </g>
          ))}
          {/* Aisle markers */}
          <line x1="720" y1="60" x2="720" y2="220" stroke="rgba(37,99,235,0.15)" strokeWidth="0.5" />
        </svg>
        {/* Console desk glow */}
        <div className="absolute" style={{
          bottom: 0, left: "15%", width: "70%", height: "50%",
          background: "radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.14) 0%, transparent 65%)",
          filter: "blur(18px)",
        }} />
      </div>

      {/* ── SIDE WALLS ─────────────────────────────────────────── */}
      <div className="absolute inset-y-0 left-0 w-[6%]" style={{
        background: "linear-gradient(to right, rgba(0,0,8,0.8) 0%, transparent 100%)",
      }} />
      <div className="absolute inset-y-0 right-0 w-[6%]" style={{
        background: "linear-gradient(to left, rgba(0,0,8,0.8) 0%, transparent 100%)",
      }} />

      {/* ── VIGNETTE ──────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 85% 75% at 50% 35%, transparent 25%, rgba(0,0,5,0.7) 75%, rgba(0,0,5,0.95) 100%)",
      }} />

      <FilmGrain opacity={0.025} id="comp-grain" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOM 06 — EXECUTIVE ANTEROOM
   The final room. White Carrara marble. Single gold pendant.
   The door to the right car.
══════════════════════════════════════════════════════════════════ */
function ExecutiveAnteroom() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: "#040408" }} />

      {/* Marble texture */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }}>
        <filter id="marble-exec">
          <feTurbulence type="turbulence" baseFrequency="0.012 0.006" numOctaves="5" seed="12" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#marble-exec)" />
      </svg>

      {/* Marble slab panel seams */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }} viewBox="0 0 1440 900" preserveAspectRatio="none">
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
        {[0, 20, 40, 60, 80, 100].map(pct => (
          <line key={pct} x1={`${pct}%`} y1="0" x2={`${pct}%`} y2="100%" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
        ))}
        {/* Veining */}
        <path d="M 300 0 Q 400 200 250 450 Q 100 700 350 900" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
        <path d="M 900 50 Q 800 250 1000 500 Q 1150 750 900 900" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </svg>

      {/* Single pendant lamp — warm gold cone */}
      <div className="absolute" style={{
        top: 0, left: "50%", transform: "translateX(-50%)",
        width: "38%", height: "100%",
        background: "conic-gradient(from 92deg at 50% -1%, transparent 64deg, rgba(255,200,80,0.04) 77deg, rgba(255,180,60,0.08) 90deg, rgba(255,200,80,0.04) 103deg, transparent 116deg)",
        transformOrigin: "50% 0%",
      }} />

      {/* Floor warm pool */}
      <div className="absolute" style={{
        bottom: "10%", left: "30%", width: "40%", height: "22%",
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,180,60,0.05) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />

      {/* Baseboard accent light — the exit */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{
        background: "linear-gradient(to right, transparent 0%, rgba(37,99,235,0.4) 30%, rgba(37,99,235,0.5) 50%, rgba(37,99,235,0.4) 70%, transparent 100%)",
        boxShadow: "0 0 12px 4px rgba(37,99,235,0.12)",
      }} />

      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 65% at 50% 45%, transparent 20%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.95) 100%)",
      }} />

      <FilmGrain opacity={0.018} id="exec-grain" />
    </div>
  );
}

/* ── Shared film grain — unique SVG filter ID per room ─────────── */
function FilmGrain({ opacity = 0.025, id }: { opacity?: number; id: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" style={{ opacity, mixBlendMode: "overlay", zIndex: 5 }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  );
}

