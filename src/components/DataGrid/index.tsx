"use client";

import React, { useMemo, useState, useCallback, ReactNode, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type PaginationState,
  type Row,
  type Table as TanTable,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../Skeleton";

export type { ColumnDef as DataGridColumn };
export { createColumnHelper };

export interface DataGridProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;

  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;

  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;

  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  enableRowSelection?: boolean | ((row: Row<T>) => boolean);

  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  pageCount?: number;
  manualPagination?: boolean;
  pageSizeOptions?: number[];

  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => string;

  enableVirtualization?: boolean;
  rowHeight?: number;

  emptyMessage?: string;
  emptyIcon?: ReactNode;

  stickyHeader?: boolean;
  compact?: boolean;
  striped?: boolean;
  bordered?: boolean;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <ArrowUp className="h-3.5 w-3.5" />;
  if (sorted === "desc") return <ArrowDown className="h-3.5 w-3.5" />;
  return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
}

function DataGridSkeleton({
  columns,
  rows,
  compact,
}: {
  columns: number;
  rows: number;
  compact?: boolean;
}) {
  const cellPadding = compact ? "px-4 py-2" : "px-6 py-3";
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className={cellPadding}>
              <Skeleton variant="text" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function VirtualRows<T>({
  table,
  rowHeight,
  onRowClick,
  compact,
}: {
  table: TanTable<T>;
  rowHeight: number;
  onRowClick?: (row: T) => void;
  compact?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(400);

  const rows = table.getRowModel().rows;
  const totalHeight = rows.length * rowHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(container);

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const overscan = 5;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    rows.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan,
  );
  const visibleRows = rows.slice(startIndex, endIndex);

  const cellPadding = compact ? "px-4 py-2" : "px-6 py-4";

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ maxHeight: containerHeight }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <table className="min-w-full divide-y divide-[var(--dashboard-text-secondary,#6b7280)]/20">
          <thead className="bg-[var(--dashboard-text-secondary,#6b7280)]/5 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className={cn(
                      "text-left text-xs font-semibold text-[var(--dashboard-text-secondary,#6b7280)] uppercase tracking-wider",
                      compact ? "px-4 py-2" : "px-6 py-3",
                      header.column.getCanSort() && "cursor-pointer select-none",
                    )}
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <SortIcon sorted={header.column.getIsSorted()} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <tr style={{ height: startIndex * rowHeight }}>
              <td colSpan={table.getAllColumns().length} />
            </tr>
            {visibleRows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={cn(
                  "hover:bg-[var(--dashboard-text-secondary,#6b7280)]/5 transition-colors",
                  onRowClick && "cursor-pointer",
                  row.getIsSelected() && "bg-[var(--dashboard-primary,#37a501)]/5",
                )}
                style={{ height: rowHeight }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(cellPadding, "text-sm whitespace-nowrap")}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            <tr style={{ height: (rows.length - endIndex) * rowHeight }}>
              <td colSpan={table.getAllColumns().length} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DataGrid<T>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,

  sorting: controlledSorting,
  onSortingChange,

  globalFilter: controlledGlobalFilter,
  onGlobalFilterChange,

  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,

  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  enableRowSelection = false,

  pagination: controlledPagination,
  onPaginationChange,
  pageCount,
  manualPagination = false,
  pageSizeOptions = [10, 20, 30, 50],

  onRowClick,
  getRowId,

  enableVirtualization = false,
  rowHeight = 48,

  emptyMessage = "Nenhum registro encontrado",
  emptyIcon,

  stickyHeader = false,
  compact = false,
  striped = false,
  bordered = false,
  className,
}: DataGridProps<T>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const sorting = controlledSorting ?? internalSorting;
  const globalFilter = controlledGlobalFilter ?? internalGlobalFilter;
  const columnFilters = controlledColumnFilters ?? internalColumnFilters;
  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const pagination = controlledPagination ?? internalPagination;

  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      onSortingChange ? onSortingChange(next) : setInternalSorting(next);
    },
    [sorting, onSortingChange],
  );

  const handleGlobalFilterChange = useCallback(
    (updater: string | ((old: string) => string)) => {
      const next = typeof updater === "function" ? updater(globalFilter) : updater;
      onGlobalFilterChange ? onGlobalFilterChange(next) : setInternalGlobalFilter(next);
    },
    [globalFilter, onGlobalFilterChange],
  );

  const handleColumnFiltersChange = useCallback(
    (updater: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
      const next = typeof updater === "function" ? updater(columnFilters) : updater;
      onColumnFiltersChange ? onColumnFiltersChange(next) : setInternalColumnFilters(next);
    },
    [columnFilters, onColumnFiltersChange],
  );

  const handleRowSelectionChange = useCallback(
    (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
      const next = typeof updater === "function" ? updater(rowSelection) : updater;
      onRowSelectionChange ? onRowSelectionChange(next) : setInternalRowSelection(next);
    },
    [rowSelection, onRowSelectionChange],
  );

  const handlePaginationChange = useCallback(
    (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      onPaginationChange ? onPaginationChange(next) : setInternalPagination(next);
    },
    [pagination, onPaginationChange],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
      pagination,
    },
    onSortingChange: handleSortingChange as never,
    onGlobalFilterChange: handleGlobalFilterChange as never,
    onColumnFiltersChange: handleColumnFiltersChange as never,
    onRowSelectionChange: handleRowSelectionChange as never,
    onPaginationChange: handlePaginationChange as never,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    enableRowSelection,
    getRowId,
    manualPagination,
    pageCount,
  });

  const cellPadding = compact ? "px-4 py-2" : "px-6 py-4";
  const headerPadding = compact ? "px-4 py-2" : "px-6 py-3";

  if (enableVirtualization) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-lg bg-[var(--dashboard-surface,#ffffff)] shadow-sm",
          bordered && "border border-[var(--dashboard-text-secondary,#6b7280)]/20",
          className,
        )}
      >
        <VirtualRows
          table={table}
          rowHeight={rowHeight}
          onRowClick={onRowClick}
          compact={compact}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg bg-[var(--dashboard-surface,#ffffff)] shadow-sm",
        bordered && "border border-[var(--dashboard-text-secondary,#6b7280)]/20",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--dashboard-text-secondary,#6b7280)]/20">
          <thead
            className={cn(
              "bg-[var(--dashboard-text-secondary,#6b7280)]/5",
              stickyHeader && "sticky top-0 z-10",
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className={cn(
                      "text-left text-xs font-semibold text-[var(--dashboard-text-secondary,#6b7280)] uppercase tracking-wider",
                      headerPadding,
                      header.column.getCanSort() && "cursor-pointer select-none",
                    )}
                    style={header.getSize() !== 150 ? { width: header.getSize() } : undefined}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <SortIcon sorted={header.column.getIsSorted()} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[var(--dashboard-text-secondary,#6b7280)]/20">
            {isLoading ? (
              <DataGridSkeleton
                columns={columns.length}
                rows={skeletonRows}
                compact={compact}
              />
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <div className="text-center">
                    {emptyIcon || (
                      <svg
                        className="mx-auto h-10 w-10 text-[var(--dashboard-text-secondary,#6b7280)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                    <p className="mt-3 text-sm text-[var(--dashboard-text-secondary,#6b7280)]">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer",
                    "hover:bg-[var(--dashboard-text-secondary,#6b7280)]/5",
                    row.getIsSelected() && "bg-[var(--dashboard-primary,#37a501)]/5",
                    striped && rowIndex % 2 === 1 && "bg-[var(--dashboard-text-secondary,#6b7280)]/3",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        cellPadding,
                        "text-sm text-[var(--dashboard-text-primary,#2d2d2d)]",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(onPaginationChange || !manualPagination) &&
        table.getPageCount() > 1 && (
          <div className="flex items-center justify-between gap-4 flex-wrap border-t border-[var(--dashboard-text-secondary,#6b7280)]/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <select
                value={pagination.pageSize}
                onChange={(e) =>
                  handlePaginationChange({
                    pageIndex: 0,
                    pageSize: Number(e.target.value),
                  })
                }
                className="rounded-md border border-[var(--dashboard-text-secondary,#6b7280)]/30 bg-[var(--dashboard-surface,#ffffff)] px-2 py-1 text-sm text-[var(--dashboard-text-primary,#2d2d2d)]"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-[var(--dashboard-text-secondary,#6b7280)]">
                por pagina
              </span>
            </div>

            <span className="text-sm text-[var(--dashboard-text-secondary,#6b7280)]">
              Pagina {pagination.pageIndex + 1} de {table.getPageCount()}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="rounded-md p-1.5 text-[var(--dashboard-text-secondary,#6b7280)] hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Pagina anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="rounded-md p-1.5 text-[var(--dashboard-text-secondary,#6b7280)] hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Proxima pagina"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
