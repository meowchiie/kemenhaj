import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
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
    </div>
  );
}
