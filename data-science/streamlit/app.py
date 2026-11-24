
import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path

# ==========================================
# 1. KONFIGURASI DASHBOARD
# ==========================================

st.set_page_config(
    page_title="KOPILOGI Business Dashboard",
    page_icon="☕",
    layout="wide"
)

DATA_PATH = Path("data/menu_clean.csv")

KOLOM_WAJIB = [
    "menu_id",
    "branch_id",
    "branch_name",
    "city",
    "menu_name",
    "category",
    "price"
]


# ==========================================
# 2. FUNGSI MEMBACA DATASET
# ==========================================

@st.cache_data
def load_data(file):
    df = pd.read_csv(file)

    kolom_tidak_ada = [
        kolom for kolom in KOLOM_WAJIB
        if kolom not in df.columns
    ]

    if kolom_tidak_ada:
        raise ValueError(
            "Kolom tidak ditemukan: "
            + ", ".join(kolom_tidak_ada)
        )

    df["price"] = pd.to_numeric(
        df["price"], errors="coerce"
    )

    df = df.dropna(subset=KOLOM_WAJIB)

    return df


# ==========================================
# 3. MEMBACA DATA UTAMA
# ==========================================

try:
    df = load_data(DATA_PATH)

except Exception as e:
    st.error(f"Gagal membaca dataset: {e}")
    st.stop()


# ==========================================
# 4. JUDUL DASHBOARD
# ==========================================

st.title("☕ KOPILOGI BUSINESS DASHBOARD")

st.markdown(
    """
    Dashboard interaktif untuk memantau informasi
    menu, harga, kategori, dan persebaran menu
    pada seluruh cabang KOPILOGI.
    """
)

st.divider()


# ==========================================
# 5. SIDEBAR DAN FILTER
# ==========================================

st.sidebar.title("Pengaturan Dashboard")

st.sidebar.subheader("Filter Data")

pilihan_cabang = st.sidebar.multiselect(
    "Pilih Cabang",
    options=sorted(df["branch_name"].unique()),
    default=sorted(df["branch_name"].unique())
)

pilihan_kategori = st.sidebar.multiselect(
    "Pilih Kategori",
    options=sorted(df["category"].unique()),
    default=sorted(df["category"].unique())
)


# ==========================================
# 6. FITUR UPLOAD DATASET
# ==========================================

st.sidebar.divider()
st.sidebar.subheader("Pembaruan Dataset")

uploaded_file = st.sidebar.file_uploader(
    "Unggah dataset CSV",
    type=["csv"],
    help="Gunakan CSV hasil cleaning dengan struktur kolom yang sama."
)

if uploaded_file is not None:

    try:
        df_upload = pd.read_csv(uploaded_file)

        kolom_tidak_ada = [
            kolom for kolom in KOLOM_WAJIB
            if kolom not in df_upload.columns
        ]

        if kolom_tidak_ada:
            st.sidebar.error(
                "Kolom tidak lengkap: "
                + ", ".join(kolom_tidak_ada)
            )

        else:
            df_upload["price"] = pd.to_numeric(
                df_upload["price"],
                errors="coerce"
            )

            df_upload = df_upload.dropna(
                subset=KOLOM_WAJIB
            )

            df = df_upload

            st.sidebar.success(
                "Dataset berhasil dimuat!"
            )

    except Exception as e:
        st.sidebar.error(
            f"Gagal membaca file: {e}"
        )


# ==========================================
# 7. FILTER DATA
# ==========================================

df_filter = df[
    df["branch_name"].isin(pilihan_cabang)
    &
    df["category"].isin(pilihan_kategori)
].copy()


# ==========================================
# 8. INDIKATOR BISNIS
# ==========================================

st.subheader("Ringkasan Informasi Bisnis")

col1, col2, col3, col4 = st.columns(4)

total_menu = len(df_filter)

total_kategori = df_filter["category"].nunique()

total_cabang = df_filter["branch_id"].nunique()

rata_harga = (
    df_filter["price"].mean()
    if not df_filter.empty else 0
)

col1.metric(
    "Total Menu",
    f"{total_menu:,}"
)

col2.metric(
    "Kategori Menu",
    f"{total_kategori:,}"
)

col3.metric(
    "Jumlah Cabang",
    f"{total_cabang:,}"
)

col4.metric(
    "Rata-rata Harga",
    f"Rp{rata_harga:,.0f}"
)

st.divider()


# ==========================================
# 9. GRAFIK MENU PER KATEGORI
# ==========================================

st.subheader("Analisis Kategori Menu")

if not df_filter.empty:

    kategori = (
        df_filter["category"]
        .value_counts()
        .reset_index()
    )

    kategori.columns = [
        "Kategori",
        "Jumlah Menu"
    ]

    fig_kategori = px.bar(
        kategori,
        x="Jumlah Menu",
        y="Kategori",
        orientation="h",
        title="Jumlah Menu Berdasarkan Kategori",
        text="Jumlah Menu",
        color="Jumlah Menu",
        color_continuous_scale="Teal"
    )

    fig_kategori.update_layout(
        yaxis={"categoryorder": "total ascending"},
        height=600
    )

    st.plotly_chart(
        fig_kategori,
        width="stretch"
    )

else:
    st.info("Tidak ada data untuk filter yang dipilih.")


# ==========================================
# 10. GRAFIK MENU PER CABANG
# ==========================================

st.subheader("Perbandingan Menu Antar Cabang")

if not df_filter.empty:

    cabang = (
        df_filter.groupby("branch_name")
        ["menu_id"]
        .count()
        .reset_index()
    )

    cabang.columns = [
        "Nama Cabang",
        "Jumlah Menu"
    ]

    fig_cabang = px.bar(
        cabang,
        x="Nama Cabang",
        y="Jumlah Menu",
        text="Jumlah Menu",
        title="Jumlah Menu pada Setiap Cabang",
        color="Jumlah Menu",
        color_continuous_scale="Blues"
    )

    st.plotly_chart(
        fig_cabang,
        width="stretch"
    )


# ==========================================
# 11. DISTRIBUSI KATEGORI MENU
# ==========================================

st.subheader("Distribusi Kategori Menu")

if not df_filter.empty:

    fig_pie = px.pie(
        df_filter,
        names="category",
        title="Distribusi Menu Berdasarkan Kategori",
        hole=0.4
    )

    st.plotly_chart(
        fig_pie,
        width="stretch"
    )


# ==========================================
# 12. ANALISIS HARGA MENU
# ==========================================

st.subheader("Analisis Harga Menu")

if not df_filter.empty:

    col1, col2 = st.columns(2)

    with col1:

        harga_min = df_filter["price"].min()

        st.metric(
            "Harga Menu Terendah",
            f"Rp{harga_min:,.0f}"
        )

    with col2:

        harga_max = df_filter["price"].max()

        st.metric(
            "Harga Menu Tertinggi",
            f"Rp{harga_max:,.0f}"
        )

    fig_harga = px.histogram(
        df_filter,
        x="price",
        nbins=20,
        title="Distribusi Harga Menu",
        labels={
            "price": "Harga (Rupiah)",
            "count": "Jumlah Menu"
        }
    )

    st.plotly_chart(
        fig_harga,
        width="stretch"
    )


# ==========================================
# 13. TABEL DATA MENU
# ==========================================

st.subheader("Daftar Menu KOPILOGI")

if not df_filter.empty:

    tabel = df_filter[
        [
            "menu_id",
            "branch_name",
            "city",
            "menu_name",
            "category",
            "price"
        ]
    ].copy()

    tabel.columns = [
        "ID Menu",
        "Cabang",
        "Kota",
        "Nama Menu",
        "Kategori",
        "Harga"
    ]

    st.dataframe(
        tabel,
        width="stretch",
        hide_index=True
    )

else:
    st.info("Tidak ada menu yang sesuai dengan filter.")


# ==========================================
# 14. INFORMASI DATASET
# ==========================================

st.divider()

st.subheader("Informasi Sumber Data")

st.write(
    f"Jumlah data yang ditampilkan: {len(df_filter)} menu"
)

st.caption(
    "Sumber data: Dataset KOPILOGI."
)

st.caption(
    "Dashboard menampilkan informasi katalog menu, "
    "harga, kategori, dan cabang. Dashboard ini "
    "belum menggunakan data transaksi penjualan "
    "maupun persediaan stok."
)

st.caption(
    "Dikembangkan menggunakan Python, Pandas, "
    "Streamlit, dan Plotly."
)
