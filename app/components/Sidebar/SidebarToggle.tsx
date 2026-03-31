"use client";

import { Menu } from "lucide-react";

export function SideBarToggle({
  setOpenAction,
}: {
  setOpenAction: (open: boolean) => void;
}) {
  return (
    <button
      className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface transition hover:bg-surface-container"
      onClick={() => setOpenAction(true)}
      aria-label="Открыть меню"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
