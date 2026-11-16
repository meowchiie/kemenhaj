"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Close,
  Images,
  Play,
} from "@/components/icons";
import { Tag } from "@/components/ui";
import { formatDate, type Album } from "@/lib/content";

export default function GalleryBrowser({
  albums,
  initialSlug,
}: {
  albums: Album[];
  initialSlug?: string;
}) {
  const years = useMemo(
    () => Array.from(new Set(albums.map((album) => album.year))).sort((a, b) => b - a),
    [albums],
  );
  const [year, setYear] = useState<number | "all">("all");
  const [active, setActive] = useState<Album | null>(
    () => albums.find((album) => album.slug === initialSlug) ?? null,
  );
  const [index, setIndex] = useState(0);

  const visible = year === "all" ? albums : albums.filter((album) => album.year === year);

  useEffect(() => {
    if (!active) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") {
        setIndex((value) => (value + 1) % active!.items.length);
      }
      if (event.key === "ArrowLeft") {
        setIndex((value) => (value - 1 + active!.items.length) % active!.items.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [active]);

  function openAlbum(album: Album) {
    setActive(album);
    setIndex(0);
  }

  const current = active?.items[index];

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-hairline-soft pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex gap-1 overflow-x-auto rounded-full bg-soft p-1">
          <button
            type="button"
            onClick={() => setYear("all")}
            className={
              year === "all"
                ? "inline-flex h-9 shrink-0 items-center rounded-full bg-canvas px-4 text-[13px] font-semibold text-ink"
                : "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
            }
          >
            Semua tahun
          </button>
          {years.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setYear(item)}
              className={
                year === item
                  ? "inline-flex h-9 shrink-0 items-center rounded-full bg-canvas px-4 text-[13px] font-semibold text-ink"
                  : "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              }
            >
              {item}
            </button>
          ))}
        </div>
        <p className="t-caption shrink-0 text-muted">
          {visible.length} album ·{" "}
          {visible.reduce((total, album) => total + album.items.length, 0)} media
        </p>
      </div>

      <div className="mt-8 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((album) => (
          <button
            key={album.slug}
            type="button"
            onClick={() => openAlbum(album)}
            className="group flex flex-col text-left"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-soft">
              <Image
                src={album.cover}
                alt=""
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
              />
              <span className="absolute top-3 left-3">
                <Tag tone="overlay">{album.year}</Tag>
              </span>
              <span className="absolute bottom-3 left-3">
                <Tag tone="overlay">
                  <Images className="size-3.5" />
                  {album.items.length} media
                </Tag>
              </span>
            </div>
            <h2 className="t-title mt-4 decoration-1 underline-offset-4 group-hover:underline">
              {album.title}
            </h2>
            <p className="t-caption mt-1 flex items-center gap-1.5 text-muted">
              <Calendar className="size-3.5" />
              {formatDate(album.date)}
            </p>
            <p className="t-sm mt-2 line-clamp-2 text-muted">{album.description}</p>
          </button>
        ))}
      </div>

      {active && current ? (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-ink/95 p-3 text-canvas backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-judul"
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p id="lightbox-judul" className="t-title truncate">
                {active.title}
              </p>
              <p className="t-caption mt-0.5 text-canvas/60">
                {formatDate(active.date)} · {index + 1} dari {active.items.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Tutup galeri"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-canvas/10 text-canvas transition-colors hover:bg-canvas/20"
            >
              <Close className="size-5" />
            </button>
          </div>

          <div className="relative mx-auto mt-4 flex w-full max-w-6xl flex-1 items-center justify-center">
            <button
              type="button"
              onClick={() =>
                setIndex((value) => (value - 1 + active.items.length) % active.items.length)
              }
              aria-label="Media sebelumnya"
              className="absolute left-0 z-10 grid size-10 place-items-center rounded-full bg-canvas/10 text-canvas transition-colors hover:bg-canvas/20 sm:size-12"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="relative h-[58vh] w-full max-w-4xl sm:h-[64vh]">
              <Image
                src={current.src}
                alt={current.caption}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-contain"
                priority
              />
            </div>

            <button
              type="button"
              onClick={() => setIndex((value) => (value + 1) % active.items.length)}
              aria-label="Media berikutnya"
              className="absolute right-0 z-10 grid size-10 place-items-center rounded-full bg-canvas/10 text-canvas transition-colors hover:bg-canvas/20 sm:size-12"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="mx-auto mt-4 w-full max-w-6xl">
            <p className="t-sm text-center text-canvas/80">{current.caption}</p>
            <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-1">
              {active.items.map((item, itemIndex) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setIndex(itemIndex)}
                  aria-label={`Tampilkan media ${itemIndex + 1}`}
                  aria-current={itemIndex === index}
                  className={
                    itemIndex === index
                      ? "relative size-14 shrink-0 overflow-hidden rounded-[8px] ring-2 ring-canvas"
                      : "relative size-14 shrink-0 overflow-hidden rounded-[8px] opacity-50 transition-opacity hover:opacity-100"
                  }
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  {item.type === "video" ? (
                    <span className="absolute inset-0 grid place-items-center bg-ink/40">
                      <Play className="size-4 text-canvas" />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
