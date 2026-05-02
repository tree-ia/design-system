"use client";

import React, { useEffect, useState, useCallback } from "react";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export interface ToastProps {
  title: string;
  subtitle?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
  showProgress?: boolean;
}

const typeConfig = {
  success: {
    bg: "bg-[var(--dashboard-status-success,#10b981)]",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-[var(--dashboard-status-danger,#ef4444)]",
    icon: XCircle,
  },
  warning: {
    bg: "bg-[var(--dashboard-status-warning,#f59e0b)]",
    icon: AlertTriangle,
  },
  info: {
    bg: "bg-[var(--dashboard-status-info,#3b82f6)]",
    icon: Info,
  },
};

export function Toast({
  title,
  subtitle,
  type = "success",
  duration = 4000,
  onClose,
  showProgress = true,
}: ToastProps) {
  const [exiting, setExiting] = useState(false);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const { bg, icon: Icon } = typeConfig[type];

  return (
    <div
      className={`${bg} overflow-hidden rounded-xl border border-white/10 text-white ${
        exiting ? "dashboard-toast-exit" : "dashboard-toast-enter"
      }`}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{title}</p>
          {subtitle && <p className="text-xs opacity-90 mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={handleClose}
          className="shrink-0 hover:opacity-75 transition-opacity cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showProgress && duration > 0 && !exiting && (
        <div className="h-0.5 bg-white/20">
          <div
            className="h-full bg-white/60"
            style={{
              animation: `dashboard-toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}
