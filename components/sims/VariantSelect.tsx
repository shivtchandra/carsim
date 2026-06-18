"use client";

import { useEffect, useState } from "react";
import { brands, models, variants, getBrand, getModel, getVariant, formatLakh } from "@/lib/data";
import DriveSelect from "@/components/ui/DriveSelect";

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
  const initialVariant = value ? getVariant(value) : null;
  const initialModel = initialVariant ? getModel(initialVariant.modelId) : null;
  const initialBrand = initialModel ? getBrand(initialModel.brandId) : null;

  const [brandId, setBrandId] = useState(initialBrand?.id ?? "");
  const [modelId, setModelId] = useState(initialModel?.id ?? "");

  // Sync internal state if `value` changes from outside
  useEffect(() => {
    if (value === "") {
      setBrandId("");
      setModelId("");
    } else {
      const v = getVariant(value);
      if (v) {
        const m = getModel(v.modelId);
        if (m) {
          setBrandId(m.brandId);
          setModelId(m.id);
        }
      }
    }
  }, [value]);

  const brandOptions = [
    ...(allowNone ? [{ value: "", label: "— none —" }] : []),
    ...brands.map((b) => ({ value: b.id, label: b.name })),
  ];

  const modelOptions = [
    { value: "", label: "Select Car..." },
    ...models.filter((m) => m.brandId === brandId).map((m) => ({ value: m.id, label: m.name })),
  ];

  const variantOptions = [
    { value: "", label: "Select Variant..." },
    ...variants
      .filter((v) => v.modelId === modelId && (includeVariant ? includeVariant(v.id) : true))
      .map((v) => ({
        value: v.id,
        label: `${v.name} (${v.fuel}) · ${formatLakh(v.priceExShowroom)}`,
      })),
  ];

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="mb-0 block text-secondary text-xs">{label}</span>}
      <DriveSelect
        value={brandId}
        onChange={(b) => {
          setBrandId(b);
          setModelId("");
          if (b === "") onChange("");
        }}
        ariaLabel="Brand"
        options={brandOptions}
        className="w-full"
      />
      {brandId && (
        <DriveSelect
          value={modelId}
          onChange={(m) => {
            setModelId(m);
            if (m === "") onChange("");
          }}
          ariaLabel="Model"
          options={modelOptions}
          className="w-full"
        />
      )}
      {modelId && (
        <DriveSelect
          value={value}
          onChange={onChange}
          ariaLabel="Variant"
          options={variantOptions}
          className="w-full"
        />
      )}
    </div>
  );
}
