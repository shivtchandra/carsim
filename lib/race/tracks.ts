// The two vertical-slice tracks. The contrast is mechanical, not cosmetic: width (5.5 vs 2.2 m),
// curvature (gentle sweeps vs tight switchbacks) and surface (tarmac μ0.95 vs mud μ0.55) all change
// the corner caps, so the SAME car flows on the highway and crawls carefully up the trail.

import type { TrackDef } from "./track";

export const HIGHWAY_SPRINT: TrackDef = {
  id: "highway-sprint",
  name: "Highway Sprint",
  width: 5.5,
  baseSurface: "tarmac",
  laps: 1,
  environmentKit: "highway",
  segments: [
    { length: 240, curvature: 0 },
    { length: 130, curvature: 0.0026 }, // gentle left sweep (r ≈ 385 m)
    { length: 200, curvature: 0 },
    { length: 150, curvature: -0.0022 }, // gentle right sweep (r ≈ 455 m)
    { length: 170, curvature: 0 },
    { length: 120, curvature: 0.0034 }, // slightly tighter left (cap ≈ 188 km/h)
    { length: 260, curvature: 0 }, // run to the line
  ],
};

export const HILL_MUD_TRAIL: TrackDef = {
  id: "hill-mud-trail",
  name: "Hill / Mud Trail",
  width: 2.6,
  baseSurface: "mud",
  laps: 1,
  environmentKit: "offroad",
  // Hill Climb-style profile: big rolling climbs and descents the car visibly fights up
  // and rushes down, with switchbacks pinned to the crests and dips.
  segments: [
    { length: 36, curvature: 0, gradePct: 0 }, // start flat
    { length: 48, curvature: 0, gradePct: 20 }, // steep first climb
    { length: 30, curvature: 0.05, gradePct: 13 }, // climbing left bend
    { length: 34, curvature: 0, gradePct: 24 }, // wall of a climb
    { length: 26, curvature: -0.06, gradePct: 3 }, // crest, right bend
    { length: 42, curvature: 0, gradePct: -18 }, // plunging descent
    { length: 30, curvature: 0.055, gradePct: -9 }, // descending left switchback
    { length: 38, curvature: 0, gradePct: 16 }, // climb back up
    { length: 26, curvature: -0.07, gradePct: 5 }, // tight right at the top
    { length: 46, curvature: 0, gradePct: -22 }, // big drop
    { length: 30, curvature: 0.05, gradePct: 10 }, // climb out left
    { length: 34, curvature: 0, gradePct: -8 }, // rolling dip
    { length: 56, curvature: 0, gradePct: 0 }, // run to the line
  ],
};

export const RACE_TRACKS: TrackDef[] = [HIGHWAY_SPRINT, HILL_MUD_TRAIL];

export function getTrackDef(id: string): TrackDef {
  return RACE_TRACKS.find((t) => t.id === id) ?? HIGHWAY_SPRINT;
}
