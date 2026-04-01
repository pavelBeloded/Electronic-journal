import { InfoParam, WeekType } from "@/lib/types";
import { LessonStatus, UNIVERSITY_TIMEZONE } from "@/lib/constants/schedule";

export function getInfoParam(data: InfoParam) {
  const json = JSON.stringify(data);

  const bytes = new TextEncoder().encode(json);
  const binary = String.fromCharCode(...bytes);

  return btoa(binary);
}

export function parseInfoParam(info: string | null): InfoParam | null {
  if (!info) return null;

  try {
    const binary = atob(info);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getTimeParts(timeZone: string) {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    weekday: map.weekday,
  };
}

function getWeekdayNumber(weekday: string) {
  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  return map[weekday];
}

function getDateInTimezone(timeZone: string) {
  const { year, month, day } = getTimeParts(timeZone);
  return new Date(year, month - 1, day);
}

export function getCurrentWeekday(timeZone = UNIVERSITY_TIMEZONE) {
  const { weekday } = getTimeParts(timeZone);
  return getWeekdayNumber(weekday);
}

export function getCurrentTimeMinutes(timeZone = UNIVERSITY_TIMEZONE) {
  const { hour, minute } = getTimeParts(timeZone);
  return hour * 60 + minute;
}

export function getCurrentWeekType(
  startWeekType: WeekType = "odd",
  timeZone = UNIVERSITY_TIMEZONE,
): WeekType {
  const nowDate = getDateInTimezone(timeZone);
  const startDate = new Date(2026, 3, 1);
  const diffMs = nowDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  const sameParity = diffWeeks % 2 === 0;

  if (startWeekType === "odd") {
    return sameParity ? "odd" : "even";
  }

  return sameParity ? "even" : "odd";
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getLessonStatus(
  startTime: string,
  endTime: string,
  weekday: number,
  weekType: WeekType,
): LessonStatus {
  const currentWeekType = getCurrentWeekType();
  const currentWeekday = getCurrentWeekday();
  if (currentWeekday !== weekday) return "none";
  if (currentWeekType !== weekType) return "none";

  const now = getCurrentTimeMinutes();
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (now >= start && now < end) return "current";
  if (now < start && start - now <= 30) return "upcoming";
  if (now >= end) return "past";

  return "none";
}
