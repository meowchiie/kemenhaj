import { z } from "zod";
import { categories } from "@/lib/content";

const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug minimal 3 karakter.")
  .max(80, "Slug maksimal 80 karakter.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
  );

const textBlock = z.object({
  type: z.literal("p"),
  text: z.string().trim().min(1, "Paragraf tidak boleh kosong.").max(4000),
});

const headingBlock = z.object({
  type: z.literal("h2"),
  text: z.string().trim().min(1, "Subjudul tidak boleh kosong.").max(200),
});

const quoteBlock = z.object({
  type: z.literal("quote"),
  text: z.string().trim().min(1, "Kutipan tidak boleh kosong.").max(1000),
});

const listBlock = z.object({
  type: z.literal("ul"),
  items: z
    .array(z.string().trim().min(1).max(500))
    .min(1, "Daftar minimal satu poin.")
    .max(30),
});

export const articleBlockSchema = z.discriminatedUnion("type", [
  textBlock,
  headingBlock,
  quoteBlock,
  listBlock,
]);

export const articleSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(5, "Judul minimal 5 karakter.").max(200),
  excerpt: z.string().trim().min(20, "Ringkasan minimal 20 karakter.").max(400),
  category: z
    .string()
    .trim()
    .refine(
      (value) => categories.some((category) => category.name === value),
      "Pilih kategori yang tersedia.",
    ),
  author: z.string().trim().min(3, "Penulis minimal 3 karakter.").max(100),
  publishedAt: z.coerce.date(),
  isPublished: z.boolean(),
  body: z
    .array(articleBlockSchema)
    .min(1, "Tambahkan minimal satu blok isi.")
    .max(100),
});

export type ArticleInput = z.infer<typeof articleSchema>;
export type ArticleBlockInput = z.infer<typeof articleBlockSchema>;
