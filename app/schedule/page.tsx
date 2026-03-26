import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ScheduleGrid } from "@/app/components/schedule/scheduleGrid";
import { ScheduleHeader } from "@/app/components/schedule/ScheduleHeader";
import { ScheduleLoadingFallback } from "@/app/components/schedule/scheduleLoadingFallback";
import { resolveScheduleParams } from "@/lib/scheduleParams";

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

  if (hasInvalidParams) {
    redirect(`/schedule?weekType=${weekType}&subgroup=${subgroup}`);
  }

  return (
    <>
      <ScheduleHeader />
      <main className="p-10">
        <Suspense fallback={<ScheduleLoadingFallback />}>
          <ScheduleGrid weekType={weekType} subgroup={subgroup} />
        </Suspense>
      </main>
    </>
  );
}
