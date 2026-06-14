import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-44 pb-24 text-center">
      <p className="stat-num text-7xl font-semibold text-secondary">404</p>
      <h1 className="text-2xl font-semibold mt-4">That car isn&apos;t in the garage.</h1>
      <p className="text-secondary mt-3">
        We cover 10 compact SUVs in v1 — maybe it&apos;s one of them under a different name.
      </p>
      <Link
        href="/explore"
        className="inline-block mt-8 px-7 py-3.5 rounded-xl bg-accent text-[#F4F0E8] font-medium"
      >
        Browse all cars
      </Link>
    </div>
  );
}
