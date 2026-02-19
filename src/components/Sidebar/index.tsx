"use client";

import React, { useState, ReactNode } from "react";
import { LogOut, ChevronDown, User } from "lucide-react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface SidebarUser {
  name: string;
  email: string;
  subtitle?: string;
}

export interface SidebarProps {
  menuItems: SidebarMenuItem[];
  logo: ReactNode;
  collapsedLogo?: ReactNode;
  currentPath: string;
  linkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
  }>;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  user?: SidebarUser;
  onUserClick?: () => void;
  onLogout?: () => void;
  logoutLabel?: string;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

function DefaultLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function Sidebar({
  menuItems,
  logo,
  collapsedLogo,
  currentPath,
  linkComponent: LinkComponent = DefaultLink,
  isCollapsed = false,
  onToggleCollapse,
  user,
  onUserClick,
  onLogout,
  logoutLabel = "Sair",
  className,
}: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cubicBezier = "cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <>
      {/* Mobile Header */}
      <header className="xl:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--dashboard-background,#f2f2f2)] border-b border-[var(--dashboard-text-secondary,#6b7280)]/20">
        <div className="flex items-center justify-center px-4 h-16 relative">
          <div className="flex items-center">{logo}</div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="absolute right-4 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer bg-[var(--dashboard-primary,#37a501)]/10 text-[var(--dashboard-text-primary,#2d2d2d)] hover:bg-[var(--dashboard-primary,#37a501)]/20 h-10 w-10"
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <ChevronDown
              size={24}
              className={`transition-transform duration-200 ${
                isMobileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav
          className={`absolute top-16 left-0 right-0 bg-[var(--dashboard-background,#f2f2f2)] border-b border-[var(--dashboard-text-secondary,#6b7280)]/20 shadow-lg transition-all duration-200 overflow-hidden ${
            isMobileMenuOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <div className="px-4 py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;

              return (
                <LinkComponent
                  key={item.id}
                  href={item.href}
                  className="block"
                >
                  <div
                    className={cn(
                      "w-full flex items-center justify-start px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 cursor-pointer",
                      isActive
                        ? "bg-[var(--dashboard-primary,#37a501)]/15 text-[var(--dashboard-primary,#37a501)]"
                        : "text-[var(--dashboard-text-primary,#2d2d2d)] hover:bg-[var(--dashboard-primary,#37a501)]/5",
                    )}
                  >
                    <Icon size={20} className="mr-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                </LinkComponent>
              );
            })}

            <div className="mt-2 pt-2 border-t border-[var(--dashboard-text-secondary,#6b7280)]/20 space-y-2">
              {user && (
                <button
                  onClick={onUserClick}
                  className="w-full flex items-center px-4 py-3 rounded-lg bg-[var(--dashboard-text-secondary,#6b7280)]/10 hover:bg-[var(--dashboard-text-secondary,#6b7280)]/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--dashboard-primary,#37a501)]/20 text-[var(--dashboard-text-primary,#2d2d2d)] flex-shrink-0">
                    <User size={16} />
                  </div>
                  <div className="ml-3 text-left">
                    {user.subtitle && (
                      <p className="text-xs text-[var(--dashboard-text-secondary,#6b7280)] whitespace-nowrap truncate">
                        {user.subtitle}
                      </p>
                    )}
                    <p className="text-sm font-medium text-[var(--dashboard-text-primary,#2d2d2d)] whitespace-nowrap truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-[var(--dashboard-text-secondary,#6b7280)] whitespace-nowrap truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              )}

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-start px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-[var(--dashboard-text-primary,#2d2d2d)] hover:bg-[var(--dashboard-primary,#37a501)]/5"
                >
                  <LogOut size={20} className="mr-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">{logoutLabel}</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden xl:flex xl:flex-col xl:fixed xl:left-0 xl:top-0 xl:h-screen bg-[var(--dashboard-background,#f2f2f2)] border-r border-[var(--dashboard-text-secondary,#6b7280)]/20 overflow-visible",
          isCollapsed ? "xl:w-[109px]" : "xl:w-[280px]",
          className,
        )}
        style={{ transition: `width 400ms ${cubicBezier}` }}
      >
        {/* Toggle Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute top-16 -right-[20px] -translate-y-1/2 z-50 flex items-center justify-center cursor-pointer"
            aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            style={{ width: "20px", height: "193px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="193"
              viewBox="0 0 20 193"
              fill="none"
              className="absolute inset-0"
            >
              <path
                d="M10.2036 118.86C14.8518 115.918 19.5 107.801 19.5 95.9116C19.5 84.0223 15.672 76.4939 10.2036 72.9634C4.73505 69.4329 2.54765 63.5488 1.72738 55.8994L1.72738 136.512C2.82108 125.921 5.55533 121.802 10.2036 118.86Z"
                fill="var(--dashboard-background,#f2f2f2)"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`relative z-10 ${isCollapsed ? "" : "rotate-180"}`}
              style={{
                transition: `transform 400ms ${cubicBezier}`,
              }}
            >
              <path
                d="M4.5 2L8.5 6L4.5 10"
                stroke="var(--dashboard-primary,#37a501)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo */}
          <div className="flex justify-center items-center py-6 px-4 border-b border-[var(--dashboard-text-secondary,#6b7280)]/20 overflow-hidden relative">
            {collapsedLogo && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  opacity: isCollapsed ? 1 : 0,
                  transition: `opacity 400ms ${cubicBezier}`,
                  pointerEvents: isCollapsed ? "auto" : "none",
                }}
              >
                {collapsedLogo}
              </div>
            )}
            <div
              className="flex items-center justify-center"
              style={{
                opacity: !isCollapsed || !collapsedLogo ? 1 : 0,
                transition: `opacity 400ms ${cubicBezier}`,
                pointerEvents:
                  !isCollapsed || !collapsedLogo ? "auto" : "none",
              }}
            >
              {logo}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;

              return (
                <LinkComponent
                  key={item.id}
                  href={item.href}
                  className="block"
                >
                  <div
                    className={cn(
                      "w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium cursor-pointer",
                      isCollapsed ? "justify-center" : "justify-start",
                      isActive
                        ? "bg-[var(--dashboard-primary,#37a501)]/15 text-[var(--dashboard-primary,#37a501)]"
                        : "text-[var(--dashboard-text-primary,#2d2d2d)] hover:bg-[var(--dashboard-primary,#37a501)]/5",
                    )}
                    style={{
                      transition: "background-color 200ms, color 200ms",
                    }}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span
                      className="flex-shrink-0"
                      style={{
                        marginRight: isCollapsed ? 0 : "0.75rem",
                        transition: `margin 400ms ${cubicBezier}`,
                      }}
                    >
                      <Icon size={20} />
                    </span>
                    <span
                      className="whitespace-nowrap overflow-hidden"
                      style={{
                        width: isCollapsed ? 0 : "auto",
                        opacity: isCollapsed ? 0 : 1,
                        transition: `width 400ms ${cubicBezier}, opacity 400ms ${cubicBezier}`,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </LinkComponent>
              );
            })}
          </nav>

          {/* Footer */}
          <footer className="p-4 border-t border-[var(--dashboard-text-secondary,#6b7280)]/20 space-y-2">
            {user && (
              <button
                onClick={onUserClick}
                className={cn(
                  "w-full flex items-center px-4 py-3 rounded-lg bg-[var(--dashboard-text-secondary,#6b7280)]/10 hover:bg-[var(--dashboard-text-secondary,#6b7280)]/20 transition-colors cursor-pointer",
                  isCollapsed ? "justify-center" : "justify-start",
                )}
                title={
                  isCollapsed
                    ? `${user.subtitle ? user.subtitle + " - " : ""}${user.name}`
                    : undefined
                }
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--dashboard-primary,#37a501)]/20 text-[var(--dashboard-text-primary,#2d2d2d)] flex-shrink-0">
                  <User size={16} />
                </div>
                <div
                  className="ml-3 overflow-hidden text-left"
                  style={{
                    width: isCollapsed ? 0 : "auto",
                    opacity: isCollapsed ? 0 : 1,
                    transition: `width 400ms ${cubicBezier}, opacity 400ms ${cubicBezier}`,
                  }}
                >
                  {user.subtitle && (
                    <p className="text-xs text-[var(--dashboard-text-secondary,#6b7280)] whitespace-nowrap truncate">
                      {user.subtitle}
                    </p>
                  )}
                  <p className="text-sm font-medium text-[var(--dashboard-text-primary,#2d2d2d)] whitespace-nowrap truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-[var(--dashboard-text-secondary,#6b7280)] whitespace-nowrap truncate">
                    {user.email}
                  </p>
                </div>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className={cn(
                  "w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-[var(--dashboard-text-primary,#2d2d2d)] hover:bg-[var(--dashboard-primary,#37a501)]/5",
                  isCollapsed ? "justify-center" : "justify-start",
                )}
                title={isCollapsed ? logoutLabel : undefined}
              >
                <LogOut
                  size={20}
                  className="flex-shrink-0"
                  style={{
                    marginRight: isCollapsed ? 0 : "0.75rem",
                    transition: `margin 400ms ${cubicBezier}`,
                  }}
                />
                <span
                  className="whitespace-nowrap overflow-hidden"
                  style={{
                    width: isCollapsed ? 0 : "auto",
                    opacity: isCollapsed ? 0 : 1,
                    transition: `width 400ms ${cubicBezier}, opacity 400ms ${cubicBezier}`,
                  }}
                >
                  {logoutLabel}
                </span>
              </button>
            )}
          </footer>
        </div>
      </aside>
    </>
  );
}
