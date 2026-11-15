# Kopilogi Content CMS — Cabang 1

## Route

- Admin: `/admin/cabang-1?tab=content`
- Public: `/cabang-1`

## Modul

1. Gallery
2. Event & Activities
3. Advertisement & Promotion
4. Community & Moments
5. News & Updates
6. Social Media Highlights

## Fitur

- Create, read, update, delete konten.
- Draft, published, dan archived.
- Jadwal mulai/akhir publikasi.
- Upload cover dan beberapa foto tambahan ke Cloudinary.
- URL gambar manual juga didukung.
- Preview sebelum menyimpan.
- Pengaturan featured, kategori, tag, urutan, dan ukuran card.
- Public page hanya menampilkan konten Cabang 1 yang published dan berada dalam rentang publikasinya.
- Semua operasi admin memverifikasi role dan akses cabang di server.

## Environment

Upload menggunakan konfigurasi Cloudinary yang juga dipakai oleh pengelolaan menu:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

Gunakan unsigned upload preset Cloudinary yang sudah dikonfigurasi untuk project. File diunggah ke folder `kopilogi/cabang-1/content`.

Database menggunakan `MONGODB_URI` yang sudah digunakan aplikasi. Mongoose akan membuat collection `branchcontents` secara otomatis saat dokumen pertama disimpan.

## Catatan pengembangan

- Integrasi UI publik saat ini sengaja hanya diaktifkan untuk Cabang 1.
- Model dan server actions sudah memakai `branchId`, sehingga dapat digunakan ulang oleh Cabang 2 dan Cabang 4 saat integrasi publik masing-masing dikerjakan.
- Cabang lain tidak mengambil atau menampilkan konten Cabang 1.
- Jalankan `npm install`, lalu `npm run dev` di environment lokal yang memiliki `.env.local`.
