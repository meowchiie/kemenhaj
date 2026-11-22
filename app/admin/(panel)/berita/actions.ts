"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { AuthorizationError, can } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createArticle,
  deleteArticle,
  replaceArticleCover,
  updateArticle,
} from "@/lib/data/articles";
import { isUniqueViolation } from "@/lib/db/errors";
import { UploadError } from "@/lib/uploads/storage";
import { articleSchema } from "@/lib/validation/article";

export type ArticleFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

function parseBody(value: FormDataEntryValue | null) {
  try {
    return JSON.parse(String(value ?? "[]"));
  } catch {
    return null;
  }
}

export async function saveArticleAction(
  _previous: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  if (!can(user, "articles:write")) {
    return {
      ok: false,
      message: "Peran Anda tidak memiliki izin mengubah berita.",
    };
  }

  const body = parseBody(formData.get("body"));

  if (!body) {
    return { ok: false, message: "Isi berita tidak valid. Muat ulang halaman." };
  }

  const parsed = articleSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    category: formData.get("category"),
    author: formData.get("author"),
    publishedAt: formData.get("publishedAt"),
    isPublished: formData.get("isPublished") === "on",
    body,
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
      await updateArticle(id, parsed.data, user);
    } else {
      createdId = await createArticle(parsed.data, user);
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { ok: false, message: error.message };
    }

    if (isUniqueViolation(error)) {
      return {
        ok: false,
        message: "Slug sudah dipakai berita lain. Gunakan slug berbeda.",
      };
    }

    console.error("saveArticleAction", error);
    return {
      ok: false,
      message: "Berita gagal disimpan. Coba lagi atau hubungi admin.",
    };
  }

  updateTag("articles");

  if (createdId) {
    redirect(`/admin/berita/${createdId}?status=baru`);
  }

  return { ok: true, message: "Perubahan berita berhasil disimpan." };
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  const id = String(formData.get("id") ?? "");

  if (!user || !can(user, "articles:delete") || !id) {
    redirect("/admin/berita?status=ditolak");
  }

  try {
    await deleteArticle(id, user);
  } catch (error) {
    console.error("deleteArticleAction", error);
    redirect("/admin/berita?status=gagal");
  }

  updateTag("articles");
  redirect("/admin/berita?status=dihapus");
}

export async function uploadArticleCoverAction(
  _previous: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, message: "Sesi berakhir. Silakan masuk kembali." };
  }

  if (!can(user, "articles:write")) {
    return {
      ok: false,
      message: "Peran Anda tidak memiliki izin mengganti gambar.",
    };
  }

  const articleId = String(formData.get("articleId") ?? "");
  const file = formData.get("file");

  if (!articleId || !(file instanceof File)) {
    return { ok: false, message: "Gambar belum dipilih." };
  }

  try {
    await replaceArticleCover(articleId, file, user);
  } catch (error) {
    if (error instanceof UploadError) {
      return { ok: false, message: error.message };
    }

    if (error instanceof AuthorizationError) {
      return { ok: false, message: error.message };
    }

    console.error("uploadArticleCoverAction", error);
    return { ok: false, message: "Gambar gagal diunggah. Coba lagi." };
  }

  updateTag("articles");

  return { ok: true, message: "Gambar utama berhasil diperbarui." };
}
