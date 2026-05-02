"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "../Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title?: string;
  children: React.ReactNode;
  showFooter?: boolean;
  saveButtonText?: string;
  cancelButtonText?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  disableSaveButton?: boolean;
  saveButtonVariant?: "primary" | "secondary" | "danger" | "ghost";
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

const ANIMATION_MS = 200;

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  "2xl": "max-w-4xl",
  "3xl": "max-w-screen-xl",
};

export function Modal({
  isOpen,
  onClose,
  onSave,
  title = "",
  children,
  showFooter = false,
  saveButtonText = "Salvar",
  cancelButtonText = "Cancelar",
  size = "md",
  disableSaveButton = false,
  saveButtonVariant = "primary",
  closeOnEscape = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Show immediately when isOpen becomes true (no frame delay)
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  // Derived — no refs, no implicit state machine
  const isClosing = shouldRender && !isOpen;

  // Close animation timer: unmount after animation completes
  useEffect(() => {
    if (!isClosing) return;
    const timer = setTimeout(() => setShouldRender(false), ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isClosing]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Scroll lock — active while rendered (including during close animation)
  useEffect(() => {
    if (!shouldRender) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [shouldRender]);

  // Click outside — only when fully open (not during close)
  useEffect(() => {
    if (!closeOnOverlayClick || !shouldRender || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-modal-ignore]")) return;

      const portalSelectors = [
        ".dashboard-dropdown-portal",
        ".dc-combobox-portal",
      ];
      for (const selector of portalSelectors) {
        const portal = document.querySelector(selector);
        if (portal?.contains(target)) return;
      }

      if (modalRef.current && !modalRef.current.contains(target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shouldRender, isOpen, handleClose, closeOnOverlayClick]);

  // Escape key — only when fully open (not during close)
  useEffect(() => {
    if (!closeOnEscape || !shouldRender || !isOpen) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [shouldRender, isOpen, handleClose, closeOnEscape]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ${
        isClosing ? "dashboard-animate-fade-out" : "dashboard-animate-fade-in"
      }`}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={`w-full rounded-2xl bg-[var(--dashboard-surface,#ffffff)] border border-[var(--dashboard-text-secondary,#64748B)]/10 dashboard-shadow-xl ${
          sizeClasses[size]
        } flex max-h-[90vh] flex-col transition-all duration-200 ease-out ${
          isClosing ? "scale-[0.98] opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="flex h-fit items-center justify-between border-b border-[var(--dashboard-text-secondary,#64748B)]/10 px-6 py-4">
          {title && (
            <h2
              id="modal-title"
              className="text-lg font-semibold text-[var(--dashboard-text-primary,#0F172A)] tracking-tight"
            >
              {title}
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="ml-auto rounded-md"
            aria-label="Fechar modal"
            icon={<X className="h-5 w-5" />}
          />
        </div>

        <div className="flex-grow overflow-y-auto p-6">{children}</div>

        {showFooter && (
          <div className="flex justify-end gap-3 border-t border-[var(--dashboard-text-secondary,#6b7280)]/20 p-4">
            <Button variant="secondary" onClick={handleClose} size="md">
              {cancelButtonText}
            </Button>
            <Button
              variant={saveButtonVariant}
              onClick={onSave}
              disabled={disableSaveButton}
              size="md"
            >
              {saveButtonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
