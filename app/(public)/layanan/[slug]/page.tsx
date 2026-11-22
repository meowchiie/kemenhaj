import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "@/components/icons";
import { Breadcrumbs } from "@/components/page-hero";
import ServiceIcon from "@/components/service-icon";
import { IconTile, PillLink, Tag } from "@/components/ui";
import { formatDate, site } from "@/lib/content";
import { getPublicService, getPublicServices } from "@/lib/data/services";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getPublicService(slug);
  if (!service) return { title: "Layanan tidak ditemukan" };
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([
    getPublicService(slug),
    getPublicServices(),
  ]);
  if (!service) notFound();

  const others = allServices.filter((item) => item.slug !== service.slug);

  return (
    <>
      <div className="wrap pt-10 sm:pt-14">
        <Breadcrumbs
          items={[
            { label: "Layanan", href: "/layanan" },
            { label: service.shortName },
          ]}
        />
      </div>

      <header className="wrap pt-8 pb-10 sm:pt-10 sm:pb-14">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <Tag>Layanan administratif</Tag>
            <span className="t-caption text-subtle">
              Diperbarui {formatDate(service.updatedAt)}
            </span>
          </div>
          <h1 className="t-h1 mt-5 text-balance">{service.name}</h1>
          <p className="t-lead mt-5 max-w-2xl text-subtle">
            {service.description}
          </p>
        </div>
      </header>

      <div className="wrap grid gap-12 pb-20 lg:grid-cols-[1fr_340px]">
        <div>
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="t-label text-subtle">Langkah pertama</p>
                <h2 className="t-h3 mt-2">Dokumen yang dibutuhkan.</h2>
              </div>
              <span className="t-caption shrink-0 text-subtle">
                {service.requirements.length} dokumen
              </span>
            </div>
            <ul className="mt-6">
              {service.requirements.map((requirement, index) => (
                <li
                  key={requirement}
                  className="flex items-start gap-4 border-b border-hairline-soft py-3.5 first:pt-0 last:border-none"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-soft">
                    <Check className="size-3.5" />
                  </span>
                  <span className="t-body text-ink-soft">{requirement}</span>
                  <span className="t-caption ml-auto hidden shrink-0 text-faint sm:block">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <p className="t-label text-subtle">Alur proses</p>
            <h2 className="t-h3 mt-2">Langkah pengajuan.</h2>
            <ol className="mt-6 flex flex-col">
              {service.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="relative flex gap-5 pb-8 last:pb-0"
                >
                  {index < service.steps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-10 left-5 h-[calc(100%-2.5rem)] w-px bg-hairline"
                    />
                  ) : null}
                  <span className="grid size-10 shrink-0 place-items-center rounded-[30%] bg-ink text-[13px] font-semibold text-canvas">
                    {index + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="t-title">{step.title}</h3>
                    <p className="t-sm mt-1 max-w-xl text-subtle">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12 rounded-[24px] bg-soft p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <IconTile tone="canvas">
                <Shield className="size-5" />
              </IconTile>
              <div>
                <h2 className="t-title">Catatan penting</h2>
                <p className="t-sm mt-2 max-w-xl text-subtle">{service.note}</p>
                <div className="t-caption mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-subtle">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {service.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-3.5" />
                    {service.cost}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <h2 className="t-h3">Layanan lainnya.</h2>
              <PillLink href="/layanan" variant="soft" size="sm">
                Semua layanan
                <ArrowUpRight className="size-3.5" />
              </PillLink>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/layanan/${item.slug}`}
                  className="group flex flex-col rounded-[24px] border border-hairline-soft p-6 transition-colors hover:bg-soft"
                >
                  <div className="flex items-center justify-between">
                    <IconTile tone="soft">
                      <ServiceIcon icon={item.icon} className="size-5" />
                    </IconTile>
                    <ArrowUpRight className="size-4 text-subtle group-hover:text-ink" />
                  </div>
                  <h3 className="t-title mt-6">{item.name}</h3>
                  <p className="t-sm mt-1.5 line-clamp-2 text-subtle">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[24px] bg-soft p-6">
            <p className="t-label text-subtle">Ringkasan layanan</p>
            <dl className="mt-4 flex flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-hairline py-3">
                <dt className="t-sm text-subtle">Jenis layanan</dt>
                <dd className="t-sm text-right font-semibold">
                  {service.shortName}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-hairline py-3">
                <dt className="t-sm text-subtle">Estimasi waktu</dt>
                <dd className="t-sm text-right font-semibold">
                  {service.duration}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-hairline py-3">
                <dt className="t-sm text-subtle">Biaya</dt>
                <dd className="t-sm text-right font-semibold">
                  {service.cost}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="t-sm text-subtle">Pembaruan</dt>
                <dd className="t-sm text-right font-semibold">
                  {formatDate(service.updatedAt)}
                </dd>
              </div>
            </dl>

            {/* {service.form ? (
              <>
                <PillLink
                  href={service.form.href}
                  size="lg"
                  className="mt-4 w-full"
                >
                  <Download className="size-4" />
                  Unduh formulir PDF
                </PillLink>
                <p className="t-caption mt-3 text-center text-subtle">
                  {service.form.filename} · PDF {service.form.size}
                </p>
              </>
            ) : (
              <p className="t-caption mt-4 rounded-[16px] bg-canvas px-4 py-3 text-center text-subtle">
                Formulir PDF belum tersedia. Hubungi petugas untuk berkas
                cetak.
              </p>
            )} */}
          </div>

          <div className="mt-3 rounded-[24px] border border-hairline-soft p-6">
            <p className="t-label text-subtle">Butuh bantuan?</p>
            <p className="t-body mt-3 text-subtle">
              Petugas loket terpadu dapat memeriksa kelengkapan berkas Anda
              sebelum diajukan.
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                  className="t-sm flex items-center gap-2.5 text-ink"
                >
                  <Phone className="size-4 text-subtle" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="t-sm flex items-center gap-2.5 text-ink"
                >
                  <Mail className="size-4 text-subtle" />
                  {site.email}
                </a>
              </li>
              <li className="t-sm flex items-start gap-2.5 text-subtle">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {site.address}
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <PillLink href="/profil" variant="soft" size="sm">
                Profil pejabat
                <ArrowRight className="size-3.5" />
              </PillLink>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
