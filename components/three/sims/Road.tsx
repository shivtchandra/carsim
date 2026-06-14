"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const LANE_W = 3.4;

/** Asphalt strip along +X with dashed lane lines. x0..x1, `lanes` lanes centred on z=0. */
export function Road({
  x0,
  x1,
  lanes = 2,
  shoulder = 1.2,
  terrain = "highway",
}: {
  x0: number;
  x1: number;
  lanes?: number;
  shoulder?: number;
  terrain?: "highway" | "city" | "speedbump" | "offroad";
}) {
  const length = x1 - x0;
  const width = lanes * LANE_W + shoulder * 2;
  const dashes = useMemo(() => {
    const out: { x: number; z: number }[] = [];
    for (let line = 1; line < lanes; line++) {
      const z = (line - lanes / 2) * LANE_W;
      for (let x = x0; x < x1; x += 6) out.push({ x: x + 3, z });
    }
    return out;
  }, [x0, x1, lanes]);

  const mudPatches = useMemo(() => {
    if (terrain !== "offroad") return [];
    return Array.from({ length: 9 }).map((_, i) => ({
      x: x0 + 80 + i * 72,
      z: i % 2 === 0 ? -1.2 : 1.1,
      w: 10 + (i % 3) * 3,
      h: 1.2 + (i % 2) * 0.4,
    }));
  }, [terrain, x0]);

  const puddles = useMemo(() => {
    if (terrain !== "city") return [];
    return Array.from({ length: 6 }).map((_, i) => ({
      x: x0 + 120 + i * 96,
      z: i % 2 === 0 ? -2.1 : 2.05,
      w: 3.2 + (i % 2) * 0.8,
      h: 1.4 + (i % 3) * 0.2,
    }));
  }, [terrain, x0]);

  const bumps = useMemo(() => {
    if (terrain !== "speedbump") return [];
    return Array.from({ length: 4 }).map((_, i) => x0 + 240 + i * 82);
  }, [terrain, x0]);

  const roadColor =
    terrain === "offroad" ? "#4E4338" : terrain === "city" ? "#2C3137" : "#131316";
  const shoulderColor =
    terrain === "offroad" ? "#5A4B3A" : terrain === "city" ? "#4A5058" : "#3f3f46";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x0 + length / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color={roadColor} roughness={terrain === "offroad" ? 1 : 0.95} envMapIntensity={0.15} />
      </mesh>
      {/* edge lines */}
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[x0 + length / 2, 0.005, (s * (width - 0.6)) / 2]}>
          <planeGeometry args={[length, 0.12]} />
          <meshStandardMaterial color={shoulderColor} envMapIntensity={0.2} />
        </mesh>
      ))}
      {terrain !== "offroad" &&
        dashes.map((d, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[d.x, 0.005, d.z]}>
            <planeGeometry args={[2.6, 0.14]} />
            <meshStandardMaterial color={terrain === "city" ? "#6B7280" : "#52525b"} envMapIntensity={0.2} />
          </mesh>
        ))}

      {mudPatches.map((patch, i) => (
        <mesh key={`mud-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[patch.x, 0.01, patch.z]}>
          <planeGeometry args={[patch.w, patch.h]} />
          <meshStandardMaterial color="#6B513F" roughness={1} />
        </mesh>
      ))}

      {puddles.map((patch, i) => (
        <mesh key={`puddle-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[patch.x, 0.012, patch.z]}>
          <planeGeometry args={[patch.w, patch.h]} />
          <meshStandardMaterial color="#5C6D80" transparent opacity={0.48} roughness={0.35} metalness={0.15} />
        </mesh>
      ))}

      {bumps.map((x, i) => (
        <mesh key={`bump-${i}`} position={[x, 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.12, width - 0.5]} />
          <meshStandardMaterial color="#C99B5A" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/** Lane-line dashes that scroll backwards to convey constant forward speed (for fixed-frame scenes). */
export function ScrollingDashes({
  speedMs,
  z = 0,
  span = 120,
  timeRef,
}: {
  speedMs: number;
  z?: number;
  span?: number;
  timeRef?: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const period = 6;
  useFrame(() => {
    if (!group.current) return;
    const t = timeRef?.current ?? 0;
    group.current.position.x = -((speedMs * t) % period);
  });
  const xs = useMemo(() => {
    const out: number[] = [];
    for (let x = -span / 2; x < span / 2 + period; x += period) out.push(x);
    return out;
  }, [span]);
  return (
    <group ref={group}>
      {xs.map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, z]}>
          <planeGeometry args={[2.6, 0.14]} />
          <meshStandardMaterial color="#52525b" envMapIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/** Simple grey truck (cab + trailer) for the overtake scene. */
export function Truck() {
  return (
    <group>
      {/* trailer */}
      <mesh position={[-1.2, 1.45, 0]} castShadow>
        <boxGeometry args={[7.2, 2.5, 2.45]} />
        <meshStandardMaterial color="#3a3a40" roughness={0.7} />
      </mesh>
      {/* cab */}
      <mesh position={[3.1, 1.0, 0]} castShadow>
        <boxGeometry args={[1.6, 1.7, 2.3]} />
        <meshStandardMaterial color="#52525b" roughness={0.5} metalness={0.3} />
      </mesh>
      {[[2.9, 1.05], [-3.6, 1.05], [-1.4, 1.05]].map(([x], i) =>
        [1.05, -1.05].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.5, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
            <meshStandardMaterial color="#0c0c0e" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
}

/** Finish gate: orange strip across the road + two posts. */
export function FinishGate({ x, width }: { x: number; width: number }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <planeGeometry args={[0.8, width]} />
        <meshStandardMaterial color="#E8590C" emissive="#E8590C" emissiveIntensity={0.6} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 1.6, (s * width) / 2]}>
          <boxGeometry args={[0.12, 3.2, 0.12]} />
          <meshStandardMaterial color="#27272a" metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
