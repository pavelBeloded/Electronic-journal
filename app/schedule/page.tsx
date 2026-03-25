import { SubgroupType, WeekType } from "@/lib/types";
import { Suspense } from "react";
import { ScheduleGrid } from "@/app/components/scheduleGrid";
import { redirect } from "next/navigation";
import { ToggleButton } from "@/app/components/toggleButton";
import { cookies } from "next/headers";

const VALID_WEEKS: WeekType[] = ["odd", "even"];
const VALID_SUBGROUPS: SubgroupType[] = ["1", "2"];

function isValidWeek(value: string | undefined): value is WeekType {
  return !!value && VALID_WEEKS.includes(value as WeekType);
}

function isValidSubgroup(value: string | undefined): value is SubgroupType {
  return !!value && VALID_SUBGROUPS.includes(value as SubgroupType);
}

export default async function Schedule({
  searchParams,
}: {
  searchParams: Promise<{
    weekType?: string;
    subgroup?: string;
  }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();

  const cookieWeek = cookieStore.get("scheduleWeekType")?.value;
  const cookieSubgroup = cookieStore.get("scheduleSubgroup")?.value;

  const weekType = isValidWeek(params.weekType)
    ? params.weekType
    : isValidWeek(cookieWeek)
      ? cookieWeek
      : "even";

  const subgroup = isValidSubgroup(params.subgroup)
    ? params.subgroup
    : isValidSubgroup(cookieSubgroup)
      ? cookieSubgroup
      : "2";

  const normalizedQuery = `?weekType=${weekType}&subgroup=${subgroup}`;

  if (params.weekType !== weekType || params.subgroup !== subgroup) {
    redirect(`/schedule${normalizedQuery}`);
  }

  return (
    <>
      <header className="flex items-center gap-4 bg-surface-container-low px-8 py-4">
        <div className="flex items-center">
          <p className="font-headline text-2xl font-bold">Расписание занятий</p>
          <div className="ml-4 h-8 w-px bg-surface-variant" />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ToggleButton
            param="weekType"
            cookieName="scheduleWeekType"
            values={{
              first: { value: "odd", title: "Нечетная" },
              second: { value: "even", title: "Четная" },
            }}
          />

          <ToggleButton
            param="subgroup"
            cookieName="scheduleSubgroup"
            values={{
              first: { value: "1", title: "1 подгр." },
              second: { value: "2", title: "2 подгр." },
            }}
          />
        </div>
      </header>

      <main className="p-10">
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
                <p className="text-sm text-on-surface-variant">Будим БД</p>
              </div>
            </div>
          }
        >
          <ScheduleGrid weekType={weekType} subgroup={subgroup} />
        </Suspense>
      </main>
    </>
  );
}
