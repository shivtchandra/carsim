"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

export interface DriveSelectOption<T extends string> {
  value: T;
  label: string;
}

interface Anchor {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
}

export default function DriveSelect<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className = "",
}: {
  value: T;
  options: DriveSelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  function openMenu() {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownH = 340;
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    if (spaceBelow >= dropdownH || spaceBelow >= rect.top) {
      setAnchor({ top: rect.bottom + gap, left: rect.left, width: rect.width });
    } else {
      setAnchor({ bottom: window.innerHeight - rect.top + gap, left: rect.left, width: rect.width });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event: PointerEvent) {
      if (!triggerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    function onScroll() {
      setOpen(false);
      setQuery("");
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const dropdown = open && anchor ? (
    <div
      id={listboxId}
      role="listbox"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top: anchor.top,
        bottom: anchor.bottom,
        left: anchor.left,
        minWidth: anchor.width,
        zIndex: 9999,
      }}
      className="w-max overflow-hidden rounded-xl border border-[#161616]/12 bg-[#fffdf8] shadow-[0_18px_50px_rgba(22,22,22,0.16)]"
    >
      <div className="border-b border-[#161616]/10 p-3">
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#161616]/14 bg-white px-3 text-sm text-[#161616]/72 shadow-[0_1px_2px_rgba(22,22,22,0.04)]">
          <Search className="h-5 w-5 shrink-0 text-[#9a9a9a]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[#161616] text-base outline-none placeholder:text-[#8a8a8a] sm:text-sm"
            autoFocus
          />
        </label>
      </div>

      <div className="max-h-72 min-w-56 overflow-y-auto py-2">
        {filteredOptions.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-[#161616]/52">No matches</div>
        ) : (
          filteredOptions.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setQuery("");
                }}
                className={`flex min-h-11 w-full items-center gap-3 px-4 py-2 text-left text-sm font-medium transition ${
                  active
                    ? "text-[#333333]"
                    : "text-[#4b4b4b] hover:bg-[#F5F1E8]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    active
                      ? "border-[#C84C31] bg-[#C84C31] text-white"
                      : "border-[#161616]/18 bg-white text-transparent"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="truncate">{option.label}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className={`relative min-w-40 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => (open ? (setOpen(false), setQuery("")) : openMenu())}
        className="flex min-h-11 w-full items-center justify-between gap-4 rounded-xl border border-[#161616]/12 bg-[#F5F1E8] px-3 py-2 text-left text-sm text-[#161616] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_20px_rgba(22,22,22,0.04)] transition hover:border-[#C84C31]/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_24px_rgba(22,22,22,0.07)] focus:outline-none focus:ring-4 focus:ring-[#C84C31]/15"
      >
        <span className="truncate">{selected?.label}</span>
        <span className="flex items-center gap-2 border-l border-[#161616]/10 pl-3 text-[#4b4b4b]">
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {typeof document !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}
