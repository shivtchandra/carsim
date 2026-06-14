"use client";

import React from "react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { models, variants } from "@/lib/data";

export default function HeroReveal() {
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.1, y: 40, duration: 1 });

  return (
    <section ref={ref} className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center pt-24 pb-16 sm:pt-36 sm:pb-28 bg-transparent text-[#161616] overflow-hidden">
      {/* Ambient background glows for premium editorial depth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-[rgba(200,76,49,0.06)] blur-[80px] sm:blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] rounded-full bg-[rgba(79,107,138,0.04)] blur-[70px] sm:blur-[120px] pointer-events-none z-0" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 w-full z-10 text-center flex flex-col items-center">
        <p className="font-mono text-[9px] sm:text-[11px] text-[#C74B32] tracking-[0.2em] sm:tracking-[0.35em] uppercase font-bold" data-reveal>
          {models.length} vehicles · {variants.length} specifications · zero dealership bias
        </p>
 
        <h1
          className="font-hero leading-[1.05] sm:leading-[0.9] text-[#161616] tracking-tight font-display mt-5 mb-7 sm:mt-8 sm:mb-10 max-w-3xl"
          style={{ fontSize: "clamp(2.5rem, 8.5vw, 6.2rem)" }}
          data-reveal
        >
          Every Vehicle<br />
          <em className="text-[#C84C31] not-italic" style={{ fontStyle: "italic" }}>
            Is A System.
          </em>
        </h1>

        <div className="space-y-5 sm:space-y-7 max-w-2xl mx-auto flex flex-col items-center" data-reveal>
          <div className="font-mono text-[10px] sm:text-sm tracking-[0.12em] sm:tracking-[0.22em] uppercase text-[#161616]/75 flex flex-wrap justify-center items-center gap-x-3 gap-y-2 border-b border-[#161616]/10 pb-5 w-full max-w-lg">
            <span>Ownership</span>
            <span className="opacity-30 text-[8px] sm:text-xs">·</span>
            <span>Performance</span>
            <span className="opacity-30 text-[8px] sm:text-xs">·</span>
            <span>Reliability</span>
            <span className="opacity-30 text-[8px] sm:text-xs">·</span>
            <span>Value</span>
          </div>
          <p className="text-lg sm:text-2xl font-display text-[#161616]/85 italic leading-relaxed">
            Mapped, measured, and understood.
          </p>
          <p className="text-sm sm:text-base text-[#161616]/70 leading-relaxed font-sans max-w-xl px-2">
            Welcome to the DriveScope Research Blueprint. Walk through our technical analysis to compare variants and model real 5-year running costs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xs sm:max-w-none sm:w-auto pt-8 sm:pt-10" data-reveal>
          <a
            href="#compare"
            className="w-full sm:w-auto text-center px-10 py-4 rounded-xl bg-[#C84C31] text-[#F5F1E8] font-bold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg hover:shadow-[#C84C31]/20 shadow-sm"
          >
            Compare Cars
          </a>
          <a
            href="#simulator"
            className="w-full sm:w-auto text-center px-10 py-4 rounded-xl border border-[#161616] text-[#161616] font-bold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] hover:bg-[#161616] hover:text-[#F5F1E8] hover:shadow-lg"
          >
            Run Simulator
          </a>
        </div>

        <div className="pt-10 mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 border-t border-[#161616]/10 w-full max-w-2xl" data-reveal>
          {[
            { val: models.length.toString(), label: "Cars Indexed", color: "#C84C31" },
            { val: variants.length.toString(), label: "Trims Scored", color: "#C84C31" },
            { val: "5yr", label: "Cost Modeling", color: "#161616" },
            { val: "₹0", label: "Dealer Bias", color: "#2d6a4f" },
          ].map((s) => (
            <div key={s.label} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-bold font-mono leading-none" style={{ color: s.color }}>{s.val}</p>
              <p className="font-mono text-[9px] sm:text-[10px] text-[#161616]/60 tracking-widest uppercase mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
