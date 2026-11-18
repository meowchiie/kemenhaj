"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { AuthorizationError, can } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import {
  addGalleryItem,
  createGallery,
  deleteGallery,
  deleteGalleryItem,
  replaceGalleryCover,
  updateGallery,
} from "@/lib/data/galleries";
import { UploadError } from "@/lib/uploads/storage";
import { galleryItemSchema, gallerySchema } from "@/lib/validation/gallery";

export type GalleryFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveGalleryAction(
  _previous: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  if (!can(user, "galleries:write")) {
    return {
      ok: false,
      message: "Peran Anda tidak memiliki izin mengubah album.",
    };
  }

  const parsed = gallerySchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    eventDate: formData.get("eventDate"),
    isPublished: formData.get("isPublished") === "on",
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
      await updateGallery(id, parsed.data, user);
    } else {
      createdId = await createGallery(parsed.data, user);
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
        message: "Slug sudah dipakai album lain. Gunakan slug berbeda.",
      };
    }

    console.error("saveGalleryAction", error);
    return {
      ok: false,
      message: "Album gagal disimpan. Coba lagi atau hubungi admin.",
    };
  }

  updateTag("galleries");

  if (createdId) {
    redirect(`/admin/galeri/${createdId}?status=baru`);
  }

  return { ok: true, message: "Perubahan album berhasil disimpan." };
}

export async function deleteGalleryAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  const id = String(formData.get("id") ?? "");

  if (!user || !can(user, "galleries:delete") || !id) {
    redirect("/admin/galeri?status=ditolak");
  }

  try {
    await deleteGallery(id, user);
  } catch (error) {
    console.error("deleteGalleryAction", error);
    redirect("/admin/galeri?status=gagal");
  }

  updateTag("galleries");
  redirect("/admin/galeri?status=dihapus");
}

export async function uploadGalleryCoverAction(
  _previous: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  if (!can(user, "galleries:write")) {
    return {
      ok: false,
      message: "Peran Anda tidak memiliki izin mengganti sampul.",
    };
  }

  const galleryId = String(formData.get("galleryId") ?? "");
  const file = formData.get("file");

  if (!galleryId || !(file instanceof File)) {
    return { ok: false, message: "Gambar sampul belum dipilih." };
  }

  try {
    await replaceGalleryCover(galleryId, file, user);
  } catch (error) {
    if (error instanceof UploadError) {
      return { ok: false, message: error.message };
    }

    if (error instanceof AuthorizationError) {
      return { ok: false, message: error.message };
    }

    console.error("uploadGalleryCoverAction", error);
    return { ok: false, message: "Sampul gagal diunggah. Coba lagi." };
  }

  updateTag("galleries");

  return { ok: true, message: "Sampul album berhasil diperbarui." };
}

export async function addGalleryItemAction(
  _previous: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  if (!can(user, "galleries:write")) {
    return {
      ok: false,
      message: "Peran Anda tidak memiliki izin menambah foto.",
    };
  }

  const parsed = galleryItemSchema.safeParse({
    galleryId: formData.get("galleryId"),
    caption: formData.get("caption"),
  });
  const file = formData.get("file");

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Keterangan foto wajib diisi.",
    };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Pilih gambar terlebih dahulu." };
  }

  try {
    await addGalleryItem(parsed.data.galleryId, file, parsed.data.caption, user);
  } catch (error) {
    if (error instanceof UploadError) {
      return { ok: false, message: error.message };
    }

    if (error instanceof AuthorizationError) {
      return { ok: false, message: error.message };
    }

    console.error("addGalleryItemAction", error);
    return { ok: false, message: "Foto gagal diunggah. Coba lagi." };
  }

  updateTag("galleries");

  return { ok: true, message: "Foto berhasil ditambahkan ke album." };
}

export async function deleteGalleryItemAction(
  formData: FormData,
): Promise<void> {
  const user = await getCurrentUser();
  const itemId = String(formData.get("itemId") ?? "");
  const galleryId = String(formData.get("galleryId") ?? "");

  if (!user || !can(user, "galleries:write") || !itemId) {
    redirect("/admin/galeri?status=ditolak");
  }

  try {
    await deleteGalleryItem(itemId, user);
  } catch (error) {
    console.error("deleteGalleryItemAction", error);
    redirect(`/admin/galeri/${galleryId}?status=gagal`);
  }

  updateTag("galleries");
  redirect(`/admin/galeri/${galleryId}?status=foto-dihapus`);
}
