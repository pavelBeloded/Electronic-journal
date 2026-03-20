import { db } from "@/db";
import {
  absences,
  students,
  scheduleEntries,
  subjects,
  groups,
} from "@/db/schema";
import { eq, asc, SQL, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const studentIdParam = searchParams.get("studentId");
    const userIdParam = searchParams.get("userId");
    const dateParam = searchParams.get("date");
    const isExcusedParam = searchParams.get("isExcused");

    const filters: SQL[] = [];

    if (studentIdParam) {
      filters.push(eq(absences.studentId, studentIdParam));
    }

    if (userIdParam) {
      filters.push(eq(students.userId, userIdParam));
    }

    if (dateParam) {
      filters.push(eq(absences.date, dateParam));
    }

    if (isExcusedParam === "true" || isExcusedParam === "false") {
      filters.push(eq(absences.isExcused, isExcusedParam === "true"));
    }

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
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(
        asc(absences.date),
        asc(scheduleEntries.lessonNumber),
        asc(students.fullName),
      );

    return NextResponse.json({
      ok: true,
      filters: {
        studentId: studentIdParam,
        userId: userIdParam,
        date: dateParam,
        isExcused: isExcusedParam,
      },
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { studentId, scheduleEntryId, date, isExcused, note } = body;

    if (
      !studentId ||
      !scheduleEntryId ||
      !date ||
      typeof isExcused != "boolean"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "studentId, scheduleEntryId, date, isExcused are required",
        },
        {
          status: 400,
        },
      );
    }

    const existingAbsence = await db
      .select({ id: absences.id })
      .from(absences)
      .where(
        and(
          eq(absences.studentId, studentId),
          eq(absences.date, date),
          eq(absences.scheduleEntryId, scheduleEntryId),
        ),
      )
      .limit(1);

    if (existingAbsence.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Absence already exists" },
        { status: 409 },
      );
    }

    const createdAbsence = await db
      .insert(absences)
      .values({
        studentId,
        scheduleEntryId,
        date,
        isExcused,
        note: note ?? null,
      })
      .returning();

    return NextResponse.json(
      {
        ok: true,
        data: createdAbsence[0],
        message: "Absence created successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, error: "Failed to create absence" },
      { status: 500 },
    );
  }
}
