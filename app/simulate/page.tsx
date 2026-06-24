import SimulationLab, { type SimTab } from "@/components/SimulationLab";
import CompactPageHeader from "@/components/mobile/CompactPageHeader";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Physics Simulator",
  description: "Experience realistic car physics. Test cars in our 3D simulation bay for braking, cornering, hill climbing, and ground clearance.",
  openGraph: {
    title: "Car Physics Simulator — DriveScope",
    description: "Experience realistic car physics. Test cars in our 3D simulation bay for braking, cornering, hill climbing, and ground clearance.",
  }
};

const VALID_SIMS = new Set(["launch", "overtake", "braking", "hill-climb", "clearance", "cornering", "swerve", "city", "playground"]);

export default async function SimulatePage({
  searchParams,
}: {
  searchParams: Promise<{ sim?: string; variants?: string; feature?: string }>;
}) {
  const sp = await searchParams;
  const sim = (VALID_SIMS.has(sp.sim ?? "") ? sp.sim : "launch") as SimTab;
  const initialVariants = sp.variants?.split(",").filter(Boolean) ?? [];

  return (
    <div>
      <CompactPageHeader
        title="Simulation Lab"
        description="Physics-derived, interactive scenarios showing real-world capability. Pick a scenario, choose cars, run the test."
        className="pb-6 sm:pb-10"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <SimulationLab initialSim={sim} initialVariants={initialVariants} initialFeature={sp.feature} />
      </div>
    </div>
  );
}
