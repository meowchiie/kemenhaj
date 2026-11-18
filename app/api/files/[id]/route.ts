import { getCurrentUser } from "@/lib/auth/session";
import { getMediaById, isMediaPublic } from "@/lib/data/media";
import { readStoredFile } from "@/lib/uploads/storage";

export const instant = false;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response("Berkas tidak ditemukan.", { status: 404 });
  }

  const row = await getMediaById(id);

  if (!row) {
    return new Response("Berkas tidak ditemukan.", { status: 404 });
  }

  const isPublic = await isMediaPublic(id);

  if (!isPublic) {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Berkas tidak ditemukan.", { status: 404 });
    }
  }

  let buffer: Buffer;

  try {
    buffer = await readStoredFile(row.path);
  } catch {
    return new Response("Berkas tidak ditemukan.", { status: 404 });
  }

  const encodedName = encodeURIComponent(row.filename);
  const disposition = row.kind === "image" ? "inline" : "attachment";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": row.mime,
      "Content-Length": String(buffer.byteLength),
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodedName}`,
      "Cache-Control": isPublic
        ? "public, max-age=3600"
        : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
