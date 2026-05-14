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
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    target?: string;
    rel?: string;
    closeOnClick?: boolean;
  };
}

const typeConfig = {
  success: {
    bg: "bg-[var(--dashboard-status-success,#10B981)]",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-[var(--dashboard-status-danger,#EF4444)]",
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
  action,
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
  const actionRel =
    action?.rel ?? (action?.target === "_blank" ? "noopener noreferrer" : undefined);

  const actionClassName =
    "mt-2 inline-flex h-7 items-center rounded-md border border-white/35 bg-white/15 px-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-transparent";

  const handleActionClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      action?.onClick?.();
      if (!action?.href) {
        event.preventDefault();
      }
      if (action?.closeOnClick !== false) {
        handleClose();
      }
    },
    [action, handleClose],
  );

  return (
    <div
      className={`${bg} text-white rounded-lg shadow-xl shadow-black/15 overflow-hidden ${
        exiting ? "dashboard-toast-exit" : "dashboard-toast-enter"
      }`}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{title}</p>
          {subtitle && <p className="text-xs opacity-90 mt-0.5">{subtitle}</p>}
          {action &&
            (action.href ? (
              <a
                href={action.href}
                target={action.target}
                rel={actionRel}
                className={actionClassName}
                onClick={handleActionClick}
              >
                {action.label}
              </a>
            ) : (
              <button type="button" className={actionClassName} onClick={handleActionClick}>
                {action.label}
              </button>
            ))}
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
