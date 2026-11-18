"use client";

import Image from "next/image";
import { useActionState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import {
  uploadGalleryCoverAction,
  type GalleryFormState,
} from "@/app/admin/(panel)/galeri/actions";
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
import type { GalleryMedia } from "@/lib/data/galleries";

const initialState: GalleryFormState = { ok: false };

export default function GalleryCoverCard({
  galleryId,
  cover,
}: {
  galleryId: string;
  cover: GalleryMedia | null;
}) {
  const [state, formAction, pending] = useActionState(
    uploadGalleryCoverAction,
    initialState,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="size-4" />
          Sampul album
        </CardTitle>
        <CardDescription>
          JPG, PNG, atau WebP maksimal 2 MB. Jika kosong, foto pertama dipakai.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {cover ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            <Image
              src={cover.href}
              alt={cover.filename}
              fill
              unoptimized
              sizes="640px"
              className="object-cover"
            />
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Belum ada sampul khusus.
          </p>
        )}

        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="galleryId" value={galleryId} />
          <Field>
            <FieldLabel htmlFor="cover">
              {cover ? "Ganti sampul" : "Unggah sampul"}
            </FieldLabel>
            <Input
              id="cover"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
            />
            <FieldDescription>Rasio yang disarankan 4:3.</FieldDescription>
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
            <Button type="submit" disabled={pending} className="rounded-full">
              {pending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Upload data-icon="inline-start" />
              )}
              {pending ? "Mengunggah…" : "Unggah sampul"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
