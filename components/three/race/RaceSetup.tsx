"use client";

import { useEffect, useState } from "react";
import { Flag, Mountain } from "lucide-react";
import VariantSelect from "@/components/sims/VariantSelect";
import { RACE_TRACKS } from "@/lib/race/tracks";
import RaceView, { type RaceMode } from "./RaceView";

const TRACK_ICON: Record<string, typeof Flag> = {
  "highway-sprint": Flag,
  "hill-mud-trail": Mountain,
};

const TRACK_NOTE: Record<string, string> = {
  "highway-sprint": "Wide, fast, gentle sweeps — pure top-end and acceleration.",
  "hill-mud-trail": "Narrow switchbacks on low-grip mud — composure beats raw power.",
};

export default function RaceSetup({
  initialCar,
  initialRivals,
  initialTrack,
  initialMode,
}: {
  initialCar?: string;
  initialRivals?: string[];
  initialTrack?: string;
  initialMode?: RaceMode;
}) {
  const [stage, setStage] = useState<"setup" | "race">("setup");
  const [playerId, setPlayerId] = useState(initialCar ?? "creta-sx-o-turbo-dct");
  const [rivals, setRivals] = useState<string[]>([
    initialRivals?.[0] ?? "gv-zeta-plus-hybrid",
    initialRivals?.[1] ?? "",
  ]);
  const [trackId, setTrackId] = useState(initialTrack ?? "highway-sprint");
  const [mode, setMode] = useState<RaceMode>(initialMode ?? "drive");

  useEffect(() => {
    if (initialCar) return;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("drivescope_selected_variant");
      if (stored) setPlayerId(stored);
    }
  }, [initialCar]);

  if (stage === "race") {
    return (
      <RaceView
        playerVariantId={playerId}
        rivalVariantIds={rivals}
        trackId={trackId}
        mode={mode}
        onExit={() => setStage("setup")}
      />
    );
  }

  return (
    <div className="border border-[#161616]/10 bg-[#F4F0E8]/40 rounded-[28px] p-6 sm:p-8 space-y-7">
      {/* Mode */}
      <div>
        <p className="section-label mb-2">Mode</p>
        <div className="flex gap-2">
          {(["drive", "spectate"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                mode === m
                  ? "border-[#C84C31] bg-[#C84C31] text-[#F5F1E8]"
                  : "border-[#161616]/12 bg-white text-[#161616]/75 hover:bg-[#161616]/5"
              }`}
            >
              {m === "drive" ? "Drive it yourself" : "Watch the race"}
            </button>
          ))}
        </div>
      </div>

      {/* Cars */}
      <div className="grid gap-3 sm:grid-cols-3">
        <VariantSelect
          label="Your car"
          value={playerId}
          onChange={(id) => {
            setPlayerId(id);
            if (typeof window !== "undefined") localStorage.setItem("drivescope_selected_variant", id);
          }}
        />
        <VariantSelect
          label="Rival 1"
          value={rivals[0]}
          allowNone
          onChange={(id) => setRivals((p) => [id, p[1]])}
        />
        <VariantSelect
          label="Rival 2 (optional)"
          value={rivals[1]}
          allowNone
          onChange={(id) => setRivals((p) => [p[0], id])}
        />
      </div>

      {/* Track */}
      <div>
        <p className="section-label mb-2">Track</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {RACE_TRACKS.map((t) => {
            const Icon = TRACK_ICON[t.id] ?? Flag;
            const active = trackId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTrackId(t.id)}
                className={`text-left rounded-2xl border p-4 transition-all ${
                  active
                    ? "border-[#C84C31] bg-[rgba(200,76,49,0.06)]"
                    : "border-[#161616]/12 bg-white hover:bg-[#161616]/[0.03]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${active ? "text-[#C84C31]" : "text-[#161616]/60"}`} />
                  <span className="font-semibold text-primary">{t.name}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-secondary">{TRACK_NOTE[t.id]}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setStage("race")}
          disabled={!playerId}
          className="btn-accent rounded-2xl px-8 py-4 text-lg font-semibold disabled:opacity-40"
        >
          Go to the grid →
        </button>
        <p className="text-xs text-secondary">
          {mode === "drive" ? "You drive; rivals race their real specs." : "Every car races its real specs."}
        </p>
      </div>
    </div>
  );
}
