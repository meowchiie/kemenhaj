import { ArrowRight, Search } from "@/components/icons";
import { PillLink, Tag } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-center py-24 text-center sm:py-32">
      <Tag>404</Tag>
      <h1 className="t-h1 mt-6 max-w-xl text-balance">
        Halaman tidak ditemukan.
      </h1>
      <p className="t-lead mt-4 max-w-md text-subtle">
        Tautan yang Anda buka mungkin sudah dipindahkan. Coba kembali ke beranda
        atau telusuri layanan yang tersedia.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <PillLink href="/" size="lg">
          Kembali ke beranda
          <ArrowRight className="size-4" />
        </PillLink>
        <PillLink href="/pencarian" variant="outline" size="lg">
          <Search className="size-4" />
          Cari informasi
        </PillLink>
      </div>
    </section>
  );
}
