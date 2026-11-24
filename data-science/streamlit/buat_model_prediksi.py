
import pandas as pd
import joblib

from pathlib import Path
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report
)

# ==========================================
# 1. MEMBACA DATA TRAINING DAN TESTING
# ==========================================

folder = Path("model_data")

train = pd.read_csv(folder / "data_train.csv")
test = pd.read_csv(folder / "data_test.csv")

X_train = train["teks_menu"]
y_train = train["category"]

X_test = test["teks_menu"]
y_test = test["category"]

print("=" * 60)
print("PEMBUATAN MODEL PREDIKSI KATEGORI MENU KOPILOGI")
print("=" * 60)

print(f"\nData training : {len(train)}")
print(f"Data testing  : {len(test)}")

# ==========================================
# 2. MEMBUAT DUA MODEL
# ==========================================

models = {
    "Naive Bayes": Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            sublinear_tf=True
        )),
        ("model", MultinomialNB(alpha=0.5))
    ]),

    "Logistic Regression": Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            sublinear_tf=True
        )),
        ("model", LogisticRegression(
            max_iter=2000,
            class_weight="balanced",
            random_state=42
        ))
    ])
}

# ==========================================
# 3. TRAINING DAN EVALUASI MODEL
# ==========================================

hasil = []
model_terbaik = None
nama_model_terbaik = None
skor_terbaik = -1

for nama, model in models.items():

    print("\n" + "=" * 60)
    print(f"MODEL: {nama}")
    print("=" * 60)

    # Training
    model.fit(X_train, y_train)

    # Prediksi data testing
    prediksi = model.predict(X_test)

    # Menghitung metrik
    accuracy = accuracy_score(y_test, prediksi)

    precision = precision_score(
        y_test, prediksi,
        average="macro",
        zero_division=0
    )

    recall = recall_score(
        y_test, prediksi,
        average="macro",
        zero_division=0
    )

    f1 = f1_score(
        y_test, prediksi,
        average="macro",
        zero_division=0
    )

    f1_weighted = f1_score(
        y_test, prediksi,
        average="weighted",
        zero_division=0
    )

    print(f"Accuracy          : {accuracy:.4f}")
    print(f"Precision Macro   : {precision:.4f}")
    print(f"Recall Macro      : {recall:.4f}")
    print(f"F1 Macro          : {f1:.4f}")
    print(f"F1 Weighted       : {f1_weighted:.4f}")

    print("\nClassification Report:")
    print(classification_report(
        y_test,
        prediksi,
        zero_division=0
    ))

    hasil.append({
        "Model": nama,
        "Accuracy": accuracy,
        "Precision_Macro": precision,
        "Recall_Macro": recall,
        "F1_Macro": f1,
        "F1_Weighted": f1_weighted
    })

    # Memilih model berdasarkan F1 Macro
    if f1 > skor_terbaik:
        skor_terbaik = f1
        model_terbaik = model
        nama_model_terbaik = nama

# ==========================================
# 4. MEMBANDINGKAN MODEL
# ==========================================

hasil_df = pd.DataFrame(hasil)

print("\n" + "=" * 60)
print("PERBANDINGAN HASIL MODEL")
print("=" * 60)

print(hasil_df.to_string(index=False))

hasil_df.to_csv(
    folder / "hasil_perbandingan_model.csv",
    index=False
)

# ==========================================
# 5. MENYIMPAN MODEL TERBAIK
# ==========================================

joblib.dump(
    model_terbaik,
    folder / "model_kategori_menu.pkl"
)

print("\n" + "=" * 60)
print("MODEL TERBAIK")
print("=" * 60)

print(f"Nama model : {nama_model_terbaik}")
print(f"F1 Macro   : {skor_terbaik:.4f}")

print("\nFile berhasil disimpan:")
print("- model_data/hasil_perbandingan_model.csv")
print("- model_data/model_kategori_menu.pkl")

print("\nPROSES PEMODELAN SELESAI")
