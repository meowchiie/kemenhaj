import "./env";

import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { eq, sql } from "drizzle-orm";
import { hashPassword } from "../lib/auth/password";
import { db } from "../lib/db";
import {
  articles,
  galleries,
  galleryItems,
  media,
  officials,
  serviceRequirements,
  services,
  serviceSteps,
  users,
} from "../lib/db/schema";
import {
  albums as contentAlbums,
  articles as contentArticles,
  officials as contentOfficials,
  services as contentServices,
} from "./seed-content";

const uploadsDir = path.join(process.cwd(), "storage", "uploads");

const accounts = [
  {
    email: "superadmin@kemenhajpare.go.id",
    name: "Super Admin Kemenhaj",
    role: "superadmin" as const,
  },
  {
    email: "staff@kemenhajpare.go.id",
    name: "Staff Layanan",
    role: "staff" as const,
  },
  {
    email: "editor@kemenhajpare.go.id",
    name: "Editor Berita",
    role: "editor" as const,
  },
];

async function seedUsers() {
  const password = process.env.SEED_PASSWORD;

  if (!password) {
    throw new Error("SEED_PASSWORD belum diatur di .env");
  }

  const passwordHash = await hashPassword(password);

  for (const account of accounts) {
    await db
      .insert(users)
      .values({ ...account, passwordHash })
      .onConflictDoNothing({ target: users.email });
  }

  const rows = await db.select().from(users);
  console.log(`  akun: ${rows.length} tersedia`);
  return rows;
}

async function importPdf(relativeFile: string, uploadedBy: string | null) {
  const source = path.join(process.cwd(), "public", relativeFile.replace(/^\//, ""));
  const buffer = await readFile(source);
  const sha256 = createHash("sha256").update(buffer).digest("hex");

  const [existing] = await db
    .select()
    .from(media)
    .where(eq(media.sha256, sha256))
    .limit(1);

  if (existing) return existing;

  await mkdir(uploadsDir, { recursive: true });
  const filename = path.basename(source);
  const target = path.join(uploadsDir, `${sha256.slice(0, 16)}-${filename}`);
  await copyFile(source, target);

  const [row] = await db
    .insert(media)
    .values({
      kind: "pdf",
      filename,
      mime: "application/pdf",
      bytes: buffer.byteLength,
      sha256,
      path: path.relative(process.cwd(), target),
      uploadedBy,
    })
    .returning();

  return row;
}

const imageMimes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function importImage(relativeFile: string, uploadedBy: string | null) {
  const source = path.join(process.cwd(), "public", relativeFile.replace(/^\//, ""));
  const buffer = await readFile(source);
  const sha256 = createHash("sha256").update(buffer).digest("hex");

  const [existing] = await db
    .select()
    .from(media)
    .where(eq(media.sha256, sha256))
    .limit(1);

  if (existing) return existing;

  await mkdir(uploadsDir, { recursive: true });
  const filename = path.basename(source);
  const target = path.join(uploadsDir, `${sha256.slice(0, 16)}-${filename}`);

  await copyFile(source, target);

  const [row] = await db
    .insert(media)
    .values({
      kind: "image",
      filename,
      mime: imageMimes[path.extname(filename).toLowerCase()] ?? "image/jpeg",
      bytes: buffer.byteLength,
      sha256,
      path: path.relative(process.cwd(), target),
      uploadedBy,
    })
    .returning();

  return row;
}

async function seedServices(superadminId: string | null) {
  let created = 0;
  let skipped = 0;

  for (const [index, service] of contentServices.entries()) {
    const [existing] = await db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.slug, service.slug))
      .limit(1);

    if (existing) {
      skipped += 1;
      continue;
    }

    const formMedia = await importPdf(service.form.file, superadminId);

    const [row] = await db
      .insert(services)
      .values({
        slug: service.slug,
        name: service.name,
        shortName: service.shortName,
        description: service.description,
        icon: service.icon,
        duration: service.duration,
        cost: service.cost,
        note: service.note,
        isPublished: true,
        formMediaId: formMedia.id,
        updatedBy: superadminId,
        updatedAt: new Date(service.updatedAt),
      })
      .returning({ id: services.id });

    await db.insert(serviceRequirements).values(
      service.requirements.map((text, position) => ({
        serviceId: row.id,
        position: position + 1,
        text,
      })),
    );

    await db.insert(serviceSteps).values(
      service.steps.map((step, position) => ({
        serviceId: row.id,
        position: position + 1,
        title: step.title,
        detail: step.detail,
      })),
    );

    created += 1;
    console.log(`  layanan ${index + 1}: ${service.name}`);
  }

  console.log(`  layanan baru: ${created}, sudah ada: ${skipped}`);
}

async function seedArticles(superadminId: string | null) {
  let created = 0;

  for (const [index, article] of contentArticles.entries()) {
    const [existing] = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.slug, article.slug))
      .limit(1);

    if (existing) continue;

    const cover = await importImage(article.image, superadminId);

    await db.insert(articles).values({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      body: article.body,
      coverMediaId: cover.id,
      author: article.author,
      views: article.views,
      publishedAt: new Date(`${article.date}T08:00:00+08:00`),
      isPublished: true,
      updatedBy: superadminId,
      updatedAt: new Date(`${article.date}T08:00:00+08:00`),
    });

    created += 1;
    console.log(`  berita ${index + 1}: ${article.title}`);
  }

  console.log(`  berita baru: ${created}`);
}

async function seedOfficials(superadminId: string | null) {
  let created = 0;

  for (const official of contentOfficials) {
    const [existing] = await db
      .select({ id: officials.id })
      .from(officials)
      .where(eq(officials.nip, official.nip))
      .limit(1);

    if (existing) continue;

    const photo = await importImage(official.photo, superadminId);

    await db.insert(officials).values({
      name: official.name,
      nip: official.nip,
      position: official.position,
      unit: official.unit,
      sortOrder: official.order,
      photoMediaId: photo.id,
      duties: official.duties,
      contact: official.contact,
      isActive: true,
    });

    created += 1;
    console.log(`  pejabat: ${official.name}`);
  }

  console.log(`  pejabat baru: ${created}`);
}

async function seedGalleries(superadminId: string | null) {
  let created = 0;

  for (const album of contentAlbums) {
    const [existing] = await db
      .select({ id: galleries.id })
      .from(galleries)
      .where(eq(galleries.slug, album.slug))
      .limit(1);

    if (existing) continue;

    const cover = await importImage(album.cover, superadminId);

    const [row] = await db
      .insert(galleries)
      .values({
        slug: album.slug,
        title: album.title,
        description: album.description,
        eventDate: album.date,
        coverMediaId: cover.id,
        isPublished: true,
        updatedBy: superadminId,
      })
      .returning({ id: galleries.id });

    for (const [position, item] of album.items.entries()) {
      const stored = await importImage(item.src, superadminId);

      await db.insert(galleryItems).values({
        galleryId: row.id,
        mediaId: stored.id,
        caption: item.caption,
        position: position + 1,
      });
    }

    created += 1;
    console.log(`  album: ${album.title}`);
  }

  console.log(`  album baru: ${created}`);
}

async function main() {
  console.log("Seeding database kemenhaj…");

  const rows = await seedUsers();
  const superadmin = rows.find((row) => row.role === "superadmin") ?? null;

  await seedServices(superadmin?.id ?? null);
  await seedArticles(superadmin?.id ?? null);
  await seedOfficials(superadmin?.id ?? null);
  await seedGalleries(superadmin?.id ?? null);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(services);

  console.log(`Selesai. Total layanan di database: ${count}.`);
  await db.$client.end();
}

main().catch(async (error) => {
  console.error(error);
  await db.$client.end().catch(() => {});
  process.exit(1);
});
