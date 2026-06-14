"use client";

import { useState } from "react";
import CarSilhouette from "./CarSilhouette";
import type { VehicleDNA } from "@/lib/vehicle-dna";

/** Real car photo with stylized-silhouette fallback — a missing image never blocks the UI. */
export default function CarPhoto({
  src,
  alt,
  color,
  dna,
  className = "",
  sizes = "(max-width: 640px) 100vw, 33vw",
}: {
  src: string;
  alt: string;
  color: string;
  dna?: VehicleDNA;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <CarSilhouette color={color} dna={dna} className="w-full h-full" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full absolute inset-0"
        onError={() => setFailed(true)}
      />
      {/* dark grade so photos sit in the theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
    </div>
  );
}
