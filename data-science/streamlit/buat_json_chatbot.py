
import pandas as pd
import json
import os

folder = "chatbot_data"
os.makedirs(folder, exist_ok=True)

# Membaca data CSV
cabang = pd.read_csv(f"{folder}/cabang_chatbot.csv")
menu = pd.read_csv(f"{folder}/menu_chatbot.csv")
informasi = pd.read_csv(f"{folder}/informasi_chatbot.csv")

# Mengubah NaN menjadi None agar menjadi null di JSON
def ubah_nan(data):
    return data.astype(object).where(pd.notna(data), None)

# Menyiapkan struktur JSON
data_chatbot = {
    "nama": "KOPILOGI",
    "deskripsi": "Basis pengetahuan untuk chatbot informasi KOPILOGI",
    "cabang": ubah_nan(cabang).to_dict(orient="records"),
    "menu": ubah_nan(menu).to_dict(orient="records"),
    "informasi_umum": ubah_nan(informasi).to_dict(orient="records")
}

# Menyimpan JSON
with open(
    f"{folder}/knowledge_base_kopilogi.json",
    "w",
    encoding="utf-8"
) as file:
    json.dump(
        data_chatbot,
        file,
        ensure_ascii=False,
        indent=4
    )

print("JSON CHATBOT BERHASIL DIBUAT")
print("Jumlah cabang:", len(cabang))
print("Jumlah menu:", len(menu))
print("Jumlah informasi umum:", len(informasi))
print("File: chatbot_data/knowledge_base_kopilogi.json")
