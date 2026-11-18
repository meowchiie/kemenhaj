import { cookies } from "next/headers";
import { connection } from "next/server";
import { getIronSession, type SessionOptions } from "iron-session";
import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "./constants";

export type Role = "superadmin";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type SessionData = {
  user?: SessionUser;
};

function sessionOptions(): SessionOptions {
  const password = process.env.SESSION_PASSWORD;

  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_PASSWORD wajib diatur dan minimal 32 karakter (lihat .env.example).",
    );
  }

  return {
    cookieName: SESSION_COOKIE_NAME,
    password,
    ttl: SESSION_TTL_SECONDS,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  };
}

export async function getSession() {
  await connection();
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions());
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session.user ?? null;
}

export async function startSession(user: SessionUser): Promise<void> {
  const session = await getSession();
  session.user = user;
  await session.save();
}

export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}
