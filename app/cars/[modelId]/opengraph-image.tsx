import { ImageResponse } from "next/og";
import { getBrand, getModel, getVariantsForModel, formatLakh, models } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return models.map((m) => ({ modelId: m.id }));
}

export default async function OgImage({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  const m = getModel(modelId);
  const brand = m && getBrand(m.brandId);
  const variants = m ? getVariantsForModel(m.id) : [];
  const topPs = variants.length ? Math.max(...variants.map((v) => v.engine.ps)) : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0A0A0B 60%, #1a1a1f 100%)",
          color: "#F5F5F4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#A1A1AA" }}>
          Drive<span style={{ color: "#E8590C" }}>Scope</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#A1A1AA" }}>{brand?.name ?? ""}</div>
          <div style={{ fontSize: 88, fontWeight: 700 }}>{m?.name ?? "DriveScope"}</div>
          <div style={{ fontSize: 32, color: "#A1A1AA", marginTop: 12 }}>
            {m ? `${formatLakh(m.priceRange.min)}–${formatLakh(m.priceRange.max)} · ${topPs} PS · ${variants.length} petrol variants` : ""}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#E8590C" }}>
          Understand your next car before you buy it
        </div>
      </div>
    ),
    size
  );
}
