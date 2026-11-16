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

const body = (intro: string, heading: string, points: string[], closing: string): Block[] => [
  { type: "p", text: intro },
  { type: "h2", text: heading },
  { type: "ul", items: points },
  { type: "p", text: closing },
];

export const articles: Article[] = [
  {
    slug: "pendaftaran-haji-reguler-2027-dibuka",
    title: "Pendaftaran haji reguler 2027 dibuka, ini tahapan yang perlu diketahui",
    excerpt:
      "Pembukaan porsi haji reguler tahun 2027 sudah dimulai. Calon jemaah diimbau menyiapkan dokumen sebelum datang ke kantor.",
    category: "Pendaftaran",
    date: "2026-11-12",
    readMinutes: 4,
    views: 1842,
    author: "Humas Kemenhaj Pare",
    image: "/images/berita-1.jpg",
    body: body(
      "Kantor Kementerian Haji dan Umrah Kota Parepare menyampaikan bahwa pembukaan porsi haji reguler tahun keberangkatan 2027 telah dimulai. Seluruh proses pendaftaran tetap mengacu pada Sistem Komputerisasi Haji Terpadu (SISKOHAT) Kementerian Agama RI.",
      "Dokumen yang perlu disiapkan",
      [
        "Kartu Tanda Penduduk asli dan fotokopi.",
        "Kartu Keluarga dan akta kelahiran atau ijazah terakhir.",
        "Paspor yang masih berlaku, bila sudah dimiliki.",
        "Foto berwarna ukuran 3x4 dengan latar putih sebanyak 5 lembar.",
        "Buku tabungan dan slip setoran awal BPIH dari Bank Penerima Setoran.",
      ],
      "Calon jemaah disarankan melakukan setoran awal BPIH terlebih dahulu sebelum verifikasi dokumen di kantor. Layanan verifikasi dibuka setiap hari kerja pukul 08.00–15.00 WITA.",
    ),
  },
  {
    slug: "pelimpahan-porsi-haji-syarat-dan-alur",
    title: "Pelimpahan porsi haji: syarat, alur, dan dokumen yang wajib disiapkan",
    excerpt:
      "Pelimpahan porsi hanya dapat dilakukan pada kondisi tertentu. Pahami syarat, alur lima langkah, dan berkas yang harus dibawa.",
    category: "Pelimpahan",
    date: "2026-11-08",
    readMinutes: 6,
    views: 2390,
    author: "Seksi PHU",
    image: "/images/berita-2.jpg",
    body: body(
      "Pelimpahan porsi haji adalah pengalihan hak keberangkatan dari jemaah yang telah memiliki porsi kepada pihak lain, dan hanya dimungkinkan dalam kondisi meninggal dunia atau sakit permanen sesuai ketentuan peraturan perundang-undangan.",
      "Siapa yang berhak mengajukan",
      [
        "Ahli waris langsung dari jemaah pemilik porsi.",
        "Suami atau istri jemaah pemilik porsi.",
        "Keluarga sedarah dalam garis keturunan lurus ke bawah, dengan surat pernyataan ahli waris.",
        "Pihak lain yang memperoleh surat kuasa resmi dan bermeterai.",
      ],
      "Permohonan dapat diajukan langsung di Kantor Kemenhaj Pare. Petugas akan memeriksa kelengkapan dokumen sebelum berkas diteruskan ke Kanwil Kementerian Agama Provinsi Sulawesi Selatan.",
    ),
  },
  {
    slug: "sosialisasi-pembatalan-porsi-bagi-jemaah",
    title: "Kantor Kemenhaj Pare gelar sosialisasi pembatalan porsi bagi jemaah",
    excerpt:
      "Sosialisasi dihadiri perwakilan jemaah dan keluarga untuk memahami konsekuensi serta mekanisme pengembalian setoran BPIH.",
    category: "Pembatalan",
    date: "2026-11-05",
    readMinutes: 3,
    views: 980,
    author: "Humas Kemenhaj Pare",
    image: "/images/berita-3.jpg",
    body: body(
      "Sebanyak 40 perwakilan jemaah mengikuti sosialisasi pembatalan porsi haji yang digelar di aula kantor. Kegiatan ini membahas alur permohonan, dokumen pendukung, hingga mekanisme pengembalian dana melalui Bank Penerima Setoran.",
      "Poin utama yang disampaikan",
      [
        "Pembatalan porsi diajukan tertulis oleh jemaah atau ahli waris.",
        "Pengembalian dana tidak diproses di kantor, melainkan melalui BPS-BPIH.",
        "Waktu pengembalian dana bergantung pada kebijakan bank dan verifikasi berkas.",
      ],
      "Peserta diminta menyimpan bukti porsi dan buku tabungan dengan baik. Informasi lebih lanjut dapat ditanyakan melalui layanan terpadu pada jam kerja.",
    ),
  },
  {
    slug: "pemeriksaan-kesehatan-jemaah-haji-dimulai",
    title: "Pemeriksaan kesehatan jemaah haji calon embarkasi Parepare dimulai",
    excerpt:
      "Pemeriksaan kesehatan tahap pertama berlangsung di puskesmas dan rumah sakit rujukan di Kota Parepare.",
    category: "Kegiatan",
    date: "2026-10-30",
    readMinutes: 3,
    views: 1420,
    author: "Humas Kemenhaj Pare",
    image: "/images/berita-4.jpg",
    body: body(
      "Pemeriksaan kesehatan jemaah haji tahap pertama resmi dimulai pekan ini. Pemeriksaan mencakup pemeriksaan fisik, laboratorium, serta skrining penyakit menular dan tidak menular.",
      "Jadwal dan lokasi",
      [
        "Pemeriksaan dilakukan sesuai jadwal yang tercantum pada bukti porsi.",
        "Jemaah diimbau hadir 15 menit sebelum jadwal dan membawa KTP serta buku vaksinasi.",
        "Hasil pemeriksaan menjadi syarat penerbitan surat keterangan sehat.",
      ],
      "Jemaah yang berhalangan hadir dapat mengajukan penjadwalan ulang melalui petugas layanan kesehatan setempat.",
    ),
  },
  {
    slug: "layanan-terpadu-satu-pintu-dokumen-haji",
    title: "Layanan terpadu satu pintu untuk dokumen haji kini tersedia",
    excerpt:
      "Satu loket untuk verifikasi dokumen, konsultasi porsi, dan pengurusan formulir pelimpahan maupun pembatalan.",
    category: "Pengumuman",
    date: "2026-10-27",
    readMinutes: 2,
    views: 760,
    author: "Subbagian Tata Usaha",
    image: "/images/berita-5.jpg",
    body: body(
      "Mulai November 2026, seluruh layanan dokumen haji dan umrah di Kantor Kemenhaj Pare dilayani melalui satu loket terpadu di lantai dasar. Masyarakat tidak perlu berpindah loket untuk verifikasi berkas.",
      "Layanan yang tersedia",
      [
        "Verifikasi dokumen pendaftaran haji reguler.",
        "Konsultasi porsi dan estimasi keberangkatan.",
        "Penerimaan berkas pelimpahan dan pembatalan porsi.",
        "Pengambilan formulir resmi dan panduan tertulis.",
      ],
      "Loket terpadu beroperasi Senin sampai Jumat, pukul 08.00–15.00 WITA, dengan jeda istirahat pukul 12.00–13.00 WITA.",
    ),
  },
  {
    slug: "bimbingan-manasik-haji-angkatan-ii-dibuka",
    title: "Bimbingan manasik haji angkatan II resmi dibuka",
    excerpt:
      "Kegiatan berlangsung selama enam hari dengan materi praktik ihram, tawaf, dan manajemen kesehatan jemaah.",
    category: "Kegiatan",
    date: "2026-10-20",
    readMinutes: 4,
    views: 1180,
    author: "Seksi PHU",
    image: "/images/berita-6.jpg",
    body: body(
      "Bimbingan manasik haji angkatan II dibuka oleh Kepala Kantor di aula pertemuan. Sebanyak 120 calon jemaah mengikuti rangkaian materi yang berlangsung selama enam hari.",
      "Materi yang diberikan",
      [
        "Fikih haji dan tata cara pelaksanaan ibadah.",
        "Praktik ihram, tawaf, sai, dan lempar jumrah.",
        "Manajemen kesehatan dan adaptasi cuaca.",
        "Adab perjalanan dan pengelolaan emosi selama di tanah suci.",
      ],
      "Peserta diharapkan membawa buku panduan manasik dan mengenakan pakaian yang nyaman selama sesi praktik.",
    ),
  },
  {
    slug: "kuota-haji-parepare-2027",
    title: "Kuota haji Kota Parepare 2027 dan rincian pembagiannya",
    excerpt:
      "Kuota tahun 2027 mengalami penyesuaian. Berikut rincian pembagian untuk jemaah reguler, lanjut usia, dan pendamping.",
    category: "Pengumuman",
    date: "2026-10-14",
    readMinutes: 3,
    views: 3120,
    author: "Humas Kemenhaj Pare",
    image: "/images/berita-7.jpg",
    body: body(
      "Kuota haji Kota Parepare untuk tahun keberangkatan 2027 telah ditetapkan. Penetapan ini memperhatikan jumlah porsi terdaftar, prioritas lanjut usia, serta ketentuan dari Kementerian Agama RI.",
      "Rincian pembagian",
      [
        "Kuota jemaah haji reguler sesuai alokasi provinsi.",
        "Prioritas tambahan bagi jemaah berusia 65 tahun ke atas.",
        "Alokasi pendamping bagi jemaah lanjut usia dan disabilitas.",
      ],
      "Jemaah dapat memeriksa estimasi keberangkatan pada aplikasi resmi Kementerian Agama atau bertanya langsung di loket terpadu.",
    ),
  },
  {
    slug: "panduan-unduh-formulir-pelimpahan-porsi",
    title: "Panduan mengunduh formulir pelimpahan porsi secara mandiri",
    excerpt:
      "Formulir dapat diunduh dari portal ini, dicetak, lalu dibawa bersama dokumen pendukung ke loket layanan.",
    category: "Pelimpahan",
    date: "2026-10-09",
    readMinutes: 2,
    views: 640,
    author: "Subbagian Tata Usaha",
    image: "/images/berita-8.jpg",
    body: body(
      "Untuk mengurangi antrean, masyarakat dapat mengunduh formulir pelimpahan porsi secara mandiri melalui portal ini. Formulir yang telah dicetak dan diisi lengkap cukup dibawa sekali ke loket layanan.",
      "Langkah pengunduhan",
      [
        "Buka halaman Layanan, lalu pilih Pelimpahan Porsi Haji.",
        "Tekan tombol Unduh Formulir PDF.",
        "Cetak formulir pada kertas A4 dan isi dengan huruf kapital.",
        "Lampirkan dokumen pendukung sesuai daftar persyaratan.",
      ],
      "Pastikan seluruh kolom terisi dan ditandatangani sebelum diserahkan. Petugas akan memeriksa kelengkapan berkas di loket.",
    ),
  },
];

export const services: Service[] = [
  {
    slug: "pendaftaran-haji",
    name: "Pendaftaran Haji Reguler",
    shortName: "Pendaftaran haji",
    description:
      "Pendaftaran jemaah haji reguler dilakukan melalui SISKOHAT Kementerian Agama RI. Kantor Kemenhaj Pare membantu verifikasi dokumen dan pembukaan porsi keberangkatan.",
    icon: "register",
    duration: "1–3 hari kerja",
    cost: "Sesuai ketetapan BPIH",
    updatedAt: "2026-11-12",
    requirements: [
      "Kartu Tanda Penduduk asli dan fotokopi.",
      "Kartu Keluarga serta akta kelahiran atau ijazah terakhir.",
      "Paspor yang masih berlaku, bila sudah dimiliki.",
      "Foto berwarna 3x4 latar putih sebanyak 5 lembar.",
      "Buku tabungan dan slip setoran awal BPIH dari BPS-BPIH.",
      "Surat keterangan sehat dari fasilitas kesehatan pemerintah.",
      "Surat mahram bagi jemaah perempuan di bawah 45 tahun.",
    ],
    steps: [
      { title: "Siapkan dokumen", detail: "Lengkapi seluruh berkas asli dan fotokopi sesuai daftar persyaratan." },
      { title: "Setor awal BPIH", detail: "Lakukan setoran awal di Bank Penerima Setoran BPIH dan simpan slipnya." },
      { title: "Verifikasi di kantor", detail: "Bawa berkas ke loket terpadu untuk diperiksa petugas." },
      { title: "Input SISKOHAT", detail: "Petugas memasukkan data jemaah ke sistem dan mencetak bukti pendaftaran." },
      { title: "Terima bukti porsi", detail: "Simpan bukti porsi dan periksa estimasi keberangkatan secara berkala." },
    ],
    form: { label: "Formulir Pendaftaran Haji Reguler", file: "/dokumen/formulir-pendaftaran-haji.pdf", size: "184 KB" },
    note: "Pendaftaran tidak dipungut biaya di kantor. Seluruh setoran dilakukan langsung ke rekening resmi BPS-BPIH.",
  },
  {
    slug: "pelimpahan-porsi",
    name: "Pelimpahan Porsi Haji",
    shortName: "Pelimpahan porsi",
    description:
      "Pelimpahan porsi diberikan kepada ahli waris atau pihak yang berhak ketika pemilik porsi meninggal dunia atau mengalami sakit permanen sesuai ketentuan.",
    icon: "transfer",
    duration: "7–14 hari kerja",
    cost: "Tidak ada biaya layanan",
    updatedAt: "2026-11-08",
    requirements: [
      "Surat permohonan pelimpahan yang ditandatangani pemohon.",
      "Fotokopi KTP dan Kartu Keluarga pemohon serta pemilik porsi.",
      "Akta kematian atau surat keterangan sakit permanen dari rumah sakit.",
      "Bukti setoran awal BPIH dan bukti porsi asli.",
      "Surat pernyataan ahli waris yang diketahui kepala desa/lurah.",
      "Surat kuasa bermeterai apabila diwakilkan.",
    ],
    steps: [
      { title: "Ajukan permohonan", detail: "Serahkan surat permohonan dan berkas pendukung ke loket layanan." },
      { title: "Verifikasi dokumen", detail: "Petugas memeriksa keaslian dan kelengkapan seluruh dokumen." },
      { title: "Pemeriksaan kelayakan", detail: "Berkas diteruskan ke Kanwil Kemenag untuk dinilai kesesuaiannya." },
      { title: "Penetapan pelimpahan", detail: "Kanwil menerbitkan penetapan pelimpahan porsi kepada penerima." },
      { title: "Cetak bukti porsi baru", detail: "Penerima menerima bukti porsi baru melalui SISKOHAT." },
    ],
    form: { label: "Formulir Pelimpahan Porsi Haji", file: "/dokumen/formulir-pelimpahan-porsi.pdf", size: "196 KB" },
    note: "Pelimpahan porsi tidak dapat dipindahtangankan kembali setelah penetapan diterbitkan.",
  },
  {
    slug: "pembatalan-porsi",
    name: "Pembatalan Porsi Haji",
    shortName: "Pembatalan porsi",
    description:
      "Pembatalan porsi diajukan oleh jemaah atau ahli waris ketika keberangkatan tidak dapat dilaksanakan. Pengembalian dana diproses melalui BPS-BPIH.",
    icon: "cancel",
    duration: "14–30 hari kerja",
    cost: "Sesuai kebijakan BPS-BPIH",
    updatedAt: "2026-11-05",
    requirements: [
      "Surat permohonan pembatalan porsi yang ditandatangani jemaah atau ahli waris.",
      "Fotokopi KTP dan Kartu Keluarga.",
      "Bukti porsi asli serta bukti setoran BPIH.",
      "Buku tabungan atas nama jemaah.",
      "Surat keterangan pendukung, seperti surat kematian atau surat sakit.",
      "Surat kuasa bermeterai apabila diajukan oleh pihak lain.",
    ],
    steps: [
      { title: "Ajukan permohonan", detail: "Sampaikan surat pembatalan beserta dokumen pendukung di loket." },
      { title: "Verifikasi berkas", detail: "Petugas memeriksa identitas, bukti porsi, dan rekening tujuan refund." },
      { title: "Penetapan pembatalan", detail: "Kantor menerbitkan surat penetapan pembatalan porsi." },
      { title: "Pengajuan refund", detail: "Berkas refund diteruskan kepada BPS-BPIH untuk diproses." },
      { title: "Pengembalian dana", detail: "Dana dikembalikan ke rekening jemaah sesuai kebijakan bank." },
    ],
    form: { label: "Formulir Pembatalan Porsi Haji", file: "/dokumen/formulir-pembatalan-porsi.pdf", size: "178 KB" },
    note: "Waktu pengembalian dana sepenuhnya berada pada kewenangan bank penerima setoran, bukan kantor.",
  },
];

export const officials: Official[] = [
  {
    id: "kepala-kantor",
    name: "Drs. H. Muhammad Ridwan, M.Si.",
    nip: "19700512 199803 1 004",
    position: "Kepala Kantor",
    unit: "Pimpinan",
    order: 1,
    photo: "/images/pejabat-1.jpg",
    duties:
      "Memimpin dan mengoordinasikan seluruh penyelenggaraan layanan haji dan umrah di Kota Parepare, menetapkan kebijakan teknis, serta membina seluruh unit kerja.",
    contact: "(0421) 21345",
  },
  {
    id: "kasubbag-tu",
    name: "Hj. Nurhayati, S.Ag., M.Pd.",
    nip: "19750820 200003 2 003",
    position: "Kepala Subbagian Tata Usaha",
    unit: "Subbagian Tata Usaha",
    order: 2,
    photo: "/images/pejabat-2.jpg",
    duties:
      "Mengelola administrasi kepegawaian, keuangan, rumah tangga kantor, serta layanan informasi dan dokumentasi publik.",
    contact: "(0421) 21346",
  },
  {
    id: "kasi-phu",
    name: "Abdul Rahman, S.E., M.M.",
    nip: "19780315 200501 1 006",
    position: "Kepala Seksi Penyelenggaraan Haji dan Umrah",
    unit: "Seksi PHU",
    order: 3,
    photo: "/images/pejabat-3.jpg",
    duties:
      "Membina pendaftaran, bimbingan manasik, dan pelayanan jemaah haji reguler serta mengelola data porsi pada SISKOHAT.",
    contact: "(0421) 21347",
  },
  {
    id: "kasi-haji-khusus",
    name: "Fatimah Zahra, S.H., M.H.",
    nip: "19820607 200901 2 008",
    position: "Kepala Seksi Haji Khusus dan Umrah",
    unit: "Seksi Haji Khusus dan Umrah",
    order: 4,
    photo: "/images/pejabat-4.jpg",
    duties:
      "Melakukan pembinaan terhadap penyelenggara perjalanan ibadah haji khusus dan umrah serta pengawasan kepatuhan izin usaha.",
    contact: "(0421) 21348",
  },
  {
    id: "pengelola-sistem-informasi",
    name: "Muh. Ilham, S.Kom.",
    nip: "19900418 201503 1 002",
    position: "Analis Sistem Informasi",
    unit: "Seksi PHU",
    order: 5,
    photo: "/images/pejabat-5.jpg",
    duties:
      "Mengelola data SISKOHAT, memelihara portal informasi publik, dan mendukung pelaporan statistik layanan haji dan umrah.",
    contact: "ilham@kemenhajpare.go.id",
  },
  {
    id: "penyuluh",
    name: "Siti Aminah, S.Pd.I.",
    nip: "19871123 201001 2 005",
    position: "Penyuluh Agama",
    unit: "Seksi PHU",
    order: 6,
    photo: "/images/pejabat-6.jpg",
    duties:
      "Menyusun materi dan mendampingi pelaksanaan bimbingan manasik haji bagi calon jemaah di wilayah Kota Parepare.",
    contact: "(0421) 21349",
  },
  {
    id: "staf-layanan",
    name: "Andi Pratama, A.Md.",
    nip: "19920902 201801 1 003",
    position: "Staf Layanan Terpadu",
    unit: "Subbagian Tata Usaha",
    order: 7,
    photo: "/images/pejabat-7.jpg",
    duties:
      "Menerima berkas permohonan, memberikan informasi awal, dan mengarahkan masyarakat ke unit layanan yang sesuai.",
    contact: "(0421) 21350",
  },
];

const albumItems = (images: string[], captions: string[]): GalleryItem[] =>
  captions.map((caption, index) => ({
    src: images[index % images.length],
    caption,
    type: "image",
  }));

export const albums: Album[] = [
  {
    slug: "sosialisasi-pendaftaran-haji-2027",
    title: "Sosialisasi pendaftaran haji 2027",
    description: "Penyampaian tahapan pendaftaran dan verifikasi dokumen kepada calon jemaah.",
    year: 2026,
    date: "2026-11-10",
    cover: "/images/galeri-1.jpg",
    items: albumItems(
      [
        "/images/galeri-1.jpg",
        "/images/galeri-8.jpg",
        "/images/galeri-4.jpg",
        "/images/galeri-3.jpg",
      ],
      [
        "Pembukaan sosialisasi oleh Kepala Kantor",
        "Pemaparan alur pendaftaran haji reguler",
        "Sesi tanya jawab bersama calon jemaah",
        "Pendampingan pengisian formulir",
      ],
    ),
  },
  {
    slug: "bimbingan-manasik-angkatan-ii",
    title: "Bimbingan manasik angkatan II",
    description: "Praktik ihram, tawaf, dan manajemen kesehatan jemaah selama enam hari.",
    year: 2026,
    date: "2026-10-22",
    cover: "/images/galeri-8.jpg",
    items: albumItems(
      [
        "/images/galeri-8.jpg",
        "/images/galeri-3.jpg",
        "/images/galeri-6.jpg",
        "/images/galeri-7.jpg",
      ],
      [
        "Pembukaan bimbingan manasik angkatan II",
        "Materi fikih haji bersama pembimbing",
        "Praktik tawaf di miniatur ka'bah",
        "Pemeriksaan kesehatan peserta",
      ],
    ),
  },
  {
    slug: "pelayanan-terpadu-dokumen-haji",
    title: "Pelayanan terpadu dokumen haji",
    description: "Aktivitas loket terpadu untuk verifikasi berkas dan konsultasi porsi.",
    year: 2026,
    date: "2026-09-18",
    cover: "/images/galeri-2.jpg",
    items: albumItems(
      [
        "/images/galeri-2.jpg",
        "/images/galeri-3.jpg",
        "/images/galeri-1.jpg",
        "/images/galeri-7.jpg",
      ],
      [
        "Antrean tertib di loket terpadu",
        "Verifikasi dokumen oleh petugas",
        "Konsultasi porsi haji",
        "Penyerahan bukti porsi kepada jemaah",
      ],
    ),
  },
  {
    slug: "rapat-koordinasi-pelimpahan-porsi",
    title: "Rapat koordinasi pelimpahan porsi",
    description: "Koordinasi lintas sektor membahas percepatan verifikasi berkas pelimpahan.",
    year: 2026,
    date: "2026-08-14",
    cover: "/images/galeri-4.jpg",
    items: albumItems(
      [
        "/images/galeri-4.jpg",
        "/images/galeri-1.jpg",
        "/images/galeri-2.jpg",
        "/images/galeri-3.jpg",
      ],
      [
        "Rapat dibuka oleh Kepala Kantor",
        "Paparan data pelimpahan porsi",
        "Diskusi bersama perwakilan kanwil",
        "Penetapan jadwal verifikasi bersama",
      ],
    ),
  },
  {
    slug: "pelepasan-jemaah-haji-2026",
    title: "Pelepasan jemaah haji 2026",
    description: "Momen pelepasan jemaah haji Kota Parepare menuju asrama embarkasi.",
    year: 2026,
    date: "2026-05-28",
    cover: "/images/galeri-6.jpg",
    items: albumItems(
      [
        "/images/galeri-6.jpg",
        "/images/galeri-5.jpg",
        "/images/galeri-1.jpg",
        "/images/galeri-4.jpg",
      ],
      [
        "Jemaah berkumpul di aula kantor",
        "Pengarahan sebelum keberangkatan",
        "Pelepasan oleh Kepala Kantor",
        "Keberangkatan menuju asrama embarkasi",
      ],
    ),
  },
  {
    slug: "hari-amal-bakti-2026",
    title: "Peringatan Hari Amal Bakti 2026",
    description: "Upacara dan kegiatan sosial dalam rangka Hari Amal Bakti.",
    year: 2026,
    date: "2026-01-03",
    cover: "/images/galeri-7.jpg",
    items: albumItems(
      [
        "/images/galeri-7.jpg",
        "/images/galeri-4.jpg",
        "/images/galeri-1.jpg",
        "/images/galeri-3.jpg",
      ],
      [
        "Upacara bendera Hari Amal Bakti",
        "Penyerahan penghargaan pegawai",
        "Kegiatan bakti sosial",
        "Foto bersama seluruh pegawai",
      ],
    ),
  },
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

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getAlbum(slug: string): Album | undefined {
  return albums.find((album) => album.slug === slug);
}

export function popularArticles(limit = 3): Article[] {
  return [...articles].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function latestArticles(limit = 6): Article[] {
  return [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function relatedArticles(article: Article, limit = 3): Article[] {
  const sameCategory = articles.filter(
    (item) => item.slug !== article.slug && item.category === article.category,
  );
  const others = articles.filter(
    (item) => item.slug !== article.slug && item.category !== article.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function categoryName(slug: string): string {
  return categories.find((category) => category.slug === slug)?.name ?? "Umum";
}
