"use client";

import { X } from "lucide-react";
import { SubgroupType, WeekType } from "@/lib/types";

type AddLessonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  weekday: number;
  lessonNumber: number;
  defaultStartTime: string;
  defaultEndTime: string;
  defaultWeekType?: WeekType;
  defaultSubgroup?: SubgroupType;
};

const weekdayMap: Record<number, string> = {
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница",
  6: "Суббота",
};

export function AddLessonModal(
  {
    // isOpen,
    // onClose,
    // weekday,
    // lessonNumber,
    // defaultStartTime,
    // defaultEndTime,
    // defaultWeekType = "all",
    // defaultSubgroup = "all",
  }: AddLessonModalProps,
) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full w-100 max-w-xl rounded-2xl border border-outline-variant/20 bg-surface-container p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Добавить пару
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {weekdayMap[weekday] ?? `День ${weekday}`} · {lessonNumber} пара
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
            aria-label="Закрыть модалку"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-5">
          <input type="hidden" name="weekday" value={weekday} />
          <input type="hidden" name="lessonNumber" value={lessonNumber} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="subjectName"
                className="mb-2 block text-sm font-medium text-on-surface"
              >
                Название предмета
              </label>
              <input
                id="subjectName"
                name="subjectName"
                type="text"
                placeholder="Например, ОАиП"
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-on-surface outline-none transition focus:border-primary"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="room"
                className="mb-2 block text-sm font-medium text-on-surface"
              >
                Аудитория
              </label>
              <input
                id="room"
                name="room"
                type="text"
                placeholder="Например, 301-4"
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-on-surface"
              >
                Тип пары
              </label>
              <select
                id="type"
                name="type"
                defaultValue="ЛК"
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              >
                <option value="ЛК">ЛК</option>
                <option value="ПЗ">ПЗ</option>
                <option value="ЛБ">ЛБ</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="startTime"
                className="mb-2 block text-sm font-medium text-on-surface"
              >
                Начало
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                defaultValue={defaultStartTime}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="mb-2 block text-sm font-medium text-on-surface"
              >
                Конец
              </label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                defaultValue={defaultEndTime}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="weekType"
                className="mb-2 block text-sm font-medium text-on-surface"
              >
                Неделя
              </label>
              <select
                id="weekType"
                name="weekType"
                defaultValue={defaultWeekType}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              >
                <option value="all">Любая</option>
                <option value="odd">Нечётная</option>
                <option value="even">Чётная</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="subgroup"
                className="mb-2 block text-sm font-medium text-on-surface"
              >
                Подгруппа
              </label>
              <select
                id="subgroup"
                name="subgroup"
                defaultValue={defaultSubgroup}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              >
                <option value="all">Все</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-outline-variant/20 px-4 py-2 text-on-surface transition hover:bg-surface-variant"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 font-medium text-on-primary transition hover:opacity-90"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
