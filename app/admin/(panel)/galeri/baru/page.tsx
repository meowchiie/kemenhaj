import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/page-header";
import GalleryForm from "@/components/admin/gallery-form";
import { can, requireUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function NewGalleryPage() {
  const user = await requireUser();

  if (!can(user, "galleries:write")) {
    redirect("/admin");
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Galeri"
        title="Album baru"
        description="Simpan identitas album, lalu tambahkan sampul dan foto."
        actions={
          <Link
            href="/admin/galeri"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Kembali ke daftar
          </Link>
        }
      />
      <GalleryForm />
    </>
  );
}
