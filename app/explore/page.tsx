import ExplorerGrid from "@/components/ExplorerGrid";

export const metadata = { title: "Explore — DriveScope" };

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-36 pb-24">
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-3">Explore</h1>
      <p className="text-secondary mb-10 max-w-xl">
        25 cars across four segments, petrol and diesel. Filter by brand, budget, gearbox and fuel.
      </p>
      <ExplorerGrid />
    </div>
  );
}
