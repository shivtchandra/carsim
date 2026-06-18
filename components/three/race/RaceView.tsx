"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getBrand, getModel, getTestData, getVariant } from "@/lib/data";
import { makeDriveSpec, terrainRoadHeight } from "@/lib/drive";
import { getVehicleDNA, type VehicleDNA } from "@/lib/vehicle-dna";
import {
  createRaceWorld,
  stepRaceWorld,
  type EntrantConfig,
  type RaceInputs,
  type RaceWorld,
} from "@/lib/race/engine";
import { aiController, humanController } from "@/lib/race/controllers";
import { buildTrack, camberAngle, camberHeight, leftNormal, sampleTrack, type CompiledTrack } from "@/lib/race/track";
import { getTrackDef } from "@/lib/race/tracks";
import StylizedCar, { type CarMotionRef } from "../StylizedCar";
import RaceStage from "./RaceStage";
import RaceTrackMesh from "./RaceTrackMesh";
import RaceEnvironment from "./RaceEnvironment";
import RaceHUD, { type Standing } from "./RaceHUD";
import useRaceAudio from "./useRaceAudio";

export type RaceMode = "drive" | "spectate";

interface RacerInfo {
  modelId: string;
  color: string;
  wheelbaseMm: number;
  bootLitres: number;
  bodyStyle: "suv" | "sedan";
  dna: VehicleDNA;
  wheelR: number;
}

export interface HudState {
  speed: string;
  position: string;
  gap: string;
}

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

function buildRacer(variantId: string, ai: boolean): { config: EntrantConfig; info: RacerInfo } | null {
  const v = getVariant(variantId);
  if (!v) return null;
  const m = getModel(v.modelId);
  if (!m) return null;
  const brand = getBrand(m.brandId);
  const td = getTestData(variantId);
  const t100 = td?.zeroTo100.value ?? clamp((v.kerbWeight / v.engine.ps) * 9, 6, 20);
  const d100 = td?.braking100to0.value ?? 42;
  const color = brand?.color ?? "#C84C31";
  const dna = getVehicleDNA(m);
  return {
    config: {
      id: variantId,
      label: `${m.name} ${v.name}`,
      color,
      spec: makeDriveSpec(t100, d100, v.engine.ps),
      kerbWeight: v.kerbWeight,
      controller: ai ? aiController(0.94, variantId.length % 7) : humanController,
    },
    info: {
      modelId: m.id,
      color,
      wheelbaseMm: m.dimensions.wheelbaseMm,
      bootLitres: m.dimensions.bootLitres,
      bodyStyle: m.bodyStyle ?? "suv",
      dna,
      wheelR: 0.33 + (((dna.wheelInches ?? 17) - 16) * 0.02),
    },
  };
}

function gridOffsets(count: number, width: number): number[] {
  if (count <= 1) return [0];
  const usable = Math.min(width - 0.9, 2.4);
  return Array.from({ length: count }, (_, i) => -usable + 2 * usable * (i / (count - 1)));
}

function RaceScene({
  world,
  track,
  infos,
  mode,
  playerIndex,
  inputsRef,
  startedRef,
  audio,
  onHud,
  onCountdown,
  onPhase,
  onFinish,
  onLiveStandings,
  autoGas,
}: {
  world: RaceWorld;
  track: CompiledTrack;
  infos: RacerInfo[];
  mode: RaceMode;
  playerIndex: number;
  inputsRef: React.MutableRefObject<{ throttle: number; brake: number; steerLeft: number; steerRight: number }>;
  startedRef: React.MutableRefObject<boolean>;
  audio: ReturnType<typeof useRaceAudio>;
  onHud: (h: HudState) => void;
  onCountdown: (n: number) => void;
  onPhase: (p: RaceWorld["phase"]) => void;
  onFinish: (s: Standing[]) => void;
  onLiveStandings: (s: Standing[]) => void;
  autoGas: boolean;
}) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const motions = useRef<React.MutableRefObject<CarMotionRef>[]>(
    world.entrants.map(() => ({ current: { wheelSpeed: 0, pitch: 0 } }))
  );
  const camTarget = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const prevPhase = useRef<RaceWorld["phase"]>("countdown");
  const prevCount = useRef(-1);
  const hudRef = useRef<HudState>({ speed: "0", position: "—", gap: "" });
  const finishedReported = useRef(false);
  const frameCount = useRef(0);
  const smoothedG = useRef({ long: 0, lat: 0 });

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    const steer = (inputsRef.current.steerRight ? 1 : 0) - (inputsRef.current.steerLeft ? 1 : 0);
    
    let throttle = inputsRef.current.throttle;
    const brake = inputsRef.current.brake;
    if (autoGas && mode === "drive" && world.phase === "racing") {
      throttle = brake > 0 ? 0 : 1;
    }

    const humanInputs: RaceInputs = {
      throttle,
      brake,
      steer,
    };

    frameCount.current++;

    if (startedRef.current) {
      stepRaceWorld(world, dt, humanInputs);
    }

    // Place every car along the track.
    let playerScrub = 0;
    world.entrants.forEach((e, i) => {
      const smp = sampleTrack(track, e.state.distanceM);
      const nrm = leftNormal(smp.heading);
      const terrain = smp.surface === "mud" ? "offroad" : "highway";
      const bump = terrainRoadHeight(e.state.distanceM, terrain);
      const camH = camberHeight(smp.curvature, e.laneOffset);
      const g = groups.current[i];
      if (g) {
        g.position.set(
          smp.pos.x + nrm.x * e.laneOffset,
          smp.elevation + bump + e.state.suspensionOffsetM + camH,
          smp.pos.z + nrm.z * e.laneOffset
        );
        g.rotation.y = -smp.heading + (e.spinYaw ?? 0);
      }
      const mref = motions.current[i];
      mref.current.wheelSpeed = (e.state.speedKmh / 3.6) / infos[i].wheelR;
      // Nose pitches up on climbs, down on descents (Hill Climb feel) + suspension motion.
      const slopeRad = Math.atan(smp.grade / 100);
      mref.current.pitch = slopeRad + e.state.suspensionVelMs * 0.02 - e.washOutFactor * 0.06;

      const isHuman = e.controller.kind === "human";
      const steerVal = isHuman ? steer : Math.max(-1, Math.min(1, (e.targetOffset - e.laneOffset) * 1.2));
      mref.current.steerAngle = -steerVal * 0.45;
      // Lean with road banking + body roll from lateral load.
      const camberRoll = -Math.sign(smp.curvature) * camberAngle(smp.curvature) * 0.85;
      mref.current.roll = camberRoll - (e.state.lateralVel ?? 0) * 0.04;

      if (i === playerIndex) playerScrub = e.washOutFactor;
    });

    // Camera follows the player (drive) or the current leader (spectate).
    const leader = world.entrants.reduce((a, b) => (b.state.distanceM > a.state.distanceM ? b : a));
    const focus = mode === "drive" ? world.entrants[playerIndex] : leader;
    const fSmp = sampleTrack(track, focus.state.distanceM);
    const cosH = Math.cos(fSmp.heading);
    const sinH = Math.sin(fSmp.heading);
    const back = 10.5;
    camTarget.current.set(
      fSmp.pos.x - cosH * back,
      fSmp.elevation + 5.2,
      fSmp.pos.z - sinH * back
    );
    camera.position.lerp(camTarget.current, startedRef.current ? 0.12 : 0.06);
    // Aim just ahead of the car and a touch up, so the car sits in the lower third (not cut off).
    const ahead = sampleTrack(track, focus.state.distanceM + 7);
    lookTarget.current.set(ahead.pos.x, ahead.elevation + 1.4, ahead.pos.z);
    camera.lookAt(lookTarget.current);

    // Audio (player car).
    const player = world.entrants[playerIndex];
    audio.update(
      player.state.speedKmh,
      mode === "drive" ? inputsRef.current.throttle : 1,
      mode === "drive" ? inputsRef.current.brake : 0,
      player.state.slideAmount ?? 0,
      world.phase === "racing",
      player.state.gear,
      player.state.rpm
    );

    // Dynamic HUD DOM elements updates (60fps smooth)
    if (startedRef.current) {
      const speedEl = document.getElementById("hud-speed");
      if (speedEl) speedEl.textContent = player.state.speedKmh.toFixed(0);

      const gearEl = document.getElementById("hud-gear");
      if (gearEl) {
        gearEl.textContent = player.state.clutchActive ? "—" : `D${player.state.gear}`;
      }

      const rpmBar = document.getElementById("hud-rpm-bar");
      if (rpmBar) {
        const pct = Math.min(100, (((player.state.rpm ?? 1000) - 1000) / 5500) * 100);
        rpmBar.style.width = `${pct}%`;
        if ((player.state.rpm ?? 1000) > 5800) {
          rpmBar.style.backgroundColor = "#ef4444";
          rpmBar.classList.add("animate-pulse");
        } else {
          rpmBar.style.backgroundColor = "#C84C31";
          rpmBar.classList.remove("animate-pulse");
        }
      }
      const rpmText = document.getElementById("hud-rpm-text");
      if (rpmText) rpmText.textContent = `${(player.state.rpm ?? 1000).toFixed(0)} RPM`;

      const integrityBar = document.getElementById("hud-integrity-bar");
      if (integrityBar) {
        const integrity = player.state.integrity ?? 100;
        integrityBar.style.width = `${integrity}%`;
        if (integrity < 30) {
          integrityBar.style.backgroundColor = "#ef4444";
        } else if (integrity < 60) {
          integrityBar.style.backgroundColor = "#f59e0b";
        } else {
          integrityBar.style.backgroundColor = "#2d6a4f";
        }
      }
      const integrityText = document.getElementById("hud-integrity-text");
      if (integrityText) integrityText.textContent = `${(player.state.integrity ?? 100).toFixed(0)}%`;

      const gDot = document.getElementById("hud-gforce-dot");
      if (gDot) {
        const throttle = inputsRef.current.throttle;
        const brake = inputsRef.current.brake;
        const targetLongG = clamp(throttle * 0.4 - brake * 0.9, -1.2, 0.6);
        const targetLatG = clamp(((player.state.lateralVel ?? 0) * 1.5) / 9.81, -1.5, 1.5);
        smoothedG.current.long += (targetLongG - smoothedG.current.long) * Math.min(1.0, dt * 10.0);
        smoothedG.current.lat += (targetLatG - smoothedG.current.lat) * Math.min(1.0, dt * 10.0);
        gDot.style.transform = `translate(${(smoothedG.current.lat * 25).toFixed(1)}px, ${(-smoothedG.current.long * 25).toFixed(1)}px)`;
      }

      // Standings lists update every 10 frames
      if (frameCount.current % 10 === 0) {
        const winnerTime = Math.min(...world.entrants.filter((e) => e.finished && e.finishTimeS !== null).map((e) => e.finishTimeS ?? Infinity));
        const list: Standing[] = [...world.entrants]
          .sort((a, b) => a.position - b.position)
          .map((e) => {
            const isDnf = (e.state.integrity ?? 100) <= 0;
            let gapS: number | null = null;
            if (e.finished && e.finishTimeS !== null && winnerTime !== Infinity) {
              gapS = e.finishTimeS - winnerTime;
            }
            return {
              label: e.label,
              color: e.color,
              position: e.position,
              timeS: e.finishTimeS,
              gapS: gapS,
              isPlayer: world.entrants.indexOf(e) === playerIndex,
              isDnf: isDnf,
            };
          });
        onLiveStandings(list);
      }
    }

    // Countdown readout.
    if (world.phase === "countdown") {
      const n = Math.ceil(world.countdownS);
      if (n !== prevCount.current) {
        prevCount.current = n;
        onCountdown(n);
      }
    }

    // Phase transitions.
    if (world.phase !== prevPhase.current) {
      prevPhase.current = world.phase;
      onPhase(world.phase);
    }

    // HUD (throttled to string changes).
    const hudSpeed = (mode === "drive" ? player : focus).state.speedKmh.toFixed(0);
    const hudPos = focus.position > 0 ? `P${focus.position}/${world.entrants.length}` : "—";
    let gapStr = "";
    if (world.phase !== "countdown" && leader !== focus) {
      const gapM = leader.state.distanceM - focus.state.distanceM;
      gapStr = `-${gapM.toFixed(0)} m`;
    } else if (leader === focus && world.entrants.length > 1 && world.phase === "racing") {
      const second = world.entrants
        .filter((e) => e !== leader)
        .reduce((a, b) => (b.state.distanceM > a.state.distanceM ? b : a));
      gapStr = `+${(leader.state.distanceM - second.state.distanceM).toFixed(0)} m`;
    }
    const next: HudState = { speed: hudSpeed, position: hudPos, gap: gapStr };
    if (
      hudRef.current.speed !== next.speed ||
      hudRef.current.position !== next.position ||
      hudRef.current.gap !== next.gap
    ) {
      hudRef.current = next;
      onHud(next);
    }

    // Finish results (once).
    if (world.phase === "finished" && !finishedReported.current) {
      finishedReported.current = true;
      const winnerTime = Math.min(...world.entrants.filter((e) => e.finished && e.finishTimeS !== null).map((e) => e.finishTimeS ?? Infinity));
      const standings: Standing[] = [...world.entrants]
        .sort((a, b) => a.position - b.position)
        .map((e) => {
          const isDnf = (e.state.integrity ?? 100) <= 0;
          let gapS: number | null = null;
          if (e.finished && e.finishTimeS !== null && winnerTime !== Infinity) {
            gapS = e.finishTimeS - winnerTime;
          }
          return {
            label: e.label,
            color: e.color,
            position: e.position,
            timeS: e.finishTimeS,
            gapS: gapS,
            isPlayer: world.entrants.indexOf(e) === playerIndex,
            isDnf: isDnf,
          };
        });
      onFinish(standings);
    }
  });

  return (
    <>
      <RaceEnvironment track={track} />
      <RaceTrackMesh track={track} />
      {world.entrants.map((e, i) => (
        <group key={e.id} ref={(el) => { groups.current[i] = el; }}>
          <StylizedCar
            modelId={infos[i].modelId}
            color={infos[i].color}
            wheelbaseMm={infos[i].wheelbaseMm}
            bootLitres={infos[i].bootLitres}
            bodyStyle={infos[i].bodyStyle}
            dna={infos[i].dna}
            motionRef={motions.current[i]}
          />
        </group>
      ))}
    </>
  );
}

export default function RaceView({
  playerVariantId,
  rivalVariantIds,
  trackId,
  mode,
  autoGas = false,
  espAssist = true,
  onExit,
}: {
  playerVariantId: string;
  rivalVariantIds: string[];
  trackId: string;
  mode: RaceMode;
  autoGas?: boolean;
  espAssist?: boolean;
  onExit: () => void;
}) {
  const audio = useRaceAudio();
  const [runId, setRunId] = useState(0);
  const [started, setStarted] = useState(false);
  const [hud, setHud] = useState<HudState>({ speed: "0", position: "—", gap: "" });
  const [liveStandings, setLiveStandings] = useState<Standing[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [phase, setPhase] = useState<RaceWorld["phase"]>("countdown");
  const [results, setResults] = useState<Standing[] | null>(null);

  const startedRef = useRef(false);
  const inputsRef = useRef({ throttle: 0, brake: 0, steerLeft: 0, steerRight: 0 });

  const setup = useMemo(() => {
    const track = buildTrack(getTrackDef(trackId));
    const ids = [playerVariantId, ...rivalVariantIds.filter(Boolean)];
    const built = ids
      .map((id, idx) => buildRacer(id, mode === "spectate" ? true : idx !== 0))
      .filter((b): b is { config: EntrantConfig; info: RacerInfo } => !!b);
    const offsets = gridOffsets(built.length, track.width);
    built.forEach((b, idx) => {
      b.config.startLaneOffset = offsets[idx];
      b.config.espAssist = mode === "drive" && idx === 0 ? espAssist : true;
    });
    return {
      track,
      configs: built.map((b) => b.config),
      infos: built.map((b) => b.info),
      playerIndex: 0,
    };
  }, [playerVariantId, rivalVariantIds, trackId, mode, espAssist]);

  // Fresh world each run.
  const world = useMemo(
    () => createRaceWorld(setup.track, setup.configs),
    [setup, runId]
  );

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  // Keyboard controls.
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

  const start = () => {
    setResults(null);
    setLiveStandings([]);
    setCountdown(3);
    setPhase("countdown");
    setRunId((r) => r + 1);
    audio.resume();
    setStarted(true);
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#161616]/10 bg-[linear-gradient(180deg,#eef1ea,#f5f1e8)]">
      <div className="relative w-full aspect-[3/4] sm:aspect-[21/10] select-none touch-none">
        <RaceStage key={runId}>
          <RaceScene
            world={world}
            track={setup.track}
            infos={setup.infos}
            mode={mode}
            playerIndex={setup.playerIndex}
            inputsRef={inputsRef}
            startedRef={startedRef}
            audio={audio}
            onHud={setHud}
            onCountdown={(n) => setCountdown(n)}
            onPhase={(p) => {
              setPhase(p);
              if (p === "racing") setCountdown(null);
            }}
            onFinish={(s) => {
              setResults(s);
              setStarted(false);
            }}
            onLiveStandings={setLiveStandings}
            autoGas={autoGas}
          />
        </RaceStage>

        <RaceHUD
          hud={hud}
          mode={mode}
          phase={phase}
          countdown={countdown}
          started={started}
          results={results}
          onStart={start}
          onRestart={start}
          onExit={onExit}
          inputsRef={inputsRef}
          liveStandings={liveStandings}
        />
      </div>
    </div>
  );
}
