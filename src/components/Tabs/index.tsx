import React, { ReactNode } from "react";

export interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  /** Estilo visual das tabs. Default: "underline" */
  variant?: "underline" | "pill";
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className,
}: TabsProps) {
  if (variant === "pill") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)} role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-[var(--dashboard-primary,#37a501)] text-white"
                  : "bg-[var(--dashboard-text-secondary,#6b7280)]/10 text-[var(--dashboard-text-secondary,#6b7280)] hover:bg-[var(--dashboard-text-secondary,#6b7280)]/20",
              )}
              role="tab"
              aria-selected={isActive}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-1 text-xs rounded-full px-1.5 py-0.5",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[var(--dashboard-text-secondary,#6b7280)]/10 text-[var(--dashboard-text-secondary,#6b7280)]",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-b border-[var(--dashboard-text-secondary,#6b7280)]/20",
        className,
      )}
    >
      <nav className="flex gap-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative pb-3 px-1 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer",
                isActive
                  ? "text-[var(--dashboard-text-primary,#d7dae0)] border-[var(--dashboard-primary,#e74410)]"
                  : "text-[var(--dashboard-text-secondary,#9da5b3)] hover:text-[var(--dashboard-text-primary,#d7dae0)] border-transparent",
              )}
              role="tab"
              aria-selected={isActive}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-1 text-xs rounded-full px-1.5 py-0.5",
                    isActive
                      ? "bg-[var(--dashboard-primary,#e74410)]/10 text-[var(--dashboard-primary,#e74410)]"
                      : "bg-[var(--dashboard-text-secondary,#9da5b3)]/10 text-[var(--dashboard-text-secondary,#9da5b3)]",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
