"use client";

function Meter({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-secondary">{label}</span>
        <span className="font-mono text-[var(--accent)]">{score}/10</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function ValueScore({
  practicalScore,
  experienceScore,
  ownershipImpact,
}: {
  practicalScore: number;
  experienceScore: number;
  ownershipImpact: 1 | 2 | 3;
}) {
  return (
    <div className="space-y-4">
      <Meter label="Practical" score={practicalScore} />
      <Meter label="Experience" score={experienceScore} />
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-secondary">Ownership impact</span>
        <span className="text-warning text-sm tracking-widest">
          {"★".repeat(ownershipImpact)}
          <span className="text-white/20">{"★".repeat(3 - ownershipImpact)}</span>
        </span>
      </div>
    </div>
  );
}
