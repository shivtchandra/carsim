import React from "react";
import { IndianRupee, Fuel, Wrench, Shield, TrendingUp } from "lucide-react";

export interface LifecyclePhase {
  number: string;
  title: string;
  subtitle: string;
  body: string;
  accent: string;
  icon: React.ReactNode;
  structuralGraphic: string;
  environment: string;
  detail: React.ReactNode;
}

export const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    number: "01",
    title: "Purchase Cost",
    subtitle: "Ex-showroom + on-road taxes",
    body: "The sticker price is just the start. RTO registration, comprehensive insurance, TCS, and dealer handling charges add 15–20% on top. We show both so you're never surprised at the dealership.",
    accent: "#35D6FF",
    icon: <IndianRupee className="w-5 h-5" />,
    structuralGraphic: "PURCHASE BRIEFING",
    environment: "dealership",
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-4 font-geist relative overflow-hidden">
        <div className="absolute -right-4 -top-2 rotate-12 bg-[#35D6FF]/10 border border-[#35D6FF]/20 text-[#35D6FF] text-[9px] px-2.5 py-0.5 rounded font-bold select-none uppercase tracking-widest">
          RTO APPROVED
        </div>
        <h4 className="text-[10px] tracking-wider text-[#35D6FF] uppercase font-bold">Purchase Bill of Quantities</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-secondary">Ex-Showroom Price</span>
            <span className="font-mono text-primary font-bold">100.0%</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-secondary">State RTO Road Tax</span>
            <span className="font-mono text-[#35D6FF] font-bold">+ 12.5% avg</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-secondary">Comprehensive Insurance</span>
            <span className="font-mono text-primary">+ 3.2% avg</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-secondary">TCS Surcharge (&gt;10L)</span>
            <span className="font-mono text-primary">+ 1.0%</span>
          </div>
          <div className="flex justify-between font-bold pt-1 text-white">
            <span>Total Acquisition Load</span>
            <span className="font-mono text-[#35D6FF]">~ 116.7%</span>
          </div>
        </div>
        <div className="text-[9px] text-secondary/50 pt-2 border-t border-white/5 font-mono">
          INVOICE ID: DS-ACQ-9812 // STATE: TS
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Fuel Cost",
    subtitle: "Real running spend correction",
    body: "ARAI figures are tested in sterile lab environments. DriveScope applies city-traffic correction (×0.72) and uses your city's actual fuel price. Diesel vs petrol vs EV break-even calculated to the kilometre.",
    accent: "#D4A574",
    icon: <Fuel className="w-5 h-5" />,
    structuralGraphic: "RUNNING COST ANALYSIS",
    environment: "navigation",
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-3 font-geist relative overflow-hidden">
        <h4 className="text-[10px] tracking-wider text-[#D4A574] uppercase font-bold">Real-World Route Corrections</h4>
        <div className="h-24 w-full border border-white/5 bg-black/30 rounded-xl relative overflow-hidden p-2">
          <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
            <path d="M 10,70 Q 50,20 100,50 T 190,10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 10,70 Q 50,20 100,50 T 190,10" fill="none" stroke="#D4A574" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="10" cy="70" r="3.5" fill="#D4A574" />
            <circle cx="100" cy="50" r="3.5" fill="#D4A574" />
            <circle cx="190" cy="10" r="3.5" fill="#35D6FF" />
            <text x="35" y="32" fill="#D4A574" fontSize="5.5" fontWeight="bold">CITY RUN: -28% TRAFFIC PENALTY</text>
            <text x="120" y="24" fill="#4ade80" fontSize="5.5" fontWeight="bold">HWY CRUISE: +8% ECONOMY</text>
          </svg>
        </div>
        <div className="flex justify-between text-xs pt-1">
          <span className="text-secondary">ARAI Claimed FE</span>
          <span className="font-mono text-primary font-bold">20.1 km/l</span>
        </div>
        <div className="flex justify-between text-xs border-t border-white/5 pt-2">
          <span className="text-[#D4A574] font-semibold">DriveScope Model FE</span>
          <span className="font-mono text-[#D4A574] font-bold">14.5 km/l</span>
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
    structuralGraphic: "SERVICE LIFECYCLE",
    environment: "workshop",
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-3 font-geist relative overflow-hidden">
        <h4 className="text-[10px] tracking-wider text-[#6366f1] uppercase font-bold">Exploded Mechanical Damper</h4>
        <div className="h-24 w-full border border-white/5 bg-black/30 rounded-xl relative overflow-hidden p-1 flex items-center justify-center">
          <svg className="h-full w-40" viewBox="0 0 160 100">
            <g stroke="rgba(99, 102, 241, 0.6)" strokeWidth="0.75" fill="none">
              <path d="M 80,10 C 90,12 90,20 80,22 C 70,24 70,32 80,34 C 90,36 90,44 80,46 C 70,48 70,56 80,58 C 90,60 90,68 80,70" strokeWidth="1.25" />
              <line x1="80" y1="20" x2="80" y2="90" strokeWidth="1.5" />
              <rect x="75" y="70" width="10" height="20" rx="1" fill="rgba(99, 102, 241, 0.15)" />
              <line x1="92" y1="25" x2="125" y2="25" strokeDasharray="2 2" />
              <text x="128" y="27" fill="rgba(255,255,255,0.4)" fontSize="5" fontFamily="monospace">COIL SPRING</text>
              <line x1="68" y1="80" x2="35" y2="80" strokeDasharray="2 2" />
              <text x="10" y="82" fill="rgba(255,255,255,0.4)" fontSize="5" fontFamily="monospace">DAMPER SEAL</text>
            </g>
          </svg>
        </div>
        <div className="flex justify-between text-xs pt-1">
          <span className="text-secondary">Yearly Parts Wear Index</span>
          <span className="font-mono text-primary font-bold">Base x 1.45</span>
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
    structuralGraphic: "RISK INTELLIGENCE",
    environment: "risk",
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-4 font-geist relative overflow-hidden">
        <h4 className="text-[10px] tracking-wider text-[#8b5cf6] uppercase font-bold">Insurance Risk Vector</h4>
        <div className="h-24 w-full border border-white/5 bg-black/30 rounded-xl relative overflow-hidden flex items-center justify-center p-2">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="0.5" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="0.5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="0.5" />
            <polygon points="50,15 78,50 50,75 25,50" fill="rgba(139, 92, 246, 0.12)" stroke="#8b5cf6" strokeWidth="1" />
            <text x="50" y="12" fill="#8b5cf6" fontSize="4.5" textAnchor="middle">OWN DAMAGE</text>
          </svg>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-secondary">IDV Depreciation Rate</span>
          <span className="font-mono text-[#8b5cf6] font-bold">-10% p.a.</span>
        </div>
      </div>
    ),
  },
  {
    number: "05",
    title: "Resale Value",
    subtitle: "Asset depreciation profile",
    body: "After 5 years, brand trust and segment demand drive residuals more than specifications. Maruti holds 60%+. Korean brands 50–55%. We factor this into the true cost of ownership.",
    accent: "#2EE6A8",
    icon: <TrendingUp className="w-5 h-5" />,
    structuralGraphic: "VALUE RETENTION INDEX",
    environment: "market",
    detail: (
      <div className="border border-white/5 bg-white/[0.02] p-5 rounded-2xl space-y-4 font-geist relative overflow-hidden">
        <h4 className="text-[10px] tracking-wider text-[#2EE6A8] uppercase font-bold">Residual Retention Curves</h4>
        <div className="h-24 w-full border border-white/5 bg-black/30 rounded-xl relative overflow-hidden p-2 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 160 80">
            <line x1="10" y1="10" x2="150" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="10" y1="40" x2="150" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1="10" y1="70" x2="150" y2="70" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <path d="M 10,10 C 50,15 100,20 150,28" fill="none" stroke="#2EE6A8" strokeWidth="1.5" />
            <text x="125" y="24" fill="#2EE6A8" fontSize="5.5" fontWeight="bold">MARUTI/TOY: 62%</text>
            <path d="M 10,10 C 40,30 90,50 150,58" fill="none" stroke="#f87171" strokeWidth="1" strokeDasharray="2 1" />
            <text x="125" y="54" fill="#f87171" fontSize="5.5" fontWeight="bold">EUR LUX: 44%</text>
            <text x="12" y="77" fill="rgba(255,255,255,0.4)" fontSize="4.5">YR 0</text>
            <text x="142" y="77" fill="rgba(255,255,255,0.4)" fontSize="4.5">YR 5</text>
          </svg>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-secondary">5-Yr Avg Segment Yield</span>
          <span className="font-mono text-primary font-bold">54.2%</span>
        </div>
      </div>
    ),
  },
];
