"use client";

import React, { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { Upload, X, File, Image as ImageIcon } from "lucide-react";

export interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  progress?: number;
}

export interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  onRemove?: (fileId: string) => void;
  preview?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  icon?: ReactNode;
  maxFiles?: number;
  className?: string;
  files?: UploadedFile[];
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageType(type: string): boolean {
  return type.startsWith("image/");
}

export function FileUpload({
  accept,
  maxSize,
  multiple = false,
  onUpload,
  onRemove,
  preview = true,
  disabled = false,
  label = "Arraste arquivos aqui ou clique para selecionar",
  description,
  icon,
  maxFiles,
  className,
  files: controlledFiles,
}: FileUploadProps) {
  const [internalFiles, setInternalFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const files = controlledFiles || internalFiles;

  const validateFiles = useCallback(
    (fileList: File[]): File[] => {
      setError(null);
      const valid: File[] = [];

      for (const file of fileList) {
        if (maxSize && file.size > maxSize) {
          setError(`"${file.name}" excede o limite de ${formatSize(maxSize)}`);
          continue;
        }
        valid.push(file);
      }

      if (maxFiles) {
        const available = maxFiles - files.length;
        if (valid.length > available) {
          setError(`Limite de ${maxFiles} arquivos`);
          return valid.slice(0, Math.max(0, available));
        }
      }

      return valid;
    },
    [maxSize, maxFiles, files.length],
  );

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const validated = validateFiles(newFiles);
      if (validated.length === 0) return;

      const uploaded: UploadedFile[] = validated.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        preview: isImageType(file.type) ? URL.createObjectURL(file) : undefined,
      }));

      if (!controlledFiles) {
        setInternalFiles((prev) => (multiple ? [...prev, ...uploaded] : uploaded));
      }

      onUpload?.(validated);
    },
    [validateFiles, multiple, onUpload, controlledFiles],
  );

  const handleRemove = useCallback(
    (fileId: string) => {
      if (!controlledFiles) {
        setInternalFiles((prev) => {
          const file = prev.find((f) => f.id === fileId);
          if (file?.preview) URL.revokeObjectURL(file.preview);
          return prev.filter((f) => f.id !== fileId);
        });
      }
      onRemove?.(fileId);
    },
    [onRemove, controlledFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    },
    [addFiles, disabled],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files ? Array.from(e.target.files) : [];
      addFiles(selected);
      if (inputRef.current) inputRef.current.value = "";
    },
    [addFiles],
  );

  useEffect(() => {
    return () => {
      internalFiles.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, []);

  const descText =
    description ||
    [
      accept && `Formatos: ${accept}`,
      maxSize && `Tamanho max: ${formatSize(maxSize)}`,
    ]
      .filter(Boolean)
      .join(" | ") ||
    undefined;

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragging
            ? "border-[var(--dashboard-primary,#37a501)] bg-[var(--dashboard-primary,#37a501)]/5"
            : "border-[var(--dashboard-text-secondary,#6b7280)]/30 hover:border-[var(--dashboard-text-secondary,#6b7280)]/50",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer",
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
        />

        <div className="flex flex-col items-center text-center">
          {icon || (
            <Upload
              className={cn(
                "h-8 w-8 mb-3",
                isDragging
                  ? "text-[var(--dashboard-primary,#37a501)]"
                  : "text-[var(--dashboard-text-secondary,#6b7280)]",
              )}
            />
          )}
          <p className="text-sm font-medium text-[var(--dashboard-text-primary,#2d2d2d)]">
            {label}
          </p>
          {descText && (
            <p className="mt-1 text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
              {descText}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-[var(--dashboard-status-danger,#EF4444)]">
          {error}
        </p>
      )}

      {preview && files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((uploaded) => (
            <li
              key={uploaded.id}
              className="flex items-center gap-3 rounded-lg border border-[var(--dashboard-text-secondary,#6b7280)]/20 bg-[var(--dashboard-surface,#ffffff)] p-3"
            >
              {uploaded.preview ? (
                <img
                  src={uploaded.preview}
                  alt={uploaded.file.name}
                  className="h-10 w-10 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--dashboard-text-secondary,#6b7280)]/10 flex-shrink-0">
                  {isImageType(uploaded.file.type) ? (
                    <ImageIcon className="h-5 w-5 text-[var(--dashboard-text-secondary,#6b7280)]" />
                  ) : (
                    <File className="h-5 w-5 text-[var(--dashboard-text-secondary,#6b7280)]" />
                  )}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--dashboard-text-primary,#2d2d2d)] truncate">
                  {uploaded.file.name}
                </p>
                <p className="text-xs text-[var(--dashboard-text-secondary,#6b7280)]">
                  {formatSize(uploaded.file.size)}
                </p>
                {uploaded.progress !== undefined && uploaded.progress < 100 && (
                  <div className="mt-1 h-1 w-full rounded-full bg-[var(--dashboard-text-secondary,#6b7280)]/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--dashboard-primary,#37a501)] transition-all duration-300"
                      style={{ width: `${uploaded.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(uploaded.id);
                }}
                className="flex-shrink-0 rounded-md p-1 text-[var(--dashboard-text-secondary,#6b7280)] hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 transition-colors cursor-pointer"
                aria-label={`Remover ${uploaded.file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
