"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { leftNormal, sampleTrack, type CompiledTrack, type TrackSample } from "@/lib/race/track";

const SKIRT_STEP = 6;
const WALL_STEP = 4;
const PROP_STEP = 26;

/** Flat (non-banked) band between two offsets following the centerline + elevation. */
function buildBand(samples: TrackSample[], oA: number, oB: number, yA: number, yB: number): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  samples.forEach((s) => {
    const n = leftNormal(s.heading);
    pos.push(
      s.pos.x + n.x * oA, s.elevation + yA, s.pos.z + n.z * oA,
      s.pos.x + n.x * oB, s.elevation + yB, s.pos.z + n.z * oB
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

export default function RaceEnvironment({ track }: { track: CompiledTrack }) {
  const offroad = track.def.environmentKit === "offroad";
  const half = track.width;

  const skirt = useMemo(() => {
    const n = Math.max(2, Math.ceil(track.totalLength / SKIRT_STEP) + 1);
    const s = Array.from({ length: n }, (_, i) => sampleTrack(track, Math.min(i * SKIRT_STEP, track.totalLength)));
    return buildBand(s, half * 9, -half * 9, -0.06, -0.06);
  }, [track, half]);

  const walls = useMemo(() => {
    if (offroad) return null;
    const n = Math.max(2, Math.ceil(track.totalLength / WALL_STEP) + 1);
    const s = Array.from({ length: n }, (_, i) => sampleTrack(track, Math.min(i * WALL_STEP, track.totalLength)));
    const off = half + 0.5;
    return {
      left: buildBand(s, off, off, 0.0, 0.55),
      right: buildBand(s, -off, -off, 0.0, 0.55),
    };
  }, [track, half, offroad]);

  const anchors = useMemo(() => {
    const out: { x: number; y: number; z: number; side: number; i: number }[] = [];
    let i = 0;
    for (let d = 14; d < track.totalLength - 8; d += PROP_STEP) {
      const smp = sampleTrack(track, d);
      const n = leftNormal(smp.heading);
      const o = half + (offroad ? 5 : 6);
      for (const side of [1, -1]) {
        out.push({ x: smp.pos.x + n.x * side * o, y: smp.elevation, z: smp.pos.z + n.z * side * o, side, i });
      }
      i++;
    }
    return out;
  }, [track, half, offroad]);

  const gantries = useMemo(() => {
    if (offroad) return [];
    const out: { x: number; y: number; z: number; rot: number }[] = [];
    for (let d = 150; d < track.totalLength - 40; d += 220) {
      const smp = sampleTrack(track, d);
      out.push({ x: smp.pos.x, y: smp.elevation, z: smp.pos.z, rot: -smp.heading });
    }
    return out;
  }, [track, offroad]);

  // Layered rolling hills forming the offroad horizon (Hill Climb Racing style).
  const bgHills = useMemo(() => {
    if (!offroad) return [];
    const out: { x: number; y: number; z: number; r: number; h: number; c: string }[] = [];
    let i = 0;
    for (let d = 0; d < track.totalLength; d += 70) {
      const smp = sampleTrack(track, d);
      const n = leftNormal(smp.heading);
      for (const side of [1, -1]) {
        const o = half + 55 + (i % 3) * 24;
        out.push({
          x: smp.pos.x + n.x * side * o,
          y: smp.elevation - 2,
          z: smp.pos.z + n.z * side * o,
          r: 18 + (i % 4) * 7,
          h: 0.5 + (i % 3) * 0.18,
          c: i % 2 === 0 ? "#84895a" : "#9a8456",
        });
        i++;
      }
    }
    return out;
  }, [track, half, offroad]);

  return (
    <group>
      {/* Far backdrop ground (fog dissolves the seam). */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}>
        <planeGeometry args={[3000, 3000]} />
        <meshStandardMaterial color={offroad ? "#bcaa86" : "#c7cdb6"} roughness={1} />
      </mesh>

      {/* Rolling hill horizon (offroad). */}
      {bgHills.map((h, k) => (
        <mesh key={k} position={[h.x, h.y, h.z]} scale={[1, h.h, 1]} castShadow>
          <icosahedronGeometry args={[h.r, 1]} />
          <meshStandardMaterial color={h.c} roughness={1} flatShading />
        </mesh>
      ))}

      {/* Ground that follows the track. */}
      <mesh geometry={skirt} receiveShadow>
        <meshStandardMaterial color={offroad ? "#8f7449" : "#9aac7e"} roughness={1} metalness={0} />
      </mesh>

      {/* Highway guardrails (continuous). */}
      {walls && (
        <>
          <mesh geometry={walls.left} castShadow>
            <meshStandardMaterial color="#9aa6b6" metalness={0.55} roughness={0.45} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={walls.right} castShadow>
            <meshStandardMaterial color="#9aa6b6" metalness={0.55} roughness={0.45} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}

      {/* Overhead gantries. */}
      {gantries.map((g, k) => (
        <group key={k} position={[g.x, g.y, g.z]} rotation={[0, g.rot, 0]}>
          {[1, -1].map((s) => (
            <mesh key={s} position={[0, 2.6, s * (half + 0.7)]} castShadow>
              <boxGeometry args={[0.22, 5.2, 0.22]} />
              <meshStandardMaterial color="#7f8b9c" metalness={0.5} roughness={0.5} />
            </mesh>
          ))}
          <mesh position={[0, 5.0, 0]} castShadow>
            <boxGeometry args={[0.3, 0.4, half * 2 + 1.6]} />
            <meshStandardMaterial color="#5d6675" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 4.4, 0]}>
            <boxGeometry args={[0.12, 0.9, 2.6]} />
            <meshStandardMaterial color="#2f5d3a" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Scenery */}
      {offroad
        ? anchors.map((a, k) => (
            <group key={k} position={[a.x, a.y, a.z]}>
              {a.i % 2 === 0 ? (
                <>
                  <mesh position={[0, 1.1, 0]} castShadow>
                    <cylinderGeometry args={[0.13, 0.18, 2.2, 6]} />
                    <meshStandardMaterial color="#6b4f33" roughness={1} />
                  </mesh>
                  <mesh position={[0, 2.8, 0]} castShadow>
                    <coneGeometry args={[1.1, 3.2, 7]} />
                    <meshStandardMaterial color="#566b3e" roughness={0.95} />
                  </mesh>
                </>
              ) : (
                <mesh position={[0, 0.55, 0]} castShadow>
                  <dodecahedronGeometry args={[0.85 + (a.i % 3) * 0.3, 0]} />
                  <meshStandardMaterial color="#9c8f7a" roughness={1} />
                </mesh>
              )}
            </group>
          ))
        : anchors
            .filter((a) => a.i % 2 === 0)
            .map((a, k) => (
              <group key={k} position={[a.x + a.side * 6, a.y, a.z]}>
                {/* roadside tree clump */}
                <mesh position={[0, 1.4, 0]} castShadow>
                  <cylinderGeometry args={[0.16, 0.22, 2.8, 6]} />
                  <meshStandardMaterial color="#6b5436" roughness={1} />
                </mesh>
                <mesh position={[0, 3.6, 0]} castShadow>
                  <sphereGeometry args={[1.7, 8, 7]} />
                  <meshStandardMaterial color="#6f8a52" roughness={0.9} />
                </mesh>
              </group>
            ))}
    </group>
  );
}
