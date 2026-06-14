import dnaOverridesJson from "@/data/vehicle-dna.json";
import { getBrand, getModel, getVariant } from "@/lib/data";
import type { Model } from "@/lib/types";
import {
  ARCHETYPES,
  brandSignatureHints,
  buildDNAFromArchetype,
  segmentToArchetype,
} from "./archetypes";
import type { SignatureElement, VehicleArchetype, VehicleDNA, VehicleDNAOverride } from "./types";

const overrides = dnaOverridesJson as Record<string, VehicleDNAOverride>;

export function getVehicleDNA(model: Model): VehicleDNA {
  const override = overrides[model.id];
  const archetype: VehicleArchetype =
    override?.archetype ?? segmentToArchetype(model.segment);

  const brandHints = brandSignatureHints(model.brandId);
  const base = buildDNAFromArchetype(
    model.id,
    model.name,
    archetype,
    brandHints
  );

  if (!override) {
    return {
      ...base,
      bodyStyle: model.bodyStyle,
    };
  }

  const sigSet = new Set<SignatureElement>([
    ...base.signatureElements,
    ...(override.signatureElements ?? []),
  ]);

  return {
    ...base,
    bodyStyle: model.bodyStyle,
    archetype: override.archetype ?? base.archetype,
    signatureElements: [...sigSet],
    proportions: { ...base.proportions, ...override.proportions },
    wheelInches: override.wheelInches ?? base.wheelInches,
    environment: override.environment ?? base.environment,
    cameraPreset: override.cameraPreset ?? base.cameraPreset,
  };
}

export function getVehicleDNAById(modelId: string, models: Model[]): VehicleDNA | null {
  const model = models.find((m) => m.id === modelId);
  if (!model) return null;
  return getVehicleDNA(model);
}

/** Shared spec bundle for 3D sim scenes — includes resolved DNA. */
export function getVariantVehicleSpec(variantId: string) {
  const v = getVariant(variantId);
  if (!v) return null;
  const m = getModel(v.modelId);
  if (!m) return null;
  const brand = getBrand(m.brandId);
  if (!brand) return null;
  return {
    variantId: v.id,
    modelId: m.id,
    label: `${m.name} ${v.name}`,
    color: brand.color,
    wheelbaseMm: m.dimensions.wheelbaseMm,
    bootLitres: m.dimensions.bootLitres,
    bodyStyle: m.bodyStyle,
    dna: getVehicleDNA(m),
  };
}

export { ARCHETYPES, CAMERA_PRESETS, ENV_FOG } from "./archetypes";
export type { VehicleDNA, SignatureElement, DriveEnvironment, CameraPreset } from "./types";
