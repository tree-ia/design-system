"use client";

import React, { ReactNode } from "react";

export interface PageLayoutProps {
  /** Titulo principal da pagina */
  title: string;
  /** Descricao opcional da pagina (aparece abaixo do titulo) */
  description?: string;
  /** Componentes de filtros ou acoes para o header (ex: PeriodFilter, botoes) */
  headerActions?: ReactNode;
  /** Conteudo principal da pagina */
  children: ReactNode;
  /** Se true, aplica padding no conteudo. Default: true */
  contentPadding?: boolean;
  /** Componente de sidebar a ser renderizado */
  sidebar?: ReactNode;
  /** Se a sidebar esta recolhida */
  sidebarCollapsed?: boolean;
  /** Largura da sidebar expandida em px. Default: 280 */
  sidebarWidth?: number;
  /** Largura da sidebar recolhida em px. Default: 109 */
  sidebarCollapsedWidth?: number;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function PageLayout({
  title,
  description,
  headerActions,
  children,
  contentPadding = true,
  sidebar,
  sidebarCollapsed = false,
  sidebarWidth = 280,
  sidebarCollapsedWidth = 109,
  className,
}: PageLayoutProps) {
  const marginLeft = sidebar
    ? sidebarCollapsed
      ? `max(0px, ${sidebarCollapsedWidth}px)`
      : `max(0px, ${sidebarWidth}px)`
    : "0px";

  return (
    <div className={cn("min-h-screen bg-[var(--dashboard-background,#f2f2f2)]", className)}>
      {sidebar}
      <main
        className={cn("pt-16 xl:pt-0", !sidebar && "pt-0")}
        style={{
          marginLeft,
          transition: "margin-left 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <style>{`
          @media (max-width: 1279px) {
            main {
              margin-left: 0 !important;
            }
          }
        `}</style>

        {/* Header com titulo e acoes */}
        <div className="border-b border-[var(--dashboard-text-secondary,#6b7280)]/20 px-6 py-4 bg-[var(--dashboard-surface,#ffffff)]">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-[var(--dashboard-text-primary,#2d2d2d)]">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-[var(--dashboard-text-secondary,#6b7280)] mt-1">
                {description}
              </p>
            )}
          </div>

          {headerActions && <div>{headerActions}</div>}
        </div>

        {/* Conteudo principal */}
        <div className={contentPadding ? "p-6" : ""}>{children}</div>
      </main>
    </div>
  );
}
