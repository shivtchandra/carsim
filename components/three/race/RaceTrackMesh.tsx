"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { camberHeight, leftNormal, sampleTrack, type CompiledTrack, type TrackSample } from "@/lib/race/track";

const STEP = 3; // metres between ribbon cross-sections

/** Build a banked ribbon between two lateral offsets (oA..oB) following the centerline. */
function buildBand(samples: TrackSample[], oA: number, oB: number, lift: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  samples.forEach((s) => {
    const n = leftNormal(s.heading);
    const yA = s.elevation + camberHeight(s.curvature, oA) + lift;
    const yB = s.elevation + camberHeight(s.curvature, oB) + lift;
    pos.push(
      s.pos.x + n.x * oA, yA, s.pos.z + n.z * oA,
      s.pos.x + n.x * oB, yB, s.pos.z + n.z * oB
    );
  });
  for (let i = 0; i < samples.length - 1; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Banked road ribbon + framing verge + edge lines + dashes + start/finish. */
export default function RaceTrackMesh({ track }: { track: CompiledTrack }) {
  const tarmac = track.baseSurface === "tarmac";
  const half = track.width;

  const { road, vergeL, vergeR, edgeL, edgeR, dashes } = useMemo(() => {
    const n = Math.max(2, Math.ceil(track.totalLength / STEP) + 1);
    const samples = Array.from({ length: n }, (_, i) =>
      sampleTrack(track, Math.min(i * STEP, track.totalLength))
    );

    const dashList: { x: number; y: number; z: number; rot: number }[] = [];
    if (tarmac) {
      for (let s = 8; s < track.totalLength - 4; s += 9) {
        const smp = sampleTrack(track, s);
        dashList.push({ x: smp.pos.x, y: smp.elevation + 0.05, z: smp.pos.z, rot: -smp.heading });
      }
    }

    return {
      road: buildBand(samples, half, -half, 0.02),
      vergeL: buildBand(samples, half + (tarmac ? 1.6 : 1.0), half - 0.05, -0.04),
      vergeR: buildBand(samples, -half + 0.05, -half - (tarmac ? 1.6 : 1.0), -0.04),
      edgeL: buildBand(samples, half - 0.05, half - 0.22, 0.035),
      edgeR: buildBand(samples, -half + 0.22, -half + 0.05, 0.035),
      dashes: dashList,
    };
  }, [track, tarmac, half]);

  const start = sampleTrack(track, 0.5);
  const finish = sampleTrack(track, track.totalLength - 0.5);
  const finishN = leftNormal(finish.heading);

  return (
    <group>
      {/* Framing verge (kerb / dirt shoulder) */}
      <mesh geometry={vergeL} receiveShadow>
        <meshStandardMaterial color={tarmac ? "#b8b0a0" : "#7c6347"} roughness={1} metalness={0} />
      </mesh>
      <mesh geometry={vergeR} receiveShadow>
        <meshStandardMaterial color={tarmac ? "#b8b0a0" : "#7c6347"} roughness={1} metalness={0} />
      </mesh>

      {/* Road surface */}
      <mesh geometry={road} receiveShadow>
        <meshStandardMaterial
          color={tarmac ? "#4a484e" : "#574231"}
          roughness={tarmac ? 0.9 : 0.95}
          metalness={tarmac ? 0.05 : 0.12}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Edge lines */}
      <mesh geometry={edgeL}>
        <meshStandardMaterial color={tarmac ? "#ece7da" : "#9a7f5e"} roughness={0.6} envMapIntensity={0.3} />
      </mesh>
      <mesh geometry={edgeR}>
        <meshStandardMaterial color={tarmac ? "#ece7da" : "#9a7f5e"} roughness={0.6} envMapIntensity={0.3} />
      </mesh>

      {dashes.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]} rotation={[-Math.PI / 2, 0, d.rot]}>
          <planeGeometry args={[2.4, 0.16]} />
          <meshStandardMaterial color="#d9cf4a" roughness={0.6} />
        </mesh>
      ))}

      {/* Start strip */}
      <mesh position={[start.pos.x, start.elevation + 0.04, start.pos.z]} rotation={[-Math.PI / 2, 0, -start.heading]}>
        <planeGeometry args={[0.6, half * 2]} />
        <meshStandardMaterial color="#f4f0e6" roughness={0.7} />
      </mesh>

      {/* Finish line + gantry */}
      <mesh position={[finish.pos.x, finish.elevation + 0.04, finish.pos.z]} rotation={[-Math.PI / 2, 0, -finish.heading]}>
        <planeGeometry args={[1.0, half * 2]} />
        <meshStandardMaterial color="#E8590C" emissive="#E8590C" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      {[1, -1].map((s) => (
        <mesh
          key={s}
          position={[
            finish.pos.x + finishN.x * s * half,
            finish.elevation + 1.7,
            finish.pos.z + finishN.z * s * half,
          ]}
        >
          <boxGeometry args={[0.16, 3.4, 0.16]} />
          <meshStandardMaterial color="#3a3a40" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[finish.pos.x, finish.elevation + 3.5, finish.pos.z]} rotation={[0, -finish.heading, 0]}>
        <boxGeometry args={[0.3, 0.5, half * 2.1]} />
        <meshStandardMaterial color="#2f2f35" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}
