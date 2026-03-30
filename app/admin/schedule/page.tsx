import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ScheduleGrid } from "@/app/components/schedule/scheduleGrid";
import { ScheduleHeader } from "@/app/components/schedule/ScheduleHeader";
import { ScheduleLoadingFallback } from "@/app/components/schedule/scheduleLoadingFallback";
import { resolveScheduleParams } from "@/lib/scheduleParams";
import { AddLessonModal } from "@/app/components/schedule/AddLessonModal";

export default async function Schedule({
  searchParams,
}: {
  searchParams: Promise<{ weekType?: string; subgroup?: string }>;
}) {
  const params = await searchParams;
  const { weekType, subgroup } = await resolveScheduleParams(params);

  const hasInvalidParams =
    (params.weekType && params.weekType !== weekType) ||
    (params.subgroup && params.subgroup !== subgroup);

  if (hasInvalidParams || !params.subgroup || !params.weekType) {
    redirect(`/admin/schedule?weekType=${weekType}&subgroup=${subgroup}`);
  }

  return (
    <>
      <AddLessonModal />

      <ScheduleHeader />
      <main className="p-10">
        <Suspense fallback={<ScheduleLoadingFallback />}>
          <ScheduleGrid
            weekType={weekType}
            subgroup={subgroup}
            isAdmin={true}
          />
        </Suspense>
      </main>
    </>
  );
}
