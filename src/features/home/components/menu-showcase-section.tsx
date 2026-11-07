"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublicMenu } from "@/features/menu/types";

type Menu = {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  category?: string;
  price?: number;
  featured?: boolean;
  isAvailable?: boolean;
  branchSlug?: string;
};

interface MenuShowcaseSectionProps {
  menus: PublicMenu[];
}

export function MenuShowcaseSection({ menus }: MenuShowcaseSectionProps) {
  const bestSellers = useMemo(
    () => menus.filter((menu) => menu.featured === true && menu.isAvailable === true),
    [menus],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = bestSellers.length > 0 ? activeIndex % bestSellers.length : 0;

  const activeMenu = bestSellers[safeIndex];

  useEffect(() => {
    if (bestSellers.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % bestSellers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bestSellers.length]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + bestSellers.length) % bestSellers.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % bestSellers.length);
  };

  if (!activeMenu) {
    return null;
  }

  const activeMenuKey = activeMenu.id ?? activeMenu.slug ?? activeMenu.name;

  return (
    <section id="best-sellers" className="relative overflow-hidden bg-background py-20 md:py-28">
      <Container>
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <SectionHeading
            eyebrow="Best Sellers"
            title="Favorit yang selalu kembali."
            description="Pilihan menu yang paling banyak dicari di Kopilogi."
          />
        </div>

        <div className="relative">
          <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16 lg:gap-24">
            {/* Visual */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-muted md:aspect-[5/4]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMenuKey}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0"
                >
                  {activeMenu.image ? (
                    <Image
                      src={activeMenu.image}
                      alt={activeMenu.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
                      Foto belum tersedia
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />

                  <div className="absolute bottom-5 left-5">
                    <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-black backdrop-blur-sm">
                      Best Seller
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMenuKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>{String(safeIndex + 1).padStart(2, "0")}</span>
                    <span className="h-px w-8 bg-border" />
                    <span>{activeMenu.category ?? "Menu"}</span>
                  </div>

                  <h3 className="max-w-lg text-4xl font-semibold tracking-[-0.04em] md:text-5xl lg:text-6xl">
                    {activeMenu.name}
                  </h3>

                  {activeMenu.description && (
                    <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground md:text-base">
                      {activeMenu.description}
                    </p>
                  )}

                  {typeof activeMenu.price === "number" && (
                    <p className="mt-6 text-lg font-medium">
                      Rp {activeMenu.price.toLocaleString("id-ID")}
                    </p>
                  )}

                  <Link
                    href={
                      activeMenu.branchSlug && activeMenu.slug
                        ? `/${activeMenu.branchSlug}/${activeMenu.slug}`
                        : "/"
                    }
                    className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform duration-300 hover:scale-[1.03]"
                  >
                    Lihat menu
                    <span className="flex size-7 items-center justify-center rounded-full bg-background/10">
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              {bestSellers.length > 1 && (
                <div className="mt-10 flex items-center justify-between border-t border-border pt-5">
                  <div className="flex items-center gap-2" aria-label="Pilih menu Best Seller">
                    {bestSellers.map((menu, index) => {
                      const menuKey = menu.id ?? menu.slug ?? menu.name;

                      return (
                        <button
                          key={menuKey}
                          type="button"
                          onClick={() => setActiveIndex(index)}
                          aria-label={`Tampilkan ${menu.name}`}
                          aria-current={index === safeIndex ? "true" : undefined}
                          className="group p-1"
                        >
                          <span
                            className={`block h-1 rounded-full transition-all duration-500 ${
                              index === safeIndex
                                ? "w-8 bg-foreground"
                                : "w-3 bg-border group-hover:bg-muted-foreground"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goToPrevious}
                      aria-label="Menu sebelumnya"
                      className="flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                    >
                      <ArrowLeft className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={goToNext}
                      aria-label="Menu berikutnya"
                      className="flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                    >
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
