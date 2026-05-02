import React, { ReactNode } from "react";

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
      className={`overflow-x-auto bg-[var(--dashboard-surface,#272c33)] rounded-xl border border-[var(--dashboard-border,#3e4451)] ${className}`}
    >
      <table className="min-w-full divide-y divide-[var(--dashboard-border,#3e4451)]">
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
    <thead className="bg-[var(--dashboard-surface,#272c33)] sticky top-0 z-10">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={`px-6 py-3 text-xs font-semibold text-[var(--dashboard-text-secondary,#9da5b3)] uppercase tracking-wider ${alignClass(column.align)} ${
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
    <tbody className="bg-[var(--dashboard-surface,#272c33)] divide-y divide-[var(--dashboard-border,#3e4451)]/50">
      {data.map((item, index) => (
        <tr
          key={keyExtractor(item)}
          onClick={() => onRowClick?.(item)}
          className={`transition-colors duration-150 ${
            index % 2 === 1
              ? "bg-[var(--dashboard-text-secondary,#9da5b3)]/[0.02]"
              : ""
          } hover:bg-[var(--dashboard-text-secondary,#9da5b3)]/[0.02] ${
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
    <div className="bg-[var(--dashboard-surface,#272c33)] rounded-xl border border-[var(--dashboard-border,#3e4451)] p-6">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-4">
            <div className="h-4 flex-1 rounded bg-[var(--dashboard-border,#3e4451)]/70" />
            <div className="h-4 w-28 rounded bg-[var(--dashboard-border,#3e4451)]/70" />
            <div className="h-4 w-20 rounded bg-[var(--dashboard-border,#3e4451)]/70" />
          </div>
        ))}
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
    <div className="bg-[var(--dashboard-surface,#272c33)] rounded-xl border border-[var(--dashboard-border,#3e4451)] p-12">
      <div className="text-center">
        {icon || (
          <svg
            className="mx-auto h-12 w-12 text-[var(--dashboard-text-secondary,#9da5b3)]/40"
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
        <p className="mt-4 text-sm text-[var(--dashboard-text-secondary,#9da5b3)]">
          {message}
        </p>
      </div>
    </div>
  );
}
