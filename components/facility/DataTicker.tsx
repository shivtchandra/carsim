"use client";

import React from "react";

const TICKER_ITEMS = [
  "FUEL_INDEX +2.4%",
  "IDV_DECAY -10.2%",
  "RTO_TAX 12.5%",
  "MAINT_BRAND σ=1.45",
  "RETENTION_MARUTI 62%",
  "TCO_MODEL v3.2",
  "INSURANCE_IDV ↓",
  "DEPRECIATION_CURVE",
];

export default function DataTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="absolute inset-x-0 top-0 h-8 overflow-hidden pointer-events-none z-[1] opacity-30">
      <div className="flex animate-ticker whitespace-nowrap font-geist text-[9px] tracking-[0.2em] text-[var(--accent-emerald)]/80 uppercase">
        {doubled.map((item, i) => (
          <span key={i} className="mx-8">
            {item} <span className="text-[var(--accent-emerald)]/30">///</span>
          </span>
        ))}
      </div>
    </div>
  );
}
