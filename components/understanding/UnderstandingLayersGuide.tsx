"use client";

const LAYERS = [
  { num: "1", title: "See it", detail: "Animated 10s sim" },
  { num: "2", title: "For your driving", detail: "Useful for your city & km" },
  { num: "3", title: "Worth paying for?", detail: "Practical vs experience score" },
] as const;

export default function UnderstandingLayersGuide() {
  return (
    <div className="mb-8 rounded-2xl border border-[rgba(22,22,22,0.1)] bg-[#ECE7DF] px-5 py-4 sm:px-6 sm:py-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--accent)] font-bold">
        3-layer breakdown
      </p>
      <p className="text-sm text-primary mt-1">
        Tap any feature below — each opens a panel with{" "}
        <span className="text-secondary">sim → your context → value score</span>.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-6">
        {LAYERS.map((layer) => (
          <div key={layer.num} className="flex items-baseline gap-2 sm:flex-1">
            <span className="font-mono text-xs font-bold text-[var(--accent)]">{layer.num}</span>
            <div>
              <span className="text-sm font-medium text-primary">{layer.title}</span>
              <span className="text-xs text-secondary ml-1.5 hidden sm:inline">— {layer.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
