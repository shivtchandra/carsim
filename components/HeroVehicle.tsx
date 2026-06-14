"use client";

import React from "react";
import HomeHeroVisual from "./three/HomeHeroVisual";

export function HeroVehicle() {
  return (
    <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[640px] overflow-hidden select-none bg-black/40 rounded-[28px] border border-white/5">
      <div className="absolute inset-x-0 top-0 h-[68%] z-0 pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="led-dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1.2" fill="rgba(53, 214, 255, 0.7)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#led-dot-pattern)" />
        </svg>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-[32%] z-10 pointer-events-none">
        <div className="absolute inset-0 hero-reflection" />
        <div className="absolute inset-0 opacity-[0.015]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="url(#led-dot-pattern)" />
          </svg>
        </div>
        <div
          className="absolute bottom-0 left-[35%] w-[45%] h-[65%] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 65% 55% at 55% 100%, rgba(53,214,255,0.12) 0%, rgba(20,10,28,0.05) 40%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />
        <div
          className="absolute bottom-0 left-[5%] w-[35%] h-[50%] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 40% 100%, rgba(91,55,120,0.08) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        <svg className="absolute bottom-0 inset-x-0 w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none" style={{ opacity: 0.12 }}>
          {[-5, -3, -1, 0, 1, 3, 5].map((i, idx) => (
            <line key={idx} x1={300 + i * 120} y1={0} x2={300 + i * 30} y2={200} stroke="rgba(255,255,255,0.6)" strokeWidth="0.4" />
          ))}
          {[0.08, 0.22, 0.42, 0.65, 0.85, 1.0].map((t, i) => (
            <line key={i} x1={0} y1={t * 200} x2={600} y2={t * 200} stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
          ))}
        </svg>
        <div className="absolute top-0 inset-x-0 h-px" style={{
          background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 80%, transparent 100%)",
        }} />
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-10 animate-spotlight-sweep"
        style={{
          background: "radial-gradient(ellipse 55% 60% at 58% 42%, rgba(53,214,255,0.2) 0%, rgba(20,10,28,0.08) 30%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute top-[20%] left-[42%] w-[36%] h-[40%] pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at 55% 40%, rgba(53,214,255,0.15) 0%, rgba(91,55,120,0.06) 35%, transparent 65%)",
          filter: "blur(14px)",
        }}
      />
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: "conic-gradient(from 90deg at 68% -8%, transparent 52deg, rgba(53,214,255,0.04) 68deg, rgba(53,214,255,0.07) 80deg, rgba(53,214,255,0.08) 88deg, rgba(53,214,255,0.07) 96deg, rgba(53,214,255,0.04) 108deg, transparent 124deg)",
        transformOrigin: "68% 0%",
      }} />

      <div className="absolute inset-0 z-20">
        <HomeHeroVisual />
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: "linear-gradient(to right, rgba(53,214,255,0.06) 0%, rgba(53,214,255,0.02) 35%, transparent 65%)",
          filter: "blur(20px)",
        }}
      />

      <div
        className="absolute bottom-[28%] left-[10%] w-[75%] h-[12%] z-35 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(53,214,255,0.05) 0%, rgba(20,10,28,0.03) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <div
        className="absolute bottom-[33%] left-[12%] right-[12%] z-35 pointer-events-none"
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent 0%, rgba(53,214,255,0.15) 20%, rgba(53,214,255,0.30) 50%, rgba(53,214,255,0.15) 80%, transparent 100%)",
          boxShadow: "0 0 12px 3px rgba(53,214,255,0.08)",
        }}
      />

      <div className="absolute bottom-5 left-5 z-40 space-y-0.5 pointer-events-none select-none">
        <div className="font-geist text-[7px] tracking-[0.25em] text-white/20 uppercase">
          Reveal Stage · Sector 3
        </div>
        <div className="font-geist text-[7px] tracking-[0.25em] text-[var(--accent)]/70 uppercase font-semibold">
          LED Stage Active · Cyan Rim Sweep
        </div>
      </div>
    </div>
  );
}
