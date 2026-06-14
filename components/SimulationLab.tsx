"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useWebGLSupport from "./three/useWebGLSupport";

const LaunchChallenge = dynamic(() => import("./sims/LaunchChallenge"));
const HighwayOvertake = dynamic(() => import("./sims/HighwayOvertake"));
const BrakingLab = dynamic(() => import("./sims/BrakingLab"));
const HillClimb = dynamic(() => import("./sims/HillClimb"));
const GroundClearance = dynamic(() => import("./sims/GroundClearance"));
const CityDriving = dynamic(() => import("./sims/CityDriving"));
const FeaturePlayground = dynamic(() => import("./sims/FeaturePlayground"));

const DragRace3D = dynamic(() => import("./three/sims/DragRace3D"), { ssr: false });
const Overtake3D = dynamic(() => import("./three/sims/Overtake3D"), { ssr: false });
const Braking3D = dynamic(() => import("./three/sims/Braking3D"), { ssr: false });
const HillClimb3D = dynamic(() => import("./three/sims/HillClimb3D"), { ssr: false });
const GroundClearance3D = dynamic(() => import("./three/sims/GroundClearance3D"), { ssr: false });

const TABS = [
  { id: "launch", label: "Launch Challenge" },
  { id: "overtake", label: "Highway Overtake" },
  { id: "braking", label: "Braking Lab" },
  { id: "hill-climb", label: "Hill Climb" },
  { id: "clearance", label: "Ground Clearance" },
  { id: "city", label: "City Simulator" },
  { id: "playground", label: "Feature Playground" },
] as const;

export type SimTab = (typeof TABS)[number]["id"];

const MODE_KEY = "ds-sim-mode";

export default function SimulationLab({
  initialSim = "launch",
  initialVariants = [],
}: {
  initialSim?: SimTab;
  initialVariants?: string[];
  initialFeature?: string;
}) {
  const [tab, setTab] = useState<SimTab>(initialSim);
  const webgl = useWebGLSupport();
  const [mode, setMode] = useState<"3d" | "2d" | null>(null);

  // default to 3D when supported, respect a saved preference
  useEffect(() => {
    if (webgl === null) return;
    const saved = typeof window !== "undefined" ? localStorage.getItem(MODE_KEY) : null;
    if (saved === "2d" || saved === "3d") setMode(webgl ? (saved as "3d" | "2d") : "2d");
    else setMode(webgl ? "3d" : "2d");
  }, [webgl]);

  const pickMode = (m: "3d" | "2d") => {
    setMode(m);
    localStorage.setItem(MODE_KEY, m);
  };

  const is3d = mode === "3d";
  const has3dOption = tab === "launch" || tab === "overtake" || tab === "braking" || tab === "hill-climb" || tab === "clearance";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors duration-200 ${
              tab === t.id
                ? "border-[var(--accent)] text-primary bg-[rgba(232,89,12,0.1)]"
                : "border-[#161616]/10 text-secondary hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
        {has3dOption && webgl && mode && (
          <div className="ml-auto flex rounded-full border border-[#161616]/10 overflow-hidden text-xs">
            {(["3d", "2d"] as const).map((m) => (
              <button
                key={m}
                onClick={() => pickMode(m)}
                className={`px-3.5 py-1.5 uppercase tracking-wide transition-colors duration-200 ${
                  mode === m ? "bg-[rgba(232,89,12,0.15)] text-primary" : "text-secondary hover:text-primary"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {mode === null && has3dOption ? (
        <div className="glass h-72 animate-pulse" />
      ) : (
        <>
          {tab === "launch" &&
            (is3d ? <DragRace3D initialVariants={initialVariants} /> : <LaunchChallenge initialVariants={initialVariants} />)}
          {tab === "overtake" &&
            (is3d ? <Overtake3D initialVariant={initialVariants[0]} /> : <HighwayOvertake initialVariant={initialVariants[0]} />)}
          {tab === "braking" &&
            (is3d ? (
              <Braking3D initialVariant={initialVariants[0]} initialComparison={initialVariants[1]} />
            ) : (
              <BrakingLab initialVariant={initialVariants[0]} />
            ))}
          {tab === "hill-climb" &&
            (is3d ? <HillClimb3D initialVariant={initialVariants[0]} /> : <HillClimb initialVariant={initialVariants[0]} />)}
          {tab === "clearance" &&
            (is3d ? <GroundClearance3D initialVariant={initialVariants[0]} /> : <GroundClearance initialVariant={initialVariants[0]} />)}
          {tab === "city" && <CityDriving initialVariant={initialVariants[0]} />}
          {tab === "playground" && <FeaturePlayground />}
        </>
      )}
    </div>
  );
}
