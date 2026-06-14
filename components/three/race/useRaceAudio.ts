"use client";

import { useEffect, useRef } from "react";

/**
 * Procedural race audio for the player car — engine hum (gear/speed mapped) + brake squeal +
 * a filtered tyre-scrub for cornering. Ported/condensed from DriveMode's Web Audio block.
 */
export default function useRaceAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const engOsc = useRef<OscillatorNode | null>(null);
  const engGain = useRef<GainNode | null>(null);
  const brkGain = useRef<GainNode | null>(null);
  const scrubGain = useRef<GainNode | null>(null);

  useEffect(() => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    let ctx: AudioContext | null = null;
    try {
      ctx = new AC();
      ctxRef.current = ctx;

      // Engine
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const f = ctx.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      f.type = "bandpass";
      f.frequency.setValueAtTime(80, ctx.currentTime);
      f.Q.setValueAtTime(1.5, ctx.currentTime);
      g.gain.setValueAtTime(0, ctx.currentTime);
      osc.connect(f); f.connect(g); g.connect(ctx.destination); osc.start();
      engOsc.current = osc; engGain.current = g;

      // Brake squeal
      const bOsc = ctx.createOscillator();
      const bG = ctx.createGain();
      const bF = ctx.createBiquadFilter();
      bOsc.type = "sine";
      bOsc.frequency.setValueAtTime(2200, ctx.currentTime);
      bF.type = "highpass";
      bF.frequency.setValueAtTime(1800, ctx.currentTime);
      bG.gain.setValueAtTime(0, ctx.currentTime);
      bOsc.connect(bF); bF.connect(bG); bG.connect(ctx.destination); bOsc.start();
      brkGain.current = bG;

      // Tyre scrub (filtered sawtooth)
      const sOsc = ctx.createOscillator();
      const sG = ctx.createGain();
      const sF = ctx.createBiquadFilter();
      sOsc.type = "sawtooth";
      sOsc.frequency.setValueAtTime(140, ctx.currentTime);
      sF.type = "bandpass";
      sF.frequency.setValueAtTime(900, ctx.currentTime);
      sF.Q.setValueAtTime(0.8, ctx.currentTime);
      sG.gain.setValueAtTime(0, ctx.currentTime);
      sOsc.connect(sF); sF.connect(sG); sG.connect(ctx.destination); sOsc.start();
      scrubGain.current = sG;
    } catch {
      /* audio is best-effort */
    }
    return () => {
      if (ctx && ctx.state !== "closed") ctx.close();
      ctxRef.current = null;
      engOsc.current = null; engGain.current = null; brkGain.current = null; scrubGain.current = null;
    };
  }, []);

  const resume = () => {
    const ctx = ctxRef.current;
    if (ctx && ctx.state === "suspended") ctx.resume();
  };

  const update = (
    speedKmh: number,
    throttle: number,
    brake: number,
    slideAmount: number,
    running: boolean,
    realGear?: number,
    realRpm?: number
  ) => {
    const ctx = ctxRef.current;
    if (!ctx || ctx.state === "closed") return;
    const t = ctx.currentTime;
    const speed = Math.max(0.1, speedKmh);

    let gear = realGear ?? 1;
    let rpm = realRpm ?? 1000;
    if (realRpm === undefined) {
      let rpmRatio = speed / 32;
      if (speed > 32 && speed <= 62) { gear = 2; rpmRatio = (speed - 32) / 30; }
      else if (speed > 62 && speed <= 92) { gear = 3; rpmRatio = (speed - 62) / 30; }
      else if (speed > 92 && speed <= 135) { gear = 4; rpmRatio = (speed - 92) / 43; }
      else if (speed > 135) { gear = 5; rpmRatio = (speed - 135) / 55; }
      rpm = 1000 + rpmRatio * 4500;
    }

    const freq = 25 + (rpm / 6500) * 95 + gear * 4.0;
    const eng = running ? 0.05 + throttle * 0.1 : 0;
    engOsc.current?.frequency.setTargetAtTime(freq, t, 0.04);
    engGain.current?.gain.setTargetAtTime(eng, t, 0.04);

    const squeal = running && brake > 0.4 && speed > 8 ? (brake - 0.4) * 0.05 : 0;
    brkGain.current?.gain.setTargetAtTime(squeal, t, 0.04);

    const scrubVol = running && slideAmount > 0.02 && speed > 6 ? Math.min(0.08, slideAmount * 0.12) : 0;
    scrubGain.current?.gain.setTargetAtTime(scrubVol, t, 0.05);
  };

  return { resume, update };
}
