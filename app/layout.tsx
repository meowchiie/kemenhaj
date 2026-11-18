import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
