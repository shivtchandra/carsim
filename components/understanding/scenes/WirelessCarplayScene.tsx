"use client";

import React from "react";
import { useSceneTimeline } from "./shared/useSceneTimeline";
import { SCENE_COLORS } from "./shared/sceneTokens";

export default function WirelessCarplayScene() {
  const { t, phase } = useSceneTimeline(3, [
    { at: 0, text: "Place phone in the central dashboard charging tray." },
    { at: 2.0, text: "Phone connects automatically via Bluetooth and 5GHz Wi-Fi." },
    { at: 4.5, text: "Maps, music, and voice controls project instantly on the 10\"+ display." },
  ], 10);

  // States:
  // Phase 0.0 - 0.2: Phone slides into tray
  // Phase 0.2 - 0.45: Wireless link connecting (pulsing waves)
  // Phase 0.45 - 0.85: CarPlay projected and active
  // Phase 0.85 - 1.0: Closes and loops back

  let phoneY = 165;
  let phoneOpacity = 0;
  let connectionPulse = 0;
  let screenActive = false;
  let screenOpacity = 0;

  if (phase < 0.2) {
    const p = phase / 0.2;
    phoneY = 175 - 15 * p; // slide up into tray
    phoneOpacity = p;
  } else if (phase >= 0.2 && phase < 0.85) {
    phoneY = 160;
    phoneOpacity = 1;
  } else {
    const p = (phase - 0.85) / 0.15;
    phoneOpacity = 1 - p;
    phoneY = 160 + 15 * p;
  }

  if (phase >= 0.2 && phase < 0.45) {
    connectionPulse = ((phase - 0.2) / 0.25) * 4; // 4 pulses
  }

  if (phase >= 0.45 && phase < 0.85) {
    screenActive = true;
    screenOpacity = 1;
  } else if (phase >= 0.85) {
    const p = (phase - 0.85) / 0.15;
    screenActive = true;
    screenOpacity = 1 - p;
  }

  // Generate connection waves
  const waveRadius = (connectionPulse % 1) * 120;
  const waveOpacity = 1 - (connectionPulse % 1);

  return (
    <svg viewBox="0 0 700 200" className="absolute inset-0 w-full h-full bg-[#0F0F11]">
      {/* Blueprint Grid */}
      <defs>
        <pattern id="blueprint-grid-carplay" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79, 107, 138, 0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid-carplay)" />

      {/* Axis and annotations */}
      <g opacity={0.25} className="font-mono text-[8px]" fill={SCENE_COLORS.secondary}>
        <text x="10" y="20">SEC T-15 // WIRELESS PHONE PROJECTION SYSTEM</text>
        <text x="10" y="32">PROTOCOL: WI-FI 5GHz + BLUETOOTH LE // LINK: {screenActive ? "CONNECTED" : "SCANNING"}</text>
        <line x1="5" y1="180" x2="695" y2="180" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <line x1="50" y1="10" x2="50" y2="190" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── CENTRAL CONSOLE PROFILE SCHEMATIC ── */}
      <g stroke="rgba(79, 107, 138, 0.25)" strokeWidth="1" fill="none">
        {/* Console dashboard section */}
        <path d="M 120,190 L 160,180 L 220,180 L 290,140 L 330,140 M 330,140 L 360,70 L 490,70 L 530,140 L 580,180" />
        {/* Charging Pad pocket tray */}
        <rect x="220" y="152" width="70" height="24" rx="3" fill="#141416" stroke="rgba(79, 107, 138, 0.3)" />
        {/* Qi wireless coil watermark inside tray */}
        <circle cx="255" cy="164" r="6" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1.5} />
        <path d="M 255,153 L 255,175 M 244,164 L 266,164" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
      </g>

      {/* ── WIRELESS SIGNAL WAVES ── */}
      {connectionPulse > 0 && connectionPulse < 4 && (
        <g>
          <circle
            cx="255"
            cy="164"
            r={waveRadius}
            fill="none"
            stroke="#35D6FF"
            strokeWidth={1.5}
            opacity={waveOpacity * 0.6}
            strokeDasharray="4 4"
          />
          {/* Signal beam path indicator */}
          <line
            x1="255"
            y1="164"
            x2="425"
            y2="105"
            stroke="#35D6FF"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={0.3}
          />
        </g>
      )}

      {/* ── THE MOBILE PHONE IN TRAY ── */}
      <g transform={`translate(225, ${phoneY})`} opacity={phoneOpacity}>
        {/* Phone Body */}
        <rect x="0" y="0" width="60" height="10" rx="2" fill="#1e1e24" stroke={SCENE_COLORS.secondary} strokeWidth={1.25} />
        {/* Screen active highlight */}
        <rect x="2" y="2" width="56" height="6" rx="1" fill="rgba(53, 214, 255, 0.08)" />
        <circle cx="54" cy="5" r="1" fill="#35D6FF" opacity={0.6} />
      </g>

      {/* ── THE DASHBOARD TOUCHSCREEN WIDESCREEN DISPLAY ── */}
      <g transform="translate(360, 68)">
        {/* Screen bezel */}
        <rect x="0" y="0" width="130" height="48" rx="4" fill="#121215" stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1.25} />
        
        {/* Screen backplate */}
        <rect x="4" y="4" width="122" height="40" rx="2" fill="#07070a" />

        {/* Apple CarPlay projected content */}
        {screenActive && (
          <g opacity={screenOpacity}>
            {/* Color backdrop */}
            <rect x="4" y="4" width="122" height="40" rx="2" fill="#13101c" />

            {/* Left sidebar widgets */}
            <rect x="4" y="4" width="14" height="40" fill="#09090b" />
            <circle cx="11" cy="10" r="1.5" fill="#35D6FF" />
            <circle cx="11" cy="20" r="1.5" fill={SCENE_COLORS.textSecondary} />
            <circle cx="11" cy="30" r="1.5" fill={SCENE_COLORS.textSecondary} />

            {/* Navigation block (70% width) */}
            <rect x="20" y="6" width="68" height="36" rx="2" fill="rgba(53, 214, 255, 0.06)" stroke="rgba(53, 214, 255, 0.2)" strokeWidth={0.5} />
            {/* Map lines mockup */}
            <path d="M 22,24 L 86,24 M 40,6 L 40,40" fill="none" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={2} />
            <path d="M 40,30 L 40,24 L 70,24" fill="none" stroke="#35D6FF" strokeWidth={1.25} strokeLinecap="round" />
            <polygon points="70,24 66,22 66,26" fill="#35D6FF" />

            {/* Media player widget (30% width) */}
            <rect x="91" y="6" width="32" height="16" rx="2" fill="#181822" />
            <rect x="94" y="9" width="6" height="6" rx="1" fill="#35D6FF" opacity={0.6} />
            <line x1="103" y1="10" x2="118" y2="10" stroke={SCENE_COLORS.textPrimary} strokeWidth={0.75} />
            <line x1="103" y1="14" x2="114" y2="14" stroke={SCENE_COLORS.textSecondary} strokeWidth={0.5} />

            {/* Phone contact widget */}
            <rect x="91" y="24" width="32" height="18" rx="2" fill="#181822" />
            <circle cx="98" cy="33" r="2.5" fill="#35D6FF" opacity={0.6} />
            <line x1="104" y1="31" x2="118" y2="31" stroke={SCENE_COLORS.textPrimary} strokeWidth={0.75} />
            <line x1="104" y1="35" x2="114" y2="35" stroke={SCENE_COLORS.textSecondary} strokeWidth={0.5} />
          </g>
        )}
      </g>

      {/* Info status display panel */}
      <g transform="translate(480, 20)">
        <rect x="0" y="0" width="200" height="42" rx={6} fill="rgba(79, 107, 138, 0.05)" stroke="rgba(79, 107, 138, 0.15)" strokeWidth={1} />
        <text x="10" y="15" fill={SCENE_COLORS.textPrimary} fontSize={9} fontFamily="monospace" fontWeight="bold">WIRELESS PHONE PROJECTION</text>
        <text x="10" y="27" fill={screenActive ? "#35D6FF" : SCENE_COLORS.textSecondary} fontSize={8} fontFamily="monospace">
          PROJECTION: {screenActive ? "CARPLAY ACTIVE" : "SCANNING DEVICE"}
        </text>
        <text x="10" y="37" fill={SCENE_COLORS.textSecondary} fontSize={7} fontFamily="monospace">
          INTERFACE: WIRELESS LINK (NO CABLE)
        </text>
      </g>
    </svg>
  );
}
