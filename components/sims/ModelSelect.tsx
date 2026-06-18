"use client";

import { useEffect, useState } from "react";
import { brands, models, getBrand, getModel } from "@/lib/data";
import DriveSelect from "@/components/ui/DriveSelect";

export default function ModelSelect({
  value,
  onChange,
  label,
  allowNone = false,
}: {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  allowNone?: boolean;
}) {
  const initialModel = value ? getModel(value) : null;
  const initialBrand = initialModel ? getBrand(initialModel.brandId) : null;

  const [brandId, setBrandId] = useState(initialBrand?.id ?? "");

  // Sync internal state if `value` changes from outside
  useEffect(() => {
    if (value === "") {
      setBrandId("");
    } else {
      const m = getModel(value);
      if (m) {
        setBrandId(m.brandId);
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

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="mb-0 block text-secondary text-xs">{label}</span>}
      <DriveSelect
        value={brandId}
        onChange={(b) => {
          setBrandId(b);
          if (b === "") onChange("");
        }}
        ariaLabel="Brand"
        options={brandOptions}
        className="w-full"
      />
      {brandId && (
        <DriveSelect
          value={value}
          onChange={onChange}
          ariaLabel="Model"
          options={modelOptions}
          className="w-full"
        />
      )}
    </div>
  );
}
