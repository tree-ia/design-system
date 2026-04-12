"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  locale?: "pt" | "en";
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

const locales = {
  pt: {
    months: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ],
    weekDays: ["D", "S", "T", "Q", "Q", "S", "S"],
    prevMonth: "Mês anterior",
    nextMonth: "Próximo mês",
  },
  en: {
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    weekDays: ["S", "M", "T", "W", "T", "F", "S"],
    prevMonth: "Previous month",
    nextMonth: "Next month",
  },
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export function DatePicker({
  value,
  onChange,
  locale = "pt",
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(
    value ?? new Date(),
  );
  const l = locales[locale];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const buildDate = (day: number) =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

  const isDisabled = (day: number) => {
    const date = buildDate(day);
    if (minDate && date < startOfDay(minDate)) return true;
    if (maxDate && date > startOfDay(maxDate)) return true;
    return false;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const date = buildDate(day);
    return date.getTime() === startOfDay(value).getTime();
  };

  const handleDayClick = (day: number) => {
    if (isDisabled(day)) return;
    onChange(buildDate(day));
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div
      className={cn(
        "w-64 bg-[var(--dashboard-surface,#ffffff)] rounded-lg p-4 shadow-sm border border-[var(--dashboard-text-secondary,#6b7280)]/20",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={previousMonth}
          className="p-1 hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 rounded transition-colors cursor-pointer"
          aria-label={l.prevMonth}
        >
          <ChevronLeft className="w-4 h-4 text-[var(--dashboard-text-primary,#2d2d2d)]" />
        </button>

        <h2 className="text-base font-semibold text-[var(--dashboard-text-primary,#2d2d2d)]">
          {l.months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <button
          type="button"
          onClick={nextMonth}
          className="p-1 hover:bg-[var(--dashboard-text-secondary,#6b7280)]/10 rounded transition-colors cursor-pointer"
          aria-label={l.nextMonth}
        >
          <ChevronRight className="w-4 h-4 text-[var(--dashboard-text-primary,#2d2d2d)]" />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {l.weekDays.map((day, index) => (
          <div
            key={index}
            className="h-8 w-8 flex items-center justify-center text-xs font-medium text-[var(--dashboard-text-secondary,#6b7280)]"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-8 w-8" />;
          }

          const selected = isSelected(day);
          const disabled = isDisabled(day);

          return (
            <div key={day} className="relative h-8 w-8">
              <button
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={disabled}
                className={cn(
                  "relative h-8 w-8 flex items-center justify-center text-xs font-medium transition-colors z-10 rounded-full",
                  disabled
                    ? "text-[var(--dashboard-text-secondary,#6b7280)]/40 cursor-not-allowed"
                    : "cursor-pointer",
                  !disabled && selected
                    ? "bg-[var(--dashboard-primary,#37a501)] text-white hover:opacity-90"
                    : !disabled &&
                        "text-[var(--dashboard-text-primary,#2d2d2d)] hover:bg-[var(--dashboard-text-secondary,#6b7280)]/20",
                )}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
