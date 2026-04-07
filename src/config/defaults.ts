import type { DashboardConfig } from "./types";

export const defaultConfig: DashboardConfig = {
  name: "Dashboard",
  colors: {
    primary: "#2563EB",
    secondary: "#F1F5F9",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    sidebarBg: "#f0f0f0",
    sidebarBorder: "#e0dfe3",
    sidebarText: "#403f52",
    sidebarActiveText: "#ff521d",
    statusSuccess: "#059669",
    statusDanger: "#DC2626",
    statusWarning: "#D97706",
    statusInfo: "#2563EB",
    statusNeutral: "#64748B",
  },
  components: {
    modal: {
      closeOnEscape: true,
      closeOnOverlayClick: true,
    },
    toast: {
      duration: 3000,
      position: "top-right",
    },
    notification: {
      duration: 5000,
    },
    pagination: {
      itemsPerPageOptions: [10, 20, 30, 50],
      defaultItemsPerPage: 10,
    },
  },
};
