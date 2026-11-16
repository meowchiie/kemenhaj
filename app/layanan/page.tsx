import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Download,
  FileText,
  MapPin,
  Phone,
  Shield,
} from "@/components/icons";
import PageBanner from "@/components/page-banner";
import ServiceIcon from "@/components/service-icon";
import { IconTile, PillLink, SectionHead, Tag } from "@/components/ui";
import { services, site } from "@/lib/content";

export const metadata = {
  title: "Layanan",
  description:
    "Persyaratan, alur proses, dan formulir untuk pendaftaran haji, pelimpahan porsi, dan pembatalan porsi.",
};

const faqs = [
  {
    question: "Apakah pendaftaran haji bisa dilakukan sepenuhnya online?",
    answer:
      "Belum. Setoran awal BPIH dilakukan di Bank Penerima Setoran resmi, lalu verifikasi dokumen dan input SISKOHAT dilakukan di kantor. Portal ini membantu Anda menyiapkan berkas sebelum datang.",
  },
  {
    question: "Berapa lama dana pembatalan porsi dikembalikan?",
    answer:
      "Proses di kantor memakan waktu 14–30 hari kerja. Pengembalian dana sepenuhnya diproses oleh BPS-BPIH, sehingga waktunya bergantung pada kebijakan bank masing-masing.",
  },
  {
    question: "Siapa yang berhak menerima pelimpahan porsi?",
    answer:
      "Pelimpahan hanya diberikan kepada ahli waris atau pihak yang berhak sesuai ketentuan, ketika pemilik porsi meninggal dunia atau mengalami sakit permanen. Setiap pengajuan diverifikasi oleh Kanwil Kementerian Agama.",
  },
  {
    question: "Dokumen apa yang paling sering kurang lengkap?",
    answer:
      "Bukti setoran BPIH, surat kuasa bermeterai, dan akta kematian atau surat keterangan sakit permanen. Periksa daftar persyaratan pada masing-masing layanan sebelum datang.",
  },
  {
    question: "Apakah layanan di kantor dipungut biaya?",
    answer:
      "Tidak. Kantor tidak memungut biaya layanan. Seluruh setoran dan pengembalian dana dilakukan melalui rekening resmi BPS-BPIH.",
  },
];

export default function LayananPage() {
  return (
    <>
      <PageBanner
        eyebrow="Layanan informasi"
        title="Syarat dan alur layanan."
        description="Tiga layanan administratif yang paling sering diajukan masyarakat. Setiap halaman memuat daftar dokumen, alur proses, dan formulir PDF yang bisa diunduh lebih dulu."
        image="/images/galeri-2.jpg"
        actions={
          <>
            <PillLink href="/layanan/pelimpahan-porsi" variant="canvas">
              Mulai dari pelimpahan porsi
              <ArrowRight className="size-4" />
            </PillLink>
            <PillLink href="/profil" variant="glass">
              Hubungi petugas
            </PillLink>
          </>
        }
      />

      <section className="wrap pt-6">
        <div className="rounded-[24px] bg-soft px-6 py-6 sm:px-8">
          <p className="t-label text-muted">Sebelum datang</p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Periksa daftar dokumen",
              "Unduh dan isi formulir",
              "Bawa berkas asli",
              "Datang pada jam layanan",
            ].map((item, index) => (
              <li key={item} className="flex items-center gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-canvas text-[11px] font-semibold">
                  {index + 1}
                </span>
                <span className="t-sm">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap">
        <div className="flex flex-col gap-5 rounded-[24px] border border-hairline-soft p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <IconTile tone="soft">
              <Shield className="size-5" />
            </IconTile>
            <div>
              <p className="t-title">Pendaftaran tetap melalui SISKOHAT.</p>
              <p className="t-sm mt-1 max-w-2xl text-muted">
                Portal ini bukan sistem pendaftaran. Seluruh data porsi jemaah
                dikelola melalui Sistem Komputerisasi Haji Terpadu Kementerian
                Agama RI.
              </p>
            </div>
          </div>
          <a
            href="https://haji.kemenag.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-soft px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-hairline"
          >
            Buka SISKOHAT
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <SectionHead
          eyebrow="Direktori"
          title="Pilih jenis layanan."
          description="Setiap layanan memiliki persyaratan dan alur yang berbeda. Pastikan Anda membuka halaman yang sesuai."
        />

        <div className="mt-10 flex flex-col gap-3">
          {services.map((service) => (
            <div
              key={service.slug}
              className="grid gap-6 rounded-[24px] bg-soft p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center"
            >
              <IconTile tone="canvas" className="size-14">
                <ServiceIcon icon={service.icon} className="size-6" />
              </IconTile>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="t-h4">{service.name}</h2>
                  <Tag>{service.duration}</Tag>
                </div>
                <p className="t-sm mt-2 max-w-2xl text-muted">
                  {service.description}
                </p>
                <div className="t-caption mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-3.5" />
                    {service.requirements.length} dokumen wajib
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Download className="size-3.5" />
                    Formulir PDF tersedia
                  </span>
                  <span>{service.cost}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <PillLink href={`/layanan/${service.slug}`} variant="primary">
                  Lihat persyaratan
                  <ArrowRight className="size-4" />
                </PillLink>
                <a
                  href={service.form.file}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-hairline bg-canvas px-5 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
                >
                  <Download className="size-4" />
                  Formulir
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-16 sm:pb-24">
        <SectionHead
          eyebrow="Pertanyaan umum"
          title="Hal yang sering ditanyakan."
        />
        <div className="mt-8 flex max-w-3xl flex-col gap-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[16px] bg-soft px-5 py-4 sm:px-6"
            >
              <summary className="t-body flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="t-sm mt-3 max-w-2xl text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wrap pb-20">
        <div className="grid gap-8 rounded-[24px] bg-soft px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="t-label text-muted">Kontak layanan</p>
            <h2 className="t-h2 mt-4 max-w-lg text-balance">
              Petugas kami siap memeriksa berkas Anda.
            </h2>
            <p className="t-body mt-4 max-w-lg text-muted">
              Datang langsung ke loket terpadu atau hubungi kami pada jam
              layanan. Konsultasi awal tidak dipungut biaya.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <PillLink href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} size="lg">
              <Phone className="size-4" />
              {site.phone}
            </PillLink>
            <Link
              href="/profil"
              className="t-sm inline-flex items-center gap-2 text-muted transition-colors hover:text-ink"
            >
              <MapPin className="size-4" />
              {site.address}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
