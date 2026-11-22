"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Coffee,
  CircleHelp,
  MessageCircle,
  ArrowLeft,
  ArrowDown,
  X,
} from "lucide-react";

export type FaqItem = {
  id?: string | number;
  _id?: string;
  question: string;
  answer: string;
  category: string;
};

type FaqPageViewProps = {
  faqs: FaqItem[];
};

export function FaqPageView({ faqs }: FaqPageViewProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);

  // Kategori dibuat otomatis dari data FAQ yang Published
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(faqs.map((faq) => faq.category).filter(Boolean)),
    );
    return ["Semua", ...unique];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    const keyword = search.toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "Semua" || faq.category === activeCategory;

      const matchesSearch =
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, search]);

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#29251f]">
      {/* Navigation */}
      <nav className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#24221e]">
              <Coffee className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-[0.16em]">
              KOPILOGI
            </span>
          </a>

          <Link
            href="/"
            className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-[#2b211b] px-5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#806646] hover:shadow-lg"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Kembali ke Beranda
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 pb-12 pt-16 text-center sm:pb-16 sm:pt-24">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eee7dd]">
          <CircleHelp className="size-7 text-[#806646]" />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7956]">
          Frequently Asked Questions
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Ada yang bisa kami bantu?
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">
          Temukan jawaban dari berbagai pertanyaan seputar Kopilogi,
          mulai dari pemesanan hingga informasi produk.
        </p>

        {/* Search */}
        <div className="relative mx-auto mt-9 max-w-xl">
          <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari pertanyaan yang ingin kamu ketahui..."
            className="h-14 w-full rounded-2xl border border-black/[0.07] bg-white pl-14 pr-5 text-sm shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-[#9a7956] focus:ring-4 focus:ring-[#9a7956]/10"
          />
        </div>
      </section>

      {/* FAQ Content */}
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        {/* Categories */}
        <div className="mb-9 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setOpenId(null);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-[#24221e] text-white"
                  : "border border-black/[0.07] bg-white text-neutral-600 hover:border-[#9a7956] hover:text-[#806646]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
            <h2 className="font-semibold">Pertanyaan yang Sering Diajukan</h2>
            <p className="mt-1 text-xs text-neutral-400">
              {filteredFaqs.length} pertanyaan ditemukan
            </p>
          </div>

          {filteredFaqs.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {filteredFaqs.map((faq, index) => {
                const faqId = String(faq.id ?? faq._id ?? index);
                const isOpen = openId === faqId;

                return (
                  <div key={faqId}>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faqId)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition hover:bg-[#fcfaf7] sm:px-8"
                    >
                      <div className="min-w-0">
                        <span className="mb-2 inline-flex rounded-md bg-[#f3eee7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#806646]">
                          {faq.category}
                        </span>

                        <p className="text-sm font-medium leading-6 sm:text-base">
                          {faq.question}
                        </p>
                      </div>

                      <ChevronDown
                        className={`size-5 shrink-0 text-neutral-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="bg-[#fcfaf7] px-6 pb-6 pt-1 sm:px-8">
                        <p className="max-w-3xl text-sm leading-7 text-neutral-600">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <Search className="mx-auto size-8 text-neutral-300" />
              <h3 className="mt-4 font-semibold">
                Pertanyaan tidak ditemukan
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Coba gunakan kata kunci atau kategori lainnya.
              </p>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="mt-8 rounded-2xl bg-[#24221e] px-6 py-8 text-center text-white sm:px-10">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/10">
            <MessageCircle className="size-5" />
          </div>

          <h2 className="mt-4 text-xl font-semibold">
            Masih punya pertanyaan?
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/55">
            Jika belum menemukan jawaban yang kamu cari, silakan tanyakan
            langsung lewat chatbot Kopilogi.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] bg-white px-5 py-7 text-center">
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} Kopilogi. All rights reserved.
        </p>
      </footer>

      {/* Gelembung petunjuk tepat di atas tombol chatbot (pojok kanan bawah) */}
      {showHint && (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end sm:right-6">
          <div className="flex items-center gap-2 rounded-2xl bg-[#24221e] py-2.5 pl-4 pr-2.5 text-sm font-medium text-white shadow-lg">
            Tanya chatbot Kopilogi di sini
            <button
              type="button"
              onClick={() => setShowHint(false)}
              aria-label="Tutup petunjuk"
              className="flex size-6 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <ArrowDown className="mr-5 mt-1 size-6 animate-bounce text-emerald-500 sm:mr-6" />
        </div>
      )}
    </main>
  );
}