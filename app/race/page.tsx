import RaceModeGate from "@/components/three/race/RaceModeGate";
import CompactPageHeader from "@/components/mobile/CompactPageHeader";
import type { RaceMode } from "@/components/three/race/RaceView";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drag Race Simulator",
  description: "Simulate a 400m drag race between cars. See realistic physics, power-to-weight ratios, and top speeds visualized in an interactive 3D environment.",
  openGraph: {
    title: "Drag Race Simulator — DriveScope",
    description: "Simulate a 400m drag race between cars. See realistic physics, power-to-weight ratios, and top speeds visualized in an interactive 3D environment.",
  }
};

export default async function RacePage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string; rivals?: string; track?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  const initialRivals = sp.rivals ? sp.rivals.split(",").filter(Boolean) : undefined;
  const initialMode: RaceMode | undefined = sp.mode === "spectate" ? "spectate" : sp.mode === "drive" ? "drive" : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
      <CompactPageHeader
        label="Simulation Bay"
        title="Race Mode"
        description="Pick a car, pick rivals, pick a track — then drive it yourself or watch it race. Every car accelerates, brakes and corners on its real measured specs."
        className="pb-6 sm:pb-10"
      />
      <RaceModeGate
        initialCar={sp.car}
        initialRivals={initialRivals}
        initialTrack={sp.track}
        initialMode={initialMode}
      />
    </div>
  );
}
