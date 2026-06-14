"use client";

import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import type { VehicleDNA } from "@/lib/vehicle-dna";
import { CAMERA_PRESETS } from "@/lib/vehicle-dna";
import Stage from "./Stage";
import StylizedCar from "./StylizedCar";

export default function CarViewer3D({
  color,
  wheelbaseMm,
  bootLitres,
  bodyStyle = "suv",
  dna,
  className = "w-full h-48 lg:h-64",
}: {
  color: string;
  wheelbaseMm: number;
  bootLitres: number;
  bodyStyle?: "suv" | "sedan";
  dna?: VehicleDNA;
  className?: string;
}) {
  const cam = CAMERA_PRESETS[dna?.cameraPreset ?? "family-suv"];

  return (
    <div className={className} aria-label={`${dna?.displayName ?? "Car"} 3D view — drag to rotate`}>
      <Stage shadowFrames={1} camera={{ position: cam.position, fov: cam.fov }}>
        <Suspense fallback={null}>
          <StylizedCar
            color={color}
            wheelbaseMm={wheelbaseMm}
            bootLitres={bootLitres}
            bodyStyle={bodyStyle}
            dna={dna}
          />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
            <circleGeometry args={[14, 48]} />
            <meshStandardMaterial color="#0d0d10" metalness={0.7} roughness={0.35} />
          </mesh>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3.4}
            maxPolarAngle={Math.PI / 2.15}
            autoRotate
            autoRotateSpeed={0.8}
            target={cam.target}
            makeDefault
          />
        </Suspense>
      </Stage>
    </div>
  );
}
