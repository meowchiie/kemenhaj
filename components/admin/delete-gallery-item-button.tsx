"use client";

import { Trash2 } from "lucide-react";
import { deleteGalleryItemAction } from "@/app/admin/(panel)/galeri/actions";
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

export default function DeleteGalleryItemButton({
  itemId,
  galleryId,
}: {
  itemId: string;
  galleryId: string;
}) {
  const formId = `delete-gallery-item-${itemId}`;

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Hapus foto">
              <Trash2 />
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus foto ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Foto dihapus dari album dan penyimpanan bila tidak dipakai di
              tempat lain.
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

      <form id={formId} action={deleteGalleryItemAction} className="hidden">
        <input type="hidden" name="itemId" value={itemId} />
        <input type="hidden" name="galleryId" value={galleryId} />
      </form>
    </>
  );
}
