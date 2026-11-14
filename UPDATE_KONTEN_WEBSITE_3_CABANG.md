# Update CMS Konten Website Kopilogi — 3 Cabang

Paket ini mencakup pengelolaan dan tampilan konten website untuk:
- Cabang 1 — Kopilogi Cikuray
- Cabang 2 — Waroeng Kopilogi
- Cabang 4 — Kopilogi Tasik

## Perubahan
1. Halaman publik ketiga cabang mengambil konten Published berdasarkan slug cabang masing-masing.
2. Bagian konten website ditampilkan setelah katalog menu, sebelum informasi cabang dan footer.
3. Cabang 2 menggunakan tema heritage cream, cokelat kayu, dan aksen hijau alami.
4. Cabang 4 menggunakan tema contemporary terang dengan aksen gold.
5. Menu CMS Cabang 2 dan Cabang 4 sudah diaktifkan di dashboard admin.
6. Preview gambar di CMS dan kartu publik mempertahankan rasio asli gambar.
7. Ukuran card Small, Medium, Large, Wide, dan Auto tetap dikendalikan melalui layout size konten.

## File yang disentuh
- `src/app/cabang-2/page.tsx`
- `src/app/cabang-4/page.tsx`
- `src/app/admin/cabang-2/page.tsx`
- `src/app/admin/cabang-4/page.tsx`
- `src/components/admin/cabang-2/heritage-dashboard.tsx`
- `src/components/admin/cabang-4/cozy-dashboard.tsx`
- `src/features/branches/components/branch-landing-page.tsx`
- `src/features/content/components/public/branch-content-sections.tsx`
- `src/features/content/components/admin/content-management.tsx`

## Cara menerapkan ke folder clone
Salin isi folder project dari ZIP ini ke folder clone. Pertahankan folder `.git`, file `.env.local`, dan file environment lokal yang sudah ada. Jangan menimpa konfigurasi rahasia atau kredensial MongoDB/Cloudinary.

Setelah menyalin:
```bash
npm install
npm run build
```

Jika build berhasil:
```bash
git status
git add .
git commit -m "feat: enable content CMS for all branches"
git push
```

Catatan: build belum dijalankan di lingkungan pembuatan paket ini karena dependensi project tidak disertakan.
