export const LESSON_TIMES = [
  { start: "14:40", end: "16:05" },
  { start: "16:25", end: "17:50" },
  { start: "18:00", end: "19:25" },
  { start: "19:35", end: "21:00" },
] as const;

export const WEEKDAY_LABELS: Record<number, string> = {
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница",
  6: "Суббота",
};

export const UNIVERSITY_TIMEZONE = "Europe/Minsk";
export type LessonStatus = "current" | "upcoming" | "past" | "none";
