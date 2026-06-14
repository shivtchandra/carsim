// Test Drive physics + events engine (deterministic, calibrated to each variant's own data).
//
// Acceleration model: inverting the spec velocity profile v(t) = 100·(t/t100)^0.8 gives
//   a(v) = (80 / t100) · (100 / v)^0.25  [km/h per second]
// so a full-throttle run from rest reproduces the variant's 0–100 time exactly.
// Braking decel comes from the variant's braking100to0 figure. Throttle/brake scale linearly.
//
// Suspension: spring-damper model. Road surface height feeds into body displacement via
//   x'' = k*(roadY - x) - c*x'
// Stiffness (k) is derived from t100 — fast/sporty cars get stiffer tuning.

import { KMH_TO_MS, decelFromBraking100 } from "./sim";
import type { DriveCoverage, DriveMeasuredMetric, DriveSectorId } from "./types";

export interface DriveSpec {
  t100: number; // seconds, from test-data
  d100: number; // braking 100-0 metres, from test-data
  ps: number;
  topSpeedKmh: number;
}

export function makeDriveSpec(t100: number, d100: number, ps: number): DriveSpec {
  return { t100, d100, ps, topSpeedKmh: Math.min(190, 120 + ps / 3) };
}

export interface DriveState {
  speedKmh: number;
  distanceM: number;
  timeS: number;
  zeroTo100S: number | null; // recorded on first crossing of 100 from a standing start
  suspensionOffsetM: number; // body vertical displacement from neutral (metres)
  suspensionVelMs: number;   // suspension mass velocity (m/s)
  // Extended fields for real car physics and racing
  gear: number;
  rpm: number;
  integrity: number;
  slideAmount: number;
  lateralVel: number;
  clutchActive: boolean;
  clutchTimer: number;
}

export const initialDriveState: DriveState = {
  speedKmh: 0,
  distanceM: 0,
  timeS: 0,
  zeroTo100S: null,
  suspensionOffsetM: 0,
  suspensionVelMs: 0,
  gear: 1,
  rpm: 1000,
  integrity: 100,
  slideAmount: 0,
  lateralVel: 0,
  clutchActive: false,
  clutchTimer: 0,
};

export interface DriveInputs {
  throttle: number; // 0..1
  brake: number; // 0..1
}

export interface DriveSector {
  id: DriveSectorId;
  label: string;
  startM: number;
  endM: number;
  terrain: TerrainType;
  requiredMetrics: DriveMeasuredMetric[];
  prompt: string;
  targetBandKmh?: [number, number];
  obstacleAtM?: number;
  brakeMarkerAtM?: number;
}

export interface DriveTrialScenario {
  id: "drive-trial";
  label: string;
  sectors: DriveSector[];
  finishAtM: number;
}

/* ---- Terrain ---- */

export type TerrainType = "highway" | "city" | "speedbump" | "offroad";

export const TERRAIN_LABELS: Record<TerrainType, string> = {
  highway: "Proving Ground",
  city: "Urban Handling",
  speedbump: "Speed Breaker Lane",
  offroad: "Hilly Mud Trail",
};

/**
 * Returns the road surface vertical height at a given position (metres).
 * The suspension spring then pulls the car body toward this target.
 */
export function terrainRoadHeight(distM: number, terrain: TerrainType): number {
  if (terrain === "highway") return 0;

  if (terrain === "speedbump") {
    // Classic Indian speed breaker: half-sine profile, 0.12 m high, 2 m wide, every 80 m
    const posInCycle = distM % 80;
    if (posInCycle < 2) {
      return 0.12 * Math.sin((posInCycle / 2) * Math.PI);
    }
    return 0;
  }

  if (terrain === "city") {
    // Potholes: deterministic per slot, ~0.05 m dips
    const slot = Math.floor(distM / 22);
    const slotOffset = distM - slot * 22;
    const hash = Math.abs(Math.sin(slot * 127.3 + 43.1));
    if (hash < 0.35 && slotOffset < 1.5) {
      return -0.05 * Math.sin((slotOffset / 1.5) * Math.PI);
    }
    return 0;
  }

  if (terrain === "offroad") {
    // Continuous sum-of-sines giving rough uneven surface
    return (
      0.07 * Math.sin(distM * 0.7) +
      0.04 * Math.sin(distM * 1.9 + 1.2) +
      0.02 * Math.sin(distM * 3.7 + 0.8)
    );
  }

  return 0;
}

/** Suspension stiffness (k) and damping (c): fast/sporty = stiff, heavy/slow = soft. */
function suspStiffness(spec: DriveSpec): { k: number; c: number } {
  if (spec.t100 < 10) return { k: 30, c: 9 };   // turbo DCT — firm, short travel
  if (spec.t100 > 13) return { k: 14, c: 4.5 }; // diesel AT / big SUV — soft, floaty
  return { k: 20, c: 6 };                         // mid-range
}

/* ---- Longitudinal + suspension step ---- */

const COAST_DECEL_MS2 = 0.35; // drag + rolling resistance, gentle

export function stepDrive(
  s: DriveState,
  inputs: DriveInputs,
  spec: DriveSpec,
  dtS: number,
  terrain: TerrainType = "highway"
): DriveState {
  const v = s.speedKmh;
  const topSpeed = spec.topSpeedKmh;

  // 1. Shifting & Clutch logic
  let gear = s.gear ?? 1;
  let clutchActive = s.clutchActive ?? false;
  let clutchTimer = s.clutchTimer ?? 0;

  const gearMaxSpeeds = [
    0,
    0.18 * topSpeed, // 1st
    0.32 * topSpeed, // 2nd
    0.48 * topSpeed, // 3rd
    0.65 * topSpeed, // 4th
    0.82 * topSpeed, // 5th
    1.00 * topSpeed, // 6th
  ];

  const gearMinSpeeds = [
    0,
    0,
    0.12 * topSpeed,
    0.26 * topSpeed,
    0.42 * topSpeed,
    0.58 * topSpeed,
    0.74 * topSpeed,
  ];

  if (clutchTimer > 0) {
    clutchTimer = Math.max(0, clutchTimer - dtS);
    if (clutchTimer <= 0) {
      clutchActive = false;
    }
  }

  if (!clutchActive) {
    if (v > gearMaxSpeeds[gear] * 0.95 && gear < 6) {
      gear += 1;
      clutchActive = true;
      clutchTimer = 0.15; // 150ms shift duration
    } else if (v < gearMinSpeeds[gear] && gear > 1) {
      gear -= 1;
      clutchActive = true;
      clutchTimer = 0.10; // 100ms downshift
    }
  }

  // 2. Engine RPM calculation
  let rpm = 1000;
  if (clutchActive) {
    // Engine drops towards idle during shift
    rpm = Math.max(1000, (s.rpm ?? 1000) - 22000 * dtS);
  } else {
    if (v < 6 && gear === 1) {
      // Clutch slipping at launch
      rpm = 1000 + (v / 6) * 1200 + inputs.throttle * 800;
    } else {
      const minSpd = gearMinSpeeds[gear];
      const maxSpd = gearMaxSpeeds[gear];
      const ratio = (v - minSpd) / (maxSpd - minSpd || 1);
      rpm = 2000 + Math.max(0, Math.min(1, ratio)) * 4500;
    }
  }

  // 3. Longitudinal acceleration (power cut during shift)
  const effectiveThrottle = clutchActive ? 0 : inputs.throttle;

  // accel in km/h per second, fading to zero at top speed
  const accelCurve = (80 / spec.t100) * Math.pow(100 / Math.max(v, 2), 0.25);
  // fade only near top speed so the 0-100 calibration stays true
  const topFade = Math.max(0, 1 - Math.pow(v / topSpeed, 8));
  
  // Slide traction penalty: if sliding, reduce longitudinal traction budget
  const slidePenalty = Math.max(0.2, 1 - (s.slideAmount ?? 0) * 0.65);
  const accel = effectiveThrottle * accelCurve * topFade * slidePenalty;
  
  const brake = inputs.brake * (decelFromBraking100(spec.d100) / KMH_TO_MS) * KMH_TO_MS * 3.6; // m/s² → km/h per s
  const coast = (1 - effectiveThrottle) * COAST_DECEL_MS2 * 3.6;

  let speed = v + (accel - brake - coast) * dtS;
  speed = Math.max(0, Math.min(speed, topSpeed));

  const distanceM = s.distanceM + ((v + speed) / 2) * KMH_TO_MS * dtS;
  const timeS = s.timeS + dtS;
  let zeroTo100S = s.zeroTo100S;
  if (zeroTo100S === null && speed >= 100 && v < 100) zeroTo100S = timeS;

  // Suspension spring-damper: body follows road surface with lag from stiffness/damping
  const { k: suspK, c: suspC } = suspStiffness(spec);
  const roadY = terrainRoadHeight(distanceM, terrain);
  const springF = suspK * (roadY - s.suspensionOffsetM);
  const dampF = -suspC * s.suspensionVelMs;
  const newSuspVel = s.suspensionVelMs + (springF + dampF) * dtS;
  let newSuspOff = s.suspensionOffsetM + newSuspVel * dtS;
  // clamp to physical travel limits
  newSuspOff = Math.max(-0.08, Math.min(0.15, newSuspOff));

  return {
    speedKmh: speed,
    distanceM,
    timeS,
    zeroTo100S,
    suspensionOffsetM: newSuspOff,
    suspensionVelMs: newSuspVel,
    gear,
    rpm,
    integrity: s.integrity ?? 100,
    slideAmount: s.slideAmount ?? 0,
    lateralVel: s.lateralVel ?? 0,
    clutchActive,
    clutchTimer,
  };
}

/* ---- Trial scenarios and sector scoring ---- */
export interface DriveEvent {
  id: string;
  trigger: { atDistanceM?: number; atSpeedKmh?: number };
  type: "obstacle" | "prompt" | "end";
  /** obstacle: where it sits; prompt: message shown */
  obstacleAtM?: number;
  message?: string;
}

export function firedEvents(state: DriveState, events: DriveEvent[], already: Set<string>): DriveEvent[] {
  const out: DriveEvent[] = [];
  for (const e of events) {
    if (already.has(e.id)) continue;
    const distOk = e.trigger.atDistanceM === undefined || state.distanceM >= e.trigger.atDistanceM;
    const speedOk = e.trigger.atSpeedKmh === undefined || state.speedKmh >= e.trigger.atSpeedKmh;
    if (distOk && speedOk) out.push(e);
  }
  return out;
}

export function buildDriveTrial(terrain: TerrainType): DriveTrialScenario {
  const controlPrompt =
    terrain === "city"
      ? "Control Sector: keep the car calm through the urban corridor. Ride quality and speed discipline matter here."
      : terrain === "speedbump"
      ? "Control Sector: speed breakers ahead. Smooth inputs preserve composure."
      : terrain === "offroad"
      ? "Control Sector: hilly mud trail ahead. Expect ridges, loose surface, and more body movement."
      : "Control Sector: settle the car and hold a stable pace through the proving ground.";

  return {
    id: "drive-trial",
    label: "Drive Trial",
    finishAtM: 760,
    sectors: [
      {
        id: "launch",
        label: "Launch Sector",
        startM: 0,
        endM: 180,
        terrain: "highway",
        requiredMetrics: ["zeroTo100"],
        prompt: "Launch Sector: full throttle out of the gate. Measured 0–100 timing, when available, powers this split.",
      },
      {
        id: "control",
        label: "Control Sector",
        startM: 180,
        endM: 470,
        terrain,
        requiredMetrics: [],
        targetBandKmh: terrain === "offroad" ? [25, 45] : terrain === "speedbump" ? [30, 48] : terrain === "city" ? [35, 58] : [50, 75],
        prompt: controlPrompt,
      },
      {
        id: "brake",
        label: "Brake Sector",
        startM: 470,
        endM: 760,
        terrain: "highway",
        requiredMetrics: ["braking100to0"],
        obstacleAtM: 700,
        brakeMarkerAtM: 610,
        prompt: "Brake Sector: red box ahead. Hit the brakes, stop cleanly, and avoid the barrier.",
      },
    ],
  };
}

export function sectorForDistance(distanceM: number, scenario: DriveTrialScenario): DriveSector {
  return (
    scenario.sectors.find((sector) => distanceM >= sector.startM && distanceM < sector.endM) ??
    scenario.sectors[scenario.sectors.length - 1]
  );
}

export function trialEvents(scenario: DriveTrialScenario): DriveEvent[] {
  return scenario.sectors.flatMap((sector) => {
    const events: DriveEvent[] = [
      {
        id: `${sector.id}-prompt`,
        trigger: { atDistanceM: sector.startM + 2 },
        type: "prompt",
        message: sector.prompt,
      },
    ];

    if (sector.obstacleAtM) {
      events.push({
        id: `${sector.id}-obstacle`,
        trigger: { atDistanceM: sector.startM + 30 },
        type: "obstacle",
        obstacleAtM: sector.obstacleAtM,
        message: `Obstacle deployed at ${sector.obstacleAtM} m. Stop before the impact wall.`,
      });
    }

    return events;
  }).concat({
    id: "trial-end",
    trigger: { atDistanceM: scenario.finishAtM },
    type: "end",
    message: "Trial complete.",
  });
}

export function sectorIsCertified(sector: DriveSector, coverage: DriveCoverage): boolean {
  return sector.requiredMetrics.every((metric) => coverage.metrics[metric].measured);
}

export function launchScore(actualT100: number | null, spec: DriveSpec): number {
  if (!actualT100) return 32;
  const deltaRatio = Math.abs(actualT100 - spec.t100) / spec.t100;
  return Math.round(Math.max(20, 100 - deltaRatio * 220));
}

export function controlScore(
  inBandRatio: number,
  suspensionPeakM: number,
  brakePanicCount: number,
  terrain: TerrainType
): number {
  const targetComfort = terrain === "offroad" ? 0.13 : terrain === "speedbump" ? 0.1 : terrain === "city" ? 0.08 : 0.06;
  const composurePenalty = Math.max(0, (suspensionPeakM - targetComfort) * 380);
  const bandScore = inBandRatio * 100;
  return Math.round(Math.max(18, Math.min(100, bandScore - composurePenalty - brakePanicCount * 8)));
}

export function brakingScore(stoppedBeforeObstacle: boolean, spareDistanceM: number, impactKmh: number): number {
  if (!stoppedBeforeObstacle) return Math.max(0, Math.round(42 - impactKmh * 0.45));
  return Math.round(Math.max(45, Math.min(100, 72 + spareDistanceM * 3.8)));
}

export function overallGrade(scores: number[], certified: boolean): string {
  const avg = scores.reduce((sum, score) => sum + score, 0) / Math.max(scores.length, 1);
  if (!certified) return avg >= 80 ? "Preview A" : avg >= 65 ? "Preview B" : "Preview C";
  if (avg >= 92) return "Platinum";
  if (avg >= 82) return "Gold";
  if (avg >= 70) return "Silver";
  return "Bronze";
}
