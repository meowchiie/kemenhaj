import Image from "next/image";
import Link from "next/link";
import { ArticleCardFeatured, ArticleRow } from "@/components/article-card";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Eye,
  Images,
  MapPin,
  Phone,
} from "@/components/icons";
import HomeHeroSlider, { type HeroSlide } from "@/components/home-hero-slider";
import ServiceIcon from "@/components/service-icon";
import { Eyebrow, IconTile, PillLink, SectionHead, Tag } from "@/components/ui";
import { formatDate, formatViews, site } from "@/lib/content";
import {
  latestArticles,
  popularArticles,
  getPublicArticles,
} from "@/lib/data/articles";
import { getPublicGalleries } from "@/lib/data/galleries";
import { getPublicServices } from "@/lib/data/services";

export default async function HomePage() {
  const [services, articles, albums] = await Promise.all([
    getPublicServices(),
    getPublicArticles(),
    getPublicGalleries(),
  ]);

  const stats = [
    { value: String(services.length), label: "Layanan administratif" },
    { value: String(articles.length), label: "Berita terbit" },
    { value: String(albums.length), label: "Album kegiatan" },
  ];
  const latest = latestArticles(articles, 5);
  const popular = popularArticles(articles, 4);
  const featured = latest[0];
  const feed = latest.slice(1);
  const galleryPreview = albums.slice(0, 3);
  const albumHighlight = albums[1];

  const heroSlides: HeroSlide[] = [
    ...(featured
      ? [
          {
            eyebrow: "Berita terbaru",
            title: featured.title,
            description: featured.excerpt,
            href: `/berita/${featured.slug}`,
            cta: "Baca berita",
            image: featured.image,
          },
        ]
      : []),
    {
      eyebrow: "Layanan",
      title: "Pelimpahan porsi haji",
      description:
        "Syarat, alur lima langkah, dan formulir yang bisa diunduh sebelum datang ke kantor.",
      href: "/layanan/pelimpahan-porsi",
      cta: "Lihat persyaratan",
      image: "/images/galeri-2.jpg",
    },
    ...(albumHighlight
      ? [
          {
            eyebrow: "Galeri",
            title: albumHighlight.title,
            description: albumHighlight.description,
            href: `/galeri?album=${albumHighlight.slug}`,
            cta: "Buka album",
            image: albumHighlight.cover,
          },
        ]
      : []),
  ];

  return (
    <>
      <section className="wrap pt-10 pb-6 sm:pt-16 sm:pb-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <Eyebrow className="mb-5">
              Portal Informasi Publik · Kota Parepare
            </Eyebrow>
            <h1 className="t-h1 max-w-2xl text-balance">
              Informasi haji dan umrah, terbuka untuk semua.
            </h1>
            <p className="t-lead mt-6 max-w-xl text-subtle">
              Persyaratan layanan, berita terkini, profil pejabat, dan
              dokumentasi kegiatan Kantor Kementerian Haji dan Umrah Kota
              Parepare dalam satu tempat.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <PillLink href="/layanan" size="lg">
                Lihat persyaratan layanan
                <ArrowRight className="size-4" />
              </PillLink>
              <PillLink href="/berita" variant="outline" size="lg">
                Baca berita terkini
              </PillLink>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <span className="t-caption text-subtle">Sering dicari:</span>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/layanan/${service.slug}`}
                  className="rounded-full bg-soft px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-field"
                >
                  {service.shortName}
                </Link>
              ))}
            </div>
          </div>

          <HomeHeroSlider slides={heroSlides} />
        </div>
      </section>

      <section className="wrap">
        <div className="grid grid-cols-3 gap-4 rounded-[24px] bg-soft px-5 py-7 sm:gap-8 sm:px-10 sm:py-10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="t-h2">{stat.value}</p>
              <p className="t-caption mt-1 text-subtle sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-16 sm:py-24">
        <SectionHead
          eyebrow="Layanan"
          title="Tiga urusan yang paling sering ditanyakan."
          description="Setiap layanan dilengkapi daftar dokumen, alur proses, dan formulir yang bisa diunduh sebelum datang ke kantor."
          action={
            <PillLink href="/layanan" variant="soft">
              Semua layanan
              <ArrowUpRight className="size-4" />
            </PillLink>
          }
        />
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/layanan/${service.slug}`}
              className="group flex flex-col rounded-[24px] bg-soft p-6 transition-colors hover:bg-field sm:p-7"
            >
              <div className="flex items-start justify-between">
                <IconTile tone="canvas">
                  <ServiceIcon icon={service.icon} className="size-5" />
                </IconTile>
                <ArrowUpRight className="size-5 text-subtle transition-colors group-hover:text-ink" />
              </div>
              <h3 className="t-h4 mt-8 text-balance">{service.name}</h3>
              <p className="t-sm mt-2 line-clamp-3 text-subtle">
                {service.description}
              </p>
              <div className="t-caption mt-6 flex items-center gap-3 border-t border-hairline pt-4 text-subtle">
                <span>{service.requirements.length} dokumen</span>
                <span className="text-hairline">•</span>
                <span>{service.steps.length} langkah</span>
                <span className="text-hairline">•</span>
                <span>{service.duration}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured ? (
      <section className="wrap pb-16 sm:pb-24">
        <SectionHead
          eyebrow="Berita"
          title="Kabar terbaru dari kantor."
          description="Pengumuman resmi, jadwal layanan, dan dokumentasi kegiatan terbaru."
          action={
            <PillLink href="/berita" variant="soft">
              Semua berita
              <ArrowUpRight className="size-4" />
            </PillLink>
          }
        />

        <div className="mt-10">
          <ArticleCardFeatured article={featured} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.55fr_1fr]">
          <div>
            <div className="flex flex-col gap-5">
              {feed.map((article) => (
                <ArticleRow key={article.slug} article={article} />
              ))}
            </div>
            <div className="mt-8">
              <PillLink href="/berita" variant="outline">
                Lihat arsip berita
                <ArrowRight className="size-4" />
              </PillLink>
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            <div className="rounded-[24px] bg-soft p-6">
              <p className="t-label text-subtle">Paling dibaca</p>
              <ol className="mt-5 flex flex-col gap-5">
                {popular.map((article, index) => (
                  <li key={article.slug}>
                    <Link
                      href={`/berita/${article.slug}`}
                      className="group flex items-start gap-3"
                    >
                      <span className="t-title w-5 shrink-0 text-faint">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="t-sm block font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">
                          {article.title}
                        </span>
                        <span className="t-caption mt-1 flex items-center gap-1.5 text-subtle">
                          <Eye className="size-3.5" />
                          {formatViews(article.views)} kali dibaca
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[24px] border border-hairline-soft p-6">
              <p className="t-label text-subtle">Loket layanan</p>
              <p className="t-title mt-3">Senin–Jumat, 08.00–15.00 WITA</p>
              <div className="t-sm mt-4 flex flex-col gap-3 text-subtle">
                <span className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  {site.address}
                </span>
                <span className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0" />
                  {site.phone}
                </span>
              </div>
              <div className="mt-5">
                <PillLink href="/profil" variant="soft" size="sm">
                  Lihat kontak pejabat
                  <ArrowUpRight className="size-3.5" />
                </PillLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
      ) : null}

      {galleryPreview.length > 0 ? (
      <section className="wrap pb-16 sm:pb-24">
        <SectionHead
          eyebrow="Galeri"
          title="Dokumentasi kegiatan terbaru."
          description="Foto dan video kegiatan pelayanan haji dan umrah, diarsipkan per album."
          action={
            <PillLink href="/galeri" variant="soft">
              Buka galeri
              <ArrowUpRight className="size-4" />
            </PillLink>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {galleryPreview.map((album) => (
            <Link
              key={album.slug}
              href={`/galeri?album=${album.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-soft">
                <Image
                  src={album.cover}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <span className="absolute left-3 top-3">
                  <Tag tone="overlay">{album.year}</Tag>
                </span>
                <span className="absolute bottom-3 left-3">
                  <Tag tone="overlay">
                    <Images className="size-3.5" />
                    {album.items.length} media
                  </Tag>
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="t-title line-clamp-2">{album.title}</h3>
                  <p className="t-caption mt-1 flex items-center gap-1.5 text-subtle">
                    <Calendar className="size-3.5" />
                    {formatDate(album.date)}
                  </p>
                </div>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-subtle transition-colors group-hover:text-ink" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      ) : null}

      <section className="wrap">
        <div className="grid gap-8 rounded-[24px] bg-soft px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="t-label text-subtle">Bantuan</p>
            <h2 className="t-h2 mt-4 max-w-xl text-balance">
              Belum yakin dokumen apa yang perlu dibawa?
            </h2>
            <p className="t-body mt-4 max-w-lg text-subtle">
              Datang ke loket terpadu atau hubungi petugas pada jam layanan.
              Kami akan memeriksa kelengkapan berkas sebelum Anda mengajukan
              permohonan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <PillLink href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} size="lg">
              <Phone className="size-4" />
              {site.phone}
            </PillLink>
            <PillLink href="/layanan" variant="outline" size="lg">
              Lihat layanan
            </PillLink>
          </div>
        </div>
        <div className="t-caption mt-4 flex items-center gap-2 px-2 text-subtle">
          <Clock className="size-3.5" />
          Layanan tutup pada hari libur nasional dan cuti bersama.
        </div>
      </section>
    </>
  );
}
