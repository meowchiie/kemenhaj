import Link from "next/link";
import AdminPageHeader from "@/components/admin/page-header";
import OfficialForm from "@/components/admin/official-form";
import { requireUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function NewOfficialPage() {
  await requireUser();

  return (
    <>
      <AdminPageHeader
        eyebrow="Profil"
        title="Pejabat baru"
        description="Simpan data pejabat, lalu unggah foto pada halaman berikutnya."
        actions={
          <Link
            href="/admin/pejabat"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Kembali ke daftar
          </Link>
        }
      />
      <OfficialForm />
    </>
  );
}
