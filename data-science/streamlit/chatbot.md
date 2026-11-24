
# KNOWLEDGE BASE CHATBOT KOPILOGI

## 1. Deskripsi
Knowledge base ini merupakan kumpulan data informasi KOPILOGI
yang dipersiapkan untuk mendukung pengembangan chatbot informasi.

## 2. Sumber Data
Data berasal dari dataset_kopilogi.xlsx.

Sheet yang digunakan:
- branches
- menu
- general_information

## 3. Jumlah Data
- Data cabang: 3
- Data menu: 183
- Informasi umum: 9

Total: 195 record.

## 4. File yang Tersedia

- cabang_chatbot.csv
  Berisi informasi cabang, alamat, jam operasional,
  nomor telepon, fasilitas, dan tautan layanan.

- menu_chatbot.csv
  Berisi nama menu, kategori, deskripsi, harga,
  gambar, dan nama cabang.

- informasi_chatbot.csv
  Berisi profil, sejarah, dan informasi umum KOPILOGI.

- data_dictionary.xlsx
  Berisi penjelasan setiap kolom dataset.

- knowledge_base_kopilogi.json
  Berisi gabungan seluruh informasi dalam format JSON.

## 5. Status Verifikasi

- Data cabang: pending_pic
- Data menu: source_checked
- Informasi umum: pending_pic

Informasi dengan status pending_pic perlu
mendapatkan persetujuan PIC sebelum digunakan
sebagai informasi resmi chatbot.

## 6. Catatan Penggunaan

- Jangan membuat informasi yang tidak tersedia dalam dataset.
- Jika informasi tidak ditemukan, chatbot harus menyatakan
  bahwa informasi tersebut belum tersedia.
- Harga dan informasi cabang perlu mengikuti verifikasi terbaru.
- Data ini merupakan knowledge base, bukan aplikasi chatbot.

## 7. Kesimpulan

Knowledge base Chatbot KOPILOGI telah disiapkan
dalam format CSV dan JSON dengan total 195 record.
Data ini dapat digunakan sebagai sumber informasi
awal untuk pengembangan chatbot KOPILOGI.
