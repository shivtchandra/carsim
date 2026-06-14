"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const RATE = 0.085; // 8.5% p.a. — standard Indian car loan rate

function calcEmi(principal: number, years: number): number {
  const r = RATE / 12;
  const n = years * 12;
  if (principal <= 0) return 0;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function formatLakh(v: number) {
  return `₹${(v / 100_000).toFixed(1)}L`;
}

export default function EmiTeaser() {
  const [budget, setBudget] = useState(1500000); // 15L
  const [down, setDown] = useState(20); // 20%
  const [tenure, setTenure] = useState(5); // years

  const principal = useMemo(() => budget * (1 - down / 100), [budget, down]);
  const emi = useMemo(() => calcEmi(principal, tenure), [principal, tenure]);
  const totalInterest = useMemo(() => emi * tenure * 12 - principal, [emi, principal, tenure]);

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Inputs */}
      <div className="space-y-7">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-secondary">Budget</span>
            <span className="font-medium stat-num">{formatLakh(budget)}</span>
          </div>
          <input
            type="range" min={500000} max={5000000} step={50000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-secondary mt-1">
            <span>₹5L</span><span>₹50L</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-secondary">Down Payment</span>
            <span className="font-medium stat-num">{down}% · {formatLakh(budget * down / 100)}</span>
          </div>
          <input
            type="range" min={10} max={50} step={5}
            value={down}
            onChange={(e) => setDown(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-secondary mt-1">
            <span>10%</span><span>50%</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-secondary">Loan Tenure</span>
            <span className="font-medium stat-num">{tenure} years</span>
          </div>
          <input
            type="range" min={1} max={7} step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs text-secondary mt-1">
            <span>1 yr</span><span>7 yrs</span>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="space-y-4">
        <div className="glass p-6">
          <p className="text-xs text-secondary mb-1">Monthly EMI</p>
          <p className="text-4xl font-semibold stat-num" style={{ color: "var(--accent)" }}>
            ₹{Math.round(emi).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-secondary mt-1">at 8.5% p.a. · {tenure}yr tenure</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass p-4">
            <p className="text-xs text-secondary mb-0.5">Loan Amount</p>
            <p className="font-semibold stat-num">{formatLakh(principal)}</p>
          </div>
          <div className="glass p-4">
            <p className="text-xs text-secondary mb-0.5">Total Interest</p>
            <p className="font-semibold stat-num text-warning">{formatLakh(totalInterest)}</p>
          </div>
          <div className="glass p-4">
            <p className="text-xs text-secondary mb-0.5">Total Payout</p>
            <p className="font-semibold stat-num">{formatLakh(emi * tenure * 12 + budget * down / 100)}</p>
          </div>
          <div className="glass p-4">
            <p className="text-xs text-secondary mb-0.5">Break-even km</p>
            <p className="font-semibold stat-num">~{Math.round(budget / 7).toLocaleString("en-IN")}</p>
          </div>
        </div>

        <Link
          href={`/cost`}
          className="btn-accent block text-center text-sm"
        >
          Full 5-year cost simulation →
        </Link>
      </div>
    </div>
  );
}
