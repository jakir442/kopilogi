
import pandas as pd
import os

folder = "chatbot_data"

# Membaca file hasil pengolahan
cabang = pd.read_csv(f"{folder}/cabang_chatbot.csv")
menu = pd.read_csv(f"{folder}/menu_chatbot.csv")
informasi = pd.read_csv(f"{folder}/informasi_chatbot.csv")

print("=" * 50)
print("PEMERIKSAAN KUALITAS DATA CHATBOT KOPILOGI")
print("=" * 50)

# 1. Pemeriksaan data cabang
print("\n1. DATA CABANG")
print("Jumlah data:", len(cabang))
print("Cabang duplikat:", cabang["branch_id"].duplicated().sum())
print("Nama cabang kosong:", cabang["branch_name"].isna().sum())
print("Alamat kosong:", cabang["address"].isna().sum())
print("Nomor telepon kosong:", cabang["phone"].isna().sum())

# 2. Pemeriksaan data menu
print("\n2. DATA MENU")
print("Jumlah data:", len(menu))
print("Menu duplikat:", menu["menu_id"].duplicated().sum())
print("Nama menu kosong:", menu["menu_name"].isna().sum())
print("Kategori kosong:", menu["category"].isna().sum())
print("Deskripsi kosong:", menu["description"].isna().sum())
print("Harga kosong:", menu["price"].isna().sum())
print("Harga tidak valid:", (menu["price"] <= 0).sum())

# Memeriksa hubungan menu dengan cabang
cabang_valid = cabang["branch_id"].unique()
menu_tanpa_cabang = menu[
    ~menu["branch_id"].isin(cabang_valid)
]

print("Menu tanpa cabang yang sesuai:", len(menu_tanpa_cabang))

# 3. Pemeriksaan informasi umum
print("\n3. INFORMASI UMUM")
print("Jumlah informasi:", len(informasi))
print("Judul kosong:", informasi["title"].isna().sum())
print("Isi informasi kosong:", informasi["content"].isna().sum())
print("Informasi duplikat:", informasi["info_id"].duplicated().sum())

# 4. Pemeriksaan status verifikasi
print("\n4. STATUS VERIFIKASI")

for nama, df in [
    ("Cabang", cabang),
    ("Menu", menu),
    ("Informasi umum", informasi)
]:
    print(f"\n{nama}:")
    print(df["verification_status"].value_counts(dropna=False))

print("\n" + "=" * 50)
print("PEMERIKSAAN SELESAI")
print("=" * 50)
