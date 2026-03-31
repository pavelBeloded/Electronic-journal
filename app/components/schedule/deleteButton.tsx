"use client";

import { Trash } from "lucide-react";
import { deleteScheduleEntryAction } from "@/app/actions/schedule";
import { startTransition } from "react";

export function DeleteButton({ entryId }: { entryId: string }) {
  return (
    <button
      className=" bg-surface-container-highest p-1.5 rounded-sm hover:text-on-error hover:bg-on-error-container transition-all  duration-200"
      onClick={() => {
        startTransition(async () => {
          await deleteScheduleEntryAction(entryId);
        });
      }}
    >
      <Trash className="self-end w-5 h-5" />
    </button>
  );
}
