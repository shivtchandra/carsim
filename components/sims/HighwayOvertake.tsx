"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, Gauge } from "lucide-react";
import { getBrand, getModel, getTestData, getVariant, formatLakh } from "@/lib/data";
import { KMH_TO_MS, REL_DIST_M, relDistanceAt, overtakeDuration, overtakeDistance, overtakeVerdict } from "@/lib/sim";
import EstimatedBadge from "@/components/EstimatedBadge";
import VariantSelect from "./VariantSelect";
import { CAR_IMAGE_MAP } from "@/lib/carImageMap";
import { SCENE_COLORS } from "@/components/understanding/scenes/shared/sceneTokens";

const VERDICT_COLOR: Record<string, string> = {
  comfortable: "#2d6a4f", // Positive Green
  "needs planning": "#d97706", // Amber
  "avoid on two-lane roads": "#C84C31", // Vermillion
};

export default function HighwayOvertake({ initialVariant }: { initialVariant?: string }) {
  const [id, setId] = useState(initialVariant ?? "creta-sx-o-turbo-dct");
  const [targetSpeed, setTargetSpeed] = useState<"60-100" | "80-120">("60-100");
  const [state, setState] = useState<"idle" | "running" | "finished">("idle");
  const [slowMo, setSlowMo] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  const stateRef = useRef({ t: 0, last: 0, raf: 0 });
  const slowMoRef = useRef(false);
  slowMoRef.current = slowMo;

  const v = getVariant(id);
  const m = v && getModel(v.modelId);
  const td = v && getTestData(v.id);
  
  // Overtake duration and distance maths
  const t60100 = td?.sixtyTo100.value ?? 6.0;
  const kickdownTime = targetSpeed === "60-100" ? t60100 : t60100 * 1.35; // 80-120 takes slightly longer
  const duration = overtakeDuration(kickdownTime);
  const distance = overtakeDistance(kickdownTime);
  const verdict = overtakeVerdict(duration);

  // Pre-load image
  useEffect(() => {
    if (!m) return;
    const url = CAR_IMAGE_MAP[m.id];
    if (url) {
      setLoadedImage(null);
      const img = new Image();
      img.src = url;
      img.onload = () => setLoadedImage(img);
      img.onerror = () => setLoadedImage(null);
    } else {
      setLoadedImage(null);
    }
  }, [id, m]);

  const [simState, setSimState] = useState({
    carX: 80,
    carY: 130,
    carSpeed: 60,
    relDist: 0,
    truckX: 300,
  });

  const runOvertake = () => {
    setState("running");
    setElapsedTime(0);
    stateRef.current = { t: 0, last: performance.now(), raf: 0 };
    
    const startSpeed = targetSpeed === "60-100" ? 60 : 80;
    const speedDelta = 40; // accelerating by 40 km/h (either 60->100 or 80->120)

    const loop = (now: number) => {
      const dt = ((now - stateRef.current.last) / 1000) * (slowMoRef.current ? 0.25 : 1);
      stateRef.current.last = now;
      stateRef.current.t += dt;
      const t = stateRef.current.t;
      setElapsedTime(t);

      // relative distance covered (0 to 50m)
      const rel = Math.min(relDistanceAt(t, kickdownTime), REL_DIST_M);
      
      // canvas dimensions: truck fixed at centre-right (x = 340)
      const truckX = 350;
      const pxPerM = 3.5; // pixel scaling
      
      // relative car position
      const carX = truckX - REL_DIST_M * 0.52 * pxPerM + rel * pxPerM;
      
      // lane change path ease
      const phase = rel / REL_DIST_M;
      const slowLaneY = 135;
      const fastLaneY = 75;
      
      // Sinusoidal lane change path
      let carY = slowLaneY;
      if (phase > 0.05 && phase < 0.95) {
        carY = slowLaneY - (slowLaneY - fastLaneY) * Math.min(1, Math.abs(Math.sin((phase - 0.05) / 0.9 * Math.PI)) * 1.5);
      }
      
      const tc = Math.min(t, duration);
      const currentSpeed = startSpeed + Math.min(speedDelta, speedDelta * Math.pow(Math.min(tc / kickdownTime, 1), 0.8));

      setSimState({
        carX,
        carY,
        carSpeed: currentSpeed,
        relDist: rel,
        truckX,
      });

      if (t >= duration + 0.5) {
        setState("finished");
        cancelAnimationFrame(stateRef.current.raf);
        return;
      }

      stateRef.current.raf = requestAnimationFrame(loop);
    };

    stateRef.current.raf = requestAnimationFrame(loop);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(stateRef.current.raf);
  }, []);

  // AI Explanation calculations
  const aiExplanation = () => {
    if (!v || !m) return null;
    let interpretation = "";
    let buyingAdvice = "";

    if (targetSpeed === "60-100") {
      interpretation = `At a 60–100 km/h kickdown time of ${kickdownTime.toFixed(1)}s, the ${m.name} completes the overtake in ${duration.toFixed(1)}s, consuming ${distance.toFixed(0)}m of road.`;
      
      if (verdict === "comfortable") {
        buyingAdvice = `This variant delivers robust kickdown performance. Dual-lane highway overtaking is comfortable with minimal throttle lag. You don't need to double-check oncoming traffic gaps nervously.`;
      } else if (verdict === "needs planning") {
        buyingAdvice = `Acceleration is moderate. You'll need to drop a gear manually or press the throttle early to build boost before swinging out of your lane.`;
      } else {
        buyingAdvice = `This engine variant is tuned purely for fuel efficiency rather than responsiveness. Avoid tight, single-lane overtaking maneuvers without massive safety margins.`;
      }
    } else {
      interpretation = `High-speed overtaking (80–120 km/h) takes ${duration.toFixed(1)}s and requires a long lane sweep of ${distance.toFixed(0)} meters.`;
      
      if (duration < 7.5) {
        buyingAdvice = `Excellent highway cruiser. The turbocharger provides immediate mid-range torque, allowing you to pass fast-moving heavy trucks effortlessly without losing momentum.`;
      } else {
        buyingAdvice = `The engine works hard at high speeds. During expressways runs (80-120 km/h), the CVT rubber-band effect or NA displacement limit is obvious, requiring larger overtaking windows.`;
      }
    }

    return {
      raw: `Time: ${duration.toFixed(1)}s, Distance: ${distance.toFixed(0)}m`,
      interpretation,
      buyingAdvice,
    };
  };

  const explain = aiExplanation();
  const roadScroll = state === "running" ? (elapsedTime * (simState.carSpeed * KMH_TO_MS) * 10) % 60 : 0;

  return (
    <div className="glass p-6 rounded-[32px] overflow-hidden">
      
      {/* ── CONTEXT CONFIGURATOR ── */}
      <div className="grid gap-4 md:grid-cols-3 items-end mb-6">
        <VariantSelect
          label="Your Vehicle"
          value={id}
          onChange={(x) => {
            setState("idle");
            setId(x);
          }}
        />
        <label className="block text-sm">
          <span className="text-secondary text-xs block mb-1">Overtaking Speed Bracket</span>
          <select
            value={targetSpeed}
            onChange={(e) => {
              setState("idle");
              setTargetSpeed(e.target.value as any);
            }}
            className="block w-full px-3 py-2 text-primary text-sm outline-none border border-black/10 rounded-xl"
          >
            <option value="60-100">60 → 100 km/h (Standard Pass)</option>
            <option value="80-120">80 → 120 km/h (Expressway Pass)</option>
          </select>
        </label>
        
        <div className="flex items-center gap-4 py-2">
          <label className="flex items-center gap-2 text-xs text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={slowMo}
              onChange={(e) => setSlowMo(e.target.checked)}
              className="accent-[#C84C31]"
            />
            Slow-mo replay
          </label>
        </div>
      </div>

      {/* ── SIMULATION VIEWPORT ── */}
      <div className="relative w-full aspect-[22/8] bg-[#0A0710] rounded-2xl overflow-hidden border border-white/[0.08]">
        {/* Sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0a1f] to-[#0A0710] opacity-90" />
        
        <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full">
          {/* Highway Lanes */}
          {/* Lane dividers */}
          <line x1="0" y1="50" x2="700" y2="50" stroke="rgba(79, 107, 138, 0.12)" strokeWidth={1} />
          
          <line
            x1="0"
            y1="110"
            x2="700"
            y2="110"
            stroke="rgba(247, 247, 245, 0.15)"
            strokeWidth={1.5}
            strokeDasharray="16 12"
            strokeDashoffset={roadScroll}
          />
          
          <line x1="0" y1="170" x2="700" y2="170" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />

          {/* Environmental Highway Side barriers */}
          <line
            x1="0"
            y1="42"
            x2="700"
            y2="42"
            stroke="rgba(79, 107, 138, 0.15)"
            strokeWidth={2}
            strokeDasharray="40 8"
            strokeDashoffset={roadScroll * 1.5}
          />

          {/* Slow-moving Truck (Constant 60 km/h relative frame) */}
          <g transform={`translate(${simState.truckX}, 115)`}>
            {/* Draw Semi-Truck cargo bed */}
            <rect x={-50} y={-10} width={90} height={25} rx={2} fill="#2A2A30" stroke="rgba(79, 107, 138, 0.5)" strokeWidth={1} />
            {/* Cab */}
            <rect x={40} y={-4} width={18} height={19} rx={1} fill="#1E1E24" stroke="rgba(79, 107, 138, 0.5)" strokeWidth={1} />
            {/* Wheels */}
            {[ -42, -22, 2, 22, 48 ].map((wx, idx) => (
              <circle key={idx} cx={wx} cy={16} r={4.5} fill="#0A0A0B" />
            ))}
            <text fill="#9CA3AF" fontSize={7} fontFamily="monospace" x={-30} y={6}>TRUCK (60 km/h)</text>
          </g>

          {/* Overtaking Car */}
          <g transform={`translate(${simState.carX}, ${simState.carY})`}>
            {loadedImage ? (
              <image
                href={loadedImage.src}
                x={-42}
                y={-14}
                width={84}
                height={30}
                preserveAspectRatio="xMidYMidMeet"
              />
            ) : (
              // Stylized car profile outline
              <path
                d="M -36,10 L -36,2 C -36,-2 -32,-7 -22,-7 L 4,-7 C 12,-7 18,-3 28,2 L 36,8 C 38,9 39,12 36,14 L -36,14 Z"
                fill="none"
                stroke={v ? getBrand(m!.brandId)!.color : "#4F6B8A"}
                strokeWidth={1.5}
              />
            )}
            {/* Indicator flashing during lane shift */}
            {state === "running" && simState.relDist > 2 && simState.relDist < 46 && (
              <circle cx={36} cy={8} r={3} fill="#FFA500" className="animate-ping" />
            )}
          </g>

          {/* Overlay speed indicator */}
          <g transform={`translate(${simState.carX + 48}, ${simState.carY + 4})`} opacity={0.9}>
            <text fill="#F7F7F5" fontSize={7.5} fontFamily="monospace" fontWeight="bold">
              {simState.carSpeed.toFixed(0)} km/h
            </text>
          </g>
        </svg>

        {/* ── IDLE STATE SCREEN ── */}
        {state === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1.5px] z-10">
            <p className="text-secondary font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5"><Navigation className="w-3.5 h-3.5" /> Highway Telemetry Suite</p>
            <h3 className="text-xl font-bold tracking-tight text-white mb-6 uppercase">
              OVERTAKE: {targetSpeed} km/h KICKDOWN
            </h3>
            <button
              onClick={runOvertake}
              className="px-10 py-4 bg-accent text-white font-bold text-base rounded-xl hover:scale-105 transition-transform duration-200 flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 text-white fill-none" />
              RUN SIMULATOR
            </button>
          </div>
        )}

        {/* ── RUNNING STATE HUD ── */}
        {state === "running" && (
          <div className="absolute bottom-3 right-4 bg-black/60 px-3 py-1.5 rounded-lg border border-white/[0.08] text-[9px] font-mono text-[#9CA3AF] space-y-1">
            <div>OVERTAKE TIME: <span className="text-white font-semibold">{elapsedTime.toFixed(2)}s</span></div>
            <div>RELATIVE GAIN: <span className="text-[#C84C31] font-semibold">{simState.relDist.toFixed(1)}m / 50m</span></div>
          </div>
        )}
      </div>

      {/* ── OUTPUT STATS & AI INSIGHTS ── */}
      {state === "finished" && explain && (
        <div className="grid md:grid-cols-12 gap-6 mt-6 animate-fade-in">
          {/* Numerical readout (col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="glass p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-semibold tracking-tight text-[var(--accent)] uppercase font-mono">
                OVERTAKE METRICS
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-secondary block font-mono">TIME EXPOSED</span>
                  <span className="text-2xl font-bold text-primary font-mono">{duration.toFixed(1)}s</span>
                </div>
                <div>
                  <span className="text-[10px] text-secondary block font-mono">ROAD USED</span>
                  <span className="text-2xl font-bold text-primary font-mono">{distance.toFixed(0)}m</span>
                </div>
              </div>

              <div className="border-t border-black/[0.06] pt-3">
                <span className="text-[10px] text-secondary block font-mono">SAFETY VERDICT</span>
                <span className="text-xs font-bold font-mono uppercase" style={{ color: VERDICT_COLOR[verdict] }}>
                  {verdict}
                </span>
              </div>
            </div>

            <button
              onClick={runOvertake}
              className="w-full py-3 border border-black/10 hover:bg-black/5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors text-primary"
            >
              Re-run Simulation
            </button>
          </div>

          {/* AI Explanation Box (col-span-7) */}
          <div className="md:col-span-7 glass border border-[var(--accent)]/30 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-2xl rounded-full" />
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[var(--accent)] uppercase">AI BUYER ADVICE LAYER</span>
              <h4 className="text-base font-semibold mt-1 mb-3 text-primary">Understanding this performance</h4>
              
              <p className="text-xs text-secondary leading-relaxed mb-3">
                <span className="text-[var(--accent)] font-semibold">INTERPRETATION:</span>
                {explain.interpretation}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                <span className="text-[var(--accent)] font-semibold">BUYING ADVICE:</span>
                {explain.buyingAdvice}
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-black/10 flex justify-between items-center text-[10px] text-secondary">
              <span>KICKDOWN TELEMETRY</span>
              {td?.sixtyTo100.estimated && (
                <EstimatedBadge tooltip="Overtaking rates are estimated from horsepower, torque, and weight ratios." />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
