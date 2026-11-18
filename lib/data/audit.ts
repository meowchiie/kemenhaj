import { desc, eq } from "drizzle-orm";
import { requirePermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { auditLogs, users } from "@/lib/db/schema";

export type AuditEntry = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  summary: string;
  createdAt: Date;
  actorName: string | null;
  actorEmail: string | null;
};

type AuditInput = {
  actorId: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  summary: string;
};

export async function recordAudit(input: AuditInput): Promise<void> {
  await db.insert(auditLogs).values({
    actorId: input.actorId,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId ?? null,
    summary: input.summary,
  });
}

async function queryAudit(limit: number): Promise<AuditEntry[]> {
  return db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      entity: auditLogs.entity,
      entityId: auditLogs.entityId,
      summary: auditLogs.summary,
      createdAt: auditLogs.createdAt,
      actorName: users.name,
      actorEmail: users.email,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.actorId, users.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
}

export async function listRecentAudit(limit = 6): Promise<AuditEntry[]> {
  return queryAudit(limit);
}

export async function listAuditLogs(limit = 100): Promise<AuditEntry[]> {
  await requirePermission("audit:read");
  return queryAudit(limit);
}
