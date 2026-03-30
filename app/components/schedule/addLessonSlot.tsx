"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getInfoParam } from "@/lib/utils";
import { SubgroupType, WeekType } from "@/lib/types";

type EmptyLessonSlotProps = {
  weekday: number;
  lessonNumber: number;
  defaultStartTime: string;
  defaultEndTime: string;
};

export function AddLessonSlot({
  weekday,
  lessonNumber,
  defaultStartTime,
  defaultEndTime,
}: EmptyLessonSlotProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = () => {
    console.log("Click");
    const params = new URLSearchParams(searchParams.toString());
    const subgroup = params.get("subgroup") as SubgroupType;
    const weekType = params.get("weekType") as WeekType;
    const groupName = "ПИ-2-9";

    const infoParam = getInfoParam({
      weekday,
      subgroup,
      weekType,
      lessonNumber,
      defaultStartTime,
      defaultEndTime,
      groupName,
    });

    params.set("modal", "addLesson");
    params.set("info", infoParam);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="w-full rounded-xl border border-dashed border-primary/30 p-4 text-left text-sm text-primary transition hover:bg-primary/5"
      >
        + Добавить пару
      </button>
    </>
  );
}
