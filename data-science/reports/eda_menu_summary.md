# Laporan Exploratory Data Analysis (EDA) Katalog Menu Kopilogi

## 1. Tujuan Analisis

Analisis ini dilakukan untuk menjawab pertanyaan bisnis PB-02, yaitu bagaimana distribusi katalog menu Kopilogi berdasarkan kategori, harga, dan penanda best seller. Analisis bertujuan mendeskripsikan karakteristik dataset menu yang dikumpulkan sebagai bahan evaluasi informasi katalog pada website Kopilogi.

## 2. Dataset dan Metode

Dataset yang digunakan adalah `menus_clean.csv`, hasil proses data gathering, assessing, dan cleaning. Dataset terdiri atas 183 record menu dengan informasi identitas menu, cabang, kategori, deskripsi, harga, dan metadata sumber.

Metode yang digunakan meliputi statistik deskriptif, analisis frekuensi, pengelompokan kategori, analisis harga, serta pemeriksaan nama menu unik. Pengolahan dilakukan menggunakan Python dan pandas, sedangkan visualisasi menggunakan matplotlib.

## 3. Hasil Analisis

### 3.1 Distribusi Kategori

Kategori beverage memiliki jumlah record terbesar, yaitu 110 record (60,11%), diikuti food sebanyak 65 record (35,52%), dessert sebanyak 6 record (3,28%), dan package sebanyak 2 record (1,09%).

### 3.2 Distribusi Harga

Harga menu dalam dataset berkisar antara Rp10.000 sampai Rp130.500. Rata-rata harga sebesar Rp23.964,48, sedangkan median sebesar Rp22.500.

Terdapat produk botolan berukuran 500ml dan 1L dengan harga lebih tinggi dibandingkan sebagian besar menu lainnya. Produk tersebut dipertahankan dalam analisis karena belum terdapat bukti bahwa harganya merupakan kesalahan pencatatan.

### 3.3 Analisis per Cabang

BR001 memiliki 56 record menu dengan median harga Rp25.500. BR002 memiliki 71 record dengan median harga Rp16.500, sedangkan BR003 memiliki 56 record dengan median harga Rp25.500.

Pemeriksaan menunjukkan bahwa katalog BR001 dan BR003 identik berdasarkan nama menu, kategori, dan harga. Kesamaan ini masih memerlukan verifikasi terhadap sumber masing-masing cabang.

### 3.4 Analisis Produk Unik

Dari 183 record katalog, ditemukan 114 nama menu unik dan 127 kombinasi nama-kategori unik.

Perbedaan tersebut menunjukkan adanya pencatatan nama menu yang sama pada beberapa cabang atau kategori. Oleh karena itu, jumlah record katalog tidak dapat langsung ditafsirkan sebagai jumlah produk unik.

### 3.5 Penanda Best Seller

Analisis best seller belum dapat dilakukan karena seluruh 183 record memiliki nilai kosong pada atribut `is_best_seller`.

## 4. Temuan dan Rekomendasi

Berdasarkan hasil analisis, pengelompokan kategori menu perlu dipertahankan agar informasi katalog mudah ditelusuri. Informasi harga dan ukuran produk juga perlu ditampilkan secara jelas, khususnya pada produk botolan dengan variasi ukuran.

Selain itu, katalog perlu dikelola berdasarkan cabang agar perbedaan menu dan harga dapat ditampilkan sesuai informasi masing-masing lokasi. Label best seller sebaiknya tidak ditampilkan secara otomatis sebelum tersedia data pendukung.

## 5. Keterbatasan

Analisis hanya menggunakan dataset katalog yang telah dikumpulkan dan belum seluruhnya dikonfirmasi oleh pihak Kopilogi. Katalog BR001 dan BR003 memiliki informasi yang identik dan masih memerlukan verifikasi.

Hasil analisis bersifat deskriptif serta tidak menggambarkan volume transaksi, jumlah pelanggan, tingkat permintaan, maupun profitabilitas usaha.

## 6. Kesimpulan

Hasil EDA menunjukkan bahwa dataset katalog Kopilogi lebih banyak memuat record minuman dibandingkan kategori lainnya. Harga menu memiliki variasi, terutama karena terdapat produk botolan berukuran besar.

Analisis juga menunjukkan pentingnya membedakan jumlah record katalog dengan jumlah nama menu unik. Temuan tersebut dapat digunakan sebagai bahan evaluasi penyajian katalog dan pengelolaan informasi menu pada website Kopilogi, dengan tetap memperhatikan status verifikasi data.