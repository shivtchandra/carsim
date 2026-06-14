"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AlertTriangle, Gauge, Lock, ShieldCheck, Sparkles } from "lucide-react";
import {
  formatLakh,
  getBrand,
  getDriveCoverage,
  getModel,
  getTestData,
  getVariant,
  variants,
} from "@/lib/data";
import type { DriveCoverage, DriveSectorId } from "@/lib/types";
import {
  brakingScore,
  buildDriveTrial,
  controlScore,
  firedEvents,
  initialDriveState,
  launchScore,
  makeDriveSpec,
  overallGrade,
  sectorForDistance,
  sectorIsCertified,
  stepDrive,
  TERRAIN_LABELS,
  trialEvents,
  type DriveSector,
  type DriveState,
  type TerrainType,
} from "@/lib/drive";
import { getVehicleDNA, ENV_FOG } from "@/lib/vehicle-dna";
import VariantSelect from "@/components/sims/VariantSelect";
import EstimatedBadge from "@/components/EstimatedBadge";
import Stage from "./Stage";
import StylizedCar, { type CarMotionRef } from "./StylizedCar";
import DriveEnvironment from "./DriveEnvironment";
import { FinishGate, Road } from "./sims/Road";

const WHEEL_R_SUV = 0.38;
const WHEEL_R_SEDAN = 0.33;

const TRAFFIC_CARS = [
  { id: "t1", x: 160, z: -1.4, color: "#4F6B8A", label: "Slow Hatchback" },
  { id: "t2", x: 320, z: 1.4, color: "#d97706", label: "Delivery Van" },
  { id: "t3", x: 480, z: -1.4, color: "#2d6a4f", label: "City Sedan" },
];

const TERRAIN_OPTIONS: Array<{ id: TerrainType; label: string; note: string }> = [
  {
    id: "highway",
    label: TERRAIN_LABELS.highway,
    note: "Clean proving ground with the easiest control window.",
  },
  {
    id: "city",
    label: TERRAIN_LABELS.city,
    note: "Urban corridor with tighter pace discipline.",
  },
  {
    id: "speedbump",
    label: TERRAIN_LABELS.speedbump,
    note: "Speed-breaker strip that exposes floaty setups.",
  },
  {
    id: "offroad",
    label: TERRAIN_LABELS.offroad,
    note: "Rough rig where composure matters more than speed.",
  },
];

const SECTOR_ACCENTS: Record<DriveSectorId, string> = {
  launch: "#C84C31",
  control: "#4F6B8A",
  brake: "#d97706",
};

interface HudState {
  speed: string;
  distance: string;
  timer: string;
}

interface TrialTelemetry {
  finalState: DriveState;
  obstacleAt: number;
  impactKmh: number;
  stoppedBeforeObstacle: boolean;
  controlInBandRatio: number;
  suspensionPeakM: number;
  brakePanicCount: number;
}

function SectorMarkers({ sector }: { sector: DriveSector }) {
  if (sector.id === "control") {
    return (
      <group>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={i}
            position={[sector.startM + 30 + i * 24, 0.45, i % 2 === 0 ? 3.6 : -3.6]}
            castShadow
          >
            <coneGeometry args={[0.32, 0.9, 10]} />
            <meshStandardMaterial
              color="#4F6B8A"
              emissive="#4F6B8A"
              emissiveIntensity={0.65}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    );
  }

  if (sector.id === "brake" && sector.obstacleAtM && sector.brakeMarkerAtM) {
    return (
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[sector.brakeMarkerAtM, 0.018, 0]}>
          <planeGeometry args={[2.4, 10.5]} />
          <meshStandardMaterial color="#8F3A28" emissive="#C84C31" emissiveIntensity={0.45} transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[sector.obstacleAtM - 6, 0.016, 0]}>
          <planeGeometry args={[1.2, 10.5]} />
          <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.2} />
        </mesh>
      </group>
    );
  }

  return null;
}

function DriveScene({
  color,
  wheelbaseMm,
  bootLitres,
  bodyStyle,
  dna,
  spec,
  terrain,
  coverage,
  inputsRef,
  runningRef,
  onBanner,
  onHudChange,
  onSectorChange,
  onFinish,
}: {
  color: string;
  wheelbaseMm: number;
  bootLitres: number;
  bodyStyle: "suv" | "sedan";
  dna: ReturnType<typeof getVehicleDNA>;
  spec: ReturnType<typeof makeDriveSpec>;
  terrain: TerrainType;
  coverage: DriveCoverage;
  inputsRef: React.MutableRefObject<{ throttle: number; brake: number; steerLeft: number; steerRight: number }>;
  runningRef: React.MutableRefObject<boolean>;
  onBanner: (msg: string) => void;
  onHudChange: (hud: HudState) => void;
  onSectorChange: (sector: DriveSector) => void;
  onFinish: (telemetry: TrialTelemetry) => void;
}) {
  const scenario = useMemo(() => buildDriveTrial(terrain), [terrain]);
  const events = useMemo(() => trialEvents(scenario), [scenario]);
  const stateRef = useRef<DriveState>({ ...initialDriveState });
  const firedRef = useRef(new Set<string>());
  const doneRef = useRef(false);
  const obstacleRef = useRef<THREE.Mesh>(null);
  const ego = useRef<THREE.Group>(null);
  const motion = useRef<CarMotionRef>({ wheelSpeed: 0, pitch: 0 });
  const activeSectorRef = useRef<DriveSector>(scenario.sectors[0]);
  const obstacleAt = useRef<number | null>(null);
  const hudRef = useRef<HudState>({ speed: "0", distance: "0 m", timer: "t 0.0s" });
  const metricsRef = useRef({
    controlTimeS: 0,
    inBandTimeS: 0,
    suspensionPeakM: 0,
    brakePanicCount: 0,
    lastBrakePressed: false,
  });
  
  const targetZRef = useRef(0);
  const currentZRef = useRef(0);

  // Audio Context synthesis refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const engineOscRef = useRef<OscillatorNode | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);
  const brakeOscRef = useRef<OscillatorNode | null>(null);
  const brakeGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    let ctx: AudioContext | null = null;
    try {
      ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(40, ctx.currentTime);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(80, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      engineOscRef.current = osc;
      engineGainRef.current = gain;

      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      const bFilter = ctx.createBiquadFilter();

      bOsc.type = "sine";
      bOsc.frequency.setValueAtTime(2200, ctx.currentTime);
      bGain.gain.setValueAtTime(0, ctx.currentTime);

      bFilter.type = "highpass";
      bFilter.frequency.setValueAtTime(1800, ctx.currentTime);

      bOsc.connect(bFilter);
      bFilter.connect(bGain);
      bGain.connect(ctx.destination);
      bOsc.start();

      brakeOscRef.current = bOsc;
      brakeGainRef.current = bGain;
    } catch (e) {
      console.warn("Audio Context creation failed", e);
    }

    return () => {
      if (ctx && ctx.state !== "closed") {
        ctx.close();
      }
      audioCtxRef.current = null;
      engineOscRef.current = null;
      engineGainRef.current = null;
      brakeOscRef.current = null;
      brakeGainRef.current = null;
    };
  }, []);
  const wheelR = dna.wheelInches >= 18 ? WHEEL_R_SUV : bodyStyle === "sedan" ? WHEEL_R_SEDAN : WHEEL_R_SUV;

  useEffect(() => {
    activeSectorRef.current = scenario.sectors[0];
    onSectorChange(scenario.sectors[0]);
    if (coverage.certification === "preview") {
      onBanner("Preview mode: this run is atmospheric and instructive, but not real-stat certified.");
    } else if (coverage.certification === "partial") {
      onBanner("Partial measurement: only launch telemetry is certified on supported cars.");
    } else {
      onBanner("Measured trial armed. Launch and braking both use instrumented figures.");
    }
  }, [coverage.certification, onBanner, onSectorChange, scenario]);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    let s = stateRef.current;

    // 1. Steering target calculation (lane swerving)
    if (runningRef.current && !doneRef.current) {
      const isSteerLeft = inputsRef.current.steerLeft > 0.5;
      const isSteerRight = inputsRef.current.steerRight > 0.5;
      if (isSteerLeft) {
        targetZRef.current = Math.max(-1.8, targetZRef.current - 4.5 * dt);
      } else if (isSteerRight) {
        targetZRef.current = Math.min(1.8, targetZRef.current + 4.5 * dt);
      }
    }

    // Smooth Z lateral positioning
    const prevZ = currentZRef.current;
    currentZRef.current += (targetZRef.current - currentZRef.current) * 8 * dt;
    const deltaZ = currentZRef.current - prevZ;

    // Body yaw and roll roll lean based on lateral Gs
    const lateralSpeed = deltaZ / dt;
    const yaw = lateralSpeed * 0.08;
    const roll = -lateralSpeed * 0.05;

    if (runningRef.current && !doneRef.current) {
      const sectorBefore = sectorForDistance(s.distanceM, scenario);
      s = stepDrive(s, inputsRef.current, spec, dt, sectorBefore.terrain);
      stateRef.current = s;
      const sector = sectorForDistance(s.distanceM, scenario);

      if (sector.id !== activeSectorRef.current.id) {
        activeSectorRef.current = sector;
        onSectorChange(sector);
      }

      if (sector.id === "control" && sector.targetBandKmh) {
        metricsRef.current.controlTimeS += dt;
        if (s.speedKmh >= sector.targetBandKmh[0] && s.speedKmh <= sector.targetBandKmh[1]) {
          metricsRef.current.inBandTimeS += dt;
        }
        metricsRef.current.suspensionPeakM = Math.max(
          metricsRef.current.suspensionPeakM,
          Math.abs(s.suspensionOffsetM)
        );

        const hardBrake = inputsRef.current.brake > 0.85 && s.speedKmh > 24;
        if (hardBrake && !metricsRef.current.lastBrakePressed) {
          metricsRef.current.brakePanicCount += 1;
        }
        metricsRef.current.lastBrakePressed = hardBrake;
      }

      for (const event of firedEvents(s, events, firedRef.current)) {
        firedRef.current.add(event.id);
        if (event.type === "prompt" && event.message) onBanner(event.message);
        if (event.type === "obstacle" && event.obstacleAtM) {
          obstacleAt.current = event.obstacleAtM;
        }
      }

      // Check collision with traffic cars in city mode
      if (terrain === "city") {
        for (const car of TRAFFIC_CARS) {
          const distanceX = Math.abs(s.distanceM - car.x);
          const distanceZ = Math.abs(currentZRef.current - car.z);
          if (distanceX < 4.4 && distanceZ < 1.4) {
            doneRef.current = true;
            onBanner(`CRASH! Collided with ${car.label} at x=${car.x.toFixed(0)}m!`);
            onFinish({
              finalState: s,
              obstacleAt: car.x,
              impactKmh: s.speedKmh,
              stoppedBeforeObstacle: false,
              controlInBandRatio: metricsRef.current.controlTimeS
                ? metricsRef.current.inBandTimeS / metricsRef.current.controlTimeS
                : 0,
              suspensionPeakM: metricsRef.current.suspensionPeakM,
              brakePanicCount: metricsRef.current.brakePanicCount,
            });
            break;
          }
        }
      }

      if (obstacleAt.current !== null) {
        if (s.distanceM >= obstacleAt.current && s.speedKmh > 0.5) {
          doneRef.current = true;
          onFinish({
            finalState: s,
            obstacleAt: obstacleAt.current,
            impactKmh: s.speedKmh,
            stoppedBeforeObstacle: false,
            controlInBandRatio: metricsRef.current.controlTimeS
              ? metricsRef.current.inBandTimeS / metricsRef.current.controlTimeS
              : 0,
            suspensionPeakM: metricsRef.current.suspensionPeakM,
            brakePanicCount: metricsRef.current.brakePanicCount,
          });
        } else if (s.speedKmh <= 0.15 && s.distanceM > 560) {
          doneRef.current = true;
          onFinish({
            finalState: s,
            obstacleAt: obstacleAt.current,
            impactKmh: 0,
            stoppedBeforeObstacle: true,
            controlInBandRatio: metricsRef.current.controlTimeS
              ? metricsRef.current.inBandTimeS / metricsRef.current.controlTimeS
              : 0,
            suspensionPeakM: metricsRef.current.suspensionPeakM,
            brakePanicCount: metricsRef.current.brakePanicCount,
          });
        }
      } else if (s.distanceM >= scenario.finishAtM) {
        doneRef.current = true;
        onFinish({
          finalState: s,
          obstacleAt: scenario.finishAtM,
          impactKmh: 0,
          stoppedBeforeObstacle: true,
          controlInBandRatio: metricsRef.current.controlTimeS
            ? metricsRef.current.inBandTimeS / metricsRef.current.controlTimeS
            : 0,
          suspensionPeakM: metricsRef.current.suspensionPeakM,
          brakePanicCount: metricsRef.current.brakePanicCount,
        });
      }
    }

    motion.current.wheelSpeed = (s.speedKmh * (1000 / 3600)) / wheelR;
    const longitudinalPitch =
      inputsRef.current.brake > 0.2 && s.speedKmh > 2
        ? 0.03
        : inputsRef.current.throttle > 0.5 && s.speedKmh < 60
          ? -0.02
          : 0;
    motion.current.pitch = longitudinalPitch + s.suspensionVelMs * 0.025;

    if (ego.current) {
      ego.current.position.x = s.distanceM;
      ego.current.position.y = s.suspensionOffsetM;
      ego.current.position.z = currentZRef.current;
      ego.current.rotation.x = roll;
      ego.current.rotation.y = yaw;
    }
    if (obstacleRef.current) {
      obstacleRef.current.visible = obstacleAt.current !== null;
      if (obstacleAt.current !== null) obstacleRef.current.position.x = obstacleAt.current;
    }

    const cameraHeight = terrain === "offroad" ? 3.5 : 3;
    const cameraZ = terrain === "city" ? 5.8 : 6.5;

    // G-force acceleration camera lag offsets
    const accelLag = inputsRef.current.throttle * Math.max(0, 1 - s.speedKmh / 80) * 0.5;
    const brakeLag = -inputsRef.current.brake * 0.6;
    const fovShift = accelLag * 8;

    // Suspension shake & vibration offsets (feel the road surface!)
    const shakeX = Math.sin(s.timeS * 110) * Math.abs(s.suspensionVelMs) * 0.01;
    const shakeY = Math.sin(s.timeS * 80) * Math.abs(s.suspensionOffsetM) * 0.12;

    camera.position.set(
      s.distanceM - 8.5 - (accelLag + brakeLag) + shakeX,
      cameraHeight + shakeY,
      currentZRef.current + cameraZ
    );
    camera.lookAt(s.distanceM + 7, 0.9, currentZRef.current);
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const pCam = camera as THREE.PerspectiveCamera;
      pCam.fov = 45 + fovShift;
      pCam.updateProjectionMatrix();
    }

    // Synthesiser engine hum + braking squeal
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      
      const speed = Math.max(0.1, s.speedKmh);
      let gear = 1;
      let rpmRatio = speed / 32;
      if (speed > 32 && speed <= 62) {
        gear = 2;
        rpmRatio = (speed - 32) / 30;
      } else if (speed > 62 && speed <= 92) {
        gear = 3;
        rpmRatio = (speed - 62) / 30;
      } else if (speed > 92 && speed <= 135) {
        gear = 4;
        rpmRatio = (speed - 92) / 43;
      } else if (speed > 135) {
        gear = 5;
        rpmRatio = (speed - 135) / 55;
      }
      
      const targetFreq = 38 + rpmRatio * 48 + gear * 5.5;
      const throttleVal = inputsRef.current.throttle;
      const targetGain = runningRef.current && !doneRef.current ? 0.05 + throttleVal * 0.11 : 0;
      
      if (engineOscRef.current && engineGainRef.current) {
        engineOscRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.04);
        engineGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.04);
      }
      
      if (brakeOscRef.current && brakeGainRef.current) {
        const isBraking = inputsRef.current.brake > 0.4 && speed > 8 && runningRef.current && !doneRef.current;
        const squealVol = isBraking ? (inputsRef.current.brake - 0.4) * 0.05 : 0;
        brakeGainRef.current.gain.setTargetAtTime(squealVol, ctx.currentTime, 0.04);
      }
    }

    const nextHud = {
      speed: s.speedKmh.toFixed(0),
      distance: `${s.distanceM.toFixed(0)} m`,
      timer: s.zeroTo100S ? `0–100 ${s.zeroTo100S.toFixed(1)}s` : `t ${s.timeS.toFixed(1)}s`,
    };
    if (
      hudRef.current.speed !== nextHud.speed ||
      hudRef.current.distance !== nextHud.distance ||
      hudRef.current.timer !== nextHud.timer
    ) {
      hudRef.current = nextHud;
      onHudChange(nextHud);
    }
  });

  return (
    <>
      <DriveEnvironment environment={dna.environment} terrain={terrain} />
      <Road x0={-30} x1={840} lanes={2} />
      {scenario.sectors.map((sector) => (
        <group key={sector.id}>
          <FinishGate x={sector.endM} width={8.6} />
          <SectorMarkers sector={sector} />
        </group>
      ))}
      {terrain === "city" && TRAFFIC_CARS.map((car) => (
        <group key={car.id} position={[car.x, 0, car.z]}>
          <StylizedCar
            color={car.color}
            wheelbaseMm={2580}
            bootLitres={380}
            bodyStyle={car.id === "t2" ? "suv" : "sedan"}
            dna={dna}
          />
        </group>
      ))}
      <mesh ref={obstacleRef} position={[700, 0.8, 0]} visible={false} castShadow>
        <boxGeometry args={[0.8, 1.4, 7.6]} />
        <meshStandardMaterial color="#8F3A28" emissive="#C84C31" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      <group ref={ego}>
        <StylizedCar
          color={color}
          wheelbaseMm={wheelbaseMm}
          bootLitres={bootLitres}
          bodyStyle={bodyStyle}
          dna={dna}
          motionRef={motion}
        />
      </group>
    </>
  );
}

function DataChip({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "measured" | "modeled" | "missing";
}) {
  const styles =
    status === "measured"
      ? "border-[rgba(45,106,79,0.24)] bg-[rgba(45,106,79,0.08)] text-[#2d6a4f]"
      : status === "modeled"
        ? "border-[rgba(200,76,49,0.2)] bg-[rgba(200,76,49,0.08)] text-[#C84C31]"
        : "border-[rgba(217,119,6,0.2)] bg-[rgba(217,119,6,0.08)] text-[#d97706]";

  return (
    <div className={`rounded-2xl border px-3 py-3 ${styles}`}>
      <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function SectorBadge({ certified }: { certified: boolean }) {
  return certified ? (
    <span className="rounded-full border border-[rgba(45,106,79,0.24)] bg-[rgba(45,106,79,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#2d6a4f]">
      Measured
    </span>
  ) : (
    <span className="rounded-full border border-[rgba(217,119,6,0.18)] bg-[rgba(217,119,6,0.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#d97706]">
      Preview
    </span>
  );
}

export default function DriveMode({ initialVariant }: { initialVariant?: string }) {
  const [allowPreviewOnly, setAllowPreviewOnly] = useState(true);
  const eligibleIds = useMemo(
    () =>
      variants
        .map((variant) => variant.id)
        .filter((id) => allowPreviewOnly || getDriveCoverage(id).certification !== "preview"),
    [allowPreviewOnly]
  );
  const fallbackId = eligibleIds[0] ?? variants[0]?.id ?? "";
  const [id, setId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("drivescope_selected_variant");
      if (stored) return stored;
    }
    return initialVariant ?? fallbackId;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("drivescope_selected_variant");
      if (stored && stored !== id) {
        setId(stored);
      }
    }
  }, []);

  const selectedId = eligibleIds.includes(id) ? id : fallbackId;
  const [runId, setRunId] = useState(0);
  const [running, setRunning] = useState(false);
  const [terrain, setTerrain] = useState<TerrainType>("highway");
  const [banner, setBanner] = useState<string | null>(null);
  const [sector, setSector] = useState<DriveSector>(() => buildDriveTrial("highway").sectors[0]);
  const [hud, setHud] = useState<HudState>({ speed: "0", distance: "0 m", timer: "t 0.0s" });
  const [result, setResult] = useState<{
    launch: number;
    control: number;
    brake: number;
    grade: string;
    certified: boolean;
    summary: string;
    spareDistanceM: number;
  } | null>(null);
  const inputsRef = useRef({ throttle: 0, brake: 0, steerLeft: 0, steerRight: 0 });
  const runningRef = useRef(false);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  const data = useMemo(() => {
    const variant = getVariant(selectedId);
    const model = variant && getModel(variant.modelId);
    const td = variant && getTestData(variant.id);
    if (!variant || !model || !td?.zeroTo100.value || !td?.braking100to0.value) return null;
    return {
      label: `${model.name} ${variant.name}`,
      variant,
      model,
      testData: td,
      coverage: getDriveCoverage(variant.id),
      color: getBrand(model.brandId)!.color,
      dna: getVehicleDNA(model),
      spec: makeDriveSpec(td.zeroTo100.value, td.braking100to0.value, variant.engine.ps),
      wheelbaseMm: model.dimensions.wheelbaseMm,
      bootLitres: model.dimensions.bootLitres,
      bodyStyle: model.bodyStyle ?? ("suv" as "suv" | "sedan"),
    };
  }, [selectedId]);

  const scenario = useMemo(() => buildDriveTrial(terrain), [terrain]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") inputsRef.current.throttle = 1;
      if (k === "arrowdown" || k === "s") inputsRef.current.brake = 1;
      if (k === "arrowleft" || k === "a") inputsRef.current.steerLeft = 1;
      if (k === "arrowright" || k === "d") inputsRef.current.steerRight = 1;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") inputsRef.current.throttle = 0;
      if (k === "arrowdown" || k === "s") inputsRef.current.brake = 0;
      if (k === "arrowleft" || k === "a") inputsRef.current.steerLeft = 0;
      if (k === "arrowright" || k === "d") inputsRef.current.steerRight = 0;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const pedal = (key: "throttle" | "brake" | "steerLeft" | "steerRight") => ({
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "touch") return;
      inputsRef.current[key] = 1;
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (e.pointerType === "touch") return;
      inputsRef.current[key] = 0;
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "touch") return;
      inputsRef.current[key] = 0;
    },
    onTouchStart: (e: React.TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      inputsRef.current[key] = 1;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      inputsRef.current[key] = 0;
    },
  });

  const start = () => {
    setResult(null);
    setSector(scenario.sectors[0]);
    setHud({ speed: "0", distance: "0 m", timer: "t 0.0s" });
    setRunId((value) => value + 1);
    setRunning(true);
  };

  const courseMeta = TERRAIN_OPTIONS.find((option) => option.id === terrain) ?? TERRAIN_OPTIONS[0];
  const certificationTone =
    data?.coverage.certification === "measured"
      ? "border-[rgba(45,106,79,0.24)] bg-[rgba(45,106,79,0.08)] text-[#2d6a4f]"
      : data?.coverage.certification === "partial"
        ? "border-[rgba(200,76,49,0.2)] bg-[rgba(200,76,49,0.08)] text-[#C84C31]"
        : "border-[rgba(217,119,6,0.2)] bg-[rgba(217,119,6,0.08)] text-[#d97706]";

  return (
    <div className="border border-[#161616]/10 bg-[#F4F0E8]/40 rounded-[28px] overflow-hidden">
      <div className="border-b border-[#161616]/10 bg-[#F4F0E8]/90 px-6 py-6 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#161616]/10 bg-[#161616]/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#C84C31]">
                Drive Trial
              </span>
              {data && (
                <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${certificationTone}`}>
                  {data.coverage.certification === "measured"
                    ? "Measured"
                    : data.coverage.certification === "partial"
                      ? "Partial"
                      : "Preview"}
                </span>
              )}
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <VariantSelect
                label="Test car"
                value={selectedId}
                onChange={(nextId) => {
                  setId(nextId);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("drivescope_selected_variant", nextId);
                  }
                  setRunning(false);
                  setResult(null);
                  setSector(scenario.sectors[0]);
                  setHud({ speed: "0", distance: "0 m", timer: "t 0.0s" });
                }}
                includeVariant={(variantId) => allowPreviewOnly || getDriveCoverage(variantId).certification !== "preview"}
              />

              <label className="flex items-center gap-3 rounded-2xl border border-[#161616]/10 bg-white/80 px-4 py-3 text-xs text-secondary cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={allowPreviewOnly}
                  onChange={(e) => setAllowPreviewOnly(e.target.checked)}
                  className="h-4.5 w-4.5 accent-[#C84C31] cursor-pointer"
                />
                Include preview-only cars
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <DataChip
                label="0–100"
                value={
                  data?.testData.zeroTo100.value
                    ? `${data.testData.zeroTo100.value.toFixed(1)}s`
                    : "Unavailable"
                }
                status={
                  !data?.testData.zeroTo100.value
                    ? "missing"
                    : data.testData.zeroTo100.estimated
                      ? "modeled"
                      : "measured"
                }
              />
              <DataChip
                label="60–100"
                value={
                  data?.testData.sixtyTo100.value
                    ? `${data.testData.sixtyTo100.value.toFixed(1)}s`
                    : "Unavailable"
                }
                status={
                  !data?.testData.sixtyTo100.value
                    ? "missing"
                    : data.testData.sixtyTo100.estimated
                      ? "modeled"
                      : "measured"
                }
              />
              <DataChip
                label="100–0"
                value={
                  data?.testData.braking100to0.value
                    ? `${data.testData.braking100to0.value.toFixed(1)} m`
                    : "Unavailable"
                }
                status={
                  !data?.testData.braking100to0.value
                    ? "missing"
                    : data.testData.braking100to0.estimated
                      ? "modeled"
                      : "measured"
                }
              />
            </div>

            <div className="rounded-2xl border border-[#161616]/10 bg-[#161616]/5 px-4 py-4 text-sm text-secondary">
              {data?.coverage.previewOnlyReason ? data.coverage.previewOnlyReason : "This car is ready for a fully certified run."}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#161616]/10 bg-[linear-gradient(180deg,rgba(236,231,223,0.92),rgba(245,241,232,0.98))] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#C84C31]">Course Rig</p>
                <h3 className="mt-1 text-xl font-semibold text-primary">{courseMeta.label}</h3>
              </div>
              <Gauge className="h-5 w-5 text-[#C84C31]" />
            </div>

            <p className="mt-4 text-[9px] font-mono tracking-widest text-[#161616]/40 uppercase">
              Select Rig Course Environment //
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TERRAIN_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setTerrain(option.id);
                    setRunning(false);
                    setResult(null);
                    setSector(buildDriveTrial(option.id).sectors[0]);
                    setHud({ speed: "0", distance: "0 m", timer: "t 0.0s" });
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    terrain === option.id
                      ? "bg-[#C84C31] text-[#F5F1E8] shadow-sm border border-[#C84C31]"
                      : "border border-[#161616]/12 bg-white text-[#161616]/75 hover:bg-[#161616]/5 hover:text-[#161616]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-secondary">{courseMeta.note}</p>

            <div className="mt-5 space-y-2">
              {scenario.sectors.map((entry) => (
                <div
                  key={entry.id}
                  className={`rounded-2xl border px-3 py-3 transition ${
                    sector.id === entry.id
                      ? "border-[rgba(200,76,49,0.2)] bg-[rgba(200,76,49,0.06)]"
                      : "border-[#161616]/8 bg-[rgba(255,255,255,0.3)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: SECTOR_ACCENTS[entry.id] }}
                      />
                      <span className="text-sm font-medium text-primary">{entry.label}</span>
                    </div>
                    <SectorBadge certified={data ? sectorIsCertified(entry, data.coverage) : false} />
                  </div>
                  <p className="mt-1 text-xs text-secondary">{entry.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="relative overflow-hidden rounded-[28px] border border-[#161616]/10 bg-[linear-gradient(180deg,rgba(236,231,223,0.7),rgba(245,241,232,0.96))]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(200,76,49,0.12),transparent)]" />
          <div className="relative w-full aspect-[21/10] select-none touch-none">
            {data && (
              <Stage
                key={`${selectedId}-${terrain}-${runId}`}
                camera={{ position: [-8.5, 3, 6.5], fov: 45 }}
                fog={ENV_FOG[data.dna.environment]}
              >
                <DriveScene
                  color={data.color}
                  wheelbaseMm={data.wheelbaseMm}
                  bootLitres={data.bootLitres}
                  bodyStyle={data.bodyStyle}
                  dna={data.dna}
                  spec={data.spec}
                  terrain={terrain}
                  coverage={data.coverage}
                  inputsRef={inputsRef}
                  runningRef={runningRef}
                  onBanner={setBanner}
                  onHudChange={setHud}
                  onSectorChange={setSector}
                  onFinish={(telemetry) => {
                    setRunning(false);
                    const launch = launchScore(telemetry.finalState.zeroTo100S, data.spec);
                    const control = controlScore(
                      telemetry.controlInBandRatio,
                      telemetry.suspensionPeakM,
                      telemetry.brakePanicCount,
                      terrain
                    );
                    const spareDistanceM = telemetry.obstacleAt - telemetry.finalState.distanceM;
                    const brake = brakingScore(
                      telemetry.stoppedBeforeObstacle,
                      spareDistanceM,
                      telemetry.impactKmh
                    );
                    const certified = data.coverage.certification === "measured";
                    const grade = overallGrade([launch, control, brake], certified);
                    const summary = telemetry.stoppedBeforeObstacle
                      ? `Stopped ${Math.max(0, spareDistanceM).toFixed(1)} m before the wall.`
                      : `Projected impact ${telemetry.impactKmh.toFixed(0)} km/h at the barrier.`;

                    setResult({
                      launch,
                      control,
                      brake,
                      grade,
                      certified,
                      summary,
                      spareDistanceM,
                    });
                  }}
                />
              </Stage>
            )}

            <div className="absolute left-4 top-4 rounded-2xl border border-[#161616]/10 bg-[rgba(245,241,232,0.82)] px-4 py-3 stat-num">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-semibold text-primary">
                  {hud.speed}
                </span>
                <span className="pb-1 text-sm text-secondary">km/h</span>
              </div>
              <div className="mt-1 text-xs text-secondary">
                <span>{hud.distance}</span> · <span>{hud.timer}</span>
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#C84C31]">
                {sector.label}
              </div>
            </div>

            {banner && (
              <div className="absolute inset-x-0 top-4 flex justify-center px-4">
                <div className="max-w-3xl rounded-full border border-[#161616]/10 bg-[rgba(245,241,232,0.94)] px-4 py-2 text-center text-sm text-primary shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                  {banner}
                </div>
              </div>
            )}

            {running && (
              <>
                <button
                  {...pedal("brake")}
                  className="absolute bottom-4 left-4 h-24 w-20 rounded-[24px] border border-[rgba(200,76,49,0.35)] bg-[rgba(200,76,49,0.18)] text-sm font-semibold text-[#8F3A28] backdrop-blur-md active:bg-[rgba(200,76,49,0.28)]"
                >
                  BRAKE
                </button>
                
                {/* On-screen Steering controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                  <button
                    {...pedal("steerLeft")}
                    className="h-16 w-16 rounded-full border border-white/10 bg-black/40 text-white font-bold text-lg select-none backdrop-blur-md active:bg-[#C84C31]/50"
                  >
                    ←
                  </button>
                  <button
                    {...pedal("steerRight")}
                    className="h-16 w-16 rounded-full border border-white/10 bg-black/40 text-white font-bold text-lg select-none backdrop-blur-md active:bg-[#C84C31]/50"
                  >
                    →
                  </button>
                </div>

                <button
                  {...pedal("throttle")}
                  className="absolute bottom-4 right-4 h-28 w-20 rounded-[24px] border border-[rgba(45,106,79,0.35)] bg-[rgba(45,106,79,0.14)] text-sm font-semibold text-[#2d6a4f] backdrop-blur-md active:bg-[rgba(45,106,79,0.24)]"
                >
                  GO
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={start}
              disabled={!data || running}
              className="btn-accent rounded-2xl px-8 py-4 text-lg font-semibold disabled:opacity-40"
            >
              {running
                ? "Trial running…"
                : result
                  ? "Run trial again"
                  : data?.coverage.certification === "preview"
                    ? "Start preview run"
                    : "Arm Drive Trial"}
            </button>

            {data?.coverage.certification !== "measured" && (
              <EstimatedBadge
                label={data?.coverage.certification === "partial" ? "~ partial evidence" : "~ preview telemetry"}
                tooltip={
                  data?.coverage.certification === "partial"
                    ? "Measured 0–100 may exist for this car, but braking and final grading are still preview-only."
                    : "This run is built from modeled figures and should be treated as a directional preview, not a certified result."
                }
              />
            )}

            <div className="text-sm text-secondary">
              {data?.coverage.certification === "measured" ? (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#2d6a4f]" />
                  All gameplay-critical sectors are backed by measured figures.
                </span>
              ) : data?.coverage.certification === "partial" ? (
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C84C31]" />
                  Launch timing may be real; braking and overall grade stay preview-only.
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#d97706]" />
                  Preview mode keeps the feel, but none of the result claims are certified.
                </span>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#161616]/10 bg-[linear-gradient(180deg,rgba(236,231,223,0.92),rgba(245,241,232,0.98))] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#C84C31]">Result Deck</p>
                <h4 className="mt-1 text-lg font-semibold text-primary">
                  {result ? result.grade : "Awaiting run"}
                </h4>
              </div>
              {!result ? (
                <AlertTriangle className="h-5 w-5 text-[#d97706]" />
              ) : result.certified ? (
                <ShieldCheck className="h-5 w-5 text-[#2d6a4f]" />
              ) : (
                <Sparkles className="h-5 w-5 text-[#C84C31]" />
              )}
            </div>

            {result ? (
              <>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <DataChip label="Launch" value={`${result.launch}`} status={result.certified ? "measured" : "modeled"} />
                  <DataChip label="Control" value={`${result.control}`} status="modeled" />
                  <DataChip label="Brake" value={`${result.brake}`} status={result.certified ? "measured" : "modeled"} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-secondary">{result.summary}</p>
                {!result.certified && (
                  <p className="mt-3 text-xs leading-relaxed text-[#d97706]">
                    Overall grading is preview-only until measured braking data exists for this variant.
                  </p>
                )}
              </>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-secondary">
                Run the course to score launch execution, control composure, and the final brake stop.
              </p>
            )}

            {data && (
              <div className="mt-5 rounded-2xl border border-[#161616]/10 bg-[rgba(255,255,255,0.25)] px-4 py-3 text-xs text-secondary">
                <div className="flex items-center justify-between gap-3">
                  <span>{data.label}</span>
                  <span>{formatLakh(data.variant.priceExShowroom)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span>
                    {data.variant.engine.ps} PS · {data.variant.engine.nm} Nm · {data.variant.transmission}
                  </span>
                  <span>{data.variant.fuel.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
