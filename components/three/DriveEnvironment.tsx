"use client";

import type { DriveEnvironment as VehicleEnvironment } from "@/lib/vehicle-dna/types";
import type { TerrainType } from "@/lib/drive";

function SharedLab() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[365, -0.02, 0]} receiveShadow>
        <planeGeometry args={[880, 100]} />
        <meshStandardMaterial color="#09060D" roughness={0.92} metalness={0.08} />
      </mesh>

      {Array.from({ length: 9 }).map((_, i) => {
        const x = i * 88 + 28;
        return (
          <group key={`frame-${i}`} position={[x, 0, 0]}>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[0, 3.8, side * 11]}>
                <boxGeometry args={[0.14, 7.5, 0.14]} />
                <meshStandardMaterial color="#171C2C" metalness={0.55} roughness={0.45} />
              </mesh>
            ))}
            <mesh position={[0, 7.2, 0]}>
              <boxGeometry args={[0.2, 0.16, 23]} />
              <meshStandardMaterial color="#C84C31" emissive="#C84C31" emissiveIntensity={1.6} toneMapped={false} />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`panel-${i}`} position={[i * 68 + 36, 2.6 + (i % 2) * 0.5, -17]}>
          <boxGeometry args={[11, 4.6 + (i % 3) * 1.3, 0.45]} />
          <meshStandardMaterial color="#0E1324" emissive="#09111C" emissiveIntensity={0.3} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function HighwayKit() {
  return (
    <group>
      {Array.from({ length: 10 }).map((_, i) => (
        <group key={`highway-${i}`} position={[i * 85 + 42, 0, 0]}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[0, 2.4, side * 13.5]}>
              <boxGeometry args={[0.16, 4.6, 0.16]} />
              <meshStandardMaterial color="#C84C31" emissive="#C84C31" emissiveIntensity={0.9} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0, 4.4, 0]}>
            <boxGeometry args={[0.12, 0.1, 28]} />
            <meshStandardMaterial color="#4F6B8A" emissive="#4F6B8A" emissiveIntensity={0.45} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`shield-${i}`} position={[150 + i * 120, 1.8, 16]}>
          <boxGeometry args={[6.5, 2.4, 0.2]} />
          <meshStandardMaterial color="#14192B" roughness={0.5} metalness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function UrbanKit() {
  return (
    <group>
      {Array.from({ length: 7 }).map((_, i) => (
        <group key={`urban-${i}`} position={[i * 108 + 54, 0, 0]}>
          <mesh position={[0, 4 + (i % 3), -18]}>
            <boxGeometry args={[15, 8 + (i % 4) * 2, 9]} />
            <meshStandardMaterial color="#161C2A" roughness={0.82} metalness={0.12} />
          </mesh>
          <mesh position={[0, 4.4, 18]}>
            <boxGeometry args={[13, 9 + (i % 2) * 3, 8]} />
            <meshStandardMaterial color="#111827" roughness={0.88} metalness={0.08} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={`bollard-${i}`} position={[70 + i * 42, 0.6, i % 2 === 0 ? 8.2 : -8.2]}>
          <cylinderGeometry args={[0.18, 0.18, 1.2, 8]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#C84C31" : "#4F6B8A"} emissive={i % 3 === 0 ? "#C84C31" : "#4F6B8A"} emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function OffroadKit() {
  return (
    <group>
      {Array.from({ length: 7 }).map((_, i) => (
        <group key={`ridge-${i}`} position={[70 + i * 96, -0.1, i % 2 === 0 ? 15.5 : -15.5]}>
          <mesh position={[0, 2.6 + (i % 3) * 0.4, 0]} rotation={[0, 0, 0.12 * (i % 2 === 0 ? 1 : -1)]}>
            <coneGeometry args={[7 + (i % 2) * 2, 8 + (i % 3) * 1.5, 5]} />
            <meshStandardMaterial color="#5C4B3D" roughness={1} />
          </mesh>
          <mesh position={[0.5, 4.9, 0.4]}>
            <coneGeometry args={[1.3, 4.8, 6]} />
            <meshStandardMaterial color="#2F4A2B" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 16 }).map((_, i) => {
        const x = i * 46 + 35;
        const z = (i % 2 === 0 ? 1 : -1) * (10 + (i % 3) * 1.4);
        return (
          <group key={`rock-${i}`} position={[x, 0, z]}>
            <mesh position={[0, 0.8, 0]}>
              <dodecahedronGeometry args={[1.2 + (i % 3) * 0.25, 0]} />
              <meshStandardMaterial color="#302A38" roughness={1} />
            </mesh>
            <mesh position={[0.4, 1.8, 0.2]}>
              <coneGeometry args={[0.5, 3.5, 6]} />
              <meshStandardMaterial color="#133125" roughness={0.95} />
            </mesh>
          </group>
        );
      })}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`beacon-${i}`} position={[110 + i * 92, 1.2, i % 2 === 0 ? 13 : -13]}>
          <cylinderGeometry args={[0.26, 0.26, 2.4, 10]} />
          <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.55} toneMapped={false} />
        </mesh>
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`mud-bank-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[82 + i * 82, 0.015, i % 2 === 0 ? -4.5 : 4.5]}>
          <planeGeometry args={[20, 2.8]} />
          <meshStandardMaterial color="#72563F" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function SpeedBumpKit() {
  return (
    <group>
      {Array.from({ length: 4 }).map((_, i) => {
        const x = 210 + i * 82;
        return (
          <group key={`speedlane-${i}`} position={[x, 0, 0]}>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[0, 0.72, side * 7.2]}>
                <boxGeometry args={[0.14, 1.4, 0.14]} />
                <meshStandardMaterial color="#C84C31" emissive="#C84C31" emissiveIntensity={0.3} toneMapped={false} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function CityKit() {
  return (
    <group>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`city-${i}`} position={[55 + i * 64, 1.5, i % 2 === 0 ? -12 : 12]}>
          <boxGeometry args={[5, 3, 3]} />
          <meshStandardMaterial color="#1A2130" roughness={0.76} metalness={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function NightKit() {
  return (
    <group>
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={`night-${i}`} position={[35 + i * 42, 2.5 + (i % 4), i % 2 === 0 ? -15 : 15]}>
          <boxGeometry args={[0.16, 5.2 + (i % 4) * 1.6, 0.16]} />
          <meshStandardMaterial color="#C84C31" emissive="#C84C31" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function DriveEnvironment({
  environment,
  terrain,
}: {
  environment: VehicleEnvironment;
  terrain: TerrainType;
}) {
  const showUrban = terrain === "city" || environment === "urban-family";
  const showOffroad = terrain === "offroad" || environment === "mountain-trail";
  const showBumps = terrain === "speedbump";
  const showCity = environment === "city";
  const showNight = environment === "futuristic-night";

  return (
    <group>
      <SharedLab />
      <HighwayKit />
      {showUrban && <UrbanKit />}
      {showOffroad && <OffroadKit />}
      {showBumps && <SpeedBumpKit />}
      {showCity && <CityKit />}
      {showNight && <NightKit />}
      {!showUrban && !showOffroad && !showCity && environment === "expressway" && <NightKit />}
    </group>
  );
}
