import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import CopyLink from "@/components/copy-link";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  Phone,
} from "@/components/icons";
import PageHero, { Breadcrumbs } from "@/components/page-hero";
import { PillLink, Tag } from "@/components/ui";
import {
  formatDate,
  formatViews,
  site,
  type Block,
} from "@/lib/content";
import {
  getPublicArticle,
  getPublicArticles,
  relatedArticles,
} from "@/lib/data/articles";
import { getPublicServices } from "@/lib/data/services";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublicArticle(slug);
  if (!article) return { title: "Berita tidak ditemukan" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "h2") {
    return <h2 className="t-h4 mt-10 mb-3">{block.text}</h2>;
  }
  if (block.type === "ul") {
    return (
      <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-ink-soft">
        {block.items.map((item) => (
          <li key={item} className="t-body leading-[1.6]">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="t-title my-8 rounded-[16px] bg-soft px-6 py-5">
        {block.text}
      </blockquote>
    );
  }
  return (
    <p className="t-body mt-4 leading-[1.65] text-ink-soft">{block.text}</p>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, articles, services] = await Promise.all([
    getPublicArticle(slug),
    getPublicArticles(),
    getPublicServices(),
  ]);
  if (!article) notFound();

  const related = relatedArticles(articles, article, 3);
  const shareUrl = `https://kemenhajpare.go.id/berita/${article.slug}`;
  const shareText = encodeURIComponent(article.title);

  return (
    <>
      <div className="wrap pt-10 sm:pt-14">
        <Breadcrumbs
          items={[
            { label: "Berita", href: "/berita" },
            { label: article.category },
            { label: article.title },
          ]}
        />
      </div>

      <PageHero
        eyebrow={article.category}
        title={article.title}
        description={article.excerpt}
        actions={
          <PillLink href="/layanan" size="md">
            Lihat layanan terkait
            <ArrowRight className="size-4" />
          </PillLink>
        }
      >
        <div className="t-caption mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-subtle">
          <span className="font-semibold text-ink">{article.author}</span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(article.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {article.readMinutes} menit baca
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5" />
            {formatViews(article.views)} kali dibaca
          </span>
        </div>
      </PageHero>

      <div className="wrap">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] bg-soft">
          <Image
            src={article.image}
            alt={article.title}
            fill
            preload
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="wrap mt-12 grid gap-12 pb-20 lg:grid-cols-[1fr_320px]">
        <article className="max-w-3xl">
          {article.body.map((block, index) => (
            <BlockView key={`${block.type}-${index}`} block={block} />
          ))}

          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-hairline-soft pt-6">
            <span className="t-caption mr-2 text-subtle">Bagikan:</span>
            <a
              href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-full bg-soft px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-hairline"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-full bg-soft px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-hairline"
            >
              Facebook
            </a>
            <a
              href={`https://x.com/intent/post?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-full bg-soft px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-hairline"
            >
              X
            </a>
            <CopyLink />
          </div>
        </article>

        <aside className="flex flex-col gap-3 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[24px] bg-soft p-6">
            <p className="t-label text-subtle">Persyaratan layanan</p>
            <p className="t-title mt-3">
              Siapkan dokumen sebelum datang ke kantor.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/layanan/${service.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-[16px] bg-canvas px-4 py-3"
                  >
                    <span className="flex items-center gap-2.5">
                      <FileText className="size-4 text-subtle" />
                      <span className="t-sm font-semibold">
                        {service.shortName}
                      </span>
                    </span>
                    <ArrowUpRight className="size-3.5 text-subtle group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
            {/* <div className="mt-4">
              <a
                href="/dokumen/formulir-pelimpahan-porsi.pdf"
                className="inline-flex h-9 items-center gap-2 rounded-full bg-canvas px-4 text-[13px] font-semibold text-ink"
              >
                <Download className="size-3.5" />
                Unduh formulir
              </a>
            </div> */}
          </div>

          <div className="rounded-[24px] border border-hairline-soft p-6">
            <p className="t-label text-subtle">Butuh bantuan?</p>
            <p className="t-body mt-3 text-subtle">
              Hubungi loket terpadu pada jam layanan.
            </p>
            <a
              href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
              className="t-link mt-4 inline-flex items-center gap-2 text-ink"
            >
              <Phone className="size-4" />
              {site.phone}
            </a>
            <p className="t-caption mt-2 text-subtle">{site.hours}</p>
          </div>
        </aside>
      </div>

      <section className="wrap pb-20">
        <div className="flex items-end justify-between gap-6 border-t border-hairline-soft pt-10">
          <div>
            <Tag>Berita terkait</Tag>
            <h2 className="t-h3 mt-4">Baca juga.</h2>
          </div>
          <PillLink href="/berita" variant="soft" size="sm">
            Semua berita
            <ArrowUpRight className="size-3.5" />
          </PillLink>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ArticleCard key={item.slug} article={item} />
          ))}
        </div>
      </section>
    </>
  );
}
