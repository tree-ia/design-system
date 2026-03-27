import React, { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  onNavigate?: (href: string) => void;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function Breadcrumb({
  items,
  separator,
  onNavigate,
  className,
}: BreadcrumbProps) {
  const defaultSeparator = (
    <ChevronRight className="h-4 w-4 text-[var(--dashboard-text-secondary,#6b7280)] flex-shrink-0" />
  );

  const handleClick = (e: React.MouseEvent, href?: string) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}

              {isLast ? (
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium",
                    "text-[var(--dashboard-text-primary,#2d2d2d)]",
                  )}
                  aria-current="page"
                >
                  {item.icon && (
                    <span className="flex-shrink-0 h-4 w-4">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || "#"}
                  onClick={(e) => handleClick(e, item.href)}
                  className={cn(
                    "flex items-center gap-1.5 text-sm",
                    "text-[var(--dashboard-text-secondary,#6b7280)]",
                    "hover:text-[var(--dashboard-primary,#37a501)] transition-colors",
                  )}
                >
                  {item.icon && (
                    <span className="flex-shrink-0 h-4 w-4">{item.icon}</span>
                  )}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
