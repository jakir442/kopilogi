"use client";

import { useEffect, useState } from "react";
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
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = "/";
  const isTransparent = isHome && !isScrolled && !isMenuOpen;

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

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsBranchOpen(false);
  };

  const textColor = isTransparent ? "text-white" : "text-foreground";

  const mutedTextColor = isTransparent
    ? "text-white/70 hover:text-white"
    : "text-muted-foreground hover:text-foreground";

  const borderColor = isTransparent ? "border-white/15" : "border-border/60";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        isTransparent
          ? "border-transparent bg-transparent"
          : "border-border/60 bg-background/85 shadow-sm shadow-black/[0.03] backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[72px] sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenu}
          className={`group flex shrink-0 items-center gap-2.5 ${textColor}`}
          aria-label="Kopilogi — Beranda"
        >
          <div className="relative size-10 overflow-hidden">
            <Image
              src="/logo/kopilogi-no-bg.png"
              alt="Logo Kopilogi"
              fill
              sizes="40px"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>

          <div>
            <p className="text-sm font-bold tracking-[0.18em] sm:text-base">KOPILOGI</p>
            <p
              className={`mt-0.5 text-[9px] uppercase tracking-[0.15em] transition-colors ${
                isTransparent ? "text-white/60" : "text-muted-foreground"
              }`}
            >
              Coffee · Food · Moments
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative py-2 text-sm font-medium transition-colors ${mutedTextColor}`}
            >
              {item.label}
            </Link>
          ))}

          {/* Branch dropdown */}
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
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
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
                      onClick={() => setIsBranchOpen(false)}
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

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors hover:bg-muted/70 ${mutedTextColor}`}
          >
            <LogIn className="size-4" />
            Masuk
          </Link>

          <Link
            href="/menu"
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Jelajahi Menu
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className={`inline-flex size-10 items-center justify-center rounded-full border transition-colors hover:bg-muted/70 lg:hidden ${borderColor} ${textColor}`}
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/60 bg-background text-foreground lg:hidden"
          >
            <nav
              className="mx-auto flex max-h-[calc(100dvh-64px)] max-w-7xl flex-col overflow-y-auto px-5 py-4 sm:px-6"
              aria-label="Navigasi seluler"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-border/60 py-4 text-sm font-medium transition-colors hover:text-muted-foreground"
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile branches */}
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
              </div>

              <Link
                href="/menu"
                onClick={closeMenu}
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Coffee className="size-4" />
                Jelajahi Menu
                <ArrowUpRight className="size-4" />
              </Link>

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
