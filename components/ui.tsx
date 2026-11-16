import Link from "next/link";
import type { ReactNode } from "react";

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

type Variant = "primary" | "outline" | "soft" | "canvas" | "glass";
type Size = "sm" | "md" | "lg";

const pillBase =
  "inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap font-semibold transition-colors duration-200";

const pillVariants: Record<Variant, string> = {
  primary: "bg-ink text-canvas hover:bg-ink-soft",
  outline:
    "border border-hairline bg-canvas text-ink hover:border-ink hover:bg-soft",
  soft: "bg-soft text-ink hover:bg-hairline",
  canvas: "bg-canvas text-ink hover:bg-gold-soft",
  glass:
    "border border-canvas/35 bg-canvas/10 text-canvas backdrop-blur-sm hover:bg-canvas/20",
};

const pillSizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

export function PillLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  target,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      className={cn(pillBase, pillVariants[variant], pillSizes[size], className)}
    >
      {children}
    </Link>
  );
}

export function Pill({
  children,
  variant = "soft",
  size = "md",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <span
      className={cn(pillBase, pillVariants[variant], pillSizes[size], className)}
    >
      {children}
    </span>
  );
}

export function Tag({
  children,
  tone = "soft",
  className,
}: {
  children: ReactNode;
  tone?: "soft" | "accent" | "overlay";
  className?: string;
}) {
  const tones = {
    soft: "bg-soft text-ink",
    accent: "bg-accent text-canvas",
    overlay: "bg-[rgba(44,30,18,0.6)] text-canvas backdrop-blur-sm",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold leading-[1.33]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("t-label text-muted", className)}>
      <span className="mr-2 inline-block size-1.5 rounded-full bg-ink align-middle" />
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <h2 className="t-h2 text-balance">{title}</h2>
        {description ? (
          <p className="t-body mt-4 text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function IconTile({
  children,
  tone = "soft",
  className,
}: {
  children: ReactNode;
  tone?: "soft" | "ink" | "canvas";
  className?: string;
}) {
  const tones = {
    soft: "bg-soft text-ink",
    ink: "bg-ink text-canvas",
    canvas: "bg-canvas text-ink",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center rounded-[30%]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-hairline", className)} />;
}
