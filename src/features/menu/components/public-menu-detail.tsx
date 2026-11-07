"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, ShieldCheck, Clock3, Coffee } from "lucide-react";
import { useEffect } from "react";

type PublicMenuDetailProps = {
  data: {
    branch: {
      name: string;
      slug: string;
      concept: string;
      address: string;
      googleMapsUrl: string | null;
      openingHours: string | null;
    };
    menu: {
      name: string;
      slug: string;
      description: string;
      category: string;
      price: number;
      image: string | null;
      featured: boolean;
      priceVerified: boolean;
    };
  };
};

const branchThemes: Record<
  string,
  {
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    border: string;
    label: string;
  }
> = {
  "modern-futuristic": {
    background: "#101211",
    foreground: "#F5F5F0",
    muted: "#A4AAA3",
    accent: "#C5F467",
    border: "#30362E",
    label: "MODERN FUTURISTIC",
  },
  "traditional-heritage": {
    background: "#F4E9D5",
    foreground: "#492D20",
    muted: "#856B55",
    accent: "#9D482C",
    border: "#D9C6A8",
    label: "TRADITIONAL HERITAGE",
  },
  "contemporary-cozy": {
    background: "#F5F0E8",
    foreground: "#35483B",
    muted: "#7C8175",
    accent: "#C17B52",
    border: "#DED6C9",
    label: "CONTEMPORARY COZY",
  },
};

const branchThemeClasses = ["modern-theme", "heritage-theme", "cozy-theme"];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function PublicMenuDetail({ data }: PublicMenuDetailProps) {
  const { branch, menu } = data;

  const theme = branchThemes[branch.concept] ?? branchThemes["contemporary-cozy"];

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove(...branchThemeClasses);

    if (branch.slug === "cabang-1") {
      root.classList.add("modern-theme");
    } else if (branch.slug === "cabang-2") {
      root.classList.add("heritage-theme");
    } else if (branch.slug === "cabang-4") {
      root.classList.add("cozy-theme");
    }

    return () => {
      root.classList.remove(...branchThemeClasses);
    };
  }, [branch.slug]);

  return (
    <main
      style={
        {
          "--detail-bg": theme.background,
          "--detail-fg": theme.foreground,
          "--detail-muted": theme.muted,
          "--detail-accent": theme.accent,
          "--detail-border": theme.border,
        } as React.CSSProperties
      }
      className="min-h-screen bg-[var(--detail-bg)] text-[var(--detail-fg)] transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <Link
            href={`/${branch.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--detail-border)] px-4 py-2.5 text-sm transition-opacity hover:opacity-70"
          >
            <ArrowLeft size={16} />
            Kembali ke cabang
          </Link>

          <span className="text-xs font-semibold tracking-[0.2em]">KOPILOGI</span>
        </header>

        <div className="grid gap-10 py-12 md:grid-cols-2 md:items-center md:gap-16 md:py-20">
          <div className="relative">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[var(--detail-accent)]">
              <Coffee size={15} />
              {theme.label}
            </div>

            <div className="relative aspect-[4/4.5] overflow-hidden rounded-3xl border border-[var(--detail-border)]">
              {menu.image ? (
                <Image
                  src={menu.image}
                  alt={menu.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[var(--detail-border)]">
                  <Coffee size={64} strokeWidth={1} className="opacity-40" />
                </div>
              )}

              {menu.featured && (
                <span className="absolute left-4 top-4 rounded-full bg-[var(--detail-accent)] px-4 py-2 text-xs font-bold text-[var(--detail-bg)]">
                  BEST SELLER
                </span>
              )}
            </div>
          </div>

          <section>
            <p className="text-sm text-[var(--detail-muted)]">{branch.name}</p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--detail-accent)]">
              {menu.category}
            </p>

            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {menu.name}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--detail-muted)]">
              {menu.description}
            </p>

            <div className="mt-8 border-y border-[var(--detail-border)] py-6">
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--detail-muted)]">
                Harga menu
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-semibold">{formatPrice(menu.price)}</span>

                {menu.priceVerified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--detail-border)] px-3 py-1.5 text-xs">
                    <ShieldCheck size={14} />
                    Harga terverifikasi
                  </span>
                ) : (
                  <span className="text-xs text-[var(--detail-muted)]">
                    Harga belum terverifikasi
                  </span>
                )}
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-[var(--detail-accent)]" />

                <div>
                  <p className="text-sm font-medium">Lokasi cabang</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--detail-muted)]">
                    {branch.address}
                  </p>
                </div>
              </div>

              {branch.openingHours && (
                <div className="flex items-start gap-3">
                  <Clock3 size={18} className="mt-1 shrink-0 text-[var(--detail-accent)]" />

                  <div>
                    <p className="text-sm font-medium">Jam operasional</p>
                    <p className="mt-1 text-sm text-[var(--detail-muted)]">{branch.openingHours}</p>
                  </div>
                </div>
              )}
            </div>

            {branch.googleMapsUrl && (
              <a
                href={branch.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--detail-accent)] px-6 py-3.5 text-sm font-semibold text-[var(--detail-bg)] transition-opacity hover:opacity-80"
              >
                Lihat lokasi cabang
                <ArrowUpRight size={16} />
              </a>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
