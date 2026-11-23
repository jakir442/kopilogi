# Laporan Exploratory Data Analysis (EDA) Customer Survey Kopilogi

## 1. Tujuan Analisis

Analisis ini dilakukan untuk mengeksplorasi kebutuhan informasi pengguna yang berkaitan dengan pengembangan website Kopilogi serta mendemonstrasikan pengolahan data survei menggunakan Python.

## 2. Dataset dan Metode

Dataset yang digunakan berasal dari `customer_survey` yang terdiri atas 100 record, yaitu 2 respons aktual dan 98 respons dummy.

Data aktual dan dummy dipisahkan sebelum analisis. Metode yang digunakan meliputi analisis frekuensi, pemeriksaan konsistensi jawaban, serta visualisasi menggunakan Python, pandas, dan matplotlib.

## 3. Hasil Analisis

### 3.1 Analisis Respons Aktual

Berdasarkan dua respons aktual yang tersedia, kedua responden menyatakan pernah mengunjungi Kopilogi dan memilih harga sebagai informasi utama yang dibutuhkan.

Pada pertanyaan mengenai informasi yang dicari, responden R001 memilih jam operasional, lokasi, fasilitas, harga, dan menu. Sementara itu, responden R002 memilih promo/event dan jam operasional.

Kedua responden menggunakan platform pencarian informasi yang berbeda, yaitu Google Maps dan Instagram. Skor kesulitan yang tercatat masing-masing adalah 2 dan 3 pada skala 1–5.

Hasil pemeriksaan juga menemukan ketidaksesuaian pada respons R002, yaitu pemilihan harga sebagai informasi utama meskipun harga tidak tercantum dalam daftar informasi yang dipilih. Ketidaksesuaian tersebut perlu diperiksa terhadap rancangan pertanyaan survei.

Jumlah respons aktual yang sangat terbatas menyebabkan hasil analisis hanya dapat digunakan sebagai masukan eksploratif, bukan sebagai gambaran umum kebutuhan pelanggan Kopilogi.

### 3.2 Demonstrasi Analisis Data Dummy

Sebanyak 98 respons dummy digunakan secara terpisah untuk mendemonstrasikan proses Exploratory Data Analysis, termasuk distribusi kebutuhan informasi, platform pencarian, dan skala kesulitan.

Hasil analisis dummy tidak digunakan untuk menyimpulkan kebutuhan atau perilaku pelanggan Kopilogi.

## 4. Temuan dan Rekomendasi

Kedua responden aktual memilih harga sebagai informasi utama. Temuan ini dapat menjadi masukan awal untuk mengevaluasi kemudahan menemukan informasi harga pada website Kopilogi.

Namun, rekomendasi penyajian informasi tidak hanya didasarkan pada dua respons tersebut. Tim perlu mempertimbangkan kebutuhan yang telah disampaikan Kopilogi dalam wawancara dan hasil usability testing yang dilakukan Full-Stack.

Selain itu, konsistensi jawaban survei perlu diperiksa agar hasil analisis dapat dipertanggungjawabkan.

## 5. Keterbatasan

Dataset hanya memiliki dua respons aktual sehingga tidak cukup untuk menghasilkan kesimpulan yang mewakili pelanggan Kopilogi secara umum.

Sebanyak 98 respons lainnya merupakan data dummy untuk demonstrasi pengolahan dan visualisasi. Data tersebut tidak digunakan sebagai bukti kondisi pelanggan sebenarnya.

## 6. Kesimpulan

Proses Data Wrangling dan EDA pada dataset customer survey telah dilakukan dengan memisahkan data aktual dan dummy.

Dari dua respons aktual, harga dipilih sebagai informasi utama oleh kedua responden. Namun, hasil ini bersifat eksploratif dan masih memerlukan dukungan data tambahan sebelum dapat dijadikan dasar penentuan prioritas kebutuhan pelanggan secara umum.

### Pemeriksaan Konsistensi Jawaban

Pemeriksaan terhadap dua respons aktual menunjukkan bahwa satu respons memiliki perbedaan antara informasi yang dibutuhkan dan informasi utama yang dipilih. Pada respons R002, informasi utama yang dipilih adalah harga, sedangkan daftar kebutuhan informasi hanya mencakup promo/event dan jam operasional.

Perbedaan tersebut dicatat sebagai temuan yang perlu ditinjau berdasarkan rancangan pertanyaan survei. Respons tidak dihapus atau diubah karena belum terdapat dasar yang cukup untuk menyatakannya sebagai kesalahan pengisian.