"use client";

import { useCallback } from "react";
import { drawCarTop, MONO_FONT } from "@/components/sims/simCanvas";
import CanvasScene, { type CanvasDrawFn } from "./shared/CanvasScene";
import { SCENE_COLORS } from "./shared/sceneTokens";

export type AdasSceneVariant = "aeb" | "adaptive-cruise" | "lane-keep" | "blind-spot" | "adas-l2";

function easeSegment(t: number, start: number, end: number, from: number, to: number): number {
  if (t < start) return from;
  if (t > end) return to;
  const p = (t - start) / (end - start);
  // smooth step ease
  const ease = p * p * (3 - 2 * p);
  return from + (to - from) * ease;
}

function drawRoad(ctx: CanvasRenderingContext2D, W: number, H: number, scroll: number) {
  const laneTop = H * 0.2;
  const laneH = H * 0.6;
  const centerY = laneTop + laneH / 2;

  ctx.fillStyle = SCENE_COLORS.viewportBg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = SCENE_COLORS.road;
  ctx.fillRect(0, laneTop, W, laneH);

  ctx.strokeStyle = SCENE_COLORS.roadEdge;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, laneTop);
  ctx.lineTo(W, laneTop);
  ctx.moveTo(0, laneTop + laneH);
  ctx.lineTo(W, laneTop + laneH);
  ctx.stroke();

  ctx.strokeStyle = SCENE_COLORS.roadLine;
  ctx.setLineDash([20 * (W / 700), 16 * (W / 700)]);
  ctx.lineDashOffset = -scroll;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(W, centerY);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawCallout(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  variant: "warning" | "negative" | "accent"
) {
  const colors = {
    warning: { fill: SCENE_COLORS.warningSoft, stroke: SCENE_COLORS.warningStroke, text: SCENE_COLORS.warning },
    negative: { fill: SCENE_COLORS.negativeSoft, stroke: SCENE_COLORS.accentStroke, text: SCENE_COLORS.negative },
    accent: { fill: SCENE_COLORS.accentSoft, stroke: SCENE_COLORS.accentStroke, text: SCENE_COLORS.accent },
  }[variant];
  const tw = Math.max(140, text.length * 7.2);
  ctx.fillStyle = colors.fill;
  ctx.strokeStyle = colors.stroke;
  ctx.beginPath();
  ctx.roundRect(x, y, tw, 26, 13);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = colors.text;
  ctx.font = MONO_FONT;
  ctx.fillText(text, x + 14, y + 17);
}

export default function AdasRoadScene({ variant }: { variant: AdasSceneVariant }) {
  const draw = useCallback<CanvasDrawFn>(
    (ctx, t, W, H) => {
      const sx = W / 700;

      // Integrate road scroll speed numerically for smooth deceleration
      let scroll = 0;
      const dt = 0.05;
      for (let time = 0; time < t; time += dt) {
        let speed = 140; // baseline cruising speed
        if (variant === "aeb") {
          if (time >= 3 && time < 7.5) {
            speed = 140 * (1 - (time - 3) / 4.5); // decelerates to 0
          } else if (time >= 7.5) {
            speed = 0; // stopped
          }
        } else if (variant === "adaptive-cruise") {
          if (time >= 3 && time < 6) {
            speed = 140 - ((time - 3) / 3) * 60; // slows from 140 to 80
          } else if (time >= 6 && time < 9) {
            speed = 80 + ((time - 6) / 3) * 60; // speeds up from 80 to 140
          }
        }
        scroll += speed * dt;
      }
      scroll = scroll * sx;

      drawRoad(ctx, W, H, scroll);

      const laneTop = H * 0.2;
      const laneH = H * 0.6;
      const carY = laneTop + laneH * 0.55;
      const carW = 76 * sx;
      const carH = 34 * (H / 200);

      if (variant === "aeb") {
        // Ego vehicle position
        let egoX = 120 * sx;
        if (t > 5.5) {
          // Rolls forward slightly during hard stop
          egoX = easeSegment(t, 5.5, 7.5, 120, 150) * sx;
        }

        // Radar beam
        if (t < 7.5) {
          ctx.fillStyle = "rgba(200, 76, 49, 0.12)";
          ctx.beginPath();
          ctx.moveTo(egoX + carW, carY + carH / 2);
          ctx.lineTo(egoX + carW + 110 * sx, carY - 8);
          ctx.lineTo(egoX + carW + 110 * sx, carY + carH + 8);
          ctx.closePath();
          ctx.fill();
        }

        // Lead vehicle position (slows down smoothly)
        const leadX = easeSegment(t, 3, 7.5, 480, 290) * sx;

        // Draw vehicles
        drawCarTop(ctx, egoX, carY, carW, carH, SCENE_COLORS.accent);
        drawCarTop(ctx, leadX, carY, carW, carH, SCENE_COLORS.leadCar);

        // Brake lights on lead vehicle
        if (t >= 3 && t < 7.5) {
          ctx.fillStyle = "#F87171";
          ctx.fillRect(leadX - 4, carY + 2, 5, carH - 4);
        }

        // Warning alerts
        if (t >= 3 && t < 5.5) {
          drawCallout(ctx, 250 * sx, 54 * (H / 200), "warning · collision alert", "warning");
        } else if (t >= 5.5 && t < 8.5) {
          drawCallout(ctx, 250 * sx, 54 * (H / 200), "auto-brake · emergency stop", "negative");
        }
      } else if (variant === "adaptive-cruise") {
        const egoX = 120 * sx;
        const leadX = easeSegment(t, 3, 6, 450, 290) * sx;
        const leadXReturn = easeSegment(t, 6, 9, 290, 480) * sx;

        const currentLeadX = t < 6 ? leadX : leadXReturn;

        drawCarTop(ctx, egoX, carY, carW, carH, SCENE_COLORS.accent);
        drawCarTop(ctx, currentLeadX, carY, carW, carH, SCENE_COLORS.leadCar);

        if (t >= 3 && t < 6) {
          drawCallout(ctx, 250 * sx, 54 * (H / 200), "easing off · holding gap", "accent");
        } else if (t >= 6 && t < 9) {
          drawCallout(ctx, 250 * sx, 54 * (H / 200), "returning to set speed", "accent");
        }
      } else if (variant === "blind-spot") {
        const egoX = 120 * sx;
        drawCarTop(ctx, egoX, carY, carW, carH, SCENE_COLORS.accent);
        const bikeX = easeSegment(t, 0, 4.5, -100 * sx, 60 * sx);
        if (t <= 6) {
          ctx.fillStyle = SCENE_COLORS.bike;
          ctx.beginPath();
          ctx.roundRect(bikeX, carY - 50, 44 * sx, 22 * (H / 200), 8);
          ctx.fill();
        }
        if (t >= 3 && t < 6.2) {
          ctx.fillStyle = SCENE_COLORS.bike;
          ctx.beginPath();
          ctx.arc(egoX + 15, carY - 8, 9, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Lane keep / adas-l2
        const egoX = 120 * sx;
        let egoYOffset = 0;
        if (t >= 2.5 && t < 5) {
          egoYOffset = -26 * (H / 200) * Math.sin(((t - 2.5) / 2.5) * Math.PI);
        }
        drawCarTop(ctx, egoX, carY + egoYOffset, carW, carH, SCENE_COLORS.accent);
        const msg = variant === "adas-l2" ? "L2 · cruise + lane centering" : "steering nudge applied";
        if (t >= 3 && t < 7) {
          drawCallout(ctx, 250 * sx, 54 * (H / 200), msg, "warning");
        }
        if (variant === "adas-l2") {
          ctx.fillStyle = `rgba(200, 76, 49, ${0.25 + 0.35 * Math.sin(t * 1.2)})`;
          ctx.fillRect(100 * sx, H - 25, 500 * sx, 4);
        }
      }
    },
    [variant]
  );

  return (
    <div className="absolute inset-0">
      <CanvasScene draw={draw} />
    </div>
  );
}
