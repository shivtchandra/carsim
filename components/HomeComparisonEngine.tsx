"use client";

import React, { useState, useMemo } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend
} from "recharts";
import { models, getBrand, getVariantsForModel, getTestData, features } from "@/lib/data";
import { radarScores } from "@/lib/scores";
import EstimatedBadge from "./EstimatedBadge";
import CarPhoto from "./CarPhoto";
import { theme } from "@/lib/theme";

const AXES = [
  { key: "performance", label: "Performance" },
  { key: "efficiency", label: "Efficiency" },
  { key: "safety", label: "Safety" },
  { key: "features", label: "Features" },
  { key: "space", label: "Space" },
  { key: "ownership", label: "Ownership" },
] as const;

const PALETTE = theme.chart;

const RADAR_GROUPS = [
  { title: "Performance Radar", keys: ["performance", "efficiency", "space"] as const, accent: theme.roomAccents.lifecycle },
  { title: "Safety Radar", keys: ["safety", "features", "space"] as const, accent: theme.roomAccents.lab },
  { title: "Ownership Radar", keys: ["ownership", "efficiency", "features"] as const, accent: theme.positive },
];

function RadarPanel({
  title,
  accent,
  data,
  selected,
}: {
  title: string;
  accent: string;
  data: Record<string, string | number>[];
  selected: { id: string; name: string }[];
}) {
  return (
    <div className="border border-[#161616]/10 bg-[#ECE7DF] p-5 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <div className="w-48 h-48 rounded-full border border-[#161616]/20 animate-radar-sweep" />
      </div>
      <h4 className="text-xs font-geist text-secondary/70 uppercase tracking-widest mb-3 relative z-10" style={{ color: accent }}>
        {title}
      </h4>
      <div className="h-56 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(22, 22, 22, 0.08)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#161616", fontSize: 9 }} />
            <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
            {selected.map((m, i) => (
              <Radar key={m.id} name={m.name} dataKey={m.name} stroke={PALETTE[i]} fill={PALETTE[i]} fillOpacity={0.08} strokeWidth={2} />
            ))}
            <Legend wrapperStyle={{ fontSize: 9, paddingTop: 4 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function HomeComparisonEngine() {
  const [ids, setIds] = useState<string[]>(["hyundai-creta", "kia-seltos"]);
  const [mobileActiveTab, setMobileActiveTab] = useState<number>(0);

  // Load selected models
  const selected = useMemo(() => {
    return ids.map((id) => models.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m);
  }, [ids]);

  // Radar scores
  const scores = useMemo(() => {
    return radarScores(selected.map((m) => m.id));
  }, [selected]);

  const buildRadarData = (keys: readonly (typeof AXES)[number]["key"][]) =>
    keys.map((key) => {
      const axis = AXES.find((a) => a.key === key)!;
      const row: Record<string, string | number> = { axis: axis.label };
      for (const m of selected) {
        row[m.name] = scores[m.id] ? Number(scores[m.id][key].toFixed(1)) : 0;
      }
      return row;
    });

  const radarGroups = useMemo(
    () => RADAR_GROUPS.map((g) => ({ ...g, data: buildRadarData(g.keys) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, scores]
  );

  // Detailed stats per car
  const carDetails = useMemo(() => {
    return selected.map((m) => {
      const vs = getVariantsForModel(m.id);
      const top = vs.reduce((a, b) => (b.priceExShowroom > a.priceExShowroom ? b : a));
      
      const psList = vs.map((v) => v.engine.ps);
      const feList = vs.map((v) => v.realWorldFE);
      const maxPower = Math.max(...psList);
      const maxTorque = Math.max(...vs.map((v) => v.engine.nm));
      const maxFe = Math.max(...feList);
      
      const best100 = Math.min(...vs.map((v) => getTestData(v.id)?.zeroTo100.value ?? 99));
      
      // Safety features count
      const safetyFeatures = features.filter(
        (f) => f.category === "safety" && top.featureIds.includes(f.id)
      ).map(f => f.name);

      // Top premium features
      const premiumFeatures = features.filter(
        (f) => f.category === "convenience" && top.featureIds.includes(f.id)
      ).map(f => f.name).slice(0, 4);

      // Resale retention
      const retentionPct = {
        hyundai: "55%", kia: "54%", tata: "50%", mahindra: "52%", skoda: "44%", honda: "48%", mg: "42%", maruti: "62%"
      }[m.brandId] || "50%";

      // Maintenance estimated
      const maintenanceEst = {
        hyundai: "₹9,200", kia: "₹9,500", tata: "₹8,500", mahindra: "₹10,500", skoda: "₹15,000", honda: "₹8,200", mg: "₹11,000", maruti: "₹6,800"
      }[m.brandId] || "₹9,000";

      return {
        model: m,
        priceMin: m.priceRange.min,
        priceMax: m.priceRange.max,
        power: maxPower,
        torque: maxTorque,
        fe: maxFe,
        zeroTo100: best100,
        ncap: m.ncap.adultStars ?? 0,
        boot: m.dimensions.bootLitres,
        maintenance: maintenanceEst,
        resale: retentionPct,
        safetyList: safetyFeatures.slice(0, 3),
        featuresList: premiumFeatures,
        brandName: getBrand(m.brandId)?.name ?? ""
      };
    });
  }, [selected]);

  const handleSelectChange = (slotIndex: number, newId: string) => {
    setIds((prev) => {
      const next = [...prev];
      if (newId === "") {
        if (next.length > 2) next.splice(slotIndex, 1);
      } else {
        next[slotIndex] = newId;
      }
      return next;
    });
  };

  const handleAddSlot = () => {
    if (ids.length < 3) {
      // Find a car not already in compare list
      const nextAvailable = models.find((m) => !ids.includes(m.id))?.id || "";
      if (nextAvailable) setIds((prev) => [...prev, nextAvailable]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Pickers & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {ids.map((id, index) => (
            <div key={index} className="flex-1 sm:flex-initial min-w-[150px]">
              <select
                value={id}
                onChange={(e) => handleSelectChange(index, e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[#F4F0E8] outline-none border border-[#161616]/10 rounded-xl [&>option]:bg-[#ECE7DF] text-primary"
                aria-label={`Select Vehicle Slot ${index + 1}`}
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id} disabled={ids.includes(m.id) && m.id !== id}>
                    {getBrand(m.brandId)?.name} {m.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {ids.length < 3 && (
            <button
              onClick={handleAddSlot}
              className="px-4 py-2 border border-dashed border-[#161616]/20 rounded-xl text-xs text-[#161616]/70 hover:text-[#161616] hover:border-[#161616]/40 transition-colors"
            >
              + Add Vehicle
            </button>
          )}
        </div>
        <span className="font-geist text-[10px] tracking-widest text-[var(--accent)] uppercase">Control Center</span>
      </div>

      {/* Triple Radar — Performance / Safety / Ownership */}
      <div className="grid md:grid-cols-3 gap-4">
        {radarGroups.map((g) => (
          <RadarPanel key={g.title} title={g.title} accent={g.accent} data={g.data} selected={selected} />
        ))}
      </div>

      {/* DESKTOP TABLE: Sticky Comparison Layout */}
      <div className="hidden sm:block overflow-x-auto rounded-[24px] border border-[#161616]/10 bg-[#ECE7DF]/50">
        <table className="w-full border-collapse text-left text-sm">
          {/* Sticky Header Row */}
          <thead className="sticky top-16 bg-[#ECE7DF]/95 backdrop-blur-md z-30 border-b border-[#161616]/10 shadow-sm">
            <tr>
              <th className="p-6 text-xs text-secondary/70 uppercase tracking-widest font-geist w-[240px]">Metric Dimension</th>
              {carDetails.map((car, index) => (
                <th key={car.model.id} className="p-6 min-w-[200px]" style={{ borderLeft: "1px solid rgba(22,22,22,0.08)" }}>
                  <div className="space-y-3">
                    <CarPhoto
                      src={car.model.heroImage}
                      alt={car.model.name}
                      color={getBrand(car.model.brandId)?.color ?? theme.accent}
                      className="w-full h-20 rounded-xl"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-geist text-[9px] tracking-widest uppercase text-secondary/60">{car.brandName}</span>
                        <h5 className="font-semibold text-primary text-base">{car.model.name}</h5>
                      </div>
                      {ids.length > 2 && (
                        <button
                          onClick={() => handleSelectChange(index, "")}
                          className="text-secondary/50 hover:text-red-400 text-xs transition-colors"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#161616]/10">
            {/* Price Axis */}
            <tr>
              <td className="p-5 font-geist text-[11px] uppercase tracking-wider text-secondary">Price Range</td>
              {carDetails.map((car) => (
                <td key={car.model.id} className="p-5 stat-num font-semibold text-primary" style={{ borderLeft: "1px solid rgba(22,22,22,0.08)" }}>
                  ₹{(car.priceMin / 100000).toFixed(1)}L – {(car.priceMax / 100000).toFixed(1)}L
                  <span className="text-[10px] text-secondary/60 block font-sans font-normal mt-0.5">Ex-showroom range</span>
                </td>
              ))}
            </tr>

            {/* Performance Axis */}
            <tr>
              <td className="p-5 font-geist text-[11px] uppercase tracking-wider text-secondary">Performance</td>
              {carDetails.map((car) => (
                <td key={car.model.id} className="p-5" style={{ borderLeft: "1px solid rgba(22,22,22,0.08)" }}>
                  <div className="space-y-1">
                    <p className="stat-num text-primary font-semibold">{car.power} PS <span className="font-sans text-xs text-secondary/60">/ {car.torque} Nm</span></p>
                    <p className="text-xs text-secondary">Best 0–100: <span className="stat-num font-semibold text-[var(--accent-bronze)]">{car.zeroTo100.toFixed(1)}s</span></p>
                  </div>
                </td>
              ))}
            </tr>

            {/* Efficiency Axis */}
            <tr>
              <td className="p-5 font-geist text-[11px] uppercase tracking-wider text-secondary">Real Mileage</td>
              {carDetails.map((car) => (
                <td key={car.model.id} className="p-5 stat-num font-semibold text-primary" style={{ borderLeft: "1px solid rgba(22,22,22,0.08)" }}>
                  ~ {car.fe.toFixed(1)} km/l <EstimatedBadge />
                  <span className="text-[10px] text-secondary/60 block font-sans font-normal mt-0.5">Real-world city average</span>
                </td>
              ))}
            </tr>

            {/* Safety Axis */}
            <tr>
              <td className="p-5 font-geist text-[11px] uppercase tracking-wider text-secondary">Safety Rating</td>
              {carDetails.map((car) => (
                <td key={car.model.id} className="p-5" style={{ borderLeft: "1px solid rgba(22,22,22,0.08)" }}>
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-yellow-400 text-sm">{"★".repeat(car.ncap)}</span>
                    <span className="text-secondary/50 text-sm">{"★".repeat(5 - car.ncap)}</span>
                    <span className="font-geist text-[10px] text-secondary ml-1">NCAP Adult</span>
                  </div>
                  <p className="text-[10px] text-secondary/70 leading-normal">
                    {car.safetyList.join(", ")}
                  </p>
                </td>
              ))}
            </tr>

            {/* Features Axis */}
            <tr>
              <td className="p-5 font-geist text-[11px] uppercase tracking-wider text-secondary">Key Tech / Convenience</td>
              {carDetails.map((car) => (
                <td key={car.model.id} className="p-5" style={{ borderLeft: "1px solid rgba(22,22,22,0.08)" }}>
                  <ul className="grid grid-cols-2 gap-1.5 text-xs text-secondary">
                    {car.featuresList.map((f, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="text-blue-400 text-[9px]">■</span> {f}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Boot Space */}
            <tr>
              <td className="p-5 font-geist text-[11px] uppercase tracking-wider text-secondary">Cargo Capacity</td>
              {carDetails.map((car) => (
                <td key={car.model.id} className="p-5 stat-num font-semibold text-primary" style={{ borderLeft: "1px solid rgba(22,22,22,0.08)" }}>
                  {car.boot} Litres
                  <span className="text-[10px] text-secondary/60 block font-sans font-normal mt-0.5">Trunk volume (VDA spec)</span>
                </td>
              ))}
            </tr>

            {/* Maintenance Axis */}
            <tr>
              <td className="p-5 font-geist text-[11px] uppercase tracking-wider text-secondary">Estimated Maintenance</td>
              {carDetails.map((car) => (
                <td key={car.model.id} className="p-5 stat-num font-semibold text-primary" style={{ borderLeft: "1px solid rgba(22,22,22,0.08)" }}>
                  {car.maintenance} <span className="text-xs font-normal font-sans text-secondary">/year</span> <EstimatedBadge />
                  <span className="text-[10px] text-secondary/60 block font-sans font-normal mt-0.5">Average scheduled service cost</span>
                </td>
              ))}
            </tr>

            {/* Resale Axis */}
            <tr>
              <td className="p-5 font-geist text-[11px] uppercase tracking-wider text-secondary">Resale Value</td>
              {carDetails.map((car) => (
                <td key={car.model.id} className="p-5 stat-num font-semibold text-primary" style={{ borderLeft: "1px solid rgba(22,22,22,0.08)" }}>
                  {car.resale} <EstimatedBadge />
                  <span className="text-[10px] text-secondary/60 block font-sans font-normal mt-0.5">Typical 5-year asset retention</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS: Swipe/Tab Comparison view */}
      <div className="block sm:hidden space-y-4">
        {/* Toggle tabs for mobile view */}
        <div className="flex border border-[#161616]/10 rounded-xl overflow-hidden text-xs font-semibold">
          {carDetails.map((car, idx) => (
            <button
              key={car.model.id}
              onClick={() => setMobileActiveTab(idx)}
              className={`flex-1 py-3 text-center transition-colors ${
                mobileActiveTab === idx
                  ? "bg-[#C74B32] text-[#F4F0E8]"
                  : "bg-[#ECE7DF] text-[#161616]/75"
              }`}
            >
              {car.model.name}
            </button>
          ))}
        </div>

        {/* Selected Car Details Card for Mobile */}
        {carDetails[mobileActiveTab] && (
          <div className="glass p-6 border-[#161616]/10 bg-[#ECE7DF] space-y-6">
            <div className="flex gap-4 items-center">
              <CarPhoto
                src={carDetails[mobileActiveTab].model.heroImage}
                alt={carDetails[mobileActiveTab].model.name}
                color={getBrand(carDetails[mobileActiveTab].model.brandId)?.color ?? theme.accent}
                className="w-1/3 h-16 rounded-lg"
              />
              <div>
                <span className="font-geist text-[9px] tracking-widest uppercase text-secondary/60">
                  {carDetails[mobileActiveTab].brandName}
                </span>
                <h5 className="font-semibold text-primary text-base leading-tight">
                  {carDetails[mobileActiveTab].model.name}
                </h5>
                <p className="text-xs text-secondary mt-0.5 font-semibold stat-num">
                  ₹{(carDetails[mobileActiveTab].priceMin / 100000).toFixed(1)}L – {(carDetails[mobileActiveTab].priceMax / 100000).toFixed(1)}L
                </p>
              </div>
            </div>

            {/* Mobile stat grids */}
            <div className="grid grid-cols-2 gap-4 text-sm divide-y divide-[#161616]/10 pt-2">
              <div className="pt-2">
                <span className="text-secondary/70 text-[10px] uppercase font-geist tracking-wide block">Performance</span>
                <span className="stat-num text-primary font-semibold block mt-0.5">{carDetails[mobileActiveTab].power} PS</span>
                <span className="text-[10px] text-secondary/60">0-100: {carDetails[mobileActiveTab].zeroTo100.toFixed(1)}s</span>
              </div>
              <div className="pt-2">
                <span className="text-secondary/70 text-[10px] uppercase font-geist tracking-wide block">Mileage</span>
                <span className="stat-num text-primary font-semibold block mt-0.5">~ {carDetails[mobileActiveTab].fe.toFixed(1)} km/l</span>
                <span className="text-[10px] text-secondary/60">Real-world city average</span>
              </div>
              <div className="pt-3">
                <span className="text-secondary/70 text-[10px] uppercase font-geist tracking-wide block">Safety</span>
                <span className="text-yellow-400 text-xs block mt-1">{"★".repeat(carDetails[mobileActiveTab].ncap)}</span>
                <span className="text-[9px] text-secondary/50">NCAP Adult stars</span>
              </div>
              <div className="pt-3">
                <span className="text-secondary/70 text-[10px] uppercase font-geist tracking-wide block">Boot Space</span>
                <span className="stat-num text-primary font-semibold block mt-0.5">{carDetails[mobileActiveTab].boot} L</span>
                <span className="text-[9px] text-secondary/60">Cargo capacity</span>
              </div>
              <div className="pt-3">
                <span className="text-secondary/70 text-[10px] uppercase font-geist tracking-wide block">Est. Maintenance</span>
                <span className="stat-num text-primary font-semibold block mt-0.5">{carDetails[mobileActiveTab].maintenance} /yr</span>
                <span className="text-[9px] text-secondary/60">Scheduled service avg</span>
              </div>
              <div className="pt-3">
                <span className="text-secondary/70 text-[10px] uppercase font-geist tracking-wide block">Resale Index</span>
                <span className="stat-num text-primary font-semibold block mt-0.5">{carDetails[mobileActiveTab].resale}</span>
                <span className="text-[9px] text-secondary/60">5-Yr retention value</span>
              </div>
            </div>

            {/* Mobile Key Tech list */}
            <div className="border-t border-[#161616]/10 pt-4">
              <span className="text-secondary/70 text-[10px] uppercase font-geist tracking-wide block mb-2">Key Convenience Features</span>
              <ul className="grid grid-cols-2 gap-1 text-xs text-secondary/80">
                {carDetails[mobileActiveTab].featuresList.map((f, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="text-[#C74B32] text-[8px]">■</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
