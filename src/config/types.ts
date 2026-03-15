export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  sidebarBg: string;
  sidebarBorder: string;
  sidebarText: string;
  sidebarActiveText: string;
  statusSuccess: string;
  statusDanger: string;
  statusWarning: string;
  statusInfo: string;
  statusNeutral: string;
}

export interface ComponentsConfig {
  modal: {
    closeOnEscape: boolean;
    closeOnOverlayClick: boolean;
  };
  toast: {
    duration: number;
    position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  };
  notification: {
    duration: number;
  };
  pagination: {
    itemsPerPageOptions: number[];
    defaultItemsPerPage: number;
  };
}

export interface DashboardConfig {
  name: string;
  colors: ThemeColors;
  components: ComponentsConfig;
}
