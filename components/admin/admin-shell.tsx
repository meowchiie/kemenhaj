"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  UserRound,
  X,
} from "lucide-react";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Separator } from "@/components/admin/ui/separator";
import type { SessionUser } from "@/lib/auth/session";
import { logoutAction } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

const roleLabels: Record<SessionUser["role"], string> = {
  superadmin: "Super admin",
  editor: "Editor",
  staff: "Staff layanan",
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/admin/layanan", label: "Layanan", icon: FileText },
    ...(user.role === "editor" || user.role === "superadmin"
      ? [{ href: "/admin/berita", label: "Berita", icon: Newspaper }]
      : []),
    ...(user.role === "superadmin"
      ? [
          { href: "/admin/pejabat", label: "Pejabat", icon: UserRound },
          { href: "/admin/aktivitas", label: "Aktivitas", icon: History },
        ]
      : []),
  ];

  const nav = (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={isActive(pathname, link.href) ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
              isActive(pathname, link.href)
                ? "bg-ink text-canvas"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarBody = (
    <div className="flex h-full flex-col gap-6">
      <Link
        href="/admin"
        onClick={() => setOpen(false)}
        className="flex items-center gap-2.5 px-1"
      >
        <span className="grid size-9 place-items-center rounded-[30%] bg-ink text-canvas">
          <span className="text-sm font-bold">K</span>
        </span>
        <span>
          <span className="block text-sm font-semibold leading-tight">
            Kemenhaj Pare
          </span>
          <span className="block text-xs text-muted-foreground">
            Dashboard internal
          </span>
        </span>
      </Link>

      {nav}

      <div className="mt-auto flex flex-col gap-3">
        <Separator />
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-4" />
          Lihat portal publik
        </Link>
        <div className="rounded-2xl bg-muted p-4">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {user.email}
          </p>
          <Badge variant="outline" className="mt-2 bg-background">
            {roleLabels[user.role]}
          </Badge>
          <form action={logoutAction} className="mt-3">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full rounded-full"
            >
              <LogOut data-icon="inline-start" />
              Keluar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-border bg-sidebar p-4 lg:block">
        {sidebarBody}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-border bg-sidebar p-4">
            <div className="mb-2 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Tutup menu"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            {sidebarBody}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Button
            variant="outline"
            size="icon"
            aria-label="Buka menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
          <span className="text-sm font-semibold">Dashboard Kemenhaj</span>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 sm:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
