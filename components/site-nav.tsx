"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Close, Menu, Search } from "@/components/icons";
import Logo from "@/components/logo";
import { cn, PillLink } from "@/components/ui";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/berita", label: "Berita" },
  { href: "/layanan", label: "Layanan" },
  { href: "/profil", label: "Profil" },
  { href: "/galeri", label: "Galeri" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-3 z-50 px-3 sm:top-4 sm:px-5">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex w-full max-w-6xl items-center gap-2 rounded-full bg-soft/95 p-1.5 pl-3 backdrop-blur-md sm:pl-4"
      >
        <Logo onClick={() => setOpen(false)} />

        <div className="ml-4 hidden items-center gap-0.5 lg:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors",
                  active
                    ? "bg-canvas text-ink"
                    : "text-subtle hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <form
            action="/pencarian"
            className="hidden items-center gap-2 rounded-full bg-canvas px-3.5 py-2 md:flex"
            role="search"
          >
            <Search className="size-4 text-subtle" />
            <input
              type="search"
              name="q"
              placeholder="Cari informasi"
              aria-label="Cari informasi di portal"
              className="w-32 bg-transparent text-[13px] text-ink outline-none placeholder:text-faint focus:w-40"
            />
          </form>

          <Link
            href="/pencarian"
            aria-label="Cari informasi"
            className="grid size-10 place-items-center rounded-full bg-canvas text-ink md:hidden"
          >
            <Search className="size-4" />
          </Link>

          <PillLink href="/layanan" size="sm" className="hidden sm:inline-flex">
            Layanan
          </PillLink>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="grid size-10 place-items-center rounded-full bg-canvas text-ink lg:hidden"
          >
            {open ? <Close className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="menu-mobile"
          className="mx-auto mt-2 w-full max-w-6xl rounded-[24px] border border-hairline bg-canvas p-3 lg:hidden"
        >
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-full px-4 py-3 text-[15px] font-semibold",
                  isActive(pathname, link.href)
                    ? "bg-soft text-ink"
                    : "text-subtle",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <form
            action="/pencarian"
            role="search"
            className="mt-2 flex items-center gap-2 rounded-full bg-field px-4 py-3"
          >
            <Search className="size-4 text-subtle" />
            <input
              type="search"
              name="q"
              placeholder="Cari berita, syarat, galeri"
              aria-label="Cari informasi di portal"
              className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
            />
          </form>
        </div>
      ) : null}
    </header>
  );
}
