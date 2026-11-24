
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, f1_score

# Membaca data training dan testing
train = pd.read_csv("model_data/data_train.csv")
test = pd.read_csv("model_data/data_test.csv")

y_train = train["category"]
y_test = test["category"]

# Tiga variasi fitur yang akan dibandingkan
variasi_fitur = {
    "Nama Menu Saja": "menu_name",
    "Deskripsi Saja": "description",
    "Nama + Deskripsi": "teks_gabungan"
}

hasil = []

print("=" * 60)
print("PERBANDINGAN FEATURE ENGINEERING MODEL KATEGORI MENU")
print("=" * 60)

for nama_fitur, kolom in variasi_fitur.items():

    # Membuat pipeline TF-IDF dan Logistic Regression
    model = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            sublinear_tf=True
        )),
        ("classifier", LogisticRegression(
            max_iter=2000,
            class_weight="balanced",
            random_state=42
        ))
    ])

    # Melatih model hanya menggunakan data training
    X_train = train[kolom].fillna("").astype(str)
    X_test = test[kolom].fillna("").astype(str)

    model.fit(X_train, y_train)

    # Menguji menggunakan data testing
    prediksi = model.predict(X_test)

    akurasi = accuracy_score(y_test, prediksi)
    f1_macro = f1_score(
        y_test,
        prediksi,
        average="macro",
        zero_division=0
    )

    hasil.append({
        "Fitur": nama_fitur,
        "Akurasi": akurasi,
        "F1 Macro": f1_macro
    })

    print(f"\nFitur: {nama_fitur}")
    print(f"Akurasi: {akurasi * 100:.2f}%")
    print(f"F1 Macro: {f1_macro * 100:.2f}%")

# Membuat tabel perbandingan
df_hasil = pd.DataFrame(hasil)

df_hasil.to_csv(
    "model_data/perbandingan_feature_engineering.csv",
    index=False
)

print("\n" + "=" * 60)
print("TABEL PERBANDINGAN")
print("=" * 60)
print(df_hasil.to_string(index=False))

terbaik = df_hasil.loc[df_hasil["F1 Macro"].idxmax()]

print("\nFitur dengan F1 Macro tertinggi:")
print(terbaik["Fitur"])
print(f"F1 Macro: {terbaik['F1 Macro'] * 100:.2f}%")

print("\nHasil disimpan ke:")
print("model_data/perbandingan_feature_engineering.csv")
