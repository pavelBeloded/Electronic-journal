"use server";

import { CreateScheduleEntryInput } from "@/lib/types";
import { createScheduleEntry } from "@/lib/dal";
import { revalidateTag } from "next/cache";

export type CreateScheduleEntryActionState = {
  ok: boolean;
  message: string;
  errors?: Partial<Record<keyof CreateScheduleEntryInput, string>>;
  createdId?: string;
};

export async function createScheduleEntryAction(
  _prevState: CreateScheduleEntryActionState,
  formData: FormData,
): Promise<CreateScheduleEntryActionState> {
  const input: CreateScheduleEntryInput = {
    subgroup: String(formData.get("subgroup") ?? "all") as "all" | "1" | "2",
    startTime: String(formData.get("startTime") ?? ""),
    endTime: String(formData.get("endTime") ?? ""),
    type: String(formData.get("type") ?? "") as "ЛБ" | "ПЗ" | "ЛК",
    lessonNumber: Number(formData.get("lessonNumber") ?? 0),
    weekday: Number(formData.get("weekday") ?? 0),
    weekType: String(formData.get("weekType") ?? "all") as
      | "all"
      | "even"
      | "odd",
    room: String(formData.get("room") ?? ""),
    subjectName: String(formData.get("subjectName") ?? ""),
    groupName: String(formData.get("groupName") ?? ""),
  };

  const result = await createScheduleEntry(input);

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  revalidateTag("schedule-data", "max");

  return {
    ok: true,
    message: result.message ?? "Пара успешно создана",
    createdId: result.data.id,
  };
}
