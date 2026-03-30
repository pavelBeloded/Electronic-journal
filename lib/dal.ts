import { CreateScheduleEntryInput, SubgroupType, WeekType } from "@/lib/types";
import { db } from "@/db";
import { groups, scheduleEntries, subjects } from "@/db/schema";
import { and, asc, eq, or, SQL } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { LESSON_TIMES } from "@/lib/constants/schedule";

export async function getSchedule(weekType: WeekType, subgroup: SubgroupType) {
  "use cache";
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

export type ActionResult<T = void> =
  | { ok: true; data: T; message?: string }
  | { ok: false; message: string };

export async function createScheduleEntry(
  input: CreateScheduleEntryInput,
): Promise<ActionResult<{ id: string }>> {
  const {
    subgroup,
    startTime,
    endTime,
    type,
    lessonNumber,
    weekday,
    weekType,
    room,
    subjectName,
    groupName,
  } = input;

  const timeReg = /^([01]\d|2[0-3]):[0-5]\d$/;
  const roomReg = /^\d+[a-zA-Zа-яёА-ЯЁ]?-\d+[a-zA-Zа-яёА-ЯЁ]?$/i;

  const normalizedSubjectName = subjectName.trim();
  const normalizedGroupName = groupName.trim();
  const normalizedRoom = room.trim();

  if (!normalizedSubjectName) {
    return { ok: false, message: "Название предмета не может быть пустым" };
  }

  if (!normalizedGroupName) {
    return { ok: false, message: "Название группы не может быть пустым" };
  }

  if (!normalizedRoom) {
    return { ok: false, message: "Аудитория не может быть пустой" };
  }

  if (!timeReg.test(startTime) || !timeReg.test(endTime)) {
    return { ok: false, message: "Неверный формат времени (HH:MM)" };
  }

  if (startTime >= endTime) {
    return {
      ok: false,
      message: "Время начала должно быть меньше времени окончания",
    };
  }

  if (!["ЛБ", "ПЗ", "ЛК"].includes(type)) {
    return { ok: false, message: "Неверный тип пары (ЛБ/ПЗ/ЛК)" };
  }

  if (lessonNumber < 1 || lessonNumber > LESSON_TIMES.length) {
    return { ok: false, message: "Неверный номер пары" };
  }

  if (weekday < 1 || weekday > 6) {
    return { ok: false, message: "Неверный день недели" };
  }

  if (!roomReg.test(normalizedRoom)) {
    return { ok: false, message: "Неверный формат аудитории" };
  }

  if (normalizedSubjectName.length > 100) {
    return {
      ok: false,
      message: "Слишком длинное название предмета (макс. 100 символов)",
    };
  }

  try {
    const subjectIdResult = await getOrCreateSubjectId(normalizedSubjectName);
    if (!subjectIdResult.ok) {
      return subjectIdResult;
    }

    const groupIdResult = await getGroupId(normalizedGroupName);
    if (!groupIdResult.ok) {
      return groupIdResult;
    }

    console.log("subgroup: ", subgroup);

    const conflictCheck = await checkSlotConflict(
      groupIdResult.data,
      weekday,
      lessonNumber,
      weekType,
      subgroup,
    );
    if (!conflictCheck.ok) {
      console.log("conflict zone");
      return conflictCheck;
    }

    const inserted = await db
      .insert(scheduleEntries)
      .values({
        type,
        weekday,
        lessonNumber,
        startTime,
        endTime,
        room: normalizedRoom,
        subjectId: subjectIdResult.data,
        subgroup,
        weekType,
        groupId: groupIdResult.data,
      })
      .returning({ id: scheduleEntries.id });

    return {
      ok: true,
      data: { id: inserted[0].id },
      message: "Пара успешно создана",
    };
  } catch (error) {
    console.error("createScheduleEntry error:", error);
    return { ok: false, message: "Ошибка создания записи расписания" };
  }
}

export async function getSubjectId(
  subjectName: string,
): Promise<ActionResult<string>> {
  try {
    const result = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(eq(subjects.name, subjectName))
      .limit(1);

    if (result.length === 0) {
      return { ok: false, message: "Предмет не найден" };
    }

    return { ok: true, data: result[0].id };
  } catch (error) {
    console.error("getSubjectId error:", error);
    return { ok: false, message: "Ошибка получения предмета" };
  }
}

export async function createSubject(
  subjectName: string,
): Promise<ActionResult<string>> {
  try {
    const result = await db
      .insert(subjects)
      .values({ name: subjectName })
      .returning({ id: subjects.id });

    return { ok: true, data: result[0].id };
  } catch (error) {
    console.error("createSubject error:", error);
    return { ok: false, message: "Ошибка создания нового предмета в БД" };
  }
}

export async function getOrCreateSubjectId(
  subjectName: string,
): Promise<ActionResult<string>> {
  const existingSubject = await getSubjectId(subjectName);

  if (existingSubject.ok) {
    return existingSubject;
  }

  const createdSubject = await createSubject(subjectName);
  if (!createdSubject.ok) {
    return createdSubject;
  }

  return createdSubject;
}

export async function getGroupId(
  groupName: string,
): Promise<ActionResult<string>> {
  try {
    const result = await db
      .select({ id: groups.id })
      .from(groups)
      .where(eq(groups.name, groupName))
      .limit(1);

    if (result.length === 0) {
      return { ok: false, message: "Группа не найдена" };
    }

    return { ok: true, data: result[0].id };
  } catch (error) {
    console.error("getGroupId error:", error);
    return { ok: false, message: "Ошибка получения id группы" };
  }
}

async function checkSlotConflict(
  groupId: string,
  weekday: number,
  lessonNumber: number,
  weekType: WeekType,
  subgroup: SubgroupType,
): Promise<ActionResult> {
  if (subgroup !== "all" && weekType !== "all") {
    return { ok: true, data: undefined };
  }

  try {
    const slotEntries = await db
      .select({
        id: scheduleEntries.id,
        subgroup: scheduleEntries.subgroup,
        weekType: scheduleEntries.weekType,
      })
      .from(scheduleEntries)
      .where(
        and(
          eq(scheduleEntries.groupId, groupId),
          eq(scheduleEntries.weekday, weekday),
          eq(scheduleEntries.lessonNumber, lessonNumber),
        ),
      );

    const conflicts = slotEntries.filter((entry) => {
      const weekOverlap =
        weekType === "all" ||
        entry.weekType === "all" ||
        weekType === entry.weekType;

      const subgroupOverlap =
        subgroup === "all" ||
        entry.subgroup === "all" ||
        subgroup === entry.subgroup;

      return weekOverlap && subgroupOverlap;
    });

    if (conflicts.length > 0) {
      const details = conflicts
        .map((c) => `подгруппа ${c.subgroup}, неделя ${c.weekType}`)
        .join("; ");

      console.log("heeerer");
      return {
        ok: false,
        message: `Конфликт расписания: слот уже занят (${details})`,
      };
    }

    return { ok: true, data: undefined };
  } catch (error) {
    console.error("checkSlotConflict error:", error);
    return { ok: false, message: "Ошибка проверки конфликтов расписания" };
  }
}
