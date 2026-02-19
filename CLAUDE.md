# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@tree-ia/dashboard-ui` is a shared React component library for Tree IA dashboards (EaíGarçom, EaíPrefeito, MeuConstrutor, etc.). It provides themeable UI components styled with Tailwind CSS v4 and built with tsdown. Published to GitHub Packages.

## Commands

- **Build:** `npm run build` (runs tsdown + copies base.css to dist/styles.css)
- **Type check:** `npm run typecheck`
- **Storybook dev:** `npm run storybook` (port 6006)
- **Build Storybook:** `npm run build-storybook`
- **Format:** `npm run format` (Prettier)

No test runner is configured.

## Architecture

### Entry Point & Bundling

Single entry at `src/index.ts` which re-exports all components, providers, hooks, and config types. Built with tsdown (ESM-only, generates `.mjs` + `.d.mts`). React and react-dom are externalized.

### Provider System

`DashboardProvider` is the root provider that composes:
1. `ConfigContext` — merges user-supplied partial config with defaults via `createConfig()` (deep merge)
2. `CSSVarsInjector` — injects `--dashboard-*` CSS custom properties on `document.documentElement`
3. `ThemeProvider` — light/dark/system theme with localStorage persistence and system preference detection
4. `LoadingProvider` — global loading state
5. `NotificationsProvider` — notification queue management

All hooks (`useConfig`, `useTheme`, `useLoading`, `useNotifications`) throw if used outside `DashboardProvider`.

### Theming

Components reference CSS custom properties (`var(--dashboard-primary)`, `var(--dashboard-status-success)`, etc.) for brand colors, allowing different dashboards to have distinct themes. Dark mode uses Tailwind's `dark:` variant class strategy. Default brand color is `#37A501`.

### Component Conventions

- Each component lives in `src/components/<Name>/index.tsx` with a co-located `<Name>.stories.tsx`
- Components are named exports (not default exports), with props interfaces exported as `<Name>Props`
- Styling uses Tailwind utility classes directly in JSX; no CSS modules or styled-components
- A local `cn()` helper concatenates class names (defined inline per component, not shared)
- Icons come from `lucide-react`
- Default UI text is in Portuguese (e.g., "Carregando...", "Nenhum registro encontrado", "Fechar")

### CSS & Animations

`src/styles/base.css` defines keyframes and utility classes prefixed with `dashboard-` (e.g., `dashboard-toast-enter`, `dashboard-spinner`). This file is copied to `dist/styles.css` at build time. Consumers import it as `@tree-ia/dashboard-ui/styles.css`.

### Storybook

Uses `@storybook/react-vite` with `@tailwindcss/vite` plugin. The preview decorator wraps all stories in `DashboardProvider` with a toolbar switcher for different dashboard themes.
