import { createHash, randomUUID } from "node:crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const MAX_PDF_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const imageTypes = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

const BUCKET_NAME = "uploads"; 

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

export type StoredFile = {
  filename: string;
  mime: string;
  bytes: number;
  sha256: string;
  path: string;       
  publicUrl?: string; 
};

// Lazy initialization untuk klien Supabase guna mencegah infinite loading jika env kosong
let cachedSupabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (cachedSupabase) return cachedSupabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = 
    process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new UploadError("Konfigurasi Supabase (URL atau Key) belum diatur di environment variables.");
  }

  cachedSupabase = createClient(supabaseUrl, supabaseKey);
  return cachedSupabase;
}

export async function storePdf(file: File): Promise<StoredFile> {
  if (!file || file.size === 0) {
    throw new UploadError("Pilih berkas PDF terlebih dahulu.");
  }

  if (file.size > MAX_PDF_BYTES) {
    throw new UploadError("Ukuran berkas maksimal 5 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new UploadError("Berkas bukan PDF yang valid.");
  }

  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const originalName = file.name || "formulir.pdf";
  const safeName = originalName.replace(/[^\w.-]+/g, "-").slice(-80) || "formulir.pdf";
  const storedName = `pdfs/${randomUUID()}-${safeName}`;

  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storedName, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    throw new UploadError(`Gagal mengupload PDF ke cloud: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storedName);

  return {
    filename: originalName,
    mime: "application/pdf",
    bytes: buffer.byteLength,
    sha256,
    path: storedName,
    publicUrl: urlData.publicUrl,
  };
}

export async function storeImage(file: File): Promise<StoredFile> {
  if (!file || file.size === 0) {
    throw new UploadError("Pilih gambar terlebih dahulu.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadError("Ukuran gambar maksimal 2 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = detectImageExtension(buffer);

  if (!extension) {
    throw new UploadError("Format gambar harus JPG, PNG, atau WebP.");
  }

  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const originalName = file.name || `gambar.${extension}`;
  const baseName =
    pathParseName(originalName).replace(/[^\w.-]+/g, "-").slice(-60) || "gambar";
  const storedName = `images/${randomUUID()}-${baseName}.${extension}`;
  const mimeType = imageTypes[extension];

  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storedName, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new UploadError(`Gagal mengupload gambar ke cloud: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storedName);

  return {
    filename: originalName,
    mime: mimeType,
    bytes: buffer.byteLength,
    sha256,
    path: storedName,
    publicUrl: urlData.publicUrl,
  };
}

function detectImageExtension(buffer: Buffer): keyof typeof imageTypes | null {
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return "jpeg";
  }

  if (
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "png";
  }

  if (
    buffer.subarray(0, 4).toString("latin1") === "RIFF" &&
    buffer.subarray(8, 12).toString("latin1") === "WEBP"
  ) {
    return "webp";
  }

  return null;
}

function pathParseName(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return filename;
  return filename.substring(0, lastDot);
}

export async function readStoredFile(storagePath: string): Promise<Buffer> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(storagePath);

  if (error || !data) {
    throw new UploadError("Berkas tidak ditemukan di penyimpanan cloud.");
  }

  return Buffer.from(await data.arrayBuffer());
}

export async function deleteStoredFile(storagePath: string): Promise<void> {
  if (!storagePath) return;

  const supabase = getSupabaseClient();
  await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath])
    .catch(() => {});
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}