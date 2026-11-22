"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  saveArticleAction,
  type ArticleFormState,
} from "@/app/admin/(panel)/berita/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/admin/ui/alert";
import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/admin/ui/field";
import { Input } from "@/components/admin/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { Spinner } from "@/components/admin/ui/spinner";
import { Switch } from "@/components/admin/ui/switch";
import { Textarea } from "@/components/admin/ui/textarea";
import { categories, type Block } from "@/lib/content";
import type { AdminArticle } from "@/lib/data/articles";

const initialState: ArticleFormState = { ok: false };

type UiBlock = {
  type: Block["type"];
  text: string;
};

const blockLabels: Record<Block["type"], string> = {
  p: "Paragraf",
  h2: "Subjudul",
  ul: "Daftar poin",
  quote: "Kutipan",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toUiBlocks(body: Block[]): UiBlock[] {
  return body.map((block) => ({
    type: block.type,
    text: block.type === "ul" ? block.items.join("\n") : block.text,
  }));
}

function toInputBlocks(blocks: UiBlock[]): Block[] {
  return blocks
    .map((block): Block | null => {
      if (block.type === "ul") {
        const items = block.text
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
        return items.length > 0 ? { type: "ul", items } : null;
      }

      const text = block.text.trim();
      return text ? { type: block.type, text } : null;
    })
    .filter((block): block is Block => block !== null);
}

export default function ArticleForm({
  article,
}: {
  article?: AdminArticle;
}) {
  const [state, formAction, pending] = useActionState(
    saveArticleAction,
    initialState,
  );
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [category, setCategory] = useState(article?.category ?? "");
  const [isPublished, setIsPublished] = useState(article?.isPublished ?? false);
  const [blocks, setBlocks] = useState<UiBlock[]>(
    article && article.body.length > 0
      ? toUiBlocks(article.body)
      : [{ type: "p", text: "" }],
  );

  const errors = state.fieldErrors ?? {};
  const bodyJson = JSON.stringify(toInputBlocks(blocks));

  function updateBlock(index: number, patch: Partial<UiBlock>) {
    setBlocks((current) =>
      current.map((block, blockIndex) =>
        blockIndex === index ? { ...block, ...patch } : block,
      ),
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      <input type="hidden" name="body" value={bodyJson} />

      {state.message ? (
        <Alert variant={state.ok ? "default" : "destructive"}>
          <AlertTitle>
            {state.ok ? "Tersimpan" : "Tidak dapat menyimpan"}
          </AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Identitas berita</CardTitle>
          <CardDescription>
            Judul, slug, dan ringkasan yang tampil di portal publik.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="title">Judul berita</FieldLabel>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(event) => {
                  const value = event.target.value;
                  setTitle(value);
                  if (!slugTouched) setSlug(slugify(value));
                }}
                required
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title ? (
                <FieldDescription className="text-destructive">
                  {errors.title}
                </FieldDescription>
              ) : null}
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.slug)}>
                <FieldLabel htmlFor="slug">Slug URL</FieldLabel>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(event) => {
                    setSlug(event.target.value);
                    setSlugTouched(true);
                  }}
                  required
                  aria-invalid={Boolean(errors.slug)}
                />
                <FieldDescription>
                  Huruf kecil dan tanda hubung. Contoh: kuota-haji-2027.
                </FieldDescription>
              </Field>

              <Field data-invalid={Boolean(errors.category)}>
                <FieldLabel htmlFor="category">Kategori</FieldLabel>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value ?? "")}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((item) => (
                        <SelectItem key={item.slug} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input type="hidden" name="category" value={category} />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.excerpt)}>
              <FieldLabel htmlFor="excerpt">Ringkasan</FieldLabel>
              <Textarea
                id="excerpt"
                name="excerpt"
                defaultValue={article?.excerpt ?? ""}
                rows={3}
                required
                aria-invalid={Boolean(errors.excerpt)}
              />
              <FieldDescription>
                Tampil di kartu berita dan hasil pencarian.
              </FieldDescription>
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field data-invalid={Boolean(errors.author)}>
                <FieldLabel htmlFor="author">Penulis</FieldLabel>
                <Input
                  id="author"
                  name="author"
                  defaultValue={article?.author ?? ""}
                  required
                  aria-invalid={Boolean(errors.author)}
                />
              </Field>

              <Field data-invalid={Boolean(errors.publishedAt)}>
                <FieldLabel htmlFor="publishedAt">Tanggal terbit</FieldLabel>
                <Input
                  id="publishedAt"
                  name="publishedAt"
                  type="date"
                  defaultValue={article?.date ?? ""}
                  required
                  aria-invalid={Boolean(errors.publishedAt)}
                />
              </Field>

              <Field orientation="horizontal" className="items-center">
                <div className="flex flex-1 flex-col gap-1">
                  <FieldLabel htmlFor="published">Terbitkan</FieldLabel>
                  <FieldDescription>
                    Draf tidak tampil di portal publik.
                  </FieldDescription>
                </div>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={(checked) =>
                    setIsPublished(Boolean(checked))
                  }
                />
                <input
                  type="hidden"
                  name="isPublished"
                  value={isPublished ? "on" : "off"}
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Isi berita</CardTitle>
          <CardDescription>
            Susun isi dari blok paragraf, subjudul, daftar poin, atau kutipan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {blocks.map((block, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3"
            >
              <div className="flex items-center gap-2">
                <Select
                  value={block.type}
                  onValueChange={(value) =>
                    updateBlock(index, {
                      type: (value ?? "p") as Block["type"],
                    })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {(Object.keys(blockLabels) as Block["type"][]).map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {blockLabels[type]}
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  aria-label={`Hapus blok ${index + 1}`}
                  disabled={blocks.length === 1}
                  onClick={() =>
                    setBlocks((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <Trash2 />
                </Button>
              </div>
              <Textarea
                value={block.text}
                onChange={(event) =>
                  updateBlock(index, { text: event.target.value })
                }
                rows={block.type === "h2" ? 1 : 4}
                placeholder={
                  block.type === "ul"
                    ? "Satu poin per baris"
                    : block.type === "h2"
                      ? "Teks subjudul"
                      : "Tulis isi di sini"
                }
                aria-label={`Isi blok ${index + 1}`}
              />
            </div>
          ))}
          {errors.body ? (
            <p className="text-xs text-destructive">{errors.body}</p>
          ) : null}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                setBlocks((current) => [...current, { type: "p", text: "" }])
              }
            >
              <Plus data-icon="inline-start" />
              Tambah blok
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="rounded-full"
        >
          {pending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Save data-icon="inline-start" />
          )}
          {pending ? "Menyimpan…" : article ? "Simpan perubahan" : "Simpan berita"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full"
          render={<Link href="/admin/berita" />}
        >
          Kembali ke daftar
        </Button>
      </div>
    </form>
  );
}
