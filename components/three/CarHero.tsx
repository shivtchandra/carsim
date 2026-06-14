"use client";

import dynamic from "next/dynamic";
import CarSilhouette from "@/components/CarSilhouette";
import type { VehicleDNA } from "@/lib/vehicle-dna";
import useWebGLSupport from "./useWebGLSupport";

const CarViewer3D = dynamic(() => import("./CarViewer3D"), {
  ssr: false,
  loading: () => null,
});

/** Car-page hero visual: DNA-driven 3D turntable or 2D silhouette. */
export default function CarHero({
  color,
  wheelbaseMm,
  bootLitres,
  bodyStyle = "suv",
  dna,
}: {
  color: string;
  wheelbaseMm: number;
  bootLitres: number;
  bodyStyle?: "suv" | "sedan";
  dna?: VehicleDNA;
}) {
  const webgl = useWebGLSupport();

  if (webgl) {
    return (
      <CarViewer3D
        color={color}
        wheelbaseMm={wheelbaseMm}
        bootLitres={bootLitres}
        bodyStyle={bodyStyle}
        dna={dna}
        className="w-full h-56 lg:h-72"
      />
    );
  }
  return <CarSilhouette color={color} dna={dna} className="w-full h-48 lg:h-64" />;
}
