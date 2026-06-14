"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { brands, models, getBrand, getVariantsForModel, formatLakh } from "@/lib/data";
import type { Fuel, Segment, Transmission } from "@/lib/types";
import CarPhoto from "./CarPhoto";

const PRICE_BANDS = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "u12", label: "Under ₹12L", min: 0, max: 1200000 },
  { id: "12-16", label: "₹12–16L", min: 1200000, max: 1600000 },
  { id: "16p", label: "₹16L+", min: 1600000, max: Infinity },
];

const TRANSMISSIONS: ("all" | Transmission)[] = ["all", "MT", "AMT", "CVT", "DCT", "AT"];
const FUELS: ("all" | Fuel)[] = ["all", "petrol", "diesel", "cng", "ev"];
const SEGMENTS: { id: "all" | Segment; label: string }[] = [
  { id: "all", label: "All segments" },
  { id: "compact-hatch", label: "Premium Hatchback" },
  { id: "compact-sedan", label: "Compact Sedan" },
  { id: "sub-4m-suv", label: "Sub-4m SUV" },
  { id: "compact-suv", label: "Compact SUV" },
  { id: "midsize-sedan", label: "Midsize sedan" },
  { id: "midsize-suv", label: "Bigger SUV" },
];

export default function ExplorerGrid() {
  const [brandId, setBrandId] = useState("all");
  const [band, setBand] = useState("all");
  const [trans, setTrans] = useState<"all" | Transmission>("all");
  const [fuel, setFuel] = useState<"all" | Fuel>("all");
  const [segment, setSegment] = useState<"all" | Segment>("all");

  const filtered = useMemo(() => {
    const b = PRICE_BANDS.find((p) => p.id === band)!;
    return models.filter((m) => {
      if (brandId !== "all" && m.brandId !== brandId) return false;
      if (segment !== "all" && m.segment !== segment) return false;
      const vs = getVariantsForModel(m.id).filter(
        (v) =>
          v.priceExShowroom >= b.min &&
          v.priceExShowroom < b.max &&
          (trans === "all" || v.transmission === trans) &&
          (fuel === "all" || v.fuel === fuel)
      );
      return vs.length > 0;
    });
  }, [brandId, band, trans, fuel, segment]);

  const selectCls =
    "glass px-3 py-2 text-sm bg-transparent text-primary outline-none [&>option]:bg-elevated";

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-10">
        <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className={selectCls} aria-label="Brand">
          <option value="all">All brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select value={band} onChange={(e) => setBand(e.target.value)} className={selectCls} aria-label="Price band">
          {PRICE_BANDS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        <select value={trans} onChange={(e) => setTrans(e.target.value as typeof trans)} className={selectCls} aria-label="Transmission">
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>{t === "all" ? "Any transmission" : t}</option>
          ))}
        </select>
        <select value={fuel} onChange={(e) => setFuel(e.target.value as typeof fuel)} className={selectCls} aria-label="Fuel">
          {FUELS.map((f) => (
            <option key={f} value={f}>{f === "all" ? "Any fuel" : f[0].toUpperCase() + f.slice(1)}</option>
          ))}
        </select>
        <select value={segment} onChange={(e) => setSegment(e.target.value as typeof segment)} className={selectCls} aria-label="Segment">
          {SEGMENTS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass p-12 text-center text-secondary">
          No cars match those filters — try widening the price band or transmission.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, i) => {
            const brand = getBrand(m.brandId)!;
            const vs = getVariantsForModel(m.id);
            const topPs = Math.max(...vs.map((v) => v.engine.ps));
            const bestFE = Math.max(...vs.map((v) => v.claimedFE));
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04, ease: "easeOut" }}
              >
                <Link href={`/cars/${m.id}`} className="glass glass-hover block p-6 group relative">
                  <CarPhoto src={m.heroImage} alt={`${brand.name} ${m.name}`} color={brand.color} className="w-full h-36 mb-4" />
                  <p className="text-xs text-secondary">{brand.name}</p>
                  <h2 className="text-lg font-semibold">{m.name}</h2>
                  <p className="stat-num text-sm text-secondary mt-1">
                    {formatLakh(m.priceRange.min)} – {formatLakh(m.priceRange.max)}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="stat-num text-base">{topPs}</p>
                      <p className="text-[11px] text-secondary">PS (top)</p>
                    </div>
                    <div>
                      <p className="stat-num text-base">{bestFE.toFixed(1)}</p>
                      <p className="text-[11px] text-secondary">km/l ARAI</p>
                    </div>
                    <div>
                      <p className="stat-num text-base">{m.ncap.adultStars ?? "—"}</p>
                      <p className="text-[11px] text-secondary">
                        {m.ncap.agency ? `${m.ncap.agency} ★` : "not rated"}
                      </p>
                    </div>
                  </div>
                  {/* AI one-liner on hover */}
                  <div className="absolute inset-x-0 bottom-0 px-6 py-4 rounded-b-2xl bg-[#ECE7DF]/95 border-t border-[#161616]/10 backdrop-blur-xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 ease-out pointer-events-none">
                    <p className="text-xs text-[#161616]/85 leading-relaxed line-clamp-3">{m.aiSummary}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
