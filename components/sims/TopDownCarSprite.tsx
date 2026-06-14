import type { VehicleDNA } from "@/lib/vehicle-dna/types";
import { getTopDownSpriteSize, TOP_DOWN_CAR_ASSETS } from "@/lib/carTopDownAssets";

function has(sig: VehicleDNA["signatureElements"], el: string) {
  return sig.includes(el as never);
}

/** Procedural top-down silhouette when no custom PNG exists yet. */
function ProceduralTopDown({
  color,
  dna,
  lengthMm,
  widthMm,
}: {
  color: string;
  dna?: VehicleDNA;
  lengthMm: number;
  widthMm: number;
}) {
  const { width: carW, height: carH } = getTopDownSpriteSize(lengthMm, widthMm);
  const halfW = carW / 2;
  const halfH = carH / 2;
  const sig = dna?.signatureElements ?? [];
  const isSedan = dna?.bodyStyle === "sedan";
  const boxy = dna?.proportions.boxiness ?? 0.15;
  const offroad = has(sig, "boxy-profile") || boxy > 0.6;
  const rx = offroad ? 2 : isSedan ? 4 : 5;

  const wheelW = carW * 0.14;
  const wheelH = carH * 0.22;
  const wheelInset = carW * 0.12;

  return (
    <>
      {/* Body */}
      <rect
        x={-halfW}
        y={-halfH}
        width={carW}
        height={carH}
        rx={rx}
        fill={color}
        opacity={0.92}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={0.6}
      />
      {/* Windshield */}
      <rect
        x={halfW - carW * 0.28}
        y={-halfH + carH * 0.18}
        width={carW * 0.22}
        height={carH * 0.64}
        rx={1.5}
        fill="rgba(79,107,138,0.35)"
      />
      {/* Rear glass */}
      <rect
        x={-halfW + carW * 0.08}
        y={-halfH + carH * 0.22}
        width={carW * 0.16}
        height={carH * 0.56}
        rx={1}
        fill="rgba(79,107,138,0.25)"
      />
      {/* Roof rails */}
      {has(sig, "roof-rails") && !offroad && (
        <line
          x1={-halfW + carW * 0.22}
          y1={0}
          x2={halfW - carW * 0.22}
          y2={0}
          stroke="rgba(22,22,22,0.45)"
          strokeWidth={1.2}
        />
      )}
      {/* Wheels */}
      {[
        [halfW - wheelInset - wheelW / 2, -halfH + 1],
        [halfW - wheelInset - wheelW / 2, halfH - wheelH - 1],
        [-halfW + wheelInset - wheelW / 2, -halfH + 1],
        [-halfW + wheelInset - wheelW / 2, halfH - wheelH - 1],
      ].map(([wx, wy], i) => (
        <rect
          key={i}
          x={wx}
          y={wy}
          width={wheelW}
          height={wheelH}
          rx={1}
          fill="#0A0A0B"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={0.5}
        />
      ))}
      {/* Headlamp hint (front = +x in top-down, car faces right in sim) */}
      {has(sig, "split-headlamp") || has(sig, "star-map-drl") ? (
        <>
          <rect x={halfW - 2} y={-halfH * 0.45} width={2} height={3} rx={0.5} fill="#FBBF24" opacity={0.9} />
          <rect x={halfW - 2} y={halfH * 0.45 - 3} width={2} height={3} rx={0.5} fill="#FBBF24" opacity={0.9} />
        </>
      ) : (
        <>
          <circle cx={halfW - 1} cy={-halfH * 0.35} r={1.2} fill="#FBBF24" opacity={0.85} />
          <circle cx={halfW - 1} cy={halfH * 0.35} r={1.2} fill="#FBBF24" opacity={0.85} />
        </>
      )}
    </>
  );
}

/**
 * Top-down car sprite for City Simulator.
 * Uses a custom PNG when available (Creta), otherwise DNA-proportioned SVG.
 */
export default function TopDownCarSprite({
  modelId,
  color,
  dna,
  lengthMm,
  widthMm,
}: {
  modelId: string;
  color: string;
  dna?: VehicleDNA;
  lengthMm: number;
  widthMm: number;
}) {
  const asset = TOP_DOWN_CAR_ASSETS[modelId];
  const { width, height } = getTopDownSpriteSize(lengthMm, widthMm);

  if (asset) {
    return (
      <image
        href={asset}
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        style={{ mixBlendMode: "screen" }}
      />
    );
  }

  return <ProceduralTopDown color={color} dna={dna} lengthMm={lengthMm} widthMm={widthMm} />;
}
