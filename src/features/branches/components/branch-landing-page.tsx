"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  MapPin,
  Phone,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { PublicMenu, PublicMenuCategory } from "@/features/menu/types";
import type { BranchContent } from "@/features/content/types";
import { BranchContentSections } from "@/features/content/components/public/branch-content-sections";

type BranchConcept = "modern-futuristic" | "traditional-heritage" | "contemporary-cozy";

type BranchData = {
  name: string;
  slug: string;
  concept: BranchConcept;
  address: string;
  phone: string | null;
  googleMapsUrl: string | null;
  openingHours: string | null;
  image: string | null;
  isActive: boolean;
};

type BranchLandingPageProps = {
  branch: BranchData;
  menus: PublicMenu[];
  contents?: BranchContent[];
};

type CategoryFilter = "Semua" | PublicMenuCategory;

const categories: CategoryFilter[] = ["Semua", "Kopi", "Minuman", "Makanan"];

const branchVisuals: Record<
  string,
  {
    eyebrow: string;
    tagline: string;
    image: string;
    number: string;
    locationLabel: string;
  }
> = {
  "cabang-1": {
    eyebrow: "Modern coffee experience",
    tagline: "Temukan ritme, nikmati setiap tegukan.",
    image: "/gambar/tempat/kopilogi-cikuray.jpg",
    number: "01",
    locationLabel: "GARUT",
  },
  "cabang-2": {
    eyebrow: "Tradition meets coffee",
    tagline: "Cerita lama, rasa yang selalu dirindukan.",
    image: "/gambar/tempat/waroeng-kopilogi.png",
    number: "02",
    locationLabel: "GARUT",
  },
  "cabang-4": {
    eyebrow: "Your cozy coffee escape",
    tagline: "Berhenti sejenak, nikmati suasana.",
    image: "/gambar/tempat/kopilogi-tasik.png",
    number: "04",
    locationLabel: "TASIKMALAYA",
  },
};

const conceptLabels: Record<BranchConcept, string> = {
  "modern-futuristic": "Modern Futuristic",
  "traditional-heritage": "Traditional Heritage",
  "contemporary-cozy": "Industrial Concrete",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

/**
 * Jumlah menu katalog berdasarkan lebar layar.
 *
 * Desktop  : 8 menu = 4 kolom × 2 baris
 * Tablet   : 6 menu = 3 kolom × 2 baris
 * Mobile   : 4 menu = 2 kolom × 2 baris
 */
function getItemsPerPage() {
  if (typeof window === "undefined") {
    return 4;
  }

  if (window.innerWidth >= 1024) {
    return 8;
  }

  if (window.innerWidth >= 640) {
    return 6;
  }

  return 4;
}

/**
 * Jumlah Best Seller yang terlihat sebelum slider diperlukan.
 *
 * Desktop  : 4 card
 * Tablet   : 3 card
 * Mobile   : 2 card
 */
function getBestSellerVisibleCount() {
  if (typeof window === "undefined") {
    return 2;
  }

  if (window.innerWidth >= 1024) {
    return 4;
  }

  if (window.innerWidth >= 640) {
    return 3;
  }

  return 2;
}

function subscribeToViewport(callback: () => void) {
  window.addEventListener("resize", callback);

  return () => {
    window.removeEventListener("resize", callback);
  };
}

function getServerItemsPerPage() {
  return 4;
}

function getServerBestSellerVisibleCount() {
  return 2;
}

export function BranchLandingPage({ branch, menus, contents = [] }: BranchLandingPageProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const bestSellerSliderRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = useSyncExternalStore(
    subscribeToViewport,
    getItemsPerPage,
    getServerItemsPerPage,
  );

  const bestSellerVisibleCount = useSyncExternalStore(
    subscribeToViewport,
    getBestSellerVisibleCount,
    getServerBestSellerVisibleCount,
  );

  useEffect(() => {
    const root = document.documentElement;

    const themeClasses = ["heritage-theme", "cozy-theme", "hallway-theme"];

    root.classList.remove(...themeClasses);

    if (branch.slug === "cabang-2") {
      root.classList.add("heritage-theme");
    } else if (branch.slug === "cabang-4") {
      root.classList.add("cozy-theme");
    }

    return () => {
      root.classList.remove(...themeClasses);
    };
  }, [branch.slug]);

  const visual = branchVisuals[branch.slug];

  if (!visual || !branch.isActive) {
    return null;
  }

  const isCikuray = branch.slug === "cabang-1";
  const isWaroeng = branch.slug === "cabang-2";
  const isTasik = branch.slug === "cabang-4";

  /*
   * BEST SELLER
   *
   * Best Seller hanya ditampilkan pada slider.
   */
  const featuredMenus = menus.filter(
    (menu) => menu.branchSlug === branch.slug && menu.featured && menu.isAvailable,
  );

  /*
   * KATALOG REGULER
   *
   * Best Seller tidak diduplikasi di katalog reguler.
   */
  const branchMenus = menus.filter(
    (menu) => menu.branchSlug === branch.slug && menu.isAvailable && !menu.featured,
  );

  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");

  const filteredMenus = branchMenus.filter((menu) => {
    const matchesCategory = category === "Semua" || menu.category === category;

    const matchesSearch =
      !normalizedSearch ||
      menu.name.toLocaleLowerCase("id-ID").includes(normalizedSearch) ||
      (menu.description ?? "").toLocaleLowerCase("id-ID").includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  /*
   * PAGINATION KATALOG REGULER
   */
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedMenus = filteredMenus.slice(startIndex, startIndex + itemsPerPage);

  const heroImage = branch.image || visual.image;

  const theme = isCikuray
    ? {
        page: "bg-[#1D1F20] text-[#E7E9EA]",
        muted: "text-[#E7E9EA]/65",
        accent: "bg-[#B8C0C4] text-[#1D1F20]",
        card: "border-[#666D71]/50 bg-[#34383B]",
        line: "border-[#666D71]/45",
        input:
          "border-[#666D71]/60 bg-[#34383B] text-[#E7E9EA] placeholder:text-[#E7E9EA]/40 focus:border-[#B8C0C4]",
        activeCategory: "bg-[#B8C0C4] text-[#1D1F20]",
        inactiveCategory: "border-[#666D71]/60 text-[#E7E9EA]/75 hover:bg-[#34383B]",
      }
    : isWaroeng
      ? {
          page: "bg-[#F3EBDD] text-[#292722]",
          muted: "text-[#292722]/70",
          accent: "bg-[#765239] text-[#F3EBDD]",
          card: "border-[#765239]/20 bg-white/40",
          line: "border-[#765239]/25",
          input:
            "border-[#765239]/25 bg-white/50 text-[#292722] placeholder:text-[#292722]/45 focus:border-[#765239]",
          activeCategory: "bg-[#765239] text-[#F3EBDD]",
          inactiveCategory: "border-[#765239]/25 text-[#292722]/75 hover:bg-white/60",
        }
      : {
          page: "bg-[#F4F3EF] text-[#2C302E]",
          muted: "text-[#2C302E]/70",
          accent: "bg-[#E5A93C] text-[#2C302E]",
          card: "border-[#C0C4C6] bg-white/70",
          line: "border-[#C0C4C6]",
          input:
            "border-[#C0C4C6] bg-white/70 text-[#2C302E] placeholder:text-[#2C302E]/45 focus:border-[#E5A93C]",
          activeCategory: "bg-[#E5A93C] text-[#2C302E]",
          inactiveCategory: "border-[#C0C4C6] text-[#2C302E]/75 hover:bg-white",
        };

  const cardRadius = isWaroeng ? "rounded-sm" : isTasik ? "rounded-3xl" : "rounded-2xl";

  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    branch.address,
  )}`;

  /*
   * Slider Best Seller hanya aktif jika jumlah menu
   * melebihi jumlah card yang terlihat pada breakpoint.
   *
   * Desktop > 4
   * Tablet  > 3
   * Mobile  > 2
   */
  const showBestSellerSlider = featuredMenus.length > bestSellerVisibleCount;

  const resetFilters = () => {
    setSearch("");
    setCategory("Semua");
    setCurrentPage(1);
  };

  const scrollBestSeller = (direction: "left" | "right") => {
    const slider = bestSellerSliderRef.current;

    if (!slider) {
      return;
    }

    const firstCard = slider.querySelector<HTMLElement>("[data-best-seller-card]");

    const cardWidth = firstCard?.getBoundingClientRect().width ?? 260;

    const gap = 16;

    slider.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <main className={`${theme.page} branch-theme-${branch.slug}`}>
      {/* =========================================================
          HERO CABANG 1
      ========================================================== */}
      {isCikuray && (
        <section className="relative isolate min-h-[88svh] overflow-hidden bg-[#151713] sm:min-h-[92svh]">
          <Image
            src={heroImage}
            alt={`Suasana ${branch.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#11130F] via-black/35 to-black/20" />

          <div className="relative mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-between px-5 pb-8 pt-24 sm:min-h-[92svh] sm:px-8 sm:pb-12 sm:pt-28 lg:px-12">
            <Link
              href="/#locations"
              aria-label="Kembali ke daftar cabang Kopilogi"
              className="group inline-flex min-h-11 w-fit items-center gap-2.5 rounded-full border border-[#666D71]/80 bg-[#34383B]/95 px-4 py-2.5 text-sm font-medium text-[#E7E9EA] shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#B8C0C4] hover:bg-[#666D71] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8C0C4]"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Kembali ke Beranda</span>
            </Link>

            <div className="max-w-4xl py-12 text-white">
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D8F36A] sm:text-xs">
                <span className="size-2 rounded-full bg-[#D8F36A]" />
                {visual.eyebrow}
              </p>

              <h1 className="text-5xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl md:text-8xl lg:text-[104px]">
                Coffee.
                <br />
                <span className="text-[#D8F36A]">Your rhythm.</span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
                {visual.tagline}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#best-seller"
                  className={`inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:opacity-90 ${theme.accent}`}
                >
                  Explore menu
                  <ArrowRight className="size-4" />
                </a>

                {branch.googleMapsUrl && (
                  <a
                    href={branch.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-sm text-white transition hover:bg-white/10"
                  >
                    <MapPin className="size-4" />
                    Find us
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/25 pt-5 text-[10px] uppercase tracking-[0.2em] text-white/65 sm:text-xs">
              <span>{visual.locationLabel}</span>
              <span>Est. Kopilogi</span>
              <span>{visual.number} / 03</span>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          HERO CABANG 2
      ========================================================== */}
      {isWaroeng && (
        <section className="px-4 pb-12 pt-5 sm:px-8 sm:pb-20 sm:pt-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between gap-4 border-b border-[#765239]/25 pb-5">
              <Link
                href="/#locations"
                className="inline-flex items-center gap-2 text-sm transition hover:opacity-60"
              >
                <ArrowLeft className="size-4" />
                Beranda
              </Link>

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs">
                {visual.locationLabel} · {visual.number}
              </span>
            </div>

            <div className="grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-16">
              <div className="relative z-10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#765239]">
                  {visual.eyebrow}
                </p>

                <h1 className="font-serif text-5xl leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                  Secangkir kopi,
                  <br />
                  <span className="italic text-[#765239]">sejuta cerita.</span>
                </h1>

                <p className="mt-6 max-w-md text-sm leading-7 text-[#292722]/75 sm:text-base">
                  {visual.tagline}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#best-seller"
                    className={`inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:opacity-90 ${theme.accent}`}
                  >
                    Jelajahi menu
                    <ArrowRight className="size-4" />
                  </a>

                  {branch.googleMapsUrl && (
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full border border-[#765239]/25 px-5 text-sm transition hover:bg-[#765239]/5"
                    >
                      Lokasi
                      <MapPin className="size-4" />
                    </a>
                  )}
                </div>

                <div className="mt-10 flex items-center gap-3 border-t border-[#765239]/20 pt-5">
                  <span className="font-serif text-3xl italic text-[#765239]">{visual.number}</span>

                  <span className="max-w-[200px] text-xs leading-5 text-[#292722]/65">
                    {conceptLabels[branch.concept]}
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-2 border border-[#765239]/35 sm:-inset-3" />

                <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                  <Image
                    src={heroImage}
                    alt={`Suasana ${branch.name}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </div>

                <span className="absolute bottom-4 left-4 bg-[#F3EBDD]/95 px-4 py-2 font-serif text-sm italic text-[#292722]">
                  Waktu untuk menikmati.
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          HERO CABANG 4
      ========================================================== */}
      {isTasik && (
        <section className="px-4 pb-14 pt-5 sm:px-8 sm:pb-20 sm:pt-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/#locations"
              className="inline-flex items-center gap-2 text-sm transition hover:opacity-60"
            >
              <ArrowLeft className="size-4" />
              Kembali ke beranda
            </Link>

            <div className="grid items-center gap-8 pt-8 sm:pt-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:pt-14">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4A6B53]/20 bg-white/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-xs">
                  <span className="size-2 rounded-full bg-[#4A6B53]" />
                  {visual.eyebrow}
                </p>

                <h1 className="max-w-xl text-5xl font-medium leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  A little pause,
                  <span className="mt-1 block font-serif italic text-[#4A6B53]">a better day.</span>
                </h1>

                <p className={`mt-5 max-w-md text-sm leading-7 sm:text-base ${theme.muted}`}>
                  {visual.tagline}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="#best-seller"
                    className={`inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:opacity-90 ${theme.accent}`}
                  >
                    Lihat pilihan
                    <ArrowRight className="size-4" />
                  </a>

                  {branch.googleMapsUrl && (
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full border border-[#4A6B53]/25 px-5 text-sm transition hover:bg-white/60"
                    >
                      Kunjungi kami
                      <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </div>

                <div className={`mt-8 flex items-center gap-3 border-t pt-5 ${theme.line}`}>
                  <span className="text-xs font-semibold tracking-[0.15em]">
                    {visual.locationLabel}
                  </span>

                  <span className="size-1 rounded-full bg-[#4A6B53]/50" />

                  <span className={`text-xs ${theme.muted}`}>{conceptLabels[branch.concept]}</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -right-2 -top-2 size-24 rounded-full bg-[#C0C4C6]/60 sm:-right-4 sm:-top-4 sm:size-32" />

                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] sm:aspect-[5/4] sm:rounded-[2.5rem]">
                  <Image
                    src={heroImage}
                    alt={`Suasana ${branch.name}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </div>

                <div className="absolute -bottom-4 left-4 rounded-2xl bg-white px-4 py-3 shadow-lg sm:bottom-5 sm:left-5 sm:px-5">
                  <p className="text-xs font-semibold text-[#2C302E]">{branch.name}</p>

                  <p className="mt-1 text-[10px] text-[#2C302E]/60">Your cozy corner</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          BEST SELLER
      ========================================================== */}
      <section id="best-seller" className={`scroll-mt-20 border-t ${theme.line}`}>
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
            <div>
              <p
                className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs ${theme.muted}`}
              >
                Favorit dari cabang ini
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                Best Seller
                <span className="opacity-50">.</span>
              </h2>

              <p className={`mt-2 max-w-md text-sm leading-6 ${theme.muted}`}>
                Pilihan menu unggulan yang tersedia di {branch.name}.
              </p>
            </div>

            {/* Tombol hanya muncul jika slider memang dibutuhkan */}
            {showBestSellerSlider && (
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => scrollBestSeller("left")}
                  aria-label="Geser Best Seller ke kiri"
                  className={`inline-flex size-9 items-center justify-center rounded-full border transition hover:opacity-70 sm:size-10 ${theme.line} ${theme.inactiveCategory}`}
                >
                  <ArrowLeft className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollBestSeller("right")}
                  aria-label="Geser Best Seller ke kanan"
                  className={`inline-flex size-9 items-center justify-center rounded-full border transition hover:opacity-70 sm:size-10 ${theme.line} ${theme.inactiveCategory}`}
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </div>

          {featuredMenus.length > 0 ? (
            <div
              ref={bestSellerSliderRef}
              className={`flex gap-3 pb-3 sm:gap-4 ${
                showBestSellerSlider
                  ? "snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  : "overflow-hidden"
              }`}
              aria-label="Daftar menu Best Seller"
            >
              {featuredMenus.map((menu, index) => (
                <article
                  key={menu.id}
                  data-best-seller-card
                  className={`group flex-none w-[calc((100%-0.75rem)/2)] snap-start overflow-hidden border transition duration-300 hover:-translate-y-1 sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] ${theme.card} ${cardRadius}`}
                >
                  <Link
                    href={`/${branch.slug}/${menu.slug}`}
                    className="block"
                    aria-label={`Lihat detail ${menu.name}`}
                  >
                    {/* Gambar */}
                    <div className="relative aspect-[5/4] overflow-hidden bg-black/5">
                      {menu.image ? (
                        <Image
                          src={menu.image}
                          alt={menu.name}
                          fill
                          sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 23vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={`flex size-full items-center justify-center text-xs ${theme.muted}`}
                        >
                          Foto belum tersedia
                        </div>
                      )}

                      <span className="absolute left-2 top-2 bg-black/65 px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur sm:left-3 sm:top-3">
                        {menu.category}
                      </span>

                      <span
                        className={`absolute bottom-2 right-2 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider sm:bottom-3 sm:right-3 ${theme.accent}`}
                      >
                        Best Seller
                      </span>

                      {isWaroeng && (
                        <span className="absolute bottom-2 left-2 font-serif text-xs italic text-white drop-shadow sm:bottom-3 sm:left-3">
                          Pilihan {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    {/* Informasi */}
                    <div className="p-3 sm:p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-semibold tracking-tight sm:text-base">
                          {menu.name}
                        </h3>

                        <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 opacity-50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-4" />
                      </div>

                      {menu.description && (
                        <p className={`mt-1.5 line-clamp-2 text-xs leading-5 ${theme.muted}`}>
                          {menu.description}
                        </p>
                      )}

                      <div className={`mt-3 border-t pt-3 ${theme.line}`}>
                        {menu.priceVerified ? (
                          <p className="text-xs font-semibold sm:text-sm">
                            {formatPrice(menu.price)}
                          </p>
                        ) : (
                          <p className={`text-[11px] ${theme.muted}`}>Harga belum terverifikasi</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div
              className={`border border-dashed px-5 py-10 text-center ${theme.line} ${
                isTasik ? "rounded-3xl" : ""
              }`}
            >
              <p className={`text-sm ${theme.muted}`}>
                Belum ada menu Best Seller untuk cabang ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          KATALOG MENU
      ========================================================== */}
      <section id="menu" className={`scroll-mt-20 border-t ${theme.line}`}>
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mb-7 sm:mb-9">
            <p
              className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs ${theme.muted}`}
            >
              Jelajahi pilihan
            </p>

            <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Menu Kopilogi
              <span className="opacity-50">.</span>
            </h2>

            <p className={`mt-2 max-w-md text-sm leading-6 ${theme.muted}`}>
              Temukan kopi, minuman, dan makanan yang tersedia di {branch.name}.
            </p>
          </div>

          {/* =====================================================
              SEARCH + FILTER
          ====================================================== */}
          <div
            className={`mt-6 rounded-2xl border p-3 sm:p-4 ${theme.line} ${
              isCikuray ? "bg-white/[0.025]" : "bg-black/[0.015]"
            }`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div
                className={`flex h-11 w-full items-center gap-3 rounded-xl border px-3.5 lg:max-w-sm ${theme.input}`}
              >
                <Search className="size-4 shrink-0 opacity-60" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari nama atau deskripsi menu..."
                  aria-label="Cari menu"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    aria-label="Hapus pencarian"
                    className="rounded-full p-1 opacity-60 transition hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-2 lg:items-end">
                <span className={`hidden text-[11px] font-medium lg:block ${theme.muted}`}>
                  Filter kategori
                </span>

                <div
                  className="flex max-w-full gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
                  role="group"
                  aria-label="Filter kategori menu"
                >
                  {categories.map((item) => {
                    const isSelected = category === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setCategory(item);
                          setCurrentPage(1);
                        }}
                        aria-pressed={isSelected}
                        className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                          isSelected
                            ? `border-transparent ${theme.activeCategory}`
                            : theme.inactiveCategory
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              className={`mt-3 flex items-center justify-between gap-3 border-t pt-3 ${theme.line}`}
            >
              <p className={`text-xs ${theme.muted}`}>
                {filteredMenus.length === 0
                  ? "Tidak ada menu"
                  : `${startIndex + 1}–${Math.min(
                      startIndex + paginatedMenus.length,
                      filteredMenus.length,
                    )} dari ${filteredMenus.length} menu`}
              </p>

              {(search || category !== "Semua") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold transition hover:opacity-70 ${theme.muted}`}
                >
                  <X className="size-3.5" />
                  Reset filter
                </button>
              )}
            </div>
          </div>

          {/* =====================================================
              KARTU MENU REGULER
              
              Desktop : 4 kolom × 2 baris = 8
              Tablet  : 3 kolom × 2 baris = 6
              Mobile  : 2 kolom × 2 baris = 4
          ====================================================== */}
          {paginatedMenus.length > 0 ? (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {paginatedMenus.map((menu) => (
                  <Link
                    key={menu.id}
                    href={`/${branch.slug}/${menu.slug}`}
                    className={`group flex h-full flex-col overflow-hidden border transition duration-300 hover:-translate-y-1 ${theme.card} ${cardRadius}`}
                  >
                    {/* Gambar menu */}
                    <div className="relative aspect-[5/4] overflow-hidden bg-black/5">
                      {menu.image ? (
                        <Image
                          src={menu.image}
                          alt={menu.name}
                          fill
                          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className={`text-xs ${theme.muted}`}>Gambar belum tersedia</span>
                        </div>
                      )}

                      <span
                        className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-medium ${theme.accent}`}
                      >
                        {menu.category}
                      </span>
                    </div>

                    {/* Informasi menu */}
                    <div className="flex flex-1 flex-col p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-semibold">{menu.name}</h3>

                        <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 opacity-50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>

                      <p className={`mt-1 line-clamp-2 min-h-9 text-xs leading-4 ${theme.muted}`}>
                        {menu.description || "Nikmati pilihan menu Kopilogi."}
                      </p>

                      <div
                        className={`mt-3 flex items-center justify-between gap-2 border-t pt-3 ${theme.line}`}
                      >
                        {menu.priceVerified ? (
                          <span className="text-sm font-semibold">{formatPrice(menu.price)}</span>
                        ) : (
                          <span className={`text-[11px] ${theme.muted}`}>
                            Harga belum terverifikasi
                          </span>
                        )}

                        <span
                          className={`flex size-7 shrink-0 items-center justify-center rounded-full ${theme.accent}`}
                        >
                          <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* =================================================
                  PAGINATION
              ================================================== */}
              {totalPages > 1 && (
                <nav
                  className="mt-8 flex flex-col items-center gap-3 sm:mt-10"
                  aria-label="Navigasi halaman menu"
                >
                  <p className={`text-xs ${theme.muted}`}>
                    Halaman {safeCurrentPage} dari {totalPages}
                  </p>

                  <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={safeCurrentPage === 1}
                      aria-label="Halaman sebelumnya"
                      className={`inline-flex size-9 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35 sm:size-10 ${theme.line} ${theme.inactiveCategory}`}
                    >
                      <ArrowLeft className="size-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Halaman ${page}`}
                        aria-current={safeCurrentPage === page ? "page" : undefined}
                        className={`inline-flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition sm:size-10 ${
                          safeCurrentPage === page
                            ? `border-transparent ${theme.activeCategory}`
                            : theme.inactiveCategory
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={safeCurrentPage === totalPages}
                      aria-label="Halaman berikutnya"
                      className={`inline-flex size-9 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35 sm:size-10 ${theme.line} ${theme.inactiveCategory}`}
                    >
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </nav>
              )}
            </>
          ) : (
            <div
              className={`mt-6 border border-dashed px-5 py-12 text-center ${theme.line} ${
                isTasik ? "rounded-3xl" : ""
              }`}
            >
              <Search className={`mx-auto mb-3 size-5 ${theme.muted}`} />

              <p className="text-sm font-medium">
                {branchMenus.length === 0
                  ? "Menu untuk cabang ini belum tersedia."
                  : "Menu tidak ditemukan."}
              </p>

              <p className={`mt-2 text-sm ${theme.muted}`}>
                {branchMenus.length === 0
                  ? "Silakan kunjungi kembali nanti."
                  : "Coba kata kunci atau kategori yang berbeda."}
              </p>

              {(search || category !== "Semua") && branchMenus.length > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className={`mt-5 rounded-full px-4 py-2 text-xs font-semibold ${theme.accent}`}
                >
                  Reset pencarian
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          KONTEN WEBSITE CABANG
          Seluruh konten CMS ditampilkan setelah katalog menu.
      ========================================================== */}
      {contents.length > 0 && (
        <BranchContentSections
          contents={contents}
          branchName={branch.name}
          branchSlug={branch.slug}
        />
      )}

      {/* =========================================================
          INFORMASI CABANG
      ========================================================== */}
      <section className={`border-t ${theme.line}`}>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2 md:gap-12 lg:px-12 lg:py-20">
          <div>
            <p
              className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs ${theme.muted}`}
            >
              {isCikuray
                ? "Find your next coffee"
                : isWaroeng
                  ? "Sampai jumpa di sini"
                  : "Come by and slow down"}
            </p>

            <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
              {isCikuray
                ? "Temukan tempat untuk ritmemu."
                : isWaroeng
                  ? "Mari bertemu, berbagi cerita."
                  : "Ruang kecil untuk jeda yang berarti."}
            </h2>

            <p className={`mt-4 max-w-sm text-sm leading-6 ${theme.muted}`}>
              {conceptLabels[branch.concept]}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 opacity-65" />

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">Alamat</h3>

                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-1 inline-block text-sm leading-6 underline decoration-current/30 underline-offset-4 transition hover:opacity-70 ${theme.muted}`}
                  aria-label={`Buka rute menuju ${branch.name} di Google Maps`}
                >
                  {branch.address}
                </a>

                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition hover:opacity-80 ${theme.accent}`}
                >
                  <MapPin className="size-3.5" />
                  Petunjuk arah
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>

            {branch.openingHours && (
              <div className="flex gap-4">
                <Clock3 className="mt-1 size-5 shrink-0 opacity-65" />

                <div>
                  <h3 className="text-sm font-semibold">Jam operasional</h3>

                  <p className={`mt-1 text-sm ${theme.muted}`}>{branch.openingHours}</p>
                </div>
              </div>
            )}

            {branch.phone && (
              <div className="flex gap-4">
                <Phone className="mt-1 size-5 shrink-0 opacity-65" />

                <div>
                  <h3 className="text-sm font-semibold">Kontak</h3>

                  <a
                    href={`tel:${branch.phone}`}
                    className={`mt-1 inline-block text-sm transition hover:opacity-100 ${theme.muted}`}
                  >
                    {branch.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className={`border-t px-5 py-6 sm:px-8 ${theme.line}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="font-semibold tracking-[0.15em] transition hover:opacity-60">
            KOPILOGI
          </Link>

          <p className={theme.muted}>
            © {new Date().getFullYear()} {branch.name}
          </p>

          <a href="#menu" className="inline-flex items-center gap-1 transition hover:opacity-60">
            Jelajahi menu
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </footer>
    </main>
  );
}
