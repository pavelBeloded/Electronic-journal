import { SubgroupType, WeekType } from "@/lib/types";
import { Suspense } from "react";
import { ScheduleGrid } from "@/app/components/scheduleGrid";

export default async function Schedule({
  searchParams,
}: {
  searchParams: Promise<{ weekType: WeekType; subgroup: SubgroupType }>;
}) {
  const { weekType, subgroup } = await searchParams;
  const weekParam = weekType ? weekType : "even";
  const subgroupParam = subgroup ? subgroup : "2";

  return (
    <>
      <header className="py-4 px-8 bg-surface-container-low flex items-center">
        <p className="font-bold font-headline text-2xl">Расписание занятий</p>
        <div className="ml-4 w-px h-8 bg-surface-variant"></div>
      </header>
      <main className="p-10">
        <Suspense fallback={<div>Загрузка ...</div>}>
          <ScheduleGrid weekType={weekParam} subgroup={subgroupParam} />
        </Suspense>
      </main>
    </>
  );
}
