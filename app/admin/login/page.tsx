import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth/session";
import LoginForm from "./login-form";

export const metadata = {
  title: "Masuk dashboard",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ lanjut?: string }>;
}) {
  const user = await getCurrentUser();

  if (user) redirect("/admin");

  const { lanjut } = await searchParams;
  const next =
    lanjut && lanjut.startsWith("/admin") && !lanjut.startsWith("//")
      ? lanjut
      : "/admin";

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden flex-col justify-between bg-espresso p-10 text-canvas lg:flex xl:p-14">
        <div className="flex items-center gap-3">
          <LogoMark className="size-11 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Kemenhaj Pare</p>
            <p className="text-xs text-canvas/60">Dashboard internal</p>
          </div>
        </div>

        <div className="max-w-md">
          <p className="flex items-center gap-2 text-xs font-semibold text-gold">
            <span className="inline-block size-1.5 rounded-full bg-gold" />
            Ruang kerja petugas
          </p>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight">
            Kelola informasi layanan haji dan umrah dalam satu tempat.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-canvas/70">
            Perbarui persyaratan, alur proses, dan formulir PDF. Perubahan
            langsung tampil di portal publik setelah disimpan.
          </p>
        </div>

        <p className="text-xs text-canvas/50">
          Akses terbatas untuk pegawai Kantor Kementerian Haji dan Umrah Kota
          Parepare.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali ke portal
          </Link>

          <div className="mt-8 flex items-center gap-3 lg:hidden">
            <LogoMark className="size-10 shrink-0" />
            <p className="text-sm font-semibold">Kemenhaj Pare</p>
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Masuk dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gunakan akun dinas yang diberikan administrator.
          </p>

          <div className="mt-8">
            <LoginForm next={next} />
          </div>
        </div>
      </section>
    </main>
  );
}
