"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { VehicleDNA } from "@/lib/vehicle-dna/types";
import type { CarMotionRef } from "./StylizedCar";

const WHEEL_R_BY_INCH: Record<number, number> = {
  15: 0.31,
  16: 0.33,
  17: 0.35,
  18: 0.38,
  19: 0.4,
  20: 0.42,
};

function wheelRadius(inches: number) {
  return WHEEL_R_BY_INCH[inches] ?? 0.35 + (inches - 17) * 0.015;
}

/** Photo-textured side shell — used when a marketing side/3-4 image exists (e.g. Creta). */
export default function PhotoSideCar({
  textureUrl,
  color,
  wheelbaseMm = 2610,
  bootLitres = 430,
  bodyStyle = "suv",
  dna,
  motionRef,
}: {
  textureUrl: string;
  color: string;
  wheelbaseMm?: number;
  bootLitres?: number;
  bodyStyle?: "suv" | "sedan";
  dna?: VehicleDNA;
  motionRef?: React.MutableRefObject<CarMotionRef>;
}) {
  const texture = useTexture(textureUrl);
  const props = dna?.proportions;
  const rideMult = props?.rideHeight ?? 1;
  const shoulderMult = props?.shoulderWidth ?? 1;

  const wheelbase = wheelbaseMm / 1000;
  const length = wheelbase + 1.65;
  const rearOverhang = 0.72 + (bootLitres - 380) / 1500;
  const width = 1.8 * shoulderMult;
  const isSedan = (dna?.bodyStyle ?? bodyStyle) === "sedan";
  const bodyH = (isSedan ? 0.48 : 0.52) * rideMult;
  const bodyY = (isSedan ? 0.4 : 0.52) * rideMult;
  const wheelR = wheelRadius(dna?.wheelInches ?? (isSedan ? 16 : 17));
  const trackZ = width / 2 - 0.12;

  const axleFront = wheelbase / 2;
  const axleRear = -wheelbase / 2;
  const noseX = axleFront + (length - wheelbase - rearOverhang);
  const tailX = axleRear - rearOverhang;
  const centerX = (noseX + tailX) / 2;

  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Mesh[]>([]);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const tire = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0c0c0e", roughness: 0.9 }),
    []
  );
  const rim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d0d5dd",
        metalness: 0.97,
        roughness: 0.08,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!motionRef) return;
    for (const w of wheels.current) w.rotation.y -= motionRef.current.wheelSpeed * delta;
    if (group.current) group.current.rotation.z = motionRef.current.pitch;
  });

  const wheelPositions: [number, number][] = [
    [axleFront, trackZ],
    [axleFront, -trackZ],
    [axleRear, trackZ],
    [axleRear, -trackZ],
  ];

  const photoW = length * 0.92;
  const photoH = bodyH * 1.85;

  return (
    <group ref={group}>
      {/* Depth volume for shadows */}
      <mesh position={[centerX, bodyY, 0]}>
        <boxGeometry args={[length * 0.88, bodyH, width * 0.85]} />
        <meshStandardMaterial
          color={new THREE.Color(color)}
          metalness={0.7}
          roughness={0.25}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Photo panels — visible from chase camera (+Z / −Z) */}
      {[width * 0.48, -width * 0.48].map((z, i) => (
        <mesh key={i} position={[centerX + length * 0.02, bodyY + bodyH * 0.12, z]} rotation={[0, i === 0 ? 0 : Math.PI, 0]}>
          <planeGeometry args={[photoW, photoH]} />
          <meshStandardMaterial map={texture} metalness={0.35} roughness={0.45} envMapIntensity={1.2} />
        </mesh>
      ))}

      {wheelPositions.map(([x, z], i) => (
        <group key={i} position={[x, wheelR, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh ref={(el) => { if (el) wheels.current[i] = el; }} material={tire} castShadow>
            <cylinderGeometry args={[wheelR, wheelR, 0.24, 20]} />
          </mesh>
          <mesh material={rim} position={[0, z > 0 ? 0.13 : -0.13, 0]}>
            <cylinderGeometry args={[wheelR * 0.55, wheelR * 0.55, 0.02, 12]} />
          </mesh>
        </group>
      ))}

      {([width * 0.32, -width * 0.32] as const).map((z, i) => (
        <mesh key={`t${i}`} position={[tailX + 0.02, bodyY + 0.16, z]}>
          <boxGeometry args={[0.05, 0.09, 0.24]} />
          <meshStandardMaterial color="#5b0a0a" emissive="#ff4040" emissiveIntensity={3.0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
