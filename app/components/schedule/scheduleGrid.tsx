import { ScheduleEntry, WeekType } from "@/lib/types";
import { getSchedule } from "@/lib/dal";
import { MapPin } from "lucide-react";
import { AddLessonSlot } from "@/app/components/schedule/addLessonSlot";
import { LESSON_TIMES } from "@/lib/constants/schedule";
import { DeleteButton } from "@/app/components/schedule/deleteButton";
import { getLessonStatus } from "@/lib/utils";

const weekdays = [
  { label: "ПН", value: 1 },
  { label: "ВТ", value: 2 },
  { label: "СР", value: 3 },
  { label: "ЧТ", value: 4 },
  { label: "ПТ", value: 5 },
  { label: "СБ", value: 6 },
];

const lessons = LESSON_TIMES.map((_, i) => i + 1);

export async function ScheduleGrid({
  weekType,
  subgroup,
  isAdmin = false,
}: {
  weekType: WeekType;
  subgroup: "1" | "2" | "all";
  isAdmin?: boolean;
}) {
  const schedule = await getSchedule(weekType, subgroup);

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2  xl:grid-cols-3">
      {weekdays.map((day) => {
        const dayEntries = schedule
          .filter((entry) => entry.weekday === day.value)
          .sort((a, b) => a.lessonNumber - b.lessonNumber);

        return (
          <ScheduleDayColumn
            key={day.value}
            dayLabel={day.label}
            dayNumber={day.value}
            dayEntries={dayEntries}
            weekType={weekType}
            isAdmin={isAdmin}
          />
        );
      })}
    </section>
  );
}

function ScheduleDayColumn({
  dayLabel,
  dayNumber,
  dayEntries,
  isAdmin,
  weekType,
}: {
  dayLabel: string;
  dayNumber: number;
  dayEntries: ScheduleEntry[];
  isAdmin: boolean;
  weekType: WeekType;
}) {
  return (
    <section className="relative min-w-0">
      <header className="w-fit top-15 z-35 md:static mb-6">
        <p className="mb-1 text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">
          {dayLabel}
        </p>
        <p className="font-headline text-4xl font-bold leading-none text-on-surface">
          {dayNumber}
        </p>
      </header>

      <div className="absolute inset-y-20 left-0 right-0 border-x border-outline-variant/5 pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {!isAdmin && dayEntries.length === 0 && (
          <div className="rounded-xl border border-dashed border-outline-variant/15 bg-surface-container-high/40 p-4 text-sm text-on-surface-variant">
            Нет занятий
          </div>
        )}
        {lessons.map((number) => {
          const lesson = dayEntries.find(
            (entry) => entry.lessonNumber === number,
          );

          if (lesson) {
            return (
              <ScheduleLessonCard
                key={lesson.id}
                lesson={lesson}
                isAdmin={isAdmin}
                weekday={dayNumber}
                weekType={weekType}
              />
            );
          }

          if (isAdmin) {
            return (
              <AddLessonSlot
                key={number}
                weekday={dayNumber}
                lessonNumber={number}
                defaultEndTime={LESSON_TIMES[number - 1].end}
                defaultStartTime={LESSON_TIMES[number - 1].start}
              />
            );
          }
        })}
      </div>
    </section>
  );
}

function ScheduleLessonCard({
  lesson,
  isAdmin,
  weekday,
  weekType,
}: {
  lesson: ScheduleEntry;
  isAdmin: boolean;
  weekday: number;
  weekType: WeekType;
}) {
  const startTime = lesson.startTime.slice(0, 5);
  const endTime = lesson.endTime.slice(0, 5);
  const status = getLessonStatus(
    lesson.startTime,
    lesson.endTime,
    weekday,
    weekType,
  );

  let typeClasses = "bg-secondary-container text-on-secondary-container";

  const statusClasses = {
    current: "border-primary/60 bg-primary/5 shadow-sm shadow-primary/20",
    upcoming: "border-secondary/40",
    past: "opacity-50",
    none: "",
  }[status];

  switch (lesson.type) {
    case "ПЗ":
      typeClasses = "bg-practice/15 text-practice";
      break;
    case "ЛБ":
      typeClasses = "bg-lab/15 text-lab";
      break;
    case "ЛК":
      typeClasses = "bg-lecture/15 text-lecture";
      break;
  }

  return (
    <article
      className={`group min-w-0 rounded-2xl border border-outline-variant/10 bg-surface-container-high p-4 transition-all duration-200 hover:border-primary/30 hover:bg-surface-variant ${statusClasses}`}
    >
      {status === "current" && (
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Идёт сейчас
        </div>
      )}
      {status === "upcoming" && (
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-tertiary">
          <span className="h-1.5 w-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
          Следующая
        </div>
      )}
      <header className="mb-4 flex items-start justify-between gap-3">
        <p className="text-xs md:text-sm font-bold text-on-surface-variant">
          {startTime} — {endTime}
        </p>

        <span
          className={[
            "shrink-0 rounded-md px-2 py-1 text-xs font-bold leading-none",
            typeClasses,
          ].join(" ")}
        >
          {lesson.type}
        </span>
      </header>

      <div className="min-w-0 flex justify-between items-end">
        <div className="space-y-2 ">
          <p className="truncate font-headline text-xl  sm:text-2xl lg:text-3xl leading-tight font-bold text-on-surface transition-colors group-hover:text-primary">
            {lesson.subjectName}
          </p>

          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{lesson.room}</span>
          </div>
        </div>
        {isAdmin && <DeleteButton entryId={lesson.id} />}
      </div>
    </article>
  );
}
