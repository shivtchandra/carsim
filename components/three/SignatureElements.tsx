"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { SignatureElement } from "@/lib/vehicle-dna/types";

export function SignatureElements({
  signatures,
  noseX,
  bodyY,
  bodyH,
  width,
  paint,
  accent,
}: {
  signatures: SignatureElement[];
  noseX: number;
  bodyY: number;
  bodyH: number;
  width: number;
  paint: THREE.MeshStandardMaterial;
  accent: string;
}) {
  const has = (s: SignatureElement) => signatures.includes(s);
  const zL = width * 0.32;
  const zR = -width * 0.32;
  const fasciaX = noseX - 0.04;

  return (
    <group>
      {has("parametric-grille") && (
        <group position={[fasciaX, bodyY - 0.02, 0]}>
          <mesh>
            <boxGeometry args={[0.08, bodyH * 0.45, width * 0.55]} />
            <meshStandardMaterial color="#1a1c22" metalness={0.6} roughness={0.45} />
          </mesh>
          {[-0.12, 0, 0.12].map((yOff, i) => (
            <mesh key={i} position={[0.02, yOff, 0]}>
              <boxGeometry args={[0.03, 0.025, width * 0.48]} />
              <meshStandardMaterial color="#c8cdd4" metalness={0.95} roughness={0.1} />
            </mesh>
          ))}
        </group>
      )}

      {has("tiger-nose-grille") && (
        <group position={[fasciaX, bodyY - 0.04, 0]}>
          <mesh>
            <boxGeometry args={[0.1, bodyH * 0.55, width * 0.72]} />
            <meshStandardMaterial color="#1a1c22" metalness={0.6} roughness={0.45} />
          </mesh>
          <mesh position={[0.04, 0.08, 0]}>
            <boxGeometry args={[0.04, 0.04, width * 0.12]} />
            <meshStandardMaterial color="#c8cdd4" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      )}

      {has("vertical-slat-grille") && (
        <group position={[fasciaX, bodyY, 0]}>
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} position={[0.02, (i - 3) * 0.055, 0]}>
              <boxGeometry args={[0.06, 0.028, width * 0.5]} />
              <meshStandardMaterial color="#1a1c22" metalness={0.6} roughness={0.45} />
            </mesh>
          ))}
        </group>
      )}

      {has("round-headlamps") &&
        ([zL, zR] as const).map((z, i) => (
          <mesh key={i} position={[fasciaX, bodyY + 0.14, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.08, 16]} />
            <meshStandardMaterial color="#fff8e8" emissive="#fff0c0" emissiveIntensity={4} toneMapped={false} />
          </mesh>
        ))}

      {has("split-headlamp") &&
        !has("round-headlamps") &&
        ([zL, zR] as const).map((z, i) => (
          <group key={i} position={[fasciaX, bodyY + 0.1, z]}>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.05, 0.04, 0.22]} />
              <meshStandardMaterial color="#fff8e8" emissive={accent} emissiveIntensity={3.5} toneMapped={false} />
            </mesh>
            <mesh position={[0, -0.04, 0]}>
              <boxGeometry args={[0.06, 0.1, 0.26]} />
              <meshStandardMaterial color="#fff8e8" emissive={accent} emissiveIntensity={3.5} toneMapped={false} />
            </mesh>
          </group>
        ))}

      {has("star-map-drl") &&
        ([zL, zR] as const).map((z, i) => (
          <group key={i} position={[fasciaX, bodyY + 0.12, z]}>
            <mesh rotation={[0, 0, 0.35]}>
              <boxGeometry args={[0.05, 0.06, 0.3]} />
              <meshStandardMaterial color="#fff8e8" emissive={accent} emissiveIntensity={3.5} toneMapped={false} />
            </mesh>
            <mesh position={[0, -0.05, 0.06]} rotation={[0, 0, -0.5]}>
              <boxGeometry args={[0.04, 0.05, 0.18]} />
              <meshStandardMaterial color="#fff8e8" emissive={accent} emissiveIntensity={3.5} toneMapped={false} />
            </mesh>
          </group>
        ))}

      {has("c-shape-drl") &&
        ([zL, zR] as const).map((z, i) => (
          <group key={i} position={[fasciaX, bodyY + 0.12, z]}>
            <mesh>
              <boxGeometry args={[0.05, 0.14, 0.08]} />
              <meshStandardMaterial color="#fff8e8" emissive={accent} emissiveIntensity={3.5} toneMapped={false} />
            </mesh>
            <mesh position={[0, -0.04, 0.06]}>
              <boxGeometry args={[0.05, 0.06, 0.2]} />
              <meshStandardMaterial color="#fff8e8" emissive={accent} emissiveIntensity={3.5} toneMapped={false} />
            </mesh>
          </group>
        ))}

      {has("connected-drl") &&
        !has("split-headlamp") &&
        !has("round-headlamps") && (
          <mesh position={[fasciaX, bodyY + 0.18, 0]}>
            <boxGeometry args={[0.05, 0.05, width * 0.75]} />
            <meshStandardMaterial color="#fff8e8" emissive={accent} emissiveIntensity={3.5} toneMapped={false} />
          </mesh>
        )}

      {!has("split-headlamp") &&
        !has("round-headlamps") &&
        !has("star-map-drl") &&
        !has("c-shape-drl") &&
        !has("connected-drl") &&
        ([zL, zR] as const).map((z, i) => (
          <mesh key={i} position={[fasciaX, bodyY + 0.12, z]}>
            <boxGeometry args={[0.06, 0.1, 0.28]} />
            <meshStandardMaterial color="#fffaed" emissive="#fff0c0" emissiveIntensity={4} toneMapped={false} />
          </mesh>
        ))}

      {has("flush-handles") &&
        [0.15, -0.35].map((xOff, i) => (
          <mesh key={i} position={[xOff, bodyY + 0.05, width * 0.48]} material={paint}>
            <boxGeometry args={[0.18, 0.04, 0.02]} />
          </mesh>
        ))}

      {has("clamshell-hood") && (
        <mesh position={[noseX - 0.35, bodyY + bodyH * 0.35, 0]}>
          <boxGeometry args={[0.5, 0.015, width * 0.85]} />
          <meshStandardMaterial color="#000000" opacity={0.25} transparent />
        </mesh>
      )}
    </group>
  );
}

export function FloatingRoof({
  cabinX,
  cabinLen,
  bodyY,
  bodyH,
  width,
}: {
  cabinX: number;
  cabinLen: number;
  bodyY: number;
  bodyH: number;
  width: number;
}) {
  return (
    <>
      {([width * 0.44, -width * 0.44] as const).map((z, i) => (
        <mesh key={i} position={[cabinX + cabinLen * 0.15, bodyY + bodyH / 2 + 0.22, z]}>
          <boxGeometry args={[0.06, 0.28, 0.06]} />
          <meshStandardMaterial color="#0a0a0c" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}

const flareMat = new THREE.MeshStandardMaterial({ color: "#1a1c22", metalness: 0.5, roughness: 0.5 });

export function MuscleShoulders({
  length,
  bodyY,
  bodyH,
  width,
  centerX,
}: {
  length: number;
  bodyY: number;
  bodyH: number;
  width: number;
  centerX: number;
}) {
  return (
    <>
      {([-1, 1] as const).map((s) => (
        <RoundedBox
          key={s}
          args={[length * 0.55, bodyH * 0.55, 0.12]}
          radius={0.04}
          smoothness={2}
          position={[centerX, bodyY - 0.02, s * (width / 2 + 0.04)]}
          material={flareMat}
        />
      ))}
    </>
  );
}
