"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { CAR_GLB_MODELS, hasGlbModel } from "@/lib/carGlbModels";
import { CAR_PHOTO_3D } from "@/lib/carPhoto3D";
import { hasTopDown3D, TOP_DOWN_3D } from "@/lib/carTopDownAssets";
import type { VehicleDNA } from "@/lib/vehicle-dna";
import GlbCar from "./GlbCar";
import PhotoSideCar from "./PhotoSideCar";
import TopDownPhotoCar from "./TopDownPhotoCar";
import { FloatingRoof, MuscleShoulders, SignatureElements } from "./SignatureElements";

export interface CarMotionRef {
  wheelSpeed: number;
  pitch: number;
  steerAngle?: number;
  roll?: number;
}

const WHEEL_R_BY_INCH: Record<number, number> = {
  15: 0.31,
  16: 0.33,
  17: 0.35,
  18: 0.38,
  19: 0.4,
  20: 0.42,
};

function wheelRadius(inches: number): number {
  return WHEEL_R_BY_INCH[inches] ?? 0.35 + (inches - 17) * 0.015;
}

/**
 * DNA-driven stylized car — recognizable silhouette + signature features.
 * Proportioned from wheelbase/boot; identity from Vehicle DNA system.
 * Uses a GLB when registered (e.g. Creta), else photo shell or procedural mesh.
 */
export default function StylizedCar(props: {
  modelId?: string;
  color: string;
  wheelbaseMm?: number;
  bootLitres?: number;
  bodyStyle?: "suv" | "sedan";
  dna?: VehicleDNA;
  motionRef?: React.MutableRefObject<CarMotionRef>;
}) {
  const glbUrl = props.modelId && hasGlbModel(props.modelId) ? CAR_GLB_MODELS[props.modelId] : undefined;
  if (glbUrl) {
    return (
      <Suspense fallback={<ProceduralStylizedCar {...props} />}>
        <GlbCar {...props} glbUrl={glbUrl} />
      </Suspense>
    );
  }

  const topDownUrl = props.modelId && hasTopDown3D(props.modelId) ? TOP_DOWN_3D[props.modelId] : undefined;
  if (topDownUrl) {
    return (
      <Suspense fallback={<ProceduralStylizedCar {...props} />}>
        <TopDownPhotoCar {...props} textureUrl={topDownUrl} />
      </Suspense>
    );
  }

  const sideUrl = props.modelId ? CAR_PHOTO_3D[props.modelId] : undefined;
  if (sideUrl) {
    return (
      <Suspense fallback={<ProceduralStylizedCar {...props} />}>
        <PhotoSideCar {...props} textureUrl={sideUrl} />
      </Suspense>
    );
  }
  return <ProceduralStylizedCar {...props} />;
}

function ProceduralStylizedCar({
  color,
  wheelbaseMm = 2610,
  bootLitres = 430,
  bodyStyle = "suv",
  dna,
  motionRef,
}: {
  color: string;
  wheelbaseMm?: number;
  bootLitres?: number;
  bodyStyle?: "suv" | "sedan";
  dna?: VehicleDNA;
  motionRef?: React.MutableRefObject<CarMotionRef>;
}) {
  const signatures = dna?.signatureElements ?? [];
  const props = dna?.proportions;
  const boxiness = props?.boxiness ?? 0.15;
  const rideMult = props?.rideHeight ?? 1;
  const shoulderMult = props?.shoulderWidth ?? 1;
  const isFastback = signatures.includes("fastback-sedan");
  const isBoxy = signatures.includes("boxy-profile") || boxiness > 0.6;

  const wheelbase = wheelbaseMm / 1000;
  const length = wheelbase + 1.65;
  const rearOverhang = 0.72 + (bootLitres - 380) / 1500;
  const width = 1.8 * shoulderMult;

  const isSedan = (dna?.bodyStyle ?? bodyStyle) === "sedan";
  const bodyH = (isSedan ? 0.48 : 0.52) * rideMult;
  const bodyY = (isSedan ? 0.4 : 0.52) * rideMult;
  const wheelR = wheelRadius(dna?.wheelInches ?? (isSedan ? 16 : 17));
  const cornerR = Math.max(0.04, 0.16 * (1 - boxiness * 0.75));
  const trackZ = width / 2 - 0.12;

  const axleFront = wheelbase / 2;
  const axleRear = -wheelbase / 2;
  const noseX = axleFront + (length - wheelbase - rearOverhang);
  const tailX = axleRear - rearOverhang;

  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Mesh[]>([]);
  const steeringPivots = useRef<(THREE.Group | null)[]>([]);

  const paint = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.88,
        roughness: 0.12,
        envMapIntensity: 1.4,
      }),
    [color]
  );
  const glass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#08090e"),
        metalness: 0.95,
        roughness: 0.05,
        envMapIntensity: 2.0,
      }),
    []
  );
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
        envMapIntensity: 1.8,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!motionRef) return;
    for (const w of wheels.current) {
      if (w) w.rotation.y -= motionRef.current.wheelSpeed * delta;
    }
    
    // Front wheel steering
    const steerAngle = motionRef.current.steerAngle ?? 0;
    if (steeringPivots.current[0]) steeringPivots.current[0].rotation.y = steerAngle;
    if (steeringPivots.current[1]) steeringPivots.current[1].rotation.y = steerAngle;

    if (group.current) {
      group.current.rotation.z = motionRef.current.pitch;
      group.current.rotation.x = motionRef.current.roll ?? 0;
    }
  });

  const wheelPositions: [number, number][] = [
    [axleFront, trackZ],
    [axleFront, -trackZ],
    [axleRear, trackZ],
    [axleRear, -trackZ],
  ];

  const centerX = (noseX + tailX) / 2;

  return (
    <group ref={group}>
      <RoundedBox
        args={[length, bodyH, width]}
        radius={cornerR}
        smoothness={isBoxy ? 2 : 3}
        position={[centerX, bodyY, 0]}
        material={paint}
        castShadow
      />

      {signatures.includes("muscle-shoulders") && (
        <MuscleShoulders length={length} bodyY={bodyY} bodyH={bodyH} width={width} centerX={centerX} />
      )}

      {/* Side-profile cues — readable from chase / lane cameras */}
      {signatures.includes("boxy-profile") && (
        <>
          {[axleFront, axleRear].map((ax, i) => (
            <mesh key={`arch${i}`} position={[ax, bodyY - 0.08, width * 0.46]}>
              <boxGeometry args={[0.55, 0.22, 0.08]} />
              <meshStandardMaterial color="#1a1c22" metalness={0.4} roughness={0.6} />
            </mesh>
          ))}
        </>
      )}
      {signatures.includes("tiger-nose-grille") && (
        <mesh position={[noseX - 0.55, bodyY + 0.08, width * 0.44]}>
          <boxGeometry args={[0.35, 0.06, 0.04]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
        </mesh>
      )}
      {(signatures.includes("parametric-grille") || signatures.includes("vertical-slat-grille")) && (
        <mesh position={[noseX - 0.2, bodyY + bodyH * 0.15, width * 0.47]}>
          <boxGeometry args={[0.5, 0.03, 0.02]} />
          <meshStandardMaterial color="#c8cdd4" metalness={0.95} roughness={0.1} />
        </mesh>
      )}
      {signatures.includes("floating-roof") && (
        <mesh position={[centerX, bodyY + bodyH / 2 + 0.38, 0]}>
          <boxGeometry args={[length * 0.45, 0.025, width * 0.88]} />
          <meshStandardMaterial color="#0a0a0c" metalness={0.7} roughness={0.35} />
        </mesh>
      )}

      {isSedan ? (
        <>
          <RoundedBox
            args={[wheelbase * (isFastback ? 0.88 : 0.82), 0.3, width * 0.88]}
            radius={cornerR * 0.8}
            smoothness={3}
            position={[-0.05, bodyY + bodyH / 2 + 0.1, 0]}
            material={paint}
            castShadow
          />
          <RoundedBox
            args={[wheelbase * (isFastback ? 0.78 : 0.7), 0.18, width * 0.92]}
            radius={cornerR * 0.6}
            smoothness={2}
            position={[isFastback ? -0.12 : -0.05, bodyY + bodyH / 2 + (isFastback ? 0.2 : 0.18), 0]}
            material={glass}
          />
          {!isFastback && (
            <RoundedBox
              args={[rearOverhang * 0.82, 0.07, width * 0.9]}
              radius={0.04}
              smoothness={2}
              position={[tailX + rearOverhang * 0.41, bodyY + bodyH / 2 + 0.035, 0]}
              material={paint}
              castShadow
            />
          )}
          {isFastback && (
            <RoundedBox
              args={[rearOverhang * 1.1, 0.12, width * 0.88]}
              radius={0.06}
              smoothness={2}
              position={[tailX + rearOverhang * 0.55, bodyY + bodyH / 2 + 0.08, 0]}
              material={paint}
              castShadow
            />
          )}
        </>
      ) : (
        (() => {
          const cabinRatio = props?.cabinRatio ?? 0.88;
          const cabinFront = axleFront + 0.15;
          const cabinRear = tailX + 0.08;
          const cabinLen = (cabinFront - cabinRear) * cabinRatio;
          const cabinX = (cabinFront + cabinRear) / 2;
          return (
            <>
              <RoundedBox
                args={[cabinLen, isBoxy ? 0.55 : 0.5, width * 0.92]}
                radius={isBoxy ? cornerR * 0.5 : cornerR * 0.6}
                smoothness={isBoxy ? 2 : 3}
                position={[cabinX, bodyY + bodyH / 2 + 0.18, 0]}
                material={paint}
                castShadow
              />
              <RoundedBox
                args={[cabinLen * 0.92, isBoxy ? 0.22 : 0.26, width * 0.96]}
                radius={cornerR * 0.4}
                smoothness={2}
                position={[cabinX + 0.04, bodyY + bodyH / 2 + 0.28, 0]}
                material={glass}
              />
              {signatures.includes("roof-rails") &&
                !isBoxy &&
                ([width * 0.36, -width * 0.36] as const).map((z, i) => (
                  <mesh key={`rail${i}`} position={[cabinX, bodyY + bodyH / 2 + 0.45, z]}>
                    <boxGeometry args={[cabinLen * 0.7, 0.035, 0.05]} />
                    <meshStandardMaterial color="#1a1c22" metalness={0.7} roughness={0.4} />
                  </mesh>
                ))}
              {signatures.includes("floating-roof") && (
                <FloatingRoof cabinX={cabinX} cabinLen={cabinLen} bodyY={bodyY} bodyH={bodyH} width={width} />
              )}
            </>
          );
        })()
      )}

      {wheelPositions.map(([x, z], i) => {
        const isFront = i < 2;
        const wheelContent = (
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh ref={(el) => { if (el) wheels.current[i] = el; }} material={tire} castShadow>
              <cylinderGeometry args={[wheelR, wheelR, 0.24, 20]} />
            </mesh>
            <mesh material={rim} position={[0, z > 0 ? 0.13 : -0.13, 0]}>
              <cylinderGeometry args={[wheelR * 0.55, wheelR * 0.55, 0.02, 12]} />
            </mesh>
          </group>
        );

        if (isFront) {
          return (
            <group
              key={i}
              position={[x, wheelR, z]}
              ref={(el) => {
                if (el) steeringPivots.current[i] = el;
              }}
            >
              {wheelContent}
            </group>
          );
        } else {
          return (
            <group key={i} position={[x, wheelR, z]}>
              {wheelContent}
            </group>
          );
        }
      })}

      <SignatureElements
        signatures={signatures}
        noseX={noseX}
        bodyY={bodyY}
        bodyH={bodyH}
        width={width}
        paint={paint}
        accent={color}
      />

      {([width * 0.32, -width * 0.32] as const).map((z, i) => (
        <mesh key={`t${i}`} position={[tailX + 0.02, bodyY + 0.16, z]}>
          <boxGeometry args={[0.05, 0.09, 0.24]} />
          <meshStandardMaterial color="#5b0a0a" emissive="#ff4040" emissiveIntensity={3.0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
