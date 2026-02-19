"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { NotificationsContext } from "../hooks/useNotifications";
import type { Notification } from "../hooks/useNotifications";
import { useConfig } from "../hooks/useConfig";
import { Toast } from "../components/Toast";

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const config = useConfig();

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const removeNotification = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newNotification: Notification = { ...notification, id };
      setNotifications((prev) => [...prev, newNotification]);
    },
    [],
  );

  const clearNotifications = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setNotifications([]);
  }, []);

  const duration = config.components.notification.duration;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
      {notifications.length > 0 && (
        <div className="fixed w-full max-w-[400px] px-4 z-50 top-4 left-1/2 -translate-x-1/2 sm:top-5 sm:right-4 sm:left-auto sm:translate-x-0 flex flex-col gap-2">
          {notifications.map((notification) => (
            <Toast
              key={notification.id}
              title={notification.title}
              subtitle={notification.subtitle}
              type={notification.type}
              duration={duration}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </div>
      )}
    </NotificationsContext.Provider>
  );
}
