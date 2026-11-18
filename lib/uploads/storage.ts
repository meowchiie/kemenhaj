import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_PDF_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const imageTypes = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
} as const;

const uploadsDir = path.join(process.cwd(), "storage", "uploads");

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
};

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
  const originalName = path.basename(file.name || "formulir.pdf");
  const safeName =
    originalName.replace(/[^\w.-]+/g, "-").slice(-80) || "formulir.pdf";
  const storedName = `${randomUUID()}-${safeName}`;

  await mkdir(uploadsDir, { recursive: true });
  const target = path.join(uploadsDir, storedName);
  await writeFile(target, buffer);

  return {
    filename: originalName,
    mime: "application/pdf",
    bytes: buffer.byteLength,
    sha256,
    path: path.relative(process.cwd(), target),
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
  const originalName = path.basename(file.name || `gambar.${extension}`);
  const baseName =
    path.parse(originalName).name.replace(/[^\w.-]+/g, "-").slice(-60) ||
    "gambar";
  const storedName = `${randomUUID()}-${baseName}.${extension}`;

  await mkdir(uploadsDir, { recursive: true });
  const target = path.join(uploadsDir, storedName);
  await writeFile(target, buffer);

  return {
    filename: originalName,
    mime: imageTypes[extension],
    bytes: buffer.byteLength,
    sha256,
    path: path.relative(process.cwd(), target),
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

export async function readStoredFile(relativePath: string): Promise<Buffer> {
  const storageRoot = path.join(process.cwd(), "storage");
  const absolute = path.join(/* turbopackIgnore: true */ process.cwd(), relativePath);

  if (!absolute.startsWith(storageRoot)) {
    throw new UploadError("Path berkas tidak valid.");
  }

  return readFile(absolute);
}

export async function deleteStoredFile(relativePath: string): Promise<void> {
  const storageRoot = path.join(process.cwd(), "storage");
  const absolute = path.join(/* turbopackIgnore: true */ process.cwd(), relativePath);

  if (!absolute.startsWith(storageRoot)) return;

  await unlink(absolute).catch(() => {});
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
