// RaceEngine — pure, deterministic, no React/Three. One engine runs both DRIVE and SPECTATE:
// the only difference is whether an entrant's controller is "human" (fed the live pedals) or
// "ai" (decides its own pedals). Longitudinal motion is the existing stepDrive; cornering is the
// grip cap fed back as an induced brake + a lateral wash-out toward the outer edge.

import {
  stepDrive,
  initialDriveState,
  type DriveSpec,
  type DriveState,
  type DriveInputs,
  type TerrainType,
} from "@/lib/drive";
import { cornerSpeedCapKmh, muFor } from "./grip";
import { sampleTrack, type CompiledTrack, type TrackSurface } from "./track";

/** Live driver inputs for the human entrant. steer ∈ [-1,1] (left/right). */
export interface RaceInputs {
  throttle: number;
  brake: number;
  steer: number;
}

export const NEUTRAL_INPUTS: RaceInputs = { throttle: 0, brake: 0, steer: 0 };

export type ControllerKind = "human" | "ai" | "replay";

/** Read-only world view handed to a controller each step. */
export interface EntrantView {
  state: DriveState;
  spec: DriveSpec;
  kerbWeight: number;
  track: CompiledTrack;
}

export interface RaceController {
  kind: ControllerKind;
  decide(view: EntrantView): DriveInputs;
}

/** What the caller supplies to define a starting grid slot. */
export interface EntrantConfig {
  id: string;
  label: string;
  color: string;
  spec: DriveSpec;
  kerbWeight: number;
  controller: RaceController;
  startLaneOffset?: number;
}

export interface Entrant extends EntrantConfig {
  state: DriveState;
  laneOffset: number; // smoothed lateral offset from centerline (m)
  targetOffset: number;
  scrubbing: boolean; // over the corner cap this frame (drives tyre-scrub sound + dust)
  washOutFactor: number; // 0..1 how far over the cap (drives run-wide + camera read)
  finished: boolean;
  finishTimeS: number | null;
  position: number; // standings 1..N
}

export type RacePhase = "countdown" | "racing" | "finished";

export interface RaceWorld {
  track: CompiledTrack;
  entrants: Entrant[];
  elapsedS: number;
  phase: RacePhase;
  countdownS: number;
}

const COUNTDOWN_S = 3.2;
const LANE_STEER_SPEED = 4.5; // m/s of lateral travel at full steer (ported from DriveMode)
const LANE_SMOOTH = 8; // exponential follow rate for laneOffset

function surfaceToTerrain(surface: TrackSurface): TerrainType {
  return surface === "mud" ? "offroad" : "highway";
}

export function createRaceWorld(track: CompiledTrack, configs: EntrantConfig[]): RaceWorld {
  const entrants: Entrant[] = configs.map((c) => ({
    ...c,
    state: { ...initialDriveState },
    laneOffset: c.startLaneOffset ?? 0,
    targetOffset: c.startLaneOffset ?? 0,
    scrubbing: false,
    washOutFactor: 0,
    finished: false,
    finishTimeS: null,
    position: 0,
  }));
  return { track, entrants, elapsedS: 0, phase: "countdown", countdownS: COUNTDOWN_S };
}

/** Advance the whole field by dt. humanInputs are applied to any entrant with a "human" controller. */
export function stepRaceWorld(world: RaceWorld, dt: number, humanInputs: RaceInputs): void {
  if (world.phase === "countdown") {
    world.countdownS -= dt;
    if (world.countdownS <= 0) {
      world.countdownS = 0;
      world.phase = "racing";
    }
    return; // engines lit, nobody moves until the lights go out
  }

  world.elapsedS += dt;

  // 1. AI Decision and Overtaking lane adjustments
  for (const e of world.entrants) {
    if (e.finished || (e.state.integrity ?? 100) <= 0) continue;

    const isHuman = e.controller.kind === "human";
    if (!isHuman) {
      // Find if there is a car directly in front of us in the same lane offset range
      let carAhead = false;
      let closestDist = 999;
      for (const other of world.entrants) {
        if (other === e || (other.state.integrity ?? 100) <= 0) continue;
        const dist = other.state.distanceM - e.state.distanceM;
        if (dist > 0 && dist < 18 && Math.abs(other.laneOffset - e.laneOffset) < 1.3) {
          carAhead = true;
          if (dist < closestDist) closestDist = dist;
        }
      }

      if (carAhead) {
        // Try to change lanes to overtake
        const leftTarget = e.laneOffset + 1.5;
        const rightTarget = e.laneOffset - 1.5;
        const trackLimit = world.track.width - 0.6;

        if (leftTarget <= trackLimit) {
          e.targetOffset = leftTarget;
        } else if (rightTarget >= -trackLimit) {
          e.targetOffset = rightTarget;
        }
      } else {
        // Return slowly to starting grid line or centerline racing line
        const gridLine = e.startLaneOffset ?? 0;
        e.targetOffset += (gridLine - e.targetOffset) * Math.min(1, dt * 1.5);
      }
    }
  }

  // 2. Physics step for each entrant
  for (const e of world.entrants) {
    const sample = sampleTrack(world.track, e.state.distanceM);
    const terrain = surfaceToTerrain(sample.surface);

    // DNF checks
    const isDnf = (e.state.integrity ?? 100) <= 0;
    if (isDnf) {
      e.state.speedKmh = Math.max(0, e.state.speedKmh - 45 * dt);
      e.state.lateralVel = e.state.lateralVel ? e.state.lateralVel * 0.9 : 0;
      e.laneOffset += e.state.lateralVel * dt;
      e.finished = true;
      e.finishTimeS = null; // Mark as DNF
      continue;
    }

    if (e.finished) {
      // Coast to a stop past the line
      e.state = stepDrive(e.state, { throttle: 0, brake: 0.4 }, e.spec, dt, terrain);
      e.state.lateralVel = (e.state.lateralVel ?? 0) * 0.9;
      e.laneOffset += (e.state.lateralVel ?? 0) * dt;
      continue;
    }

    const isHuman = e.controller.kind === "human";
    let inputs: DriveInputs = isHuman
      ? { throttle: humanInputs.throttle, brake: humanInputs.brake }
      : e.controller.decide({ state: e.state, spec: e.spec, kerbWeight: e.kerbWeight, track: world.track });

    // Dynamic Grip Physics - Traction Circle & Drift sliding
    const mu = muFor(sample.surface, e.kerbWeight, e.spec.t100);
    const fMax = mu * 9.81; // Max grip acceleration in m/s2

    // Approximate longitudinal acceleration effort
    const effectiveThrottle = e.state.clutchActive ? 0 : inputs.throttle;
    const aLong = effectiveThrottle * (70 / e.spec.t100) - inputs.brake * (100 / e.spec.d100) * 8.5;

    // Lateral grip budget from friction circle: aLatMax^2 + aLong^2 <= fMax^2
    const aLatMax = Math.sqrt(Math.max(0.1, fMax * fMax - aLong * aLong));

    // Centrifugal acceleration pulling car outward: aCentrifugal = v^2 * curvature
    const vMs = e.state.speedKmh * 0.278;
    const aCentrifugal = vMs * vMs * sample.curvature;

    // Desired steering input
    const steer = isHuman ? humanInputs.steer : clamp((e.targetOffset - e.laneOffset) * 1.2, -1, 1);
    const aSteer = steer * 5.0; // Desired steering acceleration in m/s2

    // Net desired lateral acceleration relative to track center
    const aLatDesired = aSteer - aCentrifugal;

    // Apply grip limit clamp
    const aLatActual = clamp(aLatDesired, -aLatMax, aLatMax);

    // Calculate tyre slip amount (how much desired accel exceeds actual grip)
    const slip = Math.abs(aLatDesired - aLatActual);
    e.scrubbing = false;
    e.washOutFactor = 0;
    e.state.slideAmount = 0;
    if (slip > 0.6 && vMs > 4) {
      e.scrubbing = true;
      e.washOutFactor = Math.min(1.0, slip / 4.0);
      e.state.slideAmount = Math.min(1.0, slip / 3.0);
    }

    // Set slide amount on the state so stepDrive can read it for longitudinal traction penalty
    e.state.slideAmount = e.state.slideAmount;

    // Update state using stepDrive
    e.state = stepDrive(e.state, inputs, e.spec, dt, terrain);

    // Gravity along the slope: climbs bleed speed, descents add it. Heavier / less powerful
    // cars (slower t100) lose more on the steep mud, so power-to-weight decides the hills.
    if (Math.abs(sample.grade) > 0.5) {
      const slopeRad = Math.atan(sample.grade / 100);
      const gravityKmhPerS = 9.81 * Math.sin(slopeRad) * 3.6; // + uphill, - downhill
      const powerFactor = sample.grade > 0 ? 1 + (e.spec.t100 - 9) * 0.04 : 1; // slow cars struggle more uphill
      e.state.speedKmh = Math.max(0, Math.min(e.spec.topSpeedKmh, e.state.speedKmh - gravityKmhPerS * powerFactor * dt));
    }

    // Integrate lateral velocity
    let latVel = e.state.lateralVel ?? 0;
    latVel += aLatActual * dt;
    latVel = clamp(latVel, -6.0, 6.0);

    // Damp lateral velocities if no steering is active to prevent weaving
    if (steer === 0 && !e.scrubbing) {
      latVel += (0 - latVel) * Math.min(1.0, dt * 6.0);
    }

    e.laneOffset += latVel * dt;
    e.state.lateralVel = latVel;

    // Wall impact boundaries check
    const trackHalfWidth = world.track.width - 0.4;
    if (Math.abs(e.laneOffset) > trackHalfWidth) {
      e.laneOffset = Math.sign(e.laneOffset) * trackHalfWidth;
      e.state.lateralVel = -latVel * 0.35; // bounce off wall

      // Wall crash speed penalty & damage
      if (Math.abs(latVel) > 0.8) {
        e.state.speedKmh = Math.max(0, e.state.speedKmh - Math.abs(latVel) * 6.0);
        const damage = Math.round(Math.abs(latVel) * 10.0);
        e.state.integrity = Math.max(0, (e.state.integrity ?? 100) - damage);
      }
    }

    if (e.state.distanceM >= world.track.totalLength) {
      e.finished = true;
      e.finishTimeS = world.elapsedS;
    }
  }

  // 3. Car-to-car Collisions & Bounces
  for (let i = 0; i < world.entrants.length; i++) {
    const A = world.entrants[i];
    if (A.finished || (A.state.integrity ?? 100) <= 0) continue;

    for (let j = i + 1; j < world.entrants.length; j++) {
      const B = world.entrants[j];
      if (B.finished || (B.state.integrity ?? 100) <= 0) continue;

      const distDiff = Math.abs(A.state.distanceM - B.state.distanceM);
      const laneDiff = Math.abs(A.laneOffset - B.laneOffset);

      // Collide if close longitudinally (within 4.8m) and laterally (within 1.3m)
      if (distDiff < 4.8 && laneDiff < 1.3) {
        // Push apart laterally
        const pushVel = 3.5;
        if (A.laneOffset > B.laneOffset) {
          A.state.lateralVel = pushVel;
          B.state.lateralVel = -pushVel;
        } else {
          A.state.lateralVel = -pushVel;
          B.state.lateralVel = pushVel;
        }

        // speed losses
        A.state.speedKmh = Math.max(0, A.state.speedKmh - 16);
        B.state.speedKmh = Math.max(0, B.state.speedKmh - 16);

        // damage penalty
        A.state.integrity = Math.max(0, (A.state.integrity ?? 100) - 15);
        B.state.integrity = Math.max(0, (B.state.integrity ?? 100) - 15);

        // check DNF
        if (A.state.integrity <= 0) {
          A.finished = true;
          A.finishTimeS = null;
        }
        if (B.state.integrity <= 0) {
          B.finished = true;
          B.finishTimeS = null;
        }
      }
    }
  }

  recomputeStandings(world);

  if (world.entrants.every((e) => e.finished)) {
    world.phase = "finished";
  }
}

function recomputeStandings(world: RaceWorld): void {
  const order = [...world.entrants].sort((a, b) => {
    const aDnf = (a.state.integrity ?? 100) <= 0;
    const bDnf = (b.state.integrity ?? 100) <= 0;
    
    // DNF goes to bottom
    if (aDnf && bDnf) return b.state.distanceM - a.state.distanceM;
    if (aDnf) return 1;
    if (bDnf) return -1;

    if (a.finished && b.finished) {
      if (a.finishTimeS === null) return 1;
      if (b.finishTimeS === null) return -1;
      return (a.finishTimeS ?? 0) - (b.finishTimeS ?? 0);
    }
    if (a.finished) return -1;
    if (b.finished) return 1;
    return b.state.distanceM - a.state.distanceM;
  });
  
  order.forEach((e, i) => {
    e.position = i + 1;
  });
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}
