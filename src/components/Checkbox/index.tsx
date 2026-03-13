"use client";

import React from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckboxProps {
  /** Input name */
  name?: string;
  /** Input id (defaults to name) */
  id?: string;
  /** Label text next to the checkbox */
  label?: string;
  /** Whether checked */
  checked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Disable the checkbox */
  disabled?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Primary color override for checked state. Defaults to --dashboard-primary / #ff521d */
  primaryColor?: string;
  /** Additional className on the wrapper label */
  className?: string;
  /** Children rendered as label (takes precedence over label prop) */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

// Exact values from dashboard.eaigarcom.com LoginForm.tsx:
// h-4 w-4 (16px) rounded (4px)
// after:left-[3px] after:top-0 after:w-[6px] after:h-[10px] after:border-r-2 after:border-b-2 after:rotate-45
// Scaled proportionally for md (22px) and lg (28px)
const sizeConfig = {
  sm: { box: 16, radius: 4, icon: { w: 6, h: 10, left: 3, top: 0, border: 2 }, gap: 8, text: 13 },
  md: { box: 22, radius: 6, icon: { w: 8, h: 14, left: 4.5, top: 0, border: 2 }, gap: 10, text: 14 },
  lg: { box: 28, radius: 7, icon: { w: 10, h: 17, left: 6, top: 0, border: 2.5 }, gap: 12, text: 15 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Checkbox({
  name,
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  primaryColor,
  className,
  children,
}: CheckboxProps) {
  const inputId = id || name;
  const cfg = sizeConfig[size];
  const resolvedColor = primaryColor || "var(--dashboard-primary, #37A501)";

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "inline-flex items-center cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      style={{ gap: cfg.gap }}
    >
      {/* Hidden native input for form submission & accessibility */}
      <input
        type="checkbox"
        id={inputId}
        name={name}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />

      {/* Custom checkbox box */}
      <span
        className="relative shrink-0 transition-all duration-200"
        style={{
          width: cfg.box,
          height: cfg.box,
          borderRadius: cfg.radius,
          backgroundColor: checked ? resolvedColor : "transparent",
          border: checked
            ? `2px solid ${resolvedColor}`
            : "2px solid rgba(45,45,45,0.2)",
          boxShadow: checked
            ? `0 1px 3px color-mix(in srgb, ${resolvedColor} 25%, transparent)`
            : "none",
        }}
        aria-hidden="true"
      >
        {/* Checkmark — CSS-only via rotated border trick */}
        <span
          className="absolute transition-opacity duration-150"
          style={{
            opacity: checked ? 1 : 0,
            left: cfg.icon.left,
            top: cfg.icon.top,
            width: cfg.icon.w,
            height: cfg.icon.h,
            borderRight: `${cfg.icon.border}px solid #fff`,
            borderBottom: `${cfg.icon.border}px solid #fff`,
            transform: "rotate(45deg)",
          }}
        />
      </span>

      {/* Label text */}
      {(children || label) && (
        <span
          className="leading-none"
          style={{
            fontSize: cfg.text,
            color: "var(--dashboard-text-primary, #2d2d2d)",
          }}
        >
          {children || label}
        </span>
      )}
    </label>
  );
}
