import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { SessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { recordAudit } from "@/lib/data/audit";
import type { PasswordInput, ProfileInput } from "@/lib/validation/profile";

export class PasswordMismatchError extends Error {
  constructor() {
    super("Password saat ini tidak cocok.");
    this.name = "PasswordMismatchError";
  }
}

export async function getProfile(userId: string) {
  const [row] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return row ?? null;
}

export async function updateProfile(
  input: ProfileInput,
  actor: SessionUser,
): Promise<SessionUser> {
  const [row] = await db
    .update(users)
    .set({
      name: input.name,
      email: input.email,
      updatedAt: new Date(),
    })
    .where(eq(users.id, actor.id))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  if (!row) throw new Error("Akun tidak ditemukan.");

  await recordAudit({
    actorId: actor.id,
    action: "profile.update",
    entity: "user",
    entityId: actor.id,
    summary: `Memperbarui profil akun ${row.email}.`,
  });

  return row;
}

export async function updatePassword(
  input: PasswordInput,
  actor: SessionUser,
): Promise<void> {
  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, actor.id))
    .limit(1);

  if (!row) throw new Error("Akun tidak ditemukan.");

  const valid = await verifyPassword(row.passwordHash, input.currentPassword);

  if (!valid) throw new PasswordMismatchError();

  await db
    .update(users)
    .set({
      passwordHash: await hashPassword(input.newPassword),
      updatedAt: new Date(),
    })
    .where(eq(users.id, actor.id));

  await recordAudit({
    actorId: actor.id,
    action: "profile.password",
    entity: "user",
    entityId: actor.id,
    summary: `Mengganti password akun ${actor.email}.`,
  });
}
