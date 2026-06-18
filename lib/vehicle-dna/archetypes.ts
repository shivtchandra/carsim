import type { Segment } from "@/lib/types";
import type {
  CameraPreset,
  DriveEnvironment,
  SignatureElement,
  VehicleArchetype,
  VehicleDNA,
  VehicleProportions,
} from "./types";

export interface ArchetypeTemplate {
  archetype: VehicleArchetype;
  bodyStyle: "suv" | "sedan";
  signatureElements: SignatureElement[];
  proportions: VehicleProportions;
  wheelInches: number;
  environment: DriveEnvironment;
  cameraPreset: CameraPreset;
}

export const ARCHETYPES: Record<VehicleArchetype, ArchetypeTemplate> = {
  "compact-suv": {
    archetype: "compact-suv",
    bodyStyle: "suv",
    signatureElements: ["parametric-grille", "split-headlamp", "roof-rails"],
    proportions: { boxiness: 0.15, rideHeight: 1.0, cabinRatio: 0.88, noseLength: 1.0, shoulderWidth: 1.0 },
    wheelInches: 17,
    environment: "highway",
    cameraPreset: "family-suv",
  },
  "sub-4m-suv": {
    archetype: "sub-4m-suv",
    bodyStyle: "suv",
    signatureElements: ["vertical-slat-grille", "connected-drl", "roof-rails"],
    proportions: { boxiness: 0.25, rideHeight: 1.05, cabinRatio: 0.82, noseLength: 0.92, shoulderWidth: 0.95 },
    wheelInches: 16,
    environment: "urban-family",
    cameraPreset: "family-suv",
  },
  "midsize-suv": {
    archetype: "midsize-suv",
    bodyStyle: "suv",
    signatureElements: ["vertical-slat-grille", "c-shape-drl", "muscle-shoulders", "roof-rails"],
    proportions: { boxiness: 0.35, rideHeight: 1.08, cabinRatio: 0.9, noseLength: 1.05, shoulderWidth: 1.08 },
    wheelInches: 18,
    environment: "highway",
    cameraPreset: "family-suv",
  },
  "premium-suv": {
    archetype: "premium-suv",
    bodyStyle: "suv",
    signatureElements: ["vertical-slat-grille", "split-headlamp", "flush-handles", "floating-roof"],
    proportions: { boxiness: 0.2, rideHeight: 1.02, cabinRatio: 0.92, noseLength: 1.08, shoulderWidth: 1.05 },
    wheelInches: 19,
    environment: "expressway",
    cameraPreset: "luxury-turntable",
  },
  "offroad-box": {
    archetype: "offroad-box",
    bodyStyle: "suv",
    signatureElements: ["round-headlamps", "boxy-profile", "vertical-slat-grille"],
    proportions: { boxiness: 0.92, rideHeight: 1.18, cabinRatio: 0.78, noseLength: 0.85, shoulderWidth: 1.0 },
    wheelInches: 18,
    environment: "mountain-trail",
    cameraPreset: "offroad-hero",
  },
  "midsize-sedan": {
    archetype: "midsize-sedan",
    bodyStyle: "sedan",
    signatureElements: ["notchback-sedan", "split-headlamp", "parametric-grille"],
    proportions: { boxiness: 0.1, rideHeight: 0.92, cabinRatio: 0.78, noseLength: 1.05, shoulderWidth: 1.0 },
    wheelInches: 16,
    environment: "expressway",
    cameraPreset: "sport-sedan",
  },
  "compact-sedan": {
    archetype: "compact-sedan",
    bodyStyle: "sedan",
    signatureElements: ["notchback-sedan", "connected-drl", "parametric-grille"],
    proportions: { boxiness: 0.12, rideHeight: 0.9, cabinRatio: 0.75, noseLength: 0.95, shoulderWidth: 0.95 },
    wheelInches: 15,
    environment: "city",
    cameraPreset: "sport-sedan",
  },
  "compact-hatch": {
    archetype: "compact-hatch",
    bodyStyle: "sedan",
    signatureElements: ["connected-drl", "floating-roof"],
    proportions: { boxiness: 0.18, rideHeight: 0.88, cabinRatio: 0.72, noseLength: 0.88, shoulderWidth: 0.92 },
    wheelInches: 15,
    environment: "city",
    cameraPreset: "sport-sedan",
  },
  "ev-crossover": {
    archetype: "ev-crossover",
    bodyStyle: "suv",
    signatureElements: ["connected-drl", "clamshell-hood", "flush-handles", "floating-roof"],
    proportions: { boxiness: 0.22, rideHeight: 1.0, cabinRatio: 0.9, noseLength: 1.0, shoulderWidth: 1.02 },
    wheelInches: 20,
    environment: "futuristic-night",
    cameraPreset: "ev-future",
  },
};

export function segmentToArchetype(segment: Segment): VehicleArchetype {
  const map: Record<Segment, VehicleArchetype> = {
    "compact-suv": "compact-suv",
    "sub-4m-suv": "sub-4m-suv",
    "midsize-suv": "midsize-suv",
    "midsize-sedan": "midsize-sedan",
    "compact-hatch": "compact-hatch",
    "compact-sedan": "compact-sedan",
  };
  return map[segment] ?? "compact-suv";
}

/** Brand-level defaults when no model override exists. */
export function brandSignatureHints(brandId: string): SignatureElement[] {
  switch (brandId) {
    case "kia":
      return ["tiger-nose-grille", "star-map-drl"];
    case "hyundai":
      return ["parametric-grille", "split-headlamp"];
    case "mahindra":
      return ["vertical-slat-grille", "c-shape-drl"];
    case "tata":
      return ["connected-drl", "clamshell-hood"];
    case "vw":
    case "skoda":
      return ["fastback-sedan", "parametric-grille"];
    case "mg":
      return ["connected-drl", "floating-roof"];
    case "audi":
      return ["vertical-slat-grille", "split-headlamp", "flush-handles"];
    case "vinfast":
      return ["connected-drl", "floating-roof"];
    case "jeep":
      return ["vertical-slat-grille", "boxy-profile"];
    case "byd":
      return ["connected-drl", "flush-handles"];
    default:
      return [];
  }
}

export function buildDNAFromArchetype(
  modelId: string,
  displayName: string,
  archetype: VehicleArchetype,
  extraSignatures: SignatureElement[] = [],
  proportionTweaks: Partial<VehicleProportions> = {}
): VehicleDNA {
  const base = ARCHETYPES[archetype];
  const sigSet = new Set<SignatureElement>([...base.signatureElements, ...extraSignatures]);
  return {
    modelId,
    displayName,
    archetype,
    bodyStyle: base.bodyStyle,
    signatureElements: [...sigSet],
    proportions: { ...base.proportions, ...proportionTweaks },
    wheelInches: base.wheelInches,
    environment: base.environment,
    cameraPreset: base.cameraPreset,
  };
}

export const CAMERA_PRESETS: Record<
  CameraPreset,
  { position: [number, number, number]; fov: number; target: [number, number, number] }
> = {
  "family-suv": { position: [3.9, 1.55, 3.9], fov: 34, target: [0, 0.75, 0] },
  "sport-sedan": { position: [4.2, 1.2, 4.0], fov: 32, target: [0, 0.55, 0] },
  "offroad-hero": { position: [4.5, 1.8, 4.2], fov: 36, target: [0, 0.9, 0] },
  "luxury-turntable": { position: [4.0, 1.35, 4.5], fov: 30, target: [0, 0.65, 0] },
  "ev-future": { position: [3.6, 1.4, 4.2], fov: 33, target: [0, 0.7, 0] },
};

export const ENV_FOG: Record<DriveEnvironment, [number, number]> = {
  highway: [40, 160],
  expressway: [55, 180],
  "mountain-trail": [25, 90],
  "urban-family": [30, 100],
  "futuristic-night": [15, 55],
  city: [28, 85],
};
