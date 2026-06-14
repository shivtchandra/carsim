import { models } from "./data";
import type { Model, Segment } from "./types";

export type BodyDimensionKey = "wheelbase" | "length" | "width" | "height";

export interface BodyDimensions {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
}

export interface DimensionBlueprint {
  carLeft: number;
  carRight: number;
  frontHubX: number;
  rearHubX: number;
  hubY: number;
  roofY: number;
  groundY: number;
  widthCenterX: number;
  widthCenterY: number;
  widthRx: number;
  lengthScale: number;
  heightScale: number;
  carCenterX: number;
}

const FLEET_BOUNDS = {
  length: [3827, 4695] as const,
  width: [1695, 1917] as const,
  height: [1485, 1860] as const,
  wheelbase: [2445, 3000] as const,
};

function norm(value: number, [lo, hi]: readonly [number, number]) {
  return Math.max(0, Math.min(1, (value - lo) / (hi - lo)));
}

function segmentPeers(segment: Segment) {
  return models.filter((m) => m.segment === segment);
}

function segmentMedian(segment: Segment, pick: (m: Model) => number) {
  const values = segmentPeers(segment).map(pick).sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}

function compareToSegment(value: number, median: number, kind: "wheelbase" | "length" | "width" | "height") {
  const delta = value - median;
  if (Math.abs(delta) < 25) {
    const labels = {
      wheelbase: "wheelbase",
      length: "overall length",
      width: "width",
      height: "height",
    };
    return `about average ${labels[kind]} for its segment`;
  }
  const abs = Math.round(Math.abs(delta));
  if (kind === "wheelbase") return delta > 0 ? `${abs} mm longer than the segment median` : `${abs} mm shorter than the segment median`;
  if (kind === "length") return delta > 0 ? `${abs} mm longer than rivals in this class` : `${abs} mm shorter than rivals in this class`;
  if (kind === "width") return delta > 0 ? `${abs} mm wider than the segment median` : `${abs} mm narrower than the segment median`;
  return delta > 0 ? `${abs} mm taller than the segment median` : `${abs} mm lower than the segment median`;
}

function fmtMm(mm: number) {
  return `${mm.toLocaleString("en-IN")} mm`;
}

export function getBodyDimensions(model: Model): BodyDimensions {
  const { lengthMm, widthMm, heightMm, wheelbaseMm } = model.dimensions;
  return { lengthMm, widthMm, heightMm, wheelbaseMm };
}

/** Scale the fixed blueprint silhouette to this car's proportions. */
export function computeDimensionBlueprint(
  dims: BodyDimensions,
  bodyStyle: Model["bodyStyle"]
): DimensionBlueprint {
  const viewW = 380;
  const padL = 12;
  const padR = 12;
  const usableW = viewW - padL - padR;
  const groundY = 130;

  const lengthNorm = norm(dims.lengthMm, FLEET_BOUNDS.length);
  const carLengthPx = usableW * (0.68 + lengthNorm * 0.32);
  const carLeft = padL + (usableW - carLengthPx) / 2;
  const carRight = carLeft + carLengthPx;
  const carCenterX = (carLeft + carRight) / 2;

  const wbPx = carLengthPx * (dims.wheelbaseMm / dims.lengthMm);
  const frontOverhangRatio = ((dims.lengthMm - dims.wheelbaseMm) * 0.42) / dims.lengthMm;
  const frontHubX = carLeft + carLengthPx * frontOverhangRatio;
  const rearHubX = frontHubX + wbPx;
  const hubY = groundY - 15;

  const heightNorm = norm(dims.heightMm, FLEET_BOUNDS.height);
  const bodyHeightPx = 62 + heightNorm * 36;
  const sedanFactor = bodyStyle === "sedan" ? 0.88 : 1;
  const roofY = groundY - bodyHeightPx * sedanFactor;

  const widthNorm = norm(dims.widthMm, FLEET_BOUNDS.width);
  const widthRx = 26 + widthNorm * 14;
  const widthCenterY = roofY + (bodyStyle === "sedan" ? 22 : 18);

  const baseLengthPx = 335;
  const baseHeightPx = 98;
  const lengthScale = carLengthPx / baseLengthPx;
  const heightScale = (bodyHeightPx * sedanFactor) / baseHeightPx;

  return {
    carLeft,
    carRight,
    frontHubX,
    rearHubX,
    hubY,
    roofY,
    groundY,
    widthCenterX: carCenterX,
    widthCenterY,
    widthRx,
    lengthScale,
    heightScale,
    carCenterX,
  };
}

function legroomNote(wheelbaseMm: number, median: number) {
  if (wheelbaseMm >= median + 80) {
    return "Expect noticeably more rear knee room and a calmer highway ride than most rivals.";
  }
  if (wheelbaseMm >= median + 30) {
    return "Rear-seat space is a step above average for the class.";
  }
  if (wheelbaseMm <= median - 50) {
    return "Rear legroom is tighter — best if back-seat use is occasional.";
  }
  return "Rear space is typical for cars in this segment.";
}

function lengthNote(lengthMm: number, median: number, bodyStyle: Model["bodyStyle"]) {
  const meters = (lengthMm / 1000).toFixed(2);
  if (lengthMm >= median + 120) {
    return `At ${meters} m bumper-to-bumper, it feels large in tight parking but gives the cabin a premium sense of space.`;
  }
  if (lengthMm <= median - 120) {
    return `At ${meters} m, it stays easy to slot into city gaps and basement ramps — a practical ${bodyStyle === "suv" ? "SUV" : "sedan"} footprint.`;
  }
  return `At ${meters} m overall, it balances city maneuverability with enough cabin length for comfortable family use.`;
}

function widthNote(widthMm: number, median: number) {
  if (widthMm >= median + 40) {
    return "The wider body helps stability at speed and gives the second row more shoulder room for three adults.";
  }
  if (widthMm <= median - 30) {
    return "A slightly narrower body makes narrow lanes and tight parking easier, though the second row is cosier side-by-side.";
  }
  return "Width is well matched to Indian roads — stable without feeling bulky in traffic.";
}

function heightNote(heightMm: number, median: number, bodyStyle: Model["bodyStyle"], gcMm: number) {
  if (bodyStyle === "suv" && heightMm >= median + 40) {
    return `The elevated ${fmtMm(heightMm)} roofline gives a commanding view and easy step-in, with ${gcMm} mm ground clearance for tall breakers.`;
  }
  if (bodyStyle === "sedan") {
    return `The ${fmtMm(heightMm)} roofline keeps a low, planted stance — good for highway stability and easy garage clearance.`;
  }
  return `${fmtMm(heightMm)} overall height balances headroom with a manageable center of gravity for everyday driving.`;
}

export function getDimensionExplanations(model: Model): Record<
  BodyDimensionKey,
  { name: string; detail: string }
> {
  const dims = getBodyDimensions(model);
  const seg = model.segment;
  const wbMedian = segmentMedian(seg, (m) => m.dimensions.wheelbaseMm);
  const lenMedian = segmentMedian(seg, (m) => m.dimensions.lengthMm);
  const widthMedian = segmentMedian(seg, (m) => m.dimensions.widthMm);
  const heightMedian = segmentMedian(seg, (m) => m.dimensions.heightMm);

  return {
    wheelbase: {
      name: `Wheelbase (${fmtMm(dims.wheelbaseMm)})`,
      detail: `On the ${model.name}, the wheelbase is ${compareToSegment(dims.wheelbaseMm, wbMedian, "wheelbase")}. ${legroomNote(dims.wheelbaseMm, wbMedian)} A longer wheelbase also reduces pitch over potholes and speed breakers.`,
    },
    length: {
      name: `Overall length (${fmtMm(dims.lengthMm)})`,
      detail: `${lengthNote(dims.lengthMm, lenMedian, model.bodyStyle)} It is ${compareToSegment(dims.lengthMm, lenMedian, "length")}.`,
    },
    width: {
      name: `Overall width (${fmtMm(dims.widthMm)})`,
      detail: `${widthNote(dims.widthMm, widthMedian)} For the ${model.name}, it is ${compareToSegment(dims.widthMm, widthMedian, "width")}.`,
    },
    height: {
      name: `Overall height (${fmtMm(dims.heightMm)})`,
      detail: `${heightNote(dims.heightMm, heightMedian, model.bodyStyle, model.dimensions.groundClearanceMm)} It is ${compareToSegment(dims.heightMm, heightMedian, "height")}.`,
    },
  };
}
