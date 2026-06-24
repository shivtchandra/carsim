"use client";

import React from "react";
import { X } from "lucide-react";

export default function MobileFilterSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] sm:hidden">
      <button type="button" aria-label="Close filter" className="absolute inset-0 bg-[#161616]/40" onClick={onClose} />
      <div
        className="absolute bottom-0 inset-x-0 rounded-t-2xl border-t border-[#161616]/10 bg-[#F5F1E8] p-4"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#161616]">{title}</p>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#161616]/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
