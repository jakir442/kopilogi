# Kopilogi Data Contract

**Status:** Draft — Menunggu konfirmasi Full-Stack Developer

## 1. Tujuan

Dokumen ini mendefinisikan usulan struktur data dan aturan integrasi antara hasil Data Science dengan website Kopilogi yang dikembangkan menggunakan Next.js dan MongoDB/Mongoose.

Kontrak final harus disesuaikan dengan Mongoose Schema yang sudah diterapkan pada website.

## 2. Dataset Branches

Sumber: `branches_clean.csv`

| Field DS | Tipe Usulan | Keterangan |
|---|---|---|
| `branch_id` | String | Identitas bisnis cabang |
| `branch_name` | String | Nama cabang |
| `city` | String | Kota |
| `address` | String | Alamat |
| `opening_time` | String | Format HH:mm |
| `closing_time` | String | Format HH:mm |
| `phone` | String | Nomor kontak |
| `facilities` | Array of String | Hasil pemisahan teks fasilitas |
| `google_maps_url` | String | Tautan lokasi |
| `instagram_url` | String | Tautan Instagram |
| `gofood_url` | String | Tautan GoFood |
| `grabfood_url` | String atau null | Boleh kosong |
| `is_active` | Boolean | Status cabang |
| `verification_status` | String | Status verifikasi |

Relasi dengan menu menggunakan `branch_id`, kecuali Full-Stack menentukan penggunaan ObjectId dengan tabel pemetaan.

## 3. Dataset Menus

Sumber: `menus_clean.csv`

| Field DS | Tipe Usulan | Keterangan |
|---|---|---|
| `menu_id` | String | Identitas record menu |
| `branch_id` | String | Referensi cabang |
| `menu_name` | String | Nama menu |
| `category` | String | Kategori asli |
| `category_group` | String | Kelompok kategori analisis |
| `description` | String | Deskripsi menu |
| `price` | Number | Harga numerik dalam IDR |
| `currency` | String | IDR |
| `image_url` | String | Referensi gambar |
| `is_best_seller` | Boolean atau null | Belum diketahui jika null |
| `is_available` | Boolean atau null | Belum diketahui jika null |
| `verification_status` | String | Status verifikasi |

Nilai kosong pada best seller dan availability tidak boleh otomatis diubah menjadi false.

## 4. Dataset General Information

Sumber: `general_information_clean.csv`

| Field DS | Tipe Usulan | Keterangan |
|---|---|---|
| `info_id` | String | Identitas informasi |
| `info_key` | String | Kode topik |
| `title` | String | Judul |
| `content` | String | Isi informasi |
| `source` | String | Asal informasi |
| `source_url` | String atau null | Referensi sumber |
| `accessed_at` | Date/String | Tanggal pencatatan |
| `verification_status` | String | Status verifikasi |
| `data_type` | String | Jenis data |

Informasi yang bersifat umum tidak boleh menggantikan informasi khusus cabang.

## 5. Aturan Relasi

Relasi logis utama:

`branches.branch_id` → `menus.branch_id`

Satu cabang dapat memiliki banyak record menu.

`general_information` merupakan dataset informasi umum tanpa foreign key langsung ke cabang.

Dataset survei dan penjualan publik tidak memiliki relasi transaksi dengan cabang Kopilogi.

## 6. Aturan Nilai Kosong

| Field | Aturan |
|---|---|
| `is_best_seller` | null jika belum diketahui |
| `is_available` | null jika belum diketahui |
| `grabfood_url` | null jika belum tersedia |
| `price` | Tidak boleh diganti dengan harga perkiraan |
| `content` | Tidak boleh kosong untuk informasi yang dipublikasikan |
| `verification_status` | Tidak boleh dinaikkan tanpa bukti |

## 7. Metadata dan Provenance

Setiap data yang diserahkan harus tetap dapat ditelusuri ke sumbernya.

Metadata sumber, tanggal akses, jenis data, dan status verifikasi perlu dipertahankan melalui field database, collection metadata, atau dokumen referensi yang disepakati.

Data dari sumber sekunder tidak otomatis dianggap telah disetujui PIC.

## 8. Format Integrasi

Format awal yang direkomendasikan:

- CSV untuk pertukaran dataset.
- JSON untuk kebutuhan API dan impor MongoDB.
- Markdown untuk dokumentasi.
- CSV/JSON agregasi untuk dashboard demonstrasi.

File JSON final dibuat setelah pemetaan terhadap Mongoose Schema selesai.

## 9. Aturan Keamanan dan Publikasi

Dataset survei aktual tidak boleh dipublikasikan secara mentah tanpa pemeriksaan privasi dan izin.

Dataset dummy dan publik harus memiliki label yang jelas.

Dataset Coffee Shop Sales tidak boleh dimasukkan sebagai transaksi Kopilogi.

Impor data awal dilakukan pada lingkungan pengembangan atau staging, bukan langsung ke database produksi.

## 10. Kriteria Penerimaan

Handoff dapat dinyatakan diterima setelah:

1. Full-Stack menyetujui pemetaan field.
2. Relasi menu dan cabang berhasil diuji.
3. Nilai null diproses dengan benar.
4. Data tidak menimpa konten produksi secara tidak sengaja.
5. Sumber dan status verifikasi tetap dapat ditelusuri.
6. AI Engineer menyetujui format sumber pengetahuan chatbot.
7. Pengujian integrasi menunjukkan data dapat dibaca sesuai kebutuhan.
8. Masalah yang masih terbuka didokumentasikan dan memiliki penanggung jawab.

## 11. Status

**Draft — Belum disetujui Full-Stack dan AI Engineer.**