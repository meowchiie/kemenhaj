"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  saveServiceAction,
  type ServiceFormState,
} from "@/app/admin/(panel)/layanan/actions";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { Spinner } from "@/components/admin/ui/spinner";
import { Switch } from "@/components/admin/ui/switch";
import { Textarea } from "@/components/admin/ui/textarea";
import type { AdminService, ServiceIconName } from "@/lib/data/services";

const initialState: ServiceFormState = { ok: false };

const iconOptions = [
  { value: "register", label: "Pendaftaran" },
  { value: "transfer", label: "Pelimpahan" },
  { value: "cancel", label: "Pembatalan" },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function ServiceForm({ service }: { service?: AdminService }) {
  const [state, formAction, pending] = useActionState(
    saveServiceAction,
    initialState,
  );
  const [name, setName] = useState(service?.name ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [icon, setIcon] = useState<ServiceIconName>(service?.icon ?? "register");
  const [isPublished, setIsPublished] = useState(
    service?.isPublished ?? false,
  );
  const [requirements, setRequirements] = useState<string[]>(
    service?.requirements.length ? service.requirements : [""],
  );
  const [steps, setSteps] = useState(
    service?.steps.length ? service.steps : [{ title: "", detail: "" }],
  );

  const errors = state.fieldErrors ?? {};

  function updateRequirement(index: number, value: string) {
    setRequirements((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function updateStep(index: number, key: "title" | "detail", value: string) {
    setSteps((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}

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
          <CardTitle>Identitas layanan</CardTitle>
          <CardDescription>
            Nama, slug, dan ringkasan yang tampil di portal publik.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="name">Nama layanan</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onBlur={() => {
                    if (!slug) setSlug(slugify(name));
                  }}
                  required
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? (
                  <FieldDescription className="text-destructive">
                    {errors.name}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field data-invalid={Boolean(errors.shortName)}>
                <FieldLabel htmlFor="shortName">Nama pendek</FieldLabel>
                <Input
                  id="shortName"
                  name="shortName"
                  defaultValue={service?.shortName ?? ""}
                  required
                  aria-invalid={Boolean(errors.shortName)}
                />
                <FieldDescription>
                  Dipakai di kartu dan chip navigasi.
                </FieldDescription>
              </Field>

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
                  Huruf kecil dan tanda hubung. Contoh: pelimpahan-porsi.
                </FieldDescription>
              </Field>

              <Field data-invalid={Boolean(errors.icon)}>
                <FieldLabel htmlFor="icon">Ikon</FieldLabel>
                <Select
                  value={icon}
                  onValueChange={(value) => setIcon(value as ServiceIconName)}
                >
                  <SelectTrigger id="icon" className="w-full">
                    <SelectValue placeholder="Pilih ikon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
              <Textarea
                id="description"
                name="description"
                defaultValue={service?.description ?? ""}
                rows={4}
                required
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description ? (
                <FieldDescription className="text-destructive">
                  {errors.description}
                </FieldDescription>
              ) : null}
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.duration)}>
                <FieldLabel htmlFor="duration">Durasi proses</FieldLabel>
                <Input
                  id="duration"
                  name="duration"
                  defaultValue={service?.duration ?? ""}
                  required
                  aria-invalid={Boolean(errors.duration)}
                />
              </Field>

              <Field data-invalid={Boolean(errors.cost)}>
                <FieldLabel htmlFor="cost">Biaya</FieldLabel>
                <Input
                  id="cost"
                  name="cost"
                  defaultValue={service?.cost ?? ""}
                  required
                  aria-invalid={Boolean(errors.cost)}
                />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.note)}>
              <FieldLabel htmlFor="note">Catatan tambahan</FieldLabel>
              <Textarea
                id="note"
                name="note"
                defaultValue={service?.note ?? ""}
                rows={3}
              />
              <FieldDescription>
                Tampil sebagai catatan di akhir halaman layanan.
              </FieldDescription>
            </Field>

            <Field orientation="horizontal">
              <div className="flex flex-1 flex-col gap-1">
                <FieldLabel htmlFor="published">Terbitkan layanan</FieldLabel>
                <FieldDescription>
                  Jika dimatikan, layanan disembunyikan dari portal publik.
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

      <Card>
        <CardHeader>
          <CardTitle>Persyaratan dokumen</CardTitle>
          <CardDescription>
            Satu baris untuk satu persyaratan. Urutan mengikuti daftar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {requirements.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="mt-2 grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
                {index + 1}
              </span>
              <Textarea
                name="requirements"
                value={item}
                onChange={(event) => updateRequirement(index, event.target.value)}
                rows={2}
                aria-label={`Persyaratan ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Hapus persyaratan ${index + 1}`}
                disabled={requirements.length === 1}
                onClick={() =>
                  setRequirements((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          {errors.requirements ? (
            <p className="text-xs text-destructive">{errors.requirements}</p>
          ) : null}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setRequirements((current) => [...current, ""])}
            >
              <Plus data-icon="inline-start" />
              Tambah persyaratan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alur proses</CardTitle>
          <CardDescription>
            Langkah yang ditampilkan sebagai timeline di halaman layanan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-muted/40 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground">
                  Langkah {index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Hapus langkah ${index + 1}`}
                  disabled={steps.length === 1}
                  onClick={() =>
                    setSteps((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <Trash2 />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  name="stepTitle"
                  value={step.title}
                  onChange={(event) =>
                    updateStep(index, "title", event.target.value)
                  }
                  placeholder="Judul langkah"
                  aria-label={`Judul langkah ${index + 1}`}
                />
                <Textarea
                  name="stepDetail"
                  value={step.detail}
                  onChange={(event) =>
                    updateStep(index, "detail", event.target.value)
                  }
                  placeholder="Keterangan langkah"
                  rows={2}
                  aria-label={`Keterangan langkah ${index + 1}`}
                />
              </div>
            </div>
          ))}
          {errors.steps ? (
            <p className="text-xs text-destructive">{errors.steps}</p>
          ) : null}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                setSteps((current) => [...current, { title: "", detail: "" }])
              }
            >
              <Plus data-icon="inline-start" />
              Tambah langkah
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={pending} className="rounded-full">
          {pending ? <Spinner data-icon="inline-start" /> : <Save data-icon="inline-start" />}
          {pending ? "Menyimpan…" : "Simpan perubahan"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          render={<Link href="/admin/layanan" />}
        >
          Kembali ke daftar
        </Button>
      </div>
    </form>
  );
}
