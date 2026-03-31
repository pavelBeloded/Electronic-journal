import { ReactNode } from "react";

export function FormHeader({
  weekdayLabel,
  lessonNumber,
}: {
  weekdayLabel: string;
  lessonNumber: number;
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-bold text-on-surface sm:text-2xl">
        Добавить пару
      </h2>
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
    <label className="block space-y-2">
      <span className="block text-sm font-medium text-on-surface">{label}</span>
      {children}
    </label>
  );
}
