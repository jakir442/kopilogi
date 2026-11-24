
import joblib
from pathlib import Path

# Memuat model terbaik
model = joblib.load(
    "model_data/model_kategori_menu.pkl"
)

print("=" * 50)
print("UJI PREDIKSI KATEGORI MENU KOPILOGI")
print("=" * 50)

while True:
    nama_menu = input("\nMasukkan nama menu (ketik 'keluar' untuk berhenti): ")

    if nama_menu.lower() == "keluar":
        print("Pengujian selesai.")
        break

    deskripsi = input("Masukkan deskripsi menu: ")

    # Menggabungkan nama dan deskripsi
    teks = nama_menu + " " + deskripsi

    # Melakukan prediksi
    hasil = model.predict([teks])

    # Mengambil tingkat keyakinan prediksi
    probabilitas = model.predict_proba([teks])[0]
    keyakinan = max(probabilitas) * 100

    print("\nHasil Prediksi:")
    print("Nama menu :", nama_menu)
    print("Kategori  :", hasil[0])
    print(f"Skor model: {keyakinan:.2f}%")

    print("-" * 50)
