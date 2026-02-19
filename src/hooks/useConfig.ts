"use client";

import { useContext, createContext } from "react";
import type { DashboardConfig } from "../config/types";

export const ConfigContext = createContext<DashboardConfig | null>(null);

export function useConfig(): DashboardConfig {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error("useConfig must be used within a DashboardProvider");
  }
  return config;
}
