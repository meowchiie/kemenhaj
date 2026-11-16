import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kemenhaj Pare — Portal Informasi Publik",
    template: "%s — Kemenhaj Pare",
  },
  description:
    "Portal informasi publik Kantor Kementerian Haji dan Umrah Kota Parepare: persyaratan layanan, berita, profil pejabat, dan galeri kegiatan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-canvas"
        >
          Lompat ke konten
        </a>
        <SiteNav />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
