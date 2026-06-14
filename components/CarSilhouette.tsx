// Stylized side-view car silhouette — DNA-driven recognizability.
import type { VehicleDNA } from "@/lib/vehicle-dna/types";

function has(sig: VehicleDNA["signatureElements"], el: string) {
  return sig.includes(el as never);
}

export default function CarSilhouette({
  color,
  dna,
  className = "",
}: {
  color: string;
  dna?: VehicleDNA;
  className?: string;
}) {
  const sig = dna?.signatureElements ?? [];
  const boxy = dna?.proportions.boxiness ?? 0.15;
  const isSedan = dna?.bodyStyle === "sedan";
  const fastback = has(sig, "fastback-sedan");
  const offroad = has(sig, "boxy-profile") || boxy > 0.6;
  const roundLamps = has(sig, "round-headlamps");
  const gradId = `sheen-${color.replace("#", "")}`;

  return (
    <svg viewBox="0 0 200 80" className={className} aria-hidden role="img">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {isSedan ? (
        <>
          <rect x="12" y="38" width="176" height="22" rx={fastback ? 8 : 12} fill={`url(#${gradId})`} />
          {fastback ? (
            <path
              d="M 48 38 Q 58 18 95 16 L 130 16 Q 155 20 168 38 L 168 52 Q 155 48 130 46 L 95 46 Q 58 44 48 38 Z"
              fill={`url(#${gradId})`}
            />
          ) : (
            <path
              d="M 50 38 Q 62 16 92 15 L 132 15 Q 158 17 166 38 Z"
              fill={`url(#${gradId})`}
            />
          )}
          {!fastback && (
            <rect x="158" y="40" width="28" height="8" rx="3" fill={`url(#${gradId})`} opacity="0.9" />
          )}
        </>
      ) : offroad ? (
        <>
          <rect x="14" y="32" width="172" height="30" rx="4" fill={`url(#${gradId})`} />
          <rect x="48" y="18" width="104" height="22" rx="3" fill={`url(#${gradId})`} />
        </>
      ) : (
        <>
          <rect x="10" y="34" width="180" height="26" rx="12" fill={`url(#${gradId})`} />
          <path
            d="M 50 36 Q 62 16 92 15 L 132 15 Q 158 17 166 36 Z"
            fill={`url(#${gradId})`}
          />
        </>
      )}

      {/* Glass */}
      <path d="M 58 34 Q 67 21 90 20 L 104 20 L 104 34 Z" fill="rgba(245,241,232,0.18)" />
      <path d="M 110 20 L 130 20 Q 150 22 157 34 L 110 34 Z" fill="rgba(245,241,232,0.18)" />

      {/* Roof rails */}
      {has(sig, "roof-rails") && !offroad && (
        <line x1="70" y1="17" x2="150" y2="17" stroke="#1a1c22" strokeWidth="2.5" strokeLinecap="round" />
      )}

      {/* Wheels */}
      <circle cx="52" cy="60" r="13" fill="#0A0A0B" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
      <circle cx="150" cy="60" r="13" fill="#0A0A0B" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />

      {/* Front signature */}
      {roundLamps ? (
        <>
          <circle cx="188" cy="42" r="5" fill="#FBBF24" opacity="0.95" />
          <circle cx="188" cy="52" r="5" fill="#FBBF24" opacity="0.95" />
        </>
      ) : has(sig, "split-headlamp") || has(sig, "star-map-drl") ? (
        <>
          <rect x="184" y="36" width="5" height="5" rx="1" fill="#FBBF24" />
          <rect x="184" y="44" width="6" height="7" rx="1.5" fill="#fff8e8" />
        </>
      ) : (
        <rect x="184" y="38" width="6" height="6" rx="2" fill="#FBBF24" opacity="0.9" />
      )}

      {/* Grille hint */}
      {has(sig, "tiger-nose-grille") && (
        <path d="M 186 48 L 192 50 L 186 52 Z" fill="#1a1c22" />
      )}
      {has(sig, "parametric-grille") && (
        <rect x="185" y="47" width="4" height="6" rx="1" fill="#1a1c22" opacity="0.7" />
      )}

      <rect x="10" y="38" width="5" height="6" rx="2" fill="#F87171" opacity="0.8" />

      {dna?.displayName && (
        <text x="100" y="76" textAnchor="middle" fill="rgba(22,22,22,0.35)" fontSize="7" fontFamily="monospace">
          {dna.displayName}
        </text>
      )}
    </svg>
  );
}
