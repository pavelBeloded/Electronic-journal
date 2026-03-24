export type WeekType = "odd" | "even" | "all";

export interface ScheduleEntry {
  id: string;
  type: string | null;
  weekday: number;
  lessonNumber: number;
  weekType: "odd" | "even" | "all";
  subgroup: "1" | "all" | "2";
  startTime: string | null;
  endTime: string | null;
  room: string | null;
  subjectName: string;
  groupName: string;
}

export interface LinkType {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}
