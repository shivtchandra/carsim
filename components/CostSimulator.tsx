"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { costParams, formatLakh, getModel, getVariant } from "@/lib/data";
import { computeCost } from "@/lib/cost";
import EstimatedBadge from "./EstimatedBadge";
import VariantSelect from "./sims/VariantSelect";
import DriveSelect from "@/components/ui/DriveSelect";
import { TrendingDown, Wrench, Disc } from "lucide-react";

const SERIES = [
  { key: "fuel", label: "Fuel", color: "#E8590C" },
  { key: "insurance", label: "Insurance", color: "#60A5FA" },
  { key: "maintenance", label: "Maintenance", color: "#4ADE80" },
  { key: "tyres", label: "Tyres", color: "#FBBF24" },
  { key: "depreciation", label: "Depreciation", color: "#A1A1AA" },
] as const;

function label(variantId: string) {
  const v = getVariant(variantId);
  const m = v && getModel(v.modelId);
  return v && m ? `${m.name} ${v.name}` : variantId;
}

export default function CostSimulator({ initialVariants = [] }: { initialVariants?: string[] }) {
  const [idA, setIdA] = useState(initialVariants[0] ?? "creta-sx-mt");
  const [idB, setIdB] = useState(initialVariants[1] ?? "");
  const [cityId, setCityId] = useState("hyderabad");
  const [kmPerYear, setKmPerYear] = useState(12000);
  const [years, setYears] = useState(5);
  const [activeJargonTab, setActiveJargonTab] = useState<"depreciation" | "maintenance" | "tyres">("depreciation");

  const city = costParams.cities.find((c) => c.id === cityId)!;
  const a = computeCost(idA, city, kmPerYear, years);
  const b = idB ? computeCost(idB, city, kmPerYear, years) : null;

  const chartData =
    a?.years.map((y) => {
      const row: Record<string, number | string> = { name: `Yr ${y.year}` };
      for (const s of SERIES) row[s.label] = Math.round(y[s.key]);
      return row;
    }) ?? [];

  const delta = a && b ? a.total - b.total : null;

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="glass p-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <VariantSelect label="Variant" value={idA} onChange={setIdA} />
        <VariantSelect label="Compare against (optional)" value={idB} allowNone onChange={setIdB} />
        <label className="block text-sm">
          <span className="mb-1.5 block text-secondary text-xs">City</span>
          <DriveSelect
            value={cityId}
            onChange={setCityId}
            ariaLabel="City"
            options={costParams.cities.map((c) => ({
              value: c.id,
              label: `${c.name} · ₹${c.petrolPrice.toFixed(0)}/l`
            }))}
            className="w-full"
          />
        </label>
        <label className="block text-sm">
          <span className="text-secondary text-xs">
            Driving: <span className="stat-num text-primary">{(kmPerYear / 1000).toFixed(0)}k km/yr</span>
          </span>
          <input
            type="range" min={5000} max={30000} step={1000} value={kmPerYear}
            onChange={(e) => setKmPerYear(Number(e.target.value))}
            className="w-full mt-3 accent-[#E8590C]"
          />
        </label>
        <label className="block text-sm">
          <span className="text-secondary text-xs">
            Ownership: <span className="stat-num text-primary">{years} years</span>
          </span>
          <input
            type="range" min={3} max={8} step={1} value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full mt-3 accent-[#E8590C]"
          />
        </label>
      </div>

      {/* Hero numbers */}
      {a && (
        <div className="grid gap-6 sm:grid-cols-2">
          {[{ id: idA, r: a }, ...(b ? [{ id: idB, r: b }] : [])].map(({ id, r }) => (
            <div key={id} className="glass p-8">
              <p className="text-sm text-secondary">{label(id)} · {city.name} · {years} yrs</p>
              <p className="stat-num text-5xl font-semibold mt-2">₹{r.costPerKm.toFixed(1)}<span className="text-xl text-secondary">/km</span></p>
              <p className="stat-num text-secondary mt-2">
                {formatLakh(r.total)} total <EstimatedBadge tooltip="Modeled from city fuel price, brand maintenance and resale-retention tables in cost-params.json." />
              </p>
              <ul className="mt-5 space-y-1.5 text-sm text-secondary">
                <li>Fuel {formatLakh(r.totalFuel)} · Insurance {formatLakh(r.totalInsurance)}</li>
                <li>Maintenance {formatLakh(r.totalMaintenance)} · Tyres {formatLakh(r.totalTyres)}</li>
                <li>Depreciation {formatLakh(r.totalDepreciation)}</li>
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Compare delta */}
      {delta !== null && Math.abs(delta) > 1000 && (
        <p className="text-base leading-relaxed border-l-2 pl-4 text-primary" style={{ borderColor: "var(--accent)" }}>
          The <span className="font-medium text-primary">{label(delta > 0 ? idB : idA)}</span> costs{" "}
          <span className="stat-num font-bold text-primary">{formatLakh(Math.abs(delta))}</span> less over {years} years
          {(() => {
            const cheaperId = delta > 0 ? idB : idA;
            const dearerUpfront =
              (getVariant(cheaperId)?.priceExShowroom ?? 0) >
              (getVariant(cheaperId === idA ? idB : idA)?.priceExShowroom ?? 0);
            return dearerUpfront ? " despite the higher purchase price" : "";
          })()}
          . <EstimatedBadge />
        </p>
      )}

      {/* Stacked yearly breakdown */}
      {a && (
        <div className="glass p-6">
          <h3 className="text-sm text-secondary mb-4">
            Yearly breakdown — {label(idA)} <EstimatedBadge />
          </h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#A1A1AA" fontSize={12} tickLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} tickFormatter={(v: number) => `${(v / 100000).toFixed(1)}L`} />
                <Tooltip
                  formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
                  contentStyle={{ background: "#F4F0E8", border: "1px solid rgba(22, 22, 22, 0.1)", borderRadius: 12 }}
                  labelStyle={{ color: "#161616" }}
                  itemStyle={{ color: "#161616" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {SERIES.map((s) => (
                  <Bar key={s.key} dataKey={s.label} stackId="a" fill={s.color} radius={s.key === "depreciation" ? [4, 4, 0, 0] : 0} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Jargon Decoupler Widget */}
      <div className="glass p-6 bg-[#161616]/2 border-[#161616]/10 rounded-2xl mt-8">
        <h4 className="text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-4 font-bold">
          Jargon Decoupler // Click to translate the math
        </h4>
        <div className="flex gap-1.5 border-b border-[#161616]/10 pb-3 mb-4 overflow-x-auto">
          {[
            { key: "depreciation", label: "Depreciation", icon: <TrendingDown className="h-3.5 w-3.5" /> },
            { key: "maintenance", label: "Maintenance", icon: <Wrench className="h-3.5 w-3.5" /> },
            { key: "tyres", label: "Tyres", icon: <Disc className="h-3.5 w-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveJargonTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all duration-150 cursor-pointer ${
                activeJargonTab === tab.key
                  ? "bg-[#C84C31] text-[#F5F1E8] shadow-sm"
                  : "text-secondary hover:bg-[#161616]/5"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="text-xs leading-relaxed text-secondary space-y-3">
          {activeJargonTab === "depreciation" && (
            <>
              <p className="text-primary font-semibold text-sm flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4" /> Depreciation: The &quot;Newness Tax&quot;
              </p>
              <p>
                <strong>The Analogy:</strong> Think of buying a car like buying fresh bananas. The second you walk out of the grocery store, they start ripening. If you try to sell them 3 years later, nobody pays full price.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mt-3 pt-3 border-t border-[#161616]/5">
                <div>
                  <span className="font-semibold text-primary block mb-0.5">Toyota &amp; Maruti</span>
                  Bananas that stay yellow longer (retain up to 60%+ value after 5 years).
                </div>
                <div>
                  <span className="font-semibold text-primary block mb-0.5">German Luxury</span>
                  Organic avocados—they turn brown almost instantly (value drops fast, retaining &lt;44%).
                </div>
                <div>
                  <span className="font-semibold text-primary block mb-0.5">Electric Vehicles (EVs)</span>
                  Like last year&apos;s iPad. Value depends on battery health, so buyers depreciate them fast fearing future battery replacement costs.
                </div>
              </div>
            </>
          )}
          {activeJargonTab === "maintenance" && (
            <>
              <p className="text-primary font-semibold text-sm flex items-center gap-1.5">
                <Wrench className="h-4 w-4" /> Maintenance: Gym Membership for Cars
              </p>
              <p>
                <strong>The Analogy:</strong> Keeping a car running is like staying fit. Some cars keep fit on simple home-cooked meals, while others need premium imported health shakes.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#161616]/5">
                <div>
                  <span className="font-semibold text-primary block mb-0.5">Japanese &amp; Korean Brands</span>
                  Eating healthy at home. Cheap, simple, standard parts available at every street corner.
                </div>
                <div>
                  <span className="font-semibold text-primary block mb-0.5">European Brands</span>
                  Specialized personal trainers. You pay premium specialist rates and wait for imported ingredients.
                </div>
              </div>
            </>
          )}
          {activeJargonTab === "tyres" && (
            <>
              <p className="text-primary font-semibold text-sm flex items-center gap-1.5">
                <Disc className="h-4 w-4" /> Tyres: Designer Sneakers vs Running Shoes
              </p>
              <p>
                <strong>The Analogy:</strong> Tyres are literally your car&apos;s shoes. High fashion looks cool, but everyday beaters save your wallet.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#161616]/5">
                <div>
                  <span className="font-semibold text-primary block mb-0.5">Top Trims (17&quot; / 18&quot; Alloys)</span>
                  Designer Yeezys. They look aggressive and sporty, but replacing them when they wear out will break your wallet.
                </div>
                <div>
                  <span className="font-semibold text-primary block mb-0.5">Lower Trims (15&quot; / 16&quot; Wheels)</span>
                  Comfortable daily trainers. Cheap, durable, easily replaceable, and ride softer.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
