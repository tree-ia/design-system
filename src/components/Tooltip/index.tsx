"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";
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
  const [positioned, setPositioned] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(`tooltip-${Math.random().toString(36).slice(2, 9)}`);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;
    let resolvedPosition = position;

    // Calculate preferred position
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

    // Flip vertically if overflows
    if (position === "top" && top < 8) {
      top = trigger.bottom + gap;
      resolvedPosition = "bottom";
    } else if (
      position === "bottom" &&
      top + tooltip.height > window.innerHeight - 8
    ) {
      top = trigger.top - tooltip.height - gap;
      resolvedPosition = "top";
    }

    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tooltip.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - tooltip.height - 8));

    setCoords({ top, left });
    setActualPosition(resolvedPosition);
    setPositioned(true);
  }, [position]);

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
      setPositioned(false);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
    setPositioned(false);
  }, []);

  useEffect(() => {
    if (visible) {
      // Double rAF to ensure the portal is painted before measuring
      requestAnimationFrame(() => {
        requestAnimationFrame(calculatePosition);
      });
    }
  }, [visible, calculatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Attach events to child without wrapping in a span — zero layout impact
  let trigger: ReactNode;
  if (isValidElement(children)) {
    trigger = cloneElement(children as React.ReactElement<any>, {
      ref: triggerRef,
      onMouseEnter: (e: React.MouseEvent) => {
        show();
        (children as any).props?.onMouseEnter?.(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        hide();
        (children as any).props?.onMouseLeave?.(e);
      },
      onFocus: (e: React.FocusEvent) => {
        show();
        (children as any).props?.onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent) => {
        hide();
        (children as any).props?.onBlur?.(e);
      },
      "aria-describedby": visible ? idRef.current : undefined,
    });
  } else {
    // Fallback: wrap primitives (strings, numbers) in a span
    trigger = (
      <span
        ref={triggerRef as React.RefObject<HTMLSpanElement>}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={visible ? idRef.current : undefined}
        className="inline-flex"
      >
        {children}
      </span>
    );
  }

  // Arrow styles per position
  const arrowClass: Record<string, string> = {
    top: "left-1/2 -translate-x-1/2 top-full border-t-[var(--dashboard-tooltip-bg,#1a1a1a)] border-x-transparent border-b-transparent",
    bottom:
      "left-1/2 -translate-x-1/2 bottom-full border-b-[var(--dashboard-tooltip-bg,#1a1a1a)] border-x-transparent border-t-transparent",
    left: "top-1/2 -translate-y-1/2 left-full border-l-[var(--dashboard-tooltip-bg,#1a1a1a)] border-y-transparent border-r-transparent",
    right:
      "top-1/2 -translate-y-1/2 right-full border-r-[var(--dashboard-tooltip-bg,#1a1a1a)] border-y-transparent border-l-transparent",
  };

  return (
    <>
      {trigger}
      {visible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            id={idRef.current}
            role="tooltip"
            className={cn(
              "fixed z-[10002] rounded-md px-3 py-2 text-xs font-medium",
              "bg-[var(--dashboard-tooltip-bg,#1a1a1a)] text-[var(--dashboard-tooltip-text,#ffffff)]",
              "shadow-lg pointer-events-none",
              positioned && "dashboard-animate-fade-in",
              className,
            )}
            style={{
              top: coords.top,
              left: coords.left,
              maxWidth,
              opacity: positioned ? 1 : 0,
            }}
          >
            {content}
            {/* Arrow */}
            <span
              className={cn(
                "absolute w-0 h-0 border-[5px]",
                arrowClass[actualPosition],
              )}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
