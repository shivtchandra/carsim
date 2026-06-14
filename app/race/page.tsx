import RaceModeGate from "@/components/three/race/RaceModeGate";
import type { RaceMode } from "@/components/three/race/RaceView";

export const metadata = { title: "Race — DriveScope" };

export default async function RacePage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string; rivals?: string; track?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  const initialRivals = sp.rivals ? sp.rivals.split(",").filter(Boolean) : undefined;
  const initialMode: RaceMode | undefined = sp.mode === "spectate" ? "spectate" : sp.mode === "drive" ? "drive" : undefined;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-36">
      <div className="mb-10 max-w-3xl">
        <p className="section-label mb-3">Simulation Bay</p>
        <h1 className="font-display text-4xl tracking-tight text-primary sm:text-6xl">Race Mode</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
          Pick a car, pick rivals, pick a track — then drive it yourself or watch it race. Every car
          accelerates, brakes and corners on its real measured specs, so a heavy SUV that flies on the
          highway has to crawl up the mud trail.
        </p>
      </div>
      <RaceModeGate
        initialCar={sp.car}
        initialRivals={initialRivals}
        initialTrack={sp.track}
        initialMode={initialMode}
      />
    </div>
  );
}
