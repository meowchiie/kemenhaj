"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { AuthorizationError, can } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createService,
  deleteService,
  replaceFormPdf,
  updateService,
} from "@/lib/data/services";
import { isUniqueViolation } from "@/lib/db/errors";
import { UploadError } from "@/lib/uploads/storage";
import { serviceSchema } from "@/lib/validation/service";

export type ServiceFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveServiceAction(
  _previous: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  if (!can(user, "services:write")) {
    return {
      ok: false,
      message: "Peran Anda tidak memiliki izin mengubah layanan.",
    };
  }

  const id = String(formData.get("id") ?? "");
  const requirements = formData
    .getAll("requirements")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const stepTitles = formData.getAll("stepTitle").map((value) => String(value));
  const stepDetails = formData
    .getAll("stepDetail")
    .map((value) => String(value));
  const steps = stepTitles
    .map((title, index) => ({
      title: title.trim(),
      detail: (stepDetails[index] ?? "").trim(),
    }))
    .filter((step) => step.title || step.detail);

  const parsed = serviceSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    shortName: formData.get("shortName"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    duration: formData.get("duration"),
    cost: formData.get("cost"),
    note: formData.get("note"),
    isPublished: formData.get("isPublished") === "on",
    requirements,
    steps,
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

  let createdId: string | null = null;

  try {
    if (id) {
      await updateService(id, parsed.data, user);
    } else {
      createdId = await createService(parsed.data, user);
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { ok: false, message: error.message };
    }

    if (isUniqueViolation(error)) {
      return {
        ok: false,
        message: "Slug sudah dipakai layanan lain. Gunakan slug berbeda.",
      };
    }

    console.error("saveServiceAction", error);
    return {
      ok: false,
      message: "Layanan gagal disimpan. Coba lagi atau hubungi admin.",
    };
  }

  updateTag("services");

  if (createdId) {
    redirect(`/admin/layanan/${createdId}?status=baru`);
  }

  return { ok: true, message: "Perubahan layanan berhasil disimpan." };
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  const id = String(formData.get("id") ?? "");

  if (!user || !can(user, "services:delete") || !id) {
    redirect("/admin/layanan?status=ditolak");
  }

  try {
    await deleteService(id, user);
  } catch (error) {
    console.error("deleteServiceAction", error);
    redirect("/admin/layanan?status=gagal");
  }

  updateTag("services");
  redirect("/admin/layanan?status=dihapus");
}

export async function uploadPdfAction(
  _previous: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  if (!can(user, "services:write")) {
    return {
      ok: false,
      message: "Peran Anda tidak memiliki izin mengganti formulir.",
    };
  }

  const serviceId = String(formData.get("serviceId") ?? "");
  const file = formData.get("file");

  if (!serviceId || !(file instanceof File)) {
    return { ok: false, message: "Berkas PDF belum dipilih." };
  }

  try {
    await replaceFormPdf(serviceId, file, user);
  } catch (error) {
    if (error instanceof UploadError) {
      return { ok: false, message: error.message };
    }

    if (error instanceof AuthorizationError) {
      return { ok: false, message: error.message };
    }

    console.error("uploadPdfAction", error);
    return {
      ok: false,
      message: "Berkas gagal diunggah. Coba lagi.",
    };
  }

  updateTag("services");

  return { ok: true, message: "Formulir PDF berhasil diperbarui." };
}
