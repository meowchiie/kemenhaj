"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Images, Upload } from "lucide-react";
import {
  addGalleryItemAction,
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
import DeleteGalleryItemButton from "@/components/admin/delete-gallery-item-button";
import type { AdminGalleryItem } from "@/lib/data/galleries";

const initialState: GalleryFormState = { ok: false };

export default function GalleryItemsCard({
  galleryId,
  items,
}: {
  galleryId: string;
  items: AdminGalleryItem[];
}) {
  const [state, formAction, pending] = useActionState(
    addGalleryItemAction,
    initialState,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Images className="size-4" />
          Foto album
        </CardTitle>
        <CardDescription>
          {items.length} foto tersimpan. Tambahkan satu foto per unggahan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Album belum memiliki foto.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-border"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  {item.media ? (
                    <Image
                      src={item.media.href}
                      alt={item.caption}
                      fill
                      unoptimized
                      sizes="320px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex items-start justify-between gap-2 p-3">
                  <p className="text-xs leading-relaxed">{item.caption}</p>
                  <DeleteGalleryItemButton
                    itemId={item.id}
                    galleryId={galleryId}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-3 border-t border-border pt-4">
          <input type="hidden" name="galleryId" value={galleryId} />
          <Field>
            <FieldLabel htmlFor="item-file">Gambar</FieldLabel>
            <Input
              id="item-file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
            />
            <FieldDescription>Maksimal 2 MB per gambar.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="caption">Keterangan foto</FieldLabel>
            <Input
              id="caption"
              name="caption"
              placeholder="Contoh: Pembukaan sosialisasi"
              required
            />
          </Field>

          {state.message ? (
            <Alert variant={state.ok ? "default" : "destructive"}>
              <AlertTitle>
                {state.ok ? "Berhasil" : "Gagal menambahkan"}
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
              {pending ? "Mengunggah…" : "Tambah foto"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
