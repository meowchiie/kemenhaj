import Link from "next/link";
import { ArrowUpRight, FileText, Plus } from "lucide-react";
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
import { listAdminServices } from "@/lib/data/services";
import { formatDate } from "@/lib/format";

export const instant = false;

const statusMessages: Record<string, { title: string; description: string; error?: boolean }> = {
  baru: {
    title: "Layanan dibuat",
    description: "Lengkapi formulir PDF agar jemaah bisa mengunduhnya.",
  },
  dihapus: {
    title: "Layanan dihapus",
    description: "Data layanan beserta persyaratan dan langkahnya sudah dihapus.",
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

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const services = await listAdminServices();
  const { status } = await searchParams;
  const notice = status ? statusMessages[status] : undefined;

  return (
    <>
      <AdminPageHeader
        eyebrow="Layanan"
        title="Daftar layanan"
        description="Kelola persyaratan, alur proses, dan formulir PDF yang tampil di portal publik."
        actions={
          can(user, "services:write") ? (
            <Button
              className="rounded-full"
              render={<Link href="/admin/layanan/baru" />}
            >
              <Plus data-icon="inline-start" />
              Layanan baru
            </Button>
          ) : undefined
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

      {services.length === 0 ? (
        <Empty className="border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>Belum ada layanan</EmptyTitle>
            <EmptyDescription>
              Tambahkan layanan pertama untuk mulai mengisi portal publik.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Layanan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Formulir</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Diperbarui
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      /layanan/{service.slug}
                    </p>
                  </TableCell>
                  <TableCell>
                    {service.isPublished ? (
                      <Badge>Terbit</Badge>
                    ) : (
                      <Badge variant="outline">Draf</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden max-w-48 md:table-cell">
                    <span className="block truncate text-xs text-muted-foreground">
                      {service.form ? service.form.filename : "Belum ada"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                    {formatDate(service.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      render={<Link href={`/admin/layanan/${service.id}`} />}
                    >
                      {can(user, "services:write") ? "Ubah" : "Lihat"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {can(user, "services:write") ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Perubahan langsung tampil di portal publik setelah disimpan.{" "}
          <Link
            href="/layanan"
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Buka halaman layanan
            <ArrowUpRight className="ml-1 inline size-3" />
          </Link>
        </p>
      ) : null}
    </>
  );
}
