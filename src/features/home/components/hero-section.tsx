"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";

const slides = [
  {
    id: "cabang-1",
    branch: "01",
    name: "Kopilogi Cikuray",
    city: "Garut",
    image: "/gambar/tempat/kopilogi-cikuray.jpg",
  },
  {
    id: "cabang-2",
    branch: "02",
    name: "Waroeng Kopilogi",
    city: "Garut",
    image: "/gambar/tempat/waroeng-kopilogi.png",
  },
  {
    id: "cabang-4",
    branch: "04",
    name: "Kopilogi Tasik",
    city: "Tasikmalaya",
    image: "/gambar/tempat/kopilogi-tasik.png",
  },
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      {/* Background images */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.name}
              fill
              priority={activeIndex === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/25" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
      </div>

      <Container className="relative z-10 flex min-h-[100svh] flex-col justify-between py-28 md:py-32">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-8 bg-white/70" />

          <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/80">
            Coffee, food & good moments
          </span>
        </motion.div>

        {/* Main content */}
        <div className="max-w-3xl pb-8 md:pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-white/65">
                {activeSlide.branch} · {activeSlide.city}
              </p>

              <h1 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[88px]">
                Tempat untuk
                <br />
                menikmati cerita.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-white/75 md:text-base">
                Temukan cabang, suasana, dan favoritmu di Kopilogi.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${activeSlide.id}`}
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.03]"
                >
                  Temukan Cabang

                  <span className="flex size-7 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>

                <Link
                  href="#locations"
                  className="hidden rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10 sm:inline-flex"
                >
                  Lihat semua cabang
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="flex items-end justify-between gap-6">
          {/* Slide indicators */}
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Pilih ${slide.name}`}
                className="group flex items-center gap-2"
              >
                <span
                  className={`h-0.5 transition-all duration-500 ${
                    index === activeIndex
                      ? "w-10 bg-white"
                      : "w-5 bg-white/35 group-hover:bg-white/60"
                  }`}
                />

                <span
                  className={`hidden text-[10px] uppercase tracking-[0.2em] transition-colors md:block ${
                    index === activeIndex
                      ? "text-white"
                      : "text-white/40"
                  }`}
                >
                  {slide.branch}
                </span>
              </button>
            ))}
          </div>

          {/* Scroll indicator */}
          <motion.a
            href="#best-sellers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/60"
          >
            <span className="hidden sm:block">Scroll to explore</span>

            <span className="flex size-10 items-center justify-center rounded-full border border-white/20 backdrop-blur-sm transition-colors group-hover:bg-white/10">
              <ArrowDown className="size-4 animate-bounce" />
            </span>
          </motion.a>
        </div>
      </Container>
    </section>
  );
}