"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface TocItem {
  /** Hash URL — must start with '#'. The id (after the hash) must match an element id in the DOM. */
  url: string;
  title: string;
  /** 1, 2, 3, 4 — controls indentation. */
  depth: number;
}

export interface TableOfContentsProps {
  items: TocItem[];
  /** Title shown above the items. Default: 'Nesta página'. Pass null to hide. */
  title?: string | null;
  /** Whether to show the active-range highlight bar (TocThumb). Default true. */
  showThumb?: boolean;
  /** When true, only one item can be active at a time. Default false (multi-active). */
  single?: boolean;
  /** Root margin for the IntersectionObserver. Default '0px 0px -70% 0px'. */
  rootMargin?: string;
  /** Threshold for the IntersectionObserver. Default 0. */
  threshold?: number | number[];
  className?: string;
  /** Called when active set changes. */
  onActiveChange?: (activeIds: string[]) => void;
}

export interface TOCProviderProps {
  items: TocItem[];
  single?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
  children: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Internal types                                                              */
/* -------------------------------------------------------------------------- */

interface ObservedItem {
  id: string;
  active: boolean;
  fallback: boolean;
  /** Last update timestamp — used to disambiguate which active item wins. */
  t: number;
  original: TocItem;
}

type Listener = (items: ObservedItem[]) => void;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

function getIdFromUrl(url: string): string | null {
  if (typeof url === "string" && url.startsWith("#")) return url.slice(1);
  return null;
}

function arraysShallowEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function findScrollableParent(el: HTMLElement | null): HTMLElement {
  let current = el?.parentElement;
  while (current && current !== document.body) {
    const style = getComputedStyle(current);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      // Confirm the element can actually scroll
      if (current.scrollHeight > current.clientHeight) return current;
    }
    current = current.parentElement;
  }
  return document.documentElement;
}

function scrollAnchorIntoView(
  anchor: HTMLElement,
  container: HTMLElement,
  options: { behavior?: ScrollBehavior; block?: "start" | "center" | "end" } = {},
) {
  const { behavior = "smooth", block = "center" } = options;
  const containerRect = container.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();
  const padding = 16;

  const isAbove = anchorRect.top < containerRect.top + padding;
  const isBelow = anchorRect.bottom > containerRect.bottom - padding;

  if (!isAbove && !isBelow) return;

  const offsetTopRelativeToContainer =
    anchorRect.top - containerRect.top + container.scrollTop;

  let targetScroll: number;
  if (block === "center") {
    targetScroll =
      offsetTopRelativeToContainer - container.clientHeight / 2 + anchor.clientHeight / 2;
  } else if (block === "end") {
    targetScroll =
      offsetTopRelativeToContainer - container.clientHeight + anchor.clientHeight + padding;
  } else {
    targetScroll = offsetTopRelativeToContainer - padding;
  }

  container.scrollTo({
    top: Math.max(0, targetScroll),
    behavior,
  });
}

/* -------------------------------------------------------------------------- */
/* Observer                                                                    */
/* -------------------------------------------------------------------------- */

class TocObserver {
  items: ObservedItem[] = [];
  single = false;
  private intersectionObserver: IntersectionObserver | null = null;
  private listeners = new Set<Listener>();

  listen(fn: Listener): void {
    this.listeners.add(fn);
  }

  unlisten(fn: Listener): void {
    this.listeners.delete(fn);
  }

  setItems(nextItems: TocItem[]): void {
    if (this.intersectionObserver) {
      for (const item of this.items) {
        const el = document.getElementById(item.id);
        if (el) this.intersectionObserver.unobserve(el);
      }
    }

    const next: ObservedItem[] = [];
    for (const item of nextItems) {
      const id = getIdFromUrl(item.url);
      if (!id) continue;
      next.push({
        id,
        active: false,
        fallback: false,
        t: 0,
        original: item,
      });
    }

    this.update(next);
    this.observeAll();
  }

  watch(options: IntersectionObserverInit): void {
    if (this.intersectionObserver) return;
    if (typeof window === "undefined") return;
    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      options,
    );
    this.observeAll();
  }

  unwatch(): void {
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    if (entries.length === 0) return;

    let hasActive = false;
    const updated = this.items.map((item) => {
      const entry = entries.find((e) => (e.target as HTMLElement).id === item.id);
      let active = entry ? entry.isIntersecting : item.active && !item.fallback;
      if (this.single && hasActive) active = false;

      let nextItem = item;
      if (item.active !== active) {
        nextItem = {
          ...item,
          t: Date.now(),
          active,
          fallback: false,
        };
      }
      if (active) hasActive = true;
      return nextItem;
    });

    // Fallback: if nothing intersects, mark the closest item to the viewport top as active.
    if (!hasActive && entries[0].rootBounds) {
      const viewTop = entries[0].rootBounds.top;
      let min = Number.POSITIVE_INFINITY;
      let fallbackIdx = -1;
      for (let i = 0; i < updated.length; i++) {
        const el = document.getElementById(updated[i].id);
        if (!el) continue;
        const distance = Math.abs(viewTop - el.getBoundingClientRect().top);
        if (distance < min) {
          min = distance;
          fallbackIdx = i;
        }
      }
      if (fallbackIdx !== -1) {
        updated[fallbackIdx] = {
          ...updated[fallbackIdx],
          active: true,
          fallback: true,
          t: Date.now(),
        };
      }
    }

    this.update(updated);
  }

  private observeAll(): void {
    if (!this.intersectionObserver) return;
    for (const item of this.items) {
      const el = document.getElementById(item.id);
      if (el) this.intersectionObserver.observe(el);
    }
  }

  private update(next: ObservedItem[]): void {
    this.items = next;
    for (const fn of this.listeners) fn(next);
  }
}

/* -------------------------------------------------------------------------- */
/* Context + Provider                                                          */
/* -------------------------------------------------------------------------- */

const ObserverContext = createContext<TocObserver | null>(null);
const ItemsContext = createContext<TocItem[]>([]);
const LinksRefContext = createContext<React.MutableRefObject<
  Map<string, HTMLAnchorElement>
> | null>(null);

function useObserver(): TocObserver {
  const observer = useContext(ObserverContext);
  if (!observer) {
    throw new Error(
      "TableOfContents hooks must be used inside <TOCProvider> or <TableOfContents>.",
    );
  }
  return observer;
}

/**
 * Headless provider that drives the scrollspy. Use directly when you want to
 * render the visual ToC yourself (e.g. mobile drawer, custom layout).
 */
export function TOCProvider({
  items,
  single = false,
  rootMargin = "0px 0px -70% 0px",
  threshold = 0,
  children,
}: TOCProviderProps): React.JSX.Element {
  const observer = useMemo(() => new TocObserver(), []);
  observer.single = single;

  useEffect(() => {
    observer.setItems(items);
  }, [observer, items]);

  useEffect(() => {
    observer.watch({ rootMargin, threshold });
    return () => observer.unwatch();
  }, [observer, rootMargin, threshold]);

  return (
    <ObserverContext.Provider value={observer}>
      <ItemsContext.Provider value={items}>{children}</ItemsContext.Provider>
    </ObserverContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Hooks                                                                       */
/* -------------------------------------------------------------------------- */

function useObserverState<T>(
  select: (items: ObservedItem[]) => T,
  isEqual: (a: T, b: T) => boolean = Object.is,
): T {
  const observer = useObserver();
  const [value, setValue] = useState<T>(() => select(observer.items));

  // Keep the latest selectors in refs so the effect doesn't re-subscribe each render.
  const selectRef = useRef(select);
  const isEqualRef = useRef(isEqual);
  selectRef.current = select;
  isEqualRef.current = isEqual;

  useEffect(() => {
    const listener: Listener = (items) => {
      const next = selectRef.current(items);
      setValue((prev) => (isEqualRef.current(prev, next) ? prev : next));
    };
    observer.listen(listener);
    return () => observer.unlisten(listener);
  }, [observer]);

  return value;
}

/** Returns the id of the most recently activated heading (best guess). */
export function useActiveAnchor(): string | undefined {
  return useObserverState<string | undefined>((items) => {
    let best: ObservedItem | undefined;
    for (const item of items) {
      if (!item.active) continue;
      if (!best || item.t > best.t) best = item;
    }
    return best?.id;
  });
}

/** Returns the ids of every currently active heading. */
export function useActiveAnchors(): string[] {
  return useObserverState<string[]>(
    (items) => {
      const out: string[] = [];
      for (const item of items) if (item.active) out.push(item.id);
      return out;
    },
    arraysShallowEqual,
  );
}

/** Returns the static items list registered with the provider. */
export function useTOCItems(): TocItem[] {
  return useContext(ItemsContext);
}

/* -------------------------------------------------------------------------- */
/* Visual                                                                      */
/* -------------------------------------------------------------------------- */

function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (typeof window !== "undefined" && window.history) {
    window.history.replaceState(null, "", `#${id}`);
  }
}

interface TocAnchorProps {
  item: TocItem;
}

function TocAnchor({ item }: TocAnchorProps) {
  const id = getIdFromUrl(item.url) ?? "";
  const activeIds = useActiveAnchors();
  const isActive = id ? activeIds.includes(id) : false;
  const linksRef = useContext(LinksRefContext);

  const setRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      if (!linksRef || !id) return;
      if (node) linksRef.current.set(id, node);
      else linksRef.current.delete(id);
    },
    [linksRef, id],
  );

  return (
    <a
      ref={setRef}
      href={item.url}
      data-active={isActive}
      onClick={(e) => handleAnchorClick(e, id)}
      className={cn(
        "py-1.5 text-sm transition-colors scroll-m-4 wrap-anywhere first:pt-0 last:pb-0",
        "text-[var(--dashboard-text-secondary,#6b7280)]",
        "hover:text-[var(--dashboard-text-primary,#2d2d2d)]",
        "data-[active=true]:text-[var(--dashboard-primary,#e74410)]",
        item.depth <= 2 && "pl-3",
        item.depth === 3 && "pl-6",
        item.depth >= 4 && "pl-8",
      )}
    >
      {item.title}
    </a>
  );
}

interface ThumbComputed {
  positions: Array<[number, number]>;
}

function TocThumb({
  computed,
}: {
  computed: ThumbComputed;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const observer = useObserver();

  const calculate = useCallback(
    (items: ObservedItem[]): Record<string, string> => {
      const out: Record<string, string> = {};
      const startIdx = items.findIndex((item) => item.active);
      if (startIdx === -1) return out;
      let endIdx = startIdx;
      for (let i = items.length - 1; i >= startIdx; i--) {
        if (items[i].active) {
          endIdx = i;
          break;
        }
      }
      const startPos = computed.positions[startIdx];
      const endPos = computed.positions[endIdx];
      if (!startPos || !endPos) return out;
      out["--track-top"] = `${startPos[0]}px`;
      out["--track-bottom"] = `${endPos[1]}px`;
      return out;
    },
    [computed],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (items: ObservedItem[]) => {
      const styles = calculate(items);
      for (const [k, v] of Object.entries(styles)) {
        el.style.setProperty(k, v);
      }
    };
    apply(observer.items);
    observer.listen(apply);
    return () => observer.unlisten(apply);
  }, [observer, calculate]);

  const initialStyles = calculate(observer.items);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-y-0 left-0 w-px bg-[var(--dashboard-primary,#e74410)] transition-[clip-path]"
      style={{
        clipPath:
          "polygon(0 var(--track-top, 0), 100% var(--track-top, 0), 100% var(--track-bottom, 0), 0 var(--track-bottom, 0))",
        ...initialStyles,
      }}
    />
  );
}

interface TocListProps {
  items: TocItem[];
  showThumb: boolean;
}

function TocList({ items, showThumb }: TocListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [computed, setComputed] = useState<ThumbComputed | null>(null);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (items.length === 0) {
      setComputed(null);
      return;
    }
    const positions: Array<[number, number]> = [];
    for (const item of items) {
      const el = container.querySelector<HTMLAnchorElement>(
        `a[href="${item.url}"]`,
      );
      if (!el) {
        positions.push([0, 0]);
        continue;
      }
      const styles = window.getComputedStyle(el);
      const top = el.offsetTop + parseFloat(styles.paddingTop || "0");
      const bottom =
        el.offsetTop + el.clientHeight - parseFloat(styles.paddingBottom || "0");
      positions.push([top, bottom]);
    }
    setComputed({ positions });
  }, [items]);

  useLayoutEffect(() => {
    recompute();
  }, [recompute]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => recompute());
    ro.observe(container);
    return () => ro.disconnect();
  }, [recompute]);

  return (
    <div className="relative">
      {showThumb && computed && <TocThumb computed={computed} />}
      <div
        ref={containerRef}
        className="flex flex-col border-l border-[var(--dashboard-text-secondary,#6b7280)]/15"
      >
        {items.map((item) => (
          <TocAnchor key={item.url} item={item} />
        ))}
      </div>
    </div>
  );
}

function ActiveChangeReporter({
  onActiveChange,
}: {
  onActiveChange: (ids: string[]) => void;
}) {
  const ids = useActiveAnchors();
  const cbRef = useRef(onActiveChange);
  cbRef.current = onActiveChange;
  useEffect(() => {
    cbRef.current(ids);
  }, [ids]);
  return null;
}

function ActiveScrollSync({
  linksRef,
}: {
  linksRef: React.MutableRefObject<Map<string, HTMLAnchorElement>>;
}) {
  const activeId = useActiveAnchor();

  useEffect(() => {
    if (!activeId) return;
    const link = linksRef.current.get(activeId);
    if (!link) return;
    const container = findScrollableParent(link);
    // Don't scroll the page itself — only the inner ToC container.
    if (container === document.documentElement) return;
    scrollAnchorIntoView(link, container);
  }, [activeId, linksRef]);

  return null;
}

/**
 * Adapted from Fumadocs (MIT) — https://github.com/fuma-nama/fumadocs
 *
 * Scrollspy table of contents. Renders a sticky list of headings and tracks
 * which are visible in the viewport via IntersectionObserver. The active
 * range is highlighted with a thin animated bar (TocThumb).
 */
export function TableOfContents({
  items,
  title = "Nesta página",
  showThumb = true,
  single = false,
  rootMargin = "0px 0px -70% 0px",
  threshold = 0,
  className,
  onActiveChange,
}: TableOfContentsProps): React.JSX.Element {
  const linksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());

  return (
    <TOCProvider
      items={items}
      single={single}
      rootMargin={rootMargin}
      threshold={threshold}
    >
      <LinksRefContext.Provider value={linksRef}>
        <nav
          aria-label={typeof title === "string" ? title : "Sumário"}
          className={cn("text-sm", className)}
        >
          {title !== null && (
            <h3 className="inline-flex items-center gap-1.5 text-sm font-medium mb-3 text-[var(--dashboard-text-primary,#2d2d2d)]">
              <Text className="h-4 w-4" aria-hidden />
              {title}
            </h3>
          )}
          <TocList items={items} showThumb={showThumb} />
          {onActiveChange && (
            <ActiveChangeReporter onActiveChange={onActiveChange} />
          )}
          <ActiveScrollSync linksRef={linksRef} />
        </nav>
      </LinksRefContext.Provider>
    </TOCProvider>
  );
}
