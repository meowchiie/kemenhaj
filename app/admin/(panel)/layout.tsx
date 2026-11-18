import AdminShell from "@/components/admin/admin-shell";
import { requireUser } from "@/lib/auth/permissions";

export const instant = false;

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
