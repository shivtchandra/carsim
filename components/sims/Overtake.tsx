"use client";

import { useEffect, useRef, useState } from "react";
import { getBrand, getModel, getTestData, getVariant } from "@/lib/data";
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
import VariantSelect from "./VariantSelect";
import { ACCENT, CANVAS_BG, MONO_FONT, TEXT_PRIMARY, TEXT_SECONDARY, drawCarSide } from "./simCanvas";

import { CAR_IMAGE_MAP } from "@/lib/carImageMap";

const VERDICT_COLOR: Record<string, string> = {
  comfortable: "var(--positive)",
  "needs planning": "var(--warning)",
  "avoid on two-lane roads": "var(--negative)",
};

export default function Overtake({ initialVariant }: { initialVariant?: string }) {
  const [id, setId] = useState(initialVariant ?? "creta-sx-o-turbo-dct");
  const [running, setRunning] = useState(false);
  const [slowMo, setSlowMo] = useState(false);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ t: 0, last: 0, raf: 0 });
  const slowMoRef = useRef(false);
  slowMoRef.current = slowMo;

  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  const v = getVariant(id);
  const m = v && getModel(v.modelId);
  const td = v && getTestData(v.id);
  const t60100 = td?.sixtyTo100.value ?? null;
  const duration = t60100 ? overtakeDuration(t60100) : null;
  const distance = t60100 ? overtakeDistance(t60100) : null;
  const verdict = duration ? overtakeVerdict(duration) : null;

  // Load custom car PNG image when selected ID changes
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !t60100 || !v || !m) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const dur = overtakeDuration(t60100);
    const color = getBrand(m.brandId)!.color;

    // Camera follows the truck (steady 60 km/h). Truck fixed at centre-left.
    const truckX = W * 0.45, carW = 80, truckW = 120;
    const laneTop = H * 0.18, laneBottom = H * 0.58;

    const draw = (t: number) => {
      ctx.fillStyle = CANVAS_BG;
      ctx.fillRect(0, 0, W, H);
      // road
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.setLineDash([18, 14]);
      ctx.beginPath();
      ctx.moveTo(0, H * 0.5);
      ctx.lineTo(W, H * 0.5);
      ctx.stroke();
      ctx.setLineDash([]);

      // truck (reference frame)
      drawCarSide(ctx, truckX, laneBottom, truckW, H * 0.3, "#3F3F46");
      ctx.fillStyle = TEXT_SECONDARY;
      ctx.font = MONO_FONT;
      ctx.fillText("truck · 60 km/h", truckX, laneBottom - 8);

      // our car: relative position = -REL_DIST*0.6 + relDistance(t)
      const rel = Math.min(relDistanceAt(t, t60100), REL_DIST_M);
      const pxPerM = (W * 0.5) / REL_DIST_M;
      const carX = truckX - REL_DIST_M * 0.55 * pxPerM + rel * pxPerM;
      // lane change: out before truck, back in after passing
      const phase = rel / REL_DIST_M;
      const laneY = phase < 0.15 ? laneBottom : phase > 0.85 ? laneBottom : laneTop;
      const yEase = laneBottom + (laneY - laneBottom) * Math.min(1, Math.abs(Math.sin(phase * Math.PI)) * 1.6);
      drawCarSide(ctx, carX, yEase + H * 0.12, carW, H * 0.26, color, loadedImage);

      const tc = Math.min(t, dur);
      const speed = 60 + Math.min(40, 40 * Math.pow(Math.min(tc / t60100, 1), 0.8));
      ctx.fillStyle = TEXT_PRIMARY;
      ctx.fillText(`${m.name} ${v.name} · ${speed.toFixed(0)} km/h`, 20, 22);
      ctx.fillStyle = TEXT_SECONDARY;
      ctx.fillText(`t = ${tc.toFixed(2)}s · distance used ${(tc * 60 * KMH_TO_MS + rel).toFixed(0)} m${slowMoRef.current ? " (slow-mo)" : ""}`, 20, H - 12);
    };

    if (!running) { draw(done ? 99 : 0); return; }

    stateRef.current = { t: 0, last: performance.now(), raf: 0 };
    const loop = (now: number) => {
      const dt = ((now - stateRef.current.last) / 1000) * (slowMoRef.current ? 0.25 : 1);
      stateRef.current.last = now;
      stateRef.current.t += dt;
      draw(stateRef.current.t);
      if (stateRef.current.t >= dur + 0.4) {
        setRunning(false);
        setDone(true);
        return;
      }
      stateRef.current.raf = requestAnimationFrame(loop);
    };
    stateRef.current.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(stateRef.current.raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, id]);

  return (
    <div className="glass p-6">
      <div className="grid gap-3 sm:grid-cols-2 mb-5">
        <VariantSelect label="Your car" value={id} onChange={(x) => { setId(x); setDone(false); }} />
      </div>

      <canvas ref={canvasRef} width={840} height={260} className="w-full rounded-xl" />

      <div className="flex flex-wrap items-center gap-3 mt-5">
        <button
          onClick={() => { setDone(false); setRunning(true); }}
          disabled={running || !t60100}
          className="px-8 py-3 rounded-xl bg-accent text-white font-semibold text-lg disabled:opacity-40 transition-transform duration-200 hover:scale-[1.03]"
        >
          {running ? "Overtaking…" : "Run"}
        </button>
        <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
          <input type="checkbox" checked={slowMo} onChange={(e) => setSlowMo(e.target.checked)} />
          Slow-mo replay
        </label>
        <button
          onClick={() => canvasRef.current && downloadCanvasPng(canvasRef.current, "drivescope-overtake.png")}
          className="px-4 py-2 rounded-lg glass text-sm hover:bg-white/[0.08]"
        >
          Share image ↓
        </button>
        {td?.sixtyTo100.estimated && <EstimatedBadge tooltip="60–100 kickdown time is modeled as a fixed share of the 0–100 run." />}
      </div>

      {done && duration && distance && verdict && (
        <p className="mt-4 text-sm leading-relaxed">
          Overtake takes <span className="stat-num">{duration.toFixed(1)} s</span> and consumes{" "}
          <span className="stat-num">{distance.toFixed(0)} m</span> of road —{" "}
          <span className="font-medium" style={{ color: VERDICT_COLOR[verdict] }}>{verdict}</span>.
        </p>
      )}
    </div>
  );
}
