import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  dts: true,
  clean: true,
  hash: false,
  external: ["react", "react-dom", "react/jsx-runtime", "chart.js", "react-chartjs-2", "chart.js/auto"],
});
