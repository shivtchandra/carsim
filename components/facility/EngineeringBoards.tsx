"use client";

import React from "react";
import Link from "next/link";
import GarageCardStack from "./GarageCardStack";
import { theme } from "@/lib/theme";

const BOARDS = [
  {
    station: "01",
    label: "Variant Intelligence",
    structural: "TRIM LEVEL SELECT",
    title: "Is the top trim worth it?",
    body: "Every upgrade scored on actual feature impact per lakh spent. Not badge value — the number that matters.",
    href: "/explore",
    accent: "#C74B32",
  },
  {
    station: "02",
    label: "Ownership Intelligence",
    structural: "ACQUISITION ANALYSIS",
    title: "What does 5 years really cost?",
    body: "Fuel, insurance, maintenance, tyres, depreciation — modeled for your city and annual km.",
    href: "/cost",
    accent: "#C74B32",
    featured: true,
  },
  {
    station: "03",
    label: "Physics Intelligence",
    structural: "AERODYNAMICS SYSTEM",
    title: "How does it actually drive?",
    body: "Drag races, overtakes, braking distances — derived from real chassis data. Not marketing sheets.",
    href: "/simulate",
    accent: "#C74B32",
  },
];

export default function EngineeringBoards() {
  const cards = BOARDS.map((board) => ({
    id: board.station,
    backgroundColor: board.featured ? "#ECE7DF" : "#F4F0E8",
    backgroundImage: "none",
    content: (
      <Link href={board.href} className="relative block h-full min-h-[280px] flex flex-col justify-between group">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(22,22,22,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(22,22,22,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
        <div
          className="absolute -bottom-2 -right-2 font-mono font-black uppercase text-[#161616]/[0.02] pointer-events-none select-none tracking-tighter"
          style={{ fontSize: "3.5rem", lineHeight: 0.85 }}
        >
          {board.structural}
        </div>
        <div className="relative z-10">
          <div className="font-mono text-[8px] tracking-[0.3em] uppercase mb-8 text-[#C74B32]">
            Station {board.station} — {board.label}
          </div>
          <h3 className={`font-display text-[#161616] mb-5 leading-tight ${board.featured ? "text-4xl" : "text-3xl"}`}>
            {board.title}
          </h3>
          <p className="text-sm text-[#161616]/75 leading-relaxed max-w-xl">{board.body}</p>
        </div>
        <span className="font-mono text-[10px] tracking-widest uppercase relative z-10 mt-8 text-[#C74B32] group-hover:underline">
          Open station →
        </span>
      </Link>
    ),
  }));

  return <GarageCardStack cards={cards} stickyBase={100} stickyOffset={20} />;
}
