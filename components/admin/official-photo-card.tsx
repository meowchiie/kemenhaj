"use client";

import Image from "next/image";
import { useActionState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import {
  uploadOfficialPhotoAction,
  type OfficialFormState,
} from "@/app/admin/(panel)/pejabat/actions";
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
import type { OfficialMedia } from "@/lib/data/officials";

const initialState: OfficialFormState = { ok: false };

export default function OfficialPhotoCard({
  officialId,
  photo,
}: {
  officialId: string;
  photo: OfficialMedia | null;
}) {
  const [state, formAction, pending] = useActionState(
    uploadOfficialPhotoAction,
    initialState,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="size-4" />
          Foto pejabat
        </CardTitle>
        <CardDescription>
          JPG, PNG, atau WebP maksimal 2 MB. Rasio potret 4:5.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {photo ? (
          <div className="relative aspect-[4/5] max-w-56 overflow-hidden rounded-xl bg-muted">
            <Image
              src={photo.href}
              alt={photo.filename}
              fill
              sizes="224px"
              className="object-cover"
            />
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Belum ada foto. Portal memakai foto bawaan.
          </p>
        )}

        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="officialId" value={officialId} />
          <Field>
            <FieldLabel htmlFor="photo">
              {photo ? "Ganti foto" : "Unggah foto"}
            </FieldLabel>
            <Input
              id="photo"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
            />
            <FieldDescription>
              Foto tegak, wajah terlihat jelas.
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
            <Button type="submit" disabled={pending} className="rounded-full">
              {pending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Upload data-icon="inline-start" />
              )}
              {pending ? "Mengunggah…" : "Unggah foto"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
