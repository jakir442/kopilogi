"use client";

import { useCallback, useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  CircleOff,
  Edit3,
  ImageOff,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

import { getMenus } from "../../actions/menu.actions";
import type { MenuCategory } from "../../types";
import { MenuFormDialog } from "./menu-form-dialog";
import { MenuDeleteDialog } from "./menu-delete-dialog";

export type MenuData = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: MenuCategory;
  price: number;
  image: string | null;
  isAvailable: boolean;
  featured: boolean;
  priceVerified: boolean;
  branchId: string;
};

type MenuTheme = "modern-futuristic" | "traditional-heritage" | "contemporary-cozy";

type MenuManagementProps = {
  initialMenus?: MenuData[];
  branchId?: string;
  theme?: MenuTheme;
};

const categories: Array<"Semua" | MenuCategory> = ["Semua", "Kopi", "Minuman", "Makanan"];

const themeConfig: Record<
  MenuTheme,
  {
    eyebrow: string;
    title: string;
    description: string;
    pageClass: string;
    headerClass: string;
    accentClass: string;
    accentSoftClass: string;
    buttonClass: string;
    activeFilterClass: string;
    cardClass: string;
  }
> = {
  "modern-futuristic": {
    eyebrow: "Modern Futuristic",
    title: "Kelola Menu",
    description: "Atur katalog menu, harga, dan ketersediaan produk untuk cabang Kopilogi.",
    pageClass: "bg-[#080d18] text-slate-100",
    headerClass: "border-white/[0.09] bg-[#101827]",
    accentClass: "text-cyan-300",
    accentSoftClass: "border-cyan-300/20 bg-cyan-300/[0.09] text-cyan-200",
    buttonClass:
      "border border-cyan-200/20 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/10 hover:bg-cyan-200",
    activeFilterClass: "border-cyan-300/30 bg-cyan-300 text-slate-950 shadow-sm shadow-cyan-500/10",
    cardClass:
      "border-white/[0.09] bg-[#111a29] hover:border-cyan-300/25 hover:shadow-xl hover:shadow-black/20",
  },

  "traditional-heritage": {
    eyebrow: "Traditional Heritage",
    title: "Menu Cabang 2",
    description: "Kelola menu Waroeng Kopilogi dengan nuansa hangat, klasik, dan berkarakter.",
    pageClass: "bg-[#f6f0e6] text-[#3f3024]",
    headerClass: "border-[#d9c8ad] bg-[#fffaf2]",
    accentClass: "text-[#8a5a32]",
    accentSoftClass: "bg-[#8a5a32]/10 text-[#8a5a32] border-[#8a5a32]/20",
    buttonClass: "bg-[#6f4325] text-[#fffaf2] hover:bg-[#5e371f] shadow-lg shadow-[#6f4325]/10",
    activeFilterClass: "bg-[#6f4325] text-[#fffaf2]",
    cardClass: "border-[#d9c8ad] bg-[#fffaf2] hover:border-[#b89268] hover:shadow-lg",
  },

  "contemporary-cozy": {
    eyebrow: "Contemporary Cozy",
    title: "Menu Cabang 4",
    description:
      "Kelola menu Kopilogi dengan tampilan contemporary yang hangat, nyaman, dan elegan.",
    pageClass: "bg-[#f5f3ef] text-[#292622]",
    headerClass: "border-[#ddd8cf] bg-white",
    accentClass: "text-[#9a6847]",
    accentSoftClass: "bg-[#9a6847]/10 text-[#9a6847] border-[#9a6847]/20",
    buttonClass: "bg-[#292622] text-white hover:bg-[#3b3732] shadow-lg shadow-black/10",
    activeFilterClass: "bg-[#292622] text-white",
    cardClass: "border-[#ddd8cf] bg-white hover:border-[#c5b6a6] hover:shadow-lg",
  },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function MenuManagement({
  initialMenus = [],
  branchId,
  theme = "modern-futuristic",
}: MenuManagementProps) {
  const config = themeConfig[theme];
  const isModern = theme === "modern-futuristic";

  const [menus, setMenus] = useState<MenuData[]>(initialMenus);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"Semua" | MenuCategory>("Semua");

  const [formOpen, setFormOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<MenuData | null>(null);

  const loadMenus = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getMenus(branchId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setMenus((result.data ?? []) as MenuData[]);
    } catch (error: unknown) {
      console.error("loadMenus error:", error);
      toast.error("Gagal memuat data menu.");
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return menus.filter((menu) => {
      const matchesSearch =
        !keyword ||
        menu.name.toLowerCase().includes(keyword) ||
        menu.description.toLowerCase().includes(keyword);

      const matchesCategory = category === "Semua" || menu.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [menus, search, category]);

  const availableCount = useMemo(() => menus.filter((menu) => menu.isAvailable).length, [menus]);

  const featuredCount = useMemo(() => menus.filter((menu) => menu.featured).length, [menus]);

  function handleCreate() {
    setSelectedMenu(null);
    setFormOpen(true);
  }

  function handleEdit(menu: MenuData) {
    setSelectedMenu(menu);
    setFormOpen(true);
  }

  function handleDelete(menu: MenuData) {
    setMenuToDelete(menu);
    setDeleteOpen(true);
  }

  function handleSuccess() {
    void loadMenus();
  }

  return (
    <div className={`min-h-screen ${config.pageClass}`}>
      <div className='relative isolate min-h-screen overflow-hidden'>
        {isModern && (
          <>
            <div className='pointer-events-none absolute -right-40 -top-36 -z-10 size-[28rem] rounded-full bg-cyan-400/[0.07] blur-[100px]' />
            <div className='pointer-events-none absolute -left-40 top-[30rem] -z-10 size-[25rem] rounded-full bg-blue-500/[0.06] blur-[100px]' />
            <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent' />
          </>
        )}

        {theme === "traditional-heritage" && (
          <>
            <div className='pointer-events-none absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-[#b89268]/10 blur-3xl' />
            <div className='pointer-events-none absolute -left-24 bottom-0 -z-10 size-80 rounded-full bg-[#8a5a32]/5 blur-3xl' />
          </>
        )}

        {theme === "contemporary-cozy" && (
          <>
            <div className='pointer-events-none absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-[#c59b7a]/10 blur-3xl' />
            <div className='pointer-events-none absolute -left-24 top-1/2 -z-10 size-80 rounded-full bg-[#b9a28d]/10 blur-3xl' />
          </>
        )}

        <div className='relative mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6 lg:p-8'>
          <header
            className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm md:rounded-3xl md:p-7 ${config.headerClass}`}
          >
            {isModern && (
              <div className='pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-cyan-300/[0.035] to-transparent' />
            )}

            <div className='relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
              <div className='min-w-0'>
                <div className='mb-3 flex flex-wrap items-center gap-2'>
                  <span
                    className={`inline-flex size-9 items-center justify-center rounded-xl border ${config.accentSoftClass}`}
                  >
                    <UtensilsCrossed className='size-4' />
                  </span>

                  <span
                    className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${config.accentClass}`}
                  >
                    {config.eyebrow}
                  </span>

                  {isModern && (
                    <span className='inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[10px] font-medium text-slate-400'>
                      <span className='size-1.5 rounded-full bg-cyan-300' />
                      MENU MANAGEMENT
                    </span>
                  )}
                </div>

                <h1 className='text-2xl font-semibold tracking-tight md:text-3xl'>
                  {config.title}
                </h1>

                <p
                  className={`mt-2 max-w-xl text-sm leading-6 ${
                    isModern ? "text-slate-400" : "text-current/60"
                  }`}
                >
                  {config.description}
                </p>
              </div>

              <button
                type='button'
                onClick={handleCreate}
                className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 ${
                  isModern ? "focus-visible:ring-offset-[#101827]" : ""
                } ${config.buttonClass}`}
              >
                <Plus className='size-4' />
                Tambah Menu
              </button>
            </div>

            <div
              className={`relative mt-6 grid grid-cols-2 gap-3 border-t pt-5 sm:grid-cols-3 ${
                isModern ? "border-white/[0.08]" : "border-current/10"
              }`}
            >
              <div
                className={`rounded-xl border px-4 py-3 ${
                  isModern
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-current/[0.07] bg-black/[0.015]"
                }`}
              >
                <p className={`text-xs ${isModern ? "text-slate-400" : "text-current/55"}`}>
                  Total menu
                </p>

                <p className='mt-1 text-xl font-semibold tabular-nums'>
                  {menus.length}
                  <span
                    className={`ml-1.5 text-xs font-normal ${
                      isModern ? "text-slate-500" : "text-current/50"
                    }`}
                  >
                    item
                  </span>
                </p>
              </div>

              <div
                className={`rounded-xl border px-4 py-3 ${
                  isModern
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-current/[0.07] bg-black/[0.015]"
                }`}
              >
                <p className={`text-xs ${isModern ? "text-slate-400" : "text-current/55"}`}>
                  Menu tersedia
                </p>

                <p className='mt-1 flex items-center gap-2 text-xl font-semibold tabular-nums'>
                  {availableCount}

                  <CheckCircle2
                    className={`size-4 ${isModern ? "text-emerald-400" : "text-emerald-500"}`}
                  />
                </p>
              </div>

              <div
                className={`col-span-2 rounded-xl border px-4 py-3 sm:col-span-1 ${
                  isModern
                    ? "border-white/[0.07] bg-white/[0.025]"
                    : "border-current/[0.07] bg-black/[0.015]"
                }`}
              >
                <p className={`text-xs ${isModern ? "text-slate-400" : "text-current/55"}`}>
                  Menu unggulan
                </p>

                <p className='mt-1 text-xl font-semibold tabular-nums'>
                  {featuredCount}

                  <span
                    className={`ml-1.5 text-xs font-normal ${
                      isModern ? "text-slate-500" : "text-current/50"
                    }`}
                  >
                    item
                  </span>
                </p>
              </div>
            </div>
          </header>

          <section
            aria-label='Pencarian dan filter menu'
            className={`rounded-2xl border p-4 md:p-5 ${config.headerClass}`}
          >
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
                <div className='relative min-w-0 flex-1'>
                  <Search
                    className={`pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 ${
                      isModern ? "text-slate-500" : "text-current/40"
                    }`}
                  />

                  <input
                    type='search'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder='Cari nama atau deskripsi menu...'
                    aria-label='Cari menu'
                    className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition placeholder:transition-colors focus-visible:ring-2 ${
                      isModern
                        ? "border-white/[0.09] bg-[#0b1220] text-slate-100 placeholder:text-slate-600 focus:border-cyan-300/40 focus-visible:ring-cyan-300/10"
                        : "border-current/10 bg-background placeholder:text-current/30 focus-visible:ring-current/10"
                    }`}
                  />
                </div>

                <button
                  type='button'
                  onClick={() => void loadMenus()}
                  disabled={loading}
                  className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isModern
                      ? "border-white/[0.09] bg-white/[0.025] text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      : "border-current/10 hover:bg-black/5"
                  }`}
                >
                  <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                  Muat ulang
                </button>
              </div>

              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <p
                  className={`text-xs font-medium ${
                    isModern ? "text-slate-500" : "text-current/50"
                  }`}
                >
                  Filter berdasarkan kategori
                </p>

                <div
                  className={`flex max-w-full gap-1.5 overflow-x-auto rounded-xl p-1 ${
                    isModern ? "bg-[#090f1c]" : "bg-black/[0.035]"
                  }`}
                  aria-label='Kategori menu'
                >
                  {categories.map((item) => {
                    const isActive = category === item;

                    return (
                      <button
                        key={item}
                        type='button'
                        onClick={() => setCategory(item)}
                        aria-pressed={isActive}
                        className={`inline-flex h-9 shrink-0 items-center justify-center rounded-lg border px-3.5 text-xs font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${
                          isActive
                            ? config.activeFilterClass
                            : isModern
                              ? "border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                              : "border-transparent text-current/60 hover:bg-black/5"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <div className='flex flex-wrap items-center justify-between gap-2 px-1'>
            <p className={`text-sm ${isModern ? "text-slate-400" : "text-current/55"}`}>
              Menampilkan{" "}
              <span
                className={`font-semibold tabular-nums ${
                  isModern ? "text-slate-100" : "text-current"
                }`}
              >
                {filteredMenus.length}
              </span>{" "}
              dari{" "}
              <span
                className={`font-semibold tabular-nums ${
                  isModern ? "text-slate-100" : "text-current"
                }`}
              >
                {menus.length}
              </span>{" "}
              menu
            </p>

            {(search || category !== "Semua") && (
              <button
                type='button'
                onClick={() => {
                  setSearch("");
                  setCategory("Semua");
                }}
                className={`text-xs font-medium transition ${
                  isModern
                    ? "text-cyan-300 hover:text-cyan-200"
                    : "text-current/65 hover:text-current"
                }`}
              >
                Reset filter
              </button>
            )}
          </div>

          {loading && menus.length === 0 ? (
            <div
              className={`flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border ${config.headerClass}`}
            >
              <Loader2
                className={`size-6 animate-spin ${isModern ? "text-cyan-300" : config.accentClass}`}
              />

              <p className={`text-sm ${isModern ? "text-slate-400" : "text-current/50"}`}>
                Memuat data menu...
              </p>
            </div>
          ) : filteredMenus.length === 0 ? (
            <div
              className={`flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center ${config.headerClass}`}
            >
              <div
                className={`mb-4 flex size-14 items-center justify-center rounded-2xl border ${config.accentSoftClass}`}
              >
                {search || category !== "Semua" ? (
                  <Search className='size-6' />
                ) : (
                  <UtensilsCrossed className='size-6' />
                )}
              </div>

              <h2 className='text-base font-semibold'>
                {search || category !== "Semua" ? "Menu tidak ditemukan" : "Belum ada menu"}
              </h2>

              <p
                className={`mt-2 max-w-sm text-sm leading-6 ${
                  isModern ? "text-slate-400" : "text-current/50"
                }`}
              >
                {search || category !== "Semua"
                  ? "Coba ubah kata kunci atau pilih kategori lain untuk menemukan menu."
                  : "Mulai lengkapi katalog cabang ini dengan menambahkan menu pertama."}
              </p>

              {search || category !== "Semua" ? (
                <button
                  type='button'
                  onClick={() => {
                    setSearch("");
                    setCategory("Semua");
                  }}
                  className={`mt-5 inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition ${
                    isModern
                      ? "border-white/10 hover:bg-white/[0.05]"
                      : "border-current/10 hover:bg-black/5"
                  }`}
                >
                  Reset pencarian
                </button>
              ) : (
                <button
                  type='button'
                  onClick={handleCreate}
                  className={`mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${config.buttonClass}`}
                >
                  <Plus className='size-4' />
                  Tambah menu pertama
                </button>
              )}
            </div>
          ) : (
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {filteredMenus.map((menu) => (
                <article
                  key={menu._id}
                  className={`group overflow-hidden rounded-2xl border transition duration-300 ${
                    isModern
                      ? "shadow-[0_8px_28px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:border-cyan-300/25 hover:shadow-[0_16px_36px_rgba(0,0,0,0.2)]"
                      : "shadow-sm hover:-translate-y-1 hover:shadow-lg"
                  } ${config.cardClass}`}
                >
                  <div
                    className={`relative aspect-[16/10] overflow-hidden ${
                      isModern ? "bg-[#0b1220]" : "bg-black/5"
                    }`}
                  >
                    {menu.image ? (
                      <img
                        src={menu.image}
                        alt={menu.name}
                        loading='lazy'
                        className='size-full object-cover transition duration-500 group-hover:scale-[1.035]'
                      />
                    ) : (
                      <div
                        className={`flex size-full flex-col items-center justify-center gap-2 ${
                          isModern ? "text-slate-600" : "text-current/30"
                        }`}
                      >
                        <ImageOff className='size-7' />
                        <span className='text-xs'>Belum ada gambar</span>
                      </div>
                    )}

                    <div className='absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-black/50 to-transparent p-3.5'>
                      <span className='rounded-lg border border-white/15 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-md'>
                        {menu.category}
                      </span>

                      {menu.featured && (
                        <span
                          className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-md ${
                            isModern
                              ? "border-cyan-200/30 bg-cyan-300/15 text-cyan-100"
                              : config.accentSoftClass
                          }`}
                        >
                          Menu unggulan
                        </span>
                      )}
                    </div>

                    <div className='absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent' />
                  </div>

                  <div className='space-y-4 p-4 md:p-5'>
                    <div className='min-w-0'>
                      <div className='flex items-start justify-between gap-3'>
                        <h2
                          className={`line-clamp-1 text-base font-semibold tracking-tight ${
                            isModern ? "text-slate-100" : "text-current"
                          }`}
                          title={menu.name}
                        >
                          {menu.name}
                        </h2>

                        {menu.isAvailable ? (
                          <span title='Menu tersedia' className='mt-0.5 shrink-0 text-emerald-400'>
                            <CheckCircle2 className='size-[17px]' />
                          </span>
                        ) : (
                          <span
                            title='Menu tidak tersedia'
                            className={`mt-0.5 shrink-0 ${
                              isModern ? "text-slate-500" : "text-current/35"
                            }`}
                          >
                            <CircleOff className='size-[17px]' />
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-1.5 line-clamp-2 min-h-10 text-[13px] leading-5 ${
                          isModern ? "text-slate-400" : "text-current/55"
                        }`}
                      >
                        {menu.description || "Belum ada deskripsi menu."}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border p-3 ${
                        isModern
                          ? "border-white/[0.07] bg-[#0b1220]/70"
                          : "border-current/[0.07] bg-black/[0.02]"
                      }`}
                    >
                      <div className='flex items-center justify-between gap-3'>
                        <div className='min-w-0'>
                          <p
                            className={`text-[10px] font-medium uppercase tracking-[0.13em] ${
                              isModern ? "text-slate-500" : "text-current/45"
                            }`}
                          >
                            Harga menu
                          </p>

                          <p
                            className={`mt-1 truncate text-lg font-semibold tracking-tight ${
                              isModern ? "text-white" : "text-current"
                            }`}
                          >
                            {formatPrice(menu.price)}
                          </p>
                        </div>

                        {menu.priceVerified ? (
                          <span
                            className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1.5 text-[10px] font-medium ${
                              isModern
                                ? "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300"
                                : "border-emerald-500/15 bg-emerald-500/10 text-emerald-600"
                            }`}
                          >
                            <BadgeCheck className='size-3.5' />
                            Terverifikasi
                          </span>
                        ) : (
                          <span
                            className={`inline-flex shrink-0 items-center rounded-lg border px-2 py-1.5 text-[10px] font-medium ${
                              isModern
                                ? "border-amber-400/15 bg-amber-400/[0.07] text-amber-300"
                                : "border-amber-500/15 bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            Belum diverifikasi
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center justify-between gap-3'>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                          menu.isAvailable
                            ? isModern
                              ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300"
                              : "border-emerald-500/15 bg-emerald-500/10 text-emerald-600"
                            : isModern
                              ? "border-white/[0.08] bg-white/[0.035] text-slate-400"
                              : "border-current/10 bg-black/[0.03] text-current/50"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            menu.isAvailable
                              ? "bg-emerald-400"
                              : isModern
                                ? "bg-slate-500"
                                : "bg-current/35"
                          }`}
                        />

                        {menu.isAvailable ? "Tersedia" : "Tidak tersedia"}
                      </span>

                      <span
                        className={`text-[10px] ${isModern ? "text-slate-500" : "text-current/40"}`}
                      >
                        {menu.featured ? "Direkomendasikan" : "Menu reguler"}
                      </span>
                    </div>

                    <div
                      className={`grid grid-cols-[1fr_auto] gap-2 border-t pt-3 ${
                        isModern ? "border-white/[0.08]" : "border-current/10"
                      }`}
                    >
                      <button
                        type='button'
                        onClick={() => handleEdit(menu)}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 ${
                          isModern
                            ? "border-white/[0.09] bg-white/[0.025] text-slate-200 hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-100 focus-visible:ring-cyan-300/40"
                            : "border-current/10 hover:bg-black/5 focus-visible:ring-current/20"
                        }`}
                      >
                        <Edit3 className='size-3.5' />
                        Edit menu
                      </button>

                      <button
                        type='button'
                        onClick={() => handleDelete(menu)}
                        className={`inline-flex size-10 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 ${
                          isModern
                            ? "border-white/[0.09] text-slate-400 hover:border-red-400/20 hover:bg-red-400/[0.08] hover:text-red-300"
                            : "border-red-500/15 text-red-500 hover:bg-red-500/10"
                        }`}
                        title={`Hapus ${menu.name}`}
                        aria-label={`Hapus ${menu.name}`}
                      >
                        <Trash2 className='size-4' />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {loading && menus.length > 0 && (
            <div
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs ${
                isModern
                  ? "border-white/[0.08] bg-white/[0.025] text-slate-400"
                  : "border-current/10 text-current/50"
              }`}
              role='status'
              aria-live='polite'
            >
              <Loader2 className='size-3.5 animate-spin' />
              Memperbarui data menu...
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          IMPORTANT:
          theme dikirim ke MenuFormDialog agar Cabang 1 memakai
          tampilan modern-futuristic.
          ========================================================= */}
      <MenuFormDialog
        menu={selectedMenu}
        open={formOpen}
        onOpenChange={setFormOpen}
        branchId={branchId}
        onSuccess={handleSuccess}
        theme={theme}
      />

      <MenuDeleteDialog
        menu={menuToDelete}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        branchId={branchId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
