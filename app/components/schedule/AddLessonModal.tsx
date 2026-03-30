"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseInfoParam } from "@/lib/utils";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  createScheduleEntryAction,
  CreateScheduleEntryActionState,
} from "@/app/actions/schedule";
import { ResultPopup } from "@/app/components/popup";
import {
  FormField,
  FormHeader,
} from "@/app/components/schedule/form/formComponents";
import { WEEKDAY_LABELS } from "@/lib/constants/schedule";

// --- Constants ---

const INITIAL_STATE: CreateScheduleEntryActionState = {
  ok: false,
  message: "",
};

const FIELD_CLASS =
  "w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 py-2 text-on-surface outline-none transition focus:border-primary";

function useModalControls(setPopunOpen: (state: boolean) => void) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const modal = searchParams.get("modal");
  const modalKey = searchParams.toString();

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  });

  const onClose = useCallback(() => {
    setPopunOpen(false);
    const params = new URLSearchParams(searchParamsRef.current.toString());
    params.delete("info");
    params.delete("modal");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, setPopunOpen]);

  return { modal, modalKey, searchParams, onClose };
}

export function AddLessonModal() {
  const [state, formAction, isPending] = useActionState(
    createScheduleEntryAction,
    INITIAL_STATE,
  );
  const [popupOpen, setPopupOpen] = useState(false);

  const { modal, modalKey, searchParams, onClose } =
    useModalControls(setPopupOpen);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);
  if (modal !== "addLesson") return null;

  const info = parseInfoParam(searchParams.get("info"));
  if (!info) {
    setPopupOpen(false);
    return null;
  }

  const weekdayLabel = WEEKDAY_LABELS[info.weekday] ?? "День не указан";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col gap-5 rounded-2xl bg-surface-container p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <FormHeader
          weekdayLabel={weekdayLabel}
          lessonNumber={info.lessonNumber}
        />

        <form key={modalKey} action={formAction}>
          <input type="hidden" name="weekday" value={info.weekday} />
          <input type="hidden" name="lessonNumber" value={info.lessonNumber} />
          <input type="hidden" name="groupName" value={info.groupName} />

          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            <FormField label="Название">
              <input
                type="text"
                name="subjectName"
                placeholder="Базы Данных"
                className={FIELD_CLASS}
                required
              />
            </FormField>

            <FormField label="Время начала">
              <input
                type="time"
                name="startTime"
                defaultValue={info.defaultStartTime}
                className={FIELD_CLASS}
              />
            </FormField>

            <FormField label="Время конца">
              <input
                type="time"
                name="endTime"
                defaultValue={info.defaultEndTime}
                className={FIELD_CLASS}
              />
            </FormField>

            <FormField label="Аудитория">
              <input
                type="text"
                name="room"
                placeholder="Например: 200-3а"
                className={FIELD_CLASS}
                required
              />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField label="Тип">
              <select name="type" className={FIELD_CLASS}>
                <option value="ЛК">ЛК</option>
                <option value="ПЗ">ПЗ</option>
                <option value="ЛБ">ЛБ</option>
              </select>
            </FormField>

            <FormField label="Неделя">
              <select
                name="weekType"
                className={FIELD_CLASS}
                defaultValue="all"
              >
                <option value="all">Каждая</option>
                {info.weekType === "odd" && <option value="odd">1</option>}
                {info.weekType === "even" && <option value="even">2</option>}
              </select>
            </FormField>

            <FormField label="Подгруппа">
              <select
                name="subgroup"
                className={FIELD_CLASS}
                defaultValue="all"
              >
                <option value="all">Все</option>
                {info.subgroup === "1" && <option value="1">1</option>}
                {info.subgroup === "2" && <option value="2">2</option>}
              </select>
            </FormField>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container px-5 text-sm font-medium text-on-surface transition hover:bg-surface-container-high"
            >
              Отмена
            </button>

            <button
              type="submit"
              disabled={isPending}
              onClick={() => {
                setPopupOpen(true);
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition hover:opacity-90"
            >
              {isPending ? "Сохраняем..." : "Сохранить занятие"}
            </button>
          </div>
        </form>
      </div>

      <ResultPopup
        open={popupOpen}
        message={state.message}
        ok={state.ok}
        onClose={() => {
          if (state.ok) {
            onClose();
          }
        }}
      />
    </div>
  );
}
