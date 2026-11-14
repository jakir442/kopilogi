# Laporan Analisis Kelengkapan Informasi Cabang Kopilogi

## 1. Tujuan Analisis

Analisis ini dilakukan untuk menjawab pertanyaan bisnis PB-01, yaitu mengukur tingkat kelengkapan dan status verifikasi informasi cabang Kopilogi yang dikumpulkan sebagai bahan pengembangan website resmi.

## 2. Dataset dan Metode

Dataset yang digunakan adalah `branches_clean.csv`, yang terdiri atas tiga record cabang aktif. Analisis dilakukan menggunakan Python dan pandas dengan menghitung persentase atribut terisi serta distribusi status verifikasi.

Atribut informasi dibagi menjadi dua kelompok, yaitu tujuh atribut inti dan empat atribut pendukung. Tingkat kelengkapan dihitung berdasarkan jumlah atribut yang memiliki nilai dibandingkan seluruh atribut yang ditetapkan pada masing-masing kelompok.

## 3. Hasil Analisis

Ketiga cabang memiliki kelengkapan informasi inti sebesar 100%, kelengkapan informasi pendukung sebesar 75%, dan kelengkapan keseluruhan sebesar 90,91%.

Satu atribut yang belum tersedia pada seluruh cabang adalah `grabfood_url`. Sementara itu, atribut nama cabang, kota, alamat, jam operasional, kontak, fasilitas, Google Maps, Instagram, dan GoFood telah memiliki nilai dalam dataset.

Hasil pemeriksaan status verifikasi menunjukkan bahwa ketiga cabang masih berstatus `pending_pic`. Dengan demikian, tingkat verifikasi PIC yang tercatat adalah 0%.

## 4. Temuan dan Rekomendasi

Berdasarkan hasil analisis, dataset cabang telah memiliki kelengkapan struktural yang tinggi, tetapi masih memerlukan konfirmasi terhadap kebenaran informasi.

Tim disarankan memprioritaskan verifikasi alamat, jam operasional, kontak, dan tautan layanan sebelum informasi dinyatakan sebagai konten resmi yang terverifikasi.

Tautan GrabFood yang belum tersedia sebaiknya tetap dikosongkan sampai ditemukan sumber yang sesuai. Selain itu, tautan yang sudah tercatat perlu diuji untuk memastikan tujuan dan relevansinya dengan masing-masing cabang.

## 5. Keterbatasan

Analisis kelengkapan hanya mengukur keberadaan nilai pada atribut yang dipilih, bukan ketepatan informasi terhadap kondisi aktual.

Status verifikasi masih dicatat pada tingkat record cabang. Oleh karena itu, hasil 0% tidak dapat digunakan untuk menyatakan bahwa seluruh atribut informasi belum pernah diperiksa atau bahwa informasinya tidak benar.

## 6. Kesimpulan

Dataset tiga cabang Kopilogi memiliki tingkat kelengkapan informasi inti sebesar 100% dan kelengkapan keseluruhan sebesar 90,91%. Namun, seluruh record masih menunggu konfirmasi PIC.

Hasil analisis ini dapat digunakan sebagai dasar untuk menentukan prioritas verifikasi dan pelengkapan informasi sebelum dataset digunakan sebagai konten resmi website Kopilogi.