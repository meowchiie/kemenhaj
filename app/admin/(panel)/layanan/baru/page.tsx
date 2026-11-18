import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminPageHeader from "@/components/admin/page-header";
import ServiceForm from "@/components/admin/service-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/admin/ui/alert";
import { Button } from "@/components/admin/ui/button";
import { can, requireUser } from "@/lib/auth/permissions";

export const instant = false;

export default async function NewServicePage() {
  const user = await requireUser();
  const canWrite = can(user, "services:write");

  return (
    <>
      <AdminPageHeader
        eyebrow="Layanan baru"
        title="Tambah layanan"
        description="Isi identitas layanan, persyaratan, dan alur proses. Formulir PDF dapat diunggah setelah layanan tersimpan."
        crumbs={[{ label: "Layanan", href: "/admin/layanan" }, { label: "Baru" }]}
        actions={
          <Button
            variant="outline"
            className="rounded-full"
            render={<Link href="/admin/layanan" />}
          >
            <ArrowLeft data-icon="inline-start" />
            Kembali
          </Button>
        }
      />

      {canWrite ? (
        <ServiceForm />
      ) : (
        <Alert variant="destructive">
          <AlertTitle>Akses baca saja</AlertTitle>
          <AlertDescription>
            Peran Anda tidak memiliki izin menambah layanan.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
