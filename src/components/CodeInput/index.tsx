"use client";

import React, { useRef, useCallback, KeyboardEvent, ClipboardEvent } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CodeInputProps {
  /** Number of digit boxes (defaults to 6) */
  length?: number;
  /** Current value as a string (e.g. "12" for the first two digits filled) */
  value: string;
  /** Called with the full string whenever a digit changes */
  onChange: (value: string) => void;
  /** Disable all inputs */
  disabled?: boolean;
  /** Show error styling */
  error?: boolean;
  /** Primary / accent color for focused box border */
  primaryColor?: string;
  /** Additional className on the container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CodeInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  primaryColor,
  className = "",
}: CodeInputProps) {
  const resolvedColor = primaryColor || "var(--dashboard-primary, #ff521d)";
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const focusInput = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, length - 1));
      inputsRef.current[clamped]?.focus();
    },
    [length],
  );

  const updateValue = useCallback(
    (idx: number, digit: string) => {
      const arr = value.split("").concat(Array(length).fill("")).slice(0, length);
      arr[idx] = digit;
      // Trim trailing empty strings
      const newVal = arr.join("").replace(/\s+$/g, "");
      onChange(newVal);
    },
    [value, length, onChange],
  );

  const handleInput = useCallback(
    (idx: number, char: string) => {
      if (!/^\d$/.test(char)) return;
      updateValue(idx, char);
      if (idx < length - 1) {
        focusInput(idx + 1);
      }
    },
    [updateValue, focusInput, length],
  );

  const handleKeyDown = useCallback(
    (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (digits[idx] && digits[idx] !== "") {
          updateValue(idx, "");
        } else if (idx > 0) {
          updateValue(idx - 1, "");
          focusInput(idx - 1);
        }
      } else if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        focusInput(idx - 1);
      } else if (e.key === "ArrowRight" && idx < length - 1) {
        e.preventDefault();
        focusInput(idx + 1);
      }
    },
    [digits, updateValue, focusInput, length],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (pasted.length > 0) {
        onChange(pasted);
        focusInput(Math.min(pasted.length, length - 1));
      }
    },
    [length, onChange, focusInput],
  );

  return (
    <div className={`flex justify-center gap-2 sm:gap-3 ${className}`}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { inputsRef.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digits[idx] || ""}
          onChange={(e) => {
            const char = e.target.value.slice(-1);
            handleInput(idx, char);
          }}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          onFocus={(e) => {
            e.target.select();
            e.target.style.borderColor = resolvedColor;
            e.target.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${resolvedColor} 20%, transparent)`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "";
            e.target.style.boxShadow = "";
          }}
          className="w-10 h-11 sm:w-11 sm:h-12 text-center text-lg sm:text-xl font-bold rounded-lg border-2 bg-transparent text-[#2d2d2d] transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: error
              ? "var(--dashboard-status-danger, #EF4444)"
              : "rgba(45,45,45,0.2)",
          }}
        />
      ))}
    </div>
  );
}
