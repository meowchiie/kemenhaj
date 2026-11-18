"use server";

import { refresh } from "next/cache";
import { getCurrentUser, startSession } from "@/lib/auth/session";
import {
  PasswordMismatchError,
  updatePassword,
  updateProfile,
} from "@/lib/data/profile";
import { passwordSchema, profileSchema } from "@/lib/validation/profile";

export type ProfileFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

function fieldErrorsOf(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }

  return fieldErrors;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

export async function saveProfileAction(
  _previous: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Beberapa isian belum valid. Periksa kembali formulir.",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  }

  try {
    const updated = await updateProfile(parsed.data, user);
    await startSession(updated);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        message: "Email sudah dipakai akun lain. Gunakan email berbeda.",
      };
    }

    console.error("saveProfileAction", error);
    return {
      ok: false,
      message: "Profil gagal disimpan. Coba lagi atau hubungi admin.",
    };
  }

  refresh();

  return { ok: true, message: "Profil berhasil diperbarui." };
}

export async function savePasswordAction(
  _previous: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Beberapa isian belum valid. Periksa kembali formulir.",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  }

  try {
    await updatePassword(parsed.data, user);
    await startSession(user);
  } catch (error) {
    if (error instanceof PasswordMismatchError) {
      return {
        ok: false,
        message: error.message,
        fieldErrors: { currentPassword: error.message },
      };
    }

    console.error("savePasswordAction", error);
    return {
      ok: false,
      message: "Password gagal diperbarui. Coba lagi atau hubungi admin.",
    };
  }

  return { ok: true, message: "Password berhasil diperbarui." };
}
