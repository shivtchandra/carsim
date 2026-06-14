"use client";

import dynamic from "next/dynamic";
import useWebGLSupport from "./useWebGLSupport";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false, loading: () => null });

/** Mounts the 3D hero scene over the CSS gradient when WebGL is available; otherwise nothing (gradient stays). */
export default function HomeHeroVisual() {
  const webgl = useWebGLSupport();
  if (!webgl) return null;
  return <Hero3D />;
}
