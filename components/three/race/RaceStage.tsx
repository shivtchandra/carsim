"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import type { ReactNode } from "react";

/**
 * Race Stage — a LIGHT fork of Stage.tsx (which is dark-by-design and shared, so we don't touch it).
 * Daylight key + sky hemisphere + bright Lightformer environment so metallic paint reads as sky
 * reflections, not a black room. Fog fades to bone so distance dissolves into the editorial page bg.
 */
export default function RaceStage({
  children,
  camera = { position: [-9, 4, 7] as [number, number, number], fov: 50 },
  fog = [80, 520],
  className,
}: {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov: number };
  fog?: [number, number];
  className?: string;
}) {
  return (
    <Canvas
      className={className}
      camera={camera}
      frameloop="always"
      dpr={[1, 1.75]}
      shadows
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#EDE6D6", fog[0], fog[1]]} />

      {/* Daylight: bright sky/ground hemisphere fill so nothing reads as a dark void. */}
      <hemisphereLight args={["#fbf4e6", "#cdbfa6", 1.5]} />

      {/* Warm key sun — high and to the right, casts the contact shadows. */}
      <directionalLight
        position={[40, 60, 25]}
        intensity={2.6}
        color="#fff2dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-far={160}
      />

      {/* Cool sky fill from the opposite side to keep shadows from going muddy. */}
      <directionalLight position={[-30, 20, -10]} intensity={0.7} color="#cfe6ff" />

      {/* Bright environment for paint reflections — all light tones, no network HDR. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={3.2} position={[0, 12, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[40, 12, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-16, 4, 6]} rotation={[0, Math.PI / 2, 0]} scale={[14, 8, 1]} color="#dff0ff" />
        <Lightformer intensity={1.2} position={[16, 4, -6]} rotation={[0, -Math.PI / 2, 0]} scale={[14, 8, 1]} color="#fff0d8" />
        <Lightformer intensity={0.8} position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[40, 40, 1]} color="#e8dcc4" />
      </Environment>

      {/* Soft, warm-grey contact shadows read well on the light ground. */}
      <ContactShadows position={[0, 0.012, 0]} opacity={0.42} scale={60} blur={2.2} far={8} color="#2a2018" />

      {children}
    </Canvas>
  );
}
