"use client";

import { useActionState } from "react";
import { ActionResponse, signIn } from "@/app/actions/auth";
const initialState: ActionResponse = {
  success: false,
  message: "",
  errors: undefined,
};
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-surface-container px-10 py-8">
        <h1 className="mb-6 font-headline text-2xl font-bold">
          Вход в админ-панель
        </h1>

        <form action={formAction} className="space-y-5">
          {state.message && !state.errors && (
            <p className="text-sm text-red-500">{state.message}</p>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="login">Введите логин</label>
            <input
              id="login"
              name="login"
              type="text"
              autoComplete="username"
              disabled={isPending}
              className="rounded-md bg-surface-container-high px-3 py-2 outline outline-1 outline-outline-variant"
            />
            {state.errors?.login?.[0] && (
              <p className="text-sm text-red-500">{state.errors.login[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Введите пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              disabled={isPending}
              className="rounded-md bg-surface-container-high px-3 py-2 outline outline-1 outline-outline-variant"
            />
            {state.errors?.password?.[0] && (
              <p className="text-sm text-red-500">{state.errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-primary px-4 py-2 text-on-primary disabled:opacity-50"
          >
            {isPending ? "Входим..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
