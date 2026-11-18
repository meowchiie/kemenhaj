import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/page-header";
import DeleteGalleryButton from "@/components/admin/delete-gallery-button";
import GalleryCoverCard from "@/components/admin/gallery-cover-card";
import GalleryForm from "@/components/admin/gallery-form";
import GalleryItemsCard from "@/components/admin/gallery-items-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/admin/ui/alert";
import { Badge } from "@/components/admin/ui/badge";
import { requireUser } from "@/lib/auth/permissions";
import { getAdminGallery } from "@/lib/data/galleries";

export const instant = false;

export default async function EditGalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const gallery = await getAdminGallery(id);

  if (!gallery) notFound();

  const { status } = await searchParams;

  return (
    <>
      <AdminPageHeader
        eyebrow="Galeri"
        title={gallery.title}
        description="Perubahan yang disimpan langsung memperbarui galeri publik bila album diterbitkan."
        actions={
          <Badge variant={gallery.isPublished ? "default" : "outline"}>
            {gallery.isPublished ? "Terbit" : "Draf"}
          </Badge>
        }
      />

      {status === "baru" ? (
        <Alert className="mb-6">
          <AlertTitle>Album berhasil dibuat</AlertTitle>
          <AlertDescription>
            Tambahkan sampul dan foto lewat panel di samping.
          </AlertDescription>
        </Alert>
      ) : null}

      {status === "foto-dihapus" ? (
        <Alert className="mb-6">
          <AlertTitle>Foto dihapus</AlertTitle>
          <AlertDescription>
            Foto sudah dikeluarkan dari album ini.
          </AlertDescription>
        </Alert>
      ) : null}

      {status === "gagal" ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Tindakan gagal</AlertTitle>
          <AlertDescription>
            Terjadi kesalahan saat memproses permintaan. Coba lagi.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="flex flex-col gap-6">
          <GalleryForm gallery={gallery} />
          <GalleryItemsCard galleryId={gallery.id} items={gallery.items} />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
          <GalleryCoverCard galleryId={gallery.id} cover={gallery.cover} />

          <div className="rounded-2xl border border-destructive/30 bg-card p-4">
            <p className="mb-3 text-sm font-semibold">Zona berbahaya</p>
            <DeleteGalleryButton
              galleryId={gallery.id}
              galleryTitle={gallery.title}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
