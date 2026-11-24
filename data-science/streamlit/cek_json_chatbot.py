
import json
import os

file_path = "chatbot_data/knowledge_base_kopilogi.json"

# Membuka file JSON
with open(file_path, "r", encoding="utf-8") as file:
    data = json.load(file)

print("=" * 45)
print("PEMERIKSAAN KNOWLEDGE BASE CHATBOT")
print("=" * 45)

print("\nNama:", data["nama"])
print("Deskripsi:", data["deskripsi"])

print("\nJumlah cabang:", len(data["cabang"]))
print("Jumlah menu:", len(data["menu"]))
print("Jumlah informasi umum:", len(data["informasi_umum"]))

print("\nCONTOH DATA CABANG:")
print(json.dumps(data["cabang"][0], indent=4, ensure_ascii=False))

print("\nCONTOH DATA MENU:")
print(json.dumps(data["menu"][0], indent=4, ensure_ascii=False))

print("\nCONTOH INFORMASI UMUM:")
print(json.dumps(data["informasi_umum"][0], indent=4, ensure_ascii=False))

print("\n" + "=" * 45)
print("JSON BERHASIL DIBACA")
print("=" * 45)
