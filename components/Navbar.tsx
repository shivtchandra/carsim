"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/wall", label: "Wall" },
  { href: "/compare", label: "Compare" },
  { href: "/simulate", label: "Simulate" },
  { href: "/race", label: "Race" },
  { href: "/cost", label: "Cost" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top mask so scrolled page content doesn't bleed through above/around the floating navbar */}
      <div
        className="fixed top-0 inset-x-0 h-24 z-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #F5F1E8 38%, rgba(245,241,232,0.85) 62%, rgba(245,241,232,0))" }}
        aria-hidden="true"
      />
      <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6">
      <nav
        className="mx-auto max-w-6xl px-4 py-3 mt-3 flex items-center justify-between rounded-2xl border border-[#161616]/10 relative"
        style={{
          background: "rgba(245, 241, 232, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="text-[15px] font-bold tracking-tight flex items-center gap-0.5 text-[#161616] font-mono"
        >
          Drive<span className="text-[#C84C31]">Scope</span>
        </Link>

        {/* Desktop Links (Visible on screens 640px and wider) */}
        <div className="hidden sm:flex items-center gap-0.5">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all duration-200 ${
                  active
                    ? "text-[#161616] bg-[#161616]/5 font-bold"
                    : "text-[#161616]/65 hover:text-[#161616] hover:bg-[#161616]/3"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA (Visible on screens 640px and wider) */}
        <div className="hidden sm:flex">
          <Link
            href="/compare"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-[#F5F1E8] transition-all duration-200 hover:opacity-90 bg-[#C84C31]"
          >
            Compare Cars
          </Link>
        </div>

        {/* Mobile Hamburger Toggle (Visible on screens smaller than 640px) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden p-1.5 rounded-lg text-[#161616] hover:bg-[#161616]/5 transition cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile Dropdown Tray */}
        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 p-4 border border-[#161616]/10 rounded-2xl sm:hidden flex flex-col gap-1.5 shadow-lg z-50"
            style={{
              background: "rgba(245, 241, 232, 0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-mono transition-all duration-150 ${
                    active
                      ? "text-[#161616] bg-[#161616]/5 font-bold"
                      : "text-[#161616]/65 hover:text-[#161616] hover:bg-[#161616]/3"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="border-t border-[#161616]/10 my-2 pt-2">
              <Link
                href="/compare"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center py-3 rounded-xl text-sm font-semibold text-[#F5F1E8] bg-[#C84C31] hover:opacity-90"
              >
                Compare Cars
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
    </>
  );
}
