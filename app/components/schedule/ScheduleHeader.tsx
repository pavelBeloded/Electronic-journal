import { ToggleButton } from "@/app/components/toggleButton";
import { getCurrentWeekType } from "@/lib/utils";

export function ScheduleHeader() {
  return (
    <header className="overflow-x-auto md:overflow-x-hidden sticky top-14 md:top-0 z-30 flex items-center gap-4 bg-surface-container-low px-8  py-4">
      <div className="md:flex items-center hidden">
        <p className="font-headline text-xl font-bold lg:text-2xl">
          Расписание занятий
        </p>
        <div className="ml-4 h-8 w-px bg-surface-variant" />
      </div>

      <div className="ml-auto flex items-center gap-3 ">
        <ToggleButton
          param="weekType"
          cookieName="scheduleWeekType"
          values={{
            first: { value: "odd", title: "Нечетная" },
            second: { value: "even", title: "Четная" },
          }}
          current={getCurrentWeekType()}
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
