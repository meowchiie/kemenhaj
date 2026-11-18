"use client";

import { Trash2 } from "lucide-react";
import { deleteGalleryAction } from "@/app/admin/(panel)/galeri/actions";
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

export default function DeleteGalleryButton({
  galleryId,
  galleryTitle,
}: {
  galleryId: string;
  galleryTitle: string;
}) {
  const formId = `delete-gallery-${galleryId}`;

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="rounded-full">
              <Trash2 data-icon="inline-start" />
              Hapus album
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {galleryTitle}?</AlertDialogTitle>
            <AlertDialogDescription>
              Seluruh foto dalam album ikut dihapus. Tindakan ini tidak dapat
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

      <form id={formId} action={deleteGalleryAction} className="hidden">
        <input type="hidden" name="id" value={galleryId} />
      </form>
    </>
  );
}
