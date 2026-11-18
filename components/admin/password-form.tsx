"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import {
  savePasswordAction,
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

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(
    savePasswordAction,
    initialState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ganti password</CardTitle>
        <CardDescription>
          Masukkan password saat ini untuk memastikan perubahan dilakukan oleh
          pemilik akun.
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
            <Field data-invalid={Boolean(errors.currentPassword)}>
              <FieldLabel htmlFor="currentPassword">
                Password saat ini
              </FieldLabel>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={Boolean(errors.currentPassword)}
              />
              {errors.currentPassword ? (
                <FieldDescription className="text-destructive">
                  {errors.currentPassword}
                </FieldDescription>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.newPassword)}>
              <FieldLabel htmlFor="newPassword">Password baru</FieldLabel>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                aria-invalid={Boolean(errors.newPassword)}
              />
              <FieldDescription>Minimal 8 karakter.</FieldDescription>
              {errors.newPassword ? (
                <FieldDescription className="text-destructive">
                  {errors.newPassword}
                </FieldDescription>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.confirmPassword)}>
              <FieldLabel htmlFor="confirmPassword">
                Ulangi password baru
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                aria-invalid={Boolean(errors.confirmPassword)}
              />
              {errors.confirmPassword ? (
                <FieldDescription className="text-destructive">
                  {errors.confirmPassword}
                </FieldDescription>
              ) : null}
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
                <KeyRound data-icon="inline-start" />
              )}
              {pending ? "Menyimpan…" : "Perbarui password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
