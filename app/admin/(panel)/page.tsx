import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  History,
  Images,
  Newspaper,
  UserRound,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/page-header";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { requireUser } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { getArticleStats } from "@/lib/data/articles";
import { listRecentAudit } from "@/lib/data/audit";
import { getGalleryStats } from "@/lib/data/galleries";
import { getOfficialStats } from "@/lib/data/officials";
import { getServiceStats } from "@/lib/data/services";
import { formatDateTime } from "@/lib/format";

const roleLabels: Record<SessionUser["role"], string> = {
  superadmin: "Super admin",
};

const actionLabels: Record<string, string> = {
  "auth.login": "Masuk dashboard",
  "service.create": "Menambah layanan",
  "service.update": "Memperbarui layanan",
  "service.delete": "Menghapus layanan",
  "service.form.replace": "Mengganti formulir PDF",
  "article.create": "Menambah berita",
  "article.update": "Memperbarui berita",
  "article.delete": "Menghapus berita",
  "article.cover.replace": "Mengganti gambar berita",
  "official.create": "Menambah pejabat",
  "official.update": "Memperbarui pejabat",
  "official.delete": "Menghapus pejabat",
  "official.photo.replace": "Mengganti foto pejabat",
  "gallery.create": "Menambah album",
  "gallery.update": "Memperbarui album",
  "gallery.delete": "Menghapus album",
  "gallery.cover.replace": "Mengganti sampul album",
  "gallery.item.add": "Menambah foto album",
  "gallery.item.delete": "Menghapus foto album",
};

export const instant = false;

export default async function DashboardPage() {
  const user = await requireUser();
  const [services, articles, officials, galleries, recent] = await Promise.all([
    getServiceStats(),
    getArticleStats(),
    getOfficialStats(),
    getGalleryStats(),
    listRecentAudit(6),
  ]);

  const cards = [
    {
      label: "Layanan aktif",
      value: services.published,
      description: `dari ${services.total} layanan terdaftar`,
      icon: FileText,
    },
    {
      label: "Berita terbit",
      value: articles.published,
      description: `dari ${articles.total} berita tersimpan`,
      icon: Newspaper,
    },
    {
      label: "Pejabat aktif",
      value: officials.active,
      description: `dari ${officials.total} pejabat terdaftar`,
      icon: UserRound,
    },
    {
      label: "Album terbit",
      value: galleries.published,
      description: `dari ${galleries.total} album tersimpan`,
      icon: Images,
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Ringkasan"
        title={`Selamat datang, ${user.name.split(" ")[0]}.`}
        description="Pantau status informasi layanan dan perubahan terakhir di portal publik."
        actions={
          <Button
            render={<Link href="/admin/layanan" />}
            className="rounded-full"
          >
            Kelola layanan
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {card.label}
                </CardDescription>
                <CardTitle className="text-4xl font-semibold tabular-nums">
                  {card.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="size-4" />
              Aktivitas terakhir
            </CardTitle>
            <CardDescription>
              Jejak perubahan yang tercatat di audit log.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada aktivitas tercatat.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {recent.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <p className="text-sm">{entry.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {actionLabels[entry.action] ?? entry.action} ·{" "}
                      {formatDateTime(entry.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pintasan</CardTitle>
            <CardDescription>
              Tugas yang paling sering dilakukan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="justify-between rounded-full"
              render={<Link href="/admin/layanan" />}
            >
              Daftar layanan
              <ArrowUpRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              className="justify-between rounded-full"
              render={<Link href="/admin/berita" />}
            >
              Daftar berita
              <ArrowUpRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              className="justify-between rounded-full"
              render={<Link href="/admin/pejabat" />}
            >
              Daftar pejabat
              <ArrowUpRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              className="justify-between rounded-full"
              render={<Link href="/admin/galeri" />}
            >
              Daftar album
              <ArrowUpRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              className="justify-between rounded-full"
              render={<Link href="/admin/aktivitas" />}
            >
              Audit log
              <ArrowUpRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              className="justify-between rounded-full"
              render={<Link href="/" />}
            >
              Portal publik
              <ArrowUpRight data-icon="inline-end" />
            </Button>
            <div className="mt-2 rounded-xl bg-muted p-3">
              <p className="text-xs font-semibold">Peran Anda</p>
              <Badge variant="secondary" className="mt-1.5">
                {roleLabels[user.role]}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
