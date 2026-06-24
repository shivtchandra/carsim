"use client";

import React, { useState } from "react";
import { ChevronUp, X } from "lucide-react";

export interface ResultLine {
  label: string;
  value: string;
  accent?: boolean;
}

export default function MobileResultsBar({
  headline,
  subline,
  lines,
  visible = true,
}: {
  headline: string;
  subline?: string;
  lines: ResultLine[];
  visible?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!visible) return null;

  return (
    <>
      {/* Bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <button
            type="button"
            aria-label="Close breakdown"
            className="absolute inset-0 bg-[#161616]/40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute bottom-0 inset-x-0 rounded-t-2xl border-t border-[#161616]/10 bg-[#F5F1E8] max-h-[70vh] overflow-y-auto"
            style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#161616]/10">
              <p className="text-sm font-semibold text-[#161616]">Cost breakdown</p>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-[#161616]/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="px-4 py-3 space-y-3">
              {lines.map((line) => (
                <li key={line.label} className="flex justify-between text-sm">
                  <span className="text-secondary">{line.label}</span>
                  <span className={`font-semibold ${line.accent ? "text-[#C84C31]" : "text-[#161616]"}`}>
                    {line.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sticky bar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-[#161616]/10 px-4 py-3 flex items-center justify-between gap-3 text-left"
        style={{
          background: "rgba(245, 241, 232, 0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="min-w-0">
          <p className="text-xl font-bold text-[#161616] truncate">{headline}</p>
          {subline && <p className="text-xs text-secondary truncate mt-0.5">{subline}</p>}
        </div>
        <ChevronUp className="h-5 w-5 shrink-0 text-[#C84C31]" />
      </button>
    </>
  );
}
