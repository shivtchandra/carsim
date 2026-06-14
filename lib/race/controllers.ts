// Controllers decide an entrant's pedals each step. The human controller is a passthrough
// (the engine feeds it the live pedals); the AI plans braking for upcoming corners using the
// car's OWN measured braking distance, so a car with better real brakes brakes later — and a
// genuinely faster car still wins on spec while staying beatable by a smooth driver.

import { brakingDistance } from "@/lib/sim";
import type { DriveInputs } from "@/lib/drive";
import { cornerSpeedCapKmh, muFor } from "./grip";
import { sampleTrack } from "./track";
import type { EntrantView, RaceController } from "./engine";

/** Engine feeds live pedals to human entrants; decide() is never actually called for them. */
export const humanController: RaceController = {
  kind: "human",
  decide: () => ({ throttle: 0, brake: 0 }),
};

/**
 * AI: full throttle on straights, brake to hit the next corner's cap.
 * skill ∈ [0.85, 1.0] lowers the target corner speed slightly + adds a tiny deterministic
 * throttle waver, so rivals are imperfect but race to their true spec.
 */
export function aiController(skill = 1, seed = 1): RaceController {
  const sk = Math.max(0.7, Math.min(1, skill));
  const LOOKAHEAD_STEP = 4; // m
  const MARGIN = 6; // m of slack before the corner

  return {
    kind: "ai",
    decide(view: EntrantView): DriveInputs {
      const { state, spec, kerbWeight, track } = view;
      const speed = state.speedKmh;
      const s = state.distanceM;

      // How far ahead could we need to start braking, plus a margin.
      const horizon = brakingDistance(speed, spec.d100) + MARGIN + 10;
      let brake = 0;

      for (let ds = 2; ds <= horizon; ds += LOOKAHEAD_STEP) {
        const sample = sampleTrack(track, s + ds);
        if (Math.abs(sample.curvature) < 1e-4) continue;
        const mu = muFor(sample.surface, kerbWeight, spec.t100) * sk;
        const cap = cornerSpeedCapKmh(sample.curvature, mu);
        if (speed <= cap) continue;
        // Distance needed to bleed from current speed down to the cap.
        const needed = brakingDistance(speed, spec.d100) - brakingDistance(cap, spec.d100);
        if (needed >= ds - MARGIN) {
          const urgency = (needed - (ds - MARGIN)) / 10 + 0.45;
          brake = Math.max(brake, Math.min(1, urgency));
        }
      }

      if (brake > 0) return { throttle: 0, brake };

      // Slight, deterministic throttle waver so rivals don't look robotic.
      const waver = (1 - sk) * 0.5 * Math.max(0, Math.sin(state.timeS * (1.6 + seed * 0.4) + seed));
      return { throttle: Math.max(0.8, sk - waver), brake: 0 };
    },
  };
}

/** Reserved seam for ghost/share replays (not used in the vertical slice). */
export function replayController(samples: DriveInputs[]): RaceController {
  let i = 0;
  return {
    kind: "replay",
    decide(): DriveInputs {
      const next = samples[Math.min(i, samples.length - 1)] ?? { throttle: 0, brake: 0 };
      i++;
      return next;
    },
  };
}
