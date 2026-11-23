# Kopilogi — Data Integration Checklist

**Project:** Kopilogi Capstone Project — Asah 2026  
**Tim:** Data Science, Full-Stack Developer, AI Engineer  
**Status:** Draft — Pending Integration Testing

## 1. Tujuan

Dokumen ini digunakan untuk memeriksa kesiapan dan keberhasilan integrasi dataset hasil pekerjaan Data Science ke dalam website serta chatbot Kopilogi.

Pemeriksaan dilakukan pada lingkungan pengembangan atau staging sebelum data digunakan pada sistem produksi.

## 2. Persiapan Handoff

- [ ] Dataset hasil cleaning tersedia dan dapat dibaca.
- [ ] Data dictionary telah diperiksa oleh anggota tim terkait.
- [ ] Final validation report tersedia.
- [ ] Masalah dengan status REVIEW telah didokumentasikan.
- [ ] Mongoose Schema telah diterima dari tim Full-Stack.
- [ ] Pemetaan field telah disepakati.
- [ ] Kebijakan penggunaan informasi belum terverifikasi telah disepakati.

## 3. Validasi Dataset Cabang

- [ ] Ketiga cabang aktif tercatat dengan `branch_id` yang unik.
- [ ] Nama cabang sesuai dengan sumber yang digunakan.
- [ ] Alamat dan jam operasional ditampilkan sesuai dataset.
- [ ] Format waktu `HH:mm` terbaca dengan benar.
- [ ] Nomor kontak tidak berubah format.
- [ ] Fasilitas dapat ditampilkan sesuai kebutuhan UI.
- [ ] Tautan Google Maps mengarah ke lokasi yang sesuai.
- [ ] Tautan Instagram dan GoFood mengarah ke cabang yang sesuai.
- [ ] `grabfood_url = null` tidak menyebabkan error.
- [ ] Status `pending_pic` tetap dapat ditelusuri.

## 4. Validasi Dataset Menu

- [ ] Seluruh `menu_id` unik.
- [ ] Seluruh `branch_id` menu mengacu pada cabang yang tersedia.
- [ ] Nama dan kategori menu terbaca dengan benar.
- [ ] Harga ditampilkan dalam format rupiah.
- [ ] Kategori asli tidak hilang setelah integrasi.
- [ ] `category_group` digunakan sesuai kebutuhan analisis.
- [ ] Gambar menu dapat diakses.
- [ ] Nilai `is_best_seller = null` tidak otomatis menjadi `false`.
- [ ] Nilai `is_available = null` tidak otomatis menjadi `false`.
- [ ] Katalog BR001 dan BR003 tidak dinyatakan telah diverifikasi secara terpisah tanpa bukti.
- [ ] Perubahan menu pada satu cabang tidak mengubah cabang lain secara tidak sengaja.

## 5. Validasi General Information

- [ ] Seluruh sembilan record dapat dibaca.
- [ ] `info_id` dan `info_key` tetap unik.
- [ ] Judul dan isi informasi tidak terpotong.
- [ ] Informasi sejarah sesuai dengan sumber wawancara.
- [ ] Informasi umum tidak menggantikan informasi khusus cabang.
- [ ] Status verifikasi dipertahankan.
- [ ] Informasi yang dapat berubah memiliki mekanisme pembaruan.

## 6. Integrasi Chatbot

- [ ] AI Engineer menerima format dataset yang disepakati.
- [ ] Chatbot dapat menjawab pertanyaan mengenai profil Kopilogi.
- [ ] Chatbot dapat menjawab pertanyaan mengenai cabang yang tersedia.
- [ ] Jawaban jam operasional sesuai dengan cabang yang ditanyakan.
- [ ] Jawaban menu dan harga sesuai dengan cabang terkait.
- [ ] Chatbot tidak mengarang harga atau ketersediaan menu.
- [ ] Chatbot tidak menyebut data `pending_pic` sebagai informasi yang telah dikonfirmasi.
- [ ] Chatbot dapat menyatakan ketika informasi belum tersedia.
- [ ] Data dummy dan transaksi Kaggle tidak digunakan sebagai fakta Kopilogi.
- [ ] Hasil pengujian chatbot didokumentasikan.

## 7. Dashboard Demonstrasi

- [ ] Dataset Coffee Shop Sales tetap terpisah dari data operasional Kopilogi.
- [ ] Dashboard menampilkan label dataset publik.
- [ ] Total nilai penjualan sesuai hasil EDA.
- [ ] Total unit dan jumlah record sesuai hasil EDA.
- [ ] Grafik tren bulanan dapat ditampilkan.
- [ ] Grafik kontribusi kategori dapat ditampilkan.
- [ ] Perbandingan lokasi menggunakan nama toko asli dataset publik.
- [ ] Filter periode, kategori, dan lokasi berfungsi jika diimplementasikan.
- [ ] Dashboard tidak mengklaim angka penjualan sebagai pendapatan Kopilogi.
- [ ] Lisensi dataset telah diperiksa sebelum distribusi publik.

## 8. Pengujian Integrasi

- [ ] File data dapat dibaca tanpa error.
- [ ] Tidak ada perubahan jumlah record yang tidak direncanakan.
- [ ] Tidak ada relasi menu-cabang yang rusak.
- [ ] Nilai kosong diproses sesuai aturan.
- [ ] Tidak ada data dummy yang masuk ke konten operasional.
- [ ] Data yang ditampilkan sesuai hasil impor.
- [ ] Pengujian dilakukan pada lingkungan development/staging.
- [ ] Hasil pengujian dan masalah dicatat.

## 9. Masalah yang Masih Terbuka

| ID | Masalah | Penanggung Jawab | Status |
|---|---|---|---|
| INT001 | Konfirmasi informasi operasional kepada PIC | DS / PIC | Pending |
| INT002 | Verifikasi kesamaan katalog BR001 dan BR003 | DS / PIC | Pending |
| INT003 | Informasi best seller dan availability belum tersedia | DS / PIC | Pending |
| INT004 | Pemeriksaan kesesuaian konten dengan wawancara | DS | Pending |
| INT005 | Pemeriksaan sumber dan lisensi dataset Kaggle | DS | Pending |
| INT006 | Pemetaan field ke Mongoose Schema | DS / Full-Stack | Pending |
| INT007 | Pengujian sumber pengetahuan chatbot | DS / AI Engineer | Pending |

## 10. Kriteria Handoff Selesai

Handoff dapat dinyatakan selesai apabila dataset yang disepakati berhasil diterima dan digunakan oleh tim terkait, hasil pengujian integrasi terdokumentasi, serta seluruh masalah yang masih terbuka telah diselesaikan atau diterima secara eksplisit sebagai keterbatasan.

Penyelesaian handoff teknis tidak otomatis berarti seluruh informasi telah terverifikasi PIC atau disetujui untuk publikasi.

## 11. Persetujuan Tim

| Peran | Nama | Status |
|---|---|---|
| Data Science | Belum diisi | Pending |
| Data Science | Belum diisi | Pending |
| Full-Stack Developer | Belum diisi | Pending |
| AI Engineer | Belum diisi | Pending |