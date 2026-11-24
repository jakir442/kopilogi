
import pandas as pd

# Membaca dataset menu
df = pd.read_csv("chatbot_data/menu_chatbot.csv")

print("=" * 50)
print("PEMERIKSAAN DATA UNTUK MODEL PREDIKSI")
print("=" * 50)

# Menampilkan kolom
print("\n1. Daftar kolom:")
print(df.columns.tolist())

# Memeriksa jumlah data
print("\n2. Jumlah data:")
print(len(df))

# Memeriksa data kosong
print("\n3. Data kosong:")
print(df[["menu_name", "description", "category"]].isnull().sum())

# Menghitung jumlah setiap kategori
print("\n4. Jumlah menu setiap kategori:")
print(df["category"].value_counts())

# Menghitung jumlah kategori
print("\n5. Jumlah kategori:")
print(df["category"].nunique())

print("\nPEMERIKSAAN SELESAI")
