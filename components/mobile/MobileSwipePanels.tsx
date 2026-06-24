"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndex = Math.max(0, panels.findIndex((p) => p.id === activeId));
  const [height, setHeight] = useState<number | undefined>(undefined);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: width * index, behavior: "smooth" });
  }, []);

  // Keep the container height matched to the ACTIVE panel so short panels
  // (e.g. the radar) don't reserve the height of the tallest panel (the specs table).
  const measure = useCallback(() => {
    const el = panelRefs.current[activeIndex];
    if (el) setHeight(el.offsetHeight);
  }, [activeIndex]);

  useLayoutEffect(() => {
    measure();
  }, [measure, activeId]);

  useEffect(() => {
    scrollToIndex(activeIndex);
  }, [activeIndex, scrollToIndex]);

  // Re-measure when the active panel's content changes (chart render, selection change) or on resize.
  useEffect(() => {
    const el = panelRefs.current[activeIndex];
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [activeIndex, measure]);

  // Debounce: only commit the active tab once scrolling SETTLES. Reading mid-scroll
  // (during a programmatic tab-tap animation) was snapping the tab back to the start.
  const handleScroll = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const el = scrollRef.current;
      if (!el || el.clientWidth === 0) return;
      const index = Math.round(el.scrollLeft / el.clientWidth);
      const panel = panels[index];
      if (panel && panel.id !== activeId) onChange(panel.id);
    }, 140);
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
        className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none -mx-1 items-start transition-[height] duration-300 ease-out"
        style={{ WebkitOverflowScrolling: "touch", height }}
      >
        {panels.map((panel, i) => (
          <div
            key={panel.id}
            ref={(el) => { panelRefs.current[i] = el; }}
            className="w-full shrink-0 snap-start px-1 self-start"
          >
            {panel.content}
          </div>
        ))}
      </div>
    </div>
  );
}
