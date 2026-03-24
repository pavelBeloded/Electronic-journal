"use client";

import { useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SideBarToggle } from "@/app/components/Sidebar/SidebarToggle";

export default function SidebarWrapper() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Sidebar open={open} setOpenAction={setOpen} />

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <SideBarToggle setOpenAction={setOpen} />
    </>
  );
}
