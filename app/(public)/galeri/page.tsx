import { Suspense } from "react";
import { ArrowUpRight, Images } from "@/components/icons";
import GalleryBrowser from "@/components/gallery-browser";
import PageBanner from "@/components/page-banner";
import { PillLink } from "@/components/ui";
import { getPublicGalleries } from "@/lib/data/galleries";

export const metadata = {
  title: "Galeri",
  description:
    "Dokumentasi foto dan video kegiatan pelayanan haji dan umrah Kantor Kementerian Haji dan Umrah Kota Parepare.",
};

export default async function GaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ album?: string }>;
}) {
  const albums = await getPublicGalleries();

  return (
    <>
      <PageBanner
        eyebrow="Galeri multimedia"
        title="Dokumentasi kegiatan."
        description="Kumpulan foto dan video kegiatan pelayanan haji dan umrah, diarsipkan per album dan tahun kegiatan."
        image="/images/galeri-6.jpg"
        actions={
          <>
            <PillLink href="/berita" variant="canvas">
              Baca berita kegiatan
              <ArrowUpRight className="size-4" />
            </PillLink>
            <span className="t-caption inline-flex items-center gap-2 px-2 text-canvas/75">
              <Images className="size-4" />
              {albums.length} album terarsip
            </span>
          </>
        }
      />

      <section className="wrap pb-20">
        <Suspense
          fallback={<div className="h-96 animate-pulse rounded-[24px] bg-soft" />}
        >
          <GalleryContent searchParams={searchParams} albums={albums} />
        </Suspense>
        <p className="t-caption mt-10 max-w-2xl text-subtle">
          Seluruh dokumentasi dipublikasikan untuk kebutuhan transparansi dan
          akuntabilitas publik. Gambar ditampilkan dalam resolusi terkompresi
          agar tetap cepat diakses.
        </p>
      </section>
    </>
  );
}

async function GalleryContent({
  searchParams,
  albums,
}: {
  searchParams: Promise<{ album?: string }>;
  albums: Awaited<ReturnType<typeof getPublicGalleries>>;
}) {
  const { album } = await searchParams;
  return <GalleryBrowser albums={albums} initialSlug={album} />;
}
