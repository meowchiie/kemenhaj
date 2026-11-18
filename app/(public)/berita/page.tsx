import { Suspense } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArticleCard, ArticleCardFeatured } from "@/components/article-card";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import PageBanner from "@/components/page-banner";
import { PillLink } from "@/components/ui";
import { categories } from "@/lib/content";
import { getPublicArticles } from "@/lib/data/articles";

export const metadata = {
  title: "Berita",
  description:
    "Berita terkini, pengumuman resmi, dan dokumentasi kegiatan Kantor Kementerian Haji dan Umrah Kota Parepare.",
};

export default function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  return (
    <>
      <PageBanner
        eyebrow="Berita & informasi"
        title="Kabar dari Kemenhaj Pare."
        description="Pengumuman resmi, jadwal layanan, dan dokumentasi kegiatan terbaru. Gunakan kategori untuk mempersempit pencarian."
        image="/images/berita-4.jpg"
        actions={
          <PillLink href="/pencarian" variant="canvas">
            Cari berita lain
          </PillLink>
        }
      />

      <section className="wrap pb-20">
        <Suspense
          fallback={<div className="h-80 animate-pulse rounded-[24px] bg-soft" />}
        >
          <BeritaList searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function BeritaList({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const articles = await getPublicArticles();
  const active = categories.find((category) => category.slug === kategori);
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const list = active
    ? sorted.filter((article) => article.category === active.name)
    : sorted;

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-hairline-soft pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-1 overflow-x-auto rounded-full bg-soft p-1">
          <FilterPill href="/berita" active={!active}>
            Semua
          </FilterPill>
          {categories.map((category) => (
            <FilterPill
              key={category.slug}
              href={`/berita?kategori=${category.slug}`}
              active={active?.slug === category.slug}
            >
              {category.name}
            </FilterPill>
          ))}
        </div>
        <p className="t-caption shrink-0 text-subtle">
          {list.length} berita
          {active ? ` dalam kategori ${active.name}` : " terbit"}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-[24px] bg-soft px-6 py-16 text-center">
          <p className="t-h4">Belum ada berita di kategori ini.</p>
          <p className="t-body mx-auto mt-2 max-w-md text-subtle">
            Coba pilih kategori lain atau lihat seluruh arsip berita.
          </p>
          <div className="mt-6 flex justify-center">
            <PillLink href="/berita">Lihat semua berita</PillLink>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10">
            <ArticleCardFeatured article={list[0]} />
          </div>

          {list.length > 1 ? (
            <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {list.slice(1).map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : null}

          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-hairline-soft pt-6 sm:flex-row sm:items-center">
            <p className="t-caption text-subtle">
              Menampilkan {list.length} dari {articles.length} berita
            </p>
            <div className="flex items-center gap-1.5">
              <span
                aria-disabled="true"
                className="inline-flex h-9 items-center gap-1 rounded-full border border-hairline px-4 text-[13px] font-semibold text-faint"
              >
                <ChevronLeft className="size-3.5" />
                Sebelumnya
              </span>
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-canvas">
                1
              </span>
              <span
                aria-disabled="true"
                className="inline-flex h-9 items-center gap-1 rounded-full border border-hairline px-4 text-[13px] font-semibold text-faint"
              >
                Berikutnya
                <ChevronRight className="size-3.5" />
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "inline-flex h-9 shrink-0 items-center rounded-full bg-canvas px-4 text-[13px] font-semibold text-ink"
          : "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold text-subtle transition-colors hover:text-ink"
      }
    >
      {children}
    </Link>
  );
}
