"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import { formatLakh, getBrand, getModel, getTestData, getVariantsForModel, models } from "@/lib/data";
import { estimate5yrCost, radarScoresWithFuel } from "@/lib/scores";
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
  const [selections, setSelections] = useState<{ modelId: string; fuel: string }[]>(() => {
    const initialModels = initialIds.length >= 2 ? initialIds.slice(0, 3) : ["hyundai-creta", "kia-seltos"];
    return initialModels.map((modelId) => {
      const m = getModel(modelId);
      const vs = m ? getVariantsForModel(m.id) : [];
      const defaultFuel = vs[0]?.fuel ?? "petrol";
      return { modelId, fuel: defaultFuel };
    });
  });

  const selected = useMemo(() => {
    return selections
      .map((sel) => {
        const m = getModel(sel.modelId);
        if (!m) return null;
        return {
          ...m,
          selectedFuel: sel.fuel,
          uniqueKey: `${m.id}-${sel.fuel}`,
          displayName: `${m.name} (${sel.fuel.toUpperCase()})`,
        };
      })
      .filter((m): m is NonNullable<typeof m> => !!m);
  }, [selections]);

  const scores = useMemo(() => {
    return radarScoresWithFuel(selections.filter((s) => s.modelId));
  }, [selections]);

  const chartData = useMemo(() => {
    return AXES.map((axis) => {
      const row: Record<string, string | number> = { axis: axis.label };
      for (const m of selected) {
        row[m.displayName] = Number(scores[m.uniqueKey]?.[axis.key]?.toFixed(1) ?? 0);
      }
      return row;
    });
  }, [selected, scores]);

  // stat cards with winner highlighting
  const stats = useMemo(() => {
    return selected.map((m) => {
      const vs = getVariantsForModel(m.id).filter((v) => v.fuel === m.selectedFuel);
      const activeVs = vs.length > 0 ? vs : getVariantsForModel(m.id);
      const top = activeVs.reduce((a, b) => (b.priceExShowroom > a.priceExShowroom ? b : a), activeVs[0]);
      const best100 = Math.min(
        ...activeVs.map((v) => getTestData(v.id)?.zeroTo100.value ?? 99)
      );
      return {
        model: m,
        displayName: m.displayName,
        uniqueKey: m.uniqueKey,
        price: Math.min(...activeVs.map((v) => v.priceExShowroom)),
        ps: Math.max(...activeVs.map((v) => v.engine.ps)),
        fe: Math.max(...activeVs.map((v) => v.realWorldFE)),
        zeroTo100: best100,
        cost5yr: estimate5yrCost(m, top),
        ncap: m.ncap.adultStars ?? 0,
      };
    });
  }, [selected]);

  const winner = useMemo(() => {
    if (stats.length === 0) return { price: 0, ps: 0, fe: 0, zeroTo100: 0, cost5yr: 0, ncap: 0 };
    return {
      price: Math.min(...stats.map((s) => s.price)),
      ps: Math.max(...stats.map((s) => s.ps)),
      fe: Math.max(...stats.map((s) => s.fe)),
      zeroTo100: Math.min(...stats.map((s) => s.zeroTo100)),
      cost5yr: Math.min(...stats.map((s) => s.cost5yr)),
      ncap: Math.max(...stats.map((s) => s.ncap)),
    };
  }, [stats]);

  const variantIdsForSims = useMemo(() => {
    return selected
      .map((m) => {
        const vs = getVariantsForModel(m.id).filter((v) => v.fuel === m.selectedFuel);
        const activeVs = vs.length > 0 ? vs : getVariantsForModel(m.id);
        return activeVs.reduce((a, b) => (b.priceExShowroom > a.priceExShowroom ? b : a), activeVs[0]).id;
      })
      .join(",");
  }, [selected]);

  const setSlotModel = (i: number, modelId: string) => {
    setSelections((prev) => {
      const next = [...prev];
      if (modelId === "") {
        next.splice(i, 1);
      } else {
        const m = getModel(modelId);
        const vs = m ? getVariantsForModel(m.id) : [];
        const defaultFuel = vs[0]?.fuel ?? "petrol";
        next[i] = { modelId, fuel: defaultFuel };
      }
      return next;
    });
  };

  const setSlotFuel = (i: number, fuel: string) => {
    setSelections((prev) => {
      const next = [...prev];
      if (next[i]) {
        next[i] = { ...next[i], fuel };
      }
      return next;
    });
  };

  const Win = ({ children, on }: { children: React.ReactNode; on: boolean }) => (
    <span className={on ? "text-accent font-semibold" : undefined}>{children}</span>
  );

  return (
    <div className="space-y-10">
      {/* pickers */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => {
          const selection = selections[i];
          const model = selection ? getModel(selection.modelId) : null;
          const vs = model ? getVariantsForModel(model.id) : [];
          const uniqueFuels = Array.from(new Set(vs.map((v) => v.fuel)));

          return (
            <div key={i} className="flex flex-col gap-2 glass p-4">
              <span className="text-[10px] font-mono text-secondary uppercase tracking-wider">Slot {i + 1}</span>
              <select
                value={selection?.modelId ?? ""}
                onChange={(e) => setSlotModel(i, e.target.value)}
                className="w-full px-3 py-2 text-sm bg-transparent border border-[#161616]/10 rounded-xl outline-none [&>option]:bg-[#ECE7DF] text-primary"
                aria-label={`Car ${i + 1}`}
              >
                <option value="">{i < 2 ? "Pick a car" : "— add a third (optional) —"}</option>
                {models
                  .filter((m) => !selections.some((s, idx) => idx !== i && s.modelId === m.id))
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {getBrand(m.brandId)?.name} {m.name}
                    </option>
                  ))}
              </select>

              {selection && uniqueFuels.length > 0 && (
                <div className="flex gap-2 items-center text-xs mt-1.5">
                  <span className="text-secondary font-mono">Fuel:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueFuels.map((f) => (
                      <button
                        key={f}
                        onClick={() => setSlotFuel(i, f)}
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono uppercase tracking-wider transition-all duration-150 ${
                          selection.fuel === f
                            ? "border-[#C84C31] bg-[#C84C31]/5 text-[#C84C31] font-bold"
                            : "border-[#161616]/10 bg-[#ECE7DF]/60 text-[#161616]/75 hover:bg-[#ECE7DF]"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected.length >= 2 && (
        <>
          {/* radar */}
          <div className="glass p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-sm text-secondary flex items-center gap-1.5 flex-wrap">
                Six axes, scored 1–10 by formula (lib/scores.ts)
                <EstimatedBadge tooltip="Scores are normalized across all combinations of models and fuels; ownership axis uses the estimated cost model." />
              </h2>
              {/* Custom Legend */}
              <div className="flex gap-4 text-xs font-mono flex-wrap">
                {selected.map((m, i) => (
                  <div key={m.uniqueKey} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[i] }} />
                    <span className="text-primary font-medium">{m.displayName}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-72 sm:h-96">
              <ResponsiveContainer>
                <RadarChart data={chartData} outerRadius="62%">
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "#A1A1AA", fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  {selected.map((m, i) => (
                    <Radar
                      key={m.uniqueKey}
                      name={m.displayName}
                      dataKey={m.displayName}
                      stroke={PALETTE[i]}
                      fill={PALETTE[i]}
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* stat cards (desktop/tablet only) */}
          <div className={`hidden sm:grid gap-6 ${selected.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {stats.map((s) => (
              <div key={s.uniqueKey} className="glass p-7">
                <CarPhoto
                  src={s.model.heroImage}
                  alt={s.displayName}
                  color={getBrand(s.model.brandId)?.color ?? "#666"}
                  className="w-full h-28 mb-4"
                />
                <h3 className="font-semibold text-lg mb-4">{s.displayName}</h3>
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

          {/* stat table (mobile only) */}
          <div className="block sm:hidden glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#161616]/10 bg-[#ECE7DF]/50">
                    <th className="p-3 text-xs font-mono uppercase tracking-widest text-[#161616]/50 font-bold">Spec</th>
                    {stats.map((s) => (
                      <th key={s.uniqueKey} className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <CarPhoto
                            src={s.model.heroImage}
                            alt={s.displayName}
                            color={getBrand(s.model.brandId)?.color ?? "#666"}
                            className="w-16 h-8 object-contain"
                          />
                          <span className="font-semibold text-xs text-primary">{s.displayName}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161616]/5">
                  <tr>
                    <td className="p-3 font-medium text-[#161616]/70 text-xs">Starts at</td>
                    {stats.map((s) => (
                      <td key={s.uniqueKey} className="p-3 text-center stat-num">
                        <Win on={s.price === winner.price}>{formatLakh(s.price)}</Win>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#161616]/70 text-xs">Max power</td>
                    {stats.map((s) => (
                      <td key={s.uniqueKey} className="p-3 text-center stat-num">
                        <Win on={s.ps === winner.ps}>{s.ps} PS</Win>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#161616]/70 text-xs">Best real FE</td>
                    {stats.map((s) => (
                      <td key={s.uniqueKey} className="p-3 text-center stat-num">
                        <Win on={s.fe === winner.fe}>~{s.fe.toFixed(1)} km/l</Win>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#161616]/70 text-xs">Best 0–100</td>
                    {stats.map((s) => (
                      <td key={s.uniqueKey} className="p-3 text-center stat-num">
                        <Win on={s.zeroTo100 === winner.zeroTo100}>{s.zeroTo100.toFixed(1)} s</Win>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#161616]/70 text-xs">NCAP adult</td>
                    {stats.map((s) => (
                      <td key={s.uniqueKey} className="p-3 text-center stat-num">
                        <Win on={s.ncap === winner.ncap}>{s.ncap || "—"}★</Win>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[#161616]/70 text-xs">5-yr cost ~</td>
                    {stats.map((s) => (
                      <td key={s.uniqueKey} className="p-3 text-center stat-num">
                        <Win on={s.cost5yr === winner.cost5yr}>{formatLakh(s.cost5yr)}</Win>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* pros & cons */}
          <div className={`grid gap-6 grid-cols-1 ${selected.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {selected.map((m) => (
              <div key={m.uniqueKey} className="glass p-7 text-sm">
                <h3 className="font-semibold mb-3">{m.displayName}</h3>
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
          <div className={`grid gap-6 grid-cols-1 ${selected.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {selected.map((m, i) => (
              <div key={m.uniqueKey} className="glass p-7">
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
