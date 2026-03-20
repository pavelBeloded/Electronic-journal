import { db } from "@/db";
import {
  absences,
  students,
  scheduleEntries,
  subjects,
  groups,
} from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db
      .select({
        id: absences.id,
        date: absences.date,
        isExcused: absences.isExcused,
        note: absences.note,

        studentId: students.id,
        fullName: students.fullName,
        subgroup: students.subgroup,

        scheduleEntryId: scheduleEntries.id,
        weekday: scheduleEntries.weekday,
        lessonNumber: scheduleEntries.lessonNumber,
        weekType: scheduleEntries.weekType,
        room: scheduleEntries.room,

        subjectName: subjects.name,
        groupName: groups.name,
      })
      .from(absences)
      .innerJoin(students, eq(absences.studentId, students.id))
      .innerJoin(
        scheduleEntries,
        eq(absences.scheduleEntryId, scheduleEntries.id),
      )
      .innerJoin(subjects, eq(scheduleEntries.subjectId, subjects.id))
      .innerJoin(groups, eq(scheduleEntries.groupId, groups.id))
      .orderBy(
        asc(absences.date),
        asc(scheduleEntries.lessonNumber),
        asc(students.fullName),
      );

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, error: "Failed to fetch absences" },
      { status: 500 },
    );
  }
}
