"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import {
  saveGalleryAction,
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
  FieldGroup,
  FieldLabel,
} from "@/components/admin/ui/field";
import { Input } from "@/components/admin/ui/input";
import { Spinner } from "@/components/admin/ui/spinner";
import { Switch } from "@/components/admin/ui/switch";
import { Textarea } from "@/components/admin/ui/textarea";
import type { AdminGallery } from "@/lib/data/galleries";

const initialState: GalleryFormState = { ok: false };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function GalleryForm({ gallery }: { gallery?: AdminGallery }) {
  const [state, formAction, pending] = useActionState(
    saveGalleryAction,
    initialState,
  );
  const [title, setTitle] = useState(gallery?.title ?? "");
  const [slug, setSlug] = useState(gallery?.slug ?? "");
  const [isPublished, setIsPublished] = useState(gallery?.isPublished ?? false);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {gallery ? <input type="hidden" name="id" value={gallery.id} /> : null}

      {state.message ? (
        <Alert variant={state.ok ? "default" : "destructive"}>
          <AlertTitle>
            {state.ok ? "Tersimpan" : "Tidak dapat menyimpan"}
          </AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Identitas album</CardTitle>
          <CardDescription>
            Judul, tanggal kegiatan, dan deskripsi album galeri.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="title">Judul album</FieldLabel>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={() => {
                  if (!slug) setSlug(slugify(title));
                }}
                required
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title ? (
                <FieldDescription className="text-destructive">
                  {errors.title}
                </FieldDescription>
              ) : null}
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.slug)}>
                <FieldLabel htmlFor="slug">Slug URL</FieldLabel>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  required
                  aria-invalid={Boolean(errors.slug)}
                />
                <FieldDescription>
                  Dipakai pada tautan album, contoh: manasik-2026.
                </FieldDescription>
              </Field>

              <Field data-invalid={Boolean(errors.eventDate)}>
                <FieldLabel htmlFor="eventDate">Tanggal kegiatan</FieldLabel>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  defaultValue={gallery?.eventDate ?? ""}
                  required
                  aria-invalid={Boolean(errors.eventDate)}
                />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
              <Textarea
                id="description"
                name="description"
                defaultValue={gallery?.description ?? ""}
                rows={3}
                required
                aria-invalid={Boolean(errors.description)}
              />
            </Field>

            <Field orientation="horizontal">
              <div className="flex flex-1 flex-col gap-1">
                <FieldLabel htmlFor="published">Terbitkan album</FieldLabel>
                <FieldDescription>
                  Album draf tidak tampil di portal publik.
                </FieldDescription>
              </div>
              <Switch
                id="published"
                checked={isPublished}
                onCheckedChange={(checked) => setIsPublished(Boolean(checked))}
              />
              <input
                type="hidden"
                name="isPublished"
                value={isPublished ? "on" : "off"}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="rounded-full"
        >
          {pending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Save data-icon="inline-start" />
          )}
          {pending ? "Menyimpan…" : "Simpan perubahan"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          render={<Link href="/admin/galeri" />}
        >
          Kembali ke daftar
        </Button>
      </div>
    </form>
  );
}
