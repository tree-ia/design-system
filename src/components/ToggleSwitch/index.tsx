import React from "react";

export interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

const sizeConfig = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-3 w-3",
    translateOn: "translate-x-5",
    translateOff: "translate-x-1",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-4 w-4",
    translateOn: "translate-x-6",
    translateOff: "translate-x-1",
  },
  lg: {
    track: "h-7 w-14",
    thumb: "h-5 w-5",
    translateOn: "translate-x-8",
    translateOff: "translate-x-1",
  },
};

export function ToggleSwitch({
  enabled,
  onChange,
  disabled = false,
  size = "md",
  label,
  className,
}: ToggleSwitchProps) {
  const config = sizeConfig[size];

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--dashboard-primary,#37a501)]",
          config.track,
          enabled
            ? "bg-[var(--dashboard-primary,#37a501)]"
            : "bg-[var(--dashboard-text-secondary,#6b7280)]/30",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <span
          className={cn(
            "inline-block transform rounded-full bg-white shadow-sm transition-transform",
            config.thumb,
            enabled ? config.translateOn : config.translateOff,
          )}
        />
      </button>
      {label && (
        <span
          className={cn(
            "text-sm text-[var(--dashboard-text-primary,#2d2d2d)]",
            disabled && "opacity-50",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
