"use client";

import { useState, useMemo } from "react";
import { getOwnerVoices, getDetailedReviews, getVariantsForModel } from "@/lib/data";
import type { OwnerVoice, DetailedReview } from "@/lib/types";

const SENTIMENT_COLOR: Record<OwnerVoice["sentiment"], string> = {
  positive: "var(--positive)",
  negative: "var(--negative)",
  mixed: "var(--warning)",
};

export default function OwnerVoicesPanel({
  modelId,
  showDisclaimer = true,
}: {
  modelId: string;
  showDisclaimer?: boolean;
}) {
  const summaryVoices = getOwnerVoices(modelId);
  const allReviews = useMemo(() => getDetailedReviews(modelId), [modelId]);
  const modelVariants = useMemo(() => getVariantsForModel(modelId), [modelId]);

  // States for filters & search
  const [selectedFuel, setSelectedFuel] = useState<string>("all");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(5);

  // Available fuel types for this car
  const supportedFuels = useMemo(() => {
    const fuels = modelVariants.map((v) => v.fuel);
    return Array.from(new Set(fuels));
  }, [modelVariants]);

  // Overall stats
  const stats = useMemo(() => {
    if (allReviews.length === 0) return null;
    const total = allReviews.length;
    const sumRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = (sumRating / total).toFixed(1);

    const posCount = allReviews.filter((r) => r.sentiment === "positive").length;
    const negCount = allReviews.filter((r) => r.sentiment === "negative").length;
    const mixCount = allReviews.filter((r) => r.sentiment === "mixed").length;

    const posPct = Math.round((posCount / total) * 100);
    const negPct = Math.round((negCount / total) * 100);
    const mixPct = 100 - posPct - negPct;

    const totalUpvotes = allReviews.reduce((sum, r) => sum + r.upvotes, 0);

    return {
      total,
      avgRating,
      posPct,
      negPct,
      mixPct,
      posCount,
      negCount,
      mixCount,
      totalUpvotes,
    };
  }, [allReviews]);

  // Filtered reviews list
  const filteredReviews = useMemo(() => {
    return allReviews.filter((r) => {
      const fuelMatch = selectedFuel === "all" || r.fuel === selectedFuel;
      const sentimentMatch = selectedSentiment === "all" || r.sentiment === selectedSentiment;
      
      const query = searchQuery.toLowerCase().trim();
      const textMatch =
        !query ||
        r.text.toLowerCase().includes(query) ||
        r.username.toLowerCase().includes(query) ||
        r.fuel.toLowerCase().includes(query) ||
        r.transmission.toLowerCase().includes(query) ||
        r.source.toLowerCase().includes(query);

      return fuelMatch && sentimentMatch && textMatch;
    });
  }, [allReviews, selectedFuel, selectedSentiment, searchQuery]);

  if (summaryVoices.length === 0) return null;

  // Render highlighted text for search matches
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index} className="bg-[#C84C31]/20 text-[#C84C31] font-semibold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="space-y-10 text-[#161616]">
      {/* 1. Summary Accordion/Grid (What Owners Say) */}
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#C84C31] uppercase font-bold">Consensus Summary</span>
          <h2 className="text-3xl font-semibold tracking-tight mt-1">What owners say</h2>
          <p className="text-xs text-secondary mt-1">
            Aggregated themes from hundreds of discussions across Reddit, Team-BHP, and direct owner reports.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {summaryVoices.map((v) => (
            <div
              key={v.theme}
              className="p-5 rounded-2xl border border-[#161616]/10 bg-[#ECE7DF] flex flex-col justify-between"
            >
              <div>
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-3 border"
                  style={{
                    color: SENTIMENT_COLOR[v.sentiment],
                    borderColor: SENTIMENT_COLOR[v.sentiment],
                    background: `${SENTIMENT_COLOR[v.sentiment]}08`,
                  }}
                >
                  {v.theme}
                </span>
                <p className="text-sm leading-relaxed text-[#161616]/85 font-sans">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-[#161616]/10 w-full" />

      {/* 2. Detailed Interactive Review Database */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#C84C31] uppercase font-bold">Raw Voices</span>
            <h3 className="text-2xl font-semibold mt-1">Owner Review Database</h3>
            <p className="text-xs text-secondary mt-1">
              Read verified comments, check sentiment parameters, or filter by specific fuel variants.
            </p>
          </div>

          {stats && (
            <div className="flex items-center gap-6 bg-[#ECE7DF] px-5 py-3 rounded-2xl border border-[#161616]/10 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold font-display">{stats.avgRating}</p>
                <p className="text-[9px] font-mono uppercase tracking-wider text-secondary">Average rating</p>
              </div>
              <div className="h-8 w-[1px] bg-[#161616]/15" />
              <div className="text-center">
                <p className="text-2xl font-bold font-display">{stats.total}</p>
                <p className="text-[9px] font-mono uppercase tracking-wider text-secondary">Total reviews</p>
              </div>
              <div className="h-8 w-[1px] bg-[#161616]/15" />
              <div className="w-28 space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-secondary">
                  <span>POS {stats.posPct}%</span>
                  <span>NEG {stats.negPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#161616]/10 rounded-full overflow-hidden flex">
                  <div className="bg-[#2d6a4f] h-full" style={{ width: `${stats.posPct}%` }} />
                  <div className="bg-[#d97706] h-full" style={{ width: `${stats.mixPct}%` }} />
                  <div className="bg-[#C84C31] h-full" style={{ width: `${stats.negPct}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-4 bg-[#ECE7DF]/50 p-4 rounded-2xl border border-[#161616]/5">
          <div className="grid md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="md:col-span-1 relative flex items-center">
              <span className="absolute left-3 text-secondary/60">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM1 10a9 9 0 1118 0 9 9 0 01-18 0z" />
                  <path d="M23 23l-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search reviews (e.g. mileage, suspension)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(5); // reset pagination
                }}
                className="w-full bg-[#ECE7DF] pl-10 pr-4 py-2.5 rounded-xl border border-[#161616]/10 text-xs font-sans placeholder-secondary/50 focus:outline-none focus:border-[#C84C31] transition-colors"
              />
            </div>

            {/* Fuel type filters */}
            <div className="md:col-span-1 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono text-secondary mr-1.5">FUEL:</span>
              <button
                onClick={() => {
                  setSelectedFuel("all");
                  setVisibleCount(5);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors border ${
                  selectedFuel === "all"
                    ? "bg-[#C84C31] text-[#F5F1E8] border-[#C84C31]"
                    : "bg-[#ECE7DF] hover:bg-[#161616]/5 border-[#161616]/10"
                }`}
              >
                All
              </button>
              {supportedFuels.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setSelectedFuel(f);
                    setVisibleCount(5);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors border ${
                    selectedFuel === f
                      ? "bg-[#C84C31] text-[#F5F1E8] border-[#C84C31]"
                      : "bg-[#ECE7DF] hover:bg-[#161616]/5 border-[#161616]/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sentiment filters */}
            <div className="md:col-span-1 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono text-secondary mr-1.5">TONE:</span>
              <button
                onClick={() => {
                  setSelectedSentiment("all");
                  setVisibleCount(5);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors border ${
                  selectedSentiment === "all"
                    ? "bg-[#C84C31] text-[#F5F1E8] border-[#C84C31]"
                    : "bg-[#ECE7DF] hover:bg-[#161616]/5 border-[#161616]/10"
                }`}
              >
                All
              </button>
              {["positive", "mixed", "negative"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSentiment(s);
                    setVisibleCount(5);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors border ${
                    selectedSentiment === s
                      ? "bg-[#C84C31] text-[#F5F1E8] border-[#C84C31]"
                      : "bg-[#ECE7DF] hover:bg-[#161616]/5 border-[#161616]/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Match Count Info */}
        <p className="text-[10px] font-mono text-secondary">
          Showing {Math.min(filteredReviews.length, visibleCount)} of {filteredReviews.length} matching reviews
        </p>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="p-8 text-center bg-[#ECE7DF]/35 border border-[#161616]/5 rounded-2xl">
              <p className="text-sm text-secondary">No reviews match your filter parameters.</p>
              <button
                onClick={() => {
                  setSelectedFuel("all");
                  setSelectedSentiment("all");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs text-[#C84C31] hover:underline font-medium"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredReviews.slice(0, visibleCount).map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl border border-[#161616]/10 bg-[#ECE7DF] hover:border-[#C84C31]/30 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Visual glow strip on hover */}
                <div className="absolute top-0 left-0 h-full w-[2px] bg-[#C84C31] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* User info, source & rating */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{rev.username}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                          rev.source === "Reddit"
                            ? "bg-[#FF4500]/10 text-[#FF4500]"
                            : rev.source === "Team-BHP"
                            ? "bg-[#2d6a4f]/10 text-[#2d6a4f]"
                            : "bg-[#4F6B8A]/10 text-[#4F6B8A]"
                        }`}
                      >
                        {rev.source}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {/* Rating stars */}
                      <span className="text-[#d97706] tracking-wide font-display text-sm">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                      <span className="text-secondary/70 font-mono text-[10px]">• {rev.date}</span>
                    </div>
                  </div>

                  {/* Badges for Fuel & Transmission + Upvotes */}
                  <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-start gap-2">
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-[#161616]/5 border border-[#161616]/10">
                        {rev.fuel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-[#161616]/5 border border-[#161616]/10">
                        {rev.transmission}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-secondary/80 flex items-center gap-1">
                      <span className="text-[#C84C31]">▲</span> {rev.upvotes}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="mt-4 text-sm leading-relaxed text-[#161616]/85 font-sans">
                  {renderHighlightedText(rev.text, searchQuery)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredReviews.length > visibleCount && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="px-6 py-3 border border-[#C84C31] text-[#C84C31] font-mono text-xs uppercase tracking-wider hover:bg-[#C84C31]/5 transition-colors rounded-xl font-bold"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>

      {showDisclaimer && (
        <p className="text-[10px] text-secondary/60 italic border-t border-[#161616]/10 pt-4">
          Paraphrased reviews and raw online comments collected from public automotive forums.
        </p>
      )}
    </div>
  );
}
