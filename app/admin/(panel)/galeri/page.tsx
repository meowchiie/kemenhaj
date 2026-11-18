import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Images, Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/admin/ui/alert";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/admin/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { can, requireUser } from "@/lib/auth/permissions";
import { listAdminGalleries } from "@/lib/data/galleries";
import { formatDate } from "@/lib/format";

export const instant = false;

const statusMessages: Record<string, { title: string; description: string; error?: boolean }> = {
  baru: {
    title: "Album dibuat",
    description: "Tambahkan sampul dan foto sebelum album diterbitkan.",
  },
  dihapus: {
    title: "Album dihapus",
    description: "Album beserta seluruh fotonya sudah dihapus.",
  },
  ditolak: {
    title: "Akses ditolak",
    description: "Peran Anda tidak memiliki izin untuk tindakan tersebut.",
    error: true,
  },
  gagal: {
    title: "Tindakan gagal",
    description: "Terjadi kesalahan saat memproses permintaan. Coba lagi.",
    error: true,
  },
};

export default async function AdminGalleriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();

  if (!can(user, "galleries:read")) {
    redirect("/admin");
  }

  const galleries = await listAdminGalleries();
  const { status } = await searchParams;
  const notice = status ? statusMessages[status] : undefined;

  return (
    <>
      <AdminPageHeader
        eyebrow="Galeri"
        title="Daftar album"
        description="Kelola album dokumentasi kegiatan beserta foto dan sampulnya."
        actions={
          <Button
            className="rounded-full"
            render={<Link href="/admin/galeri/baru" />}
          >
            <Plus data-icon="inline-start" />
            Album baru
          </Button>
        }
      />

      {notice ? (
        <Alert
          variant={notice.error ? "destructive" : "default"}
          className="mb-6"
        >
          <AlertTitle>{notice.title}</AlertTitle>
          <AlertDescription>{notice.description}</AlertDescription>
        </Alert>
      ) : null}

      {galleries.length === 0 ? (
        <Empty className="border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Images />
            </EmptyMedia>
            <EmptyTitle>Belum ada album</EmptyTitle>
            <EmptyDescription>
              Tambahkan album pertama untuk mengisi galeri publik.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Album</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Foto</TableHead>
                <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleries.map((gallery) => (
                <TableRow key={gallery.id}>
                  <TableCell>
                    <p className="font-semibold">{gallery.title}</p>
                    <p className="text-xs text-muted-foreground">
                      /galeri?album={gallery.slug}
                    </p>
                  </TableCell>
                  <TableCell>
                    {gallery.isPublished ? (
                      <Badge>Terbit</Badge>
                    ) : (
                      <Badge variant="outline">Draf</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                    {gallery.items.length} foto
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                    {formatDate(gallery.eventDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      render={<Link href={`/admin/galeri/${gallery.id}`} />}
                    >
                      Ubah
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Album draf tidak tampil di portal publik.{" "}
        <Link
          href="/galeri"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Buka halaman galeri
          <ArrowUpRight className="ml-1 inline size-3" />
        </Link>
      </p>
    </>
  );
}
