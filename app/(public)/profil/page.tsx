import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Shield,
  Users,
} from "@/components/icons";
import OfficialsGrid from "@/components/officials-grid";
import PageBanner from "@/components/page-banner";
import { IconTile, PillLink, SectionHead, Tag } from "@/components/ui";
import { officials, site } from "@/lib/content";

export const metadata = {
  title: "Profil",
  description:
    "Struktur organisasi, profil pejabat, tugas pokok, dan kontak resmi Kantor Kementerian Haji dan Umrah Kota Parepare.",
};

const units = [
  {
    name: "Subbagian Tata Usaha",
    lead: "Hj. Nurhayati, S.Ag., M.Pd.",
    focus: "Administrasi, kepegawaian, keuangan, dan informasi publik.",
  },
  {
    name: "Seksi Penyelenggaraan Haji dan Umrah",
    lead: "Abdul Rahman, S.E., M.M.",
    focus: "Pendaftaran, bimbingan manasik, dan pelayanan jemaah haji reguler.",
  },
  {
    name: "Seksi Haji Khusus dan Umrah",
    lead: "Fatimah Zahra, S.H., M.H.",
    focus: "Pembinaan penyelenggara haji khusus dan umrah.",
  },
  {
    name: "Layanan Terpadu",
    lead: "Andi Pratama, A.Md.",
    focus: "Penerimaan berkas, informasi awal, dan pengarahan masyarakat.",
  },
];

const duties = [
  {
    icon: Shield,
    title: "Pelayanan administrasi",
    text: "Memverifikasi dokumen, menerbitkan bukti layanan, dan memastikan seluruh proses sesuai ketentuan Kementerian Agama.",
  },
  {
    icon: Users,
    title: "Pembinaan jemaah",
    text: "Menyelenggarakan bimbingan manasik, sosialisasi kebijakan, dan pendampingan bagi calon jemaah haji dan umrah.",
  },
  {
    icon: Calendar,
    title: "Pengawasan dan publikasi",
    text: "Mengawasi penyelenggara perjalanan ibadah serta mempublikasikan kegiatan dan informasi layanan secara terbuka.",
  },
];

export default function ProfilPage() {
  const head = officials.find((official) => official.order === 1);

  return (
    <>
      <PageBanner
        eyebrow="Profil organisasi"
        title="Struktur organisasi."
        description="Kantor Kementerian Haji dan Umrah Kota Parepare menjalankan layanan haji dan umrah melalui empat unit kerja yang saling terkoordinasi."
        image="/images/galeri-7.jpg"
        actions={
          <>
            <PillLink href="#pejabat" variant="canvas">
              Lihat daftar pejabat
              <ArrowUpRight className="size-4" />
            </PillLink>
            <PillLink
              href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
              variant="glass"
            >
              <Phone className="size-4" />
              {site.phone}
            </PillLink>
          </>
        }
      />

      <section className="wrap pb-16 sm:pb-20">
        <SectionHead
          eyebrow="Bagan"
          title="Empat unit, satu koordinasi."
          description="Setiap unit memiliki tugas pokok yang diarahkan langsung oleh Kepala Kantor."
        />

        <div className="mt-10 flex flex-col items-center">
          {head ? (
            <div className="w-full max-w-md rounded-[24px] bg-soft p-6 text-center">
              <Tag>Pimpinan</Tag>
              <p className="t-h4 mt-3">{head.name}</p>
              <p className="t-sm mt-1 text-muted">{head.position}</p>
              <p className="t-caption mt-2 text-faint">NIP {head.nip}</p>
            </div>
          ) : null}
          <span aria-hidden="true" className="h-8 w-px bg-hairline" />
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {units.map((unit) => (
              <div
                key={unit.name}
                className="rounded-[24px] border border-hairline-soft p-5"
              >
                <p className="t-caption text-muted">Unit kerja</p>
                <p className="t-title mt-2">{unit.name}</p>
                <p className="t-caption mt-2 text-muted">{unit.focus}</p>
                <p className="t-caption mt-4 border-t border-hairline-soft pt-3 text-ink">
                  {unit.lead}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pejabat" className="wrap scroll-mt-28 pb-16 sm:pb-20">
        <SectionHead
          eyebrow="Pejabat & staf"
          title="Orang di balik layanan."
          description="Klik kartu untuk melihat tugas pokok dan kontak resmi masing-masing pejabat."
          action={
            <PillLink href="/layanan" variant="soft">
              Lihat layanan
              <ArrowUpRight className="size-4" />
            </PillLink>
          }
        />
        <div className="mt-10">
          <OfficialsGrid officials={officials} />
        </div>
      </section>

      <section className="wrap pb-16 sm:pb-20">
        <SectionHead
          eyebrow="Tugas & fungsi"
          title="Yang kami kerjakan setiap hari."
        />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {duties.map((duty) => (
            <div key={duty.title} className="rounded-[24px] bg-soft p-6">
              <IconTile tone="canvas">
                <duty.icon className="size-5" />
              </IconTile>
              <h3 className="t-title mt-6">{duty.title}</h3>
              <p className="t-sm mt-2 text-muted">{duty.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-20">
        <div className="grid gap-8 rounded-[24px] border border-hairline-soft p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="t-label text-muted">Kunjungi kantor</p>
            <h2 className="t-h2 mt-4 max-w-lg text-balance">
              Loket terpadu di lantai dasar.
            </h2>
            <p className="t-body mt-4 max-w-lg text-muted">
              Seluruh layanan dokumen haji dan umrah dilayani di satu loket.
              Silakan datang pada jam layanan dengan membawa berkas asli.
            </p>
            <div className="t-sm mt-6 flex flex-col gap-3 text-muted">
              <span className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {site.address}
              </span>
              <span className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0" />
                {site.phone}
              </span>
              <span className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0" />
                {site.email}
              </span>
              <span className="flex items-center gap-2.5">
                <Calendar className="size-4 shrink-0" />
                {site.hours}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <PillLink href="/layanan" size="lg">
              Lihat persyaratan layanan
            </PillLink>
            <Link
              href="/galeri"
              className="t-sm inline-flex h-11 items-center rounded-full px-5 text-muted transition-colors hover:text-ink"
            >
              Lihat dokumentasi kegiatan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
