// Race track model — a centerline built from straight + constant-radius-arc segments,
// parameterised by arc length s (which equals the longitudinal distanceM from the physics).
//
// Heading convention: forward tangent = (cos θ, sin θ) in the (x, z) ground plane, so
//   dx = cos θ · ds, dz = sin θ · ds, and curvature κ = dθ/ds (signed, + turns toward +z).
// Both position and heading integrate in closed form per segment, so sampling is O(log n)
// with no spline math, and constant-radius arcs give exact curvature for the corner-grip cap.

export type TrackSurface = "tarmac" | "mud";

export interface Vec2 {
  x: number;
  z: number;
}

export interface TrackSegment {
  length: number; // metres of arc length
  curvature: number; // 1/radius, signed (+ left, - right). 0 = straight
  surface?: TrackSurface; // overrides baseSurface for this segment
  gradePct?: number; // elevation slope over this segment (rise/run %)
}

export interface TrackDef {
  id: string;
  name: string;
  width: number; // usable half-width each side of the centerline (m)
  baseSurface: TrackSurface;
  segments: TrackSegment[];
  laps: number; // 1 = point-to-point sprint
  environmentKit: "highway" | "offroad";
}

interface CompiledSegment {
  startS: number;
  endS: number;
  length: number;
  curvature: number;
  surface: TrackSurface;
  gradePct: number;
  startPos: Vec2;
  startHeading: number;
  startElevation: number;
}

export interface CompiledTrack {
  def: TrackDef;
  segments: CompiledSegment[];
  totalLength: number;
  width: number;
  baseSurface: TrackSurface;
}

export interface TrackSample {
  pos: Vec2; // centerline X,Z
  heading: number; // tangent yaw (radians)
  curvature: number;
  surface: TrackSurface;
  grade: number; // gradePct at this point
  elevation: number; // centerline Y
  edgeOffset: number; // usable half-width here
}

/** Precompute each segment's cumulative arc length + start pose so sampling is closed-form. */
export function buildTrack(def: TrackDef): CompiledTrack {
  const segments: CompiledSegment[] = [];
  let s = 0;
  let pos: Vec2 = { x: 0, z: 0 };
  let heading = 0;
  let elevation = 0;

  for (const seg of def.segments) {
    const surface = seg.surface ?? def.baseSurface;
    const gradePct = seg.gradePct ?? 0;
    segments.push({
      startS: s,
      endS: s + seg.length,
      length: seg.length,
      curvature: seg.curvature,
      surface,
      gradePct,
      startPos: { ...pos },
      startHeading: heading,
      startElevation: elevation,
    });

    // Advance pose to the end of this segment.
    const end = evalSegment(pos, heading, elevation, seg.curvature, gradePct, seg.length);
    pos = end.pos;
    heading = end.heading;
    elevation = end.elevation;
    s += seg.length;
  }

  return {
    def,
    segments,
    totalLength: s,
    width: def.width,
    baseSurface: def.baseSurface,
  };
}

/** Closed-form pose after travelling `ds` from (pos, heading, elevation) at constant curvature. */
function evalSegment(
  pos: Vec2,
  heading: number,
  elevation: number,
  curvature: number,
  gradePct: number,
  ds: number
): { pos: Vec2; heading: number; elevation: number } {
  let x: number;
  let z: number;
  let newHeading: number;

  if (Math.abs(curvature) < 1e-6) {
    x = pos.x + Math.cos(heading) * ds;
    z = pos.z + Math.sin(heading) * ds;
    newHeading = heading;
  } else {
    newHeading = heading + curvature * ds;
    x = pos.x + (Math.sin(newHeading) - Math.sin(heading)) / curvature;
    z = pos.z + (Math.cos(heading) - Math.cos(newHeading)) / curvature;
  }

  return {
    pos: { x, z },
    heading: newHeading,
    elevation: elevation + (gradePct / 100) * ds,
  };
}

/** Sample the centerline at arc length s (clamped to the track). */
export function sampleTrack(track: CompiledTrack, s: number): TrackSample {
  const clamped = Math.max(0, Math.min(s, track.totalLength));
  const seg = findSegment(track.segments, clamped);
  const ds = clamped - seg.startS;
  const end = evalSegment(
    seg.startPos,
    seg.startHeading,
    seg.startElevation,
    seg.curvature,
    seg.gradePct,
    ds
  );
  return {
    pos: end.pos,
    heading: end.heading,
    curvature: seg.curvature,
    surface: seg.surface,
    grade: seg.gradePct,
    elevation: end.elevation,
    edgeOffset: track.width,
  };
}

/** Left-hand normal (perpendicular to travel). Lateral offset = centerline + normal * laneOffset. */
export function leftNormal(heading: number): Vec2 {
  return { x: -Math.sin(heading), z: Math.cos(heading) };
}

/** Banking angle (radians) for a corner — tighter corners bank harder, capped ~9°. */
export function camberAngle(curvature: number): number {
  return Math.min(0.16, Math.abs(curvature) * 2.2);
}

/**
 * Height added by banking at a given lateral offset o (+o = left of travel).
 * The outside of the corner is raised, the inside dropped — so the road tilts into the turn.
 */
export function camberHeight(curvature: number, o: number): number {
  return -Math.sign(curvature) * camberAngle(curvature) * o;
}

function findSegment(segments: CompiledSegment[], s: number): CompiledSegment {
  let lo = 0;
  let hi = segments.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (segments[mid].startS <= s) lo = mid;
    else hi = mid - 1;
  }
  return segments[lo];
}
