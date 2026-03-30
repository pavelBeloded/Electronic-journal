import { cookies } from "next/headers";
import { WeekType, SubgroupType } from "@/lib/types";

const VALID_WEEKS: WeekType[] = ["odd", "even"];
const VALID_SUBGROUPS: SubgroupType[] = ["1", "2"];

function isValidWeek(value: string | undefined): value is WeekType {
  return !!value && VALID_WEEKS.includes(value as WeekType);
}

function isValidSubgroup(value: string | undefined): value is SubgroupType {
  return !!value && VALID_SUBGROUPS.includes(value as SubgroupType);
}

export async function resolveScheduleParams(params: {
  weekType?: string;
  subgroup?: string;
}) {
  const cookieStore = await cookies();

  const cookieWeek = cookieStore.get("scheduleWeekType")?.value;
  const cookieSubgroup = cookieStore.get("scheduleSubgroup")?.value;

  const weekType: WeekType = isValidWeek(params.weekType)
    ? params.weekType
    : isValidWeek(cookieWeek)
      ? cookieWeek
      : "even";

  const subgroup: SubgroupType = isValidSubgroup(params.subgroup)
    ? params.subgroup
    : isValidSubgroup(cookieSubgroup)
      ? cookieSubgroup
      : "2";

  return { weekType, subgroup };
}
