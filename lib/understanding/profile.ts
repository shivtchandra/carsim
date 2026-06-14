import { costParams } from "@/lib/data";

export interface DrivingProfile {
  cityId: string;
  annualKm: number;
  highwayPct: number;
  newDriver: boolean;
}

export const PROFILE_STORAGE_KEY = "ds-driving-profile";

export const DEFAULT_PROFILE: DrivingProfile = {
  cityId: "hyderabad",
  annualKm: 12000,
  highwayPct: 0.25,
  newDriver: false,
};

export function getCityName(cityId: string): string {
  return costParams.cities.find((c) => c.id === cityId)?.name ?? cityId;
}

export function loadProfile(): DrivingProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<DrivingProfile>;
    return {
      cityId: parsed.cityId ?? DEFAULT_PROFILE.cityId,
      annualKm: parsed.annualKm ?? DEFAULT_PROFILE.annualKm,
      highwayPct: parsed.highwayPct ?? DEFAULT_PROFILE.highwayPct,
      newDriver: parsed.newDriver ?? DEFAULT_PROFILE.newDriver,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: DrivingProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

/** Rough weekly highway trip count from annual km and highway share. */
export function highwayTripsPerWeek(profile: DrivingProfile): number {
  const highwayKmYear = profile.annualKm * profile.highwayPct;
  const avgHighwayTripKm = 40;
  return Math.max(1, Math.round(highwayKmYear / 52 / avgHighwayTripKm));
}

export function formatProfileChip(profile: DrivingProfile): string {
  const km =
    profile.annualKm >= 1000
      ? `${Math.round(profile.annualKm / 1000)}k km/yr`
      : `${profile.annualKm} km/yr`;
  return `${getCityName(profile.cityId)} · ${km}`;
}
