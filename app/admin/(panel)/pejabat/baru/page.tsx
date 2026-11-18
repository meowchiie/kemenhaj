import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/page-header";
import OfficialForm from "@/components/admin/official-form";
import { can, requireUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function NewOfficialPage() {
  const user = await requireUser();

  if (!can(user, "officials:write")) {
    redirect("/admin");
  }

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
