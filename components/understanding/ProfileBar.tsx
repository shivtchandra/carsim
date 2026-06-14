"use client";

import { useState } from "react";
import { costParams } from "@/lib/data";
import {
  type DrivingProfile,
  formatProfileChip,
  saveProfile,
} from "@/lib/understanding/profile";

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
            <span className="text-xs text-secondary">City</span>
            <select
              value={profile.cityId}
              onChange={(e) => update({ cityId: e.target.value })}
              className="mt-1 w-full rounded-lg bg-white/[0.06] border border-white/[0.1] px-3 py-2.5 min-h-[48px]"
            >
              {costParams.cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
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
