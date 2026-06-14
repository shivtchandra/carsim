"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Stage from "./Stage";
import StylizedCar from "./StylizedCar";

/**
 * Cinematic hero car — slow mouse-tracked orbit, not a rotisserie.
 * The car barely drifts. Your mouse controls the viewing angle.
 * It feels like *you* are walking around the car on the reveal stage.
 */
function RevealCar() {
  const group = useRef<THREE.Group>(null);
  /** Target Y rotation — derived from mouse X. */
  const targetRotY = useRef(0);
  /** Current Y rotation — lerped toward target for buttery motion. */
  const currentRotY = useRef(0);

  useFrame(({ pointer, camera }) => {
    if (!group.current) return;

    // Mouse X maps to a ±30° arc — like walking around the platform
    targetRotY.current = pointer.x * 0.5; // ~28 degrees max either way

    // Lerp for smooth, weighty feel — the car is heavy, not twitchy
    currentRotY.current += (targetRotY.current - currentRotY.current) * 0.02;
    group.current.rotation.y = currentRotY.current;

    // Very subtle idle drift so the car doesn't feel dead when mouse is centred
    group.current.rotation.y += Math.sin(Date.now() * 0.0003) * 0.015;

    // Camera: gentle mouse parallax — you move, the viewpoint breathes
    camera.position.x += (7.2 + pointer.x * 0.8 - camera.position.x) * 0.025;
    camera.position.y += (2.3 - pointer.y * 0.35 - camera.position.y) * 0.025;
    camera.lookAt(0, 0.9, 0);
  });

  return (
    <group ref={group}>
      <StylizedCar color="#E8590C" wheelbaseMm={2620} bootLitres={440} />
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <Stage
        camera={{ position: [7.2, 2.3, 7.8], fov: 32 }}
        fog={[16, 38]}
      >
        <RevealCar />

        {/* Reflective ground disc — polished dark mirror, not flat grey */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
          <circleGeometry args={[18, 64]} />
          <meshStandardMaterial
            color="#060608"
            metalness={0.92}
            roughness={0.15}
            envMapIntensity={0.7}
          />
        </mesh>

        {/* Subtle visible light beam — volumetric scrim plane angled in the scene */}
        <mesh position={[2, 5, -1]} rotation={[0.3, 0.4, 0]}>
          <planeGeometry args={[4, 12]} />
          <meshBasicMaterial
            color="#FF8020"
            transparent
            opacity={0.008}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[-2, 5, 1]} rotation={[-0.2, -0.3, 0.1]}>
          <planeGeometry args={[3.5, 11]} />
          <meshBasicMaterial
            color="#4080FF"
            transparent
            opacity={0.005}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </Stage>
    </div>
  );
}
