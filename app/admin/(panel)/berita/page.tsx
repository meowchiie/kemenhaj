import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Newspaper, Plus } from "lucide-react";
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
import { listAdminArticles } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";

export const instant = false;

const statusMessages: Record<string, { title: string; description: string; error?: boolean }> = {
  baru: {
    title: "Berita dibuat",
    description: "Tambahkan gambar utama lalu periksa isi sebelum diterbitkan.",
  },
  dihapus: {
    title: "Berita dihapus",
    description: "Berita dan gambar utamanya sudah dihapus.",
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

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();

  if (!can(user, "articles:read")) {
    redirect("/admin");
  }

  const articles = await listAdminArticles();
  const { status } = await searchParams;
  const notice = status ? statusMessages[status] : undefined;

  return (
    <>
      <AdminPageHeader
        eyebrow="Berita"
        title="Daftar berita"
        description="Kelola artikel, pengumuman, dan dokumentasi kegiatan yang tampil di portal publik."
        actions={
          can(user, "articles:write") ? (
            <Button
              className="rounded-full"
              render={<Link href="/admin/berita/baru" />}
            >
              <Plus data-icon="inline-start" />
              Berita baru
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

      {articles.length === 0 ? (
        <Empty className="border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Newspaper />
            </EmptyMedia>
            <EmptyTitle>Belum ada berita</EmptyTitle>
            <EmptyDescription>
              Tambahkan berita pertama untuk mulai mengisi portal publik.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Berita</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Terbit</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <p className="font-semibold">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {article.category} · /berita/{article.slug}
                    </p>
                  </TableCell>
                  <TableCell>
                    {article.isPublished ? (
                      <Badge>Terbit</Badge>
                    ) : (
                      <Badge variant="outline">Draf</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                    {formatDate(article.date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      render={<Link href={`/admin/berita/${article.id}`} />}
                    >
                      {can(user, "articles:write") ? "Ubah" : "Lihat"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Hanya berita berstatus terbit yang tampil di portal publik.{" "}
        <Link
          href="/berita"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Buka halaman berita
          <ArrowUpRight className="ml-1 inline size-3" />
        </Link>
      </p>
    </>
  );
}
