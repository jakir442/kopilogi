
import pandas as pd

file_path = "data/dataset_kopilogi.xlsx"

# Membaca seluruh sheet Excel
excel = pd.ExcelFile(file_path)

print("DAFTAR SHEET DATASET KOPILOGI")
print(excel.sheet_names)

for sheet in excel.sheet_names:
    df = pd.read_excel(file_path, sheet_name=sheet)

    print("\n" + "=" * 50)
    print("NAMA SHEET:", sheet)
    print("JUMLAH BARIS DAN KOLOM:", df.shape)

    print("\nDAFTAR KOLOM:")
    print(df.columns.tolist())

    print("\nCONTOH DATA:")
    print(df.head(3).to_string(index=False))

    print("\nJUMLAH DATA KOSONG:")
    print(df.isnull().sum().to_string())