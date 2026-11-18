import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const serviceStepSchema = z.object({
  title: z.string().trim().min(3, "Judul langkah minimal 3 karakter.").max(120),
  detail: z
    .string()
    .trim()
    .min(5, "Keterangan langkah minimal 5 karakter.")
    .max(500),
});

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug minimal 3 karakter.")
    .max(80, "Slug maksimal 80 karakter.")
    .regex(slugPattern, "Slug hanya boleh huruf kecil, angka, dan tanda hubung."),
  name: z.string().trim().min(3, "Nama layanan minimal 3 karakter.").max(120),
  shortName: z
    .string()
    .trim()
    .min(3, "Nama pendek minimal 3 karakter.")
    .max(60),
  description: z
    .string()
    .trim()
    .min(20, "Deskripsi minimal 20 karakter.")
    .max(600),
  icon: z.enum(["register", "transfer", "cancel"]),
  duration: z.string().trim().min(1, "Durasi wajib diisi.").max(80),
  cost: z.string().trim().min(1, "Biaya wajib diisi.").max(80),
  note: z.string().trim().max(600),
  isPublished: z.boolean(),
  requirements: z
    .array(z.string().trim().min(3, "Persyaratan minimal 3 karakter.").max(300))
    .min(1, "Tambahkan minimal satu persyaratan.")
    .max(30, "Maksimal 30 persyaratan."),
  steps: z
    .array(serviceStepSchema)
    .min(1, "Tambahkan minimal satu langkah.")
    .max(15, "Maksimal 15 langkah."),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid."),
  password: z.string().min(1, "Password wajib diisi.").max(200),
});
