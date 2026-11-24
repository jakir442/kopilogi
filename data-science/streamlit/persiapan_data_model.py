
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split

# Membaca dataset
file_input = Path("chatbot_data/menu_chatbot.csv")
df = pd.read_csv(file_input)

# Mengambil kolom yang diperlukan
df = df[["menu_id", "menu_name", "description", "category"]].copy()

# Membersihkan teks
for kolom in ["menu_name", "description", "category"]:
    df[kolom] = df[kolom].fillna("").astype(str).str.strip()

# Menghapus data yang tidak memiliki nama atau kategori
df = df[
    (df["menu_name"] != "") &
    (df["category"] != "")
].copy()

# Membuat fitur gabungan
df["teks_gabungan"] = (
    df["menu_name"] + " " + df["description"]
).str.strip()

# Memeriksa jumlah data setiap kategori
print("Jumlah data per kategori:")
print(df["category"].value_counts())

# Memisahkan fitur dan target
X = df[["menu_id", "menu_name", "description", "teks_gabungan"]]
y = df["category"]

# Membagi data dengan stratifikasi
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# Membuat folder penyimpanan
folder = Path("model_data")
folder.mkdir(exist_ok=True)

# Menyimpan data training dan testing
train = X_train.copy()
train["category"] = y_train

test = X_test.copy()
test["category"] = y_test

train.to_csv(folder / "data_train.csv", index=False)
test.to_csv(folder / "data_test.csv", index=False)

print("\nPembagian data berhasil!")
print("Total data :", len(df))
print("Data train :", len(train))
print("Data test  :", len(test))
