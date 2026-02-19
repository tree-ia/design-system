"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../Button";
import { Dropdown } from "../Dropdown";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showPageInfo?: boolean;
  compact?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 30, 50],
  showPageInfo = true,
  compact = false,
  className = "",
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = compact ? 3 : 5;
    const halfVisible = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      if (currentPage <= halfVisible + 1) {
        endPage = maxVisible;
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisible + 1;
      }

      if (startPage > 2) pages.push("...");
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < totalPages - 1) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  const dropdownOptions = itemsPerPageOptions.map((opt) => ({
    value: String(opt),
    label: String(opt),
  }));

  return (
    <div
      className={`flex items-center justify-between gap-4 flex-wrap px-4 py-3 border-t border-[var(--dashboard-text-secondary,#6b7280)]/20 ${className}`}
    >
      {onItemsPerPageChange && !compact && (
        <div className="hidden md:flex items-center gap-2">
          <Dropdown
            options={dropdownOptions}
            value={String(itemsPerPage)}
            onChange={(val) => onItemsPerPageChange(Number(val))}
            size="small"
            variant="compact"
            fitContent
          />
          <span className="text-sm text-[var(--dashboard-text-secondary,#6b7280)]">
            Itens por página
          </span>
        </div>
      )}

      {showPageInfo && (
        <div className="text-sm text-[var(--dashboard-text-secondary,#6b7280)]">
          {totalItems > 0 ? (
            <>
              <span className="hidden sm:inline">
                Mostrando {startItem} - {endItem} de {totalItems} itens
              </span>
              <span className="sm:hidden">
                {startItem}-{endItem} de {totalItems}
              </span>
            </>
          ) : (
            <span>Nenhum item encontrado</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1">
        {!compact && (
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageClick(1)}
              disabled={!canGoPrevious}
              icon={<ChevronsLeft size={16} />}
              aria-label="Primeira página"
            />
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={!canGoPrevious}
          icon={<ChevronLeft size={16} />}
          aria-label="Página anterior"
        />

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={`${page}-${index}`}>
              {page === "..." ? (
                <span className="px-2 text-[var(--dashboard-text-secondary,#6b7280)]">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  className={`min-w-[32px] h-8 !px-2 ${
                    page === currentPage ? "font-medium" : ""
                  }`}
                  aria-label={`Página ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={!canGoNext}
          icon={<ChevronRight size={16} />}
          aria-label="Próxima página"
        />

        {!compact && (
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageClick(totalPages)}
              disabled={!canGoNext}
              icon={<ChevronsRight size={16} />}
              aria-label="Última página"
            />
          </div>
        )}
      </div>
    </div>
  );
}
