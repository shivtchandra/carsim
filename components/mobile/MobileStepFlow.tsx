"use client";

import React from "react";

export interface MobileStep {
  id: string;
  title: string;
}

export default function MobileStepFlow({
  steps,
  currentStep,
  onStepChange,
  children,
}: {
  steps: MobileStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
}) {
  const total = steps.length;
  const step = steps[currentStep - 1];

  return (
    <div>
      {/* Mobile step header */}
      <div className="sm:hidden mb-4 space-y-2">
        <div className="flex justify-between items-center bg-[#161616]/5 px-3 py-2.5 rounded-xl text-xs">
          <span className="text-secondary">
            Step {currentStep} of {total} — <span className="text-primary font-medium">{step?.title}</span>
          </span>
          <div className="flex gap-1.5">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentStep === i + 1 ? "bg-[#C84C31]" : currentStep > i + 1 ? "bg-[#C84C31]/40" : "bg-[#161616]/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {children}

      {/* Mobile nav footer */}
      <div className="flex sm:hidden justify-between gap-3 mt-6">
        <button
          type="button"
          onClick={() => onStepChange(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex-1 min-h-11 px-4 py-2.5 text-sm border border-[#161616]/10 rounded-xl text-secondary disabled:opacity-30"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => onStepChange(Math.min(total, currentStep + 1))}
          disabled={currentStep === total}
          className="flex-1 min-h-11 px-4 py-2.5 text-sm bg-[#C84C31] rounded-xl text-[#F5F1E8] font-medium disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/** Hide content on mobile unless it matches the active step; always visible on sm+ */
export function MobileStepPanel({
  step,
  currentStep,
  children,
  className = "",
}: {
  step: number;
  currentStep: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${currentStep !== step ? "hidden sm:block" : ""} ${className}`}>
      {children}
    </div>
  );
}
