"use client";

import { useState } from "react";
import type { Model } from "@/lib/types";
import { getSpecUnderstanding } from "@/lib/understanding";
import UnderstandingPanel, { type UnderstandingTarget } from "./UnderstandingPanel";

const SPECS = [
  { key: "boot" as const, getValue: (m: Model) => `${m.dimensions.bootLitres} litres` },
  { key: "wheelbase" as const, getValue: (m: Model) => `${m.dimensions.wheelbaseMm} mm wheelbase` },
  {
    key: "groundClearance" as const,
    getValue: (m: Model) => `${m.dimensions.groundClearanceMm} mm clearance`,
  },
];

export default function SpecUnderstandingGrid({ model }: { model: Model }) {
  const [target, setTarget] = useState<UnderstandingTarget | null>(null);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3 mb-10">
        {SPECS.map(({ key, getValue }) => {
          const spec = getSpecUnderstanding(key);
          if (!spec) return null;
          return (
            <button
              key={key}
              type="button"
              onClick={() =>
                setTarget({
                  type: "spec",
                  spec,
                  specProps: {
                    bootLitres: model.dimensions.bootLitres,
                    wheelbaseMm: model.dimensions.wheelbaseMm,
                    groundClearanceMm: model.dimensions.groundClearanceMm,
                  },
                  rawValue: getValue(model),
                })
              }
              className="group text-left rounded-xl border border-[rgba(22,22,22,0.1)] bg-[#ECE7DF] p-4 hover:border-[var(--accent)]/35 hover:bg-[#F5F1E8] transition-colors min-h-[48px]"
            >
              <p className="text-sm font-medium text-[var(--accent)]">{spec.hook}</p>
              <p className="text-base font-semibold mt-0.5 text-primary">{spec.label}</p>
              <p className="text-xs text-secondary mt-1">{getValue(model)}</p>
            </button>
          );
        })}
      </div>
      <UnderstandingPanel target={target} onClose={() => setTarget(null)} />
    </>
  );
}
