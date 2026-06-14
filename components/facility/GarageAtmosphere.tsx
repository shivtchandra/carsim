"use client";

import React from "react";
import { AtmosphereMood } from "../SpotlightLayer";

interface GarageAtmosphereProps {
  mood?: AtmosphereMood;
}

export default function GarageAtmosphere({ mood = "hero" }: GarageAtmosphereProps) {
  const normalizedMood =
    mood === "reveal" ? "hero" :
    mood === "engineering" ? "lab" :
    mood === "ownership" ? "lifecycle" :
    mood === "simulator" ? "simulation" :
    mood === "anteroom" || mood === "cta" ? "luxury" :
    mood;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-[1] overflow-hidden">
      {/* Oil stain texture */}
      <div
        className="absolute bottom-[8%] left-[15%] w-[40%] h-[20%] opacity-[0.015]"
        style={{
          background: "radial-gradient(ellipse, rgba(212,165,116,0.4) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Overhead print alignment lines */}
      <div className="absolute top-0 inset-x-0 h-full pointer-events-none">
        {[0.12, 0.38, 0.64].map((top, i) => (
          <div
            key={i}
            className="absolute left-[8%] right-[8%] h-px"
            style={{
              top: `${top * 100}%`,
              background: "linear-gradient(to right, transparent, rgba(199,75,50,0.1) 20%, rgba(199,75,50,0.2) 50%, rgba(199,75,50,0.1) 80%, transparent)",
            }}
          />
        ))}
      </div>

      {/* Concrete floor perspective grid */}
      <div className="absolute bottom-0 inset-x-0 h-[28%] opacity-[0.22]">
        <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
          {[-4, -2, 0, 2, 4].map((i) => (
            <line
              key={`v-${i}`}
              x1={300 + i * 100} y1={0}
              x2={300 + i * 25} y2={160}
              stroke="rgba(22, 22, 22, 0.08)" strokeWidth="0.5"
            />
          ))}
          {[0.15, 0.35, 0.58, 0.82, 1].map((t, i) => (
            <line key={`h-${i}`} x1={0} y1={t * 160} x2={600} y2={t * 160}
              stroke="rgba(22, 22, 22, 0.04)" strokeWidth="0.4"
            />
          ))}
        </svg>
      </div>

      {/* Room-specific ambient tint */}
      {normalizedMood === "luxury" && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,184,150,0.5) 0%, transparent 60%)" }}
        />
      )}
    </div>
  );
}
