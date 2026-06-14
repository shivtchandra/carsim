"use client";

import { useEffect, useRef, useState } from "react";
import { Spline, RotateCcw, AlertTriangle } from "lucide-react";
import { getBrand, getModel, getTestData, getVariant } from "@/lib/data";
import { cornerSpeedCapKmh } from "@/lib/race/grip";
import VariantSelect from "./VariantSelect";

type Surface = "dry" | "wet" | "mud";

const CORNERS = [
  { id: "hairpin", label: "Hairpin", radiusM: 12, rPx: 92 },
  { id: "tight", label: "Tight bend", radiusM: 28, rPx: 132 },
  { id: "sweeper", label: "Fast sweeper", radiusM: 70, rPx: 190 },
] as const;

type CornerId = (typeof CORNERS)[number]["id"];

const SURFACES: { id: Surface; label: string; base: number }[] = [
  { id: "dry", label: "Dry tarmac", base: 0.95 },
  { id: "wet", label: "Wet road", base: 0.72 },
  { id: "mud", label: "Mud / loose", base: 0.55 },
];

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

/** Lateral grip: same shape as lib/race/grip muFor, with an added wet surface. */
function muFor3(base: number, kerbWeight: number, t100: number) {
  const weightPenalty = clamp((kerbWeight - 1200) / 1600, 0, 0.25);
  const sportBonus = t100 < 9 ? 0.06 : 0;
  return Math.max(0.3, base - weightPenalty + sportBonus);
}

export default function CorneringLab({ initialVariant }: { initialVariant?: string }) {
  const [id, setId] = useState(initialVariant ?? "creta-sx-o-turbo-dct");
  const [cornerId, setCornerId] = useState<CornerId>("tight");
  const [surface, setSurface] = useState<Surface>("dry");
  const [entrySpeed, setEntrySpeed] = useState(55);
  const [state, setState] = useState<"idle" | "running" | "finished">("idle");
  const [anim, setAnim] = useState({ p: 0, wide: 0, spun: false });
  const raf = useRef({ t: 0, last: 0, id: 0 });

  const v = getVariant(id);
  const m = v && getModel(v.modelId);
  const td = v && getTestData(v.id);
  const kerbWeight = v?.kerbWeight ?? 1300;
  const t100 = td?.zeroTo100.value ?? 11;
  const color = m ? getBrand(m.brandId)?.color ?? "#C84C31" : "#C84C31";

  const corner = CORNERS.find((c) => c.id === cornerId)!;
  const surf = SURFACES.find((s) => s.id === surface)!;
  const mu = muFor3(surf.base, kerbWeight, t100);
  const maxSpeed = cornerSpeedCapKmh(1 / corner.radiusM, mu); // = sqrt(mu·g·r)·3.6
  const ratio = entrySpeed / maxSpeed;
  const latG = (entrySpeed / 3.6) ** 2 / corner.radiusM / 9.81;

  const verdict =
    ratio <= 1.0
      ? { tone: "good", title: "Holds the line", note: "Tyres have grip to spare — the car tracks the apex cleanly." }
      : ratio <= 1.15
      ? { tone: "warn", title: "Understeers wide", note: "Front tyres saturate; the nose washes out and you run toward the outer edge." }
      : { tone: "bad", title: "Grip lost — runs off", note: "Demand far exceeds grip. The car ploughs straight on and leaves the road." };

  const run = () => {
    setState("running");
    raf.current = { t: 0, last: performance.now(), id: 0 };
    const overshoot = Math.max(0, ratio - 1);
    const loop = (now: number) => {
      const dt = (now - raf.current.last) / 1000;
      raf.current.last = now;
      raf.current.t += dt;
      const duration = 3.6;
      const p = Math.min(raf.current.t / duration, 1);
      // Understeer grows through the corner, peaking near the apex (p≈0.5).
      const apex = 1 - Math.abs(p - 0.55) / 0.55;
      const wide = clamp(overshoot * 2.4, 0, 2.2) * Math.max(0, apex);
      const spun = overshoot > 0.15 && p > 0.5;
      setAnim({ p, wide, spun });
      if (p >= 1) {
        setState("finished");
        return;
      }
      raf.current.id = requestAnimationFrame(loop);
    };
    raf.current.id = requestAnimationFrame(loop);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current.id), []);
  useEffect(() => setState("idle"), [id, cornerId, surface, entrySpeed]);

  // ── SVG geometry: a top-down right-hander. Car sweeps the bottom-left quarter. ──
  const cx = 430;
  const cy = 70;
  const R = corner.rPx;
  const roadHalf = 24;
  const angAt = (p: number) => Math.PI - (Math.PI / 2) * p; // 180°→90°
  const ptAt = (p: number, radius: number) => {
    const a = angAt(p);
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  };
  const arcPath = (radius: number) => {
    const s = ptAt(0, radius);
    const e = ptAt(1, radius);
    return `M ${s.x},${s.y} A ${radius} ${radius} 0 0 1 ${e.x},${e.y}`;
  };
  const carRadius = R + anim.wide * roadHalf;
  const carPos = ptAt(anim.p, carRadius);
  const carAng = (angAt(anim.p) * 180) / Math.PI - 90 + (anim.spun ? anim.p * 220 : 0);
  const entryPt = ptAt(0, R);
  const exitPt = ptAt(1, R);

  return (
    <div className="glass p-6 rounded-[32px] overflow-hidden">
      {/* Configurator */}
      <div className="grid gap-4 md:grid-cols-4 items-end mb-5">
        <VariantSelect label="Your Vehicle" value={id} onChange={setId} />

        <div className="text-sm">
          <span className="text-secondary text-xs block mb-1.5">Corner type</span>
          <div className="flex rounded-xl border border-[#161616]/12 overflow-hidden">
            {CORNERS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCornerId(c.id)}
                className={`flex-1 px-2 py-2 text-xs transition-colors ${
                  cornerId === c.id ? "bg-[rgba(200,76,49,0.12)] text-primary font-semibold" : "text-secondary hover:text-primary"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm">
          <span className="text-secondary text-xs block mb-1.5">Surface</span>
          <div className="flex rounded-xl border border-[#161616]/12 overflow-hidden">
            {SURFACES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSurface(s.id)}
                className={`flex-1 px-2 py-2 text-xs transition-colors ${
                  surface === s.id ? "bg-[rgba(200,76,49,0.12)] text-primary font-semibold" : "text-secondary hover:text-primary"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-sm">
          <span className="text-secondary text-xs flex justify-between mb-1">
            <span>Entry speed</span>
            <span className="text-primary font-mono">{entrySpeed} km/h</span>
          </span>
          <input
            type="range"
            min={20}
            max={140}
            step={5}
            value={entrySpeed}
            onChange={(e) => setEntrySpeed(Number(e.target.value))}
            className="w-full accent-[#C84C31]"
          />
        </label>
      </div>

      {/* Viewport */}
      <div className="relative w-full aspect-[22/8] bg-[#0A0710] rounded-2xl overflow-hidden border border-white/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#15101e] to-[#0A0710]" />
        <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full">
          {/* Entry + exit straights */}
          <line x1={40} y1={cy} x2={entryPt.x} y2={entryPt.y} stroke="rgba(255,255,255,0.08)" strokeWidth={roadHalf * 2} strokeLinecap="round" />
          <line x1={exitPt.x} y1={exitPt.y} x2={exitPt.x} y2={190} stroke="rgba(255,255,255,0.08)" strokeWidth={roadHalf * 2} strokeLinecap="round" />
          {/* Road band */}
          <path d={arcPath(R)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={roadHalf * 2} />
          {/* Edges */}
          <path d={arcPath(R + roadHalf)} fill="none" stroke="rgba(79,107,138,0.5)" strokeWidth={1.5} />
          <path d={arcPath(R - roadHalf)} fill="none" stroke="rgba(79,107,138,0.5)" strokeWidth={1.5} />
          {/* Ideal line */}
          <path d={arcPath(R)} fill="none" stroke="rgba(200,76,49,0.35)" strokeWidth={1.5} strokeDasharray="5 6" />

          {/* Apex marker */}
          {(() => {
            const apexPt = ptAt(0.5, R - roadHalf);
            return <circle cx={apexPt.x} cy={apexPt.y} r={4} fill="#C84C31" />;
          })()}

          {/* Car */}
          <g transform={`translate(${carPos.x}, ${carPos.y}) rotate(${carAng})`}>
            <rect x={-7} y={-14} width={14} height={28} rx={4} fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
            <rect x={-5} y={-9} width={10} height={8} rx={2} fill="rgba(0,0,0,0.35)" />
          </g>

          {/* Skid hint when sliding */}
          {state !== "idle" && anim.wide > 0.3 && (
            <text x={carPos.x + 14} y={carPos.y} fill="#d97706" fontSize={8} fontFamily="monospace">~ wide</text>
          )}
        </svg>

        {/* Live readout */}
        <div className="absolute top-3 left-3 bg-black/55 rounded-xl border border-white/[0.08] px-3 py-2 backdrop-blur-sm pointer-events-none">
          <div className="flex gap-4 text-[10px] font-mono text-[#9CA3AF]">
            <div>
              <span className="block">MAX SAFE</span>
              <span className="text-sm font-bold text-white">{maxSpeed.toFixed(0)} km/h</span>
            </div>
            <div>
              <span className="block">YOUR ENTRY</span>
              <span className={`text-sm font-bold ${ratio > 1 ? "text-[#d97706]" : "text-white"}`}>{entrySpeed} km/h</span>
            </div>
            <div>
              <span className="block">LATERAL G</span>
              <span className="text-sm font-bold text-white">{latG.toFixed(2)}g</span>
            </div>
          </div>
        </div>

        {state === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1.5px] z-10">
            <p className="text-secondary font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Spline className="w-3.5 h-3.5" /> Cornering Grip Analyzer
            </p>
            <h3 className="text-lg font-bold tracking-tight text-white mb-5 uppercase text-center px-4">
              {corner.label} · r {corner.radiusM} m · {surf.label}
            </h3>
            <button
              onClick={run}
              className="px-10 py-4 bg-accent text-white font-bold text-base rounded-xl hover:scale-105 transition-transform duration-200"
            >
              TAKE THE CORNER
            </button>
          </div>
        )}
      </div>

      {/* Verdict + insight */}
      {state === "finished" && (
        <div className="grid md:grid-cols-12 gap-6 mt-6">
          <div className="md:col-span-5 space-y-4">
            <div
              className={`glass p-5 rounded-2xl border ${
                verdict.tone === "good"
                  ? "border-[#2d6a4f]/40"
                  : verdict.tone === "warn"
                  ? "border-[#d97706]/40"
                  : "border-[#C84C31]/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {verdict.tone !== "good" && <AlertTriangle className="w-4 h-4 text-[#d97706]" />}
                <h4
                  className={`text-base font-bold ${
                    verdict.tone === "good" ? "text-[#2d6a4f]" : verdict.tone === "warn" ? "text-[#d97706]" : "text-[#C84C31]"
                  }`}
                >
                  {verdict.title}
                </h4>
              </div>
              <p className="text-xs text-secondary leading-relaxed">{verdict.note}</p>
              <div className="grid grid-cols-3 gap-3 mt-4 text-xs font-mono">
                <div>
                  <span className="text-[#9CA3AF] block">GRIP µ</span>
                  <span className="font-bold text-primary">{mu.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">OVER LIMIT</span>
                  <span className="font-bold text-primary">{ratio > 1 ? `+${((ratio - 1) * 100).toFixed(0)}%` : "0%"}</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">KERB WT</span>
                  <span className="font-bold text-primary">{kerbWeight} kg</span>
                </div>
              </div>
            </div>
            <button
              onClick={run}
              className="w-full py-3 border border-black/10 hover:bg-black/5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors text-primary flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-run corner
            </button>
          </div>

          <div className="md:col-span-7 glass border border-[var(--accent)]/30 p-5 rounded-2xl">
            <span className="text-[9px] font-mono tracking-widest text-[var(--accent)] uppercase">AI HANDLING LAB ADVICE</span>
            <h4 className="text-base font-semibold mt-1 mb-3 text-primary">Why it behaves this way</h4>
            <p className="text-xs text-secondary leading-relaxed mb-3">
              <span className="text-[var(--accent)] font-semibold">PHYSICS: </span>
              A corner of radius {corner.radiusM} m on {surf.label.toLowerCase()} can be taken at up to{" "}
              <strong>{maxSpeed.toFixed(0)} km/h</strong> before the {kerbWeight} kg {m?.name} runs out of grip (µ ≈ {mu.toFixed(2)}).
              At {entrySpeed} km/h you&apos;re asking for <strong>{latG.toFixed(2)}g</strong> of lateral grip.
            </p>
            <p className="text-xs text-secondary leading-relaxed">
              <span className="text-[var(--accent)] font-semibold">BUYING IMPACT: </span>
              {surface === "dry"
                ? "Heavier cars and softer SUV tyres saturate earlier — lighter, sportier setups hold tighter lines. "
                : "Low-grip surfaces slash safe corner speed dramatically; ADAS like ESC and a stiffer setup matter most here. "}
              Slow into the bend and the same car corners with composure — speed, not the car, is usually the limit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
