"use client";

import { AlertTriangle, Shield, Zap } from "lucide-react";
import type { HudState, RaceMode } from "./RaceView";

export interface Standing {
  label: string;
  color: string;
  position: number;
  timeS: number | null;
  gapS: number | null;
  isPlayer: boolean;
  isDnf?: boolean;
}

type Phase = "countdown" | "racing" | "finished";

function pedal(
  inputsRef: React.MutableRefObject<{ throttle: number; brake: number; steerLeft: number; steerRight: number }>,
  key: "throttle" | "brake" | "steerLeft" | "steerRight"
) {
  return {
    onPointerDown: (e: React.PointerEvent) => { if (e.pointerType === "touch") return; inputsRef.current[key] = 1; },
    onPointerUp: (e: React.PointerEvent) => { if (e.pointerType === "touch") return; inputsRef.current[key] = 0; },
    onPointerLeave: (e: React.PointerEvent) => { if (e.pointerType === "touch") return; inputsRef.current[key] = 0; },
    onTouchStart: (e: React.TouchEvent) => { if (e.cancelable) e.preventDefault(); inputsRef.current[key] = 1; },
    onTouchEnd: (e: React.TouchEvent) => { if (e.cancelable) e.preventDefault(); inputsRef.current[key] = 0; },
  };
}

export default function RaceHUD({
  hud,
  mode,
  phase,
  countdown,
  started,
  results,
  onStart,
  onRestart,
  onExit,
  inputsRef,
  liveStandings = [],
}: {
  hud: HudState;
  mode: RaceMode;
  phase: Phase;
  countdown: number | null;
  started: boolean;
  results: Standing[] | null;
  onStart: () => void;
  onRestart: () => void;
  onExit: () => void;
  inputsRef: React.MutableRefObject<{ throttle: number; brake: number; steerLeft: number; steerRight: number }>;
  liveStandings?: Standing[];
}) {
  const racing = started && phase === "racing";
  const showStart = !started && !results;
  const showPedals = racing && mode === "drive";

  return (
    <>
      {/* 1. Sleek Telemetry Panel (Top Left) */}
      {started && (
        <div className="pointer-events-none absolute left-2 top-2 sm:left-4 sm:top-4 rounded-2xl border border-[#161616]/10 bg-[rgba(245,241,232,0.92)] px-3 py-2 sm:px-4 sm:py-3 stat-num backdrop-blur-sm w-40 sm:w-72 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <div className="flex justify-between items-baseline">
            <div className="flex items-baseline gap-1.5">
              <span id="hud-speed" className="text-2xl sm:text-4xl font-bold text-[#C84C31] drop-shadow-[0_0_8px_rgba(200,76,49,0.15)]">0</span>
              <span className="text-xs text-secondary">KM/H</span>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-[rgba(200,76,49,0.08)] border border-[rgba(200,76,49,0.18)] px-2.5 py-1">
              <span className="text-[10px] text-[#C84C31] uppercase font-semibold">GEAR</span>
              <span id="hud-gear" className="text-lg font-extrabold text-[#C84C31] leading-none">D1</span>
            </div>
          </div>

          {/* RPM Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[9px] text-secondary mb-1 font-semibold">
              <span id="hud-rpm-text">1000 RPM</span>
              <span className="text-red-600 font-bold">6500 LIMIT</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#161616]/8 overflow-hidden border border-[#161616]/5">
              <div
                id="hud-rpm-bar"
                className="h-full bg-[#C84C31] transition-all duration-75 shadow-[0_0_6px_rgba(200,76,49,0.3)]"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          {/* Quick status */}
          <div className="mt-2.5 flex items-center justify-between text-[9px] uppercase tracking-widest text-secondary/60 font-semibold border-t border-[#161616]/6 pt-2">
            <span className="text-[#C84C31] font-bold">{mode === "drive" ? "Ego Driver" : "Auto Spectate"}</span>
            <span>Telemetr-X V1</span>
          </div>
        </div>
      )}

      {/* 2. G-Force & Integrity Deck (Bottom Left) */}
      {started && (
        <div className={`pointer-events-none absolute left-4 bottom-4 gap-3.5 ${showPedals ? "hidden" : "hidden sm:flex"}`}>
          {/* Integrity / Health */}
          <div className="rounded-2xl border border-[#161616]/10 bg-[rgba(245,241,232,0.92)] p-3 backdrop-blur-md flex flex-col justify-between w-36 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-secondary font-bold">
              <Shield className="h-3.5 w-3.5 text-[#C84C31]" />
              <span>Integrity</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-primary stat-num" id="hud-integrity-text">
              100%
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-[#161616]/8 overflow-hidden">
              <div
                id="hud-integrity-bar"
                className="h-full bg-emerald-600 transition-all duration-150"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* G-Force crosshair */}
          <div className="rounded-2xl border border-[#161616]/10 bg-[rgba(245,241,232,0.92)] p-3.5 backdrop-blur-md flex flex-col items-center shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <div className="text-[9px] uppercase tracking-widest text-secondary font-bold mb-2">G-FORCE</div>
            <div className="relative h-14 w-14 rounded-full border border-[#161616]/12 flex items-center justify-center">
              <div className="absolute h-7 w-7 rounded-full border border-dashed border-[#161616]/10" />
              <div className="absolute h-[1px] w-full bg-[#161616]/10" />
              <div className="absolute w-[1px] h-full bg-[#161616]/10" />
              <div
                id="hud-gforce-dot"
                className="absolute h-2.5 w-2.5 rounded-full bg-[#C84C31] shadow-[0_0_8px_rgba(200,76,49,0.4)] transition-all duration-75"
                style={{ transform: "translate(0px, 0px)" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Live Standings Leaderboard (Bottom Right) */}
      {started && liveStandings.length > 0 && (
        <div className="pointer-events-none absolute right-2 top-2 sm:right-4 sm:top-4 rounded-2xl border border-[#161616]/10 bg-[rgba(245,241,232,0.94)] p-2.5 sm:p-4 backdrop-blur-md w-44 sm:w-72 shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-[10px] sm:text-xs">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#C84C31] font-bold border-b border-[#161616]/8 pb-1.5 mb-2 flex items-center justify-between">
            <span>Grid Leaderboard</span>
            <span className="text-secondary">Live Gaps</span>
          </p>
          
          <div className="space-y-1.5">
            {liveStandings.map((r) => (
              <div
                key={r.label}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
                  r.isPlayer 
                    ? "bg-[rgba(200,76,49,0.06)] border-[rgba(200,76,49,0.2)]" 
                    : "bg-[#161616]/2 border-transparent"
                }`}
              >
                <span className={`w-5 font-bold stat-num ${r.isPlayer ? "text-[#C84C31]" : "text-secondary"}`}>
                  P{r.position}
                </span>
                <span className="inline-block h-2.5 w-2.5 rounded-full shadow-[0_0_6px_currentColor]" style={{ color: r.color, backgroundColor: r.color }} />
                <span className={`flex-1 truncate font-medium ${r.isPlayer ? "text-primary font-semibold" : "text-secondary/85"}`}>
                  {r.label}
                </span>
                <span className="stat-num text-[11px] font-semibold">
                  {r.isDnf ? (
                    <span className="text-red-600 font-bold px-1.5 py-0.5 rounded bg-red-600/10 flex items-center gap-0.5 text-[9px] border border-red-600/20">
                      <AlertTriangle className="h-2.5 w-2.5" /> DNF
                    </span>
                  ) : r.timeS != null ? (
                    <span className="text-emerald-700 font-bold">FINISH</span>
                  ) : r.gapS !== null ? (
                    <span className="text-secondary text-[10px]">{`+${r.gapS.toFixed(1)}s`}</span>
                  ) : (
                    <span className="text-secondary/50">—</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Countdown overlay */}
      {countdown !== null && countdown > 0 && phase === "countdown" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(245,241,232,0.15)] backdrop-blur-[1px]">
          <span className="text-[88px] sm:text-[140px] font-extrabold text-[#C84C31] drop-shadow-[0_0_30px_rgba(200,76,49,0.4)] stat-num animate-bounce">
            {countdown}
          </span>
        </div>
      )}

      {/* Start overlay */}
      {showStart && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[rgba(245,241,232,0.65)] backdrop-blur-[4px]">
          <div className="text-center max-w-sm mb-2">
            <Zap className="h-10 w-10 text-[#C84C31] mx-auto mb-2 drop-shadow-[0_0_12px_#C84C31]" />
            <h2 className="text-xl font-bold text-primary tracking-tight">Race Telemetry Pre-armed</h2>
            <p className="text-xs text-secondary mt-1 leading-relaxed">System ready. Prepare engines for full-throttle launch challenge.</p>
          </div>

          <button
            onClick={onStart}
            className="btn-accent rounded-2xl px-12 py-4 text-base font-bold tracking-wider uppercase drop-shadow-[0_0_15px_rgba(200,76,49,0.3)] cursor-pointer"
          >
            {mode === "drive" ? "IGNITE & DRIVE" : "LAUNCH SPECTATE"}
          </button>
          
          {mode === "drive" && (
            <p className="text-xs text-secondary text-center max-w-xs leading-normal opacity-85">
              Controls: <kbd className="px-1.5 py-0.5 rounded border border-[#161616]/12 bg-white text-primary text-[10px] font-mono shadow-sm">W</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-[#161616]/12 bg-white text-primary text-[10px] font-mono shadow-sm">↑</kbd> Gas &middot; <kbd className="px-1.5 py-0.5 rounded border border-[#161616]/12 bg-white text-primary text-[10px] font-mono shadow-sm">S</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-[#161616]/12 bg-white text-primary text-[10px] font-mono shadow-sm">↓</kbd> Brake &middot; <kbd className="px-1.5 py-0.5 rounded border border-[#161616]/12 bg-white text-primary text-[10px] font-mono shadow-sm">A</kbd>/<kbd className="px-1.5 py-0.5 rounded border border-[#161616]/12 bg-white text-primary text-[10px] font-mono shadow-sm">D</kbd> Steer
            </p>
          )}
          <button onClick={onExit} className="text-xs text-secondary underline underline-offset-2 hover:text-[#C84C31] transition-colors mt-2">
            Abort & Change Setup
          </button>
        </div>
      )}

      {/* Results overlay */}
      {results && (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(245,241,232,0.8)] backdrop-blur-[5px] px-4">
          <div className="w-full max-w-md rounded-[28px] border border-[#161616]/10 bg-[rgba(245,241,232,0.98)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.15)] text-center">
            <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C84C31]">Session Complete</p>
            <h3 className="mt-1 text-2xl font-bold text-primary">
              {results.find((r) => r.isPlayer)
                ? results.find((r) => r.isPlayer)!.isDnf
                  ? "RACE DNF — CRASHED OUT"
                  : `You finished P${results.find((r) => r.isPlayer)!.position}`
                : `${results[0].label} wins`}
            </h3>
            
            <div className="mt-5 space-y-1.5 text-left">
              {results.map((r) => (
                <div
                  key={r.label + r.position}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm border ${
                    r.isPlayer 
                      ? "bg-[rgba(200,76,49,0.06)] border-[rgba(200,76,49,0.2)]" 
                      : "bg-[#161616]/2 border-transparent"
                  }`}
                >
                  <span className={`w-6 font-bold stat-num ${r.isPlayer ? "text-[#C84C31]" : "text-secondary"}`}>P{r.position}</span>
                  <span className="inline-block h-2.5 w-2.5 rounded-full shadow-[0_0_6px_currentColor]" style={{ color: r.color, backgroundColor: r.color }} />
                  <span className={`flex-1 truncate font-medium ${r.isPlayer ? "text-primary font-semibold" : "text-secondary"}`}>{r.label}</span>
                  <span className="stat-num text-secondary font-semibold">
                    {r.isDnf ? (
                      <span className="text-red-600 font-bold">DNF</span>
                    ) : r.timeS != null ? (
                      `${r.timeS.toFixed(1)}s`
                    ) : "DNF"}
                    {r.gapS && !r.isDnf ? ` (+${r.gapS.toFixed(1)}s)` : ""}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={onRestart} className="btn-accent flex-1 rounded-xl px-4 py-3 text-sm font-bold tracking-wider uppercase cursor-pointer">
                Restart Race
              </button>
              <button
                onClick={onExit}
                className="flex-1 rounded-xl border border-[#161616]/15 bg-white px-4 py-3 text-sm font-bold text-primary hover:bg-[#161616]/5 transition-colors tracking-wider uppercase cursor-pointer"
              >
                Change Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Touch pedals for mobile/click controls */}
      {showPedals && (
        <>
          <button
            {...pedal(inputsRef, "brake")}
            className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 h-20 w-16 sm:h-24 sm:w-20 rounded-[24px] border border-red-500/30 bg-red-500/8 text-sm font-bold text-red-500 backdrop-blur-md active:bg-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.06)] transition-colors select-none"
          >
            BRAKE
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:bottom-4 flex gap-3 sm:gap-4">
            <button
              {...pedal(inputsRef, "steerLeft")}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border border-[#161616]/15 bg-[rgba(245,241,232,0.8)] text-xl font-bold text-primary backdrop-blur-md active:bg-[rgba(200,76,49,0.15)] select-none"
            >
              ←
            </button>
            <button
              {...pedal(inputsRef, "steerRight")}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border border-[#161616]/15 bg-[rgba(245,241,232,0.8)] text-xl font-bold text-primary backdrop-blur-md active:bg-[rgba(200,76,49,0.15)] select-none"
            >
              →
            </button>
          </div>

          <button
            {...pedal(inputsRef, "throttle")}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 h-24 w-16 sm:h-28 sm:w-20 rounded-[24px] border border-[rgba(200,76,49,0.25)] bg-[rgba(200,76,49,0.08)] text-sm font-bold text-[#C84C31] backdrop-blur-md active:bg-[rgba(200,76,49,0.2)] shadow-[0_0_12px_rgba(200,76,49,0.1)] transition-colors select-none"
          >
            GAS
          </button>
        </>
      )}
    </>
  );
}
