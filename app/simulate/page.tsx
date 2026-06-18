import SimulationLab, { type SimTab } from "@/components/SimulationLab";

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
    <div className="mx-auto max-w-6xl px-6 pt-36 pb-24">
      <h1 className="text-4xl sm:text-5xl font-normal tracking-tight mb-3">Simulation Lab</h1>
      <p className="text-secondary mb-10 max-w-xl">
        Physics-derived, interactive scenarios showing real-world capability. Compare options and features before visiting the showroom.
      </p>
      <SimulationLab initialSim={sim} initialVariants={initialVariants} initialFeature={sp.feature} />
    </div>
  );
}
