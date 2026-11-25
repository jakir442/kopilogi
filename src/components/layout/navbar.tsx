"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Coffee, LogIn, MapPin, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const branches = [
  {
    number: "01",
    name: "Kopilogi Cikuray",
    city: "Garut",
    href: "/cabang-1",
  },
  {
    number: "02",
    name: "Waroeng Kopilogi",
    city: "Garut",
    href: "/cabang-2",
  },
  {
    number: "04",
    name: "Kopilogi Tasik",
    city: "Tasikmalaya",
    href: "/cabang-4",
  },
];

const navigation = [
  { label: "Beranda", href: "/#home" },
  { label: "Best Sellers", href: "/#best-sellers" },
  { label: "FAQ", href: "/faq" },
];


export function Navbar() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled && !isMenuOpen;

  /*
   * HEADER SCROLL STATE
   */
  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 24);
    };

    updateScrollState();

    window.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  /*
   * KUNCI SCROLL BODY SAAT MENU MOBILE TERBUKA
   */
  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsBranchOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  /*
   * TUTUP MENU
   */
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsBranchOpen(false);
  };

  /*
   * NAVIGASI ANCHOR DAN SMOOTH SCROLL
   *
   * Jika berada di halaman utama:
   * 1. Cegah navigasi anchor bawaan.
   * 2. Tutup menu.
   * 3. Tunggu hingga menu selesai ditutup.
   * 4. Gulir ke target.
   *
   * Jika berasal dari halaman lain, biarkan Link
   * melakukan navigasi ke halaman utama.
   */
  const handleHashNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const url = new URL(href, window.location.origin);
    const targetId = url.hash.slice(1);

    if (!targetId) {
      closeMenu();
      return;
    }

    if (pathname !== "/") {
      closeMenu();
      return;
    }

    const target = document.getElementById(targetId);

    if (!target) {
      closeMenu();
      return;
    }

    event.preventDefault();

    const shouldWaitForMenu = isMenuOpen;

    closeMenu();

    const scrollToTarget = () => {
      const currentTarget = document.getElementById(targetId);

      if (!currentTarget) return;

      const nextUrl = `${window.location.pathname}` + `${window.location.search}#${targetId}`;

      if (window.location.hash !== `#${targetId}`) {
        window.history.pushState(null, "", nextUrl);
      }

      currentTarget.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    if (shouldWaitForMenu) {
      // Beri waktu untuk animasi penutupan menu mobile.
      window.setTimeout(scrollToTarget, 300);
    } else {
      // Navigasi desktop atau menu yang sudah tertutup.
      window.requestAnimationFrame(scrollToTarget);
    }
  };

  const textColor = isTransparent ? "text-white" : "text-foreground";

  const mutedTextColor = isTransparent
    ? "text-white/70 hover:text-white"
    : "text-muted-foreground hover:text-foreground";

  const borderColor = isTransparent ? "border-white/15" : "border-border/60";

  const headerBackground = isTransparent
    ? "border-transparent bg-transparent"
    : "border-border/60 bg-background/90 shadow-sm shadow-black/[0.03] backdrop-blur-xl";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${headerBackground}`}
    >
      {/* HEADER UTAMA */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[72px] sm:px-6 lg:px-8">
        {/* BRAND */}
        <Link
          href="/"
          onClick={closeMenu}
          className={`group flex min-w-0 shrink-0 items-center gap-2.5 ${textColor}`}
          aria-label="Kopilogi Kita — Beranda"
        >
          <div className="relative size-10 shrink-0 overflow-hidden">
            <Image
              src="/logo/kopilogi-no-bg.png"
              alt="Logo Kopilogi"
              fill
              sizes="40px"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold tracking-[0.18em] sm:text-base">KOPILOGI</p>

            <p
              className={`mt-0.5 whitespace-nowrap text-[9px] uppercase tracking-[0.12em] transition-colors sm:tracking-[0.15em] ${
                isTransparent ? "text-white/60" : "text-muted-foreground"
              }`}
            >
              Coffee · Food · Moments
            </p>
          </div>
        </Link>

        {/* NAVIGASI DESKTOP */}
        <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => handleHashNavigation(event, item.href)}
              className={`relative py-2 text-sm font-medium transition-colors ${mutedTextColor}`}
            >
              {item.label}
            </Link>
          ))}

          {/* DROPDOWN CABANG */}
          <div
            className="relative"
            onMouseEnter={() => setIsBranchOpen(true)}
            onMouseLeave={() => setIsBranchOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsBranchOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsBranchOpen(false);
                }
              }}
              aria-expanded={isBranchOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1.5 py-2 text-sm font-medium transition-colors ${mutedTextColor}`}
            >
              Cabang
              <ArrowDown
                className={`size-3.5 transition-transform duration-200 ${
                  isBranchOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isBranchOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 5,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.18,
                    ease: "easeOut",
                  }}
                  className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-4"
                >
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-background p-2 text-foreground shadow-xl shadow-black/10">
                    <div className="px-3 pb-2 pt-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Find your Kopilogi
                      </p>

                      <p className="mt-1 text-sm font-semibold">Pilih suasanamu</p>
                    </div>

                    {branches.map((branch) => (
                      <Link
                        key={branch.number}
                        href={branch.href}
                        onClick={() => setIsBranchOpen(false)}
                        className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border text-xs font-semibold">
                          {branch.number}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{branch.name}</span>

                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {branch.city}
                          </span>
                        </span>

                        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    ))}

                    <div className="mx-2 my-2 border-t border-border/70" />

                    <Link
                      href="/#locations"
                      onClick={(event) => handleHashNavigation(event, "/#locations")}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      Lihat semua cabang
                      <MapPin className="size-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* AKSI DESKTOP */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/login"
            className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors hover:bg-muted/70 ${mutedTextColor}`}
          >
            <LogIn className="size-4" />
            Masuk
          </Link>

          <Link
            href="/#locations"
            onClick={(event) => handleHashNavigation(event, "/#locations")}
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Jelajahi Cabang
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* TOMBOL HAMBURGER MOBILE */}
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen((open) => !open);
            setIsBranchOpen(false);
          }}
          className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden ${borderColor} ${textColor}`}
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* NAVIGASI MOBILE */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="overflow-hidden border-t border-border/60 bg-background text-foreground lg:hidden"
          >
            <nav
              className="mx-auto flex max-h-[calc(100dvh-64px)] max-w-7xl flex-col overflow-y-auto px-5 py-4 sm:px-6"
              aria-label="Navigasi seluler"
            >
              {/* NAVIGASI UTAMA */}
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(event) => handleHashNavigation(event, item.href)}
                  className="border-b border-border/60 py-4 text-sm font-medium transition-colors hover:text-muted-foreground"
                >
                  {item.label}
                </Link>
              ))}

              {/* DAFTAR CABANG MOBILE */}
              <div className="border-b border-border/60 py-4">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Pilih Cabang
                </p>

                <div className="grid gap-2">
                  {branches.map((branch) => (
                    <Link
                      key={branch.number}
                      href={branch.href}
                      onClick={closeMenu}
                      className="group flex items-center gap-3 rounded-xl border border-border/70 p-3 transition-colors hover:bg-muted"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
                        {branch.number}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{branch.name}</span>

                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {branch.city}
                        </span>
                      </span>

                      <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>

                {/* LIHAT SEMUA CABANG */}
                <Link
                  href="/#locations"
                  onClick={(event) => handleHashNavigation(event, "/#locations")}
                  className="mt-3 flex min-h-10 items-center justify-between rounded-xl px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Lihat semua cabang
                  <MapPin className="size-3.5" />
                </Link>
              </div>

              {/* JELAJAHI CABANG MOBILE */}
              <Link
                href="/#locations"
                onClick={(event) => handleHashNavigation(event, "/#locations")}
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Coffee className="size-4" />
                Jelajahi Cabang
                <ArrowUpRight className="size-4" />
              </Link>

              {/* LOGIN MOBILE */}
              <Link
                href="/login"
                onClick={closeMenu}
                className="mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border text-sm font-medium transition-colors hover:bg-muted"
              >
                <LogIn className="size-4" />
                Masuk
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
