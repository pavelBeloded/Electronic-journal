"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminSession, deleteAdminSession } from "@/lib/sessions";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const SignInSchema = z.object({
  login: z.string().min(1, "Логин обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
});

export async function signIn(
  _prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData = {
    login: formData.get("login"),
    password: formData.get("password"),
  };

  const validationResult = SignInSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Ошибка валидации",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { login, password } = validationResult.data;

  const adminLogin = process.env.ADMIN_LOGIN;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminLogin || !adminPasswordHash) {
    return {
      success: false,
      message: "Ошибка конфигурации сервера",
    };
  }

  if (login !== adminLogin) {
    return {
      success: false,
      message: "Неверный логин",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

  if (!isPasswordValid) {
    return {
      success: false,
      message: "Неверный логин или пароль",
    };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logOut() {
  await deleteAdminSession();
  redirect(`/admin`);
}
