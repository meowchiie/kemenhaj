"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Close, Mail, Phone } from "@/components/icons";
import { Tag } from "@/components/ui";
import type { Official } from "@/lib/content";

export default function OfficialsGrid({ officials }: { officials: Official[] }) {
  const [selected, setSelected] = useState<Official | null>(null);

  useEffect(() => {
    if (!selected) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {officials.map((official) => (
          <button
            key={official.id}
            type="button"
            onClick={() => setSelected(official)}
            className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-soft text-left"
          >
            <Image
              src={official.photo}
              alt={`Foto ${official.name}`}
              fill
              sizes="(min-width: 1280px) 270px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pt-16 pb-4 text-canvas">
              <p className="t-title leading-tight">{official.name}</p>
              <p className="t-caption mt-1 text-canvas/80">
                {official.position}
              </p>
            </div>
            <span className="absolute top-3 left-3">
              <Tag tone="overlay">{official.unit}</Tag>
            </span>
          </button>
        ))}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profil-pejabat-judul"
        >
          <button
            type="button"
            aria-label="Tutup detail pejabat"
            onClick={() => setSelected(null)}
            className="absolute inset-0 cursor-default"
          />
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[24px] bg-canvas p-6">
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-soft text-ink transition-colors hover:bg-hairline"
            >
              <Close className="size-4" />
            </button>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-soft">
              <Image
                src={selected.photo}
                alt={`Foto ${selected.name}`}
                fill
                sizes="400px"
                className="object-cover object-top grayscale"
              />
            </div>

            <p className="t-label mt-5 text-subtle">{selected.unit}</p>
            <h2 id="profil-pejabat-judul" className="t-h4 mt-2 pr-10">
              {selected.name}
            </h2>
            <p className="t-sm mt-1 text-subtle">{selected.position}</p>

            <dl className="mt-5 flex flex-col border-t border-hairline-soft">
              <div className="flex items-start justify-between gap-4 border-b border-hairline-soft py-3">
                <dt className="t-sm text-subtle">NIP</dt>
                <dd className="t-sm text-right font-semibold">{selected.nip}</dd>
              </div>
              <div className="py-3">
                <dt className="t-sm text-subtle">Tugas pokok</dt>
                <dd className="t-sm mt-1.5 leading-[1.6] text-ink-soft">
                  {selected.duties}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={
                  selected.contact.includes("@")
                    ? `mailto:${selected.contact}`
                    : `tel:${selected.contact.replace(/[^+\d]/g, "")}`
                }
                className="inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-semibold text-canvas transition-colors hover:bg-ink-soft"
              >
                {selected.contact.includes("@") ? (
                  <Mail className="size-3.5" />
                ) : (
                  <Phone className="size-3.5" />
                )}
                {selected.contact}
              </a>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex h-9 items-center rounded-full bg-soft px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-hairline"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
