import { db } from "@/db";
import { scheduleEntries, subjects, groups } from "@/db/schema";
import { eq, and, or, asc, SQL } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const weekdayParam = searchParams.get("weekday");
    const weekTypeParam = searchParams.get("weekType");
    const subgroupParam = searchParams.get("subgroup");

    const filters: SQL[] = [];

    if (weekdayParam) {
      const weekday = Number(weekdayParam);

      if (!Number.isNaN(weekday)) {
        filters.push(eq(scheduleEntries.weekday, weekday));
      }
    }

    if (weekTypeParam && ["even", "odd"].includes(weekTypeParam)) {
      filters.push(
        or(
          eq(scheduleEntries.weekType, weekTypeParam as "even" | "odd" | "all"),
          eq(scheduleEntries.weekType, "all"),
        )!,
      );
    }

    if (subgroupParam && ["1", "2"].includes(subgroupParam)) {
      filters.push(
        or(
          eq(scheduleEntries.subgroup, "all"),
          eq(scheduleEntries.subgroup, subgroupParam as "1" | "2"),
        )!,
      );
    } else if (subgroupParam === "all") {
      filters.push(eq(scheduleEntries.subgroup, "all"));
    }

    const result = await db
      .select({
        id: scheduleEntries.id,
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

    return Response.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to fetch schedule:", error);

    return Response.json(
      {
        ok: false,
        message: "Failed to fetch schedule",
      },
      { status: 500 },
    );
  }
}
