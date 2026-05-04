"use client";

import React, { ReactNode } from "react";

export interface PageLayoutProps {
  /** Texto curto acima do titulo principal */
  eyebrow?: string;
  /** Titulo principal da pagina */
  title: string;
  /** Descricao opcional da pagina (aparece abaixo do titulo) */
  description?: string;
  /** Componentes de filtros ou acoes para o header (ex: PeriodFilter, botoes) */
  headerActions?: ReactNode;
  /** Header principal da aplicacao, usado em layouts com navegacao superior */
  appHeader?: ReactNode;
  /** Conteudo principal da pagina */
  children: ReactNode;
  /** Se true, aplica padding no conteudo. Default: true */
  contentPadding?: boolean;
  /** Classes extras aplicadas no wrapper do conteudo */
  contentClassName?: string;
  /** Faz o conteudo ocupar a altura util da viewport, com scroll interno no filho */
  contentFillViewport?: boolean;
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
  eyebrow,
  title,
  description,
  headerActions,
  appHeader,
  children,
  contentPadding = true,
  contentClassName,
  contentFillViewport = false,
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
  const mainTopPadding = appHeader
    ? "pt-24"
    : sidebar
      ? "pt-16 xl:pt-0"
      : "pt-0";
  const layoutContainer = "mx-[var(--dashboard-page-gutter)]";

  return (
    <div
      className={cn(
        "min-h-screen bg-[var(--dashboard-background,#f2f2f2)] [--dashboard-page-gutter:1.5rem] sm:[--dashboard-page-gutter:2rem] lg:[--dashboard-page-gutter:2.5rem] xl:[--dashboard-page-gutter:3rem]",
        className,
      )}
    >
      {appHeader}
      {sidebar}
      <main
        className={cn(
          mainTopPadding,
          "box-border flex flex-col",
          contentFillViewport ? "h-dvh overflow-hidden" : "min-h-dvh",
        )}
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
        <div
          className={cn(
            layoutContainer,
            "mt-4 box-border px-6 py-5 sm:px-8 lg:px-10",
          )}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              {eyebrow && (
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--dashboard-text-secondary,#6b7280)]">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--dashboard-text-primary,#2d2d2d)] sm:text-3xl">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-sm font-medium text-[var(--dashboard-text-secondary,#6b7280)]">
                  {description}
                </p>
              )}
            </div>

            {headerActions && (
              <div className="flex max-w-full justify-start lg:justify-end">
                {headerActions}
              </div>
            )}
          </div>
        </div>

        {/* Conteudo principal */}
        <div
          className={
            contentPadding
              ? cn(layoutContainer, "min-h-0 flex-1 pb-6 pt-5", contentClassName)
              : cn("min-h-0 flex-1", contentClassName)
          }
        >
          {children}
        </div>
      </main>
    </div>
  );
}
