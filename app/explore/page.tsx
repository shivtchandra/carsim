import ExplorerGrid from "@/components/ExplorerGrid";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Cars",
  description: "Browse 25+ cars across multiple segments. Filter by budget, fuel type, transmission, and brand to find the perfect car for your needs.",
  openGraph: {
    title: "Explore Cars — DriveScope",
    description: "Browse 25+ cars across multiple segments. Filter by budget, fuel type, transmission, and brand to find the perfect car for your needs.",
  }
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-36 pb-24">
      <h1 className="text-4xl sm:text-5xl font-normal tracking-tight mb-3">Explore</h1>
      <p className="text-secondary mb-10 max-w-xl">
        25 cars across four segments, petrol and diesel. Filter by brand, budget, gearbox and fuel.
      </p>
      <ExplorerGrid />
    </div>
  );
}
