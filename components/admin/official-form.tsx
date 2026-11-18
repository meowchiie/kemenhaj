"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import {
  saveOfficialAction,
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
  FieldGroup,
  FieldLabel,
} from "@/components/admin/ui/field";
import { Input } from "@/components/admin/ui/input";
import { Spinner } from "@/components/admin/ui/spinner";
import { Switch } from "@/components/admin/ui/switch";
import { Textarea } from "@/components/admin/ui/textarea";
import type { AdminOfficial } from "@/lib/data/officials";

const initialState: OfficialFormState = { ok: false };

export default function OfficialForm({
  official,
}: {
  official?: AdminOfficial;
}) {
  const [state, formAction, pending] = useActionState(
    saveOfficialAction,
    initialState,
  );
  const [isActive, setIsActive] = useState(official?.isActive ?? true);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {official ? <input type="hidden" name="id" value={official.id} /> : null}

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
          <CardTitle>Identitas pejabat</CardTitle>
          <CardDescription>
            Data yang tampil pada kartu profil dan bagan organisasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="name">Nama lengkap</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  defaultValue={official?.name ?? ""}
                  required
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? (
                  <FieldDescription className="text-destructive">
                    {errors.name}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field data-invalid={Boolean(errors.nip)}>
                <FieldLabel htmlFor="nip">NIP</FieldLabel>
                <Input
                  id="nip"
                  name="nip"
                  defaultValue={official?.nip ?? ""}
                  required
                  aria-invalid={Boolean(errors.nip)}
                />
                <FieldDescription>Harus unik antar pejabat.</FieldDescription>
              </Field>

              <Field data-invalid={Boolean(errors.position)}>
                <FieldLabel htmlFor="position">Jabatan</FieldLabel>
                <Input
                  id="position"
                  name="position"
                  defaultValue={official?.position ?? ""}
                  required
                  aria-invalid={Boolean(errors.position)}
                />
              </Field>

              <Field data-invalid={Boolean(errors.unit)}>
                <FieldLabel htmlFor="unit">Unit kerja</FieldLabel>
                <Input
                  id="unit"
                  name="unit"
                  defaultValue={official?.unit ?? ""}
                  required
                  aria-invalid={Boolean(errors.unit)}
                />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.duties)}>
              <FieldLabel htmlFor="duties">Tugas pokok</FieldLabel>
              <Textarea
                id="duties"
                name="duties"
                defaultValue={official?.duties ?? ""}
                rows={4}
                required
                aria-invalid={Boolean(errors.duties)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.contact)}>
                <FieldLabel htmlFor="contact">Kontak</FieldLabel>
                <Input
                  id="contact"
                  name="contact"
                  defaultValue={official?.contact ?? ""}
                  required
                  aria-invalid={Boolean(errors.contact)}
                />
                <FieldDescription>
                  Nomor telepon atau alamat email resmi.
                </FieldDescription>
              </Field>

              <Field data-invalid={Boolean(errors.sortOrder)}>
                <FieldLabel htmlFor="sortOrder">Urutan tampil</FieldLabel>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={1}
                  max={999}
                  defaultValue={official?.order ?? 1}
                  required
                  aria-invalid={Boolean(errors.sortOrder)}
                />
                <FieldDescription>
                  Angka kecil tampil lebih dulu. Harus unik.
                </FieldDescription>
              </Field>
            </div>

            <Field orientation="horizontal">
              <div className="flex flex-1 flex-col gap-1">
                <FieldLabel htmlFor="active">Tampilkan di portal</FieldLabel>
                <FieldDescription>
                  Nonaktifkan untuk menyembunyikan pejabat tanpa menghapus data.
                </FieldDescription>
              </div>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(Boolean(checked))}
              />
              <input
                type="hidden"
                name="isActive"
                value={isActive ? "on" : "off"}
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
          render={<Link href="/admin/pejabat" />}
        >
          Kembali ke daftar
        </Button>
      </div>
    </form>
  );
}
