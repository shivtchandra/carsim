"use client";

import { variants, models, getModel, formatLakh } from "@/lib/data";

export default function VariantSelect({
  value,
  onChange,
  label,
  allowNone = false,
  includeVariant,
}: {
  value: string;
  onChange: (id: string) => void;
  label: string;
  allowNone?: boolean;
  includeVariant?: (id: string) => boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="text-secondary text-xs">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1.5 px-3 py-2.5 bg-[#F4F0E8] text-sm text-[#161616] border border-[#161616]/15 rounded-xl outline-none hover:border-[#161616]/30 focus:border-[#C84C31] transition-colors [&>option]:bg-[#ECE7DF] cursor-pointer"
      >
        {allowNone && <option value="">— none —</option>}
        {models.map((m) => (
          <optgroup key={m.id} label={m.name}>
            {variants
              .filter((v) => v.modelId === m.id && (includeVariant ? includeVariant(v.id) : true))
              .map((v) => (
                <option key={v.id} value={v.id}>
                  {getModel(v.modelId)?.name} {v.name} · {formatLakh(v.priceExShowroom)}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
