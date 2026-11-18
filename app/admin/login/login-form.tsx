"use client";

import { useActionState } from "react";
import { KeyRound, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/admin/ui/alert";
import { Button } from "@/components/admin/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/admin/ui/field";
import { Input } from "@/components/admin/ui/input";
import { Spinner } from "@/components/admin/ui/spinner";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="nama@kemenhajpare.go.id"
              className="h-11 rounded-full pl-9"
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password akun"
              className="h-11 rounded-full pl-9"
            />
          </div>
        </Field>
      </FieldGroup>

      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Gagal masuk</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-11 w-full rounded-full"
      >
        {pending ? <Spinner data-icon="inline-start" /> : null}
        {pending ? "Memeriksa…" : "Masuk dashboard"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Akun dikelola oleh administrator kantor. Hubungi admin bila lupa
        password.
      </p>
    </form>
  );
}
