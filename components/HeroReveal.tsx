"use client";

import React from "react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { models, variants } from "@/lib/data";

export default function HeroReveal() {
  const ref = useGsapReveal<HTMLElement>({ stagger: 0.1, y: 40, duration: 1 });

  return (
    <section ref={ref} className="relative min-h-[75vh] sm:min-h-[80vh] flex items-center pt-20 pb-12 sm:pt-32 sm:pb-24 bg-transparent text-[#161616]">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 w-full z-10 text-center flex flex-col items-center">
        <p className="font-mono text-[8px] sm:text-[10px] text-[#C74B32] tracking-[0.18em] sm:tracking-[0.3em] uppercase font-bold" data-reveal>
          {models.length} vehicles · {variants.length} specifications · zero dealership bias
        </p>

        <h1
          className="font-hero leading-[1.05] sm:leading-[0.9] text-[#161616] tracking-tight font-display mt-4 mb-6 sm:mt-6 sm:mb-8 max-w-3xl"
          style={{ fontSize: "clamp(2.0rem, 7vw, 5rem)" }}
          data-reveal
        >
          Every Vehicle<br />
          <em className="text-[#C84C31] not-italic" style={{ fontStyle: "italic" }}>
            Is A System.
          </em>
        </h1>

        <div className="space-y-4 sm:space-y-6 max-w-xl mx-auto flex flex-col items-center" data-reveal>
          <div className="font-mono text-[9px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] uppercase text-[#161616]/75 flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1.5 border-b border-[#161616]/10 pb-4 w-full max-w-md">
            <span>Ownership</span>
            <span className="opacity-30 text-[8px] sm:text-xs">·</span>
            <span>Performance</span>
            <span className="opacity-30 text-[8px] sm:text-xs">·</span>
            <span>Reliability</span>
            <span className="opacity-30 text-[8px] sm:text-xs">·</span>
            <span>Value</span>
          </div>
          <p className="text-base sm:text-xl font-display text-[#161616]/85 italic leading-relaxed">
            Mapped, measured, and understood.
          </p>
          <p className="text-xs sm:text-sm text-[#161616]/70 leading-relaxed font-sans max-w-md px-2">
            Welcome to the DriveScope Research Blueprint. Walk through our technical analysis to compare variants and model real 5-year running costs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto pt-6 sm:pt-8" data-reveal>
          <a href="#compare" className="w-full sm:w-auto text-center px-8 py-3.5 rounded-xl bg-[#C84C31] text-[#F5F1E8] font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm">
            Compare Cars
          </a>
          <a href="#simulator" className="w-full sm:w-auto text-center px-8 py-3.5 rounded-xl border border-[#161616] text-[#161616] font-semibold text-sm hover:bg-[#161616] hover:text-[#F5F1E8] transition-all duration-200">
            Run Simulator
          </a>
        </div>

        <div className="pt-8 mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 border-t border-[#161616]/10 w-full max-w-xl" data-reveal>
          {[
            { val: models.length.toString(), label: "Cars Indexed", color: "#C84C31" },
            { val: variants.length.toString(), label: "Trims Scored", color: "#C84C31" },
            { val: "5yr", label: "Cost Modeling", color: "#161616" },
            { val: "₹0", label: "Dealer Bias", color: "#2d6a4f" },
          ].map((s) => (
            <div key={s.label} className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: s.color }}>{s.val}</p>
              <p className="font-mono text-[8px] sm:text-[9px] text-[#161616]/60 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
