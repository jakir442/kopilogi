"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, ArrowRight, Coffee, Search, SlidersHorizontal, Star, X } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

import { MenuCard } from "./menu-card";

import type { PublicMenu, PublicMenuCategory } from "../../types";

type CategoryFilter = "Semua" | PublicMenuCategory;
type SortOption = "unggulan" | "nama-asc" | "harga-asc" | "harga-desc";
type BranchSlug = "cabang-1" | "cabang-2" | "cabang-4";

type MenuPageProps = {
  menus: PublicMenu[];
  branchSlug: BranchSlug;
  initialCategory?: CategoryFilter;
};

const categories: CategoryFilter[] = ["Semua", "Kopi", "Minuman", "Makanan"];

const branches: Record<
  BranchSlug,
  {
    name: string;
    location: string;
    concept: string;
    eyebrow: string;
    title: string;
    description: string;
    page: string;
    muted: string;
    accent: string;
    border: string;
    card: string;
    options: string;
  }
> = {
  "cabang-1": {
    name: "Kopilogi Cikuray",
    location: "GARUT",
    concept: "Modern Futuristic",
    eyebrow: "THE MENU / 01",
    title: "Coffee. Your rhythm.",
    description: "Temukan kopi, minuman, dan makanan untuk menemani ritme harimu di Cikuray.",
    page: "bg-[#1D1F20] text-[#E7E9EA]",
    muted: "text-[#E7E9EA]/65",
    accent: "bg-[#B8C0C4] text-[#1D1F20]",
    border: "border-[#666D71]/50",
    card: "bg-[#34383B]",
    options: "bg-[#34383B] text-[#E7E9EA]",
  },
  "cabang-2": {
    name: "Waroeng Kopilogi",
    location: "GARUT",
    concept: "Traditional Heritage",
    eyebrow: "DAFTAR MENU / 02",
    title: "Secangkir kopi, sejuta cerita.",
    description: "Jelajahi pilihan menu Waroeng Kopilogi dalam suasana hangat yang penuh cerita.",
    page: "bg-[#F3EBDD] text-[#292722]",
    muted: "text-[#292722]/70",
    accent: "bg-[#765239] text-[#F3EBDD]",
    border: "border-[#765239]/25",
    card: "bg-white/40",
    options: "bg-[#F3EBDD] text-[#292722]",
  },
  "cabang-4": {
    name: "Kopilogi Tasik",
    location: "TASIKMALAYA",
    concept: "Industrial Concrete",
    eyebrow: "EXPLORE THE MENU / 04",
    title: "A little pause, a better day.",
    description: "Temukan pilihan untuk menemani waktu istirahatmu di Kopilogi Tasik.",
    page: "bg-[#F4F3EF] text-[#2C302E]",
    muted: "text-[#2C302E]/70",
    accent: "bg-[#E5A93C] text-[#2C302E]",
    border: "border-[#C0C4C6]",
    card: "bg-white/70",
    options: "bg-[#F4F3EF] text-[#2C302E]",
  },
};

const sortLabels: Record<SortOption, string> = {
  unggulan: "Menu unggulan dahulu",
  "nama-asc": "Nama A–Z",
  "harga-asc": "Harga terendah",
  "harga-desc": "Harga tertinggi",
};

export function MenuPage({ menus, branchSlug, initialCategory = "Semua" }: MenuPageProps) {
  const branch = branches[branchSlug];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [sort, setSort] = useState<SortOption>("unggulan");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

    const result = menus.filter((item) => {
      const matchesCategory = category === "Semua" || item.category === category;

      const matchesSearch =
        !normalizedSearch ||
        item.name.toLocaleLowerCase("id-ID").includes(normalizedSearch) ||
        item.description.toLocaleLowerCase("id-ID").includes(normalizedSearch);

      const matchesFeatured = !featuredOnly || item.featured;

      return matchesCategory && matchesSearch && matchesFeatured;
    });

    return result.sort((a, b) => {
      if (sort === "nama-asc") {
        return a.name.localeCompare(b.name, "id");
      }

      if (sort === "harga-asc" || sort === "harga-desc") {
        // Harga yang belum terverifikasi selalu ditempatkan di akhir.
        if (a.priceVerified !== b.priceVerified) {
          return a.priceVerified ? -1 : 1;
        }

        if (!a.priceVerified || !b.priceVerified) {
          return a.name.localeCompare(b.name, "id");
        }

        return sort === "harga-asc" ? a.price - b.price : b.price - a.price;
      }

      // Menu unggulan ditampilkan terlebih dahulu.
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      return a.name.localeCompare(b.name, "id");
    });
  }, [menus, search, category, featuredOnly, sort]);

  const hasActiveFilters =
    search.trim() !== "" || category !== "Semua" || featuredOnly || sort !== "unggulan";

  function resetFilters() {
    setSearch("");
    setCategory("Semua");
    setFeaturedOnly(false);
    setSort("unggulan");
  }

  return (
    <main className={`min-h-screen ${branch.page}`}>
      <section className={`border-b ${branch.border}`}>
        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/#locations"
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border ${branch.border} px-4 py-2 text-sm transition hover:opacity-70`}
            >
              <ArrowRight className="size-4 rotate-180" />
              Pilih cabang lain
            </Link>

            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs ${branch.muted}`}
            >
              {branch.location} · {branch.concept}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p
                className={`mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] sm:text-xs ${branch.muted}`}
              >
                {branch.eyebrow}
              </p>

              <SectionHeading
                label={branch.name}
                title={branch.title}
                description={branch.description}
              />
            </div>

            <div
              className={`flex items-center gap-3 rounded-2xl border ${branch.border} ${branch.card} p-4`}
            >
              <Coffee className="size-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Menu satu cabang</p>
                <p className={`mt-1 text-xs ${branch.muted}`}>Hanya menu dari {branch.name}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-10 sm:py-12 lg:py-16">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block flex-1">
                <Search
                  className={`pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 ${branch.muted}`}
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama atau deskripsi menu..."
                  aria-label="Cari menu"
                  className={`h-12 w-full rounded-xl border ${branch.border} ${branch.card} pl-11 pr-4 text-sm outline-none transition placeholder:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
                />
              </label>

              <label className="relative block sm:w-64">
                <ArrowDownUp
                  className={`pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 ${branch.muted}`}
                />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  aria-label="Urutkan menu"
                  className={`h-12 w-full appearance-none rounded-xl border ${branch.border} ${branch.options} pl-11 pr-4 text-sm outline-none focus-visible:ring-2`}
                >
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categories.map((item) => {
                const isSelected = category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={isSelected}
                    className={`min-h-10 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? `${branch.accent} border-transparent`
                        : `${branch.border} hover:opacity-70`
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              <span className={`mx-1 hidden h-6 w-px sm:block ${branch.border} border-l`} />

              <button
                type="button"
                onClick={() => setFeaturedOnly((current) => !current)}
                aria-pressed={featuredOnly}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  featuredOnly
                    ? `${branch.accent} border-transparent`
                    : `${branch.border} hover:opacity-70`
                }`}
              >
                <Star className="size-4" />
                Menu unggulan
              </button>
            </div>
          </div>

          <div className={`mt-10 border-t ${branch.border} pt-6`}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{filteredItems.length} menu ditemukan</p>
                <p className={`mt-1 text-xs ${branch.muted}`}>
                  {hasActiveFilters
                    ? "Hasil berdasarkan filter yang kamu pilih."
                    : "Menampilkan menu tersedia dari cabang ini."}
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-sm font-medium underline underline-offset-4 transition hover:opacity-65"
                >
                  <X className="size-4" />
                  Reset filter
                </button>
              )}
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div
                className={`flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed ${branch.border} ${branch.card} px-6 text-center`}
              >
                <div
                  className={`flex size-12 items-center justify-center rounded-full ${branch.accent}`}
                >
                  <SlidersHorizontal className="size-5" />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  {menus.length === 0 ? "Menu belum tersedia" : "Menu tidak ditemukan"}
                </h2>

                <p className={`mt-2 max-w-md text-sm leading-6 ${branch.muted}`}>
                  {menus.length === 0
                    ? `Belum ada menu tersedia yang dapat ditampilkan dari ${branch.name}.`
                    : "Coba kata kunci lain, pilih kategori berbeda, atau hapus filter menu unggulan."}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:opacity-80 ${branch.accent}`}
                  >
                    Reset pencarian
                    <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
