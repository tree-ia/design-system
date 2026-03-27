"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X, Check, Search } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  renderOption?: (option: ComboboxOption, isSelected: boolean) => ReactNode;
  noResultsText?: string;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function Combobox({
  options,
  value,
  onChange,
  multiple = false,
  searchable = true,
  placeholder = "Selecione...",
  label,
  error,
  disabled = false,
  renderOption,
  noResultsText = "Nenhum resultado encontrado",
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const filtered = useMemo(() => {
    if (!query) return options;
    const lower = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(lower));
  }, [options, query]);

  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  const open = useCallback(() => {
    if (disabled) return;
    calculatePosition();
    setIsOpen(true);
    setFocusedIndex(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [disabled, calculatePosition]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setFocusedIndex(-1);
  }, []);

  const toggleOption = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const current = selectedValues;
        const next = current.includes(optionValue)
          ? current.filter((v) => v !== optionValue)
          : [...current, optionValue];
        onChange(next);
      } else {
        onChange(optionValue);
        close();
      }
    },
    [multiple, selectedValues, onChange, close],
  );

  const removeValue = useCallback(
    (val: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (multiple) {
        onChange(selectedValues.filter((v) => v !== val));
      } else {
        onChange(multiple ? [] : "");
      }
    },
    [multiple, selectedValues, onChange],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      const portal = document.querySelector(".dc-combobox-portal");
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        (!portal || !portal.contains(e.target as Node))
      ) {
        close();
      }
    };

    const handleScroll = (e: Event) => {
      const portal = document.querySelector(".dc-combobox-portal");
      if (!portal || !portal.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen, close]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev + 1;
            return next >= filtered.length ? 0 : next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? filtered.length - 1 : next;
          });
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && filtered[focusedIndex] && !filtered[focusedIndex].disabled) {
            toggleOption(filtered[focusedIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    },
    [isOpen, open, close, filtered, focusedIndex, toggleOption],
  );

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  const selectedLabels = selectedValues
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[];

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm text-[var(--dashboard-text-primary,#2d2d2d)]">
          {label}
        </label>
      )}

      <div ref={containerRef} onKeyDown={handleKeyDown}>
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="combobox-listbox"
          tabIndex={disabled ? -1 : 0}
          onClick={() => (isOpen ? close() : open())}
          className={cn(
            "flex min-h-[40px] w-full items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
            isOpen
              ? "border-[var(--dashboard-primary,#37a501)] ring-2 ring-[var(--dashboard-primary,#37a501)]/20"
              : error
                ? "border-[var(--dashboard-status-danger,#EF4444)]"
                : "border-[var(--dashboard-text-secondary,#6b7280)]/30 hover:border-[var(--dashboard-text-secondary,#6b7280)]/50",
            disabled
              ? "opacity-50 cursor-not-allowed bg-[var(--dashboard-text-secondary,#6b7280)]/10"
              : "cursor-pointer bg-[var(--dashboard-surface,#ffffff)]",
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1 min-w-0">
            {multiple && selectedLabels.length > 0 ? (
              selectedLabels.map((lbl, i) => (
                <span
                  key={selectedValues[i]}
                  className="inline-flex items-center gap-1 rounded-md bg-[var(--dashboard-primary,#37a501)]/10 px-2 py-0.5 text-xs font-medium text-[var(--dashboard-primary,#37a501)]"
                >
                  {lbl}
                  <button
                    type="button"
                    onClick={(e) => removeValue(selectedValues[i], e)}
                    className="rounded-sm hover:bg-[var(--dashboard-primary,#37a501)]/20 cursor-pointer"
                    aria-label={`Remover ${lbl}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            ) : !multiple && selectedLabels.length === 1 ? (
              <span className="text-sm text-[var(--dashboard-text-primary,#2d2d2d)] truncate">
                {selectedLabels[0]}
              </span>
            ) : (
              <span className="text-sm text-[var(--dashboard-text-secondary,#6b7280)]">
                {placeholder}
              </span>
            )}
          </div>

          {!multiple && selectedValues.length > 0 && (
            <button
              type="button"
              onClick={(e) => removeValue(selectedValues[0], e)}
              className="flex-shrink-0 rounded-md p-0.5 text-[var(--dashboard-text-secondary,#6b7280)] hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 cursor-pointer"
              aria-label="Limpar seleção"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <ChevronDown
            className={cn(
              "h-4 w-4 flex-shrink-0 text-[var(--dashboard-text-secondary,#6b7280)] transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </div>

        {isOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="dc-combobox-portal rounded-lg border border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)] shadow-lg dashboard-animate-fade-in overflow-hidden"
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: position.width,
                zIndex: 10001,
              }}
            >
              {searchable && (
                <div className="flex items-center gap-2 border-b border-[var(--dashboard-text-secondary,#6b7280)]/20 px-3 py-2">
                  <Search className="h-4 w-4 text-[var(--dashboard-text-secondary,#6b7280)] flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setFocusedIndex(-1);
                    }}
                    placeholder="Buscar..."
                    className="flex-1 bg-transparent text-sm text-[var(--dashboard-text-primary,#2d2d2d)] placeholder:text-[var(--dashboard-text-secondary,#6b7280)] outline-none"
                    aria-label="Buscar opções"
                  />
                </div>
              )}

              <ul
                ref={listRef}
                id="combobox-listbox"
                role="listbox"
                aria-multiselectable={multiple}
                className="max-h-60 overflow-y-auto py-1"
              >
                {filtered.length === 0 ? (
                  <li className="px-3 py-3 text-center text-sm text-[var(--dashboard-text-secondary,#6b7280)]">
                    {noResultsText}
                  </li>
                ) : (
                  filtered.map((option, index) => {
                    const isSelected = selectedValues.includes(option.value);
                    const isFocused = index === focusedIndex;

                    return (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={option.disabled}
                        data-modal-ignore
                        onClick={() => {
                          if (!option.disabled) toggleOption(option.value);
                        }}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 text-sm transition-colors",
                          option.disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer",
                          isFocused && "bg-[var(--dashboard-text-secondary,#6b7280)]/10",
                          !isFocused &&
                            !option.disabled &&
                            "hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10",
                          isSelected
                            ? "text-[var(--dashboard-primary,#37a501)] font-medium"
                            : "text-[var(--dashboard-text-primary,#2d2d2d)]",
                        )}
                      >
                        {renderOption ? (
                          renderOption(option, isSelected)
                        ) : (
                          <>
                            <span className="truncate">{option.label}</span>
                            {isSelected && (
                              <Check className="h-4 w-4 flex-shrink-0 text-[var(--dashboard-primary,#37a501)]" />
                            )}
                          </>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>,
            document.body,
          )}
      </div>

      {error && (
        <p className="text-xs text-[var(--dashboard-status-danger,#EF4444)]">{error}</p>
      )}
    </div>
  );
}
