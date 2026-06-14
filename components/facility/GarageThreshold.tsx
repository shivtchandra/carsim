"use client";

import React from "react";

export default function GarageThreshold({ label }: { label: string }) {
  return (
    <div className="relative z-20 h-10 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, var(--bg-base) 0%, #0c0814 50%, var(--bg-base) 100%)",
      }}
    >
      {/* Rolling shutter slats */}
      <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-evenly opacity-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        ))}
      </div>

      {/* Bay door seam — cyan glow */}
      <div
        className="absolute inset-x-[5%] top-1/2 -translate-y-1/2 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(53,214,255,0.2) 20%, rgba(53,214,255,0.5) 50%, rgba(53,214,255,0.2) 80%, transparent)",
          boxShadow: "0 0 12px 2px rgba(53,214,255,0.1)",
        }}
      />

      <span className="relative z-10 font-geist text-[9px] tracking-[0.35em] text-white/30 uppercase px-6 whitespace-nowrap bg-[#09060D]/80 py-1 rounded-full border border-white/5">
        {label}
      </span>
    </div>
  );
}
