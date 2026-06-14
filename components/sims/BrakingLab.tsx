"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Shield, Zap } from "lucide-react";
import { getBrand, getModel, getTestData, getVariant } from "@/lib/data";
import { KMH_TO_MS, REACTION_TIME_S, decelFromBraking100, brakingDistance, totalStoppingDistance } from "@/lib/sim";
import EstimatedBadge from "@/components/EstimatedBadge";
import VariantSelect from "./VariantSelect";
import { CAR_IMAGE_MAP } from "@/lib/carImageMap";
import { SCENE_COLORS } from "@/components/understanding/scenes/shared/sceneTokens";

export default function BrakingLab({ initialVariant }: { initialVariant?: string }) {
  const [id, setId] = useState(initialVariant ?? "creta-sx-o-turbo-dct");
  const [speedVal, setSpeedVal] = useState<80 | 100>(80);
  const [surface, setSurface] = useState<"dry" | "wet">("dry");
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

  // Braking data
  const baseD100 = td?.braking100to0.value ?? 40.0;
  const d100 = surface === "wet" ? baseD100 * 1.4 : baseD100; // wet roads increase stopping distance by 40%
  const decel = decelFromBraking100(d100);
  
  // Stopping distances
  const reactDist = (speedVal * KMH_TO_MS) * REACTION_TIME_S;
  const brakeDist = brakingDistance(speedVal, d100);
  const totalDist = reactDist + brakeDist;
  const duration = REACTION_TIME_S + (speedVal * KMH_TO_MS) / decel;

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
    carX: 50,
    carSpeed: speedVal as number,
    phase: "reacting" as "reacting" | "braking" | "stopped",
  });

  const runBraking = () => {
    setState("running");
    setElapsedTime(0);
    stateRef.current = { t: 0, last: performance.now(), raf: 0 };

    const startSpeed = speedVal * KMH_TO_MS;

    const loop = (now: number) => {
      const dt = ((now - stateRef.current.last) / 1000) * (slowMoRef.current ? 0.25 : 1);
      stateRef.current.last = now;
      stateRef.current.t += dt;
      const t = stateRef.current.t;
      setElapsedTime(t);

      let currentDist = 0;
      let currentSpeed: number = speedVal;
      let phase: "reacting" | "braking" | "stopped" = "reacting";

      if (t < REACTION_TIME_S) {
        // 1. Reaction Phase (Constant Speed)
        currentDist = startSpeed * t;
        currentSpeed = speedVal;
        phase = "reacting";
      } else if (t >= REACTION_TIME_S && t < duration) {
        // 2. Active Braking Phase (Linear Deceleration)
        const brakeT = t - REACTION_TIME_S;
        currentDist = reactDist + (startSpeed * brakeT - 0.5 * decel * brakeT * brakeT);
        currentSpeed = Math.max(0, speedVal - (decel * brakeT) / KMH_TO_MS);
        phase = "braking";
      } else {
        // 3. Stopped
        currentDist = totalDist;
        currentSpeed = 0;
        phase = "stopped";
      }

      // Map distance covered (0 to totalDist) to screen coordinate x
      // Let's place the start line at x = 120. Total length mapped inside viewport (up to x=560)
      const pxPerM = 4.2; // scale factor
      const carX = 120 + currentDist * pxPerM;

      setSimState({
        carX,
        carSpeed: currentSpeed,
        phase,
      });

      if (t >= duration + 0.4) {
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

  const aiExplanation = () => {
    if (!v || !m) return null;
    let interpretation = "";
    let buyingAdvice = "";

    const reactionPct = (reactDist / totalDist) * 100;
    
    interpretation = `From ${speedVal} km/h on a ${surface} road, the total stopping distance is ${totalDist.toFixed(1)}m. Reaction time alone accounts for ${reactDist.toFixed(1)}m (${reactionPct.toFixed(0)}% of total distance) before the brakes are even applied.`;
    
    if (surface === "wet") {
      buyingAdvice = `On monsoon-slick roads, wet braking distances jump by ~40%. An extra ${brakeDist.toFixed(1)}m is needed just to lock the tires. Features like ABS with EBD (Electronic Brakeforce Distribution) and Brake Assist are absolutely critical here to maintain steering control.`;
    } else {
      buyingAdvice = `In dry conditions, the ${m.name}'s 100-0 braking capability of ${baseD100.toFixed(1)}m is solid. However, never tail vehicles closer than 3 seconds on expressways, as human reaction distance remains the single biggest contributor to stopping safety.`;
    }

    return {
      raw: `Stopping Distance: ${totalDist.toFixed(1)}m`,
      interpretation,
      buyingAdvice,
    };
  };

  const explain = aiExplanation();
  
  // Rain particles loop
  const raindrops = surface === "wet" ? Array.from({ length: 25 }) : [];

  return (
    <div className="glass p-6 rounded-[32px] overflow-hidden">
      
      {/* ── CONTEXT CONFIGURATOR ── */}
      <div className="grid gap-4 md:grid-cols-4 items-end mb-6">
        <VariantSelect
          label="Your Vehicle"
          value={id}
          onChange={(x) => {
            setState("idle");
            setId(x);
          }}
        />
        <label className="block text-sm">
          <span className="text-secondary text-xs block mb-1">Braking Initial Speed</span>
          <select
            value={speedVal}
            onChange={(e) => {
              setState("idle");
              setSpeedVal(Number(e.target.value) as any);
            }}
            className="block w-full px-3 py-2 text-primary text-sm outline-none border border-black/10 rounded-xl"
          >
            <option value="80">80 km/h (Standard Highway Limit)</option>
            <option value="100">100 km/h (Expressway Limit)</option>
          </select>
        </label>
        
        <label className="block text-sm">
          <span className="text-secondary text-xs block mb-1">Road Condition</span>
          <select
            value={surface}
            onChange={(e) => {
              setState("idle");
              setSurface(e.target.value as any);
            }}
            className="block w-full px-3 py-2 text-primary text-sm outline-none border border-black/10 rounded-xl"
          >
            <option value="dry">Dry Asphalt (Traction: High)</option>
            <option value="wet">Monsoon Rain (Traction: Reduced)</option>
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
        {/* Sky / Ambient background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${surface === "wet" ? "from-[#111221] to-[#0A0710]" : "from-[#0d0a1b] to-[#0A0710]"} opacity-90`} />
        
        {/* Monsoon Rain falling overlay */}
        {surface === "wet" && state === "running" && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div className="w-full h-full animate-rain relative">
              {raindrops.map((_, idx) => (
                <div
                  key={idx}
                  className="absolute bg-white/25 w-[1px] h-3 transform -rotate-[12deg] animate-drop"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 40}px`,
                    animationDelay: `${Math.random() * 1.5}s`,
                    animationDuration: `${0.6 + Math.random() * 0.4}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full">
          {/* Road */}
          <rect x="0" y="120" width="700" height="40" fill={SCENE_COLORS.road} />
          <line x1="0" y1="120" x2="700" y2="120" stroke="rgba(245, 241, 232, 0.25)" strokeWidth={1} />
          <line x1="0" y1="160" x2="700" y2="160" stroke="rgba(245, 241, 232, 0.25)" strokeWidth={1} />

          {/* Start / Brake Application Boundary */}
          <g transform="translate(120, 0)">
            <line x1={0} y1="80" x2={0} y2="170" stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1} strokeDasharray="3 3" />
            <text fill="#9CA3AF" fontSize={7} fontFamily="monospace" x={5} y={90}>START SPEED LIMIT</text>
          </g>

          {/* Dynamic braking/reaction zones on the road */}
          {state !== "idle" && (
            <g>
              {/* Reaction Zone (Yellow/Amber) */}
              <rect x={120} y={122} width={reactDist * 4.2} height={4} fill="#FFB300" opacity={0.6} />
              
              {/* Braking Zone (Red/Orange) */}
              <rect x={120 + reactDist * 4.2} y={122} width={brakeDist * 4.2} height={4} fill="#C84C31" opacity={0.7} />
            </g>
          )}

          {/* Environmental Grid lines */}
          <line x1="10" y1="30" x2="690" y2="30" stroke="rgba(79, 107, 138, 0.1)" strokeWidth={1} />

          {/* Stopping Distance Measurement Ruler */}
          {state === "finished" && (
            <g transform="translate(0, 50)">
              {/* Reaction Ruler */}
              <line x1="120" y1="0" x2={120 + reactDist * 4.2} y2="0" stroke="#FFB300" strokeWidth={1} />
              <circle cx={120} cy={0} r={2} fill="#FFB300" />
              <circle cx={120 + reactDist * 4.2} cy={0} r={2} fill="#FFB300" />
              <text x={120 + (reactDist * 4.2) / 2} y="-6" fill="#FFB300" fontSize={7.5} fontFamily="monospace" textAnchor="middle">
                REACTION: {reactDist.toFixed(1)}m (1.0s)
              </text>

              {/* Braking Ruler */}
              <line x1={120 + reactDist * 4.2} y1="0" x2={120 + totalDist * 4.2} y2="0" stroke="#C84C31" strokeWidth={1} />
              <circle cx={120 + reactDist * 4.2} cy={0} r={2} fill="#C84C31" />
              <circle cx={120 + totalDist * 4.2} cy={0} r={2} fill="#C84C31" />
              <text x={120 + reactDist * 4.2 + (brakeDist * 4.2) / 2} y="-6" fill="#C84C31" fontSize={7.5} fontFamily="monospace" textAnchor="middle">
                BRAKE: {brakeDist.toFixed(1)}m
              </text>

              {/* Total Stopping Ruler */}
              <line x1="120" y1="20" x2={120 + totalDist * 4.2} y2="20" stroke="#4F6B8A" strokeWidth={1.25} />
              <circle cx={120} cy={20} r={2.5} fill="#4F6B8A" />
              <circle cx={120 + totalDist * 4.2} cy={20} r={2.5} fill="#4F6B8A" />
              <text x={120 + (totalDist * 4.2) / 2} y="32" fill="#4F6B8A" fontSize={9} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                TOTAL: {totalDist.toFixed(1)}m STOPPING DISTANCE
              </text>
            </g>
          )}

          {/* Car profile */}
          <g transform={`translate(${simState.carX}, 130)`}>
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
            
            {/* Water splashes / Tire smoke behind wheels */}
            {state === "running" && simState.phase === "braking" && (
              <g opacity={0.65}>
                <ellipse cx={-25} cy={16} rx={surface === "wet" ? 12 : 6} ry={3} fill={surface === "wet" ? "#4F6B8A" : "#FFFFFF"} filter="blur(2px)" />
                <ellipse cx={25} cy={16} rx={surface === "wet" ? 12 : 6} ry={3} fill={surface === "wet" ? "#4F6B8A" : "#FFFFFF"} filter="blur(2px)" />
              </g>
            )}

            {/* Brake lights glowing red when braking */}
            {simState.phase === "braking" && (
              <circle cx={-42} cy={2} r={3} fill="#FF0000" className="animate-pulse" filter="blur(1px)" />
            )}
          </g>

          {/* Dynamic Speed readout */}
          <g transform={`translate(${simState.carX + 48}, 134)`} opacity={0.9}>
            <text fill="#F7F7F5" fontSize={7.5} fontFamily="monospace" fontWeight="bold">
              {simState.carSpeed.toFixed(0)} km/h
            </text>
          </g>
        </svg>

        {/* ── IDLE / INITIAL STATE SCREEN ── */}
        {state === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1.5px] z-10">
            <p className="text-secondary font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-secondary" /> Traction & Braking Labs</p>
            <h3 className="text-xl font-bold tracking-tight text-white mb-6 uppercase">
              EMERGENCY BRAKE AT {speedVal} KM/H ON {surface.toUpperCase()} ROAD
            </h3>
            <button
              onClick={runBraking}
              className="px-10 py-4 bg-[#C84C31] text-white font-bold text-base rounded-xl hover:scale-105 transition-transform duration-200 flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5 fill-white text-[#C84C31]" />
              TRIGGER PANIC STOP
            </button>
          </div>
        )}

        {/* ── RUNNING STATE HUD ── */}
        {state === "running" && (
          <div className="absolute bottom-3 right-4 bg-black/60 px-3 py-1.5 rounded-lg border border-white/[0.08] text-[9px] font-mono text-[#9CA3AF] space-y-1">
            <div>BRAKING STATUS: <span className="text-white font-semibold uppercase">{simState.phase}</span></div>
            <div>DECELERATION: <span className="text-[#C84C31] font-semibold">{decel.toFixed(1)} m/s²</span></div>
          </div>
        )}
      </div>

      {/* ── STATS & AI INSIGHTS ── */}
      {state === "finished" && explain && (
        <div className="grid md:grid-cols-12 gap-6 mt-6 animate-fade-in">
          {/* Numerical readout (col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="glass p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-semibold tracking-tight text-[var(--accent)] uppercase font-mono">
                STOPPING DISSECTION
              </h4>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[8.5px] text-secondary block font-mono">REACTION D.</span>
                  <span className="text-sm font-bold text-primary font-mono">{reactDist.toFixed(1)}m</span>
                </div>
                <div>
                  <span className="text-[8.5px] text-secondary block font-mono">BRAKING D.</span>
                  <span className="text-sm font-bold text-primary font-mono">{brakeDist.toFixed(1)}m</span>
                </div>
                <div>
                  <span className="text-[8.5px] text-[var(--accent)] block font-mono">TOTAL STOP</span>
                  <span className="text-sm font-bold text-[var(--accent)] font-mono">{totalDist.toFixed(1)}m</span>
                </div>
              </div>

              <div className="border-t border-black/[0.06] pt-3">
                <span className="text-[9px] text-secondary block font-mono">DECELERATION FORCE</span>
                <span className="text-xs font-bold font-mono">
                  {(decel / 9.81).toFixed(2)} G-Force
                </span>
              </div>
            </div>

            <button
              onClick={runBraking}
              className="w-full py-3 border border-black/10 hover:bg-black/5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors text-primary"
            >
              Re-run Emergency Stop
            </button>
          </div>

          {/* AI Explanation Box (col-span-7) */}
          <div className="md:col-span-7 glass border border-[var(--accent)]/30 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-2xl rounded-full" />
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[var(--accent)] uppercase">AI TRACTION INSIGHT</span>
              <h4 className="text-base font-semibold mt-1 mb-3 text-primary">How this translates to your ownership</h4>
              
              <p className="text-xs text-secondary leading-relaxed mb-3">
                <span className="text-[var(--accent)] font-semibold">INTERPRETATION:</span>
                {explain.interpretation}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                <span className="text-[var(--accent)] font-semibold">BUYING ADVICE: </span>
                {explain.buyingAdvice}
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-black/10 flex justify-between items-center text-[10px] text-secondary">
              <span>BRAKE PAD FRICTION MODEL</span>
              {td?.braking100to0.estimated && (
                <EstimatedBadge tooltip="100-0 braking distance is estimated from average class performance and weight scaling." />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
