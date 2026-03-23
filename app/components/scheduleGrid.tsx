import { ScheduleEntry, WeekType } from "@/lib/types";
import { getSchedule } from "@/lib/dal";

const weekdays = [
  { label: "понедельник", value: 1 },
  { label: "вторник", value: 2 },
  { label: "среда", value: 3 },
  { label: "четверг", value: 4 },
  { label: "пятница", value: 5 },
  { label: "суббота", value: 6 },
];

const lessons = [1, 2, 3, 4, 5, 6];

const weekTypeMap = {
  odd: "Нечетная",
  even: "Четная",
  all: "Любая",
};

export async function ScheduleGrid({ weekType }: { weekType: WeekType }) {
  const schedule = await getSchedule(weekType);

  if (!schedule.length) {
    return <div>Расписание не найдено.</div>;
  }

  return (
    <div>
      <h2>Дни недели</h2>

      <div className="flex gap-5">
        {weekdays.map((day) => {
          const dayEntries = schedule.filter(
            (entry) => entry.weekday === day.value,
          );

          return (
            <div key={day.value} className="border-2">
              <p>{day.label}</p>
              <ScheduleDayColumn dayEntries={dayEntries} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScheduleDayColumn({ dayEntries }: { dayEntries: ScheduleEntry[] }) {
  return (
    <div className="p-3">
      {lessons.map((lessonNumber) => {
        const slotEntries = dayEntries.filter(
          (entry) => entry.lessonNumber === lessonNumber,
        );

        return (
          <div key={lessonNumber} className="border border-amber-300 ">
            <ScheduleLessonSlot entries={slotEntries} />
          </div>
        );
      })}
    </div>
  );
}

function ScheduleLessonSlot({ entries }: { entries: ScheduleEntry[] }) {
  const lessonForAll = entries.find((entry) => entry.subgroup === "all");

  if (lessonForAll) {
    return <ScheduleLessonCard lesson={lessonForAll} />;
  }

  const firstSubgroupLesson = entries.find((entry) => entry.subgroup === "1");
  const secondSubgroupLesson = entries.find((entry) => entry.subgroup === "2");

  return (
    <div>
      {firstSubgroupLesson ? (
        <ScheduleLessonCard lesson={firstSubgroupLesson} />
      ) : (
        <div>Окно</div>
      )}

      {secondSubgroupLesson ? (
        <ScheduleLessonCard lesson={secondSubgroupLesson} />
      ) : (
        <div>Окно</div>
      )}
    </div>
  );
}

function ScheduleLessonCard({ lesson }: { lesson: ScheduleEntry }) {
  return (
    <div>
      <header>
        <p>{lesson.type}</p>
        <p>
          {lesson.startTime} -- {lesson.endTime}
        </p>
      </header>

      <div>
        <p>{lesson.room}</p>
        <p>{lesson.subjectName}</p>
      </div>

      <footer>
        <p>{lesson.subgroup === "all" ? "" : lesson.subgroup}</p>
        <p>Неделя {weekTypeMap[lesson.weekType]}</p>
      </footer>
    </div>
  );
}
