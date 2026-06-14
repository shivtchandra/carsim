"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getBrand, getModel, getTestData, getVariant } from "@/lib/data";
import { getSimCarColor } from "@/lib/simCarColors";
import {
  KMH_TO_MS,
  REL_DIST_M,
  downloadCanvasPng,
  overtakeDistance,
  overtakeDuration,
  overtakeVerdict,
  relDistanceAt,
} from "@/lib/sim";
import EstimatedBadge from "@/components/EstimatedBadge";
import VariantSelect from "@/components/sims/VariantSelect";
import Stage from "../Stage";
import StylizedCar, { type CarMotionRef } from "../StylizedCar";
import { getVehicleDNA } from "@/lib/vehicle-dna";
import { LANE_W, Road, ScrollingDashes, Truck } from "./Road";

const WHEEL_R = 0.38;
const VERDICT_COLOR: Record<string, string> = {
  comfortable: "var(--positive)",
  "needs planning": "var(--warning)",
  "avoid on two-lane roads": "var(--negative)",
};

function OvertakeScene({
  modelId,
  color,
  wheelbaseMm,
  bootLitres,
  bodyStyle,
  dna,
  t60100,
  runningRef,
  slowMoRef,
  speedEl,
  onDone,
}: {
  modelId: string;
  color: string;
  wheelbaseMm: number;
  bootLitres: number;
  bodyStyle: "suv" | "sedan";
  dna: any;
  t60100: number;
  runningRef: React.MutableRefObject<boolean>;
  slowMoRef: React.MutableRefObject<boolean>;
  speedEl: React.MutableRefObject<HTMLSpanElement | null>;
  onDone: () => void;
}) {
  const t = useRef(0);
  const done = useRef(false);
  const ego = useRef<THREE.Group>(null);
  const motion = useRef<CarMotionRef>({ wheelSpeed: 0, pitch: 0 });

  const dur = overtakeDuration(t60100);
  // truck frame: truck fixed at x=0 in the slow lane; ego gains relative distance
  const slowLaneZ = LANE_W / 2;
  const fastLaneZ = -LANE_W / 2;

  useFrame(({ camera }, delta) => {
    if (runningRef.current && !done.current) {
      t.current += Math.min(delta, 0.05) * (slowMoRef.current ? 0.25 : 1);
    }
    const now = Math.min(t.current, dur + 0.4);
    const rel = Math.min(relDistanceAt(now, t60100), REL_DIST_M);
    const phase = rel / REL_DIST_M;
    const x = -REL_DIST_M * 0.55 + rel;
    // eased lane change out and back
    const laneBlend = Math.min(1, Math.abs(Math.sin(phase * Math.PI)) * 1.6);
    const z = slowLaneZ + (fastLaneZ - slowLaneZ) * laneBlend;

    if (ego.current) {
      ego.current.position.set(x, 0, z);
      // slight yaw into the lane change
      const yaw = Math.cos(phase * Math.PI) * (fastLaneZ - slowLaneZ) * 0.012 * (phase < 0.5 ? 1 : -1);
      ego.current.rotation.y = phase > 0.02 && phase < 0.98 ? yaw : 0;
    }

    const speedKmh = 60 + Math.min(40, 40 * Math.pow(Math.min(now / t60100, 1), 0.8));
    motion.current.wheelSpeed = (speedKmh / 3.6) / WHEEL_R;
    if (speedEl.current) {
      speedEl.current.textContent = `${speedKmh.toFixed(0)} km/h · t ${Math.min(now, dur).toFixed(1)}s`;
    }

    camera.position.set(x - 7, 2.8, 9);
    camera.lookAt(x + 4, 0.8, 0);

    if (runningRef.current && !done.current && t.current >= dur + 0.4) {
      done.current = true;
      onDone();
    }
  });

  return (
    <>
      <Road x0={-70} x1={70} lanes={2} />
      {/* scrolling dashes overlay conveys the shared 60 km/h frame */}
      <ScrollingDashes speedMs={60 * KMH_TO_MS} timeRef={t} span={140} />
      <group position={[8, 0, slowLaneZ]}>
        <Truck />
      </group>
      <group ref={ego} position={[-REL_DIST_M * 0.55, 0, slowLaneZ]}>
        <StylizedCar
          modelId={modelId}
          color={color}
          wheelbaseMm={wheelbaseMm}
          bootLitres={bootLitres}
          bodyStyle={bodyStyle}
          dna={dna}
          motionRef={motion}
        />
      </group>
    </>
  );
}

export default function Overtake3D({ initialVariant }: { initialVariant?: string }) {
  const [id, setId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("drivescope_selected_variant");
      if (stored) return stored;
    }
    return initialVariant ?? "creta-sx-o-turbo-dct";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("drivescope_selected_variant");
      if (stored && stored !== id) {
        setId(stored);
      }
    }
  }, []);
  const [running, setRunning] = useState(false);
  const [runId, setRunId] = useState(0);
  const [slowMo, setSlowMo] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);
  const slowMoRef = useRef(false);
  const speedEl = useRef<HTMLSpanElement | null>(null);
  runningRef.current = running;
  slowMoRef.current = slowMo;

  const data = useMemo(() => {
    const v = getVariant(id);
    const m = v && getModel(v.modelId);
    const td = v && getTestData(v.id);
    if (!v || !m || !td?.sixtyTo100.value) return null;
    return {
      modelId: m.id,
      label: `${m.name} ${v.name}`,
      color: getSimCarColor(m.id, getBrand(m.brandId)!.color),
      t60100: td.sixtyTo100.value,
      estimated: td.sixtyTo100.estimated,
      wheelbaseMm: m.dimensions.wheelbaseMm,
      bootLitres: m.dimensions.bootLitres,
      bodyStyle: m.bodyStyle ?? ("suv" as "suv" | "sedan"),
      dna: getVehicleDNA(m),
    };
  }, [id]);

  const duration = data ? overtakeDuration(data.t60100) : null;
  const distance = data ? overtakeDistance(data.t60100) : null;
  const verdict = duration ? overtakeVerdict(duration) : null;

  return (
    <div className="glass p-6">
      <div className="grid gap-3 sm:grid-cols-2 mb-5">
        <VariantSelect label="Your car" value={id} onChange={(x) => {
          setId(x);
          setDone(false);
          if (typeof window !== "undefined") {
            localStorage.setItem("drivescope_selected_variant", x);
          }
        }} />
      </div>

      <div className="relative">
        <div ref={containerRef} className="relative w-full aspect-[16/9] sm:aspect-[21/8] rounded-xl overflow-hidden">
          {data && (
            <Stage key={`${id}-${runId}`} camera={{ position: [-34, 2.8, 9], fov: 42 }} fog={[30, 100]}>
              <OvertakeScene
                modelId={data.modelId}
                color={data.color}
                wheelbaseMm={data.wheelbaseMm}
                bootLitres={data.bootLitres}
                bodyStyle={data.bodyStyle}
                dna={data.dna}
                t60100={data.t60100}
                runningRef={runningRef}
                slowMoRef={slowMoRef}
                speedEl={speedEl}
                onDone={() => { setRunning(false); setDone(true); }}
              />
            </Stage>
          )}
        </div>

        <div className="sm:absolute relative sm:top-3 sm:left-4 top-auto left-auto mt-3 sm:mt-0 p-3 rounded-xl border border-[#161616]/10 bg-[#F4F0E8]/90 backdrop-blur-sm text-[10px] sm:text-xs stat-num pointer-events-none flex items-center gap-2 z-10 shadow-sm">
          <span className="text-secondary">{data?.label} ·</span>
          <span ref={speedEl} className="text-primary font-bold">60 km/h</span>
          <span className="text-secondary">· truck holds 60</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5">
        <button
          onClick={() => { setDone(false); setRunId((r) => r + 1); setRunning(true); }}
          disabled={running || !data}
          className="px-8 py-3 rounded-xl bg-accent text-white font-semibold text-lg disabled:opacity-40 transition-transform duration-200 hover:scale-[1.03]"
        >
          {running ? "Overtaking…" : "Run"}
        </button>
        <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
          <input type="checkbox" checked={slowMo} onChange={(e) => setSlowMo(e.target.checked)} />
          Slow-mo replay
        </label>
        <button
          onClick={() => {
            const canvas = containerRef.current?.querySelector("canvas");
            if (canvas) downloadCanvasPng(canvas as HTMLCanvasElement, "drivescope-overtake.png");
          }}
          className="px-4 py-2 rounded-lg glass text-sm hover:bg-white/[0.08]"
        >
          Share image ↓
        </button>
        {data?.estimated && (
          <EstimatedBadge tooltip="60–100 kickdown time is modeled as a fixed share of the 0–100 run." />
        )}
      </div>

      {done && duration && distance && verdict && (
        <p className="mt-4 text-sm leading-relaxed">
          Overtake takes <span className="stat-num">{duration.toFixed(1)} s</span> and consumes{" "}
          <span className="stat-num">{distance.toFixed(0)} m</span> of road —{" "}
          <span className="font-medium" style={{ color: VERDICT_COLOR[verdict] }}>{verdict}</span>.
        </p>
      )}

      <div className="border border-[#161616]/10 bg-[#F4F0E8]/40 p-4 rounded-2xl mt-5 text-[11px] text-secondary leading-relaxed">
        <p className="font-semibold text-primary mb-1 font-mono uppercase tracking-wider text-[10px]">Jargon Guide: Kickdown Acceleration &amp; Overtaking Distance //</p>
        <p>
          <strong>Kickdown (60–100 km/h)</strong> measures how quickly the transmission drops gears and the engine surges when you stomp on the gas to overtake a slower vehicle.
          <strong> Overtaking Distance</strong> is the length of road consumed while passing the obstacle — shorter distance means less time spent in the oncoming traffic lane, greatly improving safety.
        </p>
      </div>
    </div>
  );
}
