import { asc, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { requirePermission } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import type { Album, GalleryItem } from "@/lib/content";
import { db } from "@/lib/db";
import { auditLogs, galleries, galleryItems, media } from "@/lib/db/schema";
import { deleteMediaIfUnused } from "@/lib/data/media";
import type { GalleryInput } from "@/lib/validation/gallery";
import { storeImage } from "@/lib/uploads/storage";

export type GalleryMedia = {
  id: string;
  filename: string;
  href: string;
};

export type AdminGalleryItem = {
  id: string;
  caption: string;
  media: GalleryMedia | null;
};

export type AdminGallery = {
  id: string;
  slug: string;
  title: string;
  description: string;
  eventDate: string;
  isPublished: boolean;
  cover: GalleryMedia | null;
  items: AdminGalleryItem[];
};

const galleryColumns = {
  id: galleries.id,
  slug: galleries.slug,
  title: galleries.title,
  description: galleries.description,
  eventDate: galleries.eventDate,
  isPublished: galleries.isPublished,
  coverMediaId: galleries.coverMediaId,
  coverFilename: media.filename,
};

type GalleryGraphRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  eventDate: string;
  isPublished: boolean;
  coverMediaId: string | null;
  coverFilename: string | null;
};

function mediaOf(
  id: string | null,
  filename: string | null,
): GalleryMedia | null {
  if (!id || !filename) return null;
  return { id, filename, href: `/api/files/${id}` };
}

function toAlbum(row: GalleryGraphRow, items: GalleryItem[]): Album {
  const cover = row.coverMediaId
    ? `/api/files/${row.coverMediaId}`
    : (items[0]?.src ?? "/images/galeri-1.jpg");

  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    year: Number(row.eventDate.slice(0, 4)),
    date: row.eventDate,
    cover,
    items,
  };
}

async function fetchPublicAlbums() {
  const rows = await db
    .select(galleryColumns)
    .from(galleries)
    .leftJoin(media, eq(galleries.coverMediaId, media.id))
    .where(eq(galleries.isPublished, true))
    .orderBy(desc(galleries.eventDate));

  if (rows.length === 0) return [];

  const itemRows = await db
    .select({
      galleryId: galleryItems.galleryId,
      mediaId: galleryItems.mediaId,
      caption: galleryItems.caption,
      filename: media.filename,
    })
    .from(galleryItems)
    .leftJoin(media, eq(galleryItems.mediaId, media.id))
    .orderBy(asc(galleryItems.position));

  return rows.map((row) =>
    toAlbum(
      row,
      itemRows
        .filter((item) => item.galleryId === row.id && item.mediaId)
        .map((item) => ({
          src: `/api/files/${item.mediaId}`,
          caption: item.caption,
          type: "image" as const,
        })),
    ),
  );
}

export async function getPublicGalleries(): Promise<Album[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("galleries");

  return fetchPublicAlbums();
}

async function fetchAdminGalleries(): Promise<AdminGallery[]> {
  const rows = await db
    .select(galleryColumns)
    .from(galleries)
    .leftJoin(media, eq(galleries.coverMediaId, media.id))
    .orderBy(desc(galleries.eventDate));

  if (rows.length === 0) return [];

  const itemRows = await db
    .select({
      id: galleryItems.id,
      galleryId: galleryItems.galleryId,
      caption: galleryItems.caption,
      mediaId: galleryItems.mediaId,
      filename: media.filename,
    })
    .from(galleryItems)
    .leftJoin(media, eq(galleryItems.mediaId, media.id))
    .orderBy(asc(galleryItems.position));

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    eventDate: row.eventDate,
    isPublished: row.isPublished,
    cover: mediaOf(row.coverMediaId, row.coverFilename),
    items: itemRows
      .filter((item) => item.galleryId === row.id)
      .map((item) => ({
        id: item.id,
        caption: item.caption,
        media: mediaOf(item.mediaId, item.filename),
      })),
  }));
}

export async function listAdminGalleries(): Promise<AdminGallery[]> {
  await requirePermission("galleries:read");
  return fetchAdminGalleries();
}

export async function getAdminGallery(
  id: string,
): Promise<AdminGallery | undefined> {
  await requirePermission("galleries:read");
  const all = await fetchAdminGalleries();
  return all.find((gallery) => gallery.id === id);
}

function valuesFromInput(input: GalleryInput, actor: SessionUser) {
  return {
    slug: input.slug,
    title: input.title,
    description: input.description,
    eventDate: input.eventDate,
    isPublished: input.isPublished,
    updatedBy: actor.id,
    updatedAt: new Date(),
  };
}

export async function createGallery(
  input: GalleryInput,
  actor: SessionUser,
): Promise<string> {
  await requirePermission("galleries:write");

  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(galleries)
      .values(valuesFromInput(input, actor))
      .returning({ id: galleries.id });

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "gallery.create",
      entity: "gallery",
      entityId: row.id,
      summary: `Menambahkan album ${input.title}.`,
    });

    return row.id;
  });
}

export async function updateGallery(
  id: string,
  input: GalleryInput,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("galleries:write");

  await db.transaction(async (tx) => {
    const updated = await tx
      .update(galleries)
      .set(valuesFromInput(input, actor))
      .where(eq(galleries.id, id))
      .returning({ id: galleries.id });

    if (updated.length === 0) throw new Error("Album tidak ditemukan.");

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "gallery.update",
      entity: "gallery",
      entityId: id,
      summary: `Memperbarui album ${input.title}.`,
    });
  });
}

export async function deleteGallery(
  id: string,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("galleries:delete");

  const mediaIds = await db.transaction(async (tx) => {
    const [row] = await tx
      .select({ title: galleries.title, coverMediaId: galleries.coverMediaId })
      .from(galleries)
      .where(eq(galleries.id, id))
      .limit(1);

    if (!row) throw new Error("Album tidak ditemukan.");

    const items = await tx
      .select({ mediaId: galleryItems.mediaId })
      .from(galleryItems)
      .where(eq(galleryItems.galleryId, id));

    await tx.delete(galleries).where(eq(galleries.id, id));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "gallery.delete",
      entity: "gallery",
      entityId: id,
      summary: `Menghapus album ${row.title}.`,
    });

    return [
      row.coverMediaId,
      ...items.map((item) => item.mediaId),
    ].filter((value): value is string => Boolean(value));
  });

  for (const mediaId of mediaIds) {
    await deleteMediaIfUnused(mediaId);
  }
}

export async function replaceGalleryCover(
  galleryId: string,
  file: File,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("galleries:write");

  const [gallery] = await db
    .select({ title: galleries.title, coverMediaId: galleries.coverMediaId })
    .from(galleries)
    .where(eq(galleries.id, galleryId))
    .limit(1);

  if (!gallery) throw new Error("Album tidak ditemukan.");

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
      .update(galleries)
      .set({
        coverMediaId: inserted.id,
        updatedBy: actor.id,
        updatedAt: new Date(),
      })
      .where(eq(galleries.id, galleryId));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "gallery.cover.replace",
      entity: "gallery",
      entityId: galleryId,
      summary: `Mengganti sampul album ${gallery.title}.`,
    });

    return { oldMediaId: gallery.coverMediaId, newMediaId: inserted.id };
  });

  if (oldMediaId && oldMediaId !== newMediaId) {
    await deleteMediaIfUnused(oldMediaId);
  }
}

export async function addGalleryItem(
  galleryId: string,
  file: File,
  caption: string,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("galleries:write");

  const [gallery] = await db
    .select({ title: galleries.title })
    .from(galleries)
    .where(eq(galleries.id, galleryId))
    .limit(1);

  if (!gallery) throw new Error("Album tidak ditemukan.");

  const stored = await storeImage(file);

  await db.transaction(async (tx) => {
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

    const [last] = await tx
      .select({ position: sql<number>`coalesce(max(${galleryItems.position}), 0)::int` })
      .from(galleryItems)
      .where(eq(galleryItems.galleryId, galleryId));

    await tx.insert(galleryItems).values({
      galleryId,
      mediaId: inserted.id,
      caption,
      position: (last?.position ?? 0) + 1,
    });

    await tx
      .update(galleries)
      .set({ updatedBy: actor.id, updatedAt: new Date() })
      .where(eq(galleries.id, galleryId));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "gallery.item.add",
      entity: "gallery",
      entityId: galleryId,
      summary: `Menambahkan foto ke album ${gallery.title}.`,
    });
  });
}

export async function deleteGalleryItem(
  itemId: string,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("galleries:write");

  const mediaId = await db.transaction(async (tx) => {
    const [item] = await tx
      .select({
        galleryId: galleryItems.galleryId,
        mediaId: galleryItems.mediaId,
        title: galleries.title,
      })
      .from(galleryItems)
      .innerJoin(galleries, eq(galleryItems.galleryId, galleries.id))
      .where(eq(galleryItems.id, itemId))
      .limit(1);

    if (!item) throw new Error("Foto tidak ditemukan.");

    await tx.delete(galleryItems).where(eq(galleryItems.id, itemId));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "gallery.item.delete",
      entity: "gallery",
      entityId: item.galleryId,
      summary: `Menghapus foto dari album ${item.title}.`,
    });

    return item.mediaId;
  });

  if (mediaId) await deleteMediaIfUnused(mediaId);
}

export async function getGalleryStats() {
  await requirePermission("galleries:read");

  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where ${galleries.isPublished})::int`,
    })
    .from(galleries);

  return row ?? { total: 0, published: 0 };
}
