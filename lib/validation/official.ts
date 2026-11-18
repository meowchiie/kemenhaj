import { z } from "zod";

export const officialSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter.").max(150),
  nip: z.string().trim().min(3, "NIP minimal 3 karakter.").max(50),
  position: z.string().trim().min(3, "Jabatan minimal 3 karakter.").max(150),
  unit: z.string().trim().min(3, "Unit kerja minimal 3 karakter.").max(100),
  sortOrder: z.coerce
    .number()
    .int("Urutan harus angka bulat.")
    .min(1, "Urutan minimal 1.")
    .max(999),
  duties: z.string().trim().min(10, "Tugas pokok minimal 10 karakter.").max(1000),
  contact: z.string().trim().min(3, "Kontak minimal 3 karakter.").max(100),
  isActive: z.boolean(),
});

export type OfficialInput = z.infer<typeof officialSchema>;
