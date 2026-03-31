"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type ConfirmActions = "confirm" | "cancel";

interface DialogProps {
  open: boolean;
  title: string;
  text: string;
  actions: ConfirmActions[];
  onAction: (action: ConfirmActions) => void;
}

const styleByAction: Record<ConfirmActions, string> = {
  confirm: "bg-error text-on-error hover:bg-error/90",
  cancel:
    "border border-outline-variant/20 bg-surface-container text-on-surface hover:bg-surface-container-high",
};

const labelByAction: Record<ConfirmActions, string> = {
  confirm: "Удалить",
  cancel: "Отмена",
};

export function Dialog({ open, title, text, actions, onAction }: DialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={() => onAction("cancel")}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-outline-variant/10 bg-surface-container p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 space-y-2">
          <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
          <p className="text-sm text-on-surface-variant">{text}</p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => onAction(action)}
              className={[
                "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition-all",
                styleByAction[action],
              ].join(" ")}
            >
              {labelByAction[action]}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
