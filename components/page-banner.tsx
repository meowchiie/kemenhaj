import Image from "next/image";
import type { ReactNode } from "react";

export default function PageBanner({
  eyebrow,
  title,
  description,
  actions,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="wrap pt-6 sm:pt-8">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-espresso">
        <Image
          src={image}
          alt=""
          fill
          preload
          sizes="(min-width: 1152px) 1088px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/80 to-espresso/45 sm:bg-gradient-to-r sm:from-espresso/95 sm:via-espresso/75 sm:to-espresso/15" />
        <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="t-label flex items-center gap-2 text-canvas/75">
                <span className="inline-block size-1.5 rounded-full bg-gold" />
                {eyebrow}
              </p>
            ) : null}
            <h1 className="t-h1 mt-5 text-balance text-canvas">{title}</h1>
            {description ? (
              <p className="t-lead mt-5 max-w-xl text-canvas/80">
                {description}
              </p>
            ) : null}
            {actions ? (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {actions}
              </div>
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
