"use client";

import dynamic from "next/dynamic";
import useWebGLSupport from "./useWebGLSupport";

const DriveMode = dynamic(() => import("./DriveMode"), {
  ssr: false,
  loading: () => <div className="glass h-80 animate-pulse" />,
});

export default function DriveModeGate({ initialVariant }: { initialVariant?: string }) {
  const webgl = useWebGLSupport();
  if (webgl === false) {
    return (
      <div className="glass p-10 text-secondary text-sm">
        Test Drive needs WebGL, which this device or setting (reduced motion) doesn&apos;t allow.
        The Simulation Lab&apos;s 2D mode covers the same physics.
      </div>
    );
  }
  if (webgl === null) return <div className="glass h-80 animate-pulse" />;
  return <DriveMode initialVariant={initialVariant} />;
}
