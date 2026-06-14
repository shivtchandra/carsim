"use client";

import React from "react";
import { AtmosphereMood } from "./SpotlightLayer";
import DataTicker from "./facility/DataTicker";

interface SectionWrapperProps {
  mood: AtmosphereMood;
  className?: string;
  children?: React.ReactNode;
}

export default function SectionWrapper({ mood, className = "", children }: SectionWrapperProps) {
  // Normalize aliases to core layout variants
  const normalizedMood = (
    mood === "reveal" ? "hero" :
    mood === "engineering" ? "lab" :
    mood === "ownership" ? "lifecycle" :
    mood === "simulator" ? "simulation" :
    mood === "anteroom" || mood === "cta" ? "luxury" :
    mood
  ) as string;

  return (
    <div 
      className={`relative overflow-hidden w-full bg-transparent section-mood-${normalizedMood} ${className}`} 
      style={{ isolation: "isolate" }}
    >
      {/* Print crop ticks in corners */}
      <div className="absolute top-6 left-6 pointer-events-none select-none opacity-20 text-[#161616] font-mono text-[10px] leading-none">┌ CROP</div>
      <div className="absolute top-6 right-6 pointer-events-none select-none opacity-20 text-[#161616] font-mono text-[10px] leading-none">CROP ┐</div>
      <div className="absolute bottom-6 left-6 pointer-events-none select-none opacity-20 text-[#161616] font-mono text-[10px] leading-none">└ CROP</div>
      <div className="absolute bottom-6 right-6 pointer-events-none select-none opacity-20 text-[#161616] font-mono text-[10px] leading-none">CROP ┘</div>

      {/* CMYK-style color calibration strips in margins */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 hidden md:flex flex-col gap-1.5 opacity-25 pointer-events-none select-none z-20">
        <div className="w-2.5 h-2.5 bg-[#F5F1E8] border border-[#161616]/40" title="Bone White Calibration" />
        <div className="w-2.5 h-2.5 bg-[#161616]" title="Ink Black Calibration" />
        <div className="w-2.5 h-2.5 bg-[#C84C31]" title="Burnt Vermillion Calibration" />
        <div className="w-2.5 h-2.5 bg-[#ECE7DF]" title="Paper Elevated Calibration" />
      </div>

      {/* Print Registration Target */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 hidden md:flex flex-col items-center gap-1 opacity-[0.22] pointer-events-none select-none z-20 text-[#161616]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="12" cy="12" r="10" />
          <line x1="0" y1="12" x2="24" y2="12" />
          <line x1="12" y1="0" x2="12" y2="24" />
        </svg>
        <span className="font-mono text-[6px] tracking-widest uppercase">REG.T</span>
      </div>

      {/* Proof Page index stamp */}
      <div className="absolute bottom-6 left-12 pointer-events-none select-none opacity-[0.18] text-[#161616] font-mono text-[8px] tracking-[0.2em] z-20">
        DRIVESCOPE JOURNAL // SHEET: {normalizedMood.toUpperCase()} // PRESS_CORR_V09.26
      </div>

      {normalizedMood === "financial" && <DataTicker />}
      
      {/* Technical content overlay */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
