"use client";

import React, { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  children: ReactNode;
  className?: string;
  maxWidth?: number;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function Tooltip({
  content,
  position = "top",
  delay = 200,
  children,
  className,
  maxWidth = 240,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const idRef = useRef(`tooltip-${Math.random().toString(36).slice(2, 9)}`);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = trigger.top - tooltip.height - gap;
        left = trigger.left + trigger.width / 2 - tooltip.width / 2;
        break;
      case "bottom":
        top = trigger.bottom + gap;
        left = trigger.left + trigger.width / 2 - tooltip.width / 2;
        break;
      case "left":
        top = trigger.top + trigger.height / 2 - tooltip.height / 2;
        left = trigger.left - tooltip.width - gap;
        break;
      case "right":
        top = trigger.top + trigger.height / 2 - tooltip.height / 2;
        left = trigger.right + gap;
        break;
    }

    left = Math.max(8, Math.min(left, window.innerWidth - tooltip.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - tooltip.height - 8));

    setCoords({ top, left });
  }, [position]);

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(calculatePosition);
    }
  }, [visible, calculatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={visible ? idRef.current : undefined}
        className="inline-flex"
      >
        {children}
      </span>
      {visible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            id={idRef.current}
            role="tooltip"
            className={cn(
              "fixed z-[10002] rounded-md px-3 py-2 text-xs font-medium",
              "bg-[var(--dashboard-text-primary,#2d2d2d)] text-white",
              "shadow-lg dashboard-animate-fade-in pointer-events-none",
              className,
            )}
            style={{
              top: coords.top,
              left: coords.left,
              maxWidth,
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
