import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  articles,
  galleries,
  galleryItems,
  media,
  officials,
  services,
} from "@/lib/db/schema";
import { deleteStoredFile } from "@/lib/uploads/storage";

export async function getMediaById(mediaId: string) {
  const [row] = await db
    .select()
    .from(media)
    .where(eq(media.id, mediaId))
    .limit(1);

  return row ?? null;
}

export async function isMediaPublic(mediaId: string): Promise<boolean> {
  const [serviceForm, articleCover, officialPhoto, galleryCover, galleryItem] =
    await Promise.all([
      db
        .select({ id: services.id })
        .from(services)
        .where(
          and(
            eq(services.formMediaId, mediaId),
            eq(services.isPublished, true),
          ),
        )
        .limit(1),
      db
        .select({ id: articles.id })
        .from(articles)
        .where(
          and(
            eq(articles.coverMediaId, mediaId),
            eq(articles.isPublished, true),
          ),
        )
        .limit(1),
      db
        .select({ id: officials.id })
        .from(officials)
        .where(
          and(eq(officials.photoMediaId, mediaId), eq(officials.isActive, true)),
        )
        .limit(1),
      db
        .select({ id: galleries.id })
        .from(galleries)
        .where(
          and(
            eq(galleries.coverMediaId, mediaId),
            eq(galleries.isPublished, true),
          ),
        )
        .limit(1),
      db
        .select({ id: galleryItems.id })
        .from(galleryItems)
        .innerJoin(galleries, eq(galleryItems.galleryId, galleries.id))
        .where(
          and(
            eq(galleryItems.mediaId, mediaId),
            eq(galleries.isPublished, true),
          ),
        )
        .limit(1),
    ]);

  return [serviceForm, articleCover, officialPhoto, galleryCover, galleryItem].some(
    (rows) => rows.length > 0,
  );
}

export async function deleteMediaIfUnused(mediaId: string): Promise<void> {
  const [serviceForm, articleCover, officialPhoto, galleryCover, galleryItem] =
    await Promise.all([
      db
        .select({ id: services.id })
        .from(services)
        .where(eq(services.formMediaId, mediaId))
        .limit(1),
      db
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.coverMediaId, mediaId))
        .limit(1),
      db
        .select({ id: officials.id })
        .from(officials)
        .where(eq(officials.photoMediaId, mediaId))
        .limit(1),
      db
        .select({ id: galleries.id })
        .from(galleries)
        .where(eq(galleries.coverMediaId, mediaId))
        .limit(1),
      db
        .select({ id: galleryItems.id })
        .from(galleryItems)
        .where(eq(galleryItems.mediaId, mediaId))
        .limit(1),
    ]);

  if (
    [serviceForm, articleCover, officialPhoto, galleryCover, galleryItem].some(
      (rows) => rows.length > 0,
    )
  ) {
    return;
  }

  const [row] = await db
    .delete(media)
    .where(eq(media.id, mediaId))
    .returning({ path: media.path });

  if (row) await deleteStoredFile(row.path);
}
