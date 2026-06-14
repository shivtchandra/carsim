// Physics helpers for the Simulation Lab (spec §5 Phase 4).
// Velocity profile per spec: v(t) = 100 * (t / t100)^0.8 km/h (constant-power feel).

export const KMH_TO_MS = 1000 / 3600;

/** Speed in km/h at time t for a car with the given 0-100 time. Caps at 100. */
export function speedAt(t: number, t100: number): number {
  if (t <= 0) return 0;
  if (t >= t100) return 100;
  return 100 * Math.pow(t / t100, 0.8);
}

/** Distance covered (m) at time t under the spec profile (analytic integral). */
export function distanceAt(t: number, t100: number): number {
  const tc = Math.min(t, t100);
  // ∫ 100*(t/t100)^0.8 km/h dt = (100/3.6) * t100/1.8 * (t/t100)^1.8 m
  const accelDist = (100 * KMH_TO_MS * t100 / 1.8) * Math.pow(tc / t100, 1.8);
  const cruiseDist = t > t100 ? (t - t100) * 100 * KMH_TO_MS : 0;
  return accelDist + cruiseDist;
}

/* ---- Sim B: overtake. Relative speed over a 60 km/h truck while running 60→100
 * with profile Δv(t) = 40 * (t/T)^0.8 km/h, where T = sixtyTo100 time.
 * Overtake is complete after gaining REL_DIST_M of relative distance
 * (truck length + front and rear safety gaps). */
export const REL_DIST_M = 50;

export function relDistanceAt(t: number, t60100: number): number {
  const tc = Math.min(t, t60100);
  const accel = (40 * KMH_TO_MS * t60100 / 1.8) * Math.pow(tc / t60100, 1.8);
  const cruise = t > t60100 ? (t - t60100) * 40 * KMH_TO_MS : 0;
  return accel + cruise;
}

export function overtakeDuration(t60100: number): number {
  // Solve relDistanceAt(t) = REL_DIST_M. Within accel phase if possible, else extend.
  const atT = relDistanceAt(t60100, t60100);
  if (atT >= REL_DIST_M) {
    return t60100 * Math.pow((REL_DIST_M * 1.8) / (40 * KMH_TO_MS * t60100), 1 / 1.8);
  }
  return t60100 + (REL_DIST_M - atT) / (40 * KMH_TO_MS);
}

/** Own-car distance consumed during the overtake (m). */
export function overtakeDistance(t60100: number): number {
  const dur = overtakeDuration(t60100);
  return dur * 60 * KMH_TO_MS + relDistanceAt(dur, t60100);
}

export type OvertakeVerdict = "comfortable" | "needs planning" | "avoid on two-lane roads";
export function overtakeVerdict(durationS: number): OvertakeVerdict {
  if (durationS < 6) return "comfortable";
  if (durationS <= 9) return "needs planning";
  return "avoid on two-lane roads";
}

/* ---- Sim C: braking. Deceleration derived from the 100-0 figure:
 * a = v100² / (2 * d100). Braking distance from speed v: d = v²/(2a). */
export const REACTION_TIME_S = 1.0;

export function decelFromBraking100(d100m: number): number {
  const v100 = 100 * KMH_TO_MS;
  return (v100 * v100) / (2 * d100m);
}

export function brakingDistance(speedKmh: number, d100m: number): number {
  const v = speedKmh * KMH_TO_MS;
  return (v * v) / (2 * decelFromBraking100(d100m));
}

export function totalStoppingDistance(speedKmh: number, d100m: number): number {
  return speedKmh * KMH_TO_MS * REACTION_TIME_S + brakingDistance(speedKmh, d100m);
}

/** Impact speed (km/h) if an obstacle sits closer than the stopping distance; 0 if it stops in time. */
export function impactSpeed(speedKmh: number, d100m: number, obstacleM: number): number {
  const v = speedKmh * KMH_TO_MS;
  const reactionDist = v * REACTION_TIME_S;
  if (obstacleM <= reactionDist) return speedKmh; // still in reaction zone
  const a = decelFromBraking100(d100m);
  const vSq = v * v - 2 * a * (obstacleM - reactionDist);
  return vSq <= 0 ? 0 : Math.sqrt(vSq) / KMH_TO_MS;
}

/** Export a canvas as a PNG download. */
export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  a.click();
}
