"use client";

import { Trash } from "lucide-react";
import { deleteScheduleEntryAction } from "@/app/actions/schedule";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/app/components/dialog";

export function DeleteButton({ entryId }: { entryId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        className="rounded-sm bg-surface-container-highest p-1.5 transition-all duration-200 hover:bg-on-error-container hover:text-on-error disabled:opacity-50"
        onClick={() => setOpen(true)}
      >
        <Trash className="h-5 w-5" />
      </button>

      <Dialog
        open={open}
        title="Удалить пару?"
        text="Это действие нельзя отменить."
        actions={["cancel", "confirm"]}
        onAction={(action) => {
          if (action === "cancel") {
            setOpen(false);
            return;
          }

          startTransition(async () => {
            const result = await deleteScheduleEntryAction(entryId);

            if (result.ok) {
              setOpen(false);
              router.refresh();
            }
          });
        }}
      />
    </>
  );
}
