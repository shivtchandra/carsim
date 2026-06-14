/** Vehicle DNA — game-quality recognizability, not CAD accuracy. */

export type VehicleArchetype =
  | "compact-suv"
  | "sub-4m-suv"
  | "midsize-suv"
  | "premium-suv"
  | "offroad-box"
  | "midsize-sedan"
  | "compact-sedan"
  | "compact-hatch"
  | "ev-crossover";

export type SignatureElement =
  | "parametric-grille"
  | "split-headlamp"
  | "roof-rails"
  | "tiger-nose-grille"
  | "star-map-drl"
  | "c-shape-drl"
  | "flush-handles"
  | "round-headlamps"
  | "boxy-profile"
  | "vertical-slat-grille"
  | "connected-drl"
  | "fastback-sedan"
  | "notchback-sedan"
  | "clamshell-hood"
  | "floating-roof"
  | "muscle-shoulders";

export type DriveEnvironment =
  | "highway"
  | "expressway"
  | "mountain-trail"
  | "urban-family"
  | "futuristic-night"
  | "city";

export type CameraPreset =
  | "family-suv"
  | "sport-sedan"
  | "offroad-hero"
  | "luxury-turntable"
  | "ev-future";

export interface VehicleProportions {
  /** 0 = rounded crossover, 1 = boxy (Thar) */
  boxiness: number;
  /** Ride height multiplier vs archetype default */
  rideHeight: number;
  /** Cabin length as fraction of wheelbase */
  cabinRatio: number;
  /** Front overhang emphasis */
  noseLength: number;
  /** Shoulder width emphasis */
  shoulderWidth: number;
}

export interface VehicleDNA {
  modelId: string;
  displayName: string;
  archetype: VehicleArchetype;
  bodyStyle: "suv" | "sedan";
  signatureElements: SignatureElement[];
  proportions: VehicleProportions;
  wheelInches: number;
  environment: DriveEnvironment;
  cameraPreset: CameraPreset;
}

/** Partial override stored in JSON — merged onto archetype base. */
export interface VehicleDNAOverride {
  archetype?: VehicleArchetype;
  signatureElements?: SignatureElement[];
  proportions?: Partial<VehicleProportions>;
  wheelInches?: number;
  environment?: DriveEnvironment;
  cameraPreset?: CameraPreset;
}
