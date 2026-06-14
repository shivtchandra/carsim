"use client";

import React from "react";
import { IndianRupee, Fuel, Wrench, Shield, TrendingUp } from "lucide-react";

const CARDS = [
  {
    number: "01",
    title: "Purchase Cost",
    subtitle: "Ex-showroom + on-road taxes",
    body: "The sticker price is just the start. RTO registration, comprehensive insurance, TCS, and dealer handling charges add 15–20% on top. We show both so you're never surprised at the dealership.",
    accent: "#2563eb",
    icon: <IndianRupee className="w-5 h-5" />,
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-4">
        <h4 className="font-geist text-[10px] tracking-wider text-[#2563eb] uppercase">Purchase Breakout</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-secondary">Ex-Showroom Base</span>
            <span className="font-mono text-primary">100%</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-secondary">RTO Road Tax (State Avg)</span>
            <span className="font-mono text-[#2563eb]">+ 8.0% – 15.0%</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-secondary">1-Yr Own Damage + 3-Yr TP</span>
            <span className="font-mono text-primary">+ 2.8% – 3.5%</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-secondary">TCS (If &gt; ₹10 Lakhs)</span>
            <span className="font-mono text-primary">+ 1.0%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Dealer Dep / Fastag / Misc</span>
            <span className="font-mono text-primary">+ ₹15,000</span>
          </div>
        </div>
        <p className="text-[10px] text-secondary leading-normal">
          *Diesel vehicles face a 2% surcharge in selected states.
        </p>
      </div>
    ),
  },
  {
    number: "02",
    title: "Fuel Cost",
    subtitle: "Real running spend correction",
    body: "ARAI figures are tested in sterile lab environments. DriveScope applies city-traffic correction (×0.72) and uses your city's actual fuel price. Diesel vs petrol vs EV break-even calculated to the kilometre.",
    accent: "#FF6A00",
    icon: <Fuel className="w-5 h-5" />,
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-4">
        <h4 className="font-geist text-[10px] tracking-wider text-[#FF6A00] uppercase">Traffic Corrected FE</h4>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="border border-white/5 p-3 rounded-xl">
            <p className="text-[10px] text-secondary">Brochure FE</p>
            <p className="text-xl font-semibold stat-num mt-1">20.1 <span className="text-xs">km/l</span></p>
          </div>
          <div className="border border-white/5 p-3 rounded-xl bg-[#FF6A00]/5">
            <p className="text-[10px] text-secondary">Real-World FE</p>
            <p className="text-xl font-semibold stat-num mt-1 text-[#FF6A00]">14.5 <span className="text-xs">km/l</span></p>
          </div>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-secondary">Applied City Traffic Penalty</span>
            <span className="font-mono text-[#FF6A00]">-28%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Highway Correction</span>
            <span className="font-mono text-[#4ade80]">-8%</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Maintenance",
    subtitle: "Brand-specific cost scaling",
    body: "Service costs vary wildly by brand heritage. Japanese/Korean cars average ₹8K/service; European brands can hit ₹25K. We model annual costs based on historical parts pricing and labor indexes.",
    accent: "#6366f1",
    icon: <Wrench className="w-5 h-5" />,
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-4">
        <h4 className="font-geist text-[10px] tracking-wider text-[#6366f1] uppercase">5-Yr Maintenance Scaling</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-secondary">Year 1-2 (Free Service)</span>
            <span className="font-mono text-primary">₹6,000 /yr</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Year 3 (First Paid)</span>
            <span className="font-mono text-primary">₹9,500 /yr</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Year 4 (Suspension/Fluid)</span>
            <span className="font-mono text-[#6366f1]">₹14,000 /yr</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Year 5 (Major Service)</span>
            <span className="font-mono text-primary">₹18,500 /yr</span>
          </div>
        </div>
        <div className="border-t border-white/5 pt-2 flex justify-between text-xs font-semibold">
          <span>Estimated 5-Yr Cumulative</span>
          <span className="font-mono text-[#6366f1]">~ ₹54,000</span>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Insurance",
    subtitle: "IDV decay and risk curves",
    body: "First-year comprehensive runs 2.5–3.5% of IDV. Your premium drops as the car depreciates — but your out-of-pocket risk rises. We track both curves side by side over 5 years.",
    accent: "#8b5cf6",
    icon: <Shield className="w-5 h-5" />,
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-4">
        <h4 className="font-geist text-[10px] tracking-wider text-[#8b5cf6] uppercase">Insured Value Depreciation</h4>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-secondary">Year 1 Value (IDV)</span>
            <span className="font-mono text-primary">100% ex-showroom</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Year 2 Value (IDV)</span>
            <span className="font-mono text-secondary">80% ex-showroom</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Year 3 Value (IDV)</span>
            <span className="font-mono text-secondary">70% ex-showroom</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Year 5 Value (IDV)</span>
            <span className="font-mono text-[#8b5cf6]">50% ex-showroom</span>
          </div>
        </div>
        <p className="text-[10px] text-secondary leading-normal">
          *Comprehensive premiums decrease ~15% annually if No Claim Bonus (NCB) is maintained.
        </p>
      </div>
    ),
  },
  {
    number: "05",
    title: "Resale Value",
    subtitle: "Asset depreciation profile",
    body: "After 5 years, brand trust and segment demand drive residuals more than specifications. Maruti holds 60%+. Korean brands 50–55%. We factor this into the true cost of ownership.",
    accent: "#4ade80",
    icon: <TrendingUp className="w-5 h-5" />,
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-4">
        <h4 className="font-geist text-[10px] tracking-wider text-[#4ade80] uppercase">5-Yr Retention Indices</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-secondary">Sub-4m SUVs (Maruti/Tata)</span>
            <span className="font-mono text-[#4ade80]">60% – 65%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Midsize SUVs (Hyundai/Kia)</span>
            <span className="font-mono text-primary">52% – 58%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Premium Sedans (Honda/Skoda)</span>
            <span className="font-mono text-primary">45% – 50%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">EV Hatchbacks / SUVs</span>
            <span className="font-mono text-secondary">38% – 44%</span>
          </div>
        </div>
        <p className="text-[10px] text-secondary leading-normal">
          *EVs experience higher 5-yr depreciation due to battery degradation concerns.
        </p>
      </div>
    ),
  },
];

export default function OwnershipJourney() {
  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-10 pb-12">
      {CARDS.map((card, i) => (
        <div
          key={card.number}
          className="sticky rounded-[32px] border border-white/10 p-8 sm:p-10 transition-all duration-300"
          style={{
            top: `${96 + i * 20}px`,
            zIndex: (i + 1) * 10,
            backgroundColor: "#0d1424", // solid dark navy core to block card below it
            backgroundImage: "radial-gradient(ellipse at bottom right, rgba(37,99,235,0.06) 0%, transparent 60%)",
            boxShadow: "0 -20px 40px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="grid md:grid-cols-5 gap-8 items-start">
            
            {/* Main description details */}
            <div className="md:col-span-3 space-y-6">
              
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                  style={{
                    backgroundColor: `${card.accent}12`,
                    border: `1px solid ${card.accent}33`,
                    color: card.accent,
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="font-geist text-[10px] tracking-widest uppercase" style={{ color: card.accent }}>
                    Phase {card.number}
                  </p>
                  <h3 className="font-display text-3xl font-semibold leading-tight">{card.title}</h3>
                </div>
              </div>

              <p className="font-geist text-xs text-secondary/80 leading-relaxed uppercase tracking-wider">
                {card.subtitle}
              </p>

              <p className="text-sm text-secondary/90 leading-relaxed font-sans">
                {card.body}
              </p>

            </div>

            {/* Technical visual panel */}
            <div className="md:col-span-2">
              {card.detail}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
