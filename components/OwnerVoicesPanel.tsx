import { getOwnerVoices } from "@/lib/data";
import type { OwnerVoice } from "@/lib/types";

const SENTIMENT_COLOR: Record<OwnerVoice["sentiment"], string> = {
  positive: "var(--positive)",
  negative: "var(--negative)",
  mixed: "var(--warning)",
};

/** "What owners say" — pre-written sentiment themes from owner reviews, per model. */
export default function OwnerVoicesPanel({
  modelId,
  showDisclaimer = true,
}: {
  modelId: string;
  showDisclaimer?: boolean;
}) {
  const voices = getOwnerVoices(modelId);
  if (voices.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">What owners say</h3>
      <ul className="space-y-3">
        {voices.map((v) => (
          <li key={v.theme} className="text-sm leading-relaxed">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium mr-2 border"
              style={{ color: SENTIMENT_COLOR[v.sentiment], borderColor: SENTIMENT_COLOR[v.sentiment] }}
            >
              {v.theme}
            </span>
            <span className="text-secondary">{v.text}</span>
          </li>
        ))}
      </ul>
      {showDisclaimer && (
        <p className="text-[11px] text-secondary/70 mt-4 italic">
          Paraphrased from common themes in owner reviews — not individual quotes.
        </p>
      )}
    </div>
  );
}
