
import pandas as pd
from pathlib import Path

# ==========================================
# 1. MEMBACA DATASET ASLI
# ==========================================

file_path = "data/dataset_kopilogi.xlsx"

df_menu = pd.read_excel(file_path, sheet_name="menu")
df_branches = pd.read_excel(file_path, sheet_name="branches")

print("=" * 50)
print("DATA CLEANING KOPILOGI")
print("=" * 50)

print("\nJumlah data awal:", len(df_menu))


# ==========================================
# 2. MEMBERSIHKAN SPASI TEKS
# ==========================================

kolom_teks = df_menu.select_dtypes(
    include=["object", "str"]
).columns

for kolom in kolom_teks:
    df_menu[kolom] = df_menu[kolom].apply(
        lambda x: x.strip() if isinstance(x, str) else x
    )

print("\nPembersihan spasi teks selesai.")


# ==========================================
# 3. MEMERIKSA ID MENU
# ==========================================

print("\nID MENU DUPLIKAT:")
print(df_menu["menu_id"].duplicated().sum())


# ==========================================
# 4. MEMERIKSA DATA PENTING
# ==========================================

kolom_wajib = [
    "menu_id",
    "branch_id",
    "menu_name",
    "category",
    "price"
]

print("\nDATA KOSONG PADA KOLOM WAJIB:")

print(df_menu[kolom_wajib].isnull().sum())


# ==========================================
# 5. MEMERIKSA HARGA
# ==========================================

print("\nJUMLAH HARGA TIDAK VALID:")

harga_tidak_valid = (
    df_menu["price"].isna() |
    (df_menu["price"] <= 0)
)

print(harga_tidak_valid.sum())


# ==========================================
# 6. MENGHAPUS KOLOM YANG SEPENUHNYA KOSONG
# ==========================================

kolom_kosong = [
    kolom for kolom in df_menu.columns
    if df_menu[kolom].isna().all()
]

print("\nKOLOM YANG SELURUHNYA KOSONG:")
print(kolom_kosong)

df_menu = df_menu.drop(columns=kolom_kosong)

print("\nKolom kosong berhasil dikeluarkan dari dataset analisis.")


# ==========================================
# 7. MENGGABUNGKAN INFORMASI CABANG
# ==========================================

df_branches = df_branches[
    ["branch_id", "branch_name", "city"]
].copy()

df_clean = pd.merge(
    df_menu,
    df_branches,
    on="branch_id",
    how="left",
    validate="many_to_one"
)

# Memeriksa apakah ada cabang yang tidak ditemukan
print("\nDATA MENU TANPA INFORMASI CABANG:")
print(df_clean["branch_name"].isna().sum())


# ==========================================
# 8. VALIDASI DATA HASIL CLEANING
# ==========================================

print("\nJUMLAH DATA SETELAH CLEANING:")
print(len(df_clean))

print("\nJUMLAH BARIS DAN KOLOM:")
print(df_clean.shape)

print("\nJUMLAH DATA DUPLIKAT:")
print(df_clean.duplicated().sum())


# ==========================================
# 9. MENYIMPAN DATASET BERSIH
# ==========================================

output_path = Path("data/menu_clean.csv")

df_clean.to_csv(
    output_path,
    index=False,
    encoding="utf-8-sig"
)

print("\nDATASET BERSIH BERHASIL DISIMPAN:")
print(output_path)

print("\n" + "=" * 50)
print("DATA CLEANING SELESAI")
print("=" * 50)
