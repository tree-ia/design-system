import type { Preview } from "@storybook/react-vite";
import React from "react";
import { DashboardProvider } from "../src/providers/DashboardProvider";
import "./storybook.css";

const themeConfigs = {
  EaíGarçom: {
    name: "EaíGarçom",
    colors: {
      primary: "#ff521d",
      secondary: "#faf2e0",
      background: "#F2F2F2",
      surface: "#FFFFFF",
      textPrimary: "#2d2d2d",
      textSecondary: "#6b7280",
      sidebarBg: "#4A1508",
      sidebarBorder: "#6B2010",
      sidebarText: "#FFFFFF",
      sidebarActiveText: "#FF8A65",
      statusSuccess: "#10B981",
      statusDanger: "#EF4444",
      statusWarning: "#F59E0B",
      statusInfo: "#3B82F6",
      statusNeutral: "#6B7280",
    },
  },
  EaíPrefeito: {
    name: "EaíPrefeito",
    colors: {
      primary: "#192144",
      secondary: "#e8eaf6",
      background: "#f5f5f5",
      surface: "#FFFFFF",
      textPrimary: "#1a1a2e",
      textSecondary: "#6b7280",
      sidebarBg: "#0F1530",
      sidebarBorder: "#1E2A50",
      sidebarText: "#FFFFFF",
      sidebarActiveText: "#7B8FD0",
      statusSuccess: "#10B981",
      statusDanger: "#EF4444",
      statusWarning: "#F59E0B",
      statusInfo: "#3B82F6",
      statusNeutral: "#6B7280",
    },
  },
  MeuConstrutor: {
    name: "MeuConstrutor",
    colors: {
      primary: "#5FB530",
      secondary: "#faf2e0",
      background: "#fafafa",
      surface: "#FFFFFF",
      textPrimary: "#1b1b1b",
      textSecondary: "#6b7280",
      sidebarBg: "#1B4D08",
      sidebarBorder: "#2A6510",
      sidebarText: "#FFFFFF",
      sidebarActiveText: "#5DD611",
      statusSuccess: "#10B981",
      statusDanger: "#EF4444",
      statusWarning: "#F59E0B",
      statusInfo: "#3B82F6",
      statusNeutral: "#6B7280",
    },
  },
};

const preview: Preview = {
  globalTypes: {
    dashboard: {
      description: "Dashboard theme",
      toolbar: {
        title: "Dashboard",
        icon: "paintbrush",
        items: Object.keys(themeConfigs),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    dashboard: "EaíGarçom",
  },
  decorators: [
    (Story, context) => {
      const dashboardKey = context.globals.dashboard || "EaíGarçom";
      const config = themeConfigs[dashboardKey as keyof typeof themeConfigs];

      return React.createElement(
        DashboardProvider,
        { config },
        React.createElement(
          "div",
          { className: "p-4" },
          React.createElement(Story),
        ),
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
