import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, FileText } from "lucide-react";
import AdminPageHeader from "@/components/admin/page-header";
import DeleteServiceButton from "@/components/admin/delete-service-button";
import PdfUploadCard from "@/components/admin/pdf-upload-card";
import ServiceForm from "@/components/admin/service-form";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Separator } from "@/components/admin/ui/separator";
import { can, requireUser } from "@/lib/auth/permissions";
import { getAdminService } from "@/lib/data/services";

export const instant = false;

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const service = await getAdminService(id);

  if (!service) notFound();

  const canWrite = can(user, "services:write");
  const canDelete = can(user, "services:delete");

  return (
    <>
      <AdminPageHeader
        eyebrow="Ubah layanan"
        title={service.name}
        description={`Terakhir diperbarui ${service.updatedAt}.`}
        crumbs={[
          { label: "Layanan", href: "/admin/layanan" },
          { label: service.shortName },
        ]}
        actions={
          <>
            {service.isPublished ? (
              <Button
                variant="outline"
                className="rounded-full"
                render={<Link href={`/layanan/${service.slug}`} target="_blank" />}
              >
                Lihat publik
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            ) : (
              <Badge variant="outline">Draf — tidak tampil publik</Badge>
            )}
            {canDelete ? (
              <DeleteServiceButton
                serviceId={service.id}
                serviceName={service.name}
              />
            ) : null}
          </>
        }
      />

      {canWrite ? (
        <div className="flex flex-col gap-6">
          <ServiceForm service={service} />
          <PdfUploadCard serviceId={service.id} form={service.form} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Durasi: {service.duration}</Badge>
                <Badge variant="secondary">Biaya: {service.cost}</Badge>
              </div>
              <Separator />
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Persyaratan
                </p>
                <ol className="flex list-decimal flex-col gap-1 pl-5">
                  {service.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Alur proses
                </p>
                <ol className="flex list-decimal flex-col gap-1 pl-5">
                  {service.steps.map((step) => (
                    <li key={step.title}>
                      <span className="font-semibold">{step.title}</span> —{" "}
                      {step.detail}
                    </li>
                  ))}
                </ol>
              </div>
              {service.form ? (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-muted p-3">
                  <span className="flex items-center gap-2 text-sm">
                    <FileText className="size-4" />
                    {service.form.filename} · {service.form.size}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    render={<a href={service.form.href} />}
                  >
                    Unduh
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
