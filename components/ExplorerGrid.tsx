"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { brands, models, getBrand, getVariantsForModel, formatLakh } from "@/lib/data";
import type { Fuel, Segment, Transmission } from "@/lib/types";
import CarPhoto from "./CarPhoto";
import DriveSelect from "./ui/DriveSelect";

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

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-10">
        <DriveSelect
          value={brandId}
          onChange={setBrandId}
          ariaLabel="Brand"
          options={[
            { value: "all", label: "All brands" },
            ...brands.map((brand) => ({ value: brand.id, label: brand.name })),
          ]}
          className="w-48"
        />
        <DriveSelect
          value={band}
          onChange={setBand}
          ariaLabel="Price band"
          options={PRICE_BANDS.map((priceBand) => ({ value: priceBand.id, label: priceBand.label }))}
          className="w-44"
        />
        <DriveSelect
          value={trans}
          onChange={(next) => setTrans(next as "all" | Transmission)}
          ariaLabel="Transmission"
          options={TRANSMISSIONS.map((item) => ({
            value: item,
            label: item === "all" ? "Any transmission" : item,
          }))}
          className="w-56"
        />
        <DriveSelect
          value={fuel}
          onChange={(next) => setFuel(next as "all" | Fuel)}
          ariaLabel="Fuel"
          options={FUELS.map((item) => ({
            value: item,
            label: item === "all" ? "Any fuel" : item[0].toUpperCase() + item.slice(1),
          }))}
          className="w-40"
        />
        <DriveSelect
          value={segment}
          onChange={(next) => setSegment(next as "all" | Segment)}
          ariaLabel="Segment"
          options={SEGMENTS.map((item) => ({ value: item.id, label: item.label }))}
          className="w-64"
        />
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
                      <p className="stat-num text-base font-medium" style={{ color: "#4b4b4b" }}>{topPs}</p>
                      <p className="text-[11px] text-secondary">PS (top)</p>
                    </div>
                    <div>
                      <p className="stat-num text-base font-medium" style={{ color: "#4b4b4b" }}>{bestFE.toFixed(1)}</p>
                      <p className="text-[11px] text-secondary">km/l ARAI</p>
                    </div>
                    <div>
                      <p className="stat-num text-base font-medium" style={{ color: "#4b4b4b" }}>{m.ncap.adultStars ?? "—"}</p>
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
