import React, { ReactNode } from "react";
import { Loading } from "../Loading";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  emptyMessage = "Nenhum registro encontrado",
  emptyIcon,
  loadingComponent,
  emptyComponent,
  keyExtractor,
  className = "",
}: TableProps<T>) {
  if (isLoading) {
    return loadingComponent ? <>{loadingComponent}</> : <TableSkeleton />;
  }

  if (data.length === 0) {
    return emptyComponent ? (
      <>{emptyComponent}</>
    ) : (
      <TableEmpty message={emptyMessage} icon={emptyIcon} />
    );
  }

  return (
    <div
      className={`overflow-x-auto bg-[var(--dashboard-surface,#ffffff)] rounded-xl border border-[var(--dashboard-text-secondary,#64748B)]/12 dashboard-shadow-sm ${className}`}
    >
      <table className="min-w-full divide-y divide-[var(--dashboard-text-secondary,#64748B)]/10">
        <TableHeader columns={columns} />
        <TableBody
          columns={columns}
          data={data}
          onRowClick={onRowClick}
          keyExtractor={keyExtractor}
        />
      </table>
    </div>
  );
}

export function TableHeader<T>({ columns }: { columns: TableColumn<T>[] }) {
  const alignClass = (align?: string) =>
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";

  return (
    <thead className="bg-[var(--dashboard-background,#F8FAFC)] sticky top-0 z-10">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={`px-6 py-3 text-[0.6875rem] font-semibold text-[var(--dashboard-text-secondary,#64748B)] uppercase tracking-wider ${alignClass(column.align)} ${
              column.width ? `w-[${column.width}]` : ""
            }`}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function TableBody<T>({
  columns,
  data,
  onRowClick,
  keyExtractor,
}: {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  keyExtractor: (item: T) => string;
}) {
  const alignClass = (align?: string) =>
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";

  return (
    <tbody className="bg-[var(--dashboard-surface,#ffffff)] divide-y divide-[var(--dashboard-text-secondary,#64748B)]/8">
      {data.map((item, index) => (
        <tr
          key={keyExtractor(item)}
          onClick={() => onRowClick?.(item)}
          className={`transition-colors duration-150 ${
            index % 2 === 1 ? "bg-[var(--dashboard-text-secondary,#64748B)]/[0.02]" : ""
          } hover:bg-[var(--dashboard-primary,#2563EB)]/[0.04] ${
            onRowClick ? "cursor-pointer" : ""
          }`}
        >
          {columns.map((column) => (
            <td
              key={column.key}
              className={`px-6 py-3.5 whitespace-nowrap text-sm leading-snug ${alignClass(column.align)}`}
            >
              {column.render(item)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-[var(--dashboard-surface,#ffffff)] rounded-xl border border-[var(--dashboard-text-secondary,#64748B)]/12 dashboard-shadow-sm p-6">
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Carregando dados..." />
      </div>
    </div>
  );
}

export function TableEmpty({
  message,
  icon,
}: {
  message: string;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-[var(--dashboard-surface,#ffffff)] rounded-xl border border-[var(--dashboard-text-secondary,#64748B)]/12 dashboard-shadow-sm p-12">
      <div className="text-center">
        {icon || (
          <svg
            className="mx-auto h-12 w-12 text-[var(--dashboard-text-secondary,#64748B)]/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
        <p className="mt-4 text-sm text-[var(--dashboard-text-secondary,#64748B)]">{message}</p>
      </div>
    </div>
  );
}
