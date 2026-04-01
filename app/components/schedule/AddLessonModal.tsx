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

const INITIAL_STATE: CreateScheduleEntryActionState = {
  ok: false,
  message: "",
};

const FIELD_CLASS =
  "h-11 w-full rounded-xl border border-outline-variant/20 bg-surface-container-high px-4 text-sm text-on-surface outline-none transition " +
  "placeholder:text-on-surface-variant/70 focus:border-primary focus:bg-surface-container-highest";

function useModalControls(setPopupOpen: (state: boolean) => void) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const modal = searchParams.get("modal");
  const modalKey = searchParams.toString();

  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const onClose = useCallback(() => {
    setPopupOpen(false);

    const params = new URLSearchParams(searchParamsRef.current.toString());
    params.delete("info");
    params.delete("modal");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, setPopupOpen]);

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
    if (state.message) {
      setPopupOpen(true);
    }
  }, [state.message]);

  useEffect(() => {
    if (state.ok) {
      onClose();
    }
  }, [state.ok, onClose]);

  if (modal !== "addLesson") return null;

  const info = parseInfoParam(searchParams.get("info"));
  if (!info) return null;

  const weekdayLabel = WEEKDAY_LABELS[info.weekday] ?? "День не указан";

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex min-h-full items-end justify-center p-3 sm:items-center sm:p-4">
          <div
            className="w-full max-w-2xl rounded-2xl border border-outline-variant/10 bg-surface-container shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-outline-variant/10 px-4 py-4 sm:px-6 sm:py-5">
              <FormHeader
                weekdayLabel={weekdayLabel}
                lessonNumber={info.lessonNumber}
              />
            </div>

            <form key={modalKey} action={formAction}>
              <input type="hidden" name="weekday" value={info.weekday} />
              <input
                type="hidden"
                name="lessonNumber"
                value={info.lessonNumber}
              />
              <input type="hidden" name="groupName" value={info.groupName} />

              <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Название">
                    <input
                      type="text"
                      name="subjectName"
                      placeholder="Базы данных"
                      className={FIELD_CLASS}
                      required
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
                </div>

                <div className="my-5 h-px bg-outline-variant/10" />

                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField label="Тип">
                    <select name="type" className={FIELD_CLASS}>
                      <option value="ЛК">ЛК</option>
                      <option value="ПЗ">ПЗ</option>
                      <option value="ЛР">ЛР</option>
                    </select>
                  </FormField>

                  <FormField label="Неделя">
                    <select
                      name="weekType"
                      className={FIELD_CLASS}
                      defaultValue="all"
                    >
                      <option value="all">Каждая</option>
                      {info.weekType === "odd" && (
                        <option value="odd">1</option>
                      )}
                      {info.weekType === "even" && (
                        <option value="even">2</option>
                      )}
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
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container-high px-5 text-sm font-medium text-on-surface transition hover:bg-surface-container-highest"
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Сохраняем..." : "Сохранить занятие"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <ResultPopup
          open={popupOpen}
          message={state.message}
          ok={state.ok}
          onClose={() => {
            if (state.ok) {
              onClose();
            } else {
              setPopupOpen(false);
            }
          }}
        />
      </div>
    </>
  );
}
