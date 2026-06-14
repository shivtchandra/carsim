"use client";

import React from "react";
import { 
  Compass, 
  Wrench, 
  Coins, 
  Wind, 
  GitCompare, 
  History, 
  Award 
} from "lucide-react";

export type RoomType = "hero" | "lab" | "financial" | "lifecycle" | "simulation" | "comparison" | "luxury";

interface StructuralGraphicsProps {
  room: RoomType;
}

export default function StructuralGraphics({ room }: StructuralGraphicsProps) {
  return (
    <div className="structural-watermark-container" aria-hidden="true">
      {room === "hero" && (
        <>
          {/* Huge Lucide watermark icon */}
          <div className="absolute right-[5%] top-[10%] text-[#161616]/[0.08] select-none pointer-events-none z-0">
            <Compass size={500} strokeWidth={0.3} />
          </div>
          
          <div 
            className="structural-watermark -left-[4%] top-[15%] uppercase select-none tracking-tighter opacity-[0.12]"
            style={{ fontSize: "11vw" }}
          >
            DRIVE SCOPE REVEAL
          </div>
          <div 
            className="structural-watermark right-[2%] bottom-[16%] uppercase select-none tracking-widest opacity-[0.10]"
            style={{ fontSize: "8vw" }}
          >
            AERODYNAMIC INDEX
          </div>
          <div 
            className="structural-watermark left-[15%] bottom-[5%] uppercase select-none tracking-tight opacity-[0.08]"
            style={{ fontSize: "5vw" }}
          >
            CONCEPT DEVELOPMENT
          </div>
        </>
      )}

      {room === "lab" && (
        <>
          {/* Huge Lucide watermark icon */}
          <div className="absolute left-[8%] top-[15%] text-[#C74B32]/[0.06] select-none pointer-events-none z-0">
            <Wrench size={550} strokeWidth={0.3} />
          </div>

          <div 
            className="structural-watermark left-[2%] top-[8%] uppercase select-none tracking-tighter opacity-[0.12]"
            style={{ fontSize: "10vw" }}
          >
            ENGINEERING LAB
          </div>
          <div 
            className="structural-watermark -right-[2%] bottom-[12%] uppercase select-none tracking-normal opacity-[0.10]"
            style={{ fontSize: "9vw" }}
          >
            SUSPENSION: D-WISHBONE
          </div>
        </>
      )}

      {room === "financial" && (
        <>
          {/* Huge Lucide watermark icon */}
          <div className="absolute right-[12%] top-[8%] text-[#161616]/[0.08] select-none pointer-events-none z-0">
            <Coins size={500} strokeWidth={0.3} />
          </div>

          <div 
            className="structural-watermark left-[4%] top-[14%] uppercase select-none tracking-tight opacity-[0.12]"
            style={{ fontSize: "11vw" }}
          >
            OWNERSHIP MODEL
          </div>
          <div 
            className="structural-watermark right-[3%] bottom-[8%] uppercase select-none tracking-tighter opacity-[0.10]"
            style={{ fontSize: "10vw" }}
          >
            TOTAL COST OF OWNERSHIP
          </div>
          <div 
            className="structural-watermark left-[20%] top-[48%] uppercase select-none tracking-widest opacity-[0.08]"
            style={{ fontSize: "4.5vw" }}
          >
            FINANCIAL BRIEFING
          </div>
        </>
      )}

      {room === "simulation" && (
        <>
          {/* Huge Lucide watermark icon */}
          <div className="absolute left-[10%] top-[12%] text-[#C74B32]/[0.06] select-none pointer-events-none z-0">
            <Wind size={550} strokeWidth={0.3} />
          </div>

          <div 
            className="structural-watermark -left-[1%] top-[10%] uppercase select-none tracking-tighter opacity-[0.12]"
            style={{ fontSize: "12vw" }}
          >
            SIMULATION BAY
          </div>
          <div 
            className="structural-watermark right-[5%] bottom-[15%] uppercase select-none tracking-wide opacity-[0.10]"
            style={{ fontSize: "7.5vw" }}
          >
            REAL WORLD FE MODEL
          </div>
          <div 
            className="structural-watermark left-[12%] bottom-[4%] uppercase select-none tracking-tight opacity-[0.08]"
            style={{ fontSize: "6vw" }}
          >
            VEHICLE DYNAMICS
          </div>
        </>
      )}

      {room === "comparison" && (
        <>
          {/* Huge Lucide watermark icon */}
          <div className="absolute right-[6%] top-[15%] text-[#161616]/[0.08] select-none pointer-events-none z-0">
            <GitCompare size={520} strokeWidth={0.3} />
          </div>

          <div 
            className="structural-watermark left-[3%] top-[15%] uppercase select-none tracking-tight opacity-[0.12]"
            style={{ fontSize: "11vw" }}
          >
            DECISION ENGINE
          </div>
          <div 
            className="structural-watermark -right-[3%] bottom-[10%] uppercase select-none tracking-tighter opacity-[0.10]"
            style={{ fontSize: "9vw" }}
          >
            COMPARATIVE ANALYSIS
          </div>
          <div 
            className="structural-watermark left-[25%] top-[50%] uppercase select-none tracking-widest opacity-[0.08]"
            style={{ fontSize: "5vw" }}
          >
            VEHICLE RADAR
          </div>
        </>
      )}

      {room === "lifecycle" && (
        <>
          {/* Huge Lucide watermark icon */}
          <div className="absolute left-[5%] top-[10%] text-[#161616]/[0.08] select-none pointer-events-none z-0">
            <History size={550} strokeWidth={0.3} />
          </div>

          <div className="structural-watermark left-[2%] top-[10%] uppercase select-none tracking-tighter opacity-[0.12]" style={{ fontSize: "11vw" }}>
            OWNERSHIP MODEL
          </div>
          <div className="structural-watermark right-[3%] bottom-[8%] uppercase select-none tracking-tighter opacity-[0.10]" style={{ fontSize: "9vw" }}>
            SERVICE LIFECYCLE
          </div>
          <div className="structural-watermark left-[18%] top-[45%] uppercase select-none tracking-widest opacity-[0.08]" style={{ fontSize: "5vw" }}>
            RUNNING COST ANALYSIS
          </div>
        </>
      )}

      {room === "luxury" && (
        <>
          {/* Huge Lucide watermark icon */}
          <div className="absolute right-[10%] top-[15%] text-[#C74B32]/[0.06] select-none pointer-events-none z-0">
            <Award size={520} strokeWidth={0.3} />
          </div>

          <div className="structural-watermark left-[5%] top-[10%] uppercase select-none tracking-tighter opacity-[0.12]" style={{ fontSize: "10vw" }}>
            DRIVE SCOPE DIRECTIVE
          </div>
          <div className="structural-watermark right-[5%] bottom-[10%] uppercase select-none tracking-widest opacity-[0.10]" style={{ fontSize: "7vw" }}>
            CONCEPT DEVELOPMENT CENTER
          </div>
        </>
      )}
    </div>
  );
}
