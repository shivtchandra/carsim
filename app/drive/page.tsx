import DriveModeGate from "@/components/three/DriveModeGate";

export const metadata = { title: "Test Drive — DriveScope" };

export default async function DrivePage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-36">
      <div className="mb-10 max-w-3xl">
        <p className="section-label mb-3">Simulation Bay</p>
        <h1 className="page-header-title font-display text-4xl tracking-tight sm:text-6xl">
          Drive Trial
        </h1>
        <p className="page-header-description mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
          A lab-grade test course built to show what is measured, what is modeled, and how each
          car behaves when you lean on it.
        </p>
      </div>
      <DriveModeGate initialVariant={sp.variant} />
    </div>
  );
}
