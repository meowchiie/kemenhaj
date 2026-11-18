"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  isRateLimited,
  clearFailures,
  recordFailure,
} from "@/lib/auth/rate-limit";
import { verifyPassword } from "@/lib/auth/password";
import { destroySession, startSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { recordAudit } from "@/lib/data/audit";
import { loginSchema } from "@/lib/validation/service";

const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$w7eadHOvOvmv8yF/OGVmPg$Ajz1leRsbXJLZyEtR16HlC0RYGFbyfyfMYjcOm7/IY0";

export type LoginState = { error?: string };

function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  if (next.startsWith("/admin") && !next.startsWith("//")) return next;
  return "/admin";
}

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Masukkan email dan password yang valid." };
  }

  const { email, password } = parsed.data;
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "lokal";
  const key = `${email}|${ip}`;

  if (isRateLimited(key)) {
    return {
      error: "Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.",
    };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const valid = await verifyPassword(
    user?.passwordHash ?? DUMMY_HASH,
    password,
  );

  if (!user || !user.isActive || !valid) {
    recordFailure(key);
    return { error: "Email atau password salah." };
  }

  clearFailures(key);

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  await startSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  await recordAudit({
    actorId: user.id,
    action: "auth.login",
    entity: "user",
    entityId: user.id,
    summary: `${user.name} masuk ke dashboard.`,
  });

  redirect(safeNext(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
