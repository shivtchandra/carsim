"use client";

import React, { useCallback, useEffect, useRef } from "react";
import MobileSegmentedTabs from "./MobileSegmentedTabs";

export interface SwipePanel {
  id: string;
  label: string;
  content: React.ReactNode;
}

export default function MobileSwipePanels({
  panels,
  activeId,
  onChange,
}: {
  panels: SwipePanel[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(0, panels.findIndex((p) => p.id === activeId));

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: width * index, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToIndex(activeIndex);
  }, [activeIndex, scrollToIndex]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    const panel = panels[index];
    if (panel && panel.id !== activeId) onChange(panel.id);
  };

  return (
    <div className="space-y-3">
      <MobileSegmentedTabs
        tabs={panels.map((p) => ({ id: p.id, label: p.label }))}
        activeId={activeId}
        onChange={(id) => {
          onChange(id);
          const idx = panels.findIndex((p) => p.id === id);
          if (idx >= 0) scrollToIndex(idx);
        }}
      />
      <p className="text-[10px] text-secondary text-center sm:hidden">Swipe left or right to switch views</p>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {panels.map((panel) => (
          <div key={panel.id} className="w-full shrink-0 snap-start px-1">
            {panel.content}
          </div>
        ))}
      </div>
    </div>
  );
}
