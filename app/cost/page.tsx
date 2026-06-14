import CostSimulator from "@/components/CostSimulator";
import FuelDecisionCard from "@/components/FuelDecisionCard";

export const metadata = { title: "Ownership Cost — DriveScope" };

export default async function CostPage({
  searchParams,
}: {
  searchParams: Promise<{ variants?: string }>;
}) {
  const sp = await searchParams;
  const initialVariants = sp.variants?.split(",").filter(Boolean) ?? [];

  return (
    <div style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <div style={{ background: "var(--bg-navy)" }} className="pt-36 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="section-label mb-4">5-year cost model</p>
          <h1
            className="font-display mb-4 leading-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
          >
            The real price of ownership.
          </h1>
          <p className="text-secondary max-w-xl leading-relaxed">
            Fuel, insurance, maintenance, tyres, and depreciation — modeled for
            your city and driving pattern. Every figure labeled estimated where it is.
          </p>
        </div>
      </div>

      {/* Simulator */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <CostSimulator initialVariants={initialVariants} />
      </div>

      {/* Fuel decision */}
      <div style={{ background: "var(--bg-slate)" }} className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="section-label mb-4">Petrol vs Diesel</p>
          <h2
            className="font-display mb-10 leading-tight"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
          >
            Which fuel type wins for you?
          </h2>
          <FuelDecisionCard />
        </div>
      </div>
    </div>
  );
}
