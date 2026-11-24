
import joblib
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Inisialisasi aplikasi
app = FastAPI(
    title="KOPILOGI Prediction API",
    description="API untuk prediksi kategori menu KOPILOGI",
    version="1.0.0"
)

# Mengizinkan komunikasi dengan frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Memuat model Machine Learning
MODEL_PATH = Path("model_data/model_kategori_menu.pkl")

model = joblib.load(MODEL_PATH)


# Format input dari React
class MenuInput(BaseModel):
    nama_menu: str
    deskripsi: str


# Endpoint halaman utama
@app.get("/")
def halaman_utama():
    return {
        "status": "berhasil",
        "pesan": "API Prediksi Kategori Menu KOPILOGI aktif"
    }


# Endpoint prediksi kategori
@app.post("/prediksi")
def prediksi_menu(data: MenuInput):

    teks_menu = data.nama_menu + " " + data.deskripsi

    hasil = model.predict([teks_menu])[0]

    probabilitas = model.predict_proba([teks_menu])[0]
    skor = float(max(probabilitas) * 100)

    return {
        "nama_menu": data.nama_menu,
        "deskripsi": data.deskripsi,
        "kategori_prediksi": hasil,
        "skor_model": round(skor, 2)
    }
