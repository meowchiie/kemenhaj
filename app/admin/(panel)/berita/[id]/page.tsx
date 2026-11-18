import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/page-header";
import ArticleCoverCard from "@/components/admin/article-cover-card";
import ArticleForm from "@/components/admin/article-form";
import DeleteArticleButton from "@/components/admin/delete-article-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/admin/ui/alert";
import { Badge } from "@/components/admin/ui/badge";
import { can, requireUser } from "@/lib/auth/permissions";
import { getAdminArticle } from "@/lib/data/articles";

export const instant = false;

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const article = await getAdminArticle(id);

  if (!article) notFound();
  if (!can(user, "articles:write")) {
    redirect("/admin/berita?status=ditolak");
  }

  const { status } = await searchParams;

  return (
    <>
      <AdminPageHeader
        eyebrow="Berita"
        title={article.title}
        description="Perubahan yang disimpan langsung memperbarui portal publik bila berita diterbitkan."
        actions={
          <Badge variant={article.isPublished ? "default" : "outline"}>
            {article.isPublished ? "Terbit" : "Draf"}
          </Badge>
        }
      />

      {status === "baru" ? (
        <Alert className="mb-6">
          <AlertTitle>Berita berhasil dibuat</AlertTitle>
          <AlertDescription>
            Sekarang tambahkan gambar utama lewat panel di samping.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <ArticleForm article={article} />

        <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
          <ArticleCoverCard articleId={article.id} cover={article.cover} />

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">Tautan publik</p>
            <Link
              href={`/berita/${article.slug}`}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              /berita/{article.slug}
            </Link>
            {article.isPublished ? (
              <Link
                href={`/berita/${article.slug}`}
                className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
              >
                Buka halaman berita
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground">
                Terbitkan berita agar tautan dapat diakses publik.
              </p>
            )}
          </div>

          {can(user, "articles:delete") ? (
            <div className="rounded-2xl border border-destructive/30 bg-card p-4">
              <p className="mb-3 text-sm font-semibold">Zona berbahaya</p>
              <DeleteArticleButton
                articleId={article.id}
                articleTitle={article.title}
              />
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}
