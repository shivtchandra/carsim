import React from "react";

export default function CompactPageHeader({
  label,
  title,
  description,
  className = "",
}: {
  label?: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`pt-24 sm:pt-36 pb-10 sm:pb-16 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {label && <p className="section-label mb-3 sm:mb-4">{label}</p>}
        <h1
          className="page-header-title font-display mb-3 sm:mb-4 leading-tight"
          style={{ fontSize: "clamp(1.75rem, 5vw, 4rem)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="page-header-description max-w-xl leading-relaxed text-sm sm:text-base">{description}</p>
        )}
      </div>
    </div>
  );
}
