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
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("border-b border-[var(--dashboard-text-secondary,#6b7280)]/20", className)}>
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
                  ? "text-[var(--dashboard-primary,#37a501)] border-[var(--dashboard-primary,#37a501)]"
                  : "text-[var(--dashboard-text-secondary,#6b7280)] hover:text-[var(--dashboard-text-primary,#2d2d2d)] border-transparent",
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
                      ? "bg-[var(--dashboard-primary,#37a501)]/10 text-[var(--dashboard-primary,#37a501)]"
                      : "bg-[var(--dashboard-text-secondary,#6b7280)]/10 text-[var(--dashboard-text-secondary,#6b7280)]",
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
