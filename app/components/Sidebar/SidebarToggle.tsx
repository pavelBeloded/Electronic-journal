"use client";

import { Menu } from "lucide-react";

export function SideBarToggle({
  className,
  setOpenAction,
}: {
  className?: string;
  setOpenAction: (open: boolean) => void;
}) {
  return (
    <button
      className={"md:hidden fixed " + className}
      onClick={() => setOpenAction(true)}
    >
      <Menu className="w-10 h-10 text-on-surface-variant" />
    </button>
  );
}
