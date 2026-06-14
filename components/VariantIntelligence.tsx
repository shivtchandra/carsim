"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import insights from "@/data/upgrade-insights.json";
import { formatLakh } from "@/lib/data";
import { onRoadEstimate } from "@/lib/cost";
import {
  computeDimensionBlueprint,
  getDimensionExplanations,
  type BodyDimensionKey,
} from "@/lib/dimensionInsights";
import { diffVariants, valueScore, verdictFor, VERDICT_COPY } from "@/lib/scores";
import type { Feature, Model, Variant } from "@/lib/types";
import UnderstandingPanel, { type UnderstandingTarget } from "./understanding/UnderstandingPanel";

const CAR_SILHOUETTE =
  "M 30,130 L 40,110 C 45,95 55,92 75,92 L 105,92 C 115,92 125,75 140,55 C 155,35 175,32 245,32 L 295,32 C 305,32 315,50 320,68 C 325,86 335,92 345,92 L 355,92 C 362,92 368,98 368,110 L 365,130 Z";

function DimensionBlueprint({
  model,
  selectedSpec,
  onSelect,
}: {
  model: Model;
  selectedSpec: BodyDimensionKey;
  onSelect: (spec: BodyDimensionKey) => void;
}) {
  const { lengthMm, widthMm, heightMm, wheelbaseMm } = model.dimensions;
  const bp = useMemo(
    () =>
      computeDimensionBlueprint(
        { lengthMm, widthMm, heightMm, wheelbaseMm },
        model.bodyStyle
      ),
    [lengthMm, widthMm, heightMm, wheelbaseMm, model.bodyStyle]
  );
  const dims = { lengthMm, widthMm, heightMm, wheelbaseMm };
  const scaleY = (bp.groundY - bp.roofY) / 98;
  const accent = (key: BodyDimensionKey) => (selectedSpec === key ? "#C74B32" : "rgba(22,22,22,0.45)");
  const accentSoft = (key: BodyDimensionKey) => (selectedSpec === key ? "#C74B32" : "rgba(22,22,22,0.6)");

  return (
    <svg viewBox="0 0 380 160" className="w-full h-auto stroke-[#161616] fill-none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1={bp.groundY} x2="370" y2={bp.groundY} strokeDasharray="2 4" stroke="rgba(22, 22, 22, 0.2)" />

      <g transform={`translate(${bp.carLeft - 30 * bp.lengthScale}, ${bp.roofY - 32 * scaleY}) scale(${bp.lengthScale}, ${scaleY})`}>
        <path d={CAR_SILHOUETTE} stroke="rgba(22, 22, 22, 0.15)" strokeWidth="1.5" />
      </g>

      <circle cx={bp.frontHubX} cy={bp.hubY} r="22" stroke="rgba(22,22,22,0.08)" strokeWidth="0.75" />
      <circle cx={bp.rearHubX} cy={bp.hubY} r="22" stroke="rgba(22,22,22,0.08)" strokeWidth="0.75" />

      <circle
        cx={bp.frontHubX}
        cy={bp.hubY}
        r="15"
        fill={selectedSpec === "wheelbase" ? "rgba(199,75,50,0.1)" : "none"}
        stroke={selectedSpec === "wheelbase" ? "#C74B32" : "#161616"}
        strokeWidth="1"
      />
      <circle
        cx={bp.rearHubX}
        cy={bp.hubY}
        r="15"
        fill={selectedSpec === "wheelbase" ? "rgba(199,75,50,0.1)" : "none"}
        stroke={selectedSpec === "wheelbase" ? "#C74B32" : "#161616"}
        strokeWidth="1"
      />
      <circle cx={bp.frontHubX} cy={bp.hubY} r="2" fill="#161616" />
      <circle cx={bp.rearHubX} cy={bp.hubY} r="2" fill="#161616" />

      <g className="cursor-pointer" onClick={() => onSelect("wheelbase")}>
        <line x1={bp.frontHubX} y1={bp.hubY} x2={bp.rearHubX} y2={bp.hubY} stroke={accent("wheelbase")} strokeWidth={selectedSpec === "wheelbase" ? 1.5 : 1} />
        <path
          d={`M ${bp.frontHubX + 3},${bp.hubY - 3} L ${bp.frontHubX},${bp.hubY} L ${bp.frontHubX + 3},${bp.hubY + 3} M ${bp.rearHubX - 3},${bp.hubY - 3} L ${bp.rearHubX},${bp.hubY} L ${bp.rearHubX - 3},${bp.hubY + 3}`}
          stroke={accentSoft("wheelbase")}
        />
        <rect
          x={(bp.frontHubX + bp.rearHubX) / 2 - 48}
          y={bp.hubY - 11}
          width="96"
          height="15"
          rx="3"
          fill="#ECE7DF"
          stroke={selectedSpec === "wheelbase" ? "#C74B32" : "rgba(22,22,22,0.1)"}
        />
        <text
          x={(bp.frontHubX + bp.rearHubX) / 2}
          y={bp.hubY - 1}
          textAnchor="middle"
          fontSize="7"
          fill={selectedSpec === "wheelbase" ? "#C74B32" : "#161616"}
          fontWeight="bold"
          className="font-mono"
        >
          WHEELBASE {dims.wheelbaseMm}mm
        </text>
      </g>

      <g className="cursor-pointer" onClick={() => onSelect("height")}>
        <line x1={bp.carRight - 8} y1={bp.roofY} x2={bp.carRight - 8} y2={bp.groundY} stroke={accent("height")} strokeWidth={selectedSpec === "height" ? 1.5 : 1} />
        <path
          d={`M ${bp.carRight - 11},${bp.roofY + 3} L ${bp.carRight - 8},${bp.roofY} L ${bp.carRight - 5},${bp.roofY + 3} M ${bp.carRight - 11},${bp.groundY - 3} L ${bp.carRight - 8},${bp.groundY} L ${bp.carRight - 5},${bp.groundY - 3}`}
          stroke={accentSoft("height")}
        />
        <text
          x={bp.carRight + 2}
          y={(bp.roofY + bp.groundY) / 2}
          fontSize="6.5"
          fill={selectedSpec === "height" ? "#C74B32" : "#161616"}
          fontWeight="bold"
          className="font-mono"
          writingMode="vertical-rl"
          transform={`rotate(180 ${bp.carRight + 2} ${(bp.roofY + bp.groundY) / 2})`}
        >
          H: {dims.heightMm}mm
        </text>
      </g>

      <g className="cursor-pointer" onClick={() => onSelect("length")}>
        <line x1={bp.carLeft} y1={bp.groundY + 15} x2={bp.carRight} y2={bp.groundY + 15} stroke={accent("length")} strokeWidth={selectedSpec === "length" ? 1.5 : 1} />
        <path
          d={`M ${bp.carLeft + 3},${bp.groundY + 12} L ${bp.carLeft},${bp.groundY + 15} L ${bp.carLeft + 3},${bp.groundY + 18} M ${bp.carRight - 3},${bp.groundY + 12} L ${bp.carRight},${bp.groundY + 15} L ${bp.carRight - 3},${bp.groundY + 18}`}
          stroke={accentSoft("length")}
        />
        <rect
          x={(bp.carLeft + bp.carRight) / 2 - 48}
          y={bp.groundY + 7}
          width="96"
          height="15"
          rx="3"
          fill="#ECE7DF"
          stroke={selectedSpec === "length" ? "#C74B32" : "rgba(22,22,22,0.1)"}
        />
        <text
          x={(bp.carLeft + bp.carRight) / 2}
          y={bp.groundY + 17}
          textAnchor="middle"
          fontSize="7"
          fill={selectedSpec === "length" ? "#C74B32" : "#161616"}
          fontWeight="bold"
          className="font-mono"
        >
          LENGTH {dims.lengthMm}mm
        </text>
      </g>

      <g className="cursor-pointer" onClick={() => onSelect("width")}>
        <ellipse
          cx={bp.widthCenterX}
          cy={bp.widthCenterY}
          rx={bp.widthRx}
          ry="8"
          stroke={selectedSpec === "width" ? "#C74B32" : "rgba(22,22,22,0.2)"}
          strokeDasharray="2 2"
        />
        <line
          x1={bp.widthCenterX - bp.widthRx}
          y1={bp.widthCenterY}
          x2={bp.widthCenterX + bp.widthRx}
          y2={bp.widthCenterY}
          stroke={accent("width")}
          strokeWidth={selectedSpec === "width" ? 1.5 : 1}
        />
        <path
          d={`M ${bp.widthCenterX - bp.widthRx + 3},${bp.widthCenterY - 3} L ${bp.widthCenterX - bp.widthRx},${bp.widthCenterY} L ${bp.widthCenterX - bp.widthRx + 3},${bp.widthCenterY + 3} M ${bp.widthCenterX + bp.widthRx - 3},${bp.widthCenterY - 3} L ${bp.widthCenterX + bp.widthRx},${bp.widthCenterY} L ${bp.widthCenterX + bp.widthRx - 3},${bp.widthCenterY + 3}`}
          stroke={accentSoft("width")}
        />
        <text
          x={bp.widthCenterX}
          y={bp.widthCenterY - 6}
          textAnchor="middle"
          fontSize="6.5"
          fill={selectedSpec === "width" ? "#C74B32" : "#161616"}
          fontWeight="bold"
          className="font-mono"
        >
          WIDTH {dims.widthMm}mm
        </text>
      </g>
    </svg>
  );
}

function FeatureChip({ feature, onClick, tone }: { feature: Feature; onClick: () => void; tone: "gain" | "loss" }) {
  const big = feature.impactScore === 3;
  return (
    <button
      onClick={onClick}
      className={`rounded-full border transition-all duration-200 ${
        big ? "px-4 py-2 text-sm font-semibold" : "px-3 py-1.5 text-xs font-mono"
      } ${
        big && tone === "gain"
          ? "border-[#C74B32] bg-[#C74B32]/5 text-[#C74B32] hover:bg-[#C74B32]/10"
          : "border-[#161616]/10 bg-[#ECE7DF] text-[#161616] hover:bg-[#ECE7DF]/80"
      }`}
    >
      {feature.name}
    </button>
  );
}

export default function VariantIntelligence({ model, variants }: { model: Model; variants: Variant[] }) {
  const sorted = useMemo(
    () => [...variants].sort((a, b) => a.priceExShowroom - b.priceExShowroom),
    [variants]
  );
  const [fromId, setFromId] = useState(sorted[0]?.id);
  const [toId, setToId] = useState(sorted[Math.min(1, sorted.length - 1)]?.id);
  const [understandingTarget, setUnderstandingTarget] = useState<UnderstandingTarget | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<BodyDimensionKey>("wheelbase");

  const specExplanations = useMemo(() => getDimensionExplanations(model), [model]);

  const from = sorted.find((v) => v.id === fromId)!;
  const to = sorted.find((v) => v.id === toId)!;
  const { gained, lost, priceDelta } = diffVariants(from, to);
  const score = valueScore(gained, priceDelta);
  const verdict = verdictFor(score);
  const insight = (insights as { fromId: string; toId: string; insight: string }[]).find(
    (i) => i.fromId === from.id && i.toId === to.id
  );

  const pick = (id: string) => {
    if (id === fromId || id === toId) return;
    setToId(id);
  };

  const jargonTranslations = [
    {
      term: "ESC (Electronic Stability Control) & VSM",
      translation: "Emergency Anti-Skid. If the vehicle senses a loss of traction (like on wet mud or when swerving to avoid an obstacle), it automatically applies brakes to individual wheels to keep you on your steered path. Essential for safety.",
    },
    {
      term: "HAC (Hill-start Assist Control)",
      translation: "Roll-back Prevention. When starting the vehicle on a steep slope (like a flyover or basement mall ramp), it holds the brakes for 2 seconds after you release the pedal, giving you time to move your foot to the accelerator.",
    },
    {
      term: "6 SRS Airbags (Standard)",
      translation: "Full-Cabin Cushioning. Protects all occupants in case of an impact. Includes two front airbags, two seat-mounted side airbags, and two curtain airbags that shield front and rear passengers' heads from side window impacts.",
    },
    {
      term: "All-Wheel Disc Brakes",
      translation: "Consistent Stopping Power. Unlike drum brakes, disc brakes dissipate heat quickly, preventing brake fade. They stop the vehicle shorter, more predictably, and with far less foot pressure.",
    },
    {
      term: "Star Map LED DRLs & Headlamps",
      translation: "Advanced Night Vision. LEDs throw a much whiter, wider, and brighter beam than yellow halogens, reducing eye fatigue during night highway runs. Star Map running lights make you highly visible to oncoming traffic.",
    },
  ];

  return (
    <div className="space-y-12 text-[#161616]">
      {/* Variant Selector */}
      <div className="space-y-2">
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-none">
          {sorted.map((v) => {
            const role = v.id === fromId ? "from" : v.id === toId ? "to" : null;
            return (
              <button
                key={v.id}
                onClick={() => (role ? setFromId(v.id === fromId ? toId : v.id) : pick(v.id))}
                className={`shrink-0 px-5 py-4 text-left border rounded-2xl transition-all duration-200 bg-[#ECE7DF] ${
                  role === "to"
                    ? "border-[#C74B32] shadow-sm bg-[#ECE7DF]"
                    : role === "from"
                    ? "border-[#161616]/40"
                    : "border-[#161616]/10 hover:border-[#161616]/30"
                }`}
              >
                <p className="font-semibold text-sm whitespace-nowrap text-[#161616]">{v.name}</p>
                <p className="font-mono text-xs text-[#161616]/70 mt-1">
                  {formatLakh(v.priceExShowroom)} · {v.transmission}
                </p>
                <p className="font-mono text-[10px] text-[#161616]/50 mt-0.5 whitespace-nowrap">
                  ~{formatLakh(onRoadEstimate(v.priceExShowroom, v.fuel))} on-road
                </p>
                {role && (
                  <p className="text-[10px] font-mono uppercase tracking-widest mt-2 font-bold" style={{ color: role === "to" ? "#C74B32" : "#161616" }}>
                    {role === "from" ? "base trim" : "upgrade target"}
                  </p>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs font-mono text-[#161616]/60">
          Tap any variant to compare it against the base. Tap the base to reset.
        </p>
      </div>

      {/* Upgrade Card */}
      <motion.div
        key={`${from.id}-${to.id}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="border border-[#161616]/10 bg-[#ECE7DF] p-6 sm:p-8 rounded-3xl relative"
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <div>
            <p className="text-sm font-mono text-[#161616]/60">
              Comparing: {from.name} → {to.name}
            </p>
            <p className="font-display text-5xl font-bold mt-1 text-[#161616]">
              {priceDelta >= 0 ? "+" : "−"}
              {formatLakh(Math.abs(priceDelta))}
            </p>
          </div>
          <div
            className="px-4 py-2 rounded-full text-xs font-mono font-bold border"
            style={{
              color: "#C74B32",
              borderColor: "rgba(199, 75, 50, 0.3)",
              background: "rgba(199, 75, 50, 0.05)",
            }}
          >
            {VERDICT_COPY[verdict].label}
            {Number.isFinite(score) && (
              <span className="font-mono ml-2 opacity-80">Score: {score.toFixed(1)}</span>
            )}
          </div>
        </div>

        {gained.length > 0 && (
          <div className="mt-7">
            <p className="text-xs font-mono uppercase tracking-widest text-[#161616]/60 mb-3">Gained Features:</p>
            <div className="flex flex-wrap gap-2">
              {[...gained]
                .sort((a, b) => b.impactScore - a.impactScore)
                .map((f) => (
                  <FeatureChip key={f.id} feature={f} tone="gain" onClick={() => setUnderstandingTarget({ type: "feature", feature: f })} />
                ))}
            </div>
          </div>
        )}

        {lost.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-mono uppercase tracking-widest text-[#161616]/60 mb-3">Lost Features:</p>
            <div className="flex flex-wrap gap-2">
              {lost.map((f) => (
                <FeatureChip key={f.id} feature={f} tone="loss" onClick={() => setUnderstandingTarget({ type: "feature", feature: f })} />
              ))}
            </div>
          </div>
        )}

        {gained.length === 0 && lost.length === 0 && (
          <p className="mt-6 text-sm text-[#161616]/60">
            Same equipment list — this step is powertrain/transmission only.
          </p>
        )}

        {insight && (
          <p className="mt-7 text-sm leading-relaxed border-l-2 pl-4 border-[#C74B32] text-[#161616]/80 font-sans">
            {insight.insight}
          </p>
        )}
      </motion.div>

      {/* Interactive dimensions — car-specific */}
      <div className="grid md:grid-cols-2 gap-8 items-center border-t border-[#161616]/10 pt-10">
        <div className="space-y-6">
          <div>
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#C74B32] uppercase font-bold">Interactive Dimensions</span>
            <h3 className="font-display text-3xl text-[#161616] mt-1">Scale & Road Footprint</h3>
            <p className="text-xs text-[#161616]/60 mt-2">
              {model.name} blueprint — tap any metric to see how it compares in the {model.segment.replace(/-/g, " ")} class.
            </p>
          </div>

          <div className="p-6 border border-[#161616]/10 bg-[#ECE7DF] rounded-3xl relative overflow-hidden flex flex-col justify-center min-h-[260px]">
            <DimensionBlueprint model={model} selectedSpec={selectedSpec} onSelect={setSelectedSpec} />
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            key={selectedSpec}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 border border-[#161616]/10 bg-[#ECE7DF] rounded-3xl space-y-3 min-h-[160px]"
          >
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#C74B32] font-bold">
              {specExplanations[selectedSpec].name}
            </h4>
            <p className="text-sm leading-relaxed text-[#161616]/80 font-sans">
              {specExplanations[selectedSpec].detail}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {(["wheelbase", "length", "width", "height"] as const).map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpec(spec)}
                className={`py-3.5 px-4 text-left rounded-xl border text-xs font-mono transition-all duration-200 uppercase tracking-wider ${
                  selectedSpec === spec
                    ? "border-[#C74B32] bg-[#C74B32]/5 text-[#C74B32] font-bold"
                    : "border-[#161616]/5 bg-[#F4F0E8] text-[#161616] hover:border-[#161616]/20"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jargon-free Feature Explainer Grid */}
      <div className="border-t border-[#161616]/10 pt-10 space-y-6">
        <div>
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#C74B32] uppercase font-bold">Automobile Literacy</span>
          <h3 className="font-display text-3xl text-[#161616] mt-1">Jargon-Free Safety & Tech</h3>
          <p className="text-xs text-[#161616]/60 mt-2">What all those complex brochure codes actually mean in plain, practical terms.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jargonTranslations.map((item, idx) => (
            <div key={idx} className="p-5 border border-[#161616]/5 bg-[#ECE7DF] rounded-2xl space-y-2.5">
              <h4 className="font-mono text-xs text-[#C74B32] font-bold uppercase tracking-wide">{item.term}</h4>
              <p className="text-xs leading-relaxed text-[#161616]/75 font-sans">{item.translation}</p>
            </div>
          ))}
        </div>
      </div>

      <UnderstandingPanel target={understandingTarget} onClose={() => setUnderstandingTarget(null)} />
    </div>
  );
}
