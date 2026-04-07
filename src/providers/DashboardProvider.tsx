"use client";

import React, { useLayoutEffect, useMemo } from "react";
import type { DashboardConfig } from "../config/types";
import { createConfig } from "../config/createConfig";
import { ConfigContext } from "../hooks/useConfig";
import { ThemeProvider } from "./ThemeProvider";
import { LoadingProvider } from "./LoadingProvider";
import { NotificationsProvider } from "./NotificationsProvider";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface DashboardProviderProps {
  config?: DeepPartial<DashboardConfig>;
  children: React.ReactNode;
}

function CSSVarsInjector({ config }: { config: DashboardConfig }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const { colors } = config;

    root.style.setProperty("--dashboard-primary", colors.primary);
    root.style.setProperty("--dashboard-secondary", colors.secondary);
    root.style.setProperty("--dashboard-background", colors.background);
    root.style.setProperty("--dashboard-surface", colors.surface);
    root.style.setProperty("--dashboard-text-primary", colors.textPrimary);
    root.style.setProperty("--dashboard-text-secondary", colors.textSecondary);
    root.style.setProperty("--dashboard-sidebar-bg", colors.sidebarBg);
    root.style.setProperty("--dashboard-sidebar-border", colors.sidebarBorder);
    root.style.setProperty("--dashboard-sidebar-text", colors.sidebarText);
    root.style.setProperty("--dashboard-sidebar-active-text", colors.sidebarActiveText);
    root.style.setProperty("--dashboard-status-success", colors.statusSuccess);
    root.style.setProperty("--dashboard-status-danger", colors.statusDanger);
    root.style.setProperty("--dashboard-status-warning", colors.statusWarning);
    root.style.setProperty("--dashboard-status-info", colors.statusInfo);
    root.style.setProperty("--dashboard-status-neutral", colors.statusNeutral);
    root.style.setProperty("--dashboard-tooltip-bg", colors.tooltipBg);
    root.style.setProperty("--dashboard-tooltip-text", colors.tooltipText);
    // No cleanup — vars are always overwritten on re-render.
    // Removing them mid-transition causes a flash to hardcoded fallback
    // colors in component classes (e.g. #2A6510 in Sidebar borders).
  }, [config]);

  return null;
}

export function DashboardProvider({
  config: configOverrides,
  children,
}: DashboardProviderProps) {
  const config = useMemo(
    () => createConfig(configOverrides),
    [configOverrides],
  );

  return (
    <ConfigContext.Provider value={config}>
      <CSSVarsInjector config={config} />
      <ThemeProvider>
        <LoadingProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </LoadingProvider>
      </ThemeProvider>
    </ConfigContext.Provider>
  );
}
