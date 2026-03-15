import type { DashboardConfig } from "./types";

export const defaultConfig: DashboardConfig = {
  name: "Dashboard",
  colors: {
    primary: "#37A501",
    secondary: "#f0f0f0",
    background: "#F2F2F2",
    surface: "#FFFFFF",
    textPrimary: "#2d2d2d",
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
