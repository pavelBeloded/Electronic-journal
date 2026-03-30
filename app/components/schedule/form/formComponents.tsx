import { ReactNode } from "react";

export function FormHeader({
  weekdayLabel,
  lessonNumber,
}: {
  weekdayLabel: string;
  lessonNumber: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-xl font-bold text-on-primary-container">
          Добавить пару
        </h2>
      </div>
      <p className="text-sm text-on-surface-variant">
        {weekdayLabel} · {lessonNumber} пара
      </p>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-on-surface">
        {label}
      </span>
      {children}
    </label>
  );
}
