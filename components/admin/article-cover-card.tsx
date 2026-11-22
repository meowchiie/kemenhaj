"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import {
  uploadArticleCoverAction,
  type ArticleFormState,
} from "@/app/admin/(panel)/berita/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/admin/ui/alert";
import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/admin/ui/field";
import { Input } from "@/components/admin/ui/input";
import { Spinner } from "@/components/admin/ui/spinner";
import { useFilePreview } from "@/components/admin/use-file-preview";
import type { ArticleMedia } from "@/lib/data/articles";

const initialState: ArticleFormState = { ok: false };

export default function ArticleCoverCard({
  articleId,
  cover,
}: {
  articleId: string;
  cover: ArticleMedia | null;
}) {
  const [state, formAction, pending] = useActionState(
    uploadArticleCoverAction,
    initialState,
  );
  const [file, setFile] = useState<File | null>(null);
  const preview = useFilePreview(file);
  const shownCover = preview ?? cover?.href ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="size-4" />
          Gambar utama
        </CardTitle>
        <CardDescription>
          JPG, PNG, atau WebP maksimal 2 MB. Gambar lama dihapus setelah
          unggahan baru berhasil.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {shownCover ? (
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
            <Image
              src={shownCover}
              alt={preview ? "Pratinjau gambar baru" : (cover?.filename ?? "")}
              fill
              unoptimized
              sizes="640px"
              className="object-cover"
            />
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Belum ada gambar utama. Portal memakai gambar bawaan.
          </p>
        )}

        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="articleId" value={articleId} />
          <Field>
            <FieldLabel htmlFor="cover">
              {cover ? "Ganti gambar" : "Unggah gambar"}
            </FieldLabel>
            <Input
              id="cover"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setFile(event.target.files?.[0] ?? null)
              }
              required
            />
            <FieldDescription>
              {preview
                ? "Pratinjau gambar baru. Klik unggah untuk menyimpan."
                : "Rasio yang disarankan 16:9."}
            </FieldDescription>
          </Field>

          {state.message ? (
            <Alert variant={state.ok ? "default" : "destructive"}>
              <AlertTitle>
                {state.ok ? "Berhasil" : "Gagal mengunggah"}
              </AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          <div>
            <Button
              type="submit"
              disabled={pending}
              className="rounded-full"
            >
              {pending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Upload data-icon="inline-start" />
              )}
              {pending ? "Mengunggah…" : "Unggah gambar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
