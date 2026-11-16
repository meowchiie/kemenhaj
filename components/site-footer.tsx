import Link from "next/link";
import { Mail, MapPin, Phone } from "@/components/icons";
import Logo from "@/components/logo";
import { site } from "@/lib/content";

const columns = [
  {
    title: "Layanan",
    links: [
      { label: "Pendaftaran haji", href: "/layanan/pendaftaran-haji" },
      { label: "Pelimpahan porsi", href: "/layanan/pelimpahan-porsi" },
      { label: "Pembatalan porsi", href: "/layanan/pembatalan-porsi" },
      { label: "Unduh formulir", href: "/layanan" },
    ],
  },
  {
    title: "Portal",
    links: [
      { label: "Berita", href: "/berita" },
      { label: "Profil pejabat", href: "/profil" },
      { label: "Galeri kegiatan", href: "/galeri" },
      { label: "Pencarian", href: "/pencarian" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-20 sm:mt-28">
      <div className="rounded-t-[24px] bg-ink px-5 pt-14 pb-8 text-canvas sm:px-10 sm:pt-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
            <div>
              <Logo tone="canvas" withWordmark={false} />
              <p className="t-display mt-6 text-canvas">
                Kemenhaj
                <br />
                Pare.
              </p>
              <p className="t-body mt-5 max-w-xs text-faint">
                Portal informasi publik {site.longName}. Terbuka, ringkas, dan
                mudah diakses semua orang.
              </p>
            </div>

            {columns.map((column) => (
              <div key={column.title}>
                <p className="t-label text-faint">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="t-sm text-canvas/80 transition-colors hover:text-canvas"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="t-label text-faint">Kontak</p>
              <ul className="mt-4 space-y-4 text-canvas/80">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span className="t-sm">{site.address}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0" />
                  <a
                    href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                    className="t-sm transition-colors hover:text-canvas"
                  >
                    {site.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0" />
                  <a
                    href={`mailto:${site.email}`}
                    className="t-sm transition-colors hover:text-canvas"
                  >
                    {site.email}
                  </a>
                </li>
              </ul>
              <p className="t-caption mt-5 text-faint">{site.hours}</p>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-faint sm:flex-row sm:items-center sm:justify-between">
            <p className="t-caption">
              © 2026 {site.longName}. Seluruh hak cipta dilindungi.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/pencarian" className="t-caption hover:text-canvas">
                Peta situs
              </Link>
              <Link href="/profil" className="t-caption hover:text-canvas">
                Kebijakan privasi
              </Link>
              <Link href="/layanan" className="t-caption hover:text-canvas">
                Aksesibilitas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
