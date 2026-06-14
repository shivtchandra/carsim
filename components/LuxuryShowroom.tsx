"use client";

import React from "react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { theme } from "@/lib/theme";

export default function LuxuryShowroom() {
  const ref = useGsapReveal<HTMLDivElement>({ stagger: 0.12, y: 32 });
  const gold = theme.roomAccents.luxury;

  return (
    <section ref={ref} className="py-36 relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(201,184,150,0.15) 2px, rgba(201,184,150,0.15) 3px)`,
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none animate-breathing-glow"
        style={{
          background: "radial-gradient(ellipse, rgba(201,184,150,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="mx-auto max-w-3xl px-6 text-center space-y-10 relative z-10">
        <p className="font-geist text-[9px] tracking-[0.4em] uppercase opacity-50" style={{ color: gold }} data-reveal>
          DriveScope Directive · Concept Development Center
        </p>

        <h2
          className="font-hero text-primary leading-[0.9] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          data-reveal
        >
          Make the right call.<br />
          <em className="not-italic" style={{ fontStyle: "italic", color: gold }}>
            Before you sign.
          </em>
        </h2>

        <p className="text-sm text-secondary/70 max-w-sm mx-auto leading-relaxed font-sans" data-reveal>
          Every score is traceable. Every number has a formula.
          No opinions dressed as facts.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-2" data-reveal>
          <a
            href="#compare"
            className="min-h-[48px] px-8 flex items-center rounded-xl text-sm font-medium"
            style={{ background: gold, color: theme.base }}
          >
            Compare Cars →
          </a>
          <a
            href="#simulator"
            className="min-h-[48px] px-8 flex items-center rounded-xl text-sm font-medium text-primary border bg-white/[0.03]"
            style={{ borderColor: `${gold}4D` }}
          >
            Run Ownership Simulation
          </a>
        </div>

        <div className="pt-16 flex justify-center gap-12 opacity-40" data-reveal>
          {["Engineering Verified", "Formula Traced", "Zero Bias"].map((label) => (
            <div key={label} className="text-center">
              <div className="w-px h-8 mx-auto mb-2" style={{ background: `linear-gradient(to bottom, ${gold}99, transparent)` }} />
              <p className="font-geist text-[8px] tracking-[0.25em] uppercase" style={{ color: gold }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
