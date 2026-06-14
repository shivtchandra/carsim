"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend,
} from "recharts";
import { formatLakh, getBrand, getModel, getTestData, getVariantsForModel, models } from "@/lib/data";
import { estimate5yrCost, radarScores } from "@/lib/scores";
import EstimatedBadge from "./EstimatedBadge";
import CarPhoto from "./CarPhoto";
import OwnerVoicesPanel from "./OwnerVoicesPanel";

const AXES = [
  { key: "performance", label: "Performance" },
  { key: "efficiency", label: "Efficiency" },
  { key: "safety", label: "Safety" },
  { key: "features", label: "Features" },
  { key: "space", label: "Space" },
  { key: "ownership", label: "Ownership" },
] as const;

const PALETTE = ["#E8590C", "#60A5FA", "#4ADE80"];

export default function CompareView({ initialIds }: { initialIds: string[] }) {
  const [ids, setIds] = useState<string[]>(
    initialIds.length >= 2 ? initialIds.slice(0, 3) : ["hyundai-creta", "kia-seltos"]
  );

  const selected = ids.map(getModel).filter((m): m is NonNullable<typeof m> => !!m);
  const scores = useMemo(() => radarScores(selected.map((m) => m.id)), [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  const chartData = AXES.map((axis) => {
    const row: Record<string, string | number> = { axis: axis.label };
    for (const m of selected) row[m.name] = Number(scores[m.id][axis.key].toFixed(1));
    return row;
  });

  // stat cards with winner highlighting
  const stats = selected.map((m) => {
    const vs = getVariantsForModel(m.id);
    const top = vs.reduce((a, b) => (b.priceExShowroom > a.priceExShowroom ? b : a));
    const best100 = Math.min(
      ...vs.map((v) => getTestData(v.id)?.zeroTo100.value ?? 99)
    );
    return {
      model: m,
      price: m.priceRange.min,
      ps: Math.max(...vs.map((v) => v.engine.ps)),
      fe: Math.max(...vs.map((v) => v.realWorldFE)),
      zeroTo100: best100,
      cost5yr: estimate5yrCost(m, top),
      ncap: m.ncap.adultStars ?? 0,
    };
  });

  const winner = {
    price: Math.min(...stats.map((s) => s.price)),
    ps: Math.max(...stats.map((s) => s.ps)),
    fe: Math.max(...stats.map((s) => s.fe)),
    zeroTo100: Math.min(...stats.map((s) => s.zeroTo100)),
    cost5yr: Math.min(...stats.map((s) => s.cost5yr)),
    ncap: Math.max(...stats.map((s) => s.ncap)),
  };

  const variantIdsForSims = selected
    .map((m) => {
      const vs = getVariantsForModel(m.id);
      return vs.reduce((a, b) => (b.priceExShowroom > a.priceExShowroom ? b : a)).id;
    })
    .join(",");

  const setSlot = (i: number, id: string) =>
    setIds((p) => {
      const next = [...p];
      if (id === "") next.splice(i, 1);
      else next[i] = id;
      return next;
    });

  const Win = ({ children, on }: { children: React.ReactNode; on: boolean }) => (
    <span className={on ? "text-accent font-semibold" : undefined}>{children}</span>
  );

  return (
    <div className="space-y-10">
      {/* pickers */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <select
            key={i}
            value={ids[i] ?? ""}
            onChange={(e) => setSlot(i, e.target.value)}
            className="glass px-3 py-2.5 text-sm bg-transparent outline-none [&>option]:bg-[#ECE7DF] text-primary"
            aria-label={`Car ${i + 1}`}
          >
            <option value="">{i < 2 ? "Pick a car" : "— add a third (optional) —"}</option>
            {models
              .filter((m) => m.id === ids[i] || !ids.includes(m.id))
              .map((m) => (
                <option key={m.id} value={m.id}>{getBrand(m.brandId)?.name} {m.name}</option>
              ))}
          </select>
        ))}
      </div>

      {selected.length >= 2 && (
        <>
          {/* radar */}
          <div className="glass p-6">
            <h2 className="text-sm text-secondary mb-2">
              Six axes, scored 1–10 by formula (lib/scores.ts) <EstimatedBadge tooltip="Scores are normalized across all 10 cars; ownership axis uses the estimated cost model." />
            </h2>
            <div className="h-96">
              <ResponsiveContainer>
                <RadarChart data={chartData} outerRadius="75%">
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "#A1A1AA", fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  {selected.map((m, i) => (
                    <Radar
                      key={m.id}
                      name={m.name}
                      dataKey={m.name}
                      stroke={PALETTE[i]}
                      fill={PALETTE[i]}
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* stat cards */}
          <div className={`grid gap-6 sm:grid-cols-${Math.min(selected.length, 3)}`} style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0,1fr))` }}>
            {stats.map((s) => (
              <div key={s.model.id} className="glass p-7">
                <CarPhoto
                  src={s.model.heroImage}
                  alt={s.model.name}
                  color={getBrand(s.model.brandId)?.color ?? "#666"}
                  className="w-full h-28 mb-4"
                />
                <h3 className="font-semibold text-lg mb-4">{s.model.name}</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-secondary">Starts at</dt><dd className="stat-num"><Win on={s.price === winner.price}>{formatLakh(s.price)}</Win></dd></div>
                  <div className="flex justify-between"><dt className="text-secondary">Max power</dt><dd className="stat-num"><Win on={s.ps === winner.ps}>{s.ps} PS</Win></dd></div>
                  <div className="flex justify-between"><dt className="text-secondary">Best real FE</dt><dd className="stat-num"><Win on={s.fe === winner.fe}>~{s.fe.toFixed(1)} km/l</Win></dd></div>
                  <div className="flex justify-between"><dt className="text-secondary">Best 0–100</dt><dd className="stat-num"><Win on={s.zeroTo100 === winner.zeroTo100}>{s.zeroTo100.toFixed(1)} s</Win></dd></div>
                  <div className="flex justify-between"><dt className="text-secondary">NCAP adult</dt><dd className="stat-num"><Win on={s.ncap === winner.ncap}>{s.ncap || "—"}★</Win></dd></div>
                  <div className="flex justify-between"><dt className="text-secondary">5-yr cost ~</dt><dd className="stat-num"><Win on={s.cost5yr === winner.cost5yr}>{formatLakh(s.cost5yr)}</Win></dd></div>
                </dl>
              </div>
            ))}
          </div>

          {/* pros & cons */}
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0,1fr))` }}>
            {selected.map((m) => (
              <div key={m.id} className="glass p-7 text-sm">
                <h3 className="font-semibold mb-3">{m.name}</h3>
                <ul className="space-y-1.5">
                  {m.prosCons.pros.map((p) => (
                    <li key={p} className="flex gap-2"><span style={{ color: "var(--positive)" }}>+</span><span className="text-secondary">{p}</span></li>
                  ))}
                </ul>
                <ul className="space-y-1.5 mt-3">
                  {m.prosCons.cons.map((c) => (
                    <li key={c} className="flex gap-2"><span style={{ color: "var(--negative)" }}>−</span><span className="text-secondary">{c}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* owner voices */}
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0,1fr))` }}>
            {selected.map((m, i) => (
              <div key={m.id} className="glass p-7">
                <OwnerVoicesPanel modelId={m.id} showDisclaimer={i === 0} />
              </div>
            ))}
          </div>

          {/* deep links */}
          <div className="flex flex-wrap gap-3">
            <Link href={`/simulate?sim=drag&variants=${variantIdsForSims}`} className="glass glass-hover px-5 py-3 text-sm">Race these →</Link>
            <Link href={`/simulate?sim=braking&variants=${variantIdsForSims}`} className="glass glass-hover px-5 py-3 text-sm">Braking duel →</Link>
            <Link href={`/cost?variants=${variantIdsForSims.split(",").slice(0, 2).join(",")}`} className="glass glass-hover px-5 py-3 text-sm">5-year cost →</Link>
          </div>
        </>
      )}
    </div>
  );
}
