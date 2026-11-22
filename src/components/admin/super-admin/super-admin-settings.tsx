"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  FolderPlus,
  CircleHelp,
  Layers,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowLeft,
} from "lucide-react";

import {
  addFaqCategory,
  createFaq,
  deleteFaq,
  deleteFaqCategory,
  updateFaq,
  type FaqAdminItem,
} from "@/features/faq/actions/faq.actions";

type SuperAdminSettingsProps = {
  name: string;
  email: string;
  initialFaqs: FaqAdminItem[];
  initialCategories: string[];
};

type FAQ = FaqAdminItem;

type Notice = {
  type: "success" | "error";
  message: string;
};

export function SuperAdminSettings({
  initialFaqs,
  initialCategories,
}: SuperAdminSettingsProps) {
  const [activeTab, setActiveTab] = useState<"faq" | "category">("faq");

  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [categories, setCategories] = useState<string[]>(initialCategories);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");

  const [newCategory, setNewCategory] = useState("");

  const [saving, setSaving] = useState(false);
  const [categoryBusy, setCategoryBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Notifikasi hilang otomatis setelah 4 detik
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const inputClass =
    "mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-[#9a7956] focus:ring-4 focus:ring-[#9a7956]/10";

  const filteredFaqs = useMemo(() => {
    const keyword = search.toLowerCase();

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword) ||
        faq.category.toLowerCase().includes(keyword),
    );
  }, [faqs, search]);

  const publishedCount = faqs.filter(
    (faq) => faq.status === "Published",
  ).length;

  const draftCount = faqs.filter(
    (faq) => faq.status === "Draft",
  ).length;

  // Pastikan kategori FAQ yang sedang diedit tetap muncul di pilihan
  const categoryOptions =
    !selectedCategory || categories.includes(selectedCategory)
      ? categories
      : [...categories, selectedCategory];

  function resetForm() {
    setQuestion("");
    setAnswer("");
    setSelectedCategory("");
    setStatus("Draft");
    setEditingId(null);
    setShowForm(false);
  }

  function openAddForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(faq: FAQ) {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setSelectedCategory(faq.category);
    setStatus(faq.status);
    setShowForm(true);
  }

  async function handleSaveFaq() {
    if (!question.trim() || !answer.trim() || !selectedCategory) {
      setNotice({
        type: "error",
        message: "Lengkapi kategori, pertanyaan, dan jawaban terlebih dahulu.",
      });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        category: selectedCategory,
        status,
      };

      const result = editingId
        ? await updateFaq(editingId, payload)
        : await createFaq(payload);

      if (result.success && result.data) {
        const saved = result.data;

        setFaqs((current) =>
          editingId
            ? current.map((faq) => (faq.id === saved.id ? saved : faq))
            : [saved, ...current],
        );

        resetForm();
      }

      setNotice({
        type: result.success ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("[SuperAdminSettings] save FAQ error:", error);
      setNotice({
        type: "error",
        message: "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteFaq(id: string) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus FAQ ini?",
    );

    if (!confirmed) return;

    try {
      const result = await deleteFaq(id);

      if (result.success) {
        setFaqs((current) => current.filter((faq) => faq.id !== id));
      }

      setNotice({
        type: result.success ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("[SuperAdminSettings] delete FAQ error:", error);
      setNotice({
        type: "error",
        message: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  async function handleAddCategory() {
    const category = newCategory.trim();

    if (!category) return;

    const alreadyExists = categories.some(
      (item) => item.toLowerCase() === category.toLowerCase(),
    );

    if (alreadyExists) {
      setNotice({ type: "error", message: "Kategori tersebut sudah tersedia." });
      return;
    }

    setCategoryBusy(true);

    try {
      const result = await addFaqCategory(category);

      if (result.success && result.data) {
        const added = result.data;
        setCategories((current) => [...current, added]);
        setNewCategory("");
      }

      setNotice({
        type: result.success ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("[SuperAdminSettings] add category error:", error);
      setNotice({
        type: "error",
        message: "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setCategoryBusy(false);
    }
  }

  async function handleDeleteCategory(category: string) {
    const isUsed = faqs.some((faq) => faq.category === category);

    if (isUsed) {
      setNotice({
        type: "error",
        message:
          "Kategori masih digunakan oleh FAQ. Ubah kategori FAQ terlebih dahulu.",
      });
      return;
    }

    const confirmed = window.confirm(`Hapus kategori "${category}"?`);

    if (!confirmed) return;

    try {
      const result = await deleteFaqCategory(category);

      if (result.success) {
        setCategories((current) =>
          current.filter((item) => item !== category),
        );
      }

      setNotice({
        type: result.success ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("[SuperAdminSettings] delete category error:", error);
      setNotice({
        type: "error",
        message: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-[#22221f]">
      {/* Notifikasi (dirender di luar layout supaya tidak tertutup elemen lain) */}
      {notice &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 2147483647,
              maxWidth: "min(92vw, 380px)",
            }}
            className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl ${
              notice.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {notice.type === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 size-4 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>,
          document.body,
        )}

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">

        {/* Navigation */}
        <div className="mb-6">
          <a
            href="/admin/super-admin"
            className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-[#9a7956]/30 hover:bg-[#f3f1ec] hover:text-[#806646]"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Dashboard
          </a>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#eee8df]">
            <CircleHelp className="size-6 text-[#806646]" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7956]">
            Content Management
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Pengaturan FAQs
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                Kelola pertanyaan, jawaban, dan kategori FAQ yang akan
                ditampilkan kepada pengunjung Kopilogi.
              </p>
            </div>

            {activeTab === "faq" && (
              <button
                type="button"
                onClick={openAddForm}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#24221e] px-5 text-sm font-medium text-white transition hover:bg-[#806646]"
              >
                <Plus className="size-4" />
                Tambah FAQ
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/[0.05] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#f3f1ec]">
                <FileText className="size-5 text-[#806646]" />
              </div>
              <span className="text-xs text-neutral-400">Semua FAQ</span>
            </div>
            <p className="mt-4 text-3xl font-semibold">{faqs.length}</p>
            <p className="mt-1 text-sm text-neutral-500">Total pertanyaan</p>
          </div>

          <div className="rounded-2xl border border-black/[0.05] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle2 className="size-5 text-green-700" />
              </div>
              <span className="text-xs text-neutral-400">Aktif</span>
            </div>
            <p className="mt-4 text-3xl font-semibold">{publishedCount}</p>
            <p className="mt-1 text-sm text-neutral-500">FAQ Published</p>
          </div>

          <div className="rounded-2xl border border-black/[0.05] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50">
                <Eye className="size-5 text-amber-700" />
              </div>
              <span className="text-xs text-neutral-400">Belum tayang</span>
            </div>
            <p className="mt-4 text-3xl font-semibold">{draftCount}</p>
            <p className="mt-1 text-sm text-neutral-500">FAQ Draft</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-neutral-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab("faq");
              resetForm();
            }}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "faq"
                ? "border-[#806646] text-[#806646]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <CircleHelp className="size-4" />
            Daftar FAQ
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("category");
              resetForm();
            }}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "category"
                ? "border-[#806646] text-[#806646]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Layers className="size-4" />
            Kategori
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <>
            {showForm ? (
              <section className="rounded-2xl border border-black/[0.05] bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {editingId ? "Edit FAQ" : "Tambah FAQ Baru"}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      Lengkapi informasi pertanyaan dan jawaban FAQ.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                    aria-label="Tutup formulir"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="faq-category"
                      className="text-sm font-medium"
                    >
                      Kategori FAQ
                    </label>
                    <select
                      id="faq-category"
                      value={selectedCategory}
                      onChange={(event) =>
                        setSelectedCategory(event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Pilih kategori</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="mt-2 text-xs text-amber-700">
                        Belum ada kategori. Tambahkan kategori terlebih dahulu
                        melalui tab Kategori.
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="faq-question"
                      className="text-sm font-medium"
                    >
                      Pertanyaan
                    </label>
                    <input
                      id="faq-question"
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      className={inputClass}
                      placeholder="Contoh: Bagaimana cara melakukan pemesanan?"
                      maxLength={250}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="faq-answer"
                      className="text-sm font-medium"
                    >
                      Jawaban
                    </label>
                    <textarea
                      id="faq-answer"
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      className={`${inputClass} min-h-36 resize-y`}
                      placeholder="Tuliskan jawaban FAQ di sini..."
                      rows={5}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="faq-status"
                      className="text-sm font-medium"
                    >
                      Status publikasi
                    </label>
                    <select
                      id="faq-status"
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value as "Draft" | "Published")
                      }
                      className={inputClass}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                    <p className="mt-2 text-xs text-neutral-400">
                      FAQ berstatus Published akan tampil di halaman FAQ publik.
                      FAQ berstatus Draft tidak ditampilkan.
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="h-11 rounded-xl border border-neutral-200 px-5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-40"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveFaq}
                    disabled={saving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#24221e] px-5 text-sm font-medium text-white transition hover:bg-[#806646] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCircle2 className="size-4" />
                    {saving
                      ? "Menyimpan..."
                      : editingId
                        ? "Simpan Perubahan"
                        : "Simpan FAQ"}
                  </button>
                </div>
              </section>
            ) : (
              <section className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold">Daftar Pertanyaan</h2>
                    <p className="mt-1 text-xs text-neutral-400">
                      Kelola seluruh pertanyaan dan jawaban FAQ.
                    </p>
                  </div>

                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Cari pertanyaan..."
                      className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-[#9a7956] focus:ring-4 focus:ring-[#9a7956]/10"
                    />
                  </div>
                </div>

                {filteredFaqs.length === 0 ? (
                  <div className="px-5 py-16 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f3f1ec]">
                      <CircleHelp className="size-7 text-[#806646]" />
                    </div>
                    <h3 className="mt-4 font-semibold">
                      {search ? "FAQ tidak ditemukan" : "Belum ada FAQ"}
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                      {search
                        ? "Coba gunakan kata kunci pencarian yang berbeda."
                        : "Mulai tambahkan pertanyaan dan jawaban yang sering ditanyakan oleh pelanggan Kopilogi."}
                    </p>
                    {!search && (
                      <button
                        type="button"
                        onClick={openAddForm}
                        className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#24221e] px-4 text-sm font-medium text-white transition hover:bg-[#806646]"
                      >
                        <Plus className="size-4" />
                        Tambah FAQ
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {filteredFaqs.map((faq, index) => (
                      <div
                        key={faq.id}
                        className="flex flex-col gap-4 p-5 transition hover:bg-[#fcfbf9] sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="flex min-w-0 gap-4">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f3f1ec] text-sm font-semibold text-[#806646]">
                            {index + 1}
                          </span>

                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-lg bg-[#f3f1ec] px-2.5 py-1 text-xs font-medium text-[#806646]">
                                {faq.category}
                              </span>
                              <span
                                className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                                  faq.status === "Published"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {faq.status}
                              </span>
                            </div>

                            <h3 className="font-medium leading-6">
                              {faq.question}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
                              {faq.answer}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 pl-13 sm:pl-0">
                          <button
                            type="button"
                            onClick={() => openEditForm(faq)}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-600 transition hover:border-[#9a7956] hover:text-[#806646]"
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            aria-label="Hapus FAQ"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-neutral-100 px-5 py-4">
                  <p className="text-xs text-neutral-400">
                    Menampilkan {filteredFaqs.length} dari {faqs.length} FAQ
                  </p>
                </div>
              </section>
            )}
          </>
        )}

        {/* Category Tab */}
        {activeTab === "category" && (
          <section className="rounded-2xl border border-black/[0.05] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="font-semibold">Kategori FAQ</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Kelompokkan pertanyaan agar pelanggan lebih mudah menemukan
                informasi.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void handleAddCategory();
                }}
                placeholder="Masukkan nama kategori baru..."
                maxLength={60}
                className="h-11 flex-1 rounded-xl border border-neutral-200 px-4 text-sm outline-none transition focus:border-[#9a7956] focus:ring-4 focus:ring-[#9a7956]/10"
              />

              <button
                type="button"
                onClick={handleAddCategory}
                disabled={categoryBusy}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#24221e] px-5 text-sm font-medium text-white transition hover:bg-[#806646] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FolderPlus className="size-4" />
                {categoryBusy ? "Menyimpan..." : "Tambah Kategori"}
              </button>
            </div>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Daftar Kategori</h3>
                <span className="text-xs text-neutral-400">
                  {categories.length} kategori
                </span>
              </div>

              {categories.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-200 px-5 py-12 text-center">
                  <Layers className="mx-auto size-8 text-neutral-300" />
                  <p className="mt-3 text-sm font-medium text-neutral-600">
                    Belum ada kategori
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Tambahkan kategori untuk mengelompokkan FAQ.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-100">
                  {categories.map((category) => {
                    const faqCount = faqs.filter(
                      (faq) => faq.category === category,
                    ).length;

                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between gap-4 px-4 py-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f1ec]">
                            <Layers className="size-5 text-[#806646]" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {category}
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">
                              {faqCount} FAQ
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category)}
                          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Hapus kategori ${category}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        <p className="mt-6 text-center text-xs leading-5 text-neutral-400">
          Pengaturan FAQs · Kopilogi Super Admin
        </p>
      </div>
    </div>
  );
}
