"use client";

import React from "react";

export default function NoiseLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none noise-layer select-none z-10 overflow-hidden">
      <svg className="w-full h-full opacity-100 animate-pulse duration-1000" xmlns="http://www.w3.org/2000/svg">
        <filter id="noise-filter-layer">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise-filter-layer)" />
      </svg>
    </div>
  );
}
