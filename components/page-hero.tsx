import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="t-caption flex flex-wrap items-center gap-2 text-subtle">
      <Link href="/" className="transition-colors hover:text-ink">
        Beranda
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span aria-hidden="true" className="text-hairline">
            /
          </span>
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="wrap pt-12 pb-12 sm:pt-20 sm:pb-16">
      {crumbs ? (
        <div className="mb-8">
          <Breadcrumbs items={crumbs} />
        </div>
      ) : null}
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
        <div>
          {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
          <h1 className="t-h1 max-w-3xl text-balance">{title}</h1>
          {description ? (
            <p className="t-lead mt-6 max-w-2xl text-subtle">{description}</p>
          ) : null}
          {actions ? (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
          {children}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}
