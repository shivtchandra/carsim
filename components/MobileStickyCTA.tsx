"use client";

import React, { useState, useEffect } from "react";

export default function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA only if scrolled past 300px (out of hero section)
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-[#161616]/10 px-4 py-3 flex gap-3 transition-transform duration-300 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        background: "rgba(236, 231, 223, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      <a
        href="#compare"
        className="flex-1 min-h-[48px] flex items-center justify-center rounded-xl text-sm font-medium text-[#F5F1E8] bg-[var(--accent)]"
      >
        Compare Cars
      </a>
      <a
        href="#simulator"
        className="flex-1 min-h-[48px] flex items-center justify-center rounded-xl text-sm font-medium text-primary border border-[#161616]/15 bg-[#161616]/5"
      >
        Run Simulator
      </a>
    </div>
  );
}
