import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/page-header";
import PasswordForm from "@/components/admin/password-form";
import ProfileForm from "@/components/admin/profile-form";
import { Badge } from "@/components/admin/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { requireUser } from "@/lib/auth/permissions";
import { getProfile } from "@/lib/data/profile";
import { formatDateTime } from "@/lib/format";

export const instant = false;

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const profile = await getProfile(sessionUser.id);

  if (!profile) redirect("/admin/login");

  return (
    <>
      <AdminPageHeader
        eyebrow="Akun"
        title="Profil saya"
        description="Perbarui identitas dan password akun dashboard Anda sendiri."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="flex flex-col gap-6">
          <ProfileForm name={profile.name} email={profile.email} />
          <PasswordForm />
        </div>

        <aside className="lg:sticky lg:top-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detail akun</CardTitle>
              <CardDescription>
                Informasi ini tidak dapat diubah dari halaman profil.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Peran
                </p>
                <Badge variant="secondary" className="mt-1.5">
                  Super admin
                </Badge>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Dibuat
                </p>
                <p className="mt-0.5">{formatDateTime(profile.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Masuk terakhir
                </p>
                <p className="mt-0.5">
                  {profile.lastLoginAt
                    ? formatDateTime(profile.lastLoginAt)
                    : "Belum pernah masuk"}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
