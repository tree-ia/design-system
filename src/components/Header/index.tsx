"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { Building2, Check, ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import type { SidebarMenuItem, SidebarUser } from "../Sidebar";

export interface HeaderMenuChild {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  disabled?: boolean;
}

export interface HeaderMenuGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  children: HeaderMenuChild[];
}

export type HeaderMenuItem = SidebarMenuItem | HeaderMenuGroup;

export type HeaderUser = SidebarUser;

export interface HeaderEstablishment {
  id: string;
  label: string;
  description?: string;
  active?: boolean;
  disabled?: boolean;
}

export interface HeaderProps {
  /** Itens de navegacao exibidos no header */
  menuItems: HeaderMenuItem[];
  /** Logo principal */
  logo: ReactNode;
  /** Rota ativa */
  currentPath: string;
  /** Componente de link do framework consumidor */
  linkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    onClick?: () => void;
    children: ReactNode;
  }>;
  /** Usuario autenticado */
  user?: HeaderUser;
  /** Estabelecimentos exibidos no menu do usuario */
  establishments?: HeaderEstablishment[];
  /** Label da secao de estabelecimentos */
  establishmentsLabel?: string;
  /** Callback ao selecionar um estabelecimento */
  onEstablishmentChange?: (establishmentId: string) => void;
  /** Acoes extras exibidas antes do usuario */
  actions?: ReactNode;
  /** Callback ao clicar no usuario */
  onUserClick?: () => void;
  /** Callback de logout */
  onLogout?: () => void;
  logoutLabel?: string;
  /** Label do botao de menu mobile */
  menuLabel?: string;
  /** Abre dropdowns de navegacao no hover em layouts desktop. Default: true */
  openDropdownOnHover?: boolean;
  /** Offset lateral no desktop quando existe sidebar fixa */
  desktopOffsetLeft?: number | string;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

function isGroup(item: HeaderMenuItem): item is HeaderMenuGroup {
  return "children" in item && Array.isArray(item.children);
}

function DefaultLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export function Header({
  menuItems,
  logo,
  currentPath,
  linkComponent: LinkComponent = DefaultLink,
  user,
  establishments = [],
  establishmentsLabel = "Estabelecimento",
  onEstablishmentChange,
  actions,
  onUserClick,
  onLogout,
  logoutLabel = "Sair",
  menuLabel = "Menu",
  openDropdownOnHover = true,
  desktopOffsetLeft = 0,
  className,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const hoverCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useOnClickOutside(dropdownRef, () => setOpenDropdownId(null));
  useOnClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  useEffect(() => {
    return () => {
      if (hoverCloseTimeoutRef.current) {
        clearTimeout(hoverCloseTimeoutRef.current);
      }
    };
  }, []);

  const clearHoverCloseTimeout = () => {
    if (!hoverCloseTimeoutRef.current) return;
    clearTimeout(hoverCloseTimeoutRef.current);
    hoverCloseTimeoutRef.current = null;
  };

  const closeMenus = () => {
    clearHoverCloseTimeout();
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setOpenDropdownId(null);
  };

  const isItemActive = (item: HeaderMenuItem) => {
    if (isGroup(item)) {
      return item.children.some(
        (child) =>
          currentPath === child.href ||
          (child.href !== "/dashboard" && currentPath.startsWith(child.href))
      );
    }
    return currentPath === item.href;
  };

  const renderNavLink = (
    item: SidebarMenuItem,
    options: { mobile?: boolean } = {}
  ) => {
    const Icon = item.icon;
    const active = currentPath === item.href;

    if (item.disabled) {
      return (
        <span
          key={item.id}
          className={cn(
            "flex items-center gap-2 rounded-lg text-sm font-medium cursor-not-allowed",
            options.mobile
              ? "px-4 py-3"
              : "h-10 px-3",
            "text-[var(--dashboard-text-secondary,#6b7280)]/40"
          )}
          title="Em breve"
        >
          <Icon size={18} className="flex-shrink-0 opacity-40" />
          <span className="line-through opacity-50">{item.label}</span>
        </span>
      );
    }

    return (
      <LinkComponent
        key={item.id}
        href={item.href}
        className="block"
        onClick={closeMenus}
      >
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg text-sm font-medium transition-colors",
            options.mobile
              ? "px-4 py-3"
              : "h-10 px-3",
            active
              ? "bg-[var(--dashboard-primary,#37a501)]/12 text-[var(--dashboard-primary,#37a501)]"
              : "text-[var(--dashboard-text-secondary,#6b7280)] hover:bg-[var(--dashboard-primary,#37a501)]/8 hover:text-[var(--dashboard-text-primary,#2d2d2d)]"
          )}
          aria-current={active ? "page" : undefined}
        >
          <Icon size={18} className="flex-shrink-0" />
          <span>{item.label}</span>
        </div>
      </LinkComponent>
    );
  };

  const renderDropdown = (
    group: HeaderMenuGroup,
    options: { mobile?: boolean } = {}
  ) => {
    const Icon = group.icon;
    const groupActive = isItemActive(group);
    const isOpen = openDropdownId === group.id;

    if (options.mobile) {
      return (
        <div key={group.id} className="space-y-1">
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--dashboard-text-secondary,#6b7280)]">
            <Icon size={16} />
            {group.label}
          </div>
          <div className="ml-3 space-y-1 border-l border-[var(--dashboard-text-secondary,#6b7280)]/20 pl-3">
            {group.children.map((child) => {
              const active = currentPath === child.href;
              return (
                child.disabled ? (
                  <span
                    key={child.id}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium cursor-not-allowed text-[var(--dashboard-text-secondary,#6b7280)]/40"
                    title="Em breve"
                  >
                    <child.icon size={16} className="flex-shrink-0 opacity-40" />
                    <span className="line-through opacity-50">{child.label}</span>
                  </span>
                ) : (
                  <LinkComponent
                    key={child.id}
                    href={child.href}
                    className="block"
                    onClick={closeMenus}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-[var(--dashboard-primary,#37a501)]/12 text-[var(--dashboard-primary,#37a501)]"
                          : "text-[var(--dashboard-text-secondary,#6b7280)] hover:bg-[var(--dashboard-primary,#37a501)]/8 hover:text-[var(--dashboard-text-primary,#2d2d2d)]"
                      )}
                    >
                      <child.icon size={16} className="flex-shrink-0" />
                      <span>{child.label}</span>
                    </div>
                  </LinkComponent>
                )
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div
        key={group.id}
        className="relative"
        ref={isOpen ? dropdownRef : undefined}
        onMouseEnter={() => {
          if (!openDropdownOnHover) return;
          clearHoverCloseTimeout();
          setOpenDropdownId(group.id);
        }}
        onMouseLeave={() => {
          if (!openDropdownOnHover) return;
          hoverCloseTimeoutRef.current = setTimeout(() => {
            setOpenDropdownId((current) => (current === group.id ? null : current));
            hoverCloseTimeoutRef.current = null;
          }, 120);
        }}
      >
        <button
          type="button"
          onClick={() => {
            clearHoverCloseTimeout();
            setOpenDropdownId((prev) => (prev === group.id ? null : group.id));
          }}
          className={cn(
            "flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
            groupActive
              ? "bg-[var(--dashboard-primary,#37a501)]/12 text-[var(--dashboard-primary,#37a501)]"
              : "text-[var(--dashboard-text-secondary,#6b7280)] hover:bg-[var(--dashboard-primary,#37a501)]/8 hover:text-[var(--dashboard-text-primary,#2d2d2d)]"
          )}
          aria-expanded={isOpen}
        >
          <Icon size={18} className="flex-shrink-0" />
          <span>{group.label}</span>
          <ChevronDown
            size={14}
            className={cn("flex-shrink-0 transition-transform", isOpen && "rotate-180")}
          />
        </button>

        {isOpen && (
          <div className="absolute left-1/2 top-[calc(100%+0.5rem)] z-50 w-max min-w-full max-w-[24rem] -translate-x-1/2 rounded-xl border border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)] p-1.5 shadow-xl">
            {group.children.map((child) => {
              const active = currentPath === child.href;
              return (
                child.disabled ? (
                  <span
                    key={child.id}
                    className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--dashboard-text-secondary,#6b7280)]/40"
                    title="Em breve"
                  >
                    <child.icon size={16} className="flex-shrink-0 opacity-40" />
                    <span className="whitespace-nowrap line-through opacity-50">{child.label}</span>
                  </span>
                ) : (
                  <LinkComponent
                    key={child.id}
                    href={child.href}
                    className="block"
                    onClick={() => setOpenDropdownId(null)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-[var(--dashboard-primary,#37a501)]/10 text-[var(--dashboard-primary,#37a501)] font-semibold"
                          : "text-[var(--dashboard-text-primary,#2d2d2d)]/80 hover:bg-[var(--dashboard-primary,#37a501)]/8 hover:text-[var(--dashboard-text-primary,#2d2d2d)]"
                      )}
                    >
                      <child.icon size={16} className="flex-shrink-0" />
                      <span className="whitespace-nowrap">{child.label}</span>
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--dashboard-primary,#37a501)]" />
                      )}
                    </div>
                  </LinkComponent>
                )
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderNavItem = (
    item: HeaderMenuItem,
    options: { mobile?: boolean } = {}
  ) => {
    if (isGroup(item)) {
      return renderDropdown(item, options);
    }
    return renderNavLink(item, options);
  };

  const desktopOffset =
    typeof desktopOffsetLeft === "number"
      ? `${desktopOffsetLeft}px`
      : desktopOffsetLeft;
  const userEstablishments =
    establishments.length > 0
      ? establishments
      : user?.subtitle
        ? [
            {
              id: "current",
              label: user.subtitle,
              active: true,
            },
          ]
        : [];

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-2 bg-[var(--dashboard-background,#f2f2f2)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[var(--dashboard-page-gutter,0px)] right-[var(--dashboard-page-gutter,0px)] top-2 z-30 h-5 bg-[var(--dashboard-background,#f2f2f2)] transition-[left,right] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] min-[800px]:left-[calc(var(--dashboard-header-offset-left,0px)+var(--dashboard-page-gutter,0px))]"
        style={
          {
            "--dashboard-header-offset-left": desktopOffset,
          } as React.CSSProperties
        }
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[var(--dashboard-page-gutter,0px)] top-2 z-30 h-14 w-5 bg-[var(--dashboard-background,#f2f2f2)] transition-[left] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] min-[800px]:left-[calc(var(--dashboard-header-offset-left,0px)+var(--dashboard-page-gutter,0px))]"
        style={
          {
            "--dashboard-header-offset-left": desktopOffset,
          } as React.CSSProperties
        }
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[var(--dashboard-page-gutter,0px)] top-2 z-30 h-14 w-5 bg-[var(--dashboard-background,#f2f2f2)] transition-[right] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[var(--dashboard-page-gutter,0px)] right-[var(--dashboard-page-gutter,0px)] top-2 z-30 h-20 rounded-2xl bg-[var(--dashboard-background,#f2f2f2)] transition-[left,right] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] min-[800px]:left-[calc(var(--dashboard-header-offset-left,0px)+var(--dashboard-page-gutter,0px))]"
        style={
          {
            "--dashboard-header-offset-left": desktopOffset,
          } as React.CSSProperties
        }
      />

      <header
        className={cn(
          "fixed left-[var(--dashboard-page-gutter,0px)] right-[var(--dashboard-page-gutter,0px)] top-2 z-40 rounded-2xl border border-[var(--dashboard-text-secondary,#6b7280)]/15 bg-[var(--dashboard-surface,#ffffff)] text-[var(--dashboard-text-primary,#2d2d2d)] dashboard-header-shadow transition-[left,right] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] min-[800px]:left-[calc(var(--dashboard-header-offset-left,0px)+var(--dashboard-page-gutter,0px))]",
          className,
        )}
        style={
          {
            "--dashboard-header-offset-left": desktopOffset,
          } as React.CSSProperties
        }
      >
      <div className="flex h-20 items-center gap-4 px-4 sm:px-5 min-[800px]:grid min-[800px]:grid-cols-[minmax(7rem,1fr)_auto_minmax(3rem,1fr)] min-[800px]:gap-3 min-[1000px]:grid-cols-[minmax(8rem,1fr)_auto_minmax(10rem,1fr)] min-[1120px]:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:flex-none min-[800px]:col-start-1 min-[800px]:justify-self-start">
          <div className="flex min-w-0 items-center">{logo}</div>
        </div>

        <nav
          className="hidden min-w-0 items-center justify-center gap-1 min-[800px]:col-start-2 min-[800px]:flex"
          aria-label="Navegacao principal"
        >
          {menuItems.map((item) => renderNavItem(item))}
        </nav>

        <div className="hidden items-center gap-3 min-[800px]:col-start-3 min-[800px]:flex min-[800px]:justify-self-end">
          {actions}

          {user && (
            <div className="relative w-11 min-[1000px]:w-[220px] min-[1120px]:w-[260px]" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-[var(--dashboard-background,#f2f2f2)] px-0 text-left transition-colors hover:bg-[var(--dashboard-primary,#37a501)]/8 min-[1000px]:justify-start min-[1000px]:px-3"
                aria-expanded={isUserMenuOpen}
                aria-label={user.name}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--dashboard-primary,#37a501)]/12 text-[var(--dashboard-primary,#37a501)]">
                  <User size={16} />
                </div>
                <div className="hidden min-w-0 flex-1 min-[1000px]:block">
                  {user.subtitle && (
                    <p className="truncate text-[11px] leading-4 text-[var(--dashboard-text-secondary,#6b7280)]">
                      {user.subtitle}
                    </p>
                  )}
                  <p className="truncate text-sm font-medium leading-4">
                    {user.name}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    "ml-auto hidden flex-shrink-0 transition-transform min-[1000px]:block",
                    isUserMenuOpen && "rotate-180",
                  )}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] w-[260px] rounded-lg border border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)] p-2 text-[var(--dashboard-text-primary,#2d2d2d)] shadow-xl min-[1000px]:w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onUserClick?.();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[var(--dashboard-primary,#37a501)]/8"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--dashboard-primary,#37a501)]/12 text-[var(--dashboard-primary,#37a501)]">
                      <User size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                        {user.email}
                      </p>
                    </div>
                  </button>

                  {userEstablishments.length > 0 && (
                    <div className="mt-1 border-t border-[var(--dashboard-text-secondary,#6b7280)]/15 pt-2">
                      <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--dashboard-text-secondary,#6b7280)]">
                        {establishmentsLabel}
                      </p>
                      <div className="space-y-1">
                        {userEstablishments.map((establishment) => {
                          const isDisabled =
                            establishment.disabled ||
                            !onEstablishmentChange ||
                            establishment.active;

                          return (
                            <button
                              key={establishment.id}
                              type="button"
                              onClick={() => {
                                if (isDisabled) return;
                                setIsUserMenuOpen(false);
                                onEstablishmentChange?.(establishment.id);
                              }}
                              disabled={isDisabled}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                                establishment.active
                                  ? "bg-[var(--dashboard-primary,#37a501)]/10 text-[var(--dashboard-primary,#37a501)]"
                                  : "hover:bg-[var(--dashboard-primary,#37a501)]/8",
                                isDisabled
                                  ? establishment.active
                                    ? "cursor-default"
                                    : "cursor-not-allowed opacity-60"
                                  : "cursor-pointer",
                              )}
                            >
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--dashboard-primary,#37a501)]/12 text-[var(--dashboard-primary,#37a501)]">
                                <Building2 size={15} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                  {establishment.label}
                                </p>
                                {establishment.description && (
                                  <p className="truncate text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                                    {establishment.description}
                                  </p>
                                )}
                              </div>
                              {establishment.active && (
                                <Check size={16} className="flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-[var(--dashboard-primary,#37a501)]/8"
                    >
                      <LogOut size={18} />
                      {logoutLabel}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--dashboard-primary,#37a501)]/10 text-[var(--dashboard-primary,#37a501)] transition-colors hover:bg-[var(--dashboard-primary,#37a501)]/15 min-[800px]:hidden"
          aria-label={menuLabel}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)] shadow-lg transition-[max-height] duration-200 min-[800px]:hidden",
          isMobileMenuOpen ? "max-h-[calc(100vh-4rem)]" : "max-h-0",
        )}
      >
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-3">
          <nav className="space-y-1" aria-label="Navegacao principal">
            {menuItems.map((item) => renderNavItem(item, { mobile: true }))}
          </nav>

          {(user || actions || onLogout) && (
            <div className="mt-3 space-y-2 border-t border-[var(--dashboard-text-secondary,#6b7280)]/20 pt-3">
              {actions}

              {user && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenus();
                      onUserClick?.();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg bg-[var(--dashboard-background,#f2f2f2)] px-4 py-3 text-left transition-colors hover:bg-[var(--dashboard-primary,#37a501)]/8"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--dashboard-primary,#37a501)]/12 text-[var(--dashboard-primary,#37a501)]">
                      <User size={17} />
                    </div>
                    <div className="min-w-0">
                      {user.subtitle && (
                        <p className="truncate text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                          {user.subtitle}
                        </p>
                      )}
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                        {user.email}
                      </p>
                    </div>
                  </button>

                  {userEstablishments.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-4 pt-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--dashboard-text-secondary,#6b7280)]">
                        {establishmentsLabel}
                      </p>
                      {userEstablishments.map((establishment) => {
                        const isDisabled =
                          establishment.disabled ||
                          !onEstablishmentChange ||
                          establishment.active;

                        return (
                          <button
                            key={establishment.id}
                            type="button"
                            onClick={() => {
                              if (isDisabled) return;
                              closeMenus();
                              onEstablishmentChange?.(establishment.id);
                            }}
                            disabled={isDisabled}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                              establishment.active
                                ? "bg-[var(--dashboard-primary,#37a501)]/10 text-[var(--dashboard-primary,#37a501)]"
                                : "hover:bg-[var(--dashboard-primary,#37a501)]/8",
                              isDisabled
                                ? establishment.active
                                  ? "cursor-default"
                                  : "cursor-not-allowed opacity-60"
                                : "cursor-pointer",
                            )}
                          >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--dashboard-primary,#37a501)]/12 text-[var(--dashboard-primary,#37a501)]">
                              <Building2 size={15} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {establishment.label}
                              </p>
                              {establishment.description && (
                                <p className="truncate text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                                  {establishment.description}
                                </p>
                              )}
                            </div>
                            {establishment.active && (
                              <Check size={16} className="flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    onLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--dashboard-primary,#37a501)]/8"
                >
                  <LogOut size={18} />
                  {logoutLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      </header>
    </>
  );
}
