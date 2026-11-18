import { desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { requirePermission } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { articles, auditLogs, media } from "@/lib/db/schema";
import type { Article, Block } from "@/lib/content";
import { deleteMediaIfUnused } from "@/lib/data/media";
import type { ArticleInput } from "@/lib/validation/article";
import { storeImage } from "@/lib/uploads/storage";

export type ArticleMedia = {
  id: string;
  filename: string;
  href: string;
};

export type AdminArticle = Article & {
  id: string;
  isPublished: boolean;
  cover: ArticleMedia | null;
};

const columns = {
  id: articles.id,
  slug: articles.slug,
  title: articles.title,
  excerpt: articles.excerpt,
  category: articles.category,
  body: articles.body,
  author: articles.author,
  views: articles.views,
  publishedAt: articles.publishedAt,
  isPublished: articles.isPublished,
  mediaId: media.id,
  mediaFilename: media.filename,
};

function coverOf(row: {
  mediaId: string | null;
  mediaFilename: string | null;
}): ArticleMedia | null {
  if (!row.mediaId || !row.mediaFilename) return null;
  return {
    id: row.mediaId,
    filename: row.mediaFilename,
    href: `/api/files/${row.mediaId}`,
  };
}

function readingMinutes(body: Block[]): number {
  const words = body
    .map((block) => {
      if (block.type === "ul") return block.items.join(" ");
      return block.text;
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

type ArticleGraphRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: Block[];
  author: string;
  views: number;
  publishedAt: Date;
  isPublished: boolean;
  mediaId: string | null;
  mediaFilename: string | null;
};

function toArticle(row: ArticleGraphRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.publishedAt.toISOString().slice(0, 10),
    readMinutes: readingMinutes(row.body),
    views: row.views,
    author: row.author,
    image: row.mediaId ? `/api/files/${row.mediaId}` : "/images/berita-1.jpg",
    body: row.body,
  };
}

function toAdminArticle(row: ArticleGraphRow): AdminArticle {
  return {
    ...toArticle(row),
    id: row.id,
    isPublished: row.isPublished,
    cover: coverOf(row),
  };
}

async function fetchPublishedArticles() {
  const rows = await db
    .select(columns)
    .from(articles)
    .leftJoin(media, eq(articles.coverMediaId, media.id))
    .where(eq(articles.isPublished, true))
    .orderBy(desc(articles.publishedAt));

  return rows.map(toArticle);
}

export async function getPublicArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");

  return fetchPublishedArticles();
}

export async function getPublicArticle(
  slug: string,
): Promise<Article | undefined> {
  const all = await getPublicArticles();
  return all.find((article) => article.slug === slug);
}

export function latestArticles(list: Article[], limit = 6): Article[] {
  return [...list]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function popularArticles(list: Article[], limit = 3): Article[] {
  return [...list].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function relatedArticles(
  list: Article[],
  article: Article,
  limit = 3,
): Article[] {
  const sameCategory = list.filter(
    (item) => item.slug !== article.slug && item.category === article.category,
  );
  const others = list.filter(
    (item) => item.slug !== article.slug && item.category !== article.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function listAdminArticles(): Promise<AdminArticle[]> {
  await requirePermission("articles:read");

  const rows = await db
    .select(columns)
    .from(articles)
    .leftJoin(media, eq(articles.coverMediaId, media.id))
    .orderBy(desc(articles.publishedAt));

  return rows.map(toAdminArticle);
}

export async function getAdminArticle(
  id: string,
): Promise<AdminArticle | undefined> {
  await requirePermission("articles:read");

  const [row] = await db
    .select(columns)
    .from(articles)
    .leftJoin(media, eq(articles.coverMediaId, media.id))
    .where(eq(articles.id, id))
    .limit(1);

  return row ? toAdminArticle(row) : undefined;
}

function valuesFromInput(input: ArticleInput, actor: SessionUser) {
  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    category: input.category,
    body: input.body,
    author: input.author,
    publishedAt: input.publishedAt,
    isPublished: input.isPublished,
    updatedBy: actor.id,
    updatedAt: new Date(),
  };
}

export async function createArticle(
  input: ArticleInput,
  actor: SessionUser,
): Promise<string> {
  await requirePermission("articles:write");

  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(articles)
      .values(valuesFromInput(input, actor))
      .returning({ id: articles.id });

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "article.create",
      entity: "article",
      entityId: row.id,
      summary: `Menambahkan berita ${input.title}.`,
    });

    return row.id;
  });
}

export async function updateArticle(
  id: string,
  input: ArticleInput,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("articles:write");

  await db.transaction(async (tx) => {
    const updated = await tx
      .update(articles)
      .set(valuesFromInput(input, actor))
      .where(eq(articles.id, id))
      .returning({ id: articles.id });

    if (updated.length === 0) throw new Error("Berita tidak ditemukan.");

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "article.update",
      entity: "article",
      entityId: id,
      summary: `Memperbarui berita ${input.title}.`,
    });
  });
}

export async function deleteArticle(
  id: string,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("articles:delete");

  const coverMediaId = await db.transaction(async (tx) => {
    const [row] = await tx
      .select({ title: articles.title, coverMediaId: articles.coverMediaId })
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);

    if (!row) throw new Error("Berita tidak ditemukan.");

    await tx.delete(articles).where(eq(articles.id, id));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "article.delete",
      entity: "article",
      entityId: id,
      summary: `Menghapus berita ${row.title}.`,
    });

    return row.coverMediaId;
  });

  if (coverMediaId) await deleteMediaIfUnused(coverMediaId);
}

export async function replaceArticleCover(
  articleId: string,
  file: File,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("articles:write");

  const [article] = await db
    .select({ title: articles.title, coverMediaId: articles.coverMediaId })
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);

  if (!article) throw new Error("Berita tidak ditemukan.");

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
      .update(articles)
      .set({
        coverMediaId: inserted.id,
        updatedBy: actor.id,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, articleId));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "article.cover.replace",
      entity: "article",
      entityId: articleId,
      summary: `Mengganti gambar utama berita ${article.title}.`,
    });

    return { oldMediaId: article.coverMediaId, newMediaId: inserted.id };
  });

  if (oldMediaId && oldMediaId !== newMediaId) {
    await deleteMediaIfUnused(oldMediaId);
  }
}

export async function getArticleStats() {
  await requirePermission("articles:read");

  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where ${articles.isPublished})::int`,
    })
    .from(articles);

  return row ?? { total: 0, published: 0 };
}
