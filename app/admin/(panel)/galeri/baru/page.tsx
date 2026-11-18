import Link from "next/link";
import AdminPageHeader from "@/components/admin/page-header";
import GalleryForm from "@/components/admin/gallery-form";
import { requireUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function NewGalleryPage() {
  await requireUser();

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
