import type { DashboardConfig } from "./types";
import { defaultConfig } from "./defaults";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const result = { ...target } as Record<string, unknown>;
  const src = source as Record<string, unknown>;

  for (const key in src) {
    const sourceVal = src[key];
    const targetVal = result[key];

    if (
      sourceVal !== null &&
      sourceVal !== undefined &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      typeof targetVal === "object" &&
      targetVal !== null &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(
        targetVal,
        sourceVal as DeepPartial<typeof targetVal>,
      );
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal;
    }
  }

  return result as T;
}

export function createConfig(
  overrides: DeepPartial<DashboardConfig> = {},
): DashboardConfig {
  return deepMerge(defaultConfig, overrides);
}
