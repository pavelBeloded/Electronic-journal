export type WeekType = "odd" | "even" | "all";

export type SubgroupType = "1" | "2" | "all";

export interface ScheduleEntry {
  id: string;
  type: string;
  weekday: number;
  lessonNumber: number;
  weekType: "odd" | "even" | "all";
  subgroup: "1" | "all" | "2";
  startTime: string;
  endTime: string;
  room: string;
  subjectName: string;
  groupName: string;
}

export interface LinkType {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface InfoParam {
  weekday: number;
  subgroup: SubgroupType;
  weekType: WeekType;
  lessonNumber: number;
  defaultStartTime: string;
  defaultEndTime: string;
  groupName: string;
}

export type CreateScheduleEntryInput = {
  subgroup: "all" | "1" | "2";
  startTime: string;
  endTime: string;
  type: "ЛБ" | "ПЗ" | "ЛК";
  lessonNumber: number;
  weekday: number;
  weekType: "all" | "even" | "odd";
  room: string;
  subjectName: string;
  groupName: string;
};
