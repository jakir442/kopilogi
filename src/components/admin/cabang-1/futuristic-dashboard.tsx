"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  CircleUserRound,
  Coffee,
  Command,
  Cpu,
  ExternalLink,
  Gauge,
  Layers3,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu as MenuIcon,
  MonitorCog,
  Radio,
  ScanLine,
  Settings2,
  ShieldCheck,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

import { MenuManagement, type MenuData } from "@/features/menu/components/admin/menu-management";
import type { BranchDocument } from "@/features/branches/types";
import Image from "next/image";
import { CustomerManagement } from "@/features/customers/components/admin/customer-management";

type FuturisticDashboardProps = {
  name: string;
  email: string;
  branch: BranchDocument | null;
  menus: MenuData[];
  onSignOut: () => Promise<void>;
  isSuperAdmin?: boolean;
  activeTab: "dashboard" | "menu" | "customers";
};

const ease = [0.22, 1, 0.36, 1] as const;

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

const sideVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease },
  },
};

const navItems = [
  {
    label: "Dasbor",
    icon: LayoutDashboard,
    href: "/admin/cabang-1",
    tab: "dashboard" as const,
  },
  {
    label: "Kelola Menu",
    icon: Coffee,
    href: "/admin/cabang-1?tab=menu",
    tab: "menu" as const,
  },
  {
    label: "Pelanggan",
    icon: Users,
    href: "/admin/cabang-1?tab=customers",
    tab: "customers" as const,
  },
  {
    label: "Konten Website",
    icon: MonitorCog,
    disabled: true,
  },
];

export function FuturisticDashboard({
  name,
  email,
  branch,
  menus,
  onSignOut,
  isSuperAdmin = false,
  activeTab = "dashboard",
}: FuturisticDashboardProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const firstName = name.trim().split(/\s+/)[0] || "Admin";
  const branchName = branch?.name ?? "Kopilogi Cabang 1";

  const activePageLabel =
    activeTab === "menu" ? "Kelola Menu" : activeTab === "customers" ? "Pelanggan" : "Dasbor";

  // Kunci scroll halaman ketika navigasi mobile terbuka.
  // Panel navigasi memiliki scroll internal sendiri.
  useEffect(() => {
    if (!mobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileNavOpen]);

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen overflow-x-clip bg-[#101112] text-[#E7E9EA] selection:bg-white/15 selection:text-white"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(210,216,220,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(210,216,220,0.045) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.5) 55%, transparent 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-48 -top-40 h-[30rem] w-[30rem] rounded-full bg-white/[0.04] blur-[130px]"
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed -right-40 top-[20%] h-[28rem] w-[28rem] rounded-full bg-slate-300/[0.03] blur-[140px]"
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative min-h-screen">
        {/* Desktop sidebar: fixed, scrollable internally */}
        <motion.aside
          variants={sideVariants}
          className="kopilogi-sidebar fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col overflow-y-auto overscroll-contain border-r border-white/[0.085] bg-[#151617]/95 backdrop-blur-2xl lg:flex xl:w-[278px]"
        >
          <Brand />

          <div className="px-4 pt-7">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C9195]">
              Ruang Kerja
            </p>

            <nav aria-label="Navigasi utama" className="mt-3 space-y-1.5">
              {navItems.map((item, index) => (
                <SidebarLink
                  key={item.label}
                  {...item}
                  active={"tab" in item ? item.tab === activeTab : false}
                  index={String(index + 1).padStart(2, "0")}
                />
              ))}
            </nav>
          </div>

          <div className="mt-8 px-4">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8C9195]">
              Sistem
            </p>

            <div className="mt-3">
              <SidebarLink label="Pengaturan" icon={Settings2} disabled index="05" />
            </div>
          </div>

          <div className="mt-auto p-4">
            <div className="relative overflow-hidden rounded-xl border border-[#AEB5B9]/15 bg-gradient-to-br from-[#303335]/80 to-[#191A1B]/80 p-4">
              <div className="absolute -right-5 -top-7 h-24 w-24 rounded-full border border-white/[0.07]" />
              <div className="absolute -right-1 -top-3 h-16 w-16 rounded-full border border-white/[0.07]" />

              <div className="relative flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
                  <ShieldCheck className="h-4 w-4 text-[#D7DCDF]" />
                </span>
                <span className="text-sm font-medium text-[#D4D9DC]">Akses Cabang</span>
              </div>

              <p className="relative mt-3 text-sm leading-6 text-[#9EA5A9]">
                Akses sistem dibatasi sesuai dengan hak akses cabang yang diberikan.
              </p>

              <div className="relative mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#D0D5D8]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#D5D9DC]" />
                Sesi terlindungi
              </div>
            </div>
          </div>

          {/* Logout desktop hanya berada di sidebar */}
          <ProfileFooter
            name={name}
            email={email}
            onSignOut={onSignOut}
            isSuperAdmin={isSuperAdmin}
          />
        </motion.aside>

        {/* Main content */}
        <section className="min-w-0 lg:pl-[264px] xl:pl-[278px]">
          {/* SHARED HEADER: selalu tampil di semua tab */}
          <header className="sticky top-0 z-[60] flex min-h-[72px] items-center justify-between gap-3 border-b border-white/[0.08] bg-[#101112]/95 px-3 py-3 backdrop-blur-2xl sm:px-5 lg:px-7 xl:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen((open) => !open)}
                aria-label={mobileNavOpen ? "Tutup navigasi" : "Buka navigasi"}
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-navigation"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#B8BEC2] transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:hidden"
              >
                {mobileNavOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.1em] text-[#8D9397] sm:text-xs sm:tracking-[0.12em]">
                  <Command className="h-4 w-4 shrink-0 text-[#B5BBBE]" />
                  <span className="truncate">Kopilogi / Sistem Manajemen</span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs text-[#C8CDCF] sm:text-sm">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D5DADC] opacity-30" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D5DADC]" />
                  </span>

                  <span className="truncate">{activePageLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 py-2.5 text-xs text-[#A7ADB1] xl:flex">
                <Wifi className="h-4 w-4 text-[#D0D5D8]" />
                Koneksi aman
              </div>

              <div className="hidden h-8 w-px bg-white/10 sm:block" />

              <div className="hidden max-w-40 text-right sm:block">
                <p className="truncate text-sm font-medium text-[#E1E4E6]">{name}</p>
                <p className="mt-0.5 text-xs text-[#8D9397]">Admin Cabang</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#A8B0B4]/20 bg-gradient-to-br from-[#5A6064]/50 to-[#252728] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <CircleUserRound className="h-5 w-5 text-[#D2D7D9]" />
              </div>
            </div>
          </header>

          {/* MOBILE NAVIGATION: tidak bergantung pada activeTab */}
          {mobileNavOpen && (
            <>
              <button
                type="button"
                aria-label="Tutup navigasi"
                onClick={closeMobileNav}
                className="fixed inset-x-0 bottom-0 top-[72px] z-40 cursor-default bg-black/65 backdrop-blur-[2px] lg:hidden"
              />

              <motion.div
                id="mobile-navigation"
                role="dialog"
                aria-modal="true"
                aria-label="Navigasi admin cabang"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="kopilogi-mobile-nav fixed inset-x-0 bottom-0 top-[72px] z-50 overflow-y-auto overscroll-contain border-t border-white/10 bg-[#151617] shadow-2xl lg:hidden"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="mx-auto w-full max-w-xl p-4 sm:p-5">
                  <div className="mb-5">
                    <Brand compact />
                  </div>

                  <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#858D92]">
                    Navigasi
                  </p>

                  <nav aria-label="Navigasi mobile" className="space-y-1.5">
                    {navItems.map((item, index) => (
                      <SidebarLink
                        key={item.label}
                        {...item}
                        active={"tab" in item ? item.tab === activeTab : false}
                        index={String(index + 1).padStart(2, "0")}
                        onNavigate={closeMobileNav}
                      />
                    ))}

                    <SidebarLink label="Pengaturan" icon={Settings2} disabled index="05" />
                  </nav>

                  <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#AAB2B6]/15 bg-gradient-to-br from-[#4B5256] to-[#252829]">
                        <CircleUserRound className="h-5 w-5 text-[#D5DADD]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#E1E4E6]">{name}</p>
                        <p className="mt-1 truncate text-xs text-[#A0A6AA]">{email}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      {isSuperAdmin ? (
                        <Link
                          href="/admin/super-admin"
                          onClick={closeMobileNav}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#C8D0D4]/15 bg-white/[0.035] px-3 py-3 text-sm font-medium text-[#D0D5D8] transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Kembali ke Super Admin
                        </Link>
                      ) : (
                        <form action={onSignOut}>
                          <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-3 text-sm font-medium text-[#D0D5D8] transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                          >
                            <LogOut className="h-4 w-4" />
                            Keluar dari akun
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  <p className="pb-4 pt-5 text-center text-[10px] uppercase tracking-[0.12em] text-[#70787D]">
                    Kopilogi · Cabang 01
                  </p>
                </div>
              </motion.div>
            </>
          )}

          {/* KONTEN HALAMAN: hanya bagian ini yang berubah sesuai tab */}
          {activeTab === "menu" ? (
            <MenuManagement
              initialMenus={menus}
              branchId={branch?._id ? String(branch._id) : undefined}
              theme="modern-futuristic"
            />
          ) : activeTab === "customers" ? (
            <CustomerManagement
              branchId={branch?._id ? String(branch._id) : undefined}
              branchSlug="cabang-1"
              branchName={branchName}
            />
          ) : (
            <>
              {/* Tempatkan seluruh Dashboard body yang lama di sini. */}
              {/* Mulai dari <motion.div variants={containerVariants} ...> */}
              {/* sampai penutup </motion.div> untuk Dashboard body. */}
            </>
          )}
        </section>
      </div>
    </motion.main>
  );
}

/* ===============================================================
   SIDEBAR LINK
=============================================================== */

type IconType = typeof LayoutDashboard;

type SidebarLinkProps = {
  icon: IconType;
  label: string;
  index: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  onNavigate?: () => void;
};

function SidebarLink({
  icon: Icon,
  label,
  index,
  href,
  active = false,
  disabled = false,
  onNavigate,
}: SidebarLinkProps) {
  const className = [
    "group flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 transition-all duration-200",
    active
      ? "border-white/15 bg-gradient-to-r from-white/[0.09] to-transparent text-[#E6E8E9] shadow-[inset_2px_0_0_rgba(220,225,228,0.8)]"
      : disabled
        ? "cursor-not-allowed border-transparent text-[#687075]"
        : "border-transparent text-[#A0A6AA] hover:border-white/[0.07] hover:bg-white/[0.035] hover:text-[#DCE0E2]",
  ].join(" ");

  const contents = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
            active
              ? "bg-white/[0.08] text-[#E7EAEC]"
              : "bg-white/[0.025] text-[#A0A6AA] group-hover:text-[#D6DBDE]",
          ].join(" ")}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </span>

        <span className="truncate text-sm font-medium">{label}</span>
      </span>

      {disabled ? (
        <span className="shrink-0 rounded-md border border-white/[0.06] px-2 py-1 text-[9px] uppercase tracking-[0.08em] text-[#7F878C]">
          Segera
        </span>
      ) : active ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E1E5E7] shadow-[0_0_9px_rgba(225,230,233,0.45)]" />
      ) : (
        <span className="font-mono text-[10px] text-[#748087] transition-colors group-hover:text-[#AAB1B5]">
          {index}
        </span>
      )}
    </>
  );

  if (disabled) {
    return (
      <div aria-disabled="true" className={className}>
        {contents}
      </div>
    );
  }

  return (
    <Link
      href={href ?? "/admin"}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {contents}
    </Link>
  );
}

/* ===============================================================
   BRAND
=============================================================== */

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        "flex items-center gap-3",
        compact
          ? "border-b border-white/[0.08] pb-4"
          : "h-[72px] shrink-0 border-b border-white/[0.08] px-6",
      ].join(" ")}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#B8C0C4]/20 bg-gradient-to-br from-[#666D71] via-[#34383B] to-[#1D1F20] shadow-[inset_0_1px_0_rgba(255,255,255,0.17)]">
        <div className="pointer-events-none absolute inset-1 rounded-lg border border-white/[0.08]" />

        <Image
          src="/logo/kopilogi-no-bg.png"
          alt="Logo Kopilogi"
          fill
          sizes="40px"
          className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
          priority
        />

        <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-[#E4E7E9] shadow-[0_0_6px_rgba(225,230,233,0.6)]" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#E3E7E9]">KOPILOGI</p>
        <p className="mt-0.5 text-[9px] uppercase tracking-[0.15em] text-[#92999D]">
          Operasional Digital
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   PROFILE FOOTER — DESKTOP LOGOUT
=============================================================== */

function ProfileFooter({
  name,
  email,
  onSignOut,
  isSuperAdmin = false,
}: {
  name: string;
  email: string;
  onSignOut: () => Promise<void>;
  isSuperAdmin?: boolean;
}) {
  return (
    <div className="shrink-0 border-t border-white/[0.08] p-4">
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#AAB2B6]/15 bg-gradient-to-br from-[#4B5256] to-[#252829]">
            <CircleUserRound className="h-5 w-5 text-[#D5DADD]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#E0E4E6]">{name}</p>
            <p className="mt-1 truncate text-xs text-[#9AA1A5]">{email}</p>
          </div>
        </div>

        <div className="mt-3">
          {isSuperAdmin ? (
            <Link
              href="/admin/super-admin"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#C8D0D4]/15 bg-white/[0.035] px-3 py-2.5 text-xs font-medium text-[#D5DADD] transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Super Admin
            </Link>
          ) : (
            <form action={onSignOut}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2.5 text-xs font-medium text-[#AEB5B9] transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <LogOut className="h-4 w-4" />
                Keluar dari akun
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   MODULE CARD
=============================================================== */

type ModuleCardProps = {
  index: string;
  icon: IconType;
  title: string;
  description: string;
  href?: string;
  status: string;
  active?: boolean;
};

function ModuleCard({
  index,
  icon: Icon,
  title,
  description,
  href,
  status,
  active = false,
}: ModuleCardProps) {
  const card = (
    <div
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 sm:p-6",
        active
          ? "border-[#9EADB7]/20 bg-gradient-to-br from-[#2B2F32]/95 to-[#191B1C] hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
          : "border-white/[0.075] bg-[#17191A]/70 hover:border-white/[0.13] hover:bg-[#1B1D1E]",
      ].join(" ")}
    >
      {active && (
        <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full border border-white/[0.07] transition-transform duration-500 group-hover:translate-x-7 group-hover:-translate-y-7" />
      )}

      <div className="relative flex items-start justify-between">
        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-xl border sm:h-12 sm:w-12",
            active
              ? "border-[#AEB7BC]/20 bg-gradient-to-br from-[#596166]/60 to-[#2B3033] text-[#E0E5E8]"
              : "border-white/[0.07] bg-white/[0.025] text-[#9AA1A5]",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </div>

        <span className="font-mono text-[10px] text-[#849095] sm:text-xs">{index}</span>
      </div>

      <div className="relative mt-5 flex-1">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#E2E6E8] sm:text-xl">
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-6 text-[#A0A6AA] sm:text-base sm:leading-7">
          {description}
        </p>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
        <span
          className={[
            "inline-flex min-w-0 items-center gap-2 text-xs font-medium sm:text-sm",
            active ? "text-[#D9DEE1]" : "text-[#92999D]",
          ].join(" ")}
        >
          <span
            className={[
              "h-2 w-2 shrink-0 rounded-full",
              active ? "bg-[#E0E4E6]" : "bg-[#778085]",
            ].join(" ")}
          />
          <span>{status}</span>
        </span>

        {active ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-[#C3C9CC] transition-all group-hover:border-white/15 group-hover:bg-white/[0.07] group-hover:text-white">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        ) : (
          <span className="shrink-0 text-[9px] uppercase tracking-[0.1em] text-[#849095] sm:text-[10px]">
            Direncanakan
          </span>
        )}
      </div>
    </div>
  );

  if (active && href) {
    return (
      <Link
        href={href}
        className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {card}
      </Link>
    );
  }

  return card;
}

/* ===============================================================
   DETAIL ITEM
=============================================================== */

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#92999D] sm:text-xs">
        {label}
      </p>
      <p
        className="mt-1.5 break-words text-sm font-medium leading-6 text-[#D3D8DB] sm:text-base"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

/* ===============================================================
   SYSTEM STATUS
=============================================================== */

function SystemStatus({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: IconType;
  label: string;
  value: string;
  color: "silver";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] px-3 py-3 sm:px-4 sm:py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#D1D6D9] sm:h-9 sm:w-9">
          <Icon className="h-4 w-4" />
        </div>
        <span className="truncate text-sm leading-5 text-[#C0C6C9] sm:text-base">{label}</span>
      </div>

      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#D8DDE0] sm:text-sm">
        <span className="h-2 w-2 rounded-full bg-[#DDE2E4]" />
        {value}
      </span>
    </div>
  );
}
