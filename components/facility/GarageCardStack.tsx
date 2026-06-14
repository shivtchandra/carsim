"use client";

import React from "react";

export interface GarageCardItem {
  id: string;
  content: React.ReactNode;
  backgroundColor?: string;
  backgroundImage?: string;
}

interface GarageCardStackProps {
  cards: GarageCardItem[];
  stickyBase?: number;
  stickyOffset?: number;
  className?: string;
}

export default function GarageCardStack({
  cards,
  stickyBase = 80,
  stickyOffset = 16,
  className = "",
}: GarageCardStackProps) {
  return (
    <div className={`relative w-full space-y-8 lg:space-y-12 ${className}`}>
      {cards.map((card, i) => (
        <div
          key={card.id}
          className="relative lg:sticky garage-card rounded-[28px] border border-[#161616]/15 p-8 sm:p-10 transition-all duration-300 overflow-hidden"
          style={{
            top: `${stickyBase + i * stickyOffset}px`,
            zIndex: (i + 1) * 10,
            backgroundColor: card.backgroundColor ?? "#ECE7DF",
            backgroundImage: card.backgroundImage,
            boxShadow: "0 -10px 30px rgba(22, 22, 22, 0.03), 6px 6px 0px rgba(22, 22, 22, 0.05)",
          }}
        >
          {card.content}
        </div>
      ))}
    </div>
  );
}
