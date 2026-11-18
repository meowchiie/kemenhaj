"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import {
  saveProfileAction,
  type ProfileFormState,
} from "@/app/admin/(panel)/profil/actions";
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

const initialState: ProfileFormState = { ok: false };

export default function ProfileForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveProfileAction,
    initialState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identitas akun</CardTitle>
        <CardDescription>
          Nama dan email dipakai untuk masuk ke dashboard dan tercatat di audit
          log.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          {state.message ? (
            <Alert variant={state.ok ? "default" : "destructive"}>
              <AlertTitle>
                {state.ok ? "Tersimpan" : "Tidak dapat menyimpan"}
              </AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="name">Nama lengkap</FieldLabel>
              <Input
                id="name"
                name="name"
                defaultValue={name}
                autoComplete="name"
                required
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? (
                <FieldDescription className="text-destructive">
                  {errors.name}
                </FieldDescription>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                autoComplete="email"
                required
                aria-invalid={Boolean(errors.email)}
              />
              <FieldDescription>
                Gunakan email dinas yang aktif. Email ini menjadi username
                login.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <div>
            <Button
              type="submit"
              disabled={pending}
              className="rounded-full"
            >
              {pending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Save data-icon="inline-start" />
              )}
              {pending ? "Menyimpan…" : "Simpan profil"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
