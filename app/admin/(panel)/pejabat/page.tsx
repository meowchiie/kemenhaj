import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Plus, UserRound } from "lucide-react";
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
import { listAdminOfficials } from "@/lib/data/officials";

export const instant = false;

const statusMessages: Record<string, { title: string; description: string; error?: boolean }> = {
  baru: {
    title: "Pejabat dibuat",
    description: "Tambahkan foto agar kartu profil tampil lengkap.",
  },
  dihapus: {
    title: "Pejabat dihapus",
    description: "Data pejabat beserta fotonya sudah dihapus.",
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

export default async function AdminOfficialsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();

  if (!can(user, "officials:read")) {
    redirect("/admin");
  }

  const officials = await listAdminOfficials();
  const { status } = await searchParams;
  const notice = status ? statusMessages[status] : undefined;

  return (
    <>
      <AdminPageHeader
        eyebrow="Profil"
        title="Daftar pejabat"
        description="Kelola nama, jabatan, tugas pokok, dan kontak resmi yang tampil di halaman profil."
        actions={
          <Button
            className="rounded-full"
            render={<Link href="/admin/pejabat/baru" />}
          >
            <Plus data-icon="inline-start" />
            Pejabat baru
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

      {officials.length === 0 ? (
        <Empty className="border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserRound />
            </EmptyMedia>
            <EmptyTitle>Belum ada pejabat</EmptyTitle>
            <EmptyDescription>
              Tambahkan pejabat pertama untuk mengisi halaman profil.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pejabat</TableHead>
                <TableHead className="hidden sm:table-cell">Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Urutan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {officials.map((official) => (
                <TableRow key={official.id}>
                  <TableCell>
                    <p className="font-semibold">{official.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {official.position}
                    </p>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                    {official.unit}
                  </TableCell>
                  <TableCell>
                    {official.isActive ? (
                      <Badge>Aktif</Badge>
                    ) : (
                      <Badge variant="outline">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                    {official.order}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      render={<Link href={`/admin/pejabat/${official.id}`} />}
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
        Pejabat nonaktif disembunyikan dari portal publik.{" "}
        <Link
          href="/profil"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Buka halaman profil
          <ArrowUpRight className="ml-1 inline size-3" />
        </Link>
      </p>
    </>
  );
}
