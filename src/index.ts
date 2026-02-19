// Components
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";

export { Dropdown } from "./components/Dropdown";
export type { DropdownProps, DropdownOption } from "./components/Dropdown";

export {
  Table,
  TableHeader,
  TableBody,
  TableSkeleton,
  TableEmpty,
} from "./components/Table";
export type { TableProps, TableColumn } from "./components/Table";

export { Modal } from "./components/Modal";
export type { ModalProps } from "./components/Modal";

export { Card } from "./components/Card";
export type { CardProps } from "./components/Card";

export { Toast } from "./components/Toast";
export type { ToastProps } from "./components/Toast";

export { Loading } from "./components/Loading";
export type { LoadingProps } from "./components/Loading";

export { Pagination } from "./components/Pagination";
export type { PaginationProps } from "./components/Pagination";

export { FormField } from "./components/FormField";
export type { FormFieldProps } from "./components/FormField";

export { Tabs } from "./components/Tabs";
export type { TabsProps, Tab } from "./components/Tabs";

export { DateRangePicker } from "./components/DateRangePicker";
export type { DateRangePickerProps, DateRange } from "./components/DateRangePicker";

export { Title } from "./components/Title";
export type { TitleProps } from "./components/Title";

export { ToggleSwitch } from "./components/ToggleSwitch";
export type { ToggleSwitchProps } from "./components/ToggleSwitch";

export { BadgeStatus } from "./components/BadgeStatus";
export type { BadgeStatusProps } from "./components/BadgeStatus";

export { Sidebar } from "./components/Sidebar";
export type {
  SidebarProps,
  SidebarMenuItem,
  SidebarUser,
} from "./components/Sidebar";

export { ThemeSwitcher } from "./components/ThemeSwitcher";
export type { ThemeSwitcherProps } from "./components/ThemeSwitcher";

// Providers
export { DashboardProvider } from "./providers/DashboardProvider";
export { ThemeProvider } from "./providers/ThemeProvider";
export { LoadingProvider } from "./providers/LoadingProvider";
export { NotificationsProvider } from "./providers/NotificationsProvider";

// Hooks
export { useTheme } from "./hooks/useTheme";
export type { Theme, ThemeContextType } from "./hooks/useTheme";

export { useConfig } from "./hooks/useConfig";

export { useLoading } from "./hooks/useLoading";
export type { LoadingContextType } from "./hooks/useLoading";

export { useNotifications } from "./hooks/useNotifications";
export type {
  Notification,
  NotificationsContextType,
} from "./hooks/useNotifications";

// Config
export { createConfig } from "./config/createConfig";
export { defaultConfig } from "./config/defaults";
export type {
  DashboardConfig,
  ThemeColors,
  ComponentsConfig,
} from "./config/types";
