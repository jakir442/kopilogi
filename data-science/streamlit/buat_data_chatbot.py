
import pandas as pd
import os

# ==========================================
# 1. PENGATURAN FILE
# ==========================================

file_path = "data/dataset_kopilogi.xlsx"
output_folder = "chatbot_data"

os.makedirs(output_folder, exist_ok=True)

# Membaca dataset
branches = pd.read_excel(file_path, sheet_name="branches")
menu = pd.read_excel(file_path, sheet_name="menu")
general = pd.read_excel(file_path, sheet_name="general_information")

# ==========================================
# 2. DATA CABANG
# ==========================================

kolom_cabang = [
    "branch_id",
    "branch_name",
    "city",
    "address",
    "opening_time",
    "closing_time",
    "phone",
    "facilities",
    "google_maps_url",
    "instagram_url",
    "gofood_url",
    "grabfood_url",
    "is_active",
    "verification_status"
]

cabang_chatbot = branches[kolom_cabang].copy()

# Hanya menggunakan data aktual
if "data_type" in branches.columns:
    cabang_chatbot = cabang_chatbot[
        branches["data_type"].astype(str).str.lower() == "actual"
    ]

cabang_chatbot.to_csv(
    f"{output_folder}/cabang_chatbot.csv",
    index=False,
    encoding="utf-8-sig"
)

# ==========================================
# 3. DATA MENU
# ==========================================

kolom_menu = [
    "menu_id",
    "branch_id",
    "menu_name",
    "category",
    "description",
    "price",
    "currency",
    "image_url",
    "verification_status"
]

menu_chatbot = menu[kolom_menu].copy()

# Hanya menggunakan data aktual
if "data_type" in menu.columns:
    menu_chatbot = menu_chatbot[
        menu["data_type"].astype(str).str.lower() == "actual"
    ]

# Menggabungkan nama cabang ke data menu
menu_chatbot = menu_chatbot.merge(
    branches[["branch_id", "branch_name"]],
    on="branch_id",
    how="left"
)

menu_chatbot.to_csv(
    f"{output_folder}/menu_chatbot.csv",
    index=False,
    encoding="utf-8-sig"
)

# ==========================================
# 4. INFORMASI UMUM KOPILOGI
# ==========================================

kolom_info = [
    "info_id",
    "info_key",
    "title",
    "content",
    "source",
    "verification_status"
]

informasi_chatbot = general[kolom_info].copy()

# Hanya menggunakan data aktual
if "data_type" in general.columns:
    informasi_chatbot = informasi_chatbot[
        general["data_type"].astype(str).str.lower() == "actual"
    ]

informasi_chatbot.to_csv(
    f"{output_folder}/informasi_chatbot.csv",
    index=False,
    encoding="utf-8-sig"
)

# ==========================================
# 5. MEMBUAT KAMUS DATA
# ==========================================

kamus_data = {
    "cabang_chatbot": [
        ["branch_id", "Kode unik setiap cabang"],
        ["branch_name", "Nama cabang Kopilogi"],
        ["city", "Kota lokasi cabang"],
        ["address", "Alamat lengkap cabang"],
        ["opening_time", "Jam mulai operasional"],
        ["closing_time", "Jam selesai operasional"],
        ["phone", "Nomor telepon cabang"],
        ["facilities", "Fasilitas yang tersedia"],
        ["google_maps_url", "Tautan lokasi Google Maps"],
        ["instagram_url", "Tautan Instagram cabang"],
        ["gofood_url", "Tautan GoFood cabang"],
        ["grabfood_url", "Tautan GrabFood cabang"],
        ["is_active", "Status aktif cabang"],
        ["verification_status", "Status verifikasi informasi"]
    ],
    "menu_chatbot": [
        ["menu_id", "Kode unik menu"],
        ["branch_id", "Kode cabang"],
        ["branch_name", "Nama cabang"],
        ["menu_name", "Nama menu"],
        ["category", "Kategori menu"],
        ["description", "Deskripsi menu"],
        ["price", "Harga menu"],
        ["currency", "Mata uang"],
        ["image_url", "Tautan gambar menu"],
        ["verification_status", "Status verifikasi informasi"]
    ],
    "informasi_chatbot": [
        ["info_id", "Kode unik informasi"],
        ["info_key", "Kategori informasi"],
        ["title", "Judul informasi"],
        ["content", "Isi informasi Kopilogi"],
        ["source", "Sumber informasi"],
        ["verification_status", "Status verifikasi informasi"]
    ]
}

with pd.ExcelWriter(
    f"{output_folder}/data_dictionary.xlsx",
    engine="openpyxl"
) as writer:

    for nama_sheet, daftar_kolom in kamus_data.items():
        df_kamus = pd.DataFrame(
            daftar_kolom,
            columns=["Nama Kolom", "Keterangan"]
        )

        df_kamus.to_excel(
            writer,
            sheet_name=nama_sheet,
            index=False
        )

# ==========================================
# 6. MENAMPILKAN HASIL
# ==========================================

print("\n===================================")
print("PEMBUATAN DATA CHATBOT BERHASIL")
print("===================================")

print("\nJumlah data cabang:", len(cabang_chatbot))
print("Jumlah data menu:", len(menu_chatbot))
print("Jumlah informasi umum:", len(informasi_chatbot))

print("\nFile berhasil dibuat:")

print("- chatbot_data/cabang_chatbot.csv")
print("- chatbot_data/menu_chatbot.csv")
print("- chatbot_data/informasi_chatbot.csv")
print("- chatbot_data/data_dictionary.xlsx")

print("\n===================================")