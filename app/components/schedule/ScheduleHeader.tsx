import { ToggleButton } from "@/app/components/toggleButton";

export function ScheduleHeader() {
  return (
    <header className="flex items-center gap-4 bg-surface-container-low px-8 py-4">
      <div className="flex items-center">
        <p className="font-headline text-2xl font-bold">Расписание занятий</p>
        <div className="ml-4 h-8 w-px bg-surface-variant" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <ToggleButton
          param="weekType"
          cookieName="scheduleWeekType"
          values={{
            first: { value: "odd", title: "Нечетная" },
            second: { value: "even", title: "Четная" },
          }}
        />
        <ToggleButton
          param="subgroup"
          cookieName="scheduleSubgroup"
          values={{
            first: { value: "1", title: "1 подгр." },
            second: { value: "2", title: "2 подгр." },
          }}
        />
      </div>
    </header>
  );
}
