"use client";

import { useActionState, useState } from "react";
import { FileText, Upload } from "lucide-react";
import { uploadPdfAction } from "@/app/admin/(panel)/layanan/actions";
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
import type { ServiceFormFile } from "@/lib/data/services";

const initialState = { ok: false, message: undefined as string | undefined };

export default function PdfUploadCard({
  serviceId,
  form,
}: {
  serviceId: string;
  form: ServiceFormFile | null;
}) {
  const [state, formAction, pending] = useActionState(
    uploadPdfAction,
    initialState,
  );
  const [file, setFile] = useState<File | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4" />
          Formulir PDF
        </CardTitle>
        <CardDescription>
          Satu berkas PDF maksimal 5 MB. Berkas lama dihapus setelah unggahan
          baru berhasil disimpan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {form ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{form.filename}</p>
              <p className="text-xs text-muted-foreground">{form.size}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              render={<a href={form.href} />}
            >
              Unduh berkas
            </Button>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Belum ada formulir PDF untuk layanan ini.
          </p>
        )}

        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="serviceId" value={serviceId} />
          <Field>
            <FieldLabel htmlFor="file">
              {form ? "Ganti berkas PDF" : "Unggah berkas PDF"}
            </FieldLabel>
            <Input
              id="file"
              name="file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) =>
                setFile(event.target.files?.[0] ?? null)
              }
              required
            />
            <FieldDescription>
              {file
                ? `${file.name} · ${Math.max(1, Math.round(file.size / 1024))} KB`
                : "Hanya PDF dengan tanda tangan berkas valid yang diterima."}
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
              {pending ? "Mengunggah…" : "Unggah PDF"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
