"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "@/components/icons";

export type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  image: string;
};

const AUTOPLAY_MS = 6500;

export default function HomeHeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (!playing || hovering || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((value) => (value + 1) % count);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [playing, hovering, count]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  }

  if (count === 0) return null;

  const current = slides[index];

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Sorotan portal"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHovering(false);
        }
      }}
      onKeyDown={onKeyDown}
      className="overflow-hidden rounded-[32px] bg-espresso"
    >
      <div
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.href}
            aria-hidden={slideIndex !== index}
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} dari ${count}`}
            className="relative w-full shrink-0"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4]">
              <Image
                src={slide.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                preload={slideIndex === 0}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <p className="t-label flex items-center gap-2 text-gold">
                  <span className="inline-block size-1.5 rounded-full bg-gold" />
                  {slide.eyebrow}
                </p>
                <h2 className="t-h3 mt-2 line-clamp-2 max-w-md text-balance text-canvas">
                  {slide.title}
                </h2>
                <p className="t-sm mt-2 line-clamp-2 max-w-sm text-canvas/75">
                  {slide.description}
                </p>
                <Link
                  href={slide.href}
                  tabIndex={slideIndex === index ? 0 : -1}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-canvas px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-gold-soft"
                >
                  {slide.cta}
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 bg-espresso px-4 py-3">
        <div className="flex items-center gap-1">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.href}
              type="button"
              onClick={() => go(slideIndex)}
              aria-label={`Tampilkan sorotan ${slideIndex + 1}: ${slide.title}`}
              aria-current={slideIndex === index}
              className="grid h-6 place-items-center px-0.5"
            >
              <span
                className={
                  slideIndex === index
                    ? "block h-1.5 w-5 rounded-full bg-gold"
                    : "block size-1.5 rounded-full bg-canvas/40 transition-colors hover:bg-canvas/70"
                }
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="t-caption mr-1 text-canvas/60">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Sorotan sebelumnya"
            className="grid size-8 place-items-center rounded-full bg-canvas/10 text-canvas transition-colors hover:bg-canvas/20"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Sorotan berikutnya"
            className="grid size-8 place-items-center rounded-full bg-canvas/10 text-canvas transition-colors hover:bg-canvas/20"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-label={
              playing ? "Jeda sorotan otomatis" : "Putar sorotan otomatis"
            }
            className="grid size-8 place-items-center rounded-full bg-canvas/10 text-canvas transition-colors hover:bg-canvas/20"
          >
            {playing ? (
              <Pause className="size-3.5" />
            ) : (
              <Play className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Sorotan {index + 1} dari {count}: {current.title}
      </p>
    </div>
  );
}
