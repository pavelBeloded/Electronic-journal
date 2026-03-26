import { InfoParam } from "@/lib/types";

export function getInfoParam({
  weekday,
  lessonNumber,
  defaultStartTime,
  defaultEndTime,
}: InfoParam) {
  return btoa(
    JSON.stringify({ weekday, lessonNumber, defaultStartTime, defaultEndTime }),
  );
}

export function parseInfoParam(info: string | null): InfoParam | null {
  if (!info) {
    return null;
  }

  try {
    return JSON.parse(atob(info));
  } catch {
    return null;
  }
}
