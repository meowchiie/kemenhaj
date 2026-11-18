import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { Block } from "@/lib/content";

export const userRole = pgEnum("user_role", ["superadmin"]);

export const mediaKind = pgEnum("media_kind", ["pdf", "image"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").notNull().default("superadmin"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: mediaKind("kind").notNull(),
    filename: text("filename").notNull(),
    mime: text("mime").notNull(),
    bytes: bigint("bytes", { mode: "number" }).notNull(),
    sha256: text("sha256").notNull(),
    path: text("path").notNull(),
    uploadedBy: uuid("uploaded_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("media_sha256_idx").on(table.sha256)],
);

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    shortName: text("short_name").notNull(),
    description: text("description").notNull(),
    icon: text("icon").notNull().default("register"),
    duration: text("duration").notNull().default(""),
    cost: text("cost").notNull().default(""),
    note: text("note").notNull().default(""),
    isPublished: boolean("is_published").notNull().default(true),
    formMediaId: uuid("form_media_id").references(() => media.id, {
      onDelete: "set null",
    }),
    updatedBy: uuid("updated_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("services_slug_unique").on(table.slug)],
);

export const serviceRequirements = pgTable(
  "service_requirements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    text: text("text").notNull(),
  },
  (table) => [
    uniqueIndex("service_requirements_position_unique").on(
      table.serviceId,
      table.position,
    ),
  ],
);

export const serviceSteps = pgTable(
  "service_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    title: text("title").notNull(),
    detail: text("detail").notNull(),
  },
  (table) => [
    uniqueIndex("service_steps_position_unique").on(
      table.serviceId,
      table.position,
    ),
  ],
);

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    category: text("category").notNull(),
    body: jsonb("body").$type<Block[]>().notNull(),
    coverMediaId: uuid("cover_media_id").references(() => media.id, {
      onDelete: "set null",
    }),
    author: text("author").notNull(),
    views: integer("views").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    isPublished: boolean("is_published").notNull().default(false),
    updatedBy: uuid("updated_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("articles_slug_unique").on(table.slug),
    index("articles_published_idx").on(table.publishedAt),
  ],
);

export const officials = pgTable(
  "officials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    nip: text("nip").notNull(),
    position: text("position").notNull(),
    unit: text("unit").notNull(),
    sortOrder: integer("sort_order").notNull(),
    photoMediaId: uuid("photo_media_id").references(() => media.id, {
      onDelete: "set null",
    }),
    duties: text("duties").notNull(),
    contact: text("contact").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("officials_nip_unique").on(table.nip),
    uniqueIndex("officials_sort_order_unique").on(table.sortOrder),
  ],
);

export const galleries = pgTable(
  "galleries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    eventDate: date("event_date", { mode: "string" }).notNull(),
    coverMediaId: uuid("cover_media_id").references(() => media.id, {
      onDelete: "set null",
    }),
    isPublished: boolean("is_published").notNull().default(false),
    updatedBy: uuid("updated_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("galleries_slug_unique").on(table.slug)],
);

export const galleryItems = pgTable(
  "gallery_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    galleryId: uuid("gallery_id")
      .notNull()
      .references(() => galleries.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id").references(() => media.id, {
      onDelete: "set null",
    }),
    caption: text("caption").notNull(),
    position: integer("position").notNull(),
  },
  (table) => [
    uniqueIndex("gallery_items_position_unique").on(
      table.galleryId,
      table.position,
    ),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("audit_logs_created_at_idx").on(table.createdAt)],
);

export type User = typeof users.$inferSelect;
export type Media = typeof media.$inferSelect;
export type ServiceRow = typeof services.$inferSelect;
export type ServiceRequirementRow = typeof serviceRequirements.$inferSelect;
export type ServiceStepRow = typeof serviceSteps.$inferSelect;
export type ArticleRow = typeof articles.$inferSelect;
export type OfficialRow = typeof officials.$inferSelect;
export type GalleryRow = typeof galleries.$inferSelect;
export type GalleryItemRow = typeof galleryItems.$inferSelect;
export type AuditLogRow = typeof auditLogs.$inferSelect;
