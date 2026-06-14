"use client";

import dynamic from "next/dynamic";
import useWebGLSupport from "../useWebGLSupport";
import type { RaceMode } from "./RaceView";

const RaceSetup = dynamic(() => import("./RaceSetup"), {
  ssr: false,
  loading: () => <div className="glass h-80 animate-pulse" />,
});

export default function RaceModeGate(props: {
  initialCar?: string;
  initialRivals?: string[];
  initialTrack?: string;
  initialMode?: RaceMode;
}) {
  const webgl = useWebGLSupport();
  if (webgl === false) {
    return (
      <div className="glass p-10 text-secondary text-sm">
        Race Mode needs WebGL, which this device or setting (reduced motion) doesn&apos;t allow.
        The Simulation Lab&apos;s 2D mode covers the same physics.
      </div>
    );
  }
  if (webgl === null) return <div className="glass h-80 animate-pulse" />;
  return <RaceSetup {...props} />;
}
