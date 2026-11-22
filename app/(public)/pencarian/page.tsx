import { Suspense } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArticleRow } from "@/components/article-card";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  FileText,
  Images,
  Search,
} from "@/components/icons";
import PageBanner from "@/components/page-banner";
import ServiceIcon from "@/components/service-icon";
import { IconTile, PillLink, Tag } from "@/components/ui";
import { formatDate, site } from "@/lib/content";
import {
  getPublicArticles,
  latestArticles,
} from "@/lib/data/articles";
import { getPublicGalleries } from "@/lib/data/galleries";
import { getPublicServices } from "@/lib/data/services";

export const metadata = {
  title: "Pencarian",
  description:
    "Cari berita, persyaratan layanan, dan album galeri di portal Kemenhaj Pare.",
};

const suggestions = [
  "Pelimpahan porsi",
  "Pendaftaran haji",
  "Pembatalan porsi",
  "Manasik",
];

export default function PencarianPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <div className="wrap pt-20 pb-20">
      <div className="h-10 w-64 animate-pulse rounded-full bg-soft" />
      <div className="mt-8 h-14 w-full max-w-xl animate-pulse rounded-full bg-soft" />
    </div>
  );
}

async function SearchContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [services, articles, albums] = await Promise.all([
    getPublicServices(),
    getPublicArticles(),
    getPublicGalleries(),
  ]);
  const query = (q ?? "").trim();
  const needle = query.toLowerCase();

  const matchedArticles = query
    ? articles.filter((article) =>
        `${article.title} ${article.excerpt} ${article.category}`
          .toLowerCase()
          .includes(needle),
      )
    : [];
  const matchedServices = query
    ? services.filter((service) =>
        `${service.name} ${service.description} ${service.requirements.join(" ")}`
          .toLowerCase()
          .includes(needle),
      )
    : [];
  const matchedAlbums = query
    ? albums.filter((album) =>
        `${album.title} ${album.description}`.toLowerCase().includes(needle),
      )
    : [];
  const total =
    matchedArticles.length + matchedServices.length + matchedAlbums.length;

  return (
    <>
      <PageBanner
        eyebrow="Pencarian terpadu"
        title="Cari di portal."
        description="Satu kata kunci untuk berita, persyaratan layanan, dan album galeri. Hasil dikelompokkan agar mudah dipindai."
        image="/images/page-banner/5.jpeg"
      >
        <form
          action="/pencarian"
          role="search"
          className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full bg-soft p-1.5 pl-5"
        >
          <Search className="size-4 shrink-0 text-subtle" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Contoh: pelimpahan porsi"
            aria-label="Kata kunci pencarian"
            className="h-11 w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          />
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-semibold text-canvas transition-colors hover:bg-ink-soft"
          >
            Cari
          </button>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="t-caption text-canvas/70">Saran:</span>
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/pencarian?q=${encodeURIComponent(suggestion)}`}
              className="rounded-full bg-canvas/15 px-3.5 py-1.5 text-[13px] font-semibold text-canvas transition-colors hover:bg-canvas/25"
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </PageBanner>

      <section className="wrap pb-20">
        {!query ? (
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <Tag>Terbaru</Tag>
                <p className="t-caption text-subtle">Berita yang baru terbit</p>
              </div>
              <div className="mt-6 flex flex-col gap-5">
                {latestArticles(articles, 4).map((article) => (
                  <ArticleRow key={article.slug} article={article} />
                ))}
              </div>
            </div>
            <div className="rounded-[24px] bg-soft p-6">
              <p className="t-label text-subtle">Jelajahi layanan</p>
              <ul className="mt-4 flex flex-col gap-2">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/layanan/${service.slug}`}
                      className="group flex items-center gap-3 rounded-[16px] bg-canvas p-3.5"
                    >
                      <IconTile tone="soft" className="size-10">
                        <ServiceIcon icon={service.icon} className="size-4" />
                      </IconTile>
                      <span className="min-w-0 flex-1">
                        <span className="t-sm block font-semibold">
                          {service.shortName}
                        </span>
                        <span className="t-caption text-subtle">
                          {service.requirements.length} dokumen wajib
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 text-subtle group-hover:text-ink" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : total === 0 ? (
          <div className="rounded-[24px] bg-soft px-6 py-16 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-[30%] bg-canvas">
              <Search className="size-6 text-subtle" />
            </div>
            <h2 className="t-h3 mt-6">Tidak ada hasil untuk “{query}”.</h2>
            <p className="t-body mx-auto mt-3 max-w-md text-subtle">
              Coba kata kunci yang lebih singkat, atau hubungi petugas layanan
              jika informasi yang Anda cari belum tersedia.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <PillLink href="/layanan">Lihat layanan</PillLink>
              <PillLink
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                variant="outline"
              >
                Hubungi petugas
              </PillLink>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-14">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline-soft pb-6">
              <div>
                <p className="t-label text-subtle">Hasil pencarian</p>
                <h2 className="t-h3 mt-2">“{query}”</h2>
              </div>
              <p className="t-caption text-subtle">{total} hasil ditemukan</p>
            </div>

            {matchedServices.length > 0 ? (
              <ResultGroup
                title="Persyaratan layanan"
                count={matchedServices.length}
                icon={<FileText className="size-4" />}
              >
                <div className="grid gap-3 md:grid-cols-3">
                  {matchedServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/layanan/${service.slug}`}
                      className="group flex flex-col rounded-[24px] bg-soft p-6 transition-colors hover:bg-field"
                    >
                      <div className="flex items-center justify-between">
                        <IconTile tone="canvas">
                          <ServiceIcon icon={service.icon} className="size-5" />
                        </IconTile>
                        <ArrowUpRight className="size-4 text-subtle group-hover:text-ink" />
                      </div>
                      <h3 className="t-title mt-5">{service.name}</h3>
                      <p className="t-sm mt-1.5 line-clamp-2 text-subtle">
                        {service.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </ResultGroup>
            ) : null}

            {matchedArticles.length > 0 ? (
              <ResultGroup
                title="Berita"
                count={matchedArticles.length}
                icon={<FileText className="size-4" />}
              >
                <div className="flex flex-col gap-5">
                  {matchedArticles.map((article) => (
                    <ArticleRow key={article.slug} article={article} />
                  ))}
                </div>
              </ResultGroup>
            ) : null}

            {matchedAlbums.length > 0 ? (
              <ResultGroup
                title="Galeri"
                count={matchedAlbums.length}
                icon={<Images className="size-4" />}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {matchedAlbums.map((album) => (
                    <Link
                      key={album.slug}
                      href={`/galeri?album=${album.slug}`}
                      className="group flex items-center gap-4 rounded-[24px] border border-hairline-soft p-4 transition-colors hover:bg-soft"
                    >
                      <div className="grid size-16 shrink-0 place-items-center rounded-[16px] bg-soft">
                        <Images className="size-5 text-subtle" />
                      </div>
                      <div className="min-w-0">
                        <p className="t-title truncate">{album.title}</p>
                        <p className="t-caption mt-1 flex items-center gap-1.5 text-subtle">
                          <Calendar className="size-3.5" />
                          {formatDate(album.date)} · {album.items.length} media
                        </p>
                      </div>
                      <ArrowRight className="ml-auto size-4 shrink-0 text-subtle group-hover:text-ink" />
                    </Link>
                  ))}
                </div>
              </ResultGroup>
            ) : null}
          </div>
        )}
      </section>
    </>
  );
}

function ResultGroup({
  title,
  count,
  icon,
  children,
}: {
  title: string;
  count: number;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-soft">
          {icon}
        </span>
        <h2 className="t-h4">{title}</h2>
        <Tag>{count} hasil</Tag>
      </div>
      {children}
    </section>
  );
}
