"use client";

import React from "react";
import BlueprintLayer from "./BlueprintLayer";
import RoadCurves from "./RoadCurves";
import SpotlightLayer, { AtmosphereMood } from "./SpotlightLayer";
import NoiseLayer from "./NoiseLayer";

interface AutomotiveAtmosphereProps {
  mood?: AtmosphereMood;
}

export function AutomotiveAtmosphere({ mood = "hero" }: AutomotiveAtmosphereProps) {
  return (
    <>
      <BlueprintLayer mood={mood} />
      <RoadCurves mood={mood} />
      <SpotlightLayer mood={mood} />
      <NoiseLayer />
    </>
  );
}
