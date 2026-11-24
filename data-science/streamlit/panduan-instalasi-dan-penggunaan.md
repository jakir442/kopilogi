
# Panduan Instalasi dan penggunaan

Dokumen ini berisi panduan untuk menjalankan project Data Science KOPILOGI di komputer baru. Panduan dimulai dari persiapan software, instalasi library, menjalankan dashboard, sampai menjalankan API untuk kebutuhan integrasi dengan website.

## 1. Struktur Folder Project

Pastikan struktur folder utama project kurang lebih seperti berikut:

```text
KOPILOGI-DATA-SCIENCE/
│
├── app.py
├── api.py
├── data_cleaning.py
├── requirements.txt
│
├── data/
│   ├── dataset_kopilogi.xlsx
│   └── menu_clean.csv
│
├── chatbot_data/
│   ├── cabang_chatbot.csv
│   ├── menu_chatbot.csv
│   ├── informasi_chatbot.csv
│   ├── data_dictionary.xlsx
│   └── knowledge_base_kopilogi.json
│
├── model_data/
│   ├── data_train.csv
│   ├── data_test.csv
│   ├── hasil_perbandingan_model.csv
│   ├── perbandingan_feature_engineering.csv
│   └── model_kategori_menu.pkl
│
├── dokumentasi-model-prediksi.md
├── panduan-instalasi-dan-pengunaan.md
└── README-chatbot.md
```

### Fungsi Folder dan File

- `app.py`: aplikasi dashboard menggunakan Streamlit.
- `api.py`: API FastAPI untuk menjalankan model prediksi.
- `data_cleaning.py`: script pengolahan dan pembersihan data.
- `requirements.txt`: daftar library Python yang diperlukan.
- `data/`: menyimpan dataset utama.
- `chatbot_data/`: menyimpan dataset dan knowledge base chatbot.
- `model_data/`: menyimpan dataset training, testing, hasil evaluasi, dan model prediksi.
- `model_kategori_menu.pkl`: model Machine Learning yang digunakan oleh API.
- `DOKUMENTASI_MODEL_PREDIKSI.md`: dokumentasi pengembangan dan evaluasi model.

**Penting:** Jangan mengubah nama file atau memindahkan folder utama tanpa menyesuaikan lokasi file yang dipanggil dalam kode program.

---

## 2. Software yang Harus Diinstal

Sebelum menjalankan project, pastikan komputer sudah memiliki:

1. Python 3.11 (disarankan).
2. Visual Studio Code.
3. Google Chrome atau browser lainnya.
4. Koneksi internet untuk instalasi library.

Untuk memeriksa instalasi Python, buka terminal VS Code dan jalankan:

```powershell
python --version
```

Jika tidak berhasil, coba:

```powershell
py --version
```

Jika Python belum tersedia, instal Python terlebih dahulu dan aktifkan pilihan **Add Python to PATH** saat instalasi jika tersedia.

---

## 3. Membuka Project di VS Code

1. Ekstrak folder project jika diterima dalam bentuk ZIP.
2. Buka Visual Studio Code.
3. Pilih **File → Open Folder**.
4. Pilih folder `KOPILOGI-DATA-SCIENCE`.
5. Buka terminal melalui menu **Terminal → New Terminal**.

Pastikan terminal berada di folder utama project.

Periksa lokasi terminal menggunakan:

```powershell
Get-Location
```

Periksa isi folder menggunakan:

```powershell
dir
```

Pastikan file `app.py`, `api.py`, dan `requirements.txt` terlihat.

---

## 4. Membuat Virtual Environment

Virtual environment digunakan agar library project terpisah dari instalasi Python lainnya.

Jalankan perintah berikut:

```powershell
python -m venv venv
```

Jika perintah `python` tidak dikenali, gunakan:

```powershell
py -m venv venv
```

Setelah selesai, aktifkan virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Jika berhasil, akan muncul tulisan `(venv)` di awal baris terminal.

### Jika Aktivasi Ditolak PowerShell

Jika muncul pesan bahwa eksekusi script dibatasi, jalankan:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

Kemudian aktifkan kembali:

```powershell
.\venv\Scripts\Activate.ps1
```

Pengaturan tersebut hanya berlaku untuk sesi PowerShell yang sedang digunakan.

---

## 5. Instalasi Library Python

Pastikan virtual environment sudah aktif.

Perbarui pip terlebih dahulu:

```powershell
python -m pip install --upgrade pip
```

Kemudian instal seluruh library yang dibutuhkan:

```powershell
pip install -r requirements.txt
```

Tunggu sampai proses instalasi selesai.

Untuk memeriksa library utama:

```powershell
python -m pip show streamlit fastapi uvicorn scikit-learn joblib
```

Jika informasi paket muncul, berarti library tersebut sudah terpasang.

**Catatan:** Instalasi library cukup dilakukan satu kali untuk setiap virtual environment. Jika folder `venv` sudah ada dan masih berfungsi, tidak perlu membuatnya kembali.

---

## 6. Menjalankan Dashboard Streamlit

Dashboard digunakan untuk menampilkan informasi menu dan cabang KOPILOGI.

Langkah menjalankan dashboard:

1. Buka terminal VS Code.
2. Pastikan berada di folder utama project.
3. Aktifkan virtual environment jika belum aktif.
4. Jalankan perintah:

```powershell
streamlit run app.py
```

5. Tunggu sampai alamat dashboard muncul di terminal.
6. Buka alamat berikut melalui browser:

```text
http://localhost:8501
```

### Fitur Dashboard

Dashboard memiliki beberapa fitur:

- Filter berdasarkan cabang.
- Filter berdasarkan kategori menu.
- Tampilan indikator data.
- Visualisasi dalam bentuk grafik.
- Fitur unggah data untuk memperbarui data dashboard.

**Catatan:** Dashboard saat ini menggunakan data menu dan cabang. Belum tersedia data transaksi penjualan maupun persediaan, sehingga dashboard belum digunakan untuk memantau omzet, keuntungan, atau stok.

Untuk menghentikan dashboard, tekan:

```text
Ctrl + C
```

---

## 7. Menjalankan API FastAPI

API digunakan sebagai penghubung antara model Machine Learning dan aplikasi lain, termasuk website React.

API dijalankan melalui terminal kedua agar dashboard tetap aktif.

### Langkah Menjalankan API

1. Buka terminal baru di VS Code melalui **Terminal → New Terminal**.
2. Pastikan terminal berada di folder utama project.
3. Aktifkan virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

4. Jalankan API:

```powershell
uvicorn api:app --reload
```

5. Tunggu sampai server berjalan.

Alamat API:

```text
http://127.0.0.1:8000
```

### Membuka Dokumentasi API

Buka browser dan masukkan alamat:

```text
http://127.0.0.1:8000/docs
```

Halaman tersebut merupakan Swagger UI yang digunakan untuk melihat dan mencoba endpoint API.

### Endpoint API

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/` | Menampilkan informasi dasar API |
| GET | `/health` | Memeriksa kondisi API |
| GET | `/kategori` | Menampilkan daftar kategori |
| POST | `/prediksi` | Memprediksi kategori menu |

### Cara Menguji Prediksi

1. Buka `http://127.0.0.1:8000/docs`.
2. Cari endpoint `POST /prediksi`.
3. Klik endpoint tersebut.
4. Klik **Try it out**.
5. Isi nama dan deskripsi menu sesuai format input yang ditampilkan.
6. Klik **Execute**.
7. Periksa hasil prediksi pada bagian Response.

API sebelumnya sudah diuji melalui Swagger UI dan permintaan prediksi berhasil diproses dengan status HTTP 200.

Untuk menghentikan API, tekan:

```text
Ctrl + C
```

---

## 8. Menjalankan Dashboard dan API Bersamaan

Dashboard dan API dapat dijalankan secara bersamaan menggunakan dua terminal.

| Terminal | Perintah |
|---|---|
| Terminal 1 | `streamlit run app.py` |
| Terminal 2 | `uvicorn api:app --reload` |

Alamat yang digunakan:

- Dashboard: `http://localhost:8501`
- API: `http://127.0.0.1:8000`
- Dokumentasi API: `http://127.0.0.1:8000/docs`

Pastikan kedua terminal tetap berjalan selama aplikasi digunakan.

---

## 9. Informasi Integrasi dengan React

API FastAPI sudah disiapkan agar model prediksi dapat digunakan oleh website React.

Alur integrasi yang direncanakan:

1. Pengguna memasukkan nama dan deskripsi menu melalui halaman React.
2. React mengirim data ke endpoint `POST /prediksi`.
3. FastAPI menerima data tersebut.
4. Model `model_kategori_menu.pkl` memproses input.
5. API mengirimkan hasil prediksi kategori.
6. React menampilkan hasil prediksi kepada pengguna.

**Hal yang perlu diperhatikan:**

- React harus menggunakan alamat API yang benar.
- Jika API dan React berjalan pada komputer yang sama, alamat lokal dapat digunakan.
- Jika API dijalankan pada komputer atau server berbeda, alamat API harus disesuaikan.
- Pengaturan CORS pada `api.py` perlu menyesuaikan alamat dan port website React.

API yang berjalan pada `127.0.0.1` hanya dapat diakses dari komputer itu sendiri. Untuk penggunaan melalui website yang diakses orang lain, API perlu ditempatkan pada server yang dapat dijangkau website.

Integrasi ke website React masih perlu dilanjutkan dan diuji bersama tim Full-stack.

---

## 10. Data untuk Kebutuhan Chatbot

Folder `chatbot_data/` berisi data yang sudah disiapkan untuk kebutuhan pengembangan chatbot KOPILOGI.

File yang tersedia:

- `cabang_chatbot.csv`
- `menu_chatbot.csv`
- `informasi_chatbot.csv`
- `data_dictionary.xlsx`
- `knowledge_base_kopilogi.json`

Data tersebut berisi informasi cabang, menu, dan informasi umum KOPILOGI.

Format data masih dapat disesuaikan dengan kebutuhan tim Gen AI. Informasi yang status verifikasinya masih menunggu konfirmasi juga perlu diperiksa sebelum digunakan sebagai informasi resmi chatbot.

---

## 11. Troubleshooting (Mengatasi Masalah)

### A. Python Tidak Dikenali

Coba periksa menggunakan:

```powershell
py --version
```

Jika berhasil, gunakan perintah `py` untuk membuat virtual environment.

### B. Virtual Environment Tidak Bisa Diaktifkan

Jalankan:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

Kemudian:

```powershell
.\venv\Scripts\Activate.ps1
```

### C. Streamlit atau Uvicorn Tidak Dikenali

Pastikan virtual environment aktif, kemudian jalankan:

```powershell
pip install -r requirements.txt
```

Jika masih bermasalah, coba:

```powershell
python -m streamlit run app.py
```

atau:

```powershell
python -m uvicorn api:app --reload
```

### D. File Model Tidak Ditemukan

Pastikan file berikut tersedia:

```text
model_data/model_kategori_menu.pkl
```

Jangan memindahkan file tersebut dari folder `model_data/`.

### E. Dataset Tidak Ditemukan

Periksa kembali folder `data/` dan pastikan nama file dataset tidak berubah.

### F. Dashboard atau API Tidak Bisa Dibuka

Pastikan terminal masih menjalankan aplikasi dan tidak menampilkan pesan error.

Periksa alamat dan port yang muncul di terminal.

### G. Port Sudah Digunakan

Jika port Streamlit sudah digunakan, coba:

```powershell
streamlit run app.py --server.port 8502
```

Jika port API sudah digunakan, coba:

```powershell
uvicorn api:app --reload --port 8001
```

Jika port API berubah, alamat yang digunakan React juga harus disesuaikan.

---

## 12. File yang Harus Disertakan

Saat project dibagikan kepada anggota tim lain, pastikan file berikut ikut disertakan:

- `app.py`
- `api.py`
- `requirements.txt`
- `data/`
- `chatbot_data/`
- `model_data/`
- `data_cleaning.py`
- `DOKUMENTASI_MODEL_PREDIKSI.md`
- Script pendukung lainnya.

Folder `venv/` dan `__pycache__/` tidak perlu disertakan karena dapat dibuat kembali atau dihasilkan otomatis.

**Penting:** File `model_data/model_kategori_menu.pkl` wajib disertakan karena digunakan oleh API untuk menjalankan prediksi.

---

## 13. Status Pengerjaan Project

| Bagian | Status |
|---|---|
| Persiapan dan pengolahan dataset | Sudah dikerjakan |
| Dashboard Streamlit | Sudah dijalankan dan diuji |
| Dataset chatbot | Sudah disiapkan dan diperiksa |
| Model prediksi kategori menu | Sudah dibuat dan dievaluasi |
| Pengujian model | Sudah dilakukan |
| API FastAPI | Sudah dijalankan dan diuji |
| Integrasi dashboard ke website | Perlu dilanjutkan bersama Full-stack |
| Integrasi API ke React | Perlu dilanjutkan bersama Full-stack |
| Penyesuaian data chatbot | Perlu dikoordinasikan dengan Gen AI |

---

## 14. Penutup

Project Data Science KOPILOGI telah disiapkan mulai dari pengolahan data, pembuatan dashboard, penyusunan knowledge base chatbot, pengembangan model prediksi, hingga pembuatan API.

Panduan ini dibuat agar anggota tim yang menerima folder project dapat melakukan instalasi dan menjalankan aplikasi tanpa harus mencari langkah-langkahnya dari awal.

Jika project digunakan pada komputer baru, ikuti urutan instalasi mulai dari pemeriksaan Python, pembuatan virtual environment, instalasi library, kemudian menjalankan dashboard dan API.

Apabila terdapat penyesuaian format data, endpoint, atau kebutuhan integrasi website, silakan koordinasikan dengan anggota tim Data Science dan Full-stack.