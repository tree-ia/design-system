import React from "react";
import { Input } from "../Input";

export interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  className = "",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[var(--dashboard-text-primary,#2d2d2d)] mb-1"
      >
        {label} {required && <span className="text-[var(--dashboard-status-danger,#EF4444)]">*</span>}
      </label>
      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={error ? "border-[var(--dashboard-status-danger,#EF4444)] focus:border-[var(--dashboard-status-danger,#EF4444)]" : ""}
      />
      {error && <p className="text-[var(--dashboard-status-danger,#EF4444)] text-xs mt-1">{error}</p>}
    </div>
  );
}
