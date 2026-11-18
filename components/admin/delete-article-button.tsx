"use client";

import { Trash2 } from "lucide-react";
import { deleteArticleAction } from "@/app/admin/(panel)/berita/actions";
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

export default function DeleteArticleButton({
  articleId,
  articleTitle,
}: {
  articleId: string;
  articleTitle: string;
}) {
  const formId = `delete-article-${articleId}`;

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="rounded-full">
              <Trash2 data-icon="inline-start" />
              Hapus berita
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {articleTitle}?</AlertDialogTitle>
            <AlertDialogDescription>
              Berita beserta gambar utamanya akan dihapus. Tindakan ini tidak
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

      <form id={formId} action={deleteArticleAction} className="hidden">
        <input type="hidden" name="id" value={articleId} />
      </form>
    </>
  );
}
