export type Category = {
  slug: string;
  name: string;
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  views: number;
  author: string;
  image: string;
  body: Block[];
};

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: "register" | "transfer" | "cancel";
  duration: string;
  cost: string;
  updatedAt: string;
  requirements: string[];
  steps: { title: string; detail: string }[];
  form: { label: string; file: string; size: string };
  note: string;
};

export type Official = {
  id: string;
  name: string;
  nip: string;
  position: string;
  unit: string;
  order: number;
  photo: string;
  duties: string;
  contact: string;
};

export type GalleryItem = {
  src: string;
  caption: string;
  type: "image" | "video";
};

export type Album = {
  slug: string;
  title: string;
  description: string;
  year: number;
  date: string;
  cover: string;
  items: GalleryItem[];
};

export const categories: Category[] = [
  { slug: "pendaftaran", name: "Pendaftaran" },
  { slug: "pelimpahan", name: "Pelimpahan" },
  { slug: "pembatalan", name: "Pembatalan" },
  { slug: "kegiatan", name: "Kegiatan" },
  { slug: "pengumuman", name: "Pengumuman" },
];

export const site = {
  name: "Kemenhaj Pare",
  longName: "Kementerian Haji dan Umrah Kota Parepare",
  address: "Jl. H. Agus Salim No. 12, Kota Parepare, Sulawesi Selatan 91111",
  phone: "(0421) 21345",
  email: "info@kemenhajpare.go.id",
  hours: "Senin–Jumat, 08.00–15.00 WITA",
  maps: "https://maps.google.com/?q=Parepare",
};

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatViews(views: number): string {
  return new Intl.NumberFormat("id-ID").format(views);
}
