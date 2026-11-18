"use client";

import { Trash2 } from "lucide-react";
import { deleteOfficialAction } from "@/app/admin/(panel)/pejabat/actions";
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

export default function DeleteOfficialButton({
  officialId,
  officialName,
}: {
  officialId: string;
  officialName: string;
}) {
  const formId = `delete-official-${officialId}`;

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="rounded-full">
              <Trash2 data-icon="inline-start" />
              Hapus pejabat
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {officialName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Data pejabat dan fotonya akan dihapus. Tindakan ini tidak dapat
              dibatalkan.
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

      <form id={formId} action={deleteOfficialAction} className="hidden">
        <input type="hidden" name="id" value={officialId} />
      </form>
    </>
  );
}
