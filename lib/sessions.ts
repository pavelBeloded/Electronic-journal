import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin-session";

const secret = process.env.ADMIN_SESSION_SECRET;
if (!secret) {
  throw new Error("ADMIN_SESSION_SECRET is not set");
}

const secretKey = new TextEncoder().encode(secret);

type SessionPayload = {
  role: "admin";
};

export async function createAdminSession() {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const token = await new SignJWT({
    role: "admin" satisfies SessionPayload["role"],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
