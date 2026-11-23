# Kopilogi Data Science — Handoff Documentation

## 1. Overview

Dokumen ini merupakan panduan serah terima hasil pekerjaan Data Science pada Capstone Project Kopilogi kepada tim Full-Stack Developer dan AI Engineer.

Tujuannya adalah memastikan dataset, hasil analisis, dan dokumentasi dapat digunakan sesuai kebutuhan sistem tanpa mencampurkan data operasional Kopilogi dengan data dummy maupun dataset publik.

## 2. Dataset yang Tersedia

| Dataset | File | Penggunaan |
|---|---|---|
| Menu | `data/processed/menus_clean.csv` | Katalog menu per cabang |
| Cabang | `data/processed/branches_clean.csv` | Informasi lokasi dan layanan cabang |
| Informasi Umum | `data/processed/general_information_clean.csv` | Profil, sejarah, dan informasi umum |
| Survei Aktual | `data/processed/survey_actual.csv` | Analisis eksploratif terbatas |
| Survei Dummy | `data/processed/survey_dummy.csv` | Demonstrasi pengolahan data |
| Penjualan Publik | `data/processed/coffee_shop_sales_clean.csv` | Demonstrasi dashboard penjualan |

Seluruh path di atas dihitung dari direktori utama `kopilogi-data-science/`.

Dataset hasil cleaning merupakan keluaran teknis. Kelayakan penggunaan pada website produksi tetap memerlukan pemeriksaan sumber dan kesepakatan tim.

## 3. Dokumentasi Pendukung

Dokumentasi yang tersedia meliputi:

- `reports/data_dictionary.md` — penjelasan struktur dan aturan setiap dataset.
- `reports/final_validation_report.csv` — hasil pemeriksaan teknis.
- `reports/final_validation_issues.csv` — daftar pemeriksaan lanjutan.
- Notebook 01–15 — dokumentasi proses pengumpulan, pemeriksaan, pembersihan, analisis, dan validasi data.

## 4. Panduan untuk Full-Stack

Dataset menu, cabang, dan informasi umum dapat digunakan sebagai referensi konten website Kopilogi.

Sebelum integrasi, Full-Stack dan Data Science perlu menyepakati nama field, tipe data, relasi antarcollection, penanganan nilai kosong, dan status verifikasi.

Dataset tidak boleh langsung menimpa database produksi.

Integrasi awal dilakukan pada lingkungan pengembangan atau staging.

## 5. Panduan untuk AI Engineer

Dataset menu, cabang, dan informasi umum dapat digunakan sebagai sumber pengetahuan chatbot setelah dilakukan pemeriksaan kelayakan konten.

Jawaban chatbot harus memperhatikan cabang yang ditanyakan, sumber informasi, dan status verifikasi.

Data yang belum tersedia tidak boleh dilengkapi menggunakan asumsi.

Dataset survei dummy dan transaksi publik tidak digunakan sebagai sumber fakta operasional Kopilogi.

## 6. Dashboard Demonstrasi

Analisis Coffee Shop Sales menggunakan dataset publik eksternal, bukan transaksi Kopilogi.

Dashboard demonstrasi dapat menggunakan hasil agregasi yang tersedia di folder `reports/`, antara lain ringkasan penjualan bulanan, kategori, produk, lokasi, dan aktivitas per jam.

Dashboard wajib menampilkan keterangan:

**Demo Dashboard — Public Coffee Shop Sales Dataset. Not Kopilogi Transaction Data.**

## 7. Keterbatasan Data

- Informasi operasional Kopilogi masih memerlukan konfirmasi PIC.
- Katalog BR001 dan BR003 identik pada nama, kategori, dan harga serta perlu pemeriksaan sumber.
- Informasi best seller dan ketersediaan menu belum tersedia.
- Dataset survei terdiri atas dua respons aktual dan 98 respons dummy.
- Dataset transaksi publik tidak menggambarkan kondisi penjualan Kopilogi.
- Lisensi dataset publik masih perlu diverifikasi.

## 8. Status Handoff

**Status: Draft — Pending Integration Review**

Dokumentasi dan dataset telah disiapkan untuk pemeriksaan bersama tim. Persetujuan struktur data, pengujian integrasi, dan kelayakan publikasi belum dinyatakan selesai.