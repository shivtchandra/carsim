// Cornering grip — deterministic and spec-derived. This is where handling "feels real" and
// differs per car: a heavier, softer car washes wide; a light, quick car holds the line.
// It never touches stepDrive's longitudinal calibration — the engine feeds the cap back as an
// induced brake (routed through the spec's own braking decel), so deceleration stays calibrated.

import type { TrackSurface } from "./track";

const G = 9.81;

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * Lateral grip coefficient. kerbWeight (kg) and t100 (0-100 s) are the real-spec levers:
 *  - mud roughly halves grip vs tarmac;
 *  - heavier than ~1.2 t scrubs progressively more grip;
 *  - genuinely quick cars (sub-9s) are tuned a touch grippier.
 */
export function muFor(surface: TrackSurface, kerbWeight: number, t100: number): number {
  const base = surface === "mud" ? 0.55 : 0.95;
  const weightPenalty = clamp((kerbWeight - 1200) / 1600, 0, 0.25);
  const sportBonus = t100 < 9 ? 0.06 : 0;
  return Math.max(0.3, base - weightPenalty + sportBonus);
}

/** Max speed (km/h) a corner of the given curvature can be taken at: v = sqrt(mu·g·r). */
export function cornerSpeedCapKmh(curvature: number, mu: number): number {
  const k = Math.abs(curvature);
  if (k < 1e-4) return Infinity; // straight
  const vMs = Math.sqrt((mu * G) / k);
  return vMs * 3.6;
}
