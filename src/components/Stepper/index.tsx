import React, { ReactNode } from "react";
import { Check, AlertCircle } from "lucide-react";

export interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  status?: "pending" | "active" | "completed" | "error";
}

export interface StepperProps {
  steps: Step[];
  activeStep: number;
  onStepChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

function StepIcon({ step, index }: { step: Step; index: number }) {
  const status = step.status || "pending";

  if (status === "completed") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--dashboard-primary,#37a501)] text-white flex-shrink-0">
        <Check className="h-4 w-4" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--dashboard-status-danger,#EF4444)] text-white flex-shrink-0">
        <AlertCircle className="h-4 w-4" />
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--dashboard-primary,#37a501)] bg-[var(--dashboard-primary,#37a501)]/10 text-[var(--dashboard-primary,#37a501)] flex-shrink-0">
        {step.icon || (
          <span className="text-sm font-semibold">{index + 1}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--dashboard-text-secondary,#6b7280)]/30 text-[var(--dashboard-text-secondary,#6b7280)] flex-shrink-0">
      {step.icon || (
        <span className="text-sm font-medium">{index + 1}</span>
      )}
    </div>
  );
}

export function Stepper({
  steps,
  activeStep,
  onStepChange,
  orientation = "horizontal",
  className,
}: StepperProps) {
  const resolvedSteps = steps.map((step, i) => ({
    ...step,
    status:
      step.status ||
      (i < activeStep ? "completed" : i === activeStep ? "active" : "pending"),
  })) as (Step & { status: "pending" | "active" | "completed" | "error" })[];

  if (orientation === "vertical") {
    return (
      <nav aria-label="Progress" className={className}>
        <ol className="flex flex-col">
          {resolvedSteps.map((step, index) => (
            <li key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onStepChange?.(index)}
                  disabled={!onStepChange}
                  className={cn(
                    "relative z-10",
                    onStepChange && "cursor-pointer",
                    !onStepChange && "cursor-default",
                  )}
                  aria-current={step.status === "active" ? "step" : undefined}
                >
                  <StepIcon step={step} index={index} />
                </button>
                {index < resolvedSteps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[32px]",
                      step.status === "completed"
                        ? "bg-[var(--dashboard-primary,#37a501)]"
                        : "bg-[var(--dashboard-text-secondary,#6b7280)]/20",
                    )}
                  />
                )}
              </div>

              <div className={cn("pb-6", index === resolvedSteps.length - 1 && "pb-0")}>
                <p
                  className={cn(
                    "text-sm font-medium leading-8",
                    step.status === "active"
                      ? "text-[var(--dashboard-primary,#37a501)]"
                      : step.status === "completed"
                        ? "text-[var(--dashboard-text-primary,#2d2d2d)]"
                        : step.status === "error"
                          ? "text-[var(--dashboard-status-danger,#EF4444)]"
                          : "text-[var(--dashboard-text-secondary,#6b7280)]",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-[var(--dashboard-text-secondary,#6b7280)] mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center">
        {resolvedSteps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              "flex items-center",
              index < resolvedSteps.length - 1 && "flex-1",
            )}
          >
            <button
              type="button"
              onClick={() => onStepChange?.(index)}
              disabled={!onStepChange}
              className={cn(
                "flex items-center gap-2 group",
                onStepChange && "cursor-pointer",
                !onStepChange && "cursor-default",
              )}
              aria-current={step.status === "active" ? "step" : undefined}
            >
              <StepIcon step={step} index={index} />
              <div className="hidden sm:block text-left">
                <p
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    step.status === "active"
                      ? "text-[var(--dashboard-primary,#37a501)]"
                      : step.status === "completed"
                        ? "text-[var(--dashboard-text-primary,#2d2d2d)]"
                        : step.status === "error"
                          ? "text-[var(--dashboard-status-danger,#EF4444)]"
                          : "text-[var(--dashboard-text-secondary,#6b7280)]",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-[var(--dashboard-text-secondary,#6b7280)] whitespace-nowrap">
                    {step.description}
                  </p>
                )}
              </div>
            </button>

            {index < resolvedSteps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-3",
                  step.status === "completed"
                    ? "bg-[var(--dashboard-primary,#37a501)]"
                    : "bg-[var(--dashboard-text-secondary,#6b7280)]/20",
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
