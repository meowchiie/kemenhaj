import { redirect } from "next/navigation";
import { getCurrentUser, type SessionUser } from "./session";

export type Permission =
  | "services:read"
  | "services:write"
  | "services:delete"
  | "articles:read"
  | "articles:write"
  | "articles:delete"
  | "officials:read"
  | "officials:write"
  | "officials:delete"
  | "galleries:read"
  | "galleries:write"
  | "galleries:delete"
  | "audit:read";

const matrix: Record<SessionUser["role"], Permission[]> = {
  superadmin: [
    "services:read",
    "services:write",
    "services:delete",
    "articles:read",
    "articles:write",
    "articles:delete",
    "officials:read",
    "officials:write",
    "officials:delete",
    "galleries:read",
    "galleries:write",
    "galleries:delete",
    "audit:read",
  ],
};

export class AuthorizationError extends Error {
  constructor(message = "Anda tidak memiliki izin untuk tindakan ini.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function can(user: SessionUser | null, permission: Permission): boolean {
  if (!user) return false;
  return matrix[user.role].includes(permission);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

export async function requirePermission(
  permission: Permission,
): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!can(user, permission)) {
    throw new AuthorizationError();
  }

  return user;
}
