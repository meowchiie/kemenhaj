import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye } from "@/components/icons";
import { Pill, Tag } from "@/components/ui";
import { formatDate, formatViews, type Article } from "@/lib/content";

export function ArticleCard({
  article,
  priority = false,
}: {
  article: Article;
  priority?: boolean;
}) {
  return (
    <Link href={`/berita/${article.slug}`} className="group flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-soft">
        <Image
          src={article.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3">
          <Tag tone="overlay">{article.category}</Tag>
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <p className="t-caption flex items-center gap-2 text-subtle">
          <Calendar className="size-3.5" />
          {formatDate(article.date)}
          <span className="text-hairline">•</span>
          {article.readMinutes} menit baca
        </p>
        <h3 className="t-title text-balance decoration-1 underline-offset-4 group-hover:underline">
          {article.title}
        </h3>
        <p className="t-sm line-clamp-2 text-subtle">{article.excerpt}</p>
      </div>
    </Link>
  );
}

export function ArticleCardFeatured({ article }: { article: Article }) {
  return (
    <Link
      href={`/berita/${article.slug}`}
      className="group grid gap-6 rounded-[24px] border border-hairline-soft p-3 md:grid-cols-2 md:p-4"
    >
      <div className="relative aspect-[16/11] overflow-hidden rounded-[16px] bg-soft">
        <Image
          src={article.image}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 560px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-col justify-center gap-4 px-2 pb-4 md:px-4">
        <div className="flex items-center gap-2">
          <Tag>{article.category}</Tag>
          <Tag>Pilihan editor</Tag>
        </div>
        <h2 className="t-h3 text-balance">{article.title}</h2>
        <p className="t-body line-clamp-3 text-subtle">{article.excerpt}</p>
        <div className="t-caption flex flex-wrap items-center gap-x-3 gap-y-1 text-subtle">
          <span>{article.author}</span>
          <span className="text-hairline">•</span>
          <span>{formatDate(article.date)}</span>
          <span className="text-hairline">•</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" />
            {formatViews(article.views)} kali dibaca
          </span>
        </div>
        <div className="pt-1">
          <Pill variant="primary" size="sm">
            Baca artikel
          </Pill>
        </div>
      </div>
    </Link>
  );
}

export function ArticleRow({ article }: { article: Article }) {
  return (
    <Link
      href={`/berita/${article.slug}`}
      className="group flex items-start gap-4 border-b border-hairline-soft pb-5 last:border-none last:pb-0"
    >
      <div className="relative size-24 shrink-0 overflow-hidden rounded-[16px] bg-soft sm:size-28">
        <Image
          src={article.image}
          alt=""
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0">
        <p className="t-caption flex flex-wrap items-center gap-2 text-subtle">
          <span className="font-semibold text-ink">{article.category}</span>
          <span className="text-hairline">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {article.readMinutes} menit
          </span>
          <span className="hidden text-hairline sm:inline">•</span>
          <span className="hidden sm:inline">{formatDate(article.date)}</span>
        </p>
        <h3 className="t-title mt-1.5 line-clamp-2 decoration-1 underline-offset-4 group-hover:underline">
          {article.title}
        </h3>
        <p className="t-sm mt-1.5 line-clamp-1 text-subtle">{article.excerpt}</p>
      </div>
    </Link>
  );
}
