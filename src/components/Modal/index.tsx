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
  size?: "small" | "medium" | "large" | "extraLarge" | "largeXl";
  disableSaveButton?: boolean;
  saveButtonVariant?: "primary" | "secondary" | "danger" | "ghost";
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  onSave,
  title = "",
  children,
  showFooter = false,
  saveButtonText = "Salvar",
  cancelButtonText = "Cancelar",
  size = "medium",
  disableSaveButton = false,
  saveButtonVariant = "primary",
  closeOnEscape = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);
  const prevIsOpenRef = useRef(false);

  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-md",
    large: "max-w-lg",
    largeXl: "max-w-4xl",
    extraLarge: "max-w-screen-xl",
  };

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (!isOpen && prevIsOpenRef.current) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  }, [onClose]);

  useEffect(() => {
    if (!closeOnOverlayClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !target.closest("[data-modal-ignore]")
      ) {
        handleClose();
      }
    };

    if (shouldRender && !isClosing) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (!shouldRender) {
        document.body.style.overflow = "auto";
      }
    };
  }, [shouldRender, isClosing, handleClose, closeOnOverlayClick]);

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (shouldRender && !isClosing) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [shouldRender, isClosing, handleClose, closeOnEscape]);

  if (!shouldRender && !isOpen) return null;

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
