import CompareView from "@/components/CompareView";

export const metadata = { title: "Compare — DriveScope" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ cars?: string }>;
}) {
  const sp = await searchParams;
  const ids = sp.cars?.split(",").filter(Boolean) ?? [];

  return (
    <div className="blueprint-grid min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pt-36 pb-24">
        <p className="section-label mb-4">Side-by-side comparison</p>
        <h1
          className="font-display mb-3 leading-tight"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          Compare. Decide. Drive.
        </h1>
        <p className="text-secondary mb-12 max-w-xl leading-relaxed">
          Two or three cars, six scored axes, no opinions — every number traces to a formula in{" "}
          <code className="text-xs bg-[#161616]/5 px-1 py-0.5 rounded">lib/scores.ts</code>.
        </p>
        <CompareView initialIds={ids} />
      </div>
    </div>
  );
}
