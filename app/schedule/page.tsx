import { WeekType } from "@/lib/types";
import { Suspense } from "react";
import { ScheduleGrid } from "@/app/components/scheduleGrid";

export default async function Schedule({
  searchParams,
}: {
  searchParams: Promise<{ weekTypeParam: WeekType }>;
}) {
  const { weekTypeParam } = await searchParams;
  const weekType = weekTypeParam ? weekTypeParam : "all";

  return (
    <>
      <h1>Расписание занятий</h1>
      <Suspense fallback={<div>Загрузка ...</div>}>
        <ScheduleGrid weekType={weekType} />
      </Suspense>
    </>
  );
}
