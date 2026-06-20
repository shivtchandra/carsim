// Data schema per DriveScope spec §4 — JSON now, designed to migrate 1:1 to SQL later.

export type Fuel = "petrol" | "diesel" | "cng" | "ev";
export type Transmission = "MT" | "AMT" | "CVT" | "DCT" | "AT";
export type FeatureCategory = "safety" | "comfort" | "tech" | "convenience" | "performance";

export interface Brand {
  id: string;
  name: string;
  country: string;
  color: string; // brand color for stylized sim silhouettes
}

export type Segment = "compact-suv" | "sub-4m-suv" | "midsize-sedan" | "midsize-suv" | "compact-hatch" | "compact-sedan";

export interface Model {
  id: string;
  brandId: string;
  name: string;
  segment: Segment;
  bodyStyle: "suv" | "sedan";
  priceRange: { min: number; max: number }; // ex-showroom, INR
  heroImage: string;
  aiSummary: string;
  ncap: {
    agency: "BNCAP" | "GNCAP" | null;
    adultStars: number | null;
    childStars: number | null;
  };
  prosCons: { pros: string[]; cons: string[] };
  dimensions: {
    bootLitres: number;
    wheelbaseMm: number;
    groundClearanceMm: number;
    lengthMm: number;
    widthMm: number;
    heightMm: number;
  };
}

/** Rule conditions for contextual feature explanations (Layer 2). */
export interface ContextRuleWhen {
  cityId?: string;
  highwayPctGte?: number;
  annualKmGte?: number;
  newDriver?: boolean;
}

export interface ContextRule {
  when: ContextRuleWhen;
  appendUseful?: string[];
  appendNotUseful?: string[];
  frequency?: string;
}

export interface FeatureUnderstanding {
  featureId: string;
  visual: {
    scene: string;
    steps: { label: string }[];
    captions?: { at: number; text: string }[];
  };
  context: {
    usefulIf: string[];
    notUsefulIf: string[];
    frequencyTemplate?: string;
    rules?: ContextRule[];
  };
  value: {
    practicalScore: number;
    experienceScore: number;
    ownershipImpact: 1 | 2 | 3;
  };
}

export type SpecUnderstandingKey = "boot" | "wheelbase" | "groundClearance";

export interface SpecUnderstanding {
  specKey: SpecUnderstandingKey;
  label: string;
  hook: string;
  visual: { scene: string; steps: { label: string }[] };
  context: {
    usefulIf: string[];
    notUsefulIf: string[];
  };
  value: {
    practicalScore: number;
    experienceScore: number;
  };
}

export interface Variant {
  id: string;
  modelId: string;
  name: string;
  fuel: Fuel;
  hybrid?: "mild" | "strong"; // strong-hybrid petrols (Grand Vitara / Hyryder)
  transmission: Transmission;
  priceExShowroom: number;
  engine: { cc: number; ps: number; nm: number; cylinders: number; turbo: boolean };
  claimedFE: number; // ARAI km/l
  realWorldFE: number; // estimated — always badge as such
  kerbWeight: number; // kg
  featureIds: string[];
}

export interface Feature {
  id: string;
  name: string;
  category: FeatureCategory;
  impactScore: 1 | 2 | 3;
  whatItIs: string;
  whyItMatters: string;
  whoNeedsIt: string;
  hasSimulation: boolean;
}

export interface TestFigure {
  value: number | null;
  source: string; // "autocar-test" | "arai" | "estimated-model"
  estimated: boolean;
}

export interface TestData {
  variantId: string;
  zeroTo100: TestFigure; // seconds
  sixtyTo100: TestFigure; // seconds, kickdown
  braking100to0: TestFigure; // metres
}

export type DriveMeasuredMetric = "zeroTo100" | "sixtyTo100" | "braking100to0";
export type DriveCertification = "measured" | "partial" | "preview";
export type DriveModeId = "drive-trial";
export type DriveSectorId = "launch" | "control" | "brake";

export interface DriveMetricCoverage {
  available: boolean;
  measured: boolean;
  source: string | null;
}

export interface DriveCoverage {
  certification: DriveCertification;
  mode: DriveModeId;
  metrics: Record<DriveMeasuredMetric, DriveMetricCoverage>;
  certifiedSectors: DriveSectorId[];
  previewOnlyReason: string | null;
}

export interface City {
  id: string;
  name: string;
  petrolPrice: number;
  dieselPrice: number;
  cngPrice: number;
  evPrice: number;
  insuranceMultiplier: number;
}

export interface CostParams {
  cities: City[];
  insurance: { firstYearRate: number; annualDecline: number };
  maintenancePerYearByBrand: Record<string, number>;
  maintenanceAgeScaling: number[];
  tyres: { costPerSetMin: number; costPerSetMax: number; intervalKm: number };
  retentionByBrand: Record<string, number[]>;
  dieselMaintenanceFactor: number;
  onRoad: {
    rtoSlabs: { upTo: number | null; rate: number }[];
    dieselSurcharge: number;
    tcsRate: number;
    tcsThreshold: number;
    miscCharges: number;
  };
}

export interface OwnerVoice {
  theme: string;
  sentiment: "positive" | "negative" | "mixed";
  text: string;
}

export interface OwnerVoices {
  modelId: string;
  voices: OwnerVoice[];
}

export interface DetailedReview {
  id: string;
  modelId: string;
  source: string;
  username: string;
  rating: number;
  fuel: Fuel;
  transmission: Transmission | string;
  date: string;
  sentiment: "positive" | "negative" | "mixed";
  text: string;
  upvotes: number;
}

export type CommunityWallStatus = "pending" | "approved" | "rejected";
export type CommunityWallSentiment = "positive" | "mixed" | "negative" | "question";
export type CommunityWallCategory =
  | "performance & comfort"
  | "features & tech"
  | "ownership & service"
  | "value & cost"
  | "general";
export type CommunityWallOwnershipStage =
  | "considering"
  | "booked"
  | "0-6 months"
  | "6-24 months"
  | "2+ years";

export interface CommunityWallPost {
  id: string;
  modelId: string;
  modelName: string;
  authorName: string;
  ownershipStage: CommunityWallOwnershipStage;
  category: CommunityWallCategory;
  sentiment: CommunityWallSentiment;
  text: string;
  status: CommunityWallStatus;
  createdAt: string;
  approvedAt: string | null;
}
