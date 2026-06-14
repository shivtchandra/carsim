"use client";

import React, { useState, useEffect, useRef } from "react";
import { IndianRupee, Fuel, Wrench, Shield, TrendingUp } from "lucide-react";

const WATERMARKS = [
  "PURCHASE BRIEFING",
  "RUNNING COST ANALYSIS",
  "SERVICE LIFECYCLE",
  "RISK INTELLIGENCE",
  "VALUE RETENTION INDEX",
];

export default function LifecycleJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSpring, setActiveSpring] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);

  // Detect screen size for responsive layouts
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop scroll target tracking
  useEffect(() => {
    if (isMobile) return;

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Focus on middle section of screen
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!isNaN(index)) {
            setActiveIndex(index);
          }
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  // Mobile horizontal scroll tracking
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const index = Math.round(scrollLeft / width);
    if (index >= 0 && index < 5 && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Card details
  const cards = [
    {
      number: "01",
      title: "Purchase Cost",
      subtitle: "Ex-showroom + on-road taxes",
      body: "The sticker price is just the start. RTO registration, comprehensive insurance, TCS, and dealer handling charges add 15–20% on top. We show both so you're never surprised at the dealership.",
      accent: "#C84C31",
      icon: <IndianRupee className="w-5 h-5" />,
      layoutClass: "max-w-5xl min-h-[60vh]",
      alignment: "left",
      watermark: (
        <svg className="absolute right-8 bottom-8 text-[#161616] opacity-[0.03] w-64 h-64 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      detail: (active: boolean) => (
        <div className="border border-[#161616]/10 bg-[#F5F1E8] p-6 rounded-2xl space-y-4 font-mono relative overflow-hidden transition-all duration-500 shadow-sm text-[#161616]">
          <div className="absolute -right-4 -top-2 rotate-12 bg-[#C84C31]/10 border border-[#C84C31]/20 text-[#C84C31] text-[9px] px-2.5 py-0.5 rounded font-bold select-none uppercase tracking-widest">
            RTO APPROVED
          </div>
          <h4 className="text-[10px] tracking-wider text-[#C84C31] uppercase font-bold">Purchase Bill of Quantities</h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-[#161616]/5 pb-1">
              <span className="text-[#161616]/60">Ex-Showroom Price</span>
              <span className="font-mono text-[#161616] font-bold">100.0%</span>
            </div>
            <div className="flex justify-between border-b border-[#161616]/5 pb-1">
              <span className="text-[#161616]/60">State RTO Road Tax</span>
              <span className="font-mono text-[#C84C31] font-bold transition-all duration-1000" style={{ transform: active ? "scale(1.05)" : "scale(1)" }}>
                + 12.5% avg
              </span>
            </div>
            <div className="flex justify-between border-b border-[#161616]/5 pb-1">
              <span className="text-[#161616]/60">Comprehensive Insurance</span>
              <span className="font-mono text-[#161616] font-bold">+ 3.2% avg</span>
            </div>
            <div className="flex justify-between border-b border-[#161616]/5 pb-1">
              <span className="text-[#161616]/60">TCS Surcharge (&gt;10L)</span>
              <span className="font-mono text-[#161616]">+ 1.0%</span>
            </div>
            <div className="flex justify-between font-bold pt-1 text-[#161616] text-sm">
              <span>Total Acquisition Load</span>
              <span className="font-mono text-[#C84C31]">~ 116.7%</span>
            </div>
          </div>
          <div className="text-[9px] text-[#161616]/40 pt-2 border-t border-[#161616]/5 font-mono flex justify-between">
            <span>INVOICE ID: DS-ACQ-9812</span>
            <span className="text-[#161616]/40">STATE: TS // LOCAL</span>
          </div>
        </div>
      ),
    },
    {
      number: "02",
      title: "Fuel Cost",
      subtitle: "Real running spend correction",
      body: "ARAI figures are tested in sterile lab environments. DriveScope applies city-traffic correction (×0.72) and uses your city's actual fuel price. Diesel vs petrol vs EV break-even calculated to the kilometre.",
      accent: "#C84C31",
      icon: <Fuel className="w-5 h-5" />,
      layoutClass: "max-w-6xl min-h-[64vh]",
      alignment: "right",
      watermark: (
        <svg className="absolute left-8 bottom-8 text-[#161616] opacity-[0.03] w-64 h-64 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 22V2h10v20H3z"/>
          <path d="M18 5h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"/>
          <line x1="13" y1="9" x2="18" y2="9"/>
          <circle cx="8" cy="8" r="2"/>
        </svg>
      ),
      detail: (active: boolean) => (
        <div className="border border-[#161616]/10 bg-[#F5F1E8] p-6 rounded-2xl space-y-4 font-mono relative overflow-hidden transition-all duration-500 shadow-sm text-[#161616]">
          <h4 className="text-[10px] tracking-wider text-[#C84C31] uppercase font-bold">Real-World Route Corrections</h4>
          <div className="h-28 w-full border border-[#161616]/10 bg-[#F5F1E8] rounded-xl relative overflow-hidden p-2">
            <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
              <path
                d="M 10,70 Q 50,20 100,50 T 190,10"
                fill="none"
                stroke="rgba(22,22,22,0.04)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 10,70 Q 50,20 100,50 T 190,10"
                fill="none"
                stroke="#C84C31"
                strokeWidth="1.5"
                strokeDasharray="260"
                strokeDashoffset={active ? 0 : 260}
                className={active ? "animate-svg-draw" : ""}
                strokeLinecap="round"
              />
              {active && (
                <>
                  <circle cx="10" cy="70" r="3.5" fill="#C84C31" className="animate-ping" style={{ animationDuration: "3s" }} />
                  <circle cx="10" cy="70" r="2.5" fill="#C84C31" />
                  
                  <circle cx="100" cy="50" r="3.5" fill="#C84C31" className="animate-ping" style={{ animationDuration: "2.5s" }} />
                  <circle cx="100" cy="50" r="2.5" fill="#C84C31" />

                  <circle cx="190" cy="10" r="4" fill="#C84C31" className="animate-pulse" />
                  <circle cx="190" cy="10" r="2.5" fill="#F5F1E8" stroke="#C84C31" strokeWidth="1" />
                </>
              )}
              <text x="35" y="24" fill="#C84C31" fontSize="5" fontWeight="bold" className="opacity-75 tracking-wider">
                CITY: -28% TRAFFIC PENALTY
              </text>
              <text x="115" y="18" fill="#161616" fontSize="5" fontWeight="bold" className="opacity-75 tracking-wider">
                HWY CRUISE: +8% ECONOMY
              </text>
            </svg>
          </div>
          <div className="flex justify-between text-xs pt-1">
            <span className="text-[#161616]/60">ARAI Claimed FE</span>
            <span className="font-mono text-[#161616] font-bold">20.1 km/l</span>
          </div>
          <div className="flex justify-between text-xs border-t border-[#161616]/5 pt-2">
            <span className="text-[#C84C31] font-semibold">DriveScope Model FE</span>
            <span className="font-mono text-[#C84C31] font-bold text-sm">14.5 km/l</span>
          </div>
        </div>
      ),
    },
    {
      number: "03",
      title: "Maintenance",
      subtitle: "Brand-specific cost scaling",
      body: "Service costs vary wildly by brand heritage. Japanese/Korean cars average ₹8K/service; European brands can hit ₹25K. We model annual costs based on historical parts pricing and labor indexes.",
      accent: "#C84C31",
      icon: <Wrench className="w-5 h-5" />,
      layoutClass: "max-w-5xl min-h-[62vh]",
      alignment: "left",
      watermark: (
        <svg className="absolute right-8 bottom-8 text-[#161616] opacity-[0.03] w-64 h-64 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
      detail: (active: boolean) => (
        <div 
          className="border border-[#161616]/10 bg-[#F5F1E8] p-6 rounded-2xl space-y-4 font-mono relative overflow-hidden transition-all duration-500 shadow-sm text-[#161616]"
          onMouseEnter={() => setActiveSpring(true)}
          onMouseLeave={() => setActiveSpring(false)}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] tracking-wider text-[#C84C31] uppercase font-bold">Exploded Mechanical Damper</h4>
            <span className="text-[8px] text-[#C84C31]/60 font-mono tracking-widest">HOVER COMPONENT TO COMPRESS</span>
          </div>
          <div className="h-28 w-full border border-[#161616]/10 bg-[#F5F1E8] rounded-xl relative overflow-hidden p-1 flex items-center justify-center">
            <svg className="h-full w-44 transition-all duration-500" viewBox="0 0 160 100">
              <g stroke="#161616" strokeWidth="0.75" fill="none">
                {/* Upper Mount */}
                <rect x="65" y="8" width="30" height="4" rx="1" fill="rgba(22,22,22,0.02)" stroke="rgba(22,22,22,0.15)" />
                {/* Compressing coil spring */}
                <path
                  d="M 80,12 C 92,15 92,23 80,25 C 68,27 68,35 80,37 C 92,39 92,47 80,49 C 68,51 68,59 80,61 C 92,63 92,71 80,73"
                  strokeWidth="1.75"
                  stroke="#C84C31"
                  className="transition-all duration-500"
                  style={{
                    transform: (activeSpring || active) ? "scaleY(0.88)" : "scaleY(1)",
                    transformOrigin: "80px 12px",
                  }}
                  onMouseEnter={() => setHoveredPart("coil")}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                {/* Damper cylinder rod */}
                <line x1="80" y1="20" x2="80" y2="85" strokeWidth="1.5" className="opacity-90" />
                {/* Lower Damper Body */}
                <rect 
                  x="74" y="65" width="12" height="22" rx="1.5" 
                  fill="rgba(199, 75, 50, 0.08)"
                  stroke="#C84C31"
                  strokeWidth="1"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredPart("damper")}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                {/* Explosive callouts */}
                <g className="opacity-70">
                  <line x1="94" y1="25" x2="120" y2="25" strokeDasharray="2 2" strokeWidth="0.5" stroke="rgba(22,22,22,0.2)" />
                  <text 
                    x="122" y="27" 
                    fill={hoveredPart === "coil" ? "#C84C31" : "rgba(22,22,22,0.4)"} 
                    fontSize="5" 
                    fontFamily="monospace"
                    className="transition-colors duration-200"
                  >
                    COIL SPRING (K-VAL)
                  </text>
                  
                  <line x1="68" y1="76" x2="42" y2="76" strokeDasharray="2 2" strokeWidth="0.5" stroke="rgba(22,22,22,0.2)" />
                  <text 
                    x="10" y="78" 
                    fill={hoveredPart === "damper" ? "#C84C31" : "rgba(22,22,22,0.4)"} 
                    fontSize="5" 
                    fontFamily="monospace"
                    className="transition-colors duration-200"
                  >
                    DAMPER HYDRAULICS
                  </text>
                </g>
              </g>
            </svg>
          </div>
          <div className="flex justify-between text-xs pt-1">
            <span className="text-[#161616]/60">Yearly Parts Wear Index</span>
            <span className="font-mono text-[#161616] font-bold">Base x 1.45</span>
          </div>
        </div>
      ),
    },
    {
      number: "04",
      title: "Insurance",
      subtitle: "IDV decay and risk curves",
      body: "First-year comprehensive runs 2.5–3.5% of IDV. Your premium drops as the car depreciates — but your out-of-pocket risk rises. We track both curves side by side over 5 years.",
      accent: "#C84C31",
      icon: <Shield className="w-5 h-5" />,
      layoutClass: "max-w-6xl min-h-[66vh]",
      alignment: "right",
      watermark: (
        <svg className="absolute left-8 bottom-8 text-[#161616] opacity-[0.03] w-64 h-64 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      detail: (active: boolean) => (
        <div className="border border-[#161616]/10 bg-[#F5F1E8] p-6 rounded-2xl space-y-4 font-mono relative overflow-hidden transition-all duration-500 shadow-sm text-[#161616]">
          <h4 className="text-[10px] tracking-wider text-[#C84C31] uppercase font-bold">Insurance Risk Vector</h4>
          <div className="h-28 w-full border border-[#161616]/10 bg-[#F5F1E8] rounded-xl relative overflow-hidden flex items-center justify-center p-2">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              {/* Radar rings */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(22, 22, 22, 0.05)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(22, 22, 22, 0.05)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(22, 22, 22, 0.05)" strokeWidth="0.5" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(22, 22, 22, 0.03)" strokeWidth="0.5" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(22, 22, 22, 0.03)" strokeWidth="0.5" />
              
              {/* Rotating radar sweep line */}
              <line 
                x1="50" y1="50" x2="50" y2="5" 
                stroke="rgba(199, 75, 50, 0.4)" 
                strokeWidth="1" 
                className={active ? "animate-radar-spin" : ""}
              />
              
              {/* Risk polygon overlay */}
              <polygon 
                points="50,22 75,50 50,70 30,50" 
                fill="rgba(199, 75, 50, 0.06)" 
                stroke="#C84C31" 
                strokeWidth="1.25"
                className="transition-all duration-1000"
                style={{
                  transform: active ? "scale(1.05)" : "scale(0.95)",
                  transformOrigin: "50px 50px",
                }}
              />
              <text x="50" y="12" fill="#C84C31" fontSize="4.5" textAnchor="middle" fontWeight="bold" className="opacity-90">OWN DAMAGE</text>
            </svg>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#161616]/60">IDV Depreciation Rate</span>
            <span className="font-mono text-[#C84C31] font-bold">-10% p.a.</span>
          </div>
        </div>
      ),
    },
    {
      number: "05",
      title: "Resale Value",
      subtitle: "Asset depreciation profile",
      body: "After 5 years, brand trust and segment demand drive residuals more than specifications. Maruti holds 60%+. Korean brands 50–55%. We factor this into the true cost of ownership.",
      accent: "#C84C31",
      icon: <TrendingUp className="w-5 h-5" />,
      layoutClass: "max-w-5xl min-h-[60vh]",
      alignment: "left",
      watermark: (
        <svg className="absolute right-8 bottom-8 text-[#161616] opacity-[0.03] w-64 h-64 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
      detail: (active: boolean) => (
        <div className="border border-[#161616]/10 bg-[#F5F1E8] p-6 rounded-2xl space-y-4 font-mono relative overflow-hidden transition-all duration-500 shadow-sm text-[#161616]">
          <h4 className="text-[10px] tracking-wider text-[#C84C31] uppercase font-bold">Residual Retention Curves</h4>
          <div className="h-28 w-full border border-[#161616]/10 bg-[#F5F1E8] rounded-xl relative overflow-hidden p-2 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 160 80">
              <line x1="10" y1="10" x2="150" y2="10" stroke="rgba(22,22,22,0.03)" strokeWidth="0.5" />
              <line x1="10" y1="40" x2="150" y2="40" stroke="rgba(22,22,22,0.03)" strokeWidth="0.5" />
              <line x1="10" y1="70" x2="150" y2="70" stroke="rgba(22,22,22,0.05)" strokeWidth="0.5" />
              
              {/* Maruti curve */}
              <path 
                d="M 10,10 C 50,15 100,20 150,28" 
                fill="none" 
                stroke="#C84C31" 
                strokeWidth="1.75" 
                strokeDasharray="200"
                strokeDashoffset={active ? 0 : 200}
                className={active ? "animate-svg-draw" : ""}
              />
              <text x="90" y="24" fill="#C84C31" fontSize="5.5" fontWeight="bold">TOYOTA/MARUTI: 62%</text>
              
              {/* European luxury curve */}
              <path 
                d="M 10,10 C 40,30 90,50 150,58" 
                fill="none" 
                stroke="#161616" 
                strokeWidth="1" 
                strokeDasharray="200"
                strokeDashoffset={active ? 0 : 200}
                className={active ? "animate-svg-draw" : ""}
                strokeLinecap="round"
              />
              <text x="90" y="52" fill="#161616" fontSize="5.5" fontWeight="bold" className="opacity-60">GERMAN LUXURY: 44%</text>
              
              <text x="10" y="77" fill="rgba(22,22,22,0.3)" fontSize="4.5" fontFamily="monospace">YR 0</text>
              <text x="142" y="77" fill="rgba(22,22,22,0.3)" fontSize="4.5" fontFamily="monospace">YR 5</text>
            </svg>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#161616]/60">5-Yr Avg Segment Yield</span>
            <span className="font-mono text-[#161616] font-bold">54.2%</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full bg-transparent text-[#161616] py-28">
      {/* Interactive Scrolling Sections */}
      {!isMobile ? (
        // DESKTOP: Normal vertical sequence of cards (no sticky stack)
        <div className="mx-auto max-w-7xl px-6 w-full flex flex-col items-center">
          
          {/* Section Introduction block */}
          <div className="flex flex-col justify-center items-center text-center px-6 max-w-3xl space-y-6 mb-20">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#C84C31] uppercase font-bold block">
              Chapter 02 // SECTION B-01 // COCKPIT & CHASSIS CELL // STRUCTURAL INTEGRITY
            </span>
            <h2 className="font-display text-6xl text-[#161616] leading-tight">
              Every car has<br />
              <em className="text-[#C84C31] not-italic">two prices.</em>
            </h2>
            <p className="text-base text-[#161616]/75 leading-relaxed max-w-lg">
              The upfront showroom sticker is only Phase One. Read through each work order below to understand the true 5-year cost of ownership.
            </p>
          </div>

          {/* Cards normal vertical flow */}
          <div className="w-full space-y-12 max-w-5xl">
            {cards.map((card, i) => (
              <div
                key={card.number}
                ref={(el) => { cardRefs.current[i] = el; }}
                data-index={i}
                className="w-full"
              >
                <div
                  className={`w-full ${card.layoutClass} rounded-[32px] border border-[#161616]/10 p-8 sm:p-12 relative bg-[#ECE7DF]`}
                  style={{
                    boxShadow: "0 4px 20px rgba(22, 22, 22, 0.02)",
                  }}
                >
                  {/* Subtle Japanese Layout Grid watermark inside card */}
                  <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="url(#editorial-grid)" />
                    </svg>
                  </div>

                  {/* SVG watermark inside card */}
                  {card.watermark}

                  {/* Asymmetric layout alternates column ordering */}
                  <div className="grid lg:grid-cols-5 gap-10 items-center h-full relative z-10">
                    {card.alignment === "left" ? (
                      <>
                        {/* Column 1: Content details */}
                        <div className="lg:col-span-3 space-y-6">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold bg-[#C84C31]/5 border border-[#C84C31]/10 text-[#C84C31]"
                            >
                              {card.icon}
                            </div>
                            <div>
                              <p className="font-mono text-[9px] tracking-widest uppercase font-bold text-[#C84C31]">
                                Chapter 02 — {card.number}
                              </p>
                              <h3 className="text-3xl font-semibold leading-tight text-[#161616] font-display">{card.title}</h3>
                            </div>
                          </div>
                          <p className="font-mono text-[10px] text-[#161616]/60 leading-relaxed uppercase tracking-widest border-b border-[#161616]/5 pb-2">
                            {card.subtitle}
                          </p>
                          <p className="text-sm text-[#161616]/80 leading-relaxed font-sans max-w-md">{card.body}</p>
                        </div>
                        {/* Column 2: Interactive detail display */}
                        <div className="lg:col-span-2 w-full flex justify-center">
                          <div className="w-full max-w-md">
                            {card.detail(true)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Alternating Column 1: Interactive detail display */}
                        <div className="lg:col-span-2 w-full flex justify-center order-2 lg:order-1">
                          <div className="w-full max-w-md">
                            {card.detail(true)}
                          </div>
                        </div>
                        {/* Alternating Column 2: Content details */}
                        <div className="lg:col-span-3 space-y-6 order-1 lg:order-2 lg:pl-6">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold bg-[#C84C31]/5 border border-[#C84C31]/10 text-[#C84C31]"
                            >
                              {card.icon}
                            </div>
                            <div>
                              <p className="font-mono text-[9px] tracking-widest uppercase font-bold text-[#C84C31]">
                                Chapter 02 — {card.number}
                              </p>
                              <h3 className="text-3xl font-semibold leading-tight text-[#161616] font-display">{card.title}</h3>
                            </div>
                          </div>
                          <p className="font-mono text-[10px] text-[#161616]/60 leading-relaxed uppercase tracking-widest border-b border-[#161616]/5 pb-2">
                            {card.subtitle}
                          </p>
                          <p className="text-sm text-[#161616]/80 leading-relaxed font-sans max-w-md">{card.body}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // MOBILE / TABLET: Swipeable Carousel layout
        <div className="relative w-full z-10 py-16 px-6 space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center max-w-md mx-auto">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#C84C31] uppercase font-bold block">
              Chapter 02 // SECTION B-01 // COCKPIT & CHASSIS CELL // STRUCTURAL INTEGRITY
            </span>
            <h2 className="font-display text-4xl text-[#161616] leading-tight">
              Every car has<br />two prices.
            </h2>
            <p className="text-xs text-[#161616]/70 leading-relaxed">
              Swipe left or right to inspect the five phases of real lifecycle ownership.
            </p>
          </div>

          {/* Swipeable container */}
          <div 
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 scrollbar-none scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {cards.map((card, i) => (
              <div 
                key={card.number}
                className="snap-center shrink-0 w-[86vw] max-w-sm rounded-3xl border border-[#161616]/10 p-6 flex flex-col justify-between bg-[#ECE7DF] relative overflow-hidden"
                style={{
                  boxShadow: "0 10px 25px rgba(22, 22, 22, 0.03)",
                }}
              >
                {/* SVG watermark inside card */}
                {card.watermark}

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-md font-bold bg-[#C84C31]/5 border border-[#C84C31]/10 text-[#C84C31]"
                    >
                      {card.icon}
                    </div>
                    <div>
                      <p className="font-mono text-[8px] tracking-widest uppercase font-bold text-[#C84C31]">
                        Chapter 02 — {card.number}
                      </p>
                      <h4 className="text-xl font-bold text-[#161616] font-display leading-tight">{card.title}</h4>
                    </div>
                  </div>
                  <p className="text-[9px] font-mono text-[#161616]/50 uppercase tracking-wider">{card.subtitle}</p>
                  <p className="text-xs text-[#161616]/80 leading-relaxed font-sans">{card.body}</p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-[#161616]/5 relative z-10">
                  {card.detail(activeIndex === i)}
                </div>
              </div>
            ))}
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2">
            {cards.map((_, i) => (
              <div 
                key={i} 
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: activeIndex === i ? "16px" : "6px",
                  backgroundColor: activeIndex === i ? "#C84C31" : "rgba(22,22,22,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
