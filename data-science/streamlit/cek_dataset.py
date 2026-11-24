
import pandas as pd

# =====================================
# 1. MEMBACA DATASET KOPILOGI
# =====================================

file_path = "data/dataset_kopilogi.xlsx"

print("=" * 50)
print("PEMERIKSAAN DATASET KOPILOGI")
print("=" * 50)

# Membaca daftar sheet Excel
excel = pd.ExcelFile(file_path)

print("\nDAFTAR SHEET:")
print(excel.sheet_names)


# =====================================
# 2. MEMBACA DATA MENU
# =====================================

df_menu = pd.read_excel(
    file_path,
    sheet_name="menu"
)

print("\n5 DATA MENU PERTAMA:")
print(df_menu.head())


# =====================================
# 3. INFORMASI DATASET
# =====================================

print("\nINFORMASI DATA MENU:")
df_menu.info()


# =====================================
# 4. UKURAN DATASET
# =====================================

print("\nJUMLAH BARIS DAN KOLOM:")
print(df_menu.shape)


# =====================================
# 5. MEMERIKSA DATA KOSONG
# =====================================

print("\nJUMLAH DATA KOSONG:")
print(df_menu.isnull().sum())


# =====================================
# 6. MEMERIKSA DATA DUPLIKAT
# =====================================

print("\nJUMLAH DATA DUPLIKAT:")
print(df_menu.duplicated().sum())


# =====================================
# 7. RINGKASAN DATA
# =====================================

print("\nJUMLAH MENU:")
print(len(df_menu))

print("\nJUMLAH KATEGORI:")
print(df_menu["category"].nunique())

print("\nDAFTAR KATEGORI:")
print(df_menu["category"].unique())

print("\nPEMERIKSAAN SELESAI")


# =====================================
# 8. PEMERIKSAAN KUALITAS DATA LANJUTAN
# =====================================

print("\n" + "=" * 50)
print("PEMERIKSAAN KUALITAS DATA LANJUTAN")
print("=" * 50)

# 1. Memeriksa ID menu yang duplikat
print("\n1. MENU ID DUPLIKAT:")
print(df_menu["menu_id"].duplicated().sum())

# 2. Memeriksa harga
print("\n2. RINGKASAN HARGA MENU:")
print(df_menu["price"].describe())

# 3. Memeriksa harga yang tidak valid
print("\n3. HARGA NOL ATAU NEGATIF:")
print((df_menu["price"] <= 0).sum())

# 4. Jumlah menu berdasarkan cabang
print("\n4. JUMLAH MENU PER CABANG:")
print(df_menu["branch_id"].value_counts())

# 5. Jumlah menu berdasarkan jenis data
print("\n5. JENIS DATA:")
print(df_menu["data_type"].value_counts(dropna=False))

# 6. Jumlah menu berdasarkan kategori
print("\n6. JUMLAH MENU PER KATEGORI:")
print(df_menu["category"].value_counts())

print("\nPEMERIKSAAN LANJUTAN SELESAI")
