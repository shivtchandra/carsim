"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { VehicleDNA } from "@/lib/vehicle-dna/types";
import { blackKeyTexture } from "@/lib/textureUtils";
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

/** Body paint sampled from Creta top-down asset — not brand corporate blue. */
const CRETA_BODY = "#7a1828";

/**
 * 3D shell from creta_topdown.png:
 * - Top face = keyed photo (roof plan)
 * - Side faces = body colour (visible from Launch chase camera)
 * - Wheels at corners
 */
export default function TopDownPhotoCar({
  textureUrl,
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
  const rawTexture = useTexture(textureUrl);

  const roofTexture = useMemo(() => {
    const keyed = blackKeyTexture(rawTexture, 0.1);
    keyed.center.set(0.5, 0.5);
    keyed.rotation = Math.PI / 2;
    return keyed;
  }, [rawTexture]);

  const props = dna?.proportions;
  const rideMult = props?.rideHeight ?? 1;
  const shoulderMult = props?.shoulderWidth ?? 1;

  const wheelbase = wheelbaseMm / 1000;
  const length = wheelbase + 1.65;
  const rearOverhang = 0.72 + (bootLitres - 380) / 1500;
  const width = 1.8 * shoulderMult;
  const isSedan = (dna?.bodyStyle ?? bodyStyle) === "sedan";
  const bodyH = (isSedan ? 0.48 : 0.52) * rideMult;
  const wheelR = wheelRadius(dna?.wheelInches ?? (isSedan ? 16 : 17));
  const trackZ = width / 2 - 0.12;

  const axleFront = wheelbase / 2;
  const axleRear = -wheelbase / 2;
  const noseX = axleFront + (length - wheelbase - rearOverhang);
  const tailX = axleRear - rearOverhang;
  const centerX = (noseX + tailX) / 2;

  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Mesh[]>([]);

  const bodyY = wheelR + bodyH / 2;

  const sideMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CRETA_BODY,
        metalness: 0.55,
        roughness: 0.38,
      }),
    []
  );

  const roofMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: roofTexture,
        transparent: true,
        alphaTest: 0.1,
        metalness: 0.35,
        roughness: 0.28,
        envMapIntensity: 1.3,
      }),
    [roofTexture]
  );

  /** Box face order: +X, −X, +Y (top), −Y, +Z, −Z */
  const bodyMaterials = useMemo(
    () => [sideMat, sideMat, roofMat, sideMat, sideMat, sideMat],
    [sideMat, roofMat]
  );

  const tire = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0c0c0e", roughness: 0.92 }),
    []
  );
  const rim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c8cdd4",
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

  return (
    <group ref={group}>
      {/* 3D body — chase camera sees red sides + top-down photo on roof */}
      <mesh position={[centerX, bodyY, 0]} material={bodyMaterials} castShadow receiveShadow>
        <boxGeometry args={[length * 0.96, bodyH, width * 0.94]} />
      </mesh>

      {/* Windscreen rake — reads as SUV from the side */}
      <mesh position={[centerX + length * 0.08, bodyY + bodyH * 0.38, 0]} castShadow>
        <boxGeometry args={[length * 0.38, bodyH * 0.22, width * 0.88]} />
        <meshStandardMaterial color="#0a0c12" metalness={0.9} roughness={0.05} />
      </mesh>

      {wheelPositions.map(([x, z], i) => (
        <group key={i} position={[x, wheelR, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            ref={(el) => {
              if (el) wheels.current[i] = el;
            }}
            material={tire}
            castShadow
          >
            <cylinderGeometry args={[wheelR, wheelR, 0.24, 20]} />
          </mesh>
          <mesh material={rim} position={[0, z > 0 ? 0.13 : -0.13, 0]}>
            <cylinderGeometry args={[wheelR * 0.55, wheelR * 0.55, 0.02, 12]} />
          </mesh>
        </group>
      ))}

      {([width * 0.32, -width * 0.32] as const).map((z, i) => (
        <mesh key={`t${i}`} position={[tailX + 0.03, bodyY, z]}>
          <boxGeometry args={[0.05, 0.08, 0.22]} />
          <meshStandardMaterial color="#5b0a0a" emissive="#ff4040" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
