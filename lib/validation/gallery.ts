import { z } from "zod";

export const gallerySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug minimal 3 karakter.")
    .max(80, "Slug maksimal 80 karakter.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    ),
  title: z.string().trim().min(3, "Judul minimal 3 karakter.").max(200),
  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter.")
    .max(600),
  eventDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal kegiatan wajib diisi."),
  isPublished: z.boolean(),
});

export const galleryItemSchema = z.object({
  galleryId: z.string().uuid(),
  caption: z.string().trim().min(1, "Keterangan gambar wajib diisi.").max(300),
});

export type GalleryInput = z.infer<typeof gallerySchema>;
