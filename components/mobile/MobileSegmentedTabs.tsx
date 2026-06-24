"use client";

import React from "react";

export interface SegmentedTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export default function MobileSegmentedTabs({
  tabs,
  activeId,
  onChange,
  className = "",
}: {
  tabs: SegmentedTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
              active
                ? "bg-[#C84C31] text-[#F5F1E8] shadow-sm"
                : "border border-[#161616]/10 text-secondary hover:bg-[#161616]/5"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
