import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/page-header";
import ArticleForm from "@/components/admin/article-form";
import { can, requireUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function NewArticlePage() {
  const user = await requireUser();

  if (!can(user, "articles:write")) {
    redirect("/admin/berita?status=ditolak");
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Berita"
        title="Berita baru"
        description="Simpan berita sebagai draf atau langsung terbitkan."
        actions={
          <Link
            href="/admin/berita"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Kembali ke daftar
          </Link>
        }
      />
      <ArticleForm />
    </>
  );
}
