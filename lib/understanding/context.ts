import type { ContextRule, ContextRuleWhen, FeatureUnderstanding } from "@/lib/types";
import type { DrivingProfile } from "./profile";
import { highwayTripsPerWeek } from "./profile";

function ruleMatches(when: ContextRuleWhen, profile: DrivingProfile): boolean {
  if (when.cityId !== undefined && profile.cityId !== when.cityId) return false;
  if (when.highwayPctGte !== undefined && profile.highwayPct < when.highwayPctGte) return false;
  if (when.annualKmGte !== undefined && profile.annualKm < when.annualKmGte) return false;
  if (when.newDriver !== undefined && profile.newDriver !== when.newDriver) return false;
  return true;
}

function applyTemplate(template: string, profile: DrivingProfile): string {
  const trips = highwayTripsPerWeek(profile);
  return template
    .replace("{highwayTrips}", String(trips))
    .replace("{dailyUses}", String(Math.min(7, Math.max(3, Math.round(profile.annualKm / 52 / 15)))));
}

export interface ResolvedContext {
  usefulIf: string[];
  notUsefulIf: string[];
  frequency?: string;
}

export function resolveContext(
  understanding: FeatureUnderstanding,
  profile: DrivingProfile
): ResolvedContext {
  const usefulIf = [...understanding.context.usefulIf];
  const notUsefulIf = [...understanding.context.notUsefulIf];
  let frequency: string | undefined;

  for (const rule of understanding.context.rules ?? []) {
    if (!ruleMatches(rule.when, profile)) continue;
    if (rule.appendUseful) usefulIf.push(...rule.appendUseful);
    if (rule.appendNotUseful) notUsefulIf.push(...rule.appendNotUseful);
    if (rule.frequency) frequency = rule.frequency;
  }

  if (!frequency && understanding.context.frequencyTemplate) {
    frequency = applyTemplate(understanding.context.frequencyTemplate, profile);
  }

  return { usefulIf, notUsefulIf, frequency };
}
