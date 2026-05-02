"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  color?: string;
  backgroundColor?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  error?: string;
  variant?: "default" | "underline" | "simple" | "compact";
  customDropdownHeight?: string;
  icon?: React.ReactNode;
  fitContent?: boolean;
  isActive?: boolean;
}

export function Dropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Selecione uma opção",
  disabled = false,
  className = "",
  containerClassName = "",
  fullWidth = false,
  size = "md",
  error,
  variant = "default",
  customDropdownHeight,
  icon,
  fitContent = false,
  isActive = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  const sizeStyles = {
    sm: {
      container: "h-8 px-2.5",
      text: "text-sm",
      wrapper: "space-y-1",
      label: "text-sm",
      iconPadding: "pl-8",
    },
    md: {
      container: "h-10 px-3",
      text: "text-sm",
      wrapper: "space-y-1",
      label: "text-sm",
      iconPadding: "pl-10",
    },
    lg: {
      container: "h-12 px-4",
      text: "text-base",
      wrapper: "space-y-1",
      label: "text-sm",
      iconPadding: "pl-12",
    },
  };

  const selectedStyle = sizeStyles[size];

  const variantStyles = {
    default:
      "rounded-md border border-[var(--dashboard-border,#3e4451)] hover:border-[var(--dashboard-text-secondary,#9da5b3)] focus:outline-none focus:border-[var(--dashboard-primary,#e74410)]",
    underline:
      "border-b border-[var(--dashboard-border,#3e4451)] rounded-none hover:border-b-[var(--dashboard-text-secondary,#9da5b3)]",
    simple:
      "rounded-md border border-[var(--dashboard-border,#3e4451)] hover:border-[var(--dashboard-text-secondary,#9da5b3)] focus:outline-none",
    compact:
      "rounded-md hover:bg-[var(--dashboard-text-secondary,#9da5b3)]/10 focus:outline-none",
  };

  const variantBackgrounds = {
    default: "bg-[var(--dashboard-surface,#272c33)]",
    underline: "bg-transparent",
    simple: "bg-[var(--dashboard-surface,#272c33)]",
    compact: "bg-[var(--dashboard-text-secondary,#9da5b3)]/10",
  };

  const calculatePosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      if (isOpen) {
        handleClose();
      } else {
        calculatePosition();
        setIsVisible(true);
        setTimeout(() => setIsOpen(true), 10);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setIsVisible(false), 150);
  };

  const handleSelect = (option: DropdownOption) => {
    onChange(option.value);
    handleClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        const portal = document.querySelector(".dashboard-dropdown-portal");
        if (portal && !portal.contains(event.target as Node)) {
          if (isOpen) handleClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) calculatePosition();
    };

    const handleScroll = (event: Event) => {
      if (isOpen) {
        const portal = document.querySelector(".dashboard-dropdown-portal");
        if (!portal || !portal.contains(event.target as Node)) {
          handleClose();
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div
      className={`${selectedStyle.wrapper} ${containerClassName} ${
        fullWidth ? "w-full" : fitContent ? "w-fit" : ""
      }`}
    >
      {label && (
        <label
          className={`block text-[var(--dashboard-text-primary,#d7dae0)] ${selectedStyle.label}`}
        >
          {label}
        </label>
      )}

      <div ref={dropdownRef} className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--dashboard-text-secondary,#9da5b3)] h-4 w-4 pointer-events-none">
            {icon}
          </div>
        )}
        <div
          onClick={toggleDropdown}
          className={`flex ${
            fullWidth ? "w-full" : fitContent ? "w-fit" : "w-full"
          } items-center justify-between ${selectedStyle.container} ${
            icon ? selectedStyle.iconPadding : ""
          } ${
            error
              ? "rounded-md border border-[var(--dashboard-status-danger,#ef4444)]"
              : disabled
                ? "border-[var(--dashboard-border,#3e4451)] bg-[var(--dashboard-text-secondary,#9da5b3)]/10"
                : isActive
                  ? "rounded-md border border-[var(--dashboard-primary,#e74410)]"
                  : variantStyles[variant]
          } ${className} cursor-pointer transition-colors duration-200 ${
            disabled
              ? "bg-[var(--dashboard-text-secondary,#9da5b3)]/10"
              : selectedOption?.backgroundColor || variantBackgrounds[variant]
          }`}
          style={
            selectedOption?.backgroundColor
              ? { backgroundColor: selectedOption.backgroundColor }
              : undefined
          }
        >
          <span
            className={`block truncate select-none ${selectedStyle.text} ${
              selectedOption
                ? selectedOption.color
                  ? ""
                  : "text-[var(--dashboard-text-primary,#d7dae0)]"
                : "text-[var(--dashboard-text-secondary,#9da5b3)]"
            } ${disabled ? "text-[var(--dashboard-text-secondary,#9da5b3)] opacity-50" : ""}`}
            style={
              selectedOption?.color
                ? { color: selectedOption.color }
                : undefined
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--dashboard-text-secondary,#9da5b3)] transition-transform duration-200 ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </div>

        {isVisible &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className={`dashboard-dropdown-portal overflow-y-auto rounded-md border border-[var(--dashboard-border,#3e4451)] bg-[var(--dashboard-surface,#272c33)] transition-all duration-200 ease-in-out ${
                isOpen
                  ? `opacity-100 ${customDropdownHeight || "max-h-60"}`
                  : "max-h-0 opacity-0"
              }`}
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: position.width,
                zIndex: 10001,
              }}
            >
              <ul className="py-1">
                {options.length > 0 ? (
                  options.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <li
                        data-modal-ignore
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        className={`cursor-pointer px-3 py-2 text-left select-none hover:bg-[var(--dashboard-text-secondary,#9da5b3)]/10 transition-colors flex items-center justify-between ${
                          isSelected
                            ? "text-[var(--dashboard-primary,#e74410)] font-medium"
                            : "text-[var(--dashboard-text-primary,#d7dae0)]"
                        } ${selectedStyle.text}`}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-[var(--dashboard-primary,#e74410)]" />
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li
                    className={`px-3 py-2 text-[var(--dashboard-text-secondary,#9da5b3)] italic ${selectedStyle.text}`}
                  >
                    Não há opções disponíveis
                  </li>
                )}
              </ul>
            </div>,
            document.body,
          )}
      </div>

      {error && (
        <p
          className={`mt-1 ${selectedStyle.text} text-[var(--dashboard-status-danger,#ef4444)]`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
