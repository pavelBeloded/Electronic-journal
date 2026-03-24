import { LogOut } from "lucide-react";
import { NavList } from "@/app/components/Sidebar/NavList";

export function Sidebar({ className }: { className: string }) {
  return (
    <aside
      className={
        "fixed flex flex-col left-0 top-0 h-screen bg-surface-container-low border-r border-outline-variant px-4 py-6 " +
        className
      }
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
        <NavList />
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
