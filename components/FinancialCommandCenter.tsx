"use client";

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { costParams, formatLakh, getModel, getVariant } from "@/lib/data";
import { computeCost } from "@/lib/cost";
import EstimatedBadge from "./EstimatedBadge";
import VariantSelect from "./sims/VariantSelect";

const SERIES = [
  { key: "fuel", label: "Fuel", color: "#C74B32" },
  { key: "insurance", label: "Insurance", color: "#161616" },
  { key: "maintenance", label: "Maintenance", color: "rgba(22, 22, 22, 0.6)" },
  { key: "tyres", label: "Tyres", color: "rgba(22, 22, 22, 0.35)" },
  { key: "depreciation", label: "Depreciation", color: "rgba(22, 22, 22, 0.15)" },
] as const;

function variantLabel(variantId: string) {
  const v = getVariant(variantId);
  const m = v && getModel(v.modelId);
  return v && m ? `${m.name} ${v.name}` : variantId;
}

function ownershipScore(costPerKm: number, total: number): number {
  const benchmark = 8.5;
  const kmScore = Math.max(0, Math.min(5, (benchmark - costPerKm) / benchmark * 5 + 2.5));
  const totalLakh = total / 100000;
  const costScore = Math.max(0, Math.min(5, 5 - (totalLakh - 4) / 8));
  return Math.round((kmScore + costScore) * 10) / 10;
}

export default function FinancialCommandCenter() {
  const [idA, setIdA] = useState("creta-sx-mt");
  const [idB, setIdB] = useState("");
  const [cityId, setCityId] = useState("hyderabad");
  const [kmPerYear, setKmPerYear] = useState(12000);
  const [years, setYears] = useState(5);

  const city = useMemo(() => costParams.cities.find((c) => c.id === cityId)!, [cityId]);
  const costA = useMemo(() => computeCost(idA, city, kmPerYear, years), [idA, city, kmPerYear, years]);
  const costB = useMemo(() => (idB ? computeCost(idB, city, kmPerYear, years) : null), [idB, city, kmPerYear, years]);

  const score = costA ? ownershipScore(costA.costPerKm, costA.total) : 0;

  const chartData = useMemo(() => {
    if (!costA) return [];
    return costA.years.map((y) => {
      const row: Record<string, number | string> = { name: `Yr ${y.year}` };
      for (const s of SERIES) row[s.label] = Math.round(y[s.key as keyof typeof y]);
      return row;
    });
  }, [costA]);

  const delta = costA && costB ? costA.total - costB.total : null;

  return (
    <div className="space-y-12 text-[#161616]">
      {/* 3-column mission control layout */}
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-4 items-stretch">
        {/* Left: Inputs */}
        <div className="lg:col-span-4 space-y-5" data-reveal>
          <div className="border border-[#161616]/10 bg-[#ECE7DF] p-6 rounded-2xl space-y-5 h-full">
            <p className="font-mono text-[9px] tracking-[0.3em] text-[#C74B32] uppercase font-bold">Input Terminal</p>
            <VariantSelect label="Primary Variant" value={idA} onChange={setIdA} />
            <VariantSelect label="Compare against (optional)" value={idB} allowNone onChange={setIdB} />
            
            <label className="block text-sm">
              <span className="text-[#161616]/65 text-xs block mb-1 font-mono uppercase tracking-wider">City Location</span>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F4F0E8] text-sm text-[#161616] border border-[#161616]/10 rounded-xl outline-none [&>option]:bg-[#ECE7DF]"
              >
                {costParams.cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · ₹{c.petrolPrice.toFixed(0)}/l
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="text-[#161616]/65 text-xs block mb-1 font-mono uppercase tracking-wider">
                Driving: <span className="font-mono text-[#C74B32] font-bold">{(kmPerYear / 1000).toFixed(0)}k km/yr</span>
              </span>
              <input type="range" min={5000} max={30000} step={1000} value={kmPerYear}
                onChange={(e) => setKmPerYear(Number(e.target.value))} className="w-full mt-2 accent-[#C74B32]" />
            </label>

            <label className="block text-sm">
              <span className="text-[#161616]/65 text-xs block mb-1 font-mono uppercase tracking-wider">
                Ownership: <span className="font-mono text-[#C74B32] font-bold">{years} years</span>
              </span>
              <input type="range" min={3} max={8} step={1} value={years}
                onChange={(e) => setYears(Number(e.target.value))} className="w-full mt-2 accent-[#C74B32]" />
            </label>
          </div>
        </div>

        {/* Center: Ownership Score */}
        <div className="lg:col-span-4 flex items-center justify-center" data-reveal>
          <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(22, 22, 22, 0.05)" strokeWidth="3" />
              <circle
                cx="100" cy="100" r="88" fill="none"
                stroke="#C74B32" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${(score / 10) * 553} 553`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="text-center z-10">
              <p className="font-mono text-[9px] tracking-[0.35em] text-[#C74B32] uppercase mb-2 font-bold">Ownership Score</p>
              <p className="font-mono text-6xl sm:text-7xl font-bold text-[#161616]">{score.toFixed(1)}</p>
              <p className="text-xs text-[#161616]/60 mt-1">out of 10.0</p>
              {costA && (
                <p className="font-mono text-[9px] text-[#161616]/50 mt-4 uppercase tracking-widest max-w-[180px] mx-auto truncate">
                  {variantLabel(idA)}
                </p>
              )}
            </div>
            {/* Subtle border ring */}
            <div className="absolute inset-4 rounded-full border border-[#161616]/5 pointer-events-none" />
          </div>
        </div>

        {/* Right: Outputs */}
        <div className="lg:col-span-4 space-y-4" data-reveal>
          {costA && (
            <>
              <div className="border border-[#161616]/10 bg-[#ECE7DF] p-6 rounded-2xl relative overflow-hidden">
                <p className="font-mono text-[9px] tracking-widest text-[#C74B32] uppercase mb-3 font-bold">Output Terminal</p>
                <p className="font-mono text-4xl font-semibold text-[#161616]">
                  ₹{costA.costPerKm.toFixed(1)}
                  <span className="text-base text-[#161616]/60 font-sans font-normal ml-1">/km</span>
                </p>
                <p className="font-mono text-sm text-[#C74B32] font-semibold mt-2 flex items-center gap-1.5">
                  {formatLakh(costA.total)} total lifecycle
                  <EstimatedBadge tooltip="Modeled using city fuel price, brand maintenance, tyres and depreciation." />
                </p>
                <div className="mt-5 pt-4 border-t border-[#161616]/5 grid grid-cols-2 gap-3 text-xs">
                  {[
                    { l: "Fuel", v: formatLakh(costA.totalFuel) },
                    { l: "Maintenance", v: formatLakh(costA.totalMaintenance) },
                    { l: "Insurance", v: formatLakh(costA.totalInsurance) },
                    { l: "Depreciation", v: formatLakh(costA.totalDepreciation), accent: true },
                  ].map((row) => (
                    <div key={row.l}>
                      <span className="block text-[#161616]/50 font-mono text-[9px] uppercase">{row.l}</span>
                      <span className={`font-semibold font-mono ${row.accent ? "text-[#C74B32]" : "text-[#161616]"}`}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {costB && (
                <div className="border border-[#161616]/10 bg-[#ECE7DF] p-5 rounded-2xl text-sm">
                  <p className="font-mono text-[9px] text-[#161616]/50 uppercase tracking-widest mb-2">Comparison</p>
                  <p className="text-[#161616]/90 font-mono">
                    <span className="text-[#161616] font-semibold">{variantLabel(idB)}</span> —{" "}
                    <span className="text-[#C74B32] font-bold">{formatLakh(costB.total)}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {delta !== null && Math.abs(delta) > 1000 && (
        <div className="border-l-2 pl-4 py-1.5 border-[#C74B32] bg-[#C74B32]/5 max-w-3xl" data-reveal>
          <p className="text-sm text-[#161616]/90 leading-relaxed font-sans">
            Insight: <span className="font-semibold text-[#161616]">{variantLabel(delta > 0 ? idB : idA)}</span> costs{" "}
            <span className="font-mono font-bold text-[#C74B32]">{formatLakh(Math.abs(delta))}</span> less over {years} years.
          </p>
        </div>
      )}

      {costA && chartData.length > 0 && (
        <div className="border border-[#161616]/10 bg-[#ECE7DF] p-6 sm:p-8 rounded-2xl" data-reveal>
          <h4 className="text-xs font-mono text-[#C74B32] uppercase tracking-widest mb-6 font-bold">
            Year-over-Year Accumulation — {variantLabel(idA)}
          </h4>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#161616" strokeOpacity={0.6} fontSize={11} tickLine={false} />
                <YAxis stroke="#161616" strokeOpacity={0.6} fontSize={11} tickLine={false} tickFormatter={(v: number) => `${(v / 100000).toFixed(1)}L`} />
                <Tooltip
                  formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
                  contentStyle={{ background: "#F4F0E8", border: "1px solid rgba(22, 22, 22, 0.1)", borderRadius: 12 }}
                  labelStyle={{ color: "#161616", fontFamily: "monospace", fontSize: 12 }}
                  itemStyle={{ color: "#161616" }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                {SERIES.map((s) => (
                  <Bar key={s.key} dataKey={s.label} stackId="a" fill={s.color} radius={s.key === "depreciation" ? [4, 4, 0, 0] : 0} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
