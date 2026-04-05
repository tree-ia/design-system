"use client";

import React, { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
  copyLabel?: string;
  copiedLabel?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  className,
  copyLabel = "Copiar",
  copiedLabel = "Copiado!",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  }, [code]);

  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden border border-[var(--dashboard-text-secondary,#64748B)]/12 my-4",
        className,
      )}
    >
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--dashboard-text-primary,#0F172A)] border-b border-[var(--dashboard-text-secondary,#64748B)]/20">
          {filename && (
            <span className="text-xs text-[var(--dashboard-text-secondary,#64748B)] font-mono">
              {filename}
            </span>
          )}
          {language && !filename && <span />}
          {language && (
            <span className="text-xs text-[var(--dashboard-text-secondary,#64748B)]/60">
              {language}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <pre
          className="overflow-x-auto p-4 bg-[var(--dashboard-text-primary,#0F172A)] m-0"
          data-language={language}
        >
          <code className="text-sm font-mono leading-relaxed text-[var(--dashboard-surface,#FFFFFF)]/90">
            {showLineNumbers
              ? lines.map((line, i) => (
                  <span key={i} className="table-row">
                    <span className="table-cell pr-4 text-right select-none text-[var(--dashboard-text-secondary,#64748B)]/40 text-xs w-8">
                      {i + 1}
                    </span>
                    <span className="table-cell">
                      {line}
                      {"\n"}
                    </span>
                  </span>
                ))
              : code}
          </code>
        </pre>

        <button
          onClick={handleCopy}
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer",
            copied
              ? "bg-[var(--dashboard-status-success,#059669)]/20 text-[var(--dashboard-status-success,#059669)]"
              : "bg-[var(--dashboard-surface,#FFFFFF)]/10 text-[var(--dashboard-surface,#FFFFFF)]/60 hover:bg-[var(--dashboard-surface,#FFFFFF)]/20 hover:text-[var(--dashboard-surface,#FFFFFF)]/80",
          )}
          aria-label={copied ? copiedLabel : copyLabel}
          title={copied ? copiedLabel : copyLabel}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span>{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>
    </div>
  );
}
