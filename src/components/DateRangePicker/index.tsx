"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  locale?: "pt" | "en";
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

export function DateRangePicker({
  value,
  onChange,
  locale = "pt",
  className,
}: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );

    if (!value.start || (value.start && value.end)) {
      onChange({ start: selectedDate, end: null });
    } else if (value.start && !value.end) {
      if (selectedDate >= value.start) {
        onChange({ start: value.start, end: selectedDate });
      } else {
        onChange({ start: selectedDate, end: value.start });
      }
    }
  };

  const isDateInRange = (day: number) => {
    if (!value.start || !value.end) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return date > value.start && date < value.end;
  };

  const isStartDate = (day: number) => {
    if (!value.start) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return date.getTime() === value.start.getTime();
  };

  const isEndDate = (day: number) => {
    if (!value.end) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return date.getTime() === value.end.getTime();
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

          const inRange = isDateInRange(day);
          const isStart = isStartDate(day);
          const isEnd = isEndDate(day);
          const isSelected = isStart || isEnd;
          const hasCompletePeriod = value.start && value.end;

          return (
            <div key={day} className="relative h-8 w-8">
              {hasCompletePeriod && (inRange || isStart || isEnd) && (
                <div
                  className={cn(
                    "absolute inset-0 bg-[var(--dashboard-text-secondary,#6b7280)]/10",
                    isStart && "rounded-l-full",
                    isEnd && "rounded-r-full",
                  )}
                />
              )}
              <button
                onClick={() => handleDayClick(day)}
                className={cn(
                  "relative h-8 w-8 flex items-center justify-center text-xs font-medium transition-colors z-10 rounded-full cursor-pointer",
                  isSelected
                    ? "bg-[var(--dashboard-primary,#37a501)] text-white hover:opacity-90"
                    : "text-[var(--dashboard-text-primary,#2d2d2d)] hover:bg-[var(--dashboard-text-secondary,#6b7280)]/20",
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
