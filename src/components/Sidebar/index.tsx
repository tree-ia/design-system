"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { LogOut, ChevronDown, ChevronRight, User } from "lucide-react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  /** Optional section header — rendered above this item when set */
  section?: string;
  /** Child items — renders as expandable sub-menu */
  children?: SidebarMenuItem[];
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
  /** Extra items rendered in the footer, above the logout button */
  footerItems?: SidebarMenuItem[];
  /** Arbitrary content rendered between the user info block and footerItems */
  footerSlot?: ReactNode;
  /** Initial expanded sub-menu IDs (pass from server to avoid hydration mismatch). */
  defaultExpandedIds?: string[];
  /** Cookie/localStorage key for persisting expanded state across reloads. */
  persistExpandedKey?: string;
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
  footerItems,
  footerSlot,
  defaultExpandedIds,
  persistExpandedKey,
  className,
}: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds ?? []),
  );

  const cubicBezier = "cubic-bezier(0.4, 0, 0.2, 1)";

  // Auto-expand parent items whose children match the current path
  useEffect(() => {
    const idsToExpand: string[] = [];
    for (const item of menuItems) {
      if (item.children?.some((c) => currentPath === c.href)) {
        idsToExpand.push(item.id);
      }
    }
    if (footerItems) {
      for (const item of footerItems) {
        if (item.children?.some((c) => currentPath === c.href)) {
          idsToExpand.push(item.id);
        }
      }
    }
    if (idsToExpand.length > 0) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        for (const id of idsToExpand) next.add(id);
        return next;
      });
    }
  }, [currentPath, menuItems, footerItems]);

  // Persist expanded IDs to cookie (SSR-readable) + localStorage (fallback)
  useEffect(() => {
    if (persistExpandedKey && typeof document !== "undefined") {
      const json = JSON.stringify([...expandedIds]);
      try { localStorage.setItem(persistExpandedKey, json); } catch { /* ignore */ }
      document.cookie = `${persistExpandedKey}=${encodeURIComponent(json)}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [expandedIds, persistExpandedKey]);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function isItemActive(item: SidebarMenuItem): boolean {
    if (currentPath === item.href) return true;
    if (item.children?.some((c) => currentPath === c.href)) return true;
    return false;
  }

  /** Group items by section — items before any section go into a null group */
  function groupBySection(items: SidebarMenuItem[]) {
    const groups: { section: string | null; items: SidebarMenuItem[] }[] = [];
    for (const item of items) {
      if (item.section) {
        groups.push({ section: item.section, items: [item] });
      } else {
        if (groups.length === 0) groups.push({ section: null, items: [] });
        groups[groups.length - 1]!.items.push(item);
      }
    }
    return groups;
  }

  // ── Shared render helpers ──────────────────────────────────────────

  function renderSectionHeader(section: string, collapsed: boolean) {
    if (collapsed) {
      return (
        <div className="my-2 mx-2 border-t border-[var(--dashboard-sidebar-border,#2A6510)]" />
      );
    }
    return (
      <div className="mb-1 mt-5 px-4 text-[11px] font-bold uppercase tracking-wider text-[var(--dashboard-sidebar-text,#FFFFFF)]/80">
        {section}
      </div>
    );
  }

  function renderMenuItem(
    item: SidebarMenuItem,
    collapsed: boolean,
    mobile: boolean,
  ) {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isActive = currentPath === item.href;
    const isExpanded = expandedIds.has(item.id);
    const isChildActive = item.children?.some(
      (c) => currentPath === c.href,
    );

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpand(item.id)}
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium cursor-pointer",
              collapsed && !mobile ? "justify-center" : "justify-start",
              isChildActive
                ? "text-[var(--dashboard-sidebar-active-text,#5DD611)]"
                : "text-[var(--dashboard-sidebar-text,#FFFFFF)] hover:bg-[var(--dashboard-primary,#37a501)]/10",
            )}
            style={{ transition: "background-color 200ms, color 200ms" }}
            title={collapsed && !mobile ? item.label : undefined}
          >
            <Icon
              size={20}
              style={{
                marginRight: collapsed && !mobile ? 0 : "0.75rem",
                flexShrink: 0,
                transition: `margin 400ms ${cubicBezier}`,
              }}
            />
            {(!collapsed || mobile) && (
              <>
                <span className="whitespace-nowrap flex-1 text-left">
                  {item.label}
                </span>
                <ChevronRight
                  size={14}
                  className={cn(
                    "ml-auto flex-shrink-0 transition-transform duration-200",
                    isExpanded ? "rotate-90" : "",
                  )}
                />
              </>
            )}
          </button>
          {/* Children */}
          {(!collapsed || mobile) && (
            <div
              className="overflow-hidden transition-all duration-200 ml-7 border-l-2 border-[var(--dashboard-sidebar-border,#2A6510)]"
              style={{
                maxHeight: isExpanded ? `${item.children!.length * 40}px` : "0",
              }}
            >
              {item.children!.map((child) => {
                const ChildIcon = child.icon;
                const childActive = currentPath === child.href;
                return (
                  <LinkComponent
                    key={child.id}
                    href={child.href}
                    className="block"
                  >
                    <div
                      className={cn(
                        "w-full flex items-center pl-4 pr-4 py-2 rounded-r-lg text-[13px] cursor-pointer",
                        childActive
                          ? "text-[var(--dashboard-sidebar-active-text,#5DD611)] font-semibold border-l-2 border-[var(--dashboard-primary,#37a501)] -ml-[2px]"
                          : "text-[var(--dashboard-sidebar-text,#FFFFFF)] hover:text-[var(--dashboard-sidebar-active-text,#5DD611)]",
                      )}
                      style={{
                        transition: "background-color 200ms, color 200ms",
                      }}
                    >
                      <ChildIcon
                        size={15}
                        className="mr-2 flex-shrink-0"
                      />
                      <span className="whitespace-nowrap">{child.label}</span>
                    </div>
                  </LinkComponent>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Simple item (no children)
    return (
      <LinkComponent key={item.id} href={item.href} className="block">
        <div
          className={cn(
            "w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium cursor-pointer",
            collapsed && !mobile ? "justify-center" : "justify-start",
            isActive
              ? "bg-[var(--dashboard-primary,#37a501)]/25 text-[var(--dashboard-sidebar-active-text,#5DD611)]"
              : "text-[var(--dashboard-sidebar-text,#FFFFFF)] hover:bg-[var(--dashboard-primary,#37a501)]/10",
          )}
          style={{ transition: "background-color 200ms, color 200ms" }}
          title={collapsed && !mobile ? item.label : undefined}
        >
          <Icon
            size={20}
            style={{
              marginRight: collapsed && !mobile ? 0 : "0.75rem",
              flexShrink: 0,
              transition: `margin 400ms ${cubicBezier}`,
            }}
          />
          <span
            className="whitespace-nowrap overflow-hidden"
            style={
              !mobile
                ? {
                    width: collapsed ? 0 : "auto",
                    opacity: collapsed ? 0 : 1,
                    transition: `width 400ms ${cubicBezier}, opacity 400ms ${cubicBezier}`,
                  }
                : undefined
            }
          >
            {item.label}
          </span>
        </div>
      </LinkComponent>
    );
  }

  function renderMenuGroups(collapsed: boolean, mobile: boolean) {
    const groups = groupBySection(menuItems);
    return groups.map((group, i) => (
      <div key={group.section || `group-${i}`} className="space-y-1">
        {group.section && renderSectionHeader(group.section, collapsed)}
        {group.items.map((item) => renderMenuItem(item, collapsed, mobile))}
      </div>
    ));
  }

  // ── Mobile Header ──────────────────────────────────────────────────

  const mobileHeader = (
    <header className="xl:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--dashboard-sidebar-bg,#1B4D08)] border-b border-[var(--dashboard-sidebar-border,#2A6510)]">
      <div className="flex items-center justify-center px-4 h-16 relative">
        <div className="flex items-center">{logo}</div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="absolute right-4 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer bg-white/10 text-[var(--dashboard-sidebar-text,#FFFFFF)] hover:bg-white/20 h-10 w-10"
          aria-label="Menu"
          aria-expanded={isMobileMenuOpen}
        >
          <ChevronDown
            size={24}
            className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav
        className={`absolute top-16 left-0 right-0 bg-[var(--dashboard-sidebar-bg,#1B4D08)] border-b border-[var(--dashboard-sidebar-border,#2A6510)] shadow-lg transition-all duration-200 ${
          isMobileMenuOpen
            ? "max-h-[calc(100vh-4rem)] overflow-y-auto"
            : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-2">
          {renderMenuGroups(false, true)}

          <div className="mt-2 pt-2 border-t border-[var(--dashboard-sidebar-border,#2A6510)] space-y-2">
            {user && (
              <button
                onClick={onUserClick}
                className="w-full flex items-center px-4 py-3 rounded-lg bg-[var(--dashboard-primary,#37a501)]/5 hover:bg-[var(--dashboard-primary,#37a501)]/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--dashboard-primary,#37a501)]/30 text-[var(--dashboard-sidebar-text,#FFFFFF)] flex-shrink-0">
                  <User size={16} />
                </div>
                <div className="ml-3 text-left">
                  {user.subtitle && (
                    <p className="text-xs text-[var(--dashboard-sidebar-text,#FFFFFF)]/60 whitespace-nowrap truncate">
                      {user.subtitle}
                    </p>
                  )}
                  <p className="text-sm font-medium text-[var(--dashboard-sidebar-text,#FFFFFF)] whitespace-nowrap truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-[var(--dashboard-sidebar-text,#FFFFFF)]/60 whitespace-nowrap truncate">
                    {user.email}
                  </p>
                </div>
              </button>
            )}

            {footerSlot}

            {footerItems?.map((item) => renderMenuItem(item, false, true))}

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-start px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-[var(--dashboard-sidebar-text,#FFFFFF)] hover:bg-[var(--dashboard-primary,#37a501)]/10"
              >
                <LogOut size={20} className="mr-3 flex-shrink-0" />
                <span className="whitespace-nowrap">{logoutLabel}</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );

  // ── Desktop Sidebar ────────────────────────────────────────────────

  const desktopSidebar = (
    <aside
      className={cn(
        "hidden xl:flex xl:flex-col xl:fixed xl:left-0 xl:top-0 xl:h-screen bg-[var(--dashboard-sidebar-bg,#1B4D08)] border-r border-[var(--dashboard-sidebar-border,#2A6510)] overflow-visible",
        isCollapsed ? "xl:w-[109px]" : "xl:w-[280px]",
        className,
      )}
      style={{ transition: `width 400ms ${cubicBezier}` }}
    >
      {/* Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute top-16 -right-[18px] -translate-y-1/2 z-50 flex items-center justify-center cursor-pointer"
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
            {/* Fill shape — extended to x=0 to fully cover the aside border-r */}
            <path
              d="M10.2036 118.86C14.8518 115.918 19.5 107.801 19.5 95.9116C19.5 84.0223 15.672 76.4939 10.2036 72.9634C4.73505 69.4329 2.54765 63.5488 1.72738 55.8994L0 55.8994L0 136.512L1.72738 136.512C2.82108 125.921 5.55533 121.802 10.2036 118.86Z"
              fill="var(--dashboard-sidebar-bg,#1B4D08)"
            />
            {/* Outer curve stroke — traces only the curved portion */}
            <path
              d="M1.72738 55.8994C2.54765 63.5488 4.73505 69.4329 10.2036 72.9634C15.672 76.4939 19.5 84.0223 19.5 95.9116C19.5 107.801 14.8518 115.918 10.2036 118.86C5.55533 121.802 2.82108 125.921 1.72738 136.512"
              stroke="var(--dashboard-sidebar-border,#2A6510)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`relative z-10 ${isCollapsed ? "" : "rotate-180"}`}
            style={{ transition: `transform 400ms ${cubicBezier}` }}
          >
            <path
              d="M4.5 2L8.5 6L4.5 10"
              stroke="var(--dashboard-sidebar-text,#FFFFFF)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <div className="flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="flex justify-center items-center py-6 px-4 border-b border-[var(--dashboard-sidebar-border,#2A6510)] overflow-hidden relative h-[88px]">
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
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {renderMenuGroups(isCollapsed, false)}
        </nav>

        {/* Footer */}
        <footer className="p-4 border-t border-[var(--dashboard-sidebar-border,#2A6510)] space-y-2">
          {user && (
            <button
              onClick={onUserClick}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-lg bg-[var(--dashboard-primary,#37a501)]/5 hover:bg-[var(--dashboard-primary,#37a501)]/10 transition-colors cursor-pointer",
                isCollapsed ? "justify-center" : "justify-start",
              )}
              title={
                isCollapsed
                  ? `${user.subtitle ? user.subtitle + " - " : ""}${user.name}`
                  : undefined
              }
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--dashboard-primary,#37a501)]/30 text-[var(--dashboard-sidebar-text,#FFFFFF)] flex-shrink-0">
                <User size={16} />
              </div>
              <div
                className="overflow-hidden text-left"
                style={{
                  width: isCollapsed ? 0 : "auto",
                  marginLeft: isCollapsed ? 0 : "0.75rem",
                  opacity: isCollapsed ? 0 : 1,
                  transition: `width 400ms ${cubicBezier}, margin 400ms ${cubicBezier}, opacity 400ms ${cubicBezier}`,
                }}
              >
                {user.subtitle && (
                  <p className="text-xs text-[var(--dashboard-sidebar-text,#FFFFFF)]/60 whitespace-nowrap truncate">
                    {user.subtitle}
                  </p>
                )}
                <p className="text-sm font-medium text-[var(--dashboard-sidebar-text,#FFFFFF)] whitespace-nowrap truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--dashboard-sidebar-text,#FFFFFF)]/60 whitespace-nowrap truncate">
                  {user.email}
                </p>
              </div>
            </button>
          )}

          {footerSlot}

          {footerItems?.map((item) => renderMenuItem(item, isCollapsed, false))}

          {onLogout && (
            <button
              onClick={onLogout}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium cursor-pointer text-[var(--dashboard-sidebar-text,#FFFFFF)] hover:bg-[var(--dashboard-primary,#37a501)]/10",
                isCollapsed ? "justify-center" : "justify-start",
              )}
              style={{ transition: "background-color 200ms" }}
              title={isCollapsed ? logoutLabel : undefined}
            >
              <LogOut
                size={20}
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
  );

  return (
    <>
      {mobileHeader}
      {desktopSidebar}
    </>
  );
}
