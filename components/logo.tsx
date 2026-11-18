import Image from "next/image";
import Link from "next/link";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      width={585}
      height={585}
      unoptimized
      className={className ?? "size-10"}
    />
  );
}

export default function Logo({
  tone = "ink",
  withWordmark = true,
  className,
  onClick,
}: {
  tone?: "ink" | "canvas";
  withWordmark?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const word = tone === "ink" ? "text-ink" : "text-canvas";

  return (
    <Link
      href="/"
      onClick={onClick}
      className={`flex items-center gap-2.5 ${className ?? ""}`}
      aria-label="Kemenhaj Pare — Beranda"
    >
      <LogoMark />
      {withWordmark ? (
        <span className={`t-link ${word}`}>
          Kemenhaj <span className="text-subtle">Pare</span>
        </span>
      ) : null}
    </Link>
  );
}
