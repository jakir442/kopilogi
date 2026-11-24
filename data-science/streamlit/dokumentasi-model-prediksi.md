
# Dokumentasi Model Prediksi Kategori Menu KOPILOGI

## 1. Tujuan Model

Model ini dibuat untuk membantu memprediksi kategori suatu menu berdasarkan nama dan deskripsi menu.

Model dapat digunakan sebagai fitur pendukung ketika pengguna menambahkan data menu baru ke dalam aplikasi.

## 2. Dataset

Sumber data:
chatbot_data/menu_chatbot.csv

Jumlah data: 183 menu

Jumlah kategori: 20 kategori

Pembagian dataset:
- Data training: 146 (80%)
- Data testing: 37 (20%)

Pembagian dilakukan menggunakan train_test_split dengan stratify agar distribusi kategori tetap diperhatikan.

## 3. Feature Engineering

Terdapat tiga variasi fitur yang diuji:

1. Nama menu saja.
2. Deskripsi menu saja.
3. Gabungan nama dan deskripsi menu.

Ekstraksi fitur teks menggunakan TF-IDF dengan n-gram (1,2).

## 4. Algoritma

Dua algoritma yang dibandingkan:
- Multinomial Naive Bayes
- Logistic Regression

Model terbaik dipilih berdasarkan nilai F1 Macro.

## 5. Hasil Perbandingan Algoritma

Multinomial Naive Bayes:
- Akurasi: 67,57%
- F1 Macro: 53,35%

Logistic Regression:
- Akurasi: 89,19%
- F1 Macro: 92,68%

Logistic Regression dipilih sebagai model awal.

## 6. Hasil Perbandingan Feature Engineering

| Fitur | Akurasi | F1 Macro |
|---|---:|---:|
| Nama menu saja | 75,68% | 74,39% |
| Deskripsi saja | 89,19% | 92,60% |
| Nama + deskripsi | 89,19% | 92,68% |

Fitur gabungan nama dan deskripsi dipilih karena menghasilkan F1 Macro tertinggi.

## 7. Pengujian Prediksi

Model diuji menggunakan contoh:
- Nama menu: Orange BBQ
- Deskripsi: Wings platter dengan saus Orange BBQ
- Hasil prediksi: Wings Platter
- Skor model: 21,93%

Hasil ini menunjukkan model dapat menerima input baru dan menghasilkan prediksi kategori.

Skor probabilitas bukan jaminan bahwa prediksi benar.

## 8. Keterbatasan Model

- Dataset hanya terdiri dari 183 data.
- Distribusi data setiap kategori tidak seimbang.
- Beberapa kategori memiliki jumlah sampel sangat sedikit.
- Kategori Ngopay (Paket) hanya memiliki dua data sehingga tidak muncul pada data testing.
- Hasil evaluasi masih bersifat awal dan belum menjamin performa pada data baru.
- Model hanya memprediksi kategori menu, bukan penjualan atau persediaan.

## 9. Kesimpulan

Model Logistic Regression dengan ekstraksi fitur TF-IDF dan fitur gabungan nama serta deskripsi menu dipilih sebagai model awal prediksi kategori menu KOPILOGI.

Model ini dapat dikembangkan lebih lanjut dan diintegrasikan ke aplikasi web sebagai fitur rekomendasi kategori menu.
