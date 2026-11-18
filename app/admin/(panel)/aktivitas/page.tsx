import { redirect } from "next/navigation";
import { History } from "lucide-react";
import AdminPageHeader from "@/components/admin/page-header";
import { Badge } from "@/components/admin/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { can, requireUser } from "@/lib/auth/permissions";
import { listAuditLogs } from "@/lib/data/audit";
import { formatDateTime } from "@/lib/format";

export const instant = false;

const actionLabels: Record<string, string> = {
  "auth.login": "Masuk",
  "service.create": "Tambah layanan",
  "service.update": "Ubah layanan",
  "service.delete": "Hapus layanan",
  "service.form.replace": "Ganti PDF",
};

export default async function AuditPage() {
  const user = await requireUser();

  if (!can(user, "audit:read")) redirect("/admin");

  const entries = await listAuditLogs(150);

  return (
    <>
      <AdminPageHeader
        eyebrow="Audit"
        title="Aktivitas pengguna"
        description="Catatan perubahan data layanan dan sesi masuk. Menyimpan 150 aktivitas terakhir."
        crumbs={[{ label: "Aktivitas" }]}
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead className="hidden md:table-cell">Ringkasan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDateTime(entry.createdAt)}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">
                    {entry.actorName ?? "Sistem"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.actorEmail ?? "—"}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {actionLabels[entry.action] ?? entry.action}
                  </Badge>
                </TableCell>
                <TableCell className="hidden max-w-md text-sm md:table-cell">
                  {entry.summary}
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  <History className="mx-auto mb-2 size-5" />
                  Belum ada aktivitas tercatat.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
