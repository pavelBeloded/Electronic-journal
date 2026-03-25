"use client";

import { LogOut } from "lucide-react";
import { NavList } from "@/app/components/Sidebar/NavList";

export function Sidebar({
  className,
  open,
  setOpenAction,
}: {
  className?: string;
  open: boolean;
  setOpenAction: (open: boolean) => void;
}) {
  return (
    <aside
      className={[
        "fixed left-0 top-0 z-50 flex h-screen w-68 flex-col border-r border-outline-variant bg-surface-container-low px-4 py-6 transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        className,
      ].join(" ")}
    >
      <section className="mb-10 px-4">
        <div className="text-left">
          <p className="font-headline text-2xl text-on-surface font-bold">
            Schedify
          </p>
          <p className="font-headline text-lg ">Весенний семестр 2026</p>
        </div>
      </section>
      <section>
        <NavList onClick={() => setOpenAction(false)} />
      </section>
      <section className="mt-auto pt-6">
        <button className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-on-surface-variant transition-all duration-200 hover:bg-surface-container hover:text-on-surface">
          <LogOut className="h-5 w-5" />
          <span>Выйти</span>
        </button>
      </section>
    </aside>
  );
}
