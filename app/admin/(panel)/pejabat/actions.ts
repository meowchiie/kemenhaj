"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { AuthorizationError, can } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createOfficial,
  deleteOfficial,
  replaceOfficialPhoto,
  updateOfficial,
} from "@/lib/data/officials";
import { UploadError } from "@/lib/uploads/storage";
import { officialSchema } from "@/lib/validation/official";

export type OfficialFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveOfficialAction(
  _previous: OfficialFormState,
  formData: FormData,
): Promise<OfficialFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  if (!can(user, "officials:write")) {
    return {
      ok: false,
      message: "Peran Anda tidak memiliki izin mengubah pejabat.",
    };
  }

  const parsed = officialSchema.safeParse({
    name: formData.get("name"),
    nip: formData.get("nip"),
    position: formData.get("position"),
    unit: formData.get("unit"),
    sortOrder: formData.get("sortOrder"),
    duties: formData.get("duties"),
    contact: formData.get("contact"),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }

    return {
      ok: false,
      message: "Beberapa isian belum valid. Periksa kembali formulir.",
      fieldErrors,
    };
  }

  const id = String(formData.get("id") ?? "");
  let createdId: string | null = null;

  try {
    if (id) {
      await updateOfficial(id, parsed.data, user);
    } else {
      createdId = await createOfficial(parsed.data, user);
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { ok: false, message: error.message };
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return {
        ok: false,
        message: "NIP atau urutan sudah dipakai pejabat lain.",
      };
    }

    console.error("saveOfficialAction", error);
    return {
      ok: false,
      message: "Pejabat gagal disimpan. Coba lagi atau hubungi admin.",
    };
  }

  updateTag("officials");

  if (createdId) {
    redirect(`/admin/pejabat/${createdId}?status=baru`);
  }

  return { ok: true, message: "Perubahan pejabat berhasil disimpan." };
}

export async function deleteOfficialAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  const id = String(formData.get("id") ?? "");

  if (!user || !can(user, "officials:delete") || !id) {
    redirect("/admin/pejabat?status=ditolak");
  }

  try {
    await deleteOfficial(id, user);
  } catch (error) {
    console.error("deleteOfficialAction", error);
    redirect("/admin/pejabat?status=gagal");
  }

  updateTag("officials");
  redirect("/admin/pejabat?status=dihapus");
}

export async function uploadOfficialPhotoAction(
  _previous: OfficialFormState,
  formData: FormData,
): Promise<OfficialFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  if (!can(user, "officials:write")) {
    return {
      ok: false,
      message: "Peran Anda tidak memiliki izin mengganti foto.",
    };
  }

  const officialId = String(formData.get("officialId") ?? "");
  const file = formData.get("file");

  if (!officialId || !(file instanceof File)) {
    return { ok: false, message: "Foto belum dipilih." };
  }

  try {
    await replaceOfficialPhoto(officialId, file, user);
  } catch (error) {
    if (error instanceof UploadError) {
      return { ok: false, message: error.message };
    }

    if (error instanceof AuthorizationError) {
      return { ok: false, message: error.message };
    }

    console.error("uploadOfficialPhotoAction", error);
    return { ok: false, message: "Foto gagal diunggah. Coba lagi." };
  }

  updateTag("officials");

  return { ok: true, message: "Foto pejabat berhasil diperbarui." };
}
