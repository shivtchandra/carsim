"use client";

import React from "react";

export default function ChipPresets<T extends string | number>({
  options,
  value,
  onChange,
  format = (v) => String(v),
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  format?: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => (
        <button
          key={String(opt)}
          type="button"
          onClick={() => onChange(opt)}
          className={`min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            value === opt
              ? "bg-[#C84C31]/10 border border-[#C84C31] text-[#C84C31]"
              : "border border-[#161616]/10 text-secondary hover:border-[#161616]/20"
          }`}
        >
          {format(opt)}
        </button>
      ))}
    </div>
  );
}
