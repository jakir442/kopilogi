import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Coffee, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/features/users/components/login-form";
import { IceCoffee3D } from "@/features/home/components/models/coffee-3d";
import { ScrollbarTheme } from "@/components/layout/scrollbar-theme";

export const metadata: Metadata = {
  title: "Login Staf | Kopilogi",
  description: "Halaman login internal untuk owner dan karyawan Kopilogi.",
};

const locations = [
  { name: "Garut", detail: "Kopilogi & Waroeng Kopilogi" },
  { name: "Tasikmalaya", detail: "Kopilogi Tasik" },
];

export default function LoginPage() {
  return (
    <>
      <ScrollbarTheme theme="landing-theme" />

      <main className="relative isolate min-h-screen overflow-hidden bg-[#faf8f4] lg:grid lg:grid-cols-2">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="login-ambient-background pointer-events-none absolute -left-32 top-[15%] z-0 hidden size-[28rem] rounded-full blur-[120px] lg:block"
        />

        <div
          aria-hidden="true"
          className="login-ambient-background pointer-events-none absolute -right-32 bottom-[-8rem] z-0 hidden size-[24rem] rounded-full blur-[110px] lg:block"
        />

        {/* Left: Brand panel */}
        <section className="relative isolate hidden min-h-screen overflow-hidden bg-[#211b16] text-[#f8f3eb] lg:block">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_38%,rgba(193,145,91,0.17),transparent_48%)]" />
          <div className="pointer-events-none absolute -left-32 top-1/3 size-80 rounded-full border border-white/[0.045]" />
          <div className="pointer-events-none absolute -left-20 top-[38%] size-56 rounded-full border border-white/[0.04]" />
          <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full border border-amber-100/[0.05]" />

          {/* Blend */}
          <div className="login-blend pointer-events-none absolute inset-y-0 right-0 z-30 w-14 bg-gradient-to-r from-transparent via-[#211b16]/15 to-[#faf8f4]/90 xl:w-20" />
          <div className="login-ambient-glow pointer-events-none absolute -right-24 top-1/2 z-30 h-[64%] w-44 -translate-y-1/2 rounded-full bg-[#d6b58b]/25 blur-[90px] xl:-right-28 xl:h-[70%] xl:w-56 xl:bg-[#d6b58b]/28 xl:blur-[105px]" />
          <div className="login-ambient-orb pointer-events-none absolute -right-16 top-1/2 z-30 size-64 -translate-y-1/2 rounded-full bg-[#c9a77c]/16 blur-[100px] xl:-right-20 xl:size-72 xl:bg-[#c9a77c]/18 xl:blur-[115px]" />
          <div className="login-edge-highlight pointer-events-none absolute right-0 top-1/2 z-30 h-[38%] w-6 -translate-y-1/2 rounded-full bg-[#ead2af]/10 blur-[30px] xl:w-8" />

          {/* Brand content */}
          <div className="relative mx-auto flex min-h-screen w-full max-w-[720px] flex-col px-8 py-7 xl:px-12 xl:py-8">
            <header className="flex items-center justify-between">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b58b]"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                Kembali ke beranda
              </Link>

              <span className="text-[10px] tracking-[0.18em] text-white/40">EST. 2015</span>
            </header>

            <div className="flex flex-1 flex-col justify-center py-5">
              <div className="mx-auto w-full max-w-[490px]">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#d6b58b]">
                  A place for good moments
                </p>

                <h1 className="mt-4 max-w-md font-serif text-4xl font-normal leading-[1.12] tracking-[-0.04em] xl:text-[3.25rem]">
                  Lebih dari sekadar <span className="italic text-[#d6b58b]">secangkir kopi.</span>
                </h1>

                <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
                  Temukan rasa favorit, suasana yang nyaman, dan cerita baru bersama Kopilogi.
                </p>

                {/* 3D product showcase */}
                <div className="relative mx-auto mt-1 w-full max-w-[440px]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-[44%] h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c18e54]/12 blur-[75px] sm:h-48 sm:w-72"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-[44%] size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045] xl:size-64"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-[44%] size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035] xl:size-52"
                  />

                  <div className="relative z-10 h-[270px] w-full -translate-y-40 xl:h-[300px]">
                    <IceCoffee3D />
                  </div>

                  <div className="relative z-20 flex items-center justify-between gap-4 border-y border-white/10 py-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.22em] text-white/40">
                        The Kopilogi experience
                      </p>

                      <p className="mt-1 text-sm font-medium">Your coffee, your story.</p>
                    </div>

                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#d6b58b]/25 text-[#d6b58b]">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </div>

                {/* Locations */}
                <div className="mt-11">
                  <p className="mb-3 text-[9px] uppercase tracking-[0.22em] text-white/40">
                    Find your nearest Kopilogi
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {locations.map((location) => (
                      <div
                        key={location.name}
                        className="flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-3 transition-colors duration-300 hover:border-[#d6b58b]/20 hover:bg-white/[0.06]"
                      >
                        <MapPin className="mt-0.5 size-4 shrink-0 text-[#d6b58b]" />

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white/90">{location.name}</p>

                          <p className="mt-1 text-[10px] leading-4 text-white/45">
                            {location.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-[10px] text-white/35">
              <span>© {new Date().getFullYear()} Kopilogi</span>
              <span>Coffee · Food · Good Moments</span>
            </footer>
          </div>
        </section>

        {/* Right: Internal login */}
        <section className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden bg-[#faf8f4] px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(201,167,124,0.08),transparent_30%),radial-gradient(circle_at_20%_85%,rgba(201,167,124,0.045),transparent_28%)]" />
          <div className="pointer-events-none absolute right-0 top-0 size-64 rounded-full bg-[#c9a77c]/[0.05] blur-[100px]" />
          <div className="login-blend pointer-events-none absolute bottom-0 left-0 top-0 z-20 hidden w-14 bg-gradient-to-l from-transparent via-[#faf8f4]/35 to-[#faf8f4]/95 lg:block xl:w-20" />
          <div className="login-ambient-glow pointer-events-none absolute -left-24 top-1/2 z-20 hidden h-[64%] w-44 -translate-y-1/2 rounded-full bg-[#d6b58b]/18 blur-[95px] lg:block xl:-left-28 xl:h-[70%] xl:w-56 xl:bg-[#d6b58b]/20 xl:blur-[110px]" />
          <div className="login-ambient-orb pointer-events-none absolute -left-16 top-1/2 z-20 hidden size-64 -translate-y-1/2 rounded-full bg-[#c9a77c]/10 blur-[105px] lg:block xl:-left-20 xl:size-72 xl:bg-[#c9a77c]/12 xl:blur-[120px]" />
          <div className="login-edge-highlight pointer-events-none absolute left-0 top-1/2 z-20 hidden h-[38%] w-6 -translate-y-1/2 rounded-full bg-[#e3c59b]/[0.08] blur-[30px] lg:block xl:w-8" />
          <div className="relative z-30 w-full max-w-[780px]">
            {/* Mobile brand */}
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#96704b]"
                aria-label="Kembali ke beranda Kopilogi"
              >
                <span className="relative flex size-10 items-center justify-center rounded-xl bg-[#cc8850] text-[#d6b38b]">
                  <Image
                    src="/logo/kopilogi-no-bg.png"
                    alt="Logo Kopilogi"
                    fill
                    sizes="40px"
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </span>

                <span className="text-base font-semibold tracking-[0.18em] text-[#211b16]">
                  KOPILOGI
                </span>
              </Link>

              <Link
                href="/"
                className="flex size-10 items-center justify-center rounded-full border border-[#211b16]/10 text-[#51463a] transition-colors hover:bg-[#211b16]/5"
                aria-label="Kembali ke beranda"
              >
                <ArrowLeft className="size-4" />
              </Link>
            </div>

            {/* Login card */}
            <div className="login-form-card mx-auto w-full max-w-[440px] rounded-[1.75rem] border border-[#e9e1d7]/80 bg-white/75 p-5 shadow-[0_24px_80px_-48px_rgba(74,48,25,0.25)] backdrop-blur-xl sm:p-7">
              <div className="mb-7">
                <div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-[#e9e1d7] bg-[#faf8f4] text-[#8b6845] shadow-sm">
                  <ShieldCheck className="size-5" />
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#96704b]">
                  Akses internal
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#211b16] sm:text-[1.8rem]">
                  Login owner & karyawan.
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#776d62]">
                  Halaman ini khusus untuk owner dan karyawan Kopilogi yang memiliki akun akses
                  internal.
                </p>
              </div>
              <div className="mb-6 h-px bg-gradient-to-r from-[#c9a77c]/35 via-[#e9e1d7] to-transparent" />

              <LoginForm />
            </div>

            <p className="mt-5 text-center text-[11px] leading-5 text-[#8c8175]">
              Akses sistem hanya diberikan kepada personel yang berwenang.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
