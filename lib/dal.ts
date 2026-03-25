import { SubgroupType, WeekType } from "@/lib/types";
import { db } from "@/db";
import { groups, scheduleEntries, subjects } from "@/db/schema";
import { and, asc, eq, or, SQL } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getSchedule(weekType: WeekType, subgroup: SubgroupType) {
  "use cache";
  console.log("DB QUERY!!!!");
  cacheLife("max");
  cacheTag("schedule-data");
  const filters: SQL[] = [];

  if (subgroup === "1" || subgroup === "2") {
    filters.push(
      or(
        eq(scheduleEntries.subgroup, subgroup),
        eq(scheduleEntries.subgroup, "all"),
      )!,
    );
  }

  if (weekType === "odd" || weekType === "even") {
    filters.push(
      or(
        eq(scheduleEntries.weekType, weekType),
        eq(scheduleEntries.weekType, "all"),
      )!,
    );
  }

  const result = await db
    .select({
      id: scheduleEntries.id,
      type: scheduleEntries.type,
      weekday: scheduleEntries.weekday,
      lessonNumber: scheduleEntries.lessonNumber,
      weekType: scheduleEntries.weekType,
      subgroup: scheduleEntries.subgroup,
      startTime: scheduleEntries.startTime,
      endTime: scheduleEntries.endTime,
      room: scheduleEntries.room,
      subjectName: subjects.name,
      groupName: groups.name,
    })
    .from(scheduleEntries)
    .innerJoin(subjects, eq(scheduleEntries.subjectId, subjects.id))
    .innerJoin(groups, eq(scheduleEntries.groupId, groups.id))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(asc(scheduleEntries.weekday), asc(scheduleEntries.lessonNumber));

  return result;
}
