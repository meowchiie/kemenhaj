import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/page-header";
import DeleteOfficialButton from "@/components/admin/delete-official-button";
import OfficialForm from "@/components/admin/official-form";
import OfficialPhotoCard from "@/components/admin/official-photo-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/admin/ui/alert";
import { Badge } from "@/components/admin/ui/badge";
import { requireUser } from "@/lib/auth/permissions";
import { getAdminOfficial } from "@/lib/data/officials";

export const instant = false;

export default async function EditOfficialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const official = await getAdminOfficial(id);

  if (!official) notFound();

  const { status } = await searchParams;

  return (
    <>
      <AdminPageHeader
        eyebrow="Profil"
        title={official.name}
        description="Perubahan yang disimpan langsung memperbarui halaman profil publik."
        actions={
          <Badge variant={official.isActive ? "default" : "outline"}>
            {official.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        }
      />

      {status === "baru" ? (
        <Alert className="mb-6">
          <AlertTitle>Pejabat berhasil dibuat</AlertTitle>
          <AlertDescription>
            Sekarang unggah foto lewat panel di samping.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <OfficialForm official={official} />

        <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
          <OfficialPhotoCard
            officialId={official.id}
            photo={official.photoMedia}
          />

          <div className="rounded-2xl border border-destructive/30 bg-card p-4">
            <p className="mb-3 text-sm font-semibold">Zona berbahaya</p>
            <DeleteOfficialButton
              officialId={official.id}
              officialName={official.name}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
