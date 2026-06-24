import ExplorerGrid from "@/components/ExplorerGrid";
import CompactPageHeader from "@/components/mobile/CompactPageHeader";

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
    <div>
      <CompactPageHeader
        title="Explore"
        description="25 cars across four segments, petrol and diesel. Filter by brand, budget, gearbox and fuel."
        className="pb-6 sm:pb-10"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <ExplorerGrid />
      </div>
    </div>
  );
}
