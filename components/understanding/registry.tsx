"use client";

import type { ReactNode } from "react";
import AdasRoadScene, { type AdasSceneVariant } from "./scenes/AdasRoadScene";
import BootSpaceScene from "./scenes/BootSpaceScene";
import ConvenienceFeatureScene, { type ConvenienceSceneVariant } from "./scenes/ConvenienceFeatureScene";
import CruiseControlScene from "./scenes/CruiseControlScene";
import EscScene from "./scenes/EscScene";
import GenericCategoryScene from "./scenes/GenericCategoryScene";
import GroundClearanceScene from "./scenes/GroundClearanceScene";
import HillHoldScene from "./scenes/HillHoldScene";
import PanoSunroofScene from "./scenes/PanoSunroofScene";
import RearSpaceScene from "./scenes/RearSpaceScene";
import TpmsScene from "./scenes/TpmsScene";
import AirbagsScene from "./scenes/AirbagsScene";
import TouchscreenScene from "./scenes/TouchscreenScene";
import WirelessCarplayScene from "./scenes/WirelessCarplayScene";
import TechFeatureScene, { type TechSceneVariant } from "./scenes/TechFeatureScene";
import ComfortFeatureScene, { type ComfortSceneVariant } from "./scenes/ComfortFeatureScene";
import PerformanceFeatureScene, { type PerformanceSceneVariant } from "./scenes/PerformanceFeatureScene";

export interface SceneSpecProps {
  bootLitres?: number;
  wheelbaseMm?: number;
  groundClearanceMm?: number;
}

const ADAS_VARIANTS = new Set<AdasSceneVariant>([
  "aeb",
  "adaptive-cruise",
  "lane-keep",
  "blind-spot",
  "adas-l2",
]);

const CONVENIENCE_VARIANTS = new Set<ConvenienceSceneVariant>([
  "rear-camera",
  "camera-360",
  "front-parking-sensors",
  "auto-headlamps",
  "auto-wipers",
  "keyless-entry",
  "auto-dimming-irvm",
  "led-drl",
  "rear-defogger",
]);

const TECH_VARIANTS = new Set<TechSceneVariant>([
  "digital-cluster",
  "connected-car",
  "wireless-charger",
  "premium-audio",
]);

const COMFORT_VARIANTS = new Set<ComfortSceneVariant>([
  "ventilated-seats",
  "auto-ac",
  "rear-ac-vents",
  "sunroof",
  "leatherette-seats",
  "powered-driver-seat",
]);

const PERFORMANCE_VARIANTS = new Set<PerformanceSceneVariant>([
  "all-disc-brakes",
  "paddle-shifters",
  "drive-modes",
  "alloy-17",
]);

export function renderScene(scene: string, specProps?: SceneSpecProps): ReactNode {
  if (ADAS_VARIANTS.has(scene as AdasSceneVariant)) {
    return <AdasRoadScene variant={scene as AdasSceneVariant} />;
  }
  if (CONVENIENCE_VARIANTS.has(scene as ConvenienceSceneVariant)) {
    return <ConvenienceFeatureScene variant={scene as ConvenienceSceneVariant} />;
  }
  if (TECH_VARIANTS.has(scene as TechSceneVariant)) {
    return <TechFeatureScene variant={scene as TechSceneVariant} />;
  }
  if (COMFORT_VARIANTS.has(scene as ComfortSceneVariant)) {
    return <ComfortFeatureScene variant={scene as ComfortSceneVariant} />;
  }
  if (PERFORMANCE_VARIANTS.has(scene as PerformanceSceneVariant)) {
    return <PerformanceFeatureScene variant={scene as PerformanceSceneVariant} />;
  }

  switch (scene) {
    case "cruise-control":
      return <CruiseControlScene />;
    case "hill-hold":
      return <HillHoldScene />;
    case "pano-sunroof":
      return <PanoSunroofScene />;
    case "tpms":
      return <TpmsScene />;
    case "esc":
      return <EscScene />;
    case "airbags-6":
      return <AirbagsScene />;
    case "touchscreen-10":
      return <TouchscreenScene />;
    case "wireless-carplay":
      return <WirelessCarplayScene />;
    case "boot-space":
      return <BootSpaceScene bootLitres={specProps?.bootLitres} />;
    case "rear-space":
      return <RearSpaceScene wheelbaseMm={specProps?.wheelbaseMm} />;
    case "ground-clearance":
      return <GroundClearanceScene groundClearanceMm={specProps?.groundClearanceMm} />;
    default:
      return <GenericCategoryScene scene={scene} />;
  }
}

export const CUSTOM_SCENES = new Set([
  ...ADAS_VARIANTS,
  ...CONVENIENCE_VARIANTS,
  "cruise-control",
  "hill-hold",
  "pano-sunroof",
  "tpms",
  "esc",
  "airbags-6",
  "touchscreen-10",
  "wireless-carplay",
  ...TECH_VARIANTS,
  ...COMFORT_VARIANTS,
  ...PERFORMANCE_VARIANTS,
  "boot-space",
  "rear-space",
  "ground-clearance",
]);
