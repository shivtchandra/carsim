"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { CarMotionRef } from "./StylizedCar";
import { getModel } from "@/lib/data";
import type { VehicleDNA } from "@/lib/vehicle-dna";

const WHEEL_R_BY_INCH: Record<number, number> = {
  15: 0.31,
  16: 0.33,
  17: 0.35,
  18: 0.38,
  19: 0.40,
  20: 0.42,
};

function getWheelRadius(inches: number): number {
  return WHEEL_R_BY_INCH[inches] ?? 0.35 + (inches - 17) * 0.015;
}

function applySimColor(root: THREE.Object3D, hex: string, modelId?: string, dna?: VehicleDNA) {
  const paintColor = new THREE.Color(hex);

  const paintMaterial = new THREE.MeshPhysicalMaterial({
    color: paintColor,
    metalness: 0.5,
    roughness: 0.45,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    envMapIntensity: 2.0,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#000000"),
    metalness: 0.2,
    roughness: 0.05,
    envMapIntensity: 2.5,
    transmission: 1.0, // true refractive glass
    ior: 1.5,
    thickness: 0.05,
    transparent: true,
  });

  const chromeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#ffffff"),
    metalness: 1.0,
    roughness: 0.05,
    clearcoat: 1.0,
    envMapIntensity: 2.5,
  });

  const claddingMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#111316"),
    metalness: 0.1,
    roughness: 0.9,
  });

  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#ffffff"),
    emissive: new THREE.Color("#ffffff"),
    emissiveIntensity: 5.0,
    toneMapped: false,
  });

  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#ff0808"),
    emissive: new THREE.Color("#ff0808"),
    emissiveIntensity: 5.0,
    toneMapped: false,
  });

  const signatures = dna?.signatureElements ?? [];
  const isEV = dna?.archetype === "ev-crossover" || (modelId && (modelId.includes("ev") || modelId === "mg-windsor"));
  const hasFloatingRoof = signatures.includes("floating-roof");
  const hasRoofRails = signatures.includes("roof-rails");
  const hasVerticalSlats = signatures.includes("vertical-slat-grille");
  const hasParametric = signatures.includes("parametric-grille");
  const isCreta = modelId === "hyundai-creta" || dna?.modelId === "hyundai-creta" || (modelId && modelId.includes("creta"));

  const hasConnectedDrl = signatures.includes("connected-drl");
  const hasSplitHeadlamp = signatures.includes("split-headlamp");
  const hasTigerNose = signatures.includes("tiger-nose-grille");
  const isBoxy = signatures.includes("boxy-profile");

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    // Clone geometry to avoid mutating the shared cached resource
    mesh.geometry = mesh.geometry.clone();
    const geometry = mesh.geometry;

    // Compute correct vertex normals for specular reflections and clearcoat
    geometry.computeVertexNormals();

    const positionAttribute = geometry.getAttribute("position");
    if (!positionAttribute) return;

    // Ensure geometry is indexed. If not, generate indices.
    let indexAttribute = geometry.index;
    if (!indexAttribute) {
      const count = positionAttribute.count;
      const indices = new Uint32Array(count);
      for (let i = 0; i < count; i++) indices[i] = i;
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      indexAttribute = geometry.index;
    }

    if (!indexAttribute) return;

    const indexCount = indexAttribute.count;
    const paintIndices: number[] = [];
    const glassIndices: number[] = [];
    const claddingIndices: number[] = [];
    const chromeIndices: number[] = [];
    const headlightIndices: number[] = [];
    const taillightIndices: number[] = [];

    for (let j = 0; j < indexCount; j += 3) {
      const idx0 = indexAttribute.getX(j);
      const idx1 = indexAttribute.getX(j + 1);
      const idx2 = indexAttribute.getX(j + 2);

      const x0 = positionAttribute.getX(idx0);
      const y0 = positionAttribute.getY(idx0);
      const z0 = positionAttribute.getZ(idx0);

      const x1 = positionAttribute.getX(idx1);
      const y1 = positionAttribute.getY(idx1);
      const z1 = positionAttribute.getZ(idx1);

      const x2 = positionAttribute.getX(idx2);
      const y2 = positionAttribute.getY(idx2);
      const z2 = positionAttribute.getZ(idx2);

      // Average position of the triangle
      const ax = (x0 + x1 + x2) / 3;
      const ay = (y0 + y1 + y2) / 3;
      const az = (z0 + z1 + z2) / 3;
      const absAx = Math.abs(ax);

      // 1. Original Wheels (Discard from rendering entirely)
      const nearFrontWheel = Math.abs(az - 0.6) < 0.25;
      const nearRearWheel = Math.abs(az + 0.6) < 0.25;
      if (ay < -0.18 && absAx > 0.35 && (nearFrontWheel || nearRearWheel)) {
        continue;
      }

      // 2. Underbody/Chassis Cladding
      // Boxy SUVs get thicker cladding around the wheels
      const wheelArchCladding = isBoxy && ay < 0.05 && absAx > 0.38 && (Math.abs(az - 0.7) < 0.3 || Math.abs(az + 0.7) < 0.3);
      if (ay < -0.36 || wheelArchCladding) {
        claddingIndices.push(idx0, idx1, idx2);
        continue;
      }

      // 3. Cabin Windows / Glass
      if (ay > 0.05 && ay < 0.33 && az > -0.76 && az < 0.45) {
        const isWindshield = az > 0.25 && ay > 0.08 && ay < 0.28;
        const isRearShield = az < -0.65 && ay > 0.08 && ay < 0.28;
        const isSideWindow = absAx > 0.33;

        if (isWindshield || isRearShield || isSideWindow) {
          glassIndices.push(idx0, idx1, idx2);
          continue;
        }
      }

      // 4. Headlights & DRLs
      if (az > 0.88 && ay > -0.2 && ay < 0.15 && absAx < 0.42) {
        if (modelId === "mahindra-xuv-3xo") {
          // Massive C-shaped DRL dropping down the sides
          if ((absAx > 0.28 && absAx < 0.35 && ay > -0.15 && ay < 0.1) ||
              (absAx > 0.22 && absAx < 0.35 && ay > 0.05 && ay < 0.1)) {
            headlightIndices.push(idx0, idx1, idx2);
            continue;
          }
        } else if (modelId === "kia-seltos") {
          // Star-map DRLs extending deep into the grille
          if (ay > 0.08 && ay < 0.12 && absAx > 0.1) {
            headlightIndices.push(idx0, idx1, idx2);
            continue;
          }
          // Main ice-cube lamp
          if (ay > -0.1 && ay < 0.0 && absAx > 0.28 && absAx < 0.38) {
            headlightIndices.push(idx0, idx1, idx2);
            continue;
          }
        } else if (modelId === "maruti-grand-vitara" || modelId === "toyota-hyryder") {
          // 3-dot DRLs high up
          if (ay > 0.08 && ay < 0.12 && absAx > 0.22) {
            const isDot = Math.floor(absAx * 50) % 3 !== 0;
            if (isDot) headlightIndices.push(idx0, idx1, idx2);
            else chromeIndices.push(idx0, idx1, idx2);
            continue;
          }
          // Main headlight box lower down
          if (ay > -0.15 && ay < -0.05 && absAx > 0.3) {
            headlightIndices.push(idx0, idx1, idx2);
            continue;
          }
        } else if (modelId === "tata-curvv") {
          // Connected DRL across entire hood
          if (ay > 0.08 && ay < 0.11) {
            headlightIndices.push(idx0, idx1, idx2);
            continue;
          }
          // Triangular main cluster
          if (ay > -0.1 && ay < 0.0 && absAx > 0.3) {
            headlightIndices.push(idx0, idx1, idx2);
            continue;
          }
        } else if (hasSplitHeadlamp) {
          // Top thin DRL
          if (ay > 0.08 && ay < 0.12 && absAx > 0.25) {
            headlightIndices.push(idx0, idx1, idx2);
            continue;
          }
          // Lower main beam box
          if (ay > -0.15 && ay < -0.02 && absAx > 0.28) {
            headlightIndices.push(idx0, idx1, idx2);
            continue;
          }
        } else if (hasConnectedDrl && ay > 0.08 && ay < 0.12) {
          headlightIndices.push(idx0, idx1, idx2);
          continue;
        } else {
          // Standard unified headlight block
          if (ay > -0.1 && ay < 0.12 && absAx > 0.22) {
            headlightIndices.push(idx0, idx1, idx2);
            continue;
          }
        }
      }

      // 5. Taillights
      if (az < -0.92 && ay > -0.05 && ay < 0.15) {
        if (modelId === "tata-curvv" || modelId === "vw-taigun" || modelId === "kia-seltos" || hasConnectedDrl) {
          // Connected LED light bar across the entire rear
          if (ay > 0.06 && ay < 0.12) {
            taillightIndices.push(idx0, idx1, idx2);
            continue;
          }
        }
        if (absAx > 0.16) {
          taillightIndices.push(idx0, idx1, idx2);
          continue;
        }
      }

      // 6. Grille / Front intake
      if (az > 0.90 && ay < 0.08 && absAx < 0.35) {
        
        if (modelId === "maruti-grand-vitara" || modelId === "toyota-hyryder") {
           // Thick chrome bar connecting DRLs
           if (ay > 0.02 && ay < 0.08) {
             chromeIndices.push(idx0, idx1, idx2);
             continue;
           }
           // Large dark honeycomb grille below
           if (ay < 0.02 && ay > -0.25 && absAx < 0.3) {
             const comb = (Math.floor(ax * 40) + Math.floor(ay * 40)) % 2 === 0;
             if (comb) claddingIndices.push(idx0, idx1, idx2);
             else paintIndices.push(idx0, idx1, idx2);
             continue;
           }
        } else if (modelId === "vw-taigun" || modelId === "skoda-kushaq") {
           // Thin horizontal grille
           if (ay > 0.0 && ay < 0.08 && absAx < 0.25) {
             if (modelId === "skoda-kushaq") {
                // Vertical butterfly slats
                const stripe = Math.floor(ax * 35) % 2 === 0;
                if (stripe) chromeIndices.push(idx0, idx1, idx2);
                else claddingIndices.push(idx0, idx1, idx2);
             } else {
                // Taigun horizontal chrome slats
                const stripe = Math.floor(ay * 40) % 2 === 0;
                if (stripe) chromeIndices.push(idx0, idx1, idx2);
                else claddingIndices.push(idx0, idx1, idx2);
             }
             continue;
           }
        }

        // Standard Grille Cutout
        let isGrilleArea = ay < 0.0 && ay > -0.25 && absAx < 0.3;
        if (hasTigerNose) {
          const pinch = absAx < 0.15 && (ay > -0.05 || ay < -0.2);
          isGrilleArea = ay < 0.0 && ay > -0.25 && absAx < 0.35 && !pinch;
        }

        if (isGrilleArea) {
          if (isEV) {
            paintIndices.push(idx0, idx1, idx2); // EV blanked grille
          } else if (hasVerticalSlats) {
            const stripe = Math.floor(ax * 32) % 2 === 0;
            if (stripe) chromeIndices.push(idx0, idx1, idx2);
            else claddingIndices.push(idx0, idx1, idx2);
          } else if (hasParametric) {
            const grid = (Math.floor(ax * 40) + Math.floor(ay * 40)) % 2 === 0;
            if (grid) claddingIndices.push(idx0, idx1, idx2);
            else chromeIndices.push(idx0, idx1, idx2);
          } else if (hasTigerNose) {
            const pattern = (Math.floor(ax * 30) + Math.floor(ay * 20)) % 2 === 0;
            if (pattern) claddingIndices.push(idx0, idx1, idx2);
            else chromeIndices.push(idx0, idx1, idx2);
          } else {
            const stripe = Math.floor(ay * 24) % 2 === 0;
            if (stripe) chromeIndices.push(idx0, idx1, idx2);
            else claddingIndices.push(idx0, idx1, idx2);
          }
        } else {
          paintIndices.push(idx0, idx1, idx2);
        }
        continue;
      }

      // 7. Roof Rails
      if (ay > 0.33 && absAx > 0.3 && az > -0.7 && az < 0.4) {
        if (hasRoofRails) {
          chromeIndices.push(idx0, idx1, idx2); // Silver roof rails look premium
        } else {
          paintIndices.push(idx0, idx1, idx2); // Blend into roof
        }
        continue;
      }

      // 8. Chrome details: Bottom side door sill strip
      if (ay > -0.32 && ay < -0.25 && absAx > 0.42 && az > -0.65 && az < 0.65) {
        if (!isEV && !isBoxy) {
          chromeIndices.push(idx0, idx1, idx2);
          continue;
        }
      }

      // 9. Chrome details: C-pillar silver lightning strip (Creta signature)
      if (isCreta && ay > 0.15 && ay < 0.33 && absAx > 0.32 && az > -0.75 && az < -0.2) {
        chromeIndices.push(idx0, idx1, idx2);
        continue;
      }

      // 10. Chrome details: Front/Rear bottom skid plates (SUV ruggedness)
      if (az > 0.90 && ay > -0.38 && ay < -0.28 && absAx < 0.25) {
        chromeIndices.push(idx0, idx1, idx2);
        continue;
      }
      if (az < -0.92 && ay > -0.38 && ay < -0.26 && absAx < 0.25) {
        chromeIndices.push(idx0, idx1, idx2);
        continue;
      }

      // 11. Two-tone Floating Roof
      if (hasFloatingRoof && ay > 0.31 && absAx < 0.35 && az > -0.75 && az < 0.45) {
        // Blacked out roof
        claddingIndices.push(idx0, idx1, idx2);
        continue;
      }

      // 12. A-Pillar / B-Pillar blackouts
      if (hasFloatingRoof && ay > 0.1 && ay < 0.33 && absAx > 0.33 && az > -0.3 && az < 0.3) {
        claddingIndices.push(idx0, idx1, idx2); // Black B-Pillar
        continue;
      }

      // Default: Car Body Paint
      paintIndices.push(idx0, idx1, idx2);
    }

    const newIndices = new Uint32Array(
      paintIndices.length +
      glassIndices.length +
      chromeIndices.length +
      claddingIndices.length +
      headlightIndices.length +
      taillightIndices.length
    );

    let offset = 0;
    geometry.clearGroups();

    if (paintIndices.length > 0) {
      newIndices.set(paintIndices, offset);
      geometry.addGroup(offset, paintIndices.length, 0);
      offset += paintIndices.length;
    }
    if (glassIndices.length > 0) {
      newIndices.set(glassIndices, offset);
      geometry.addGroup(offset, glassIndices.length, 1);
      offset += glassIndices.length;
    }
    if (chromeIndices.length > 0) {
      newIndices.set(chromeIndices, offset);
      geometry.addGroup(offset, chromeIndices.length, 2);
      offset += chromeIndices.length;
    }
    if (claddingIndices.length > 0) {
      newIndices.set(claddingIndices, offset);
      geometry.addGroup(offset, claddingIndices.length, 3);
      offset += claddingIndices.length;
    }
    if (headlightIndices.length > 0) {
      newIndices.set(headlightIndices, offset);
      geometry.addGroup(offset, headlightIndices.length, 4);
      offset += headlightIndices.length;
    }
    if (taillightIndices.length > 0) {
      newIndices.set(taillightIndices, offset);
      geometry.addGroup(offset, taillightIndices.length, 5);
      offset += taillightIndices.length;
    }

    geometry.setIndex(new THREE.BufferAttribute(newIndices, 1));

    mesh.material = [
      paintMaterial,
      glassMaterial,
      chromeMaterial,
      claddingMaterial,
      headlightMaterial,
      taillightMaterial,
    ];
  });
}

function fitGlbScene(scene: THREE.Object3D, wheelbaseMm: number, color: string, modelId?: string, dna?: VehicleDNA) {
  const root = scene.clone(true);

  // Look up model metadata from data system
  const modelData = modelId ? getModel(modelId) : null;
  const lengthMm = modelData?.dimensions.lengthMm ?? (wheelbaseMm + 1650);
  const widthMm = modelData?.dimensions.widthMm ?? 1790;
  const heightMm = modelData?.dimensions.heightMm ?? 1635;

  const targetLength = lengthMm / 1000;
  const targetWidth = widthMm / 1000;
  const targetHeight = heightMm / 1000;

  // Measure BEFORE rotation to get true local size
  root.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());

  // Local X = Width, Local Y = Height, Local Z = Length
  const scaleLocalX = targetWidth / Math.max(size.x, 0.001);
  const scaleLocalY = targetHeight / Math.max(size.y, 0.001);
  const scaleLocalZ = targetLength / Math.max(size.z, 0.001);
  root.scale.set(scaleLocalX, scaleLocalY, scaleLocalZ);

  // Model length is on +Z → rotate to +X (forward in all sim scenes)
  root.rotation.set(0, Math.PI / 2, 0);

  root.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  root.position.set(-center.x, -box.min.y, -center.z);

  applySimColor(root, color, modelId, dna);

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  return root;
}

function ContactShadow({ length, width }: { length: number; width: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(length, width, 2, 2);
    // Set RGBA vertex colors: center is darker black shadow, corners are fully transparent
    const colors = new Float32Array([
      // R, G, B, Alpha
      0, 0, 0, 0.0,   0, 0, 0, 0.38,  0, 0, 0, 0.0,   // front row (corners + soft center)
      0, 0, 0, 0.38,  0, 0, 0, 0.62,  0, 0, 0, 0.38,  // middle row (sides + dark center)
      0, 0, 0, 0.0,   0, 0, 0, 0.38,  0, 0, 0, 0.0,   // rear row (corners + soft center)
    ]);
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 4));
    return geo;
  }, [length, width]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
      <meshBasicMaterial
        vertexColors
        blending={THREE.NormalBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function GlbCar({
  glbUrl,
  color,
  wheelbaseMm = 2610,
  motionRef,
  modelId,
  dna,
}: {
  glbUrl: string;
  color: string;
  wheelbaseMm?: number;
  bootLitres?: number;
  motionRef?: React.MutableRefObject<CarMotionRef>;
  modelId?: string;
  dna?: VehicleDNA;
}) {
  const { scene } = useGLTF(glbUrl);
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const steeringPivots = useRef<(THREE.Group | null)[]>([]);

  const model = useMemo(
    () => fitGlbScene(scene, wheelbaseMm, color, modelId, dna),
    [scene, wheelbaseMm, color, modelId, dna]
  );

  const wheelR = getWheelRadius(dna?.wheelInches ?? 17);

  const axleFront = wheelbaseMm / 2000;
  const axleRear = -wheelbaseMm / 2000;
  
  const modelData = useMemo(() => (modelId ? getModel(modelId) : null), [modelId]);
  const widthMm = modelData?.dimensions.widthMm ?? 1790;
  const lengthMm = modelData?.dimensions.lengthMm ?? 4300;
  const heightMm = modelData?.dimensions.heightMm ?? 1635;
  const trackZ = widthMm / 2000 - 0.12;

  const wheelPositions: [number, number][] = [
    [axleFront, trackZ],
    [axleFront, -trackZ],
    [axleRear, trackZ],
    [axleRear, -trackZ],
  ];

  const tireMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#050505", roughness: 0.95, metalness: 0.0 }), []);
  const sidewallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#080808", roughness: 0.85, metalness: 0.0 }), []);
  const rimMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#dbe2e9", metalness: 1.0, roughness: 0.15, clearcoat: 1.0, clearcoatRoughness: 0.1, envMapIntensity: 2.0 }), []);
  const brakeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#181a1f", metalness: 0.5, roughness: 0.6 }), []);

  useFrame((_, delta) => {
    if (group.current && motionRef) {
      group.current.rotation.z = motionRef.current.pitch;
      group.current.rotation.x = motionRef.current.roll ?? 0;
      for (const w of wheels.current) {
        if (w) w.rotation.y -= motionRef.current.wheelSpeed * delta;
      }
      
      const steerAngle = motionRef.current.steerAngle ?? 0;
      if (steeringPivots.current[0]) steeringPivots.current[0].rotation.y = steerAngle;
      if (steeringPivots.current[1]) steeringPivots.current[1].rotation.y = steerAngle;
    }
  });

  return (
    <group ref={group}>
      {/* Dynamic contact shadow under the chassis */}
      <ContactShadow length={(lengthMm / 1000) * 1.05} width={(widthMm / 1000) * 1.15} />

      <primitive object={model} />
      
      {/* 4 dynamic active alloy wheels */}
      {wheelPositions.map(([wx, wz], idx) => {
        const isFront = idx < 2;
        const wheelContent = (
          <group
            rotation={[Math.PI / 2, 0, 0]}
            ref={(el) => { if (el) wheels.current[idx] = el; }}
          >
            {/* Tire Cylinder */}
            <mesh material={tireMat} castShadow>
              <cylinderGeometry args={[wheelR, wheelR, 0.26, 28]} />
            </mesh>
            {/* Slight sidewall shoulder so wheels read as rubber, not black discs. */}
            <mesh material={sidewallMat} position={[0, wz > 0 ? 0.134 : -0.134, 0]}>
              <cylinderGeometry args={[wheelR * 0.94, wheelR * 0.94, 0.018, 28]} />
            </mesh>
            <mesh material={brakeMat} position={[0, wz > 0 ? 0.142 : -0.142, 0]}>
              <cylinderGeometry args={[wheelR * 0.42, wheelR * 0.42, 0.014, 20]} />
            </mesh>
            {/* Rim cap */}
            <mesh material={rimMat} position={[0, wz > 0 ? 0.153 : -0.153, 0]}>
              <cylinderGeometry args={[wheelR * 0.56, wheelR * 0.56, 0.018, 20]} />
            </mesh>
            {/* Alloy Spokes */}
            {Array.from({ length: dna?.wheelInches && dna.wheelInches >= 18 ? 6 : 5 }).map((_, sIdx, all) => {
              const angle = (sIdx * 2 * Math.PI) / all.length;
              return (
                <mesh
                  key={sIdx}
                  material={rimMat}
                  position={[0, wz > 0 ? 0.162 : -0.162, 0]}
                  rotation={[0, 0, angle]}
                >
                  <boxGeometry args={[wheelR * 0.64, 0.032, 0.016]} />
                </mesh>
              );
            })}
          </group>
        );

        if (isFront) {
          return (
            <group
              key={idx}
              position={[wx, wheelR, wz]}
              ref={(el) => { if (el) steeringPivots.current[idx] = el; }}
            >
              {wheelContent}
            </group>
          );
        } else {
          return (
            <group
              key={idx}
              position={[wx, wheelR, wz]}
            >
              {wheelContent}
            </group>
          );
        }
      })}
    </group>
  );
}

useGLTF.preload("/models/hyundai-creta.glb");
