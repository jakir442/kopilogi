# Data Dictionary — Kopilogi Data Science

## 1. Dataset Menu

### 1.1 Informasi Dataset

| Atribut | Keterangan |
|---|---|
| Nama file | `menus_clean.csv` |
| Sumber awal | Dataset katalog menu Kopilogi yang dikumpulkan dari sumber informasi usaha |
| Jumlah record | 183 |
| Jumlah kolom | 16 |
| Jenis data | Informasi operasional Kopilogi dari sumber sekunder |
| Status | Sudah melalui Data Assessing, Data Cleaning, dan EDA versi awal |
| Keterbatasan | Sebagian informasi belum dikonfirmasi PIC Kopilogi |

Dataset ini digunakan untuk mendokumentasikan katalog menu, melakukan analisis distribusi kategori dan harga, serta menyiapkan data yang dapat dimanfaatkan oleh tim Full-Stack.

Satu record merepresentasikan satu entri menu yang dicatat pada satu cabang. Nama menu yang sama dapat muncul pada beberapa cabang atau kategori yang berbeda.

### 1.2 Struktur Kolom

| Nama Kolom | Tipe Data | Deskripsi | Contoh Nilai | Aturan Validasi |
|---|---|---|---|---|
| `menu_id` | string | Identitas unik record menu | M001 | Wajib, unik, tidak kosong |
| `branch_id` | string | Identitas cabang terkait | BR001 | Wajib, harus tersedia pada dataset branches |
| `menu_name` | string | Nama menu | Orange BBQ | Wajib, tidak kosong |
| `category` | string | Kategori asli katalog | Wings Platter | Wajib, pertahankan kategori sumber |
| `description` | string | Deskripsi menu | Hidangan wings platter dengan varian saus | Catat sumber atau status deskripsi olahan |
| `price` | integer/numeric | Harga menu yang tercatat | 35500 | Positif; kebenaran harga perlu verifikasi sumber |
| `currency` | string | Mata uang | IDR | Gunakan IDR untuk harga rupiah |
| `image_url` | string | Referensi foto menu | URL Google Drive | URL berformat valid; akses gambar perlu diperiksa |
| `is_best_seller` | nullable boolean | Penanda best seller | null | TRUE/FALSE hanya jika ada bukti |
| `is_available` | nullable boolean | Ketersediaan menu | null | Jangan mengisi tanpa informasi |
| `source_id` | string | Referensi sumber | Instagram, Gopay bio | Harus dapat ditelusuri ke sumber |
| `source_url` | string | Tautan sumber informasi | URL Instagram | URL sumber yang relevan |
| `accessed_at` | date | Tanggal pengambilan informasi | 2026-11-10 | Format YYYY-MM-DD |
| `verification_status` | string | Status verifikasi | source_checked | Menggunakan daftar status yang disepakati |
| `data_type` | string | Jenis data | actual | actual/public/dummy |
| `category_group` | string | Kelompok kategori untuk analisis | food | food/beverage/dessert/package |

### 1.3 Penjelasan Kategori

Dataset memiliki 20 kategori asli yang dipertahankan pada kolom `category`.

Untuk analisis, kategori tersebut dikelompokkan menjadi empat kelompok umum pada kolom `category_group`.

| Kelompok | Jumlah Record |
|---|---:|
| beverage | 110 |
| food | 65 |
| dessert | 6 |
| package | 2 |
| **Total** | **183** |

Pengelompokan ini merupakan hasil data preparation untuk kebutuhan analisis dan bukan perubahan kategori resmi Kopilogi.

### 1.4 Relasi dengan Dataset Cabang

Kolom `branch_id` digunakan untuk menghubungkan setiap record menu dengan cabang pada dataset `branches_clean.csv`.

Relasi:

`menus.branch_id` → `branches.branch_id`

Setiap record menu harus memiliki `branch_id` yang tersedia pada dataset cabang.

### 1.5 Aturan Penggunaan

1. Dataset menu digunakan untuk menampilkan dan menganalisis informasi katalog.
2. Harga dan deskripsi yang belum dikonfirmasi PIC tidak boleh dinyatakan sebagai informasi resmi yang sudah terverifikasi.
3. Nilai kosong pada `is_best_seller` dan `is_available` berarti status belum diketahui, bukan FALSE.
4. Kategori asli dipertahankan untuk kebutuhan katalog, sedangkan `category_group` digunakan untuk analisis.
5. Record menu bernama sama tidak boleh dihapus otomatis karena dapat mewakili kategori atau penawaran berbeda.
6. Katalog BR001 dan BR003 identik pada nama, kategori, dan harga berdasarkan hasil pemeriksaan dataset. Kesamaan tersebut masih memerlukan konfirmasi.
7. Dataset tidak dapat digunakan untuk menyimpulkan volume penjualan atau produk yang paling banyak dibeli pelanggan.

### 1.6 Hasil Pemeriksaan Kualitas

| Pemeriksaan | Hasil |
|---|---|
| Total record | 183 |
| Duplikasi menu_id | 0 |
| Relasi branch_id tidak valid | 0 |
| Harga nol/negatif | 0 |
| Kategori umum belum dipetakan | 0 |
| Nilai kosong is_best_seller | 183 |
| Nilai kosong is_available | 183 |

Hasil tersebut menunjukkan bahwa dataset telah memenuhi pemeriksaan struktur dasar. Validasi isi terhadap sumber dan konfirmasi PIC masih menjadi pekerjaan lanjutan.

## 2. Dataset Cabang

### 2.1 Informasi Dataset

| Atribut | Keterangan |
|---|---|
| Nama file | `branches_clean.csv` |
| Sumber awal | Informasi cabang Kopilogi yang dikumpulkan melalui sumber sekunder |
| Jumlah record | 3 |
| Jumlah kolom | 16 |
| Jenis data | Informasi operasional Kopilogi |
| Status | Telah melalui Data Assessing, Data Cleaning, dan EDA versi awal |
| Keterbatasan | Seluruh cabang masih menunggu konfirmasi PIC |

Dataset ini berisi informasi tiga cabang aktif Kopilogi, yaitu Kopilogi, Waroeng Kopilogi, dan Kopilogi Tasik.

Satu record merepresentasikan satu cabang. Dataset digunakan untuk mendukung penyajian informasi lokasi, jam operasional, kontak, fasilitas, serta tautan layanan pada website Kopilogi.

### 2.2 Struktur Kolom

| Nama Kolom | Tipe Data | Deskripsi | Contoh Nilai | Aturan Validasi |
|---|---|---|---|---|
| `branch_id` | string | Identitas unik cabang | BR001 | Wajib, unik, tidak kosong |
| `branch_name` | string | Nama cabang | Kopilogi | Wajib, sesuai sumber |
| `city` | string | Kota cabang | Garut | Wajib, konsisten |
| `address` | string | Alamat cabang | Jl. Cikuray No.42, Garut | Wajib untuk publikasi setelah pemeriksaan sumber |
| `opening_time` | string | Jam buka cabang | 08:00 | Format HH:mm |
| `closing_time` | string | Jam tutup cabang | 22:00 | Format HH:mm |
| `phone` | string | Nomor kontak cabang | 62 813 6786 6999 | Disimpan sebagai string, bukan angka |
| `facilities` | string | Daftar fasilitas cabang | wifi, ac, indoor, outdoor | Nilai dipisahkan koma |
| `google_maps_url` | string | Tautan lokasi Google Maps | https://maps.app.goo.gl/... | URL valid dan mengarah ke cabang yang sesuai |
| `instagram_url` | string | Tautan Instagram cabang | https://www.instagram.com/... | URL valid dan relevan |
| `gofood_url` | string | Tautan layanan GoFood | https://gofood.link/... | URL valid dan relevan |
| `grabfood_url` | nullable string | Tautan layanan GrabFood | null | Boleh kosong jika belum tersedia |
| `is_active` | boolean | Status cabang aktif | TRUE | TRUE/FALSE berdasarkan informasi sumber |
| `source_id` | string | Referensi sumber informasi | SRC001 | Harus dapat ditelusuri |
| `verification_status` | string | Status verifikasi informasi | pending_pic | Menggunakan daftar status yang disepakati |
| `data_type` | string | Jenis data | actual | actual/public/dummy |

### 2.3 Daftar Cabang

| branch_id | branch_name | city | is_active |
|---|---|---|---|
| BR001 | Kopilogi | Garut | TRUE |
| BR002 | Waroeng Kopilogi | Garut | TRUE |
| BR003 | Kopilogi Tasik | Tasikmalaya | TRUE |

Dataset hanya mencakup tiga cabang aktif. Kopilogi Halway tidak dimasukkan karena telah tutup permanen berdasarkan informasi proyek.

### 2.4 Aturan Penggunaan

1. Setiap cabang harus memiliki `branch_id` yang unik.
2. Nama dan informasi cabang harus mengikuti sumber yang terdokumentasi.
3. Jam operasional disimpan menggunakan format `HH:mm`.
4. Nomor telepon disimpan sebagai string untuk mempertahankan format.
5. Tautan GrabFood yang belum tersedia tidak boleh diisi dengan URL perkiraan.
6. Nilai `is_active = TRUE` menunjukkan status yang tercatat dalam dataset, bukan hasil pemeriksaan langsung terbaru.
7. Informasi dengan status `pending_pic` belum boleh disebut sebagai informasi yang telah dikonfirmasi PIC.
8. URL yang berformat valid tetap harus diperiksa tujuan dan aksesibilitasnya sebelum publikasi.

### 2.5 Relasi dengan Dataset Menu

Dataset cabang memiliki hubungan satu-ke-banyak dengan dataset menu.

`branches.branch_id` → `menus.branch_id`

Satu cabang dapat memiliki banyak record menu, sedangkan satu record menu terhubung dengan satu cabang.

Relasi ini digunakan untuk menampilkan katalog menu berdasarkan cabang pada website Kopilogi.

### 2.6 Hasil Pemeriksaan Kualitas

| Pemeriksaan | Hasil |
|---|---|
| Jumlah record | 3 |
| Duplikasi branch_id | 0 |
| Kelengkapan informasi inti | 100% |
| Kelengkapan informasi pendukung | 75% |
| Kelengkapan keseluruhan | 90,91% |
| Cabang terverifikasi PIC | 0 dari 3 |
| Nilai kosong grabfood_url | 3 |
| URL dengan format tidak valid | 0 dari 9 URL terisi |

Persentase kelengkapan dihitung berdasarkan tujuh atribut inti dan empat atribut pendukung yang telah ditentukan dalam analisis PB-01.

Hasil tersebut menunjukkan tingkat kelengkapan struktural yang tinggi, tetapi tidak membuktikan bahwa seluruh informasi telah dikonfirmasi atau masih berlaku.

### 2.7 Rekomendasi Integrasi

Dataset `branches_clean.csv` dapat digunakan sebagai referensi penyajian informasi cabang pada website Kopilogi setelah melalui pemeriksaan kelayakan publikasi.

Tim Full-Stack perlu menyesuaikan struktur dataset dengan Mongoose Schema yang sudah digunakan, terutama pada atribut identitas cabang, jam operasional, fasilitas, dan tautan layanan.

Jika MongoDB menggunakan `_id` sebagai identitas dokumen, pemetaan antara `_id` dan `branch_id` perlu disepakati agar relasi dengan dataset menu tetap konsisten.

Tim AI Engineer juga dapat menggunakan informasi cabang sebagai sumber pengetahuan chatbot, dengan memperhatikan status verifikasi serta pembaruan informasi.

## 3. Dataset Customer Survey

### 3.1 Informasi Dataset

| Atribut | Keterangan |
|---|---|
| Nama dataset awal | `customer_survey` |
| File hasil cleaning | `survey_clean.csv` |
| File data aktual | `survey_actual.csv` |
| File data dummy | `survey_dummy.csv` |
| Jumlah record | 100 |
| Data aktual | 2 respons |
| Data dummy | 98 respons |
| Jumlah kolom hasil cleaning | 12 |
| Status | Data Assessing, Data Cleaning, dan EDA versi awal selesai |
| Keterbatasan | Jumlah respons aktual sangat terbatas dan tidak mewakili seluruh pelanggan Kopilogi |

Dataset Customer Survey disusun untuk mengeksplorasi kebutuhan informasi pengguna terhadap website Kopilogi. Dataset berisi informasi mengenai pengalaman mengunjungi Kopilogi, kebutuhan informasi, platform pencarian, tingkat kesulitan menemukan informasi, dan harapan terhadap website.

Data aktual dan dummy dipisahkan berdasarkan kolom `data_type` agar hasil simulasi tidak tercampur dengan jawaban responden nyata.

### 3.2 Struktur Kolom

| Nama Kolom | Tipe Data | Deskripsi | Contoh Nilai | Aturan Validasi |
|---|---|---|---|---|
| `response_id` | string | Identitas unik respons | R001 | Wajib, unik, tidak kosong |
| `submitted_at` | datetime | Tanggal dan waktu respons dicatat | 2026-11-12 10:30:00 | Format tanggal dan waktu valid; untuk dummy merupakan waktu simulasi |
| `respondent_type` | string | Status pengalaman mengunjungi Kopilogi | Pernah | Pernah / Belum Pernah |
| `information_needed` | string | Daftar informasi yang dipilih responden | Menu, Harga, Lokasi | Dapat memuat beberapa pilihan dipisahkan koma |
| `main_information` | string | Informasi yang dianggap paling penting | Harga | Menggunakan pilihan jawaban yang ditetapkan |
| `preferred_platform` | string | Platform pilihan untuk mencari informasi | Instagram | Menggunakan kategori jawaban survei |
| `information_difficulty` | integer | Skala penilaian kemudahan atau kesulitan menemukan informasi | 2 | Rentang 1–5; interpretasi mengikuti formulir |
| `website_expectation` | string | Harapan responden terhadap website | Informasi menu mudah ditemukan | Pertahankan isi jawaban asli |
| `additional_feedback` | nullable string | Saran tambahan responden | Tampilan lebih sederhana | Boleh kosong |
| `consent` | string | Jawaban persetujuan penggunaan data | Setuju | Pertahankan nilai asli |
| `data_type` | string | Jenis data berdasarkan asal respons | actual | actual / dummy |
| `consent_bool` | nullable boolean | Hasil transformasi persetujuan | TRUE | TRUE / FALSE / null jika tidak dikenali |

### 3.3 Jenis dan Pemisahan Data

Dataset terdiri atas dua kelompok.

**Data Aktual (`actual`)**

Sebanyak dua respons diberi label actual berdasarkan catatan asal pengumpulan. Data ini digunakan untuk mendeskripsikan jawaban responden nyata secara terbatas.

Data aktual tidak digunakan untuk menyimpulkan kebutuhan seluruh pelanggan Kopilogi karena jumlah respons terlalu kecil.

**Data Dummy (`dummy`)**

Sebanyak 98 respons merupakan data simulasi yang digunakan untuk demonstrasi Data Wrangling, EDA, dan visualisasi.

Data dummy tidak dianggap sebagai hasil survei pelanggan nyata dan tidak digunakan sebagai dasar kesimpulan bisnis.

File `survey_clean.csv` mempertahankan kedua jenis data untuk dokumentasi, sedangkan `survey_actual.csv` dan `survey_dummy.csv` digunakan untuk analisis secara terpisah.

### 3.4 Aturan Validasi

1. Setiap respons harus memiliki `response_id` yang unik.
2. `data_type` hanya boleh bernilai `actual` atau `dummy`.
3. Data dummy tidak boleh dimasukkan ke dalam analisis kebutuhan pelanggan nyata.
4. Nilai `information_difficulty` harus berada dalam rentang 1–5.
5. `additional_feedback` boleh kosong karena merupakan pertanyaan opsional.
6. Jawaban terbuka tidak boleh diubah tanpa alasan pembersihan yang terdokumentasi.
7. Data aktual yang digunakan harus memiliki persetujuan yang sesuai dengan tujuan pengumpulan.
8. Nilai `consent = Setuju` pada data dummy merupakan bagian dari simulasi, bukan persetujuan orang sungguhan.
9. Konsistensi antara `information_needed` dan `main_information` perlu diperiksa sesuai rancangan pertanyaan survei.

### 3.5 Hasil Pemeriksaan Kualitas

| Pemeriksaan | Hasil |
|---|---|
| Total record | 100 |
| Respons actual | 2 |
| Respons dummy | 98 |
| Duplikasi seluruh baris | 0 |
| Duplikasi response_id | 0 |
| Missing additional_feedback | 1 |
| Skala information_difficulty | Nilai berada dalam rentang 1–5 pada pemeriksaan awal |
| Consent tercatat | Seluruh record berisi Setuju |
| Ketidaksesuaian jawaban aktual | 1 respons perlu ditinjau |

Pemeriksaan konsistensi menemukan bahwa respons R002 memilih Harga sebagai informasi utama, tetapi Harga tidak tercantum dalam daftar `information_needed`.

Temuan tersebut dipertahankan sebagai catatan pemeriksaan. Perbedaan hanya dapat dinyatakan sebagai kesalahan apabila rancangan pertanyaan memang mensyaratkan informasi utama berasal dari daftar pilihan sebelumnya.

### 3.6 Hasil Analisis Aktual

Berdasarkan dua respons aktual, kedua responden menyatakan pernah mengunjungi Kopilogi dan memilih Harga sebagai informasi utama.

Kedua responden juga mencantumkan Jam Operasional dalam daftar kebutuhan informasi. Platform pencarian yang dipilih adalah Google Maps dan Instagram.

Hasil ini merupakan masukan eksploratif dari dua individu, bukan kesimpulan mengenai preferensi seluruh pelanggan Kopilogi.

### 3.7 Penggunaan Data untuk Demonstrasi

Data dummy digunakan untuk mendemonstrasikan analisis frekuensi, distribusi kebutuhan informasi, platform pencarian, dan skala kesulitan menggunakan Python, pandas, serta matplotlib.

Setiap tabel, grafik, dan laporan yang berasal dari data dummy wajib mencantumkan keterangan:

**"Data simulasi untuk demonstrasi analisis. Bukan hasil survei pelanggan Kopilogi."**

Data aktual dan dummy tidak boleh digabung untuk menghasilkan persentase kebutuhan pelanggan.

### 3.8 Privasi dan Batasan Penggunaan

Dataset survei tidak boleh dipublikasikan secara mentah tanpa pemeriksaan privasi dan izin penggunaan.

Sebelum membagikan data kepada anggota tim, pastikan informasi yang dapat mengidentifikasi responden tidak disertakan apabila tidak diperlukan.

Data dummy harus tetap memiliki label yang jelas dan tidak boleh diubah menjadi actual untuk memenuhi target jumlah responden.

Hasil analisis survei dapat digunakan sebagai referensi metode dan masukan awal pengembangan website, tetapi belum cukup untuk menetapkan prioritas kebutuhan pelanggan secara umum.

### 3.9 Rekomendasi untuk Tim

Tim Full-Stack dapat menggunakan struktur dataset survei sebagai referensi jika website nantinya menyediakan fitur pengumpulan umpan balik pengguna.

Tim Data Science dapat menggunakan data dummy untuk menguji alur analisis dan visualisasi tanpa menyatakan bahwa hasilnya mencerminkan kondisi pelanggan.

Apabila respons aktual tambahan berhasil dikumpulkan, data tersebut perlu melalui proses assessing dan cleaning sebelum dimasukkan ke analisis aktual.

Dataset survei tidak diperlukan untuk menjawab pertanyaan chatbot tentang sejarah, menu, atau informasi cabang. Sumber chatbot sebaiknya menggunakan dataset informasi operasional yang relevan dan telah diperiksa.

## 4. Dataset Coffee Shop Sales (Publik)

### 4.1 Informasi Dataset

| Atribut | Keterangan |
|---|---|
| Nama dataset | Coffee Shop Sales |
| File sumber | `Coffee Shop Sales.xlsx` |
| File hasil cleaning | `coffee_shop_sales_clean.csv` |
| Sumber platform | Kaggle |
| Jenis data | `public` |
| Jumlah record | 149.116 |
| Jumlah kolom awal | 11 |
| Jumlah kolom hasil cleaning | 16 |
| Periode data | 1 Januari – 30 Juni 2023 |
| Jumlah lokasi toko | 3 |
| Jumlah kategori produk asli | 9 |
| Jumlah kategori umum | 5 |
| Lisensi | Belum dikonfirmasi |
| Mata uang | Belum dikonfirmasi |
| Status | Data Assessing, Data Cleaning, dan EDA versi awal selesai |

Dataset Coffee Shop Sales digunakan sebagai sumber eksternal untuk mendemonstrasikan proses pengolahan dan analisis data transaksi pada usaha coffee shop.

Dataset ini tidak berasal dari sistem transaksi Kopilogi dan tidak menggambarkan penjualan, jumlah pelanggan, produk terlaris, maupun performa cabang Kopilogi.

### 4.2 Struktur Kolom

| Nama Kolom | Tipe Data | Deskripsi | Contoh Nilai | Aturan Validasi |
|---|---|---|---|---|
| `transaction_id` | integer | Identitas record transaksi | 1 | Wajib, unik pada versi dataset ini |
| `transaction_date` | date/datetime | Tanggal transaksi | 2023-01-01 | Format tanggal valid |
| `transaction_time` | string | Waktu transaksi | 07:06:11 | Format HH:mm:ss |
| `transaction_qty` | integer | Jumlah unit pada record | 2 | Bilangan bulat positif |
| `store_id` | integer | Identitas toko pada dataset publik | 5 | Tidak boleh diganti dengan ID cabang Kopilogi |
| `store_location` | string | Nama lokasi toko | Lower Manhattan | Sesuai sumber |
| `product_id` | integer | Identitas produk | 32 | Konsisten dengan informasi produk |
| `unit_price` | float | Harga satuan produk | 3.00 | Numerik dan positif |
| `product_category` | string | Kategori asli produk | Coffee | Pertahankan kategori sumber |
| `product_type` | string | Jenis produk | Gourmet brewed coffee | Pertahankan nilai sumber |
| `product_detail` | string | Detail atau nama produk | Ethiopia Rg | Pertahankan nilai sumber |
| `total_amount` | float | Nilai penjualan terhitung per record | 6.00 | transaction_qty × unit_price |
| `category_group` | string | Kelompok kategori hasil preparation | beverage | Berdasarkan tabel pemetaan |
| `data_type` | string | Jenis data | public | Seluruh record bernilai public |
| `source_dataset` | string | Nama dataset sumber | Coffee Shop Sales | Tidak kosong |
| `source_platform` | string | Platform penyedia dataset | Kaggle | Tidak kosong |

### 4.3 Kolom Hasil Feature Engineering

Dua kolom ditambahkan untuk mendukung analisis.

**1. `total_amount`**

Kolom ini dihitung menggunakan rumus:

`total_amount = transaction_qty * unit_price`

Contoh:

Jika `transaction_qty = 2` dan `unit_price = 3.00`, maka `total_amount = 6.00`.

Nilai tersebut merupakan nilai penjualan bruto terhitung berdasarkan atribut yang tersedia, bukan laba bersih. Dataset tidak menyediakan informasi biaya produksi, diskon, pajak, maupun pengembalian dana yang dapat digunakan untuk menghitung laba bersih.

**2. `category_group`**

Kolom ini digunakan untuk mengelompokkan kategori produk ke dalam kelompok analisis yang lebih umum.

Kategori asli tetap disimpan pada `product_category` agar informasi sumber tidak hilang.

### 4.4 Pemetaan Kategori Produk

| Kategori Asli | Kategori Umum |
|---|---|
| Coffee | beverage |
| Tea | beverage |
| Drinking Chocolate | beverage |
| Bakery | food |
| Packaged Chocolate | food |
| Coffee beans | retail |
| Loose Tea | retail |
| Branded | merchandise |
| Flavours | other |

Hasil pemetaan menghasilkan lima kategori umum, yaitu `beverage`, `food`, `retail`, `merchandise`, dan `other`.

Pemetaan dilakukan untuk kebutuhan analisis. Kategori tersebut tidak menyatakan bahwa produk pada dataset publik sama dengan produk Kopilogi.

### 4.5 Hasil Pemeriksaan Kualitas

| Pemeriksaan | Hasil |
|---|---|
| Total record | 149.116 |
| Missing values | 0 |
| Duplikasi seluruh baris | 0 |
| Duplikasi transaction_id | 0 |
| Harga nol atau negatif | 0 |
| Kuantitas nol atau negatif | 0 |
| Product ID dengan variasi harga | 15 |
| Format waktu tidak valid setelah cleaning | 0 |
| Kategori umum belum dipetakan | 0 |

Variasi harga pada 15 product_id dipertahankan karena belum terdapat bukti bahwa perbedaan tersebut merupakan kesalahan pencatatan.

### 4.6 Hasil Analisis Deskriptif

Hasil EDA pada dataset publik menunjukkan:

| Indikator | Hasil |
|---|---:|
| Total nilai penjualan terhitung | 698.812,33 |
| Total unit terjual | 214.470 |
| Jumlah record | 149.116 |
| Jumlah produk unik | 80 |
| Kontribusi kategori Coffee | 38,63% |
| Kontribusi kategori Tea | 28,11% |
| Bulan dengan nilai penjualan tertinggi | Juni 2023 |
| Lokasi dengan nilai penjualan tertinggi | Hell's Kitchen |
| Produk dengan nilai penjualan tertinggi | Sustainably Grown Organic Lg |
| Jam dengan aktivitas record tertinggi | 10.00 |

Seluruh hasil tersebut hanya menggambarkan dataset Coffee Shop Sales publik.

### 4.7 Aturan Validasi

1. `transaction_id` tidak boleh kosong dan harus unik pada dataset yang digunakan.
2. `transaction_date` harus memiliki format tanggal yang valid.
3. `transaction_time` menggunakan format HH:mm:ss.
4. `transaction_qty` harus berupa bilangan bulat positif.
5. `unit_price` harus berupa angka positif.
6. `total_amount` harus sesuai dengan hasil perkalian kuantitas dan harga satuan, dengan toleransi pembulatan yang ditetapkan.
7. `product_id` harus konsisten dengan kategori, jenis, dan detail produk yang tercatat.
8. Variasi harga tidak boleh dihapus tanpa bukti kesalahan.
9. `category_group` harus mengikuti tabel pemetaan yang terdokumentasi.
10. `data_type` harus bernilai `public`.

### 4.8 Keterbatasan Dataset

Dataset ini memiliki beberapa keterbatasan.

Pertama, data berasal dari sumber eksternal dan tidak merepresentasikan aktivitas penjualan Kopilogi.

Kedua, dataset tidak menyediakan informasi yang cukup untuk menyimpulkan penyebab perubahan nilai penjualan, termasuk pengaruh promosi atau perubahan jumlah pelanggan.

Ketiga, lisensi penggunaan dan mata uang belum dikonfirmasi dari dokumentasi sumber.

Keempat, nilai penjualan dihitung berdasarkan kuantitas dan harga satuan tanpa informasi tambahan mengenai biaya, diskon, atau pengembalian dana.

Oleh karena itu, hasil analisis hanya digunakan untuk demonstrasi proses pengolahan data dan perancangan visualisasi.

### 4.9 Aturan Penggunaan Dataset Publik

1. Dataset hanya digunakan untuk demonstrasi analisis transaksi.
2. Nama lokasi toko tidak boleh diganti menjadi nama cabang Kopilogi.
3. Nama produk publik tidak boleh diganti menjadi nama menu Kopilogi.
4. Harga tidak boleh dikonversi menjadi rupiah tanpa dasar mata uang dan kurs yang jelas.
5. Hasil analisis tidak boleh dinyatakan sebagai pendapatan atau penjualan Kopilogi.
6. Setiap visualisasi harus diberi keterangan bahwa data berasal dari dataset publik.
7. Distribusi ulang file sumber atau turunannya harus mengikuti ketentuan lisensi yang telah diverifikasi.

### 4.10 Rekomendasi Penggunaan untuk Dashboard

Dataset ini dapat digunakan sebagai bahan demonstrasi dashboard analisis penjualan.

Indikator yang dapat ditampilkan meliputi total nilai penjualan, total unit terjual, jumlah record transaksi, tren penjualan bulanan, kontribusi kategori, produk teratas, dan aktivitas transaksi berdasarkan jam.

Filter yang dapat digunakan meliputi periode tanggal, lokasi toko, dan kategori produk.

Dashboard harus memiliki penanda yang jelas:

**"Demo Dashboard — Public Coffee Shop Sales Dataset. Not Kopilogi Transaction Data."**

Jika pada masa mendatang Kopilogi menyediakan data transaksi aktual, struktur analisis dapat digunakan kembali setelah disesuaikan dengan format, definisi atribut, dan kebutuhan bisnis Kopilogi.

## 5. Relasi Dataset dan Panduan Serah Terima

### 5.1 Tujuan

Bagian ini menjelaskan hubungan antar dataset, format data yang diserahkan, aturan validasi, dan panduan penggunaan hasil Data Science oleh tim Full-Stack Developer dan AI Engineer.

Serah terima bertujuan memastikan data dapat digunakan secara konsisten tanpa menghilangkan informasi sumber atau mencampurkan data operasional Kopilogi dengan data publik dan dummy.

### 5.2 Daftar Dataset

| Dataset | File | Jenis Data | Penggunaan |
|---|---|---|---|
| Menu Kopilogi | `menus_clean.csv` | actual, sumber sekunder | Katalog website dan analisis menu |
| Cabang Kopilogi | `branches_clean.csv` | actual, sumber sekunder | Informasi cabang website dan chatbot |
| Informasi Umum | Sheet `general_information` | actual, sumber sekunder/wawancara | Profil, sejarah, dan pengetahuan chatbot |
| Survei Aktual | `survey_actual.csv` | actual | Masukan eksploratif dari dua responden |
| Survei Dummy | `survey_dummy.csv` | dummy | Demonstrasi pengolahan dan visualisasi |
| Coffee Shop Sales | `coffee_shop_sales_clean.csv` | public | Demonstrasi analisis transaksi |

Label `actual` menunjukkan data yang berasal dari sumber nyata, bukan berarti seluruh isinya telah dikonfirmasi oleh PIC.

### 5.3 Relasi Dataset Operasional

Dataset `branches_clean.csv` dan `menus_clean.csv` memiliki relasi satu-ke-banyak.

- Primary key cabang: `branch_id`
- Primary key menu: `menu_id`
- Foreign key logis pada menu: `branch_id`

Setiap menu harus terhubung dengan salah satu cabang yang tercatat.

Contoh relasi:

`BR001 → M001, M002, M003, ...`

Pada implementasi MongoDB, `branch_id` dapat digunakan sebagai identitas bisnis atau dipetakan ke `_id` dokumen cabang sesuai Mongoose Schema yang digunakan Full-Stack.

Dataset `general_information` tidak memerlukan foreign key cabang karena menyimpan informasi yang berlaku secara umum untuk Kopilogi.

Dataset survei dan Coffee Shop Sales tidak memiliki relasi transaksi langsung dengan cabang Kopilogi.

### 5.4 Format Serah Terima

Format yang direkomendasikan adalah:

| Format | Penggunaan |
|---|---|
| CSV UTF-8 | Pertukaran dataset tabular |
| JSON | Integrasi API atau impor MongoDB |
| Markdown | Data dictionary, catatan sumber, dan panduan penggunaan |
| PNG | Grafik hasil EDA |
| Jupyter Notebook | Dokumentasi proses pengolahan dan analisis |

File CSV digunakan sebagai hasil cleaning, sedangkan JSON dapat dibuat setelah struktur Mongoose disepakati.

### 5.5 Panduan untuk Full-Stack Developer

Tim Full-Stack dapat menggunakan dataset menu dan cabang sebagai referensi data website.

Sebelum integrasi, perlu disepakati hal berikut:

1. Pemetaan `branch_id` dan `_id` MongoDB.
2. Nama field yang digunakan pada Mongoose Schema.
3. Format harga sebagai angka.
4. Format jam operasional sebagai string `HH:mm`.
5. Format fasilitas sebagai array jika diperlukan.
6. Penanganan nilai kosong pada best seller, ketersediaan, dan tautan GrabFood.
7. Penggunaan URL gambar dari Cloudinary.
8. Kebijakan publikasi informasi yang belum terverifikasi.
9. Mekanisme pembaruan data melalui Admin Cabang dan Super Admin.

Dataset hasil cleaning tidak boleh langsung menimpa data produksi tanpa pemeriksaan dan persetujuan tim.

### 5.6 Panduan untuk AI Engineer

Dataset informasi cabang, katalog menu, dan informasi umum dapat digunakan sebagai sumber pengetahuan chatbot.

Sumber jawaban chatbot perlu mempertahankan hubungan antara informasi dan cabang.

Contohnya, pertanyaan mengenai jam operasional Kopilogi Tasik harus menggunakan informasi BR003, bukan jam operasional cabang lain.

Informasi yang belum tersedia atau belum dapat dipastikan tidak boleh dilengkapi dengan jawaban buatan.

Dataset survei dummy dan transaksi Kaggle tidak digunakan sebagai sumber fakta operasional chatbot Kopilogi.

Jika AI Engineer menggunakan pendekatan retrieval atau knowledge base, data dapat disediakan dalam bentuk JSON yang memuat identitas, kategori informasi, isi, sumber, dan status verifikasi.

### 5.7 Panduan Dashboard Demonstrasi

Dataset Coffee Shop Sales hanya digunakan untuk demonstrasi dashboard analisis transaksi.

Dashboard dapat menampilkan:

- Total nilai penjualan terhitung.
- Total unit terjual.
- Jumlah record transaksi.
- Tren nilai penjualan bulanan.
- Kontribusi kategori produk.
- Produk dengan nilai penjualan tertinggi.
- Aktivitas transaksi berdasarkan jam.
- Perbandingan lokasi toko.

Dashboard harus menampilkan label:

**Demo Dashboard — Public Coffee Shop Sales Dataset. Not Kopilogi Transaction Data.**

Data publik tidak boleh digabungkan ke dalam collection transaksi operasional Kopilogi.

### 5.8 Validasi Sebelum Handoff

Sebelum menyerahkan data kepada tim lain, lakukan pemeriksaan berikut:

| Pemeriksaan | Kriteria |
|---|---|
| Identitas menu | `menu_id` unik |
| Identitas cabang | `branch_id` unik |
| Relasi menu-cabang | Seluruh `branch_id` menu tersedia pada dataset cabang |
| Harga menu | Numerik dan positif |
| Format jam | HH:mm |
| Format URL | Memenuhi format dasar dan diperiksa tujuan tautannya |
| Missing values | Tidak diisi dengan asumsi tanpa bukti |
| Status verifikasi | Dipertahankan sesuai hasil pemeriksaan |
| Jenis data | actual, dummy, atau public sesuai asal |
| Dataset publik | Terpisah dari data operasional Kopilogi |
| Survei aktual | Tidak dicampur dengan respons dummy |
| Data pribadi | Tidak disertakan jika tidak diperlukan |

Validasi struktur tidak menggantikan pemeriksaan kebenaran informasi terhadap sumber aslinya.

### 5.9 Status Verifikasi dan Keterbatasan

Informasi cabang masih memiliki status `pending_pic`, sedangkan sebagian informasi menu baru diperiksa berdasarkan sumber sekunder.

Oleh karena itu, dataset dapat digunakan untuk pengembangan dan pengujian integrasi, tetapi kelayakan publikasi informasi harus ditentukan berdasarkan bukti sumber dan kebijakan yang disepakati tim.

Dataset Coffee Shop Sales tidak merepresentasikan penjualan Kopilogi. Lisensi dan mata uang sumber perlu dikonfirmasi sebelum distribusi publik.

Dataset Customer Survey memiliki dua respons aktual dan 98 respons dummy. Hasil dummy hanya digunakan untuk demonstrasi, bukan sebagai bukti kebutuhan pelanggan.

### 5.10 Prosedur Serah Terima

Prosedur yang direkomendasikan:

1. Data Science menyelesaikan cleaning dan validasi teknis.
2. Data Science menyediakan data dictionary dan catatan keterbatasan.
3. Full-Stack dan AI Engineer memeriksa kesesuaian struktur data dengan kebutuhan sistem.
4. Tim menyepakati pemetaan field, aturan null, serta status publikasi.
5. Data diimpor ke lingkungan pengembangan atau staging.
6. Tim melakukan pengujian integrasi dan mencatat masalah.
7. Data Science memperbaiki masalah data yang terkonfirmasi.
8. Tim menyetujui versi dataset yang digunakan dalam MVP.

### 5.11 Kesimpulan

Dataset operasional Kopilogi, survei, dan transaksi publik memiliki tujuan serta batasan penggunaan yang berbeda.

Dataset menu, cabang, dan informasi umum mendukung penyajian informasi website dan chatbot. Dataset survei digunakan untuk eksplorasi terbatas dan demonstrasi pengolahan data, sedangkan dataset transaksi publik digunakan untuk mendemonstrasikan analisis penjualan.

Dokumentasi ini menjadi acuan awal agar hasil pekerjaan Data Science dapat dimanfaatkan oleh anggota tim lain secara konsisten, transparan, dan sesuai keterbatasan data yang tersedia.

## 6. Dataset General Information

### 6.1 Informasi Dataset

| Atribut | Keterangan |
|---|---|
| Nama dataset | `general_information` |
| Lokasi sumber | Sheet `general_information` pada `Dataset Capstone.xlsx` |
| Jumlah record awal | 9 |
| Jumlah kolom | 9 |
| Jenis data | Informasi umum Kopilogi dari wawancara dan sumber sekunder |
| Penggunaan | Profil website, sejarah usaha, dan sumber informasi chatbot |
| Status | Dataset awal telah disusun; validasi kualitas khusus dataset ini masih diperlukan |

Dataset `general_information` berisi informasi yang berlaku untuk Kopilogi secara keseluruhan, bukan untuk satu cabang tertentu.

Setiap record merepresentasikan satu topik informasi, seperti sejarah, profil usaha, jenis produk, layanan pemesanan, atau tujuan pengembangan website.

### 6.2 Struktur Kolom

| Nama Kolom | Tipe Data | Deskripsi | Contoh Nilai | Aturan Validasi |
|---|---|---|---|---|
| `info_id` | string | Identitas unik informasi | INF001 | Wajib, unik, tidak kosong |
| `info_key` | string | Kode topik informasi | business_history | Wajib, menggunakan snake_case |
| `title` | string | Judul informasi | Sejarah Kopilogi | Wajib, tidak kosong |
| `content` | string | Isi informasi | Kopilogi merupakan usaha makanan dan minuman | Tidak kosong dan harus memiliki dasar sumber |
| `source` | string | Asal informasi | wawancara | Harus dapat ditelusuri |
| `source_url` | nullable string | Tautan atau referensi sumber | URL atau referensi dokumen wawancara | Boleh kosong jika sumber tidak memiliki URL; gunakan referensi dokumen |
| `accessed_at` | date | Tanggal akses atau pencatatan | 2026-11-10 | Format YYYY-MM-DD |
| `verification_status` | string | Status pemeriksaan informasi | pending_pic | Mengikuti daftar status verifikasi yang disepakati |
| `data_type` | string | Jenis data | actual | actual / public / dummy |

### 6.3 Topik Informasi

Dataset awal mencakup sembilan topik berikut:

| info_id | info_key | Judul |
|---|---|---|
| INF001 | business_history | Sejarah Kopilogi |
| INF002 | business_profile | Profil Kopilogi |
| INF003 | product_types | Jenis Produk |
| INF004 | ordering_channels | Layanan Pemesanan |
| INF005 | social_media | Media Sosial |
| INF006 | business_branches | Cabang Kopilogi |
| INF007 | ordering_process | Proses Pemesanan |
| INF008 | payment_methods | Metode Pembayaran |
| INF009 | website_purpose | Tujuan Website |

Daftar tersebut mengikuti rancangan dataset awal. Nilai aktual setiap record harus diperiksa kembali terhadap file Excel dan sumber yang digunakan.

Informasi `website_purpose` merupakan konteks pengembangan proyek, bukan fakta sejarah atau layanan operasional Kopilogi.

### 6.4 Aturan Validasi

1. Setiap informasi harus memiliki `info_id` yang unik.
2. `info_key` menggunakan format snake_case dan tidak boleh kosong.
3. Judul dan isi informasi harus tersedia.
4. Isi informasi tidak boleh ditambahkan berdasarkan asumsi tanpa penandaan.
5. Sumber informasi harus dapat ditelusuri melalui tautan atau referensi dokumen.
6. Tanggal akses harus sesuai dengan waktu pengumpulan yang sebenarnya.
7. Status verifikasi tidak boleh diubah menjadi terverifikasi PIC tanpa bukti.
8. Informasi umum tidak boleh digunakan untuk menggantikan informasi khusus cabang.
9. Informasi yang dapat berubah, seperti metode pembayaran atau layanan pemesanan, perlu diperiksa sebelum dipublikasikan.

### 6.5 Relasi dengan Dataset Lain

Dataset `general_information` tidak memiliki foreign key langsung dengan dataset `branches` atau `menus`.

Hubungannya bersifat kontekstual.

- `general_information` menjelaskan profil dan informasi umum usaha.
- `branches` menyediakan informasi spesifik setiap cabang.
- `menus` menyediakan informasi katalog menu berdasarkan cabang.

Jika terdapat informasi yang sama pada beberapa dataset, tim perlu menentukan sumber utama yang digunakan agar tidak terjadi perbedaan jawaban.

Sebagai contoh, daftar cabang aktif sebaiknya mengacu pada dataset `branches`, sedangkan sejarah usaha mengacu pada `general_information`.

### 6.6 Penggunaan untuk Website

Tim Full-Stack dapat menggunakan dataset ini untuk mendukung halaman profil, sejarah, dan informasi umum Kopilogi.

Sebelum integrasi, perlu disepakati apakah informasi akan disimpan dalam collection tersendiri atau menggunakan struktur konten yang sudah tersedia pada MongoDB.

Dataset tidak boleh langsung menggantikan konten website tanpa pemeriksaan kesesuaian sumber dan persetujuan tim.

### 6.7 Penggunaan untuk AI Engineer

Dataset ini dapat menjadi salah satu sumber pengetahuan chatbot Kopilogi.

Contoh kebutuhan informasi yang dapat didukung:

- Pertanyaan mengenai sejarah Kopilogi.
- Pertanyaan mengenai profil usaha.
- Pertanyaan mengenai jenis produk.
