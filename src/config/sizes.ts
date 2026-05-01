/**
 * Tokens centralizados de tamanho para componentes de formulário.
 *
 * Garante que Button, Input, Dropdown e outros componentes de linha
 * compartilhem a mesma altura para cada variante de tamanho.
 *
 * Escala baseada no padrão Tailwind / shadcn/ui:
 *   sm → h-8  (32px)  — compacto, tabelas densas
 *   md → h-9  (36px)  — padrão
 *   lg → h-10 (40px)  — destaque
 */

export type ComponentSize = "sm" | "md" | "lg";

export interface SizeToken {
  /** Altura fixa do componente (Tailwind height class) */
  height: string;
  /** Padding horizontal */
  paddingX: string;
  /** Padding vertical (quando não usa height fixo) */
  paddingY: string;
  /** Classe de font-size do Tailwind */
  font: string;
}

export const componentSizes: Record<ComponentSize, SizeToken> = {
  sm: {
    height: "h-8",
    paddingX: "px-3",
    paddingY: "py-0",
    font: "text-xs",
  },
  md: {
    height: "h-9",
    paddingX: "px-4",
    paddingY: "py-0",
    font: "text-sm",
  },
  lg: {
    height: "h-10",
    paddingX: "px-6",
    paddingY: "py-0",
    font: "text-base",
  },
};

/** Tokens para componentes que não precisam de height fixo (badges, tags) */
export interface BadgeSizeToken {
  padding: string;
  font: string;
}

export const badgeSizes: Record<ComponentSize, BadgeSizeToken> = {
  sm: { padding: "px-2 py-0.5", font: "text-xs" },
  md: { padding: "px-3 py-1", font: "text-sm" },
  lg: { padding: "px-3 py-1", font: "text-sm" },
};

/** Tokens de largura máxima para Modal */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export const modalSizes: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  "2xl": "max-w-4xl",
  "3xl": "max-w-screen-xl",
};
