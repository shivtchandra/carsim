"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import type { ReactNode } from "react";

/**
 * Reveal Stage — the 3D canvas shell.
 *
 * CRITICAL: background is transparent (`alpha: true`). The CSS room
 * environment paints behind the canvas. The 3D scene composites on top.
 * This means the car exists *inside* the CSS room, not in its own box.
 */
export default function Stage({
  children,
  camera = { position: [5.2, 2.4, 5.2] as [number, number, number], fov: 38 },
  frameloop = "always",
  shadowFrames,
  fog = [18, 42],
  className,
}: {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov: number };
  frameloop?: "always" | "demand";
  shadowFrames?: number;
  fog?: [number, number];
  className?: string;
}) {
  return (
    <Canvas
      className={className}
      camera={camera}
      frameloop={frameloop}
      dpr={[1, 1.75]}
      shadows
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* NO background color — transparent canvas, CSS room shows through */}
      <fog attach="fog" args={["#09060D", fog[0], fog[1]]} />

      {/* ── KEY LIGHT: warm tungsten overhead-right ──────────────────
          Main theatrical spot — high angle, narrow cone, warm.
          Positioned to match the CSS conic-gradient beam from ~68% top. */}
      <spotLight
        position={[6, 12, 4]}
        intensity={140}
        color="#ffe8c0"
        angle={0.32}
        penumbra={0.55}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* ── FILL: cool blue from camera-left ─────────────────────── */}
      <directionalLight position={[-8, 5, 4]} intensity={1.2} color="#a8e8ff" />

      {/* ── RIM / BACKLIGHT: cyan from rear ───────────────────── */}
      <spotLight
        position={[-3, 5, -8]}
        intensity={180}
        color="#C84C31"
        angle={0.65}
        penumbra={1.0}
      />

      {/* ── SECONDARY RIM: plum from opposite rear ──────────── */}
      <spotLight
        position={[6, 3, -7]}
        intensity={40}
        color="#5B3780"
        angle={0.8}
        penumbra={1.0}
      />

      {/* ── GROUND BOUNCE: plum uplight from polished floor ────── */}
      <pointLight position={[0, -0.3, 0]} intensity={6} color="#1a0a28" distance={5} />

      {/* No ambient — the darkness is the design */}

      {/* Environment map — gives metallic paint its mirror reflections */}
      <Environment resolution={512} frames={1}>
        {/* Ceiling strip — the long highlight on the hood/roof */}
        <Lightformer intensity={8} position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[20, 3, 1]} color="#fff4e0" />
        {/* Left side: cool window wall */}
        <Lightformer intensity={2.5} position={[-12, 3, 0]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} color="#b8f0ff" />
        {/* Rear: cyan backlight panel — the hero reflection */}
        <Lightformer intensity={10} position={[0, 4, -12]} rotation={[0, 0, 0]} scale={[14, 5, 1]} color="#C84C31" />
        {/* Right side: very faint warm fill */}
        <Lightformer intensity={1.5} position={[12, 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 2, 1]} color="#ffe8c0" />
        {/* Floor: dark mirror reflection from below */}
        <Lightformer intensity={0.8} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[20, 20, 1]} color="#080810" />
      </Environment>

      {/* Contact shadows — crisp and dark on the polished ground */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.9}
        scale={30}
        blur={1.5}
        far={5}
        frames={shadowFrames}
        color="#000000"
      />

      {children}
    </Canvas>
  );
}
