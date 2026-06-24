import CompareView from "@/components/CompareView";
import CompactPageHeader from "@/components/mobile/CompactPageHeader";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Cars",
  description: "Compare two or three cars side-by-side. Analyze performance, safety, and ownership metrics using objective formulas to make an informed decision.",
  openGraph: {
    title: "Compare Cars — DriveScope",
    description: "Compare two or three cars side-by-side. Analyze performance, safety, and ownership metrics using objective formulas to make an informed decision.",
  }
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ cars?: string }>;
}) {
  const sp = await searchParams;
  const ids = sp.cars?.split(",").filter(Boolean) ?? [];

  return (
    <div className="blueprint-grid min-h-screen">
      <CompactPageHeader
        label="Side-by-side comparison"
        title="Compare. Decide. Drive."
        description="Two or three cars, six scored axes, no opinions — every number traces to a formula in lib/scores.ts."
        className="pb-8 sm:pb-12"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <CompareView initialIds={ids} />
      </div>
    </div>
  );
}
