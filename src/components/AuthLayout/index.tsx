"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { Checkbox } from "../Checkbox";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthField {
  /** Unique name / id for the field */
  name: string;
  /** Label displayed above the input (omit for placeholder-only mode) */
  label?: string;
  /** HTML input type */
  type?: "text" | "email" | "password" | "tel" | "number";
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Minimum length for validation */
  minLength?: number;
  /** Field-level error message */
  error?: string;
}

export interface AuthLink {
  /** Link text */
  label: string;
  /** URL or click handler */
  href?: string;
  /** Link target (e.g., '_blank' for new tab) */
  target?: string;
  /** Custom click handler (takes precedence over href) */
  onClick?: () => void;
}

export interface AuthCheckbox {
  /** Checkbox name */
  name: string;
  /** Checkbox label */
  label: string;
  /** Whether checked */
  checked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
}

export interface AuthBackground {
  /** Solid color, gradient, or CSS value for the page background */
  color?: string;
  /** Background image URL or element (for Next.js Image support) */
  image?: string;
  /** React element for the background (e.g., next/image with fill) */
  imageElement?: ReactNode;
  /** Overlay opacity (0-1) — rendered as bg-black/{opacity} */
  overlayOpacity?: number;
  /** Custom CSS for the background container */
  style?: React.CSSProperties;
}

export interface AuthHeadline {
  /** Main headline text */
  text: string;
  /** Highlighted / accent portion (rendered on new line if not found inside text) */
  highlight?: string;
  /** Color of the main text (defaults to #faf3e1) */
  color?: string;
  /** Color of the highlighted text (defaults to primaryColor) */
  highlightColor?: string;
}

export interface AuthBranding {
  /** Array of logo elements to render at the bottom-left */
  logos: ReactNode[];
}

export interface AuthCardStyle {
  /** Card background color (defaults to #faf3e1) */
  background?: string;
  /** Card border radius in px (defaults to 16 = rounded-2xl) */
  borderRadius?: number;
  /** Card box shadow CSS */
  shadow?: string;
  /** Card max width in px (defaults to 420) */
  maxWidth?: number;
  /** Card padding in px (defaults to 32 = p-8) */
  padding?: number;
  /** Card border */
  border?: string;
}

export interface AuthLayoutProps {
  // --- Content ---
  /** Logo element displayed at top of card */
  logo?: ReactNode;
  /** Page title (e.g., "Painel de Controle") */
  title: string;
  /** Subtitle / description below the title (supports ReactNode for inline formatting) */
  subtitle?: ReactNode;
  /** Global error message displayed above the form */
  error?: string;
  /** Global success message displayed above the form */
  success?: string;

  // --- Form ---
  /** Form field definitions */
  fields: AuthField[];
  /** Current field values keyed by field name */
  values: Record<string, string>;
  /** Callback when a field value changes */
  onFieldChange: (name: string, value: string) => void;
  /** Submit handler */
  onSubmit: (values: Record<string, string>) => void;
  /** Submit button label */
  submitLabel?: string;
  /** Loading label while submitting */
  loadingLabel?: string;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
  /** Checkbox between fields and submit (e.g., "Lembrar conta") */
  checkbox?: AuthCheckbox;

  // --- Links ---
  /** Primary link below the form */
  primaryLink?: AuthLink;
  /** Secondary link / text (e.g., "Ainda nao tem cadastro? Cadastre-se") */
  secondaryLink?: AuthLink & { prefix?: string };

  // --- Extra content ---
  /** Content rendered between the submit button and the links */
  extraContent?: ReactNode;
  /** Content rendered above the form (below title/subtitle) */
  headerContent?: ReactNode;
  /** Content rendered just above the submit button (e.g., resend code link) */
  beforeSubmitContent?: ReactNode;
  /** Content rendered at the very bottom of the card */
  footerContent?: ReactNode;

  // --- Layout ---
  /** Headline text displayed over the background (top-left, hidden on mobile) */
  headline?: AuthHeadline;
  /** Branding logos at the bottom-left over the background (hidden on mobile) */
  branding?: AuthBranding;
  /** Card horizontal position */
  cardPosition?: "left" | "center" | "right";
  /** Right padding for the card container on lg screens (defaults to 256 = pr-64) */
  cardOffsetRight?: number;

  // --- Theming ---
  /** Background configuration */
  background?: AuthBackground;
  /** Card styling overrides */
  cardStyle?: AuthCardStyle;
  /** Primary color (buttons, links, focus rings, checkbox). Defaults to #ff521d */
  primaryColor?: string;
  /** Text color for the title */
  titleColor?: string;
  /** Text alignment for the card header (title + subtitle). Defaults to "center" */
  titleAlign?: "left" | "center" | "right";

  /** Additional class name for the outermost container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

/** Resolves a CSS color value (including var() references) to a computed hex/rgb string */
function useResolvedColor(cssValue: string): string {
  const [resolved, setResolved] = useState(cssValue);

  useEffect(() => {
    // If it's already a plain color (not a var()), use as-is
    if (!cssValue.startsWith("var(")) {
      setResolved(cssValue);
      return;
    }

    // Create a hidden probe element to read the computed value
    const probe = document.createElement("span");
    probe.style.display = "none";
    probe.style.color = cssValue;
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    if (computed) setResolved(computed);
    document.body.removeChild(probe);
  }, [cssValue]);

  // Re-resolve when CSS vars change (DashboardProvider updates style on root)
  useEffect(() => {
    if (!cssValue.startsWith("var(")) return;

    const observer = new MutationObserver(() => {
      const probe = document.createElement("span");
      probe.style.display = "none";
      probe.style.color = cssValue;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).color;
      if (computed) setResolved(computed);
      document.body.removeChild(probe);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, [cssValue]);

  return resolved;
}

// ---------------------------------------------------------------------------
// AuthInput — matches Eai Garcom: h-12 rounded-lg border-2 bg-transparent
// ---------------------------------------------------------------------------

function AuthInput({
  name,
  label,
  type = "text",
  placeholder,
  required,
  minLength,
  value,
  onChange,
  error,
  resolvedColor,
  computedColor,
  disabled,
}: {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  resolvedColor: string;
  computedColor: string;
  disabled?: boolean;
}) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[#2d2d2d] mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full h-12 rounded-lg border-2 border-[#2d2d2d]/20 bg-transparent px-4 text-sm text-[#2d2d2d] placeholder:text-[#2d2d2d]/60 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          ...(error
            ? { borderColor: "var(--dashboard-status-danger, #EF4444)" }
            : {}),
        }}
        onFocus={(e) => {
          e.target.style.borderColor = resolvedColor;
          e.target.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${computedColor} 20%, transparent)`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "";
          e.target.style.boxShadow = "";
        }}
      />
      {error && (
        <p className="text-xs mt-1 text-[var(--dashboard-status-danger,#EF4444)]">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PasswordInput — h-12 with eye toggle, same border style
// ---------------------------------------------------------------------------

function PasswordInput({
  value,
  onChange,
  placeholder,
  name,
  required,
  minLength,
  error,
  resolvedColor,
  computedColor,
  disabled,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name: string;
  required?: boolean;
  minLength?: number;
  error?: string;
  resolvedColor: string;
  computedColor: string;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full h-12 rounded-lg border-2 border-[#2d2d2d]/20 bg-transparent px-4 pr-11 text-sm text-[#2d2d2d] placeholder:text-[#2d2d2d]/60 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onFocus={(e) => {
            e.target.style.borderColor = resolvedColor;
            e.target.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${computedColor} 20%, transparent)`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "";
            e.target.style.boxShadow = "";
          }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d2d2d]/50 hover:text-[#2d2d2d] transition-colors cursor-pointer bg-transparent border-none p-0"
          tabIndex={-1}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          disabled={disabled}
        >
          {visible ? (
            // EyeOff icon (lucide)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            // Eye icon (lucide)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs mt-1 text-[var(--dashboard-status-danger,#EF4444)]">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AuthLayout({
  logo,
  title,
  subtitle,
  error,
  success,
  fields,
  values,
  onFieldChange,
  onSubmit,
  submitLabel = "Acessar",
  loadingLabel = "Entrando...",
  isLoading = false,
  checkbox,
  primaryLink,
  secondaryLink,
  extraContent,
  headerContent,
  beforeSubmitContent,
  footerContent,
  headline,
  branding,
  cardPosition = "right",
  cardOffsetRight = 256,
  background,
  cardStyle,
  primaryColor,
  titleColor,
  titleAlign = "center",
  className,
}: AuthLayoutProps) {
  // CSS var string for style props (e.g., backgroundColor, color)
  const resolvedColor = primaryColor || "var(--dashboard-primary, #ff521d)";
  // Computed hex/rgb value for JS string concatenation (e.g., focus ring shadow with opacity)
  const computedColor = useResolvedColor(resolvedColor);

  // Background
  const bgCss: React.CSSProperties = {
    backgroundColor: background?.color || "#1a1a1a",
    ...background?.style,
  };

  // Card
  const cardBg = cardStyle?.background || "var(--dashboard-secondary, #faf3e1)";
  const cardCss: React.CSSProperties = {
    backgroundColor: cardBg,
    borderRadius: cardStyle?.borderRadius ?? 16,
    boxShadow:
      cardStyle?.shadow ??
      "0 0 0 1px rgb(0 0 0 / 0.08), 0 0 12px 4px rgb(0 0 0 / 0.25), 0 0 28px 10px rgb(0 0 0 / 0.20)",
    maxWidth: cardStyle?.maxWidth ?? 420,
    padding: cardStyle?.padding ?? 32,
    border: cardStyle?.border || "none",
    width: "100%",
  };




  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  function renderLink(link: AuthLink, extraClass?: string) {
    const style: React.CSSProperties = { color: resolvedColor };
    if (link.onClick) {
      return (
        <button
          type="button"
          onClick={link.onClick}
          className={cn(
            "bg-transparent border-none cursor-pointer hover:opacity-80 text-sm font-semibold p-0 transition-colors",
            extraClass,
          )}
          style={style}
        >
          {link.label}
        </button>
      );
    }
    return (
      <a
        href={link.href}
        target={link.target}
        rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
        className={cn(
          "hover:opacity-80 text-sm font-semibold transition-colors",
          extraClass,
        )}
        style={style}
      >
        {link.label}
      </a>
    );
  }

  return (
    <div
      className={cn("fixed inset-0 flex select-none overflow-hidden", className)}
      style={bgCss}
    >
      {/* Background left spacer for branding (hidden on mobile) */}
      {branding && branding.logos.length > 0 && (
        <div className="relative hidden w-1/3 lg:block">
          <div className="absolute bottom-12 left-12 z-20">
            <div className="flex gap-4 items-center">
              {branding.logos.map((brandLogo, i) => (
                <React.Fragment key={i}>{brandLogo}</React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Background image */}
      {background?.imageElement ? (
        <div className="absolute inset-0 z-0">{background.imageElement}</div>
      ) : background?.image ? (
        <img
          src={background.image}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover"
          draggable={false}
        />
      ) : null}

      {/* Background overlay — bg-black/20 by default */}
      {(background?.image || background?.imageElement) && (
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: `rgba(0,0,0,${background?.overlayOpacity ?? 0.2})`,
          }}
        />
      )}

      {/* Headline — top-left, hidden on mobile */}
      {headline && (
        <div className="absolute top-12 left-8 z-20 max-w-md hidden lg:block">
          <h1
            className="text-4xl font-bold mb-4 leading-tight"
            style={{ color: headline.color || "#faf3e1" }}
          >
            {headline.highlight
              ? (() => {
                  const idx = headline.text.indexOf(headline.highlight);
                  if (idx === -1) {
                    return (
                      <>
                        {headline.text}
                        <br />
                        <span
                          style={{
                            color: headline.highlightColor || resolvedColor,
                          }}
                        >
                          {headline.highlight}
                        </span>
                      </>
                    );
                  }
                  const before = headline.text.slice(0, idx);
                  const after = headline.text.slice(
                    idx + headline.highlight.length,
                  );
                  return (
                    <>
                      {before}
                      <span
                        style={{
                          color: headline.highlightColor || resolvedColor,
                        }}
                      >
                        {headline.highlight}
                      </span>
                      {after}
                    </>
                  );
                })()
              : headline.text}
          </h1>
        </div>
      )}

      {/* Responsive offset CSS — only applies on lg+ */}
      <style>{`
        .auth-card-container {
          padding-left: 1rem;
          padding-right: 1rem;
          justify-content: center;
          align-content: center;
        }
        @media (min-width: 1024px) {
          .auth-card-container[data-position="right"] {
            justify-content: flex-end;
            padding-right: ${cardOffsetRight}px;
          }
          .auth-card-container[data-position="left"] {
            justify-content: flex-start;
            padding-left: ${cardOffsetRight}px;
          }
          .auth-card-container[data-position="center"] {
            justify-content: center;
          }
        }
      `}</style>

      {/* Card container — z-30, flex w-full items-center */}
      <div
        className="auth-card-container relative z-30 flex w-full items-center py-8"
        data-position={cardPosition}
      >
        <div style={{ ...cardCss, maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
            {/* Card header: logo + title + subtitle */}
            <div className={`mb-8 ${titleAlign === "center" ? "text-center" : titleAlign === "right" ? "text-right" : "text-left"}`}>
              {/* Logo */}
              {logo && (
                <div className={`mb-4 flex ${titleAlign === "center" ? "justify-center" : titleAlign === "right" ? "justify-end" : "justify-start"}`}>
                  {logo}
                </div>
              )}

              {/* Title — text-2xl font-bold text-gray-900 mb-2 */}
              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  color: titleColor || "var(--dashboard-text-primary, #111827)",
                }}
              >
                {title}
              </h2>

              {/* Subtitle — text-sm text-gray-600 */}
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>

            {/* Header content */}
            {headerContent}

            {/* Alerts */}
            {error && (
              <div className="p-3 rounded-lg text-sm text-center mb-5 bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg text-sm text-center mb-5 bg-green-50 text-green-700 border border-green-200">
                {success}
              </div>
            )}

            {/* Form — space-y-5 */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map((field) =>
                field.type === "password" ? (
                  <PasswordInput
                    key={field.name}
                    name={field.name}
                    placeholder={field.placeholder || field.label}
                    required={field.required}
                    minLength={field.minLength}
                    value={values[field.name] || ""}
                    onChange={(e) =>
                      onFieldChange(field.name, e.target.value)
                    }
                    error={field.error}
                    resolvedColor={resolvedColor}
                    computedColor={computedColor}
                    disabled={isLoading}
                  />
                ) : (
                  <AuthInput
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type || "text"}
                    placeholder={field.placeholder || field.label}
                    required={field.required}
                    minLength={field.minLength}
                    value={values[field.name] || ""}
                    onChange={(e) =>
                      onFieldChange(field.name, e.target.value)
                    }
                    error={field.error}
                    resolvedColor={resolvedColor}
                    computedColor={computedColor}
                    disabled={isLoading}
                  />
                ),
              )}

              {/* Checkbox */}
              {checkbox && (
                <Checkbox
                  name={checkbox.name}
                  label={checkbox.label}
                  checked={checkbox.checked || false}
                  onChange={(val) => checkbox.onChange?.(val)}
                  disabled={isLoading}
                  primaryColor={resolvedColor}
                  size="sm"
                />
              )}

              {/* Before submit content (e.g., resend code) */}
              {beforeSubmitContent}

              {/* Submit button — h-12 rounded-lg font-bold text-base shadow-lg */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-lg px-5 text-base font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:opacity-90"
                style={{
                  backgroundColor: resolvedColor,
                  "--tw-ring-color": resolvedColor,
                } as React.CSSProperties}
              >
                {isLoading ? loadingLabel : submitLabel}
              </button>
            </form>

            {/* Extra content */}
            {extraContent && <div className="mt-5">{extraContent}</div>}

            {/* Links */}
            {(primaryLink || secondaryLink) && (
              <div className="mt-6 text-center">
                {primaryLink && (
                  <p className="text-sm text-gray-600">
                    {renderLink(primaryLink)}
                  </p>
                )}
                {secondaryLink && (
                  <p className={`text-sm text-gray-600 ${primaryLink ? "mt-6" : ""}`}>
                    {secondaryLink.prefix && (
                      <>{secondaryLink.prefix}{" "}</>
                    )}
                    {renderLink(secondaryLink)}
                  </p>
                )}
              </div>
            )}

            {/* Footer content */}
            {footerContent && <div className="mt-6">{footerContent}</div>}
        </div>
      </div>
    </div>
  );
}
