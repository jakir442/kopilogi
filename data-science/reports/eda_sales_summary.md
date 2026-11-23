# Laporan Exploratory Data Analysis (EDA) Coffee Shop Sales

## 1. Tujuan Analisis

Analisis ini dilakukan untuk mendemonstrasikan proses pengolahan dan analisis data transaksi pada usaha coffee shop menggunakan dataset publik. Demonstrasi bertujuan menunjukkan bagaimana data transaksi dapat diolah menjadi indikator bisnis dan visualisasi yang dapat diterapkan apabila Kopilogi memiliki data penjualan aktual pada masa mendatang.

## 2. Dataset dan Metode

Dataset yang digunakan adalah Coffee Shop Sales, yang terdiri atas 149.116 record transaksi dengan periode 1 Januari hingga 30 Juni 2023.

Data diolah menggunakan Python, pandas, dan matplotlib melalui tahapan Data Assessing, Data Cleaning, Feature Engineering, dan Exploratory Data Analysis.

Nilai penjualan dihitung berdasarkan perkalian kuantitas dengan harga satuan pada setiap record. Dataset ini merupakan data publik eksternal dan bukan data transaksi Kopilogi.

## 3. Hasil Analisis

### 3.1 Indikator Penjualan

Hasil pengolahan menunjukkan total nilai penjualan sebesar 698.812,33, total 214.470 unit terjual, dan 80 produk unik berdasarkan product_id.

### 3.2 Tren Penjualan Bulanan

Nilai penjualan terendah tercatat pada Februari 2023 sebesar 76.145,19, sedangkan nilai tertinggi terjadi pada Juni 2023 sebesar 166.485,88.

Setelah Februari, nilai penjualan meningkat setiap bulan hingga Juni. Namun, penyebab perubahan tersebut tidak dapat ditentukan hanya berdasarkan data transaksi yang tersedia.

### 3.3 Kontribusi Kategori Produk

Kategori Coffee memberikan kontribusi nilai penjualan terbesar, yaitu 38,63%, diikuti Tea sebesar 28,11% dan Bakery sebesar 11,78%.

### 3.4 Perbandingan Lokasi Toko

Hell's Kitchen memiliki nilai penjualan tertinggi sebesar 236.511,17, diikuti Astoria sebesar 232.243,91 dan Lower Manhattan sebesar 230.057,25.

Perbedaan tersebut menggambarkan variasi nilai penjualan dalam dataset publik, bukan performa cabang Kopilogi.

### 3.5 Produk dengan Nilai Penjualan Tertinggi

Produk Sustainably Grown Organic Lg memiliki nilai penjualan tertinggi sebesar 21.151,75, diikuti Dark chocolate Lg sebesar 21.006,00.

Analisis ini menunjukkan pentingnya membedakan peringkat produk berdasarkan nilai penjualan dan jumlah unit terjual.

### 3.6 Aktivitas Transaksi Berdasarkan Jam

Aktivitas record transaksi tertinggi tercatat pada pukul 10.00 dengan 18.545 record dan nilai penjualan sebesar 88.673,39.

Hasil tersebut hanya menggambarkan pola aktivitas pada dataset publik yang digunakan.

## 4. Rekomendasi Pengembangan Dashboard

Berdasarkan demonstrasi analisis, dashboard penjualan dapat dirancang untuk menampilkan total nilai penjualan, jumlah unit terjual, tren penjualan bulanan, kontribusi kategori, produk teratas, dan aktivitas transaksi berdasarkan jam.

Dashboard juga dapat dilengkapi filter periode, lokasi toko, dan kategori produk.

## 5. Keterbatasan

Dataset yang digunakan berasal dari sumber publik eksternal dan tidak mencerminkan kondisi operasional maupun transaksi Kopilogi.

Mata uang dan lisensi penggunaan dataset masih perlu dikonfirmasi melalui dokumentasi sumber aslinya.

Analisis tidak dapat digunakan untuk menyimpulkan pendapatan, produk terlaris, pola kunjungan, maupun kinerja cabang Kopilogi.

## 6. Kesimpulan

Demonstrasi EDA berhasil menunjukkan proses pengolahan data transaksi menjadi indikator dan visualisasi bisnis.

Hasil tersebut dapat menjadi referensi teknis untuk pengembangan dashboard penjualan apabila data transaksi aktual Kopilogi tersedia pada masa mendatang. Namun, seluruh temuan dari dataset publik harus tetap dipisahkan dari hasil analisis operasional Kopilogi.