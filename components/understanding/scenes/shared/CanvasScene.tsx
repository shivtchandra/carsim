"use client";

import { useEffect, useRef } from "react";
import { CANVAS_H, CANVAS_W } from "./sceneTokens";

export type CanvasDrawFn = (
  ctx: CanvasRenderingContext2D,
  t: number,
  w: number,
  h: number
) => void;

export default function CanvasScene({ draw }: { draw: CanvasDrawFn }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const start = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      const t = ((now - start) / 1000) % 10;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || CANVAS_W;
      const h = rect.height || CANVAS_H;

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      drawRef.current(ctx, t, w, h);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
