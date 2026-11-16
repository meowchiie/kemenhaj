import Link from "next/link";

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
  const squircle =
    tone === "ink" ? "bg-ink text-canvas" : "bg-canvas text-ink";
  const word = tone === "ink" ? "text-ink" : "text-canvas";

  return (
    <Link
      href="/"
      onClick={onClick}
      className={`flex items-center gap-2.5 ${className ?? ""}`}
      aria-label="Kemenhaj Pare — Beranda"
    >
      <span
        className={`grid size-9 place-items-center rounded-[30%] ${squircle}`}
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            d="M14.8 5.4a6.6 6.6 0 1 0 3.8 11.9 5.3 5.3 0 0 1-3.8-11.9Z"
            fill="currentColor"
          />
          <path
            d="m17.6 4.6.5 1.2 1.3.1-1 0.8.3 1.3-1.1-.7-1.1.7.3-1.3-1-.8 1.3-.1Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {withWordmark ? (
        <span className={`t-link ${word}`}>
          Kemenhaj <span className="text-muted">Pare</span>
        </span>
      ) : null}
    </Link>
  );
}
