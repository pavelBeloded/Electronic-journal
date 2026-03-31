"use client";

import { useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SideBarToggle } from "@/app/components/Sidebar/SidebarToggle";

export default function SidebarWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-outline-variant bg-surface/95 px-4 backdrop-blur md:hidden">
        <SideBarToggle setOpenAction={setOpen} />
        <span className="ml-3 font-headline text-lg font-semibold text-on-surface">
          Schedify
        </span>
      </div>

      <Sidebar open={open} setOpenAction={setOpen} />

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
