"use client";

import type { ResolvedContext } from "@/lib/understanding";

export default function ContextBrief({ context }: { context: ResolvedContext }) {
  return (
    <div className="space-y-4">
      {context.frequency && (
        <p className="text-sm text-[var(--accent)] font-medium">{context.frequency}</p>
      )}
      <div>
        <h4 className="text-xs uppercase tracking-widest text-secondary mb-2">Useful if</h4>
        <ul className="space-y-1.5">
          {context.usefulIf.map((item, i) => (
            <li key={i} className="text-sm flex gap-2">
              <span className="text-[var(--accent)] shrink-0">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      {context.notUsefulIf.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-widest text-secondary mb-2">Less critical if</h4>
          <ul className="space-y-1.5">
            {context.notUsefulIf.map((item, i) => (
              <li key={i} className="text-sm flex gap-2 text-secondary">
                <span className="shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
