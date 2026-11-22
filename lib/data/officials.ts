import { asc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { requirePermission } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import type { Official } from "@/lib/content";
import { db } from "@/lib/db";
import { auditLogs, media, officials } from "@/lib/db/schema";
import { deleteMediaIfUnused } from "@/lib/data/media";
import type { OfficialInput } from "@/lib/validation/official";
import { storeImage } from "@/lib/uploads/storage";

export type OfficialMedia = {
  id: string;
  filename: string;
  href: string;
};

export type AdminOfficial = Official & {
  isActive: boolean;
  photo: string;
  photoMedia: OfficialMedia | null;
};

const columns = {
  id: officials.id,
  name: officials.name,
  nip: officials.nip,
  position: officials.position,
  unit: officials.unit,
  sortOrder: officials.sortOrder,
  duties: officials.duties,
  contact: officials.contact,
  isActive: officials.isActive,
  mediaId: media.id,
  mediaFilename: media.filename,
};

type OfficialGraphRow = {
  id: string;
  name: string;
  nip: string;
  position: string;
  unit: string;
  sortOrder: number;
  duties: string;
  contact: string;
  isActive: boolean;
  mediaId: string | null;
  mediaFilename: string | null;
};

function photoOf(row: OfficialGraphRow): string {
  return row.mediaId ? `/api/files/${row.mediaId}` : "/images/pejabat-1.jpg";
}

function toOfficial(row: OfficialGraphRow): Official {
  return {
    id: row.id,
    name: row.name,
    nip: row.nip,
    position: row.position,
    unit: row.unit,
    order: row.sortOrder,
    photo: photoOf(row),
    duties: row.duties,
    contact: row.contact,
  };
}

function toAdminOfficial(row: OfficialGraphRow): AdminOfficial {
  return {
    ...toOfficial(row),
    isActive: row.isActive,
    photoMedia:
      row.mediaId && row.mediaFilename
        ? {
            id: row.mediaId,
            filename: row.mediaFilename,
            href: `/api/files/${row.mediaId}`,
          }
        : null,
  };
}

export async function getPublicOfficials(): Promise<Official[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("officials");

  const rows = await db
    .select(columns)
    .from(officials)
    .leftJoin(media, eq(officials.photoMediaId, media.id))
    .where(eq(officials.isActive, true))
    .orderBy(asc(officials.sortOrder), asc(officials.name));

  return rows.map(toOfficial);
}

export async function getNextOfficialOrder(): Promise<number> {
  await requirePermission("officials:read");

  const [row] = await db
    .select({
      maxOrder: sql<number>`coalesce(max(${officials.sortOrder}), 0)::int`,
    })
    .from(officials);

  return Math.min((row?.maxOrder ?? 0) + 1, 999);
}

export async function listAdminOfficials(): Promise<AdminOfficial[]> {
  await requirePermission("officials:read");

  const rows = await db
    .select(columns)
    .from(officials)
    .leftJoin(media, eq(officials.photoMediaId, media.id))
    .orderBy(asc(officials.sortOrder), asc(officials.name));

  return rows.map(toAdminOfficial);
}

export async function getAdminOfficial(
  id: string,
): Promise<AdminOfficial | undefined> {
  const all = await listAdminOfficials();
  return all.find((official) => official.id === id);
}

function valuesFromInput(input: OfficialInput) {
  return {
    name: input.name,
    nip: input.nip,
    position: input.position,
    unit: input.unit,
    sortOrder: input.sortOrder,
    duties: input.duties,
    contact: input.contact,
    isActive: input.isActive,
    updatedAt: new Date(),
  };
}

export async function createOfficial(
  input: OfficialInput,
  actor: SessionUser,
): Promise<string> {
  await requirePermission("officials:write");

  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(officials)
      .values(valuesFromInput(input))
      .returning({ id: officials.id });

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "official.create",
      entity: "official",
      entityId: row.id,
      summary: `Menambahkan pejabat ${input.name}.`,
    });

    return row.id;
  });
}

export async function updateOfficial(
  id: string,
  input: OfficialInput,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("officials:write");

  await db.transaction(async (tx) => {
    const updated = await tx
      .update(officials)
      .set(valuesFromInput(input))
      .where(eq(officials.id, id))
      .returning({ id: officials.id });

    if (updated.length === 0) throw new Error("Pejabat tidak ditemukan.");

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "official.update",
      entity: "official",
      entityId: id,
      summary: `Memperbarui data pejabat ${input.name}.`,
    });
  });
}

export async function deleteOfficial(
  id: string,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("officials:delete");

  const photoMediaId = await db.transaction(async (tx) => {
    const [row] = await tx
      .select({ name: officials.name, photoMediaId: officials.photoMediaId })
      .from(officials)
      .where(eq(officials.id, id))
      .limit(1);

    if (!row) throw new Error("Pejabat tidak ditemukan.");

    await tx.delete(officials).where(eq(officials.id, id));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "official.delete",
      entity: "official",
      entityId: id,
      summary: `Menghapus pejabat ${row.name}.`,
    });

    return row.photoMediaId;
  });

  if (photoMediaId) await deleteMediaIfUnused(photoMediaId);
}

export async function replaceOfficialPhoto(
  officialId: string,
  file: File,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("officials:write");

  const [official] = await db
    .select({ name: officials.name, photoMediaId: officials.photoMediaId })
    .from(officials)
    .where(eq(officials.id, officialId))
    .limit(1);

  if (!official) throw new Error("Pejabat tidak ditemukan.");

  const stored = await storeImage(file);

  const { oldMediaId, newMediaId } = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(media)
      .values({
        kind: "image",
        filename: stored.filename,
        mime: stored.mime,
        bytes: stored.bytes,
        sha256: stored.sha256,
        path: stored.path,
        uploadedBy: actor.id,
      })
      .returning({ id: media.id });

    await tx
      .update(officials)
      .set({ photoMediaId: inserted.id, updatedAt: new Date() })
      .where(eq(officials.id, officialId));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "official.photo.replace",
      entity: "official",
      entityId: officialId,
      summary: `Mengganti foto pejabat ${official.name}.`,
    });

    return { oldMediaId: official.photoMediaId, newMediaId: inserted.id };
  });

  if (oldMediaId && oldMediaId !== newMediaId) {
    await deleteMediaIfUnused(oldMediaId);
  }
}

export async function getOfficialStats() {
  await requirePermission("officials:read");

  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${officials.isActive})::int`,
    })
    .from(officials);

  return row ?? { total: 0, active: 0 };
}
