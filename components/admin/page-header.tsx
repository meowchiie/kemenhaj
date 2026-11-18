import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export type AdminCrumb = { label: string; href?: string };

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: AdminCrumb[];
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {crumbs && crumbs.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
          >
            <Link href="/admin" className="hover:text-foreground">
              Dashboard
            </Link>
            {crumbs.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1">
                <ChevronRight className="size-3" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="flex items-center gap-2 text-xs font-semibold text-signal">
            <span className="inline-block size-1.5 rounded-full bg-gold" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
