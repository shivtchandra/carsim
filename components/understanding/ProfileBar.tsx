"use client";

import { useState } from "react";
import { costParams } from "@/lib/data";
import {
  type DrivingProfile,
  formatProfileChip,
  saveProfile,
} from "@/lib/understanding/profile";
import DriveSelect from "@/components/ui/DriveSelect";

export default function ProfileBar({
  profile,
  onChange,
}: {
  profile: DrivingProfile;
  onChange: (p: DrivingProfile) => void;
}) {
  const [open, setOpen] = useState(false);

  const update = (patch: Partial<DrivingProfile>) => {
    const next = { ...profile, ...patch };
    saveProfile(next);
    onChange(next);
  };

  return (
    <div className="border border-white/[0.08] rounded-xl p-3 bg-white/[0.02]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-secondary">
          Personalizing for:{" "}
          <span className="text-primary font-medium">{formatProfileChip(profile)}</span>
        </p>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-xs text-[var(--accent)] hover:underline min-h-[48px] min-w-[48px] px-2 -mr-2"
        >
          {open ? "Done" : "Adjust my driving"}
        </button>
      </div>
      {open && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
          <label className="block">
            <span className="text-xs text-secondary mb-1 block">City</span>
            <DriveSelect
              value={profile.cityId}
              onChange={(val) => update({ cityId: val })}
              ariaLabel="City"
              options={costParams.cities.map((c) => ({ value: c.id, label: c.name }))}
              className="w-full"
            />
          </label>
          <label className="block">
            <span className="text-xs text-secondary">
              Annual km: {profile.annualKm.toLocaleString("en-IN")}
            </span>
            <input
              type="range"
              min={5000}
              max={30000}
              step={1000}
              value={profile.annualKm}
              onChange={(e) => update({ annualKm: Number(e.target.value) })}
              className="mt-2 w-full"
            />
          </label>
          <label className="block">
            <span className="text-xs text-secondary">
              Highway share: {Math.round(profile.highwayPct * 100)}%
            </span>
            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={Math.round(profile.highwayPct * 100)}
              onChange={(e) => update({ highwayPct: Number(e.target.value) / 100 })}
              className="mt-2 w-full"
            />
          </label>
          <label className="flex items-center gap-3 min-h-[48px] cursor-pointer">
            <input
              type="checkbox"
              checked={profile.newDriver}
              onChange={(e) => update({ newDriver: e.target.checked })}
              className="w-5 h-5 accent-[var(--accent)]"
            />
            <span className="text-sm">New or returning driver</span>
          </label>
        </div>
      )}
    </div>
  );
}
