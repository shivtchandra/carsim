import SimulationLab, { type SimTab } from "@/components/SimulationLab";

export const metadata = { title: "Simulation Lab — DriveScope" };

const VALID_SIMS = new Set(["launch", "overtake", "braking", "hill-climb", "clearance", "city", "playground"]);

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
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-3">Simulation Lab</h1>
      <p className="text-secondary mb-10 max-w-xl">
        Physics-derived, interactive scenarios showing real-world capability. Compare options and features before visiting the showroom.
      </p>
      <SimulationLab initialSim={sim} initialVariants={initialVariants} initialFeature={sp.feature} />
    </div>
  );
}
