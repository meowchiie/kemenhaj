"use client";

import { Trash2 } from "lucide-react";
import { deleteServiceAction } from "@/app/admin/(panel)/layanan/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/admin/ui/alert-dialog";
import { Button } from "@/components/admin/ui/button";

export default function DeleteServiceButton({
  serviceId,
  serviceName,
}: {
  serviceId: string;
  serviceName: string;
}) {
  const formId = `delete-service-${serviceId}`;

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="rounded-full">
              <Trash2 data-icon="inline-start" />
              Hapus layanan
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {serviceName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Persyaratan dan langkah layanan ikut terhapus. Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              form={formId}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Ya, hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <form id={formId} action={deleteServiceAction} className="hidden">
        <input type="hidden" name="id" value={serviceId} />
      </form>
    </>
  );
}
