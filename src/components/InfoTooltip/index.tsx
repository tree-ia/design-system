"use client";

import React, { ReactNode } from "react";
import { Tooltip } from "../Tooltip";

export interface InfoTooltipProps {
  /** The explanation text shown on hover */
  content: ReactNode;
  /** Optional short label (term/acronym) rendered bold before the explanation */
  term?: string;
  /** Icon size in pixels. Default: 14 */
  size?: number;
  /** Tooltip position. Default: "top" */
  position?: "top" | "bottom" | "left" | "right";
  /** Max width of the tooltip popup. Default: 280 */
  maxWidth?: number;
  /** Additional CSS classes for the icon wrapper */
  className?: string;
}

export function InfoTooltip({
  content,
  term,
  size = 14,
  position = "top",
  maxWidth = 280,
  className,
}: InfoTooltipProps) {
  const tooltipContent = term ? (
    <span className="text-xs leading-relaxed">
      <strong>{term}</strong> — {content}
    </span>
  ) : (
    <span className="text-xs leading-relaxed">{content}</span>
  );

  return (
    <Tooltip content={tooltipContent} position={position} maxWidth={maxWidth}>
      <button
        type="button"
        tabIndex={0}
        aria-label={term ? `Informacao sobre ${term}` : "Mais informacoes"}
        className={[
          "inline-flex items-center justify-center rounded-full",
          "text-[var(--dashboard-text-secondary,#6b7280)]",
          "hover:text-[var(--dashboard-text-primary,#2d2d2d)]",
          "hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10",
          "transition-colors duration-150 cursor-help",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dashboard-primary,#2563EB)]/40",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ width: size + 6, height: size + 6 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>
    </Tooltip>
  );
}
