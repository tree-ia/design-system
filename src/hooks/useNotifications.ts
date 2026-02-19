"use client";

import { useContext, createContext } from "react";

export interface Notification {
  id: string;
  title: string;
  subtitle: string;
  type: "success" | "error" | "warning" | "info";
}

export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const NotificationsContext =
  createContext<NotificationsContextType | null>(null);

export function useNotifications(): NotificationsContextType {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a DashboardProvider");
  }
  return context;
}
