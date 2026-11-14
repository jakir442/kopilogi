"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  CircleUserRound,
  Coffee,
  ExternalLink,
  LogOut,
  MapPin,
  Menu as MenuIcon,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
  X,
  MessageSquareText,
  Globe2,
} from "lucide-react";
import Image from "next/image";

import { MenuManagement, type MenuData } from "@/features/menu/components/admin/menu-management";
import { CustomerManagement } from "@/features/customers/components/admin/customer-management";
import { ContentManagement } from "@/features/content/components/admin/content-management";
import type { BranchDocument } from "@/features/branches/types";

type AdminTab = "dashboard" | "menu" | "customers" | "content" | "settings";

type CozyDashboardProps = {
  name: string;
  email: string;
  branch: BranchDocument | null;
  menus: MenuData[];
  onSignOut: () => Promise<void>;
  isSuperAdmin?: boolean;
  activeTab?: AdminTab;
};

type NavigationItem = {
  label: string;
  description: string;
  href: string;
  icon: typeof Coffee;
  tab: AdminTab;
};

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  delay?: number;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    description: "Ringkasan dan informasi cabang",
    href: "/admin/cabang-4",
    icon: BarChart3,
    tab: "dashboard",
  },
  {
    label: "Menu",
    description: "Kelola daftar dan informasi menu",
    href: "/admin/cabang-4?tab=menu",
    icon: Coffee,
    tab: "menu",
  },
  {
    label: "Pelanggan",
    description: "Kelola ulasan pelanggan",
    href: "/admin/cabang-4?tab=customers",
    icon: MessageSquareText,
    tab: "customers",
  },
  {
    label: "Konten Web",
    description: "Kelola konten website cabang",
    href: "/admin/cabang-4?tab=content",
    icon: Globe2,
    tab: "content",
  },
  {
    label: "Pengaturan",
    description: "Pengaturan cabang",
    href: "/admin/cabang-4?tab=settings",
    icon: Settings,
    tab: "settings",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

function StatCard({ icon, label, value, description, delay = 0 }: StatCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      transition={{ delay }}
      className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)]"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-black/[0.025] transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">{value}</p>
          <p className="mt-1 text-sm leading-5 text-neutral-500">{description}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white">
          {icon}
        </div>
      </div>
    </motion.article>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-[11px]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">{description}</p>
    </div>
  );
}

function NavigationLink({
  item,
  activeTab,
  onNavigate,
  mobile = false,
}: {
  item: NavigationItem;
  activeTab: AdminTab;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const Icon = item.icon;
  const isActive = item.tab === activeTab;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      title={item.description}
      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors duration-200 ${
        mobile
          ? isActive
            ? "bg-neutral-950 text-white"
            : "text-neutral-600 hover:bg-neutral-100"
          : isActive
            ? "bg-white text-neutral-950 shadow-sm"
            : "text-white/55 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="flex-1">{item.label}</span>

      {isActive && (
        <ChevronRight className={`h-4 w-4 ${mobile ? "text-white/70" : "text-neutral-400"}`} />
      )}
    </Link>
  );
}

function Brand({ mobile = false }: { mobile?: boolean }) {
  return (
    <Link
      href="/admin/cabang-4"
      className="group flex items-center gap-3"
      aria-label="Kopilogi Cabang 4 — Dashboard"
    >
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-neutral-950 transition-transform duration-300 group-hover:-rotate-3 ${
          mobile ? "h-9 w-9" : "h-10 w-10"
        }`}
      >
        <Image
          src="/logo/kopilogi-no-bg.png"
          alt="Logo Kopilogi"
          fill
          sizes={mobile ? "36px" : "40px"}
          className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>

      <div>
        <p className="text-sm font-semibold tracking-[0.08em] text-white">KOPILOGI Tasik</p>
        <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-white/40">
          Tasik · Branch 04
        </p>
      </div>
    </Link>
  );
}

function UserIdentity({
  name,
  email,
  mobile = false,
}: {
  name: string;
  email: string;
  mobile?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
        <CircleUserRound className="h-[18px] w-[18px] text-white/75" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{name}</p>
        <p className="truncate text-xs text-white/40">{email}</p>
        {mobile && <p className="mt-1 text-[10px] text-white/35">Administrator Cabang 4</p>}
      </div>
    </div>
  );
}

function ComingSoonSection({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof Globe2;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-[26px] border border-black/[0.07] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8 lg:p-10"
      >
        <div className="flex max-w-3xl flex-col">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
            <Icon className="h-5 w-5" />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-[11px]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
            {description}
          </p>

          <div className="mt-7 rounded-2xl border border-dashed border-black/10 bg-[#F5F5F3] p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
              <div>
                <p className="text-sm font-semibold text-neutral-800">Fitur sedang disiapkan</p>
                <p className="mt-1 text-xs leading-6 text-neutral-500">
                  Struktur workspace Cabang 4 sudah disiapkan agar konsisten dengan navigasi cabang
                  lainnya. Fitur pengelolaan bagian ini dapat dikembangkan pada tahap berikutnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export function CozyDashboard({
  name,
  email,
  branch,
  menus,
  onSignOut,
  isSuperAdmin = false,
  activeTab = "dashboard",
}: CozyDashboardProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const branchName = branch?.name ?? "Kopilogi Cabang 4";
  const branchAddress = branch?.address ?? "Informasi alamat cabang belum tersedia.";
  const firstName = name.trim().split(/\s+/)[0] || "Admin";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("cozy-theme");

    return () => {
      root.classList.remove("cozy-theme");
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  const handleSignOut = () => {
    closeMobileMenu();
    void onSignOut();
  };

  const renderContent = () => {
    if (activeTab === "menu") {
      return (
        <MenuManagement
          initialMenus={menus}
          branchId={branch?._id ? String(branch._id) : undefined}
          theme="contemporary-cozy"
        />
      );
    }

    if (activeTab === "customers") {
      return (
        <div className="min-h-screen bg-[#F5F5F3]">
          <div className="mx-auto w-full max-w-[1600px]">
            <CustomerManagement
              branchId={branch?._id ? String(branch._id) : undefined}
              branchSlug={branch?.slug ?? "cabang-4"}
              branchName={branchName}
            />
          </div>
        </div>
      );
    }

    if (activeTab === "content") {
      return (
        <div className="min-h-screen bg-[#F4F3EF]">
          <div className="mx-auto w-full max-w-[1600px]">
            <ContentManagement
              branchId={branch?._id ? String(branch._id) : undefined}
              branchSlug="cabang-4"
              branchName={branchName}
            />
          </div>
        </div>
      );
    }

    if (activeTab === "settings") {
      return (
        <ComingSoonSection
          icon={Settings}
          eyebrow="Branch Settings"
          title="Pengaturan"
          description={`Kelola pengaturan dan konfigurasi administrator untuk ${branchName}.`}
        />
      );
    }

    // Dashboard utama tetap ditampilkan pada tab dashboard.
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 hidden items-center justify-between gap-4 lg:flex"
        >
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Admin Workspace
            </p>
            <p className="mt-1 text-sm text-neutral-500">{branchName} · Cabang 04</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 items-center gap-2 rounded-xl border border-black/[0.07] bg-white px-3 text-neutral-500">
              <Bell className="h-4 w-4" />
              <span className="text-xs">Panel administrasi</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-black/[0.07] bg-white px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
                <CircleUserRound className="h-4 w-4" />
              </div>
              <div className="max-w-[180px]">
                <p className="truncate text-xs font-semibold text-neutral-900">{name}</p>
                <p className="truncate text-[10px] text-neutral-400">Administrator</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative isolate overflow-hidden rounded-[26px] bg-[#111111] px-5 py-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.10)] sm:rounded-[28px] sm:px-8 sm:py-10 lg:px-10 lg:py-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/[0.10]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/[0.08]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-[22%] h-48 w-48 rounded-full border border-white/[0.06]"
          />

          <div
            aria-hidden="true"
            className="absolute right-8 top-8 hidden grid-cols-3 gap-2 opacity-20 sm:grid"
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} className="h-1.5 w-1.5 rounded-full bg-white" />
            ))}
          </div>

          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/65 sm:text-[10px]">
                Contemporary Cozy · Cabang 04
              </span>
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/45">
              Selamat datang, {firstName}.
            </p>

            <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              A Different Space,
              <br />
              <span className="text-white/45">A Better Experience.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Kelola informasi Kopilogi Cabang 4 melalui ruang kerja yang sederhana, nyaman, dan
              terstruktur. Pastikan informasi menu serta identitas cabang selalu akurat untuk
              pelanggan.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/admin/cabang-4?tab=menu"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-all hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                <Coffee className="h-4 w-4" />
                Kelola Menu
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/admin/cabang-4?tab=customers"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.10] hover:text-white"
              >
                <MessageSquareText className="h-4 w-4" />
                Pelanggan
              </Link>

              {branch?.googleMapsUrl && (
                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.10] hover:text-white"
                >
                  <MapPin className="h-4 w-4" />
                  Lihat Lokasi
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-7 right-8 hidden text-right sm:block">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">Branch</p>
            <p className="mt-1 text-6xl font-semibold leading-none tracking-[-0.08em] text-white/[0.08]">
              04
            </p>
          </div>
        </motion.section>

        {/* Overview */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible" className="mt-9">
          <SectionTitle
            eyebrow="Overview"
            title="Ringkasan workspace"
            description="Akses pengelolaan informasi cabang dari satu tempat. Data operasional yang belum terintegrasi tidak ditampilkan sebagai angka aktual."
          />

          <motion.div variants={fadeUp} className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Coffee className="h-4 w-4" />}
              label="Menu"
              value="—"
              description="Ringkasan menu belum tersedia"
              delay={0.05}
            />
            <StatCard
              icon={<ShoppingBag className="h-4 w-4" />}
              label="Pesanan"
              value="—"
              description="Belum terhubung ke sistem pesanan"
              delay={0.1}
            />
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Pelanggan"
              value="—"
              description="Data pelanggan belum tersedia"
              delay={0.15}
            />
            <StatCard
              icon={<BarChart3 className="h-4 w-4" />}
              label="Performa"
              value="—"
              description="Analitik belum tersedia"
              delay={0.2}
            />
          </motion.div>
        </motion.section>

        {/* Branch information and quick actions */}
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <motion.article
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.025)] sm:p-6"
          >
            <SectionTitle
              eyebrow="Branch Information"
              title="Identitas Cabang"
              description="Informasi dasar yang digunakan untuk merepresentasikan Kopilogi Cabang 4."
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F5F5F3] p-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Building2 className="h-4 w-4" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                    Nama Cabang
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-neutral-900">{branchName}</p>
              </div>

              <div className="rounded-xl bg-[#F5F5F3] p-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                    Lokasi
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm font-medium leading-5 text-neutral-800">
                  {branchAddress}
                </p>
              </div>

              <div className="rounded-xl bg-[#F5F5F3] p-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Coffee className="h-4 w-4" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                    Konsep
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-neutral-900">Contemporary Cozy</p>
              </div>

              <div className="rounded-xl bg-[#F5F5F3] p-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <CircleUserRound className="h-4 w-4" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                    Administrator
                  </span>
                </div>
                <p className="mt-2 break-words text-sm font-semibold text-neutral-900">{email}</p>
              </div>
            </div>

            {branch?.googleMapsUrl && (
              <a
                href={branch.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition-colors hover:text-black"
              >
                Buka lokasi cabang
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </motion.article>

          <motion.article
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.025)] sm:p-6"
          >
            <SectionTitle
              eyebrow="Quick Actions"
              title="Aksi Cepat"
              description="Akses fitur pengelolaan yang tersedia saat ini."
            />

            <div className="mt-6 space-y-3">
              <Link
                href="/admin/cabang-4?tab=menu"
                className="group flex items-center gap-4 rounded-xl border border-black/[0.07] p-4 transition-all hover:border-black/15 hover:bg-neutral-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white">
                  <Coffee className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900">Kelola Menu</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Tambah dan perbarui informasi menu cabang.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-neutral-700" />
              </Link>

              <Link
                href="/admin/cabang-4?tab=customers"
                className="group flex items-center gap-4 rounded-xl border border-black/[0.07] p-4 transition-all hover:border-black/15 hover:bg-neutral-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white">
                  <MessageSquareText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900">Pelanggan</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Kelola dan moderasi ulasan pelanggan.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-neutral-700" />
              </Link>

              <Link
                href="/admin/cabang-4?tab=content"
                className="group flex items-center gap-4 rounded-xl border border-black/[0.07] p-4 transition-all hover:border-black/15 hover:bg-neutral-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                  <Globe2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900">Konten Web</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Kelola konten website cabang.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-neutral-700" />
              </Link>

              <Link
                href="/admin/cabang-4?tab=settings"
                className="group flex items-center gap-4 rounded-xl border border-black/[0.07] p-4 transition-all hover:border-black/15 hover:bg-neutral-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                  <Settings className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900">Pengaturan</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Pengaturan cabang dan administrator.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-neutral-700" />
              </Link>

              <div className="rounded-xl bg-[#F5F5F3] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">Informasi tetap akurat</p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Periksa nama, deskripsi, foto, dan harga menu sebelum perubahan ditampilkan
                      kepada pelanggan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </section>

        {/* Footer */}
        <footer className="mt-10 flex flex-col gap-3 border-t border-black/[0.07] py-6 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kopilogi · Admin Workspace Cabang 4</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
            Contemporary Cozy Interface
          </p>
        </footer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-neutral-950 selection:bg-neutral-300/60">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-neutral-200/40 blur-3xl" />
        <div className="absolute -bottom-40 left-[20%] h-[360px] w-[360px] rounded-full bg-stone-200/40 blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.08] bg-[#111111] text-white lg:flex">
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-20 shrink-0 items-center border-b border-white/[0.08] px-6">
            <Brand />
          </div>

          <div className="cozy-sidebar-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Workspace
            </p>

            <nav aria-label="Navigasi utama" className="space-y-1">
              {navigationItems.map((item) => (
                <NavigationLink key={item.label} item={item} activeTab={activeTab} />
              ))}
            </nav>

            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
              <div className="flex items-center gap-2 text-white/40">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                  Cabang Saat Ini
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-white">{branchName}</p>
              <p className="mt-1 line-clamp-3 text-xs leading-5 text-white/40">{branchAddress}</p>

              {branch?.googleMapsUrl && (
                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
                >
                  Lihat Google Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-white/[0.08] p-4">
            <div className="mb-3 rounded-xl px-2 py-2">
              <UserIdentity name={name} email={email} />
            </div>

            {isSuperAdmin ? (
              <Link
                href="/admin/super-admin"
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#B8C0C4] transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={18} strokeWidth={1.7} />
                Kembali ke Super Admin
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#8F969A] transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <LogOut size={18} strokeWidth={1.7} />
                Keluar dari akun
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-white/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between gap-3 px-4">
          <Link
            href="/admin/cabang-4"
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Coffee className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-wide">KOPILOGI</p>
              <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                Tasik · Branch 04
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
            aria-controls="cozy-mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Tutup menu navigasi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-[2px] lg:hidden"
            />

            <motion.aside
              id="cozy-mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Menu navigasi Cabang 4"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="cozy-sidebar-scroll fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col overflow-y-auto overscroll-contain bg-[#111111] text-white shadow-2xl lg:hidden"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
                <Brand mobile />
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Tutup menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 px-4 py-6">
                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Workspace
                </p>

                <nav aria-label="Navigasi mobile" className="space-y-1">
                  {navigationItems.map((item) => (
                    <NavigationLink
                      key={item.label}
                      item={item}
                      activeTab={activeTab}
                      mobile
                      onNavigate={closeMobileMenu}
                    />
                  ))}
                </nav>

                <div className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                  <div className="flex items-center gap-2 text-white/40">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                      Cabang Saat Ini
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-white">{branchName}</p>
                  <p className="mt-1 text-xs leading-5 text-white/40">{branchAddress}</p>

                  {branch?.googleMapsUrl && (
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/60 hover:text-white"
                    >
                      Lihat Google Maps
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="shrink-0 border-t border-white/[0.08] p-4">
                <div className="mb-3 rounded-xl px-2 py-2">
                  <UserIdentity name={name} email={email} mobile />
                </div>

                {isSuperAdmin ? (
                  <Link
                    href="/admin/super-admin"
                    onClick={closeMobileMenu}
                    className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#B8C0C4] transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <ArrowLeft size={18} strokeWidth={1.7} />
                    Kembali ke Super Admin
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#8F969A] transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <LogOut size={18} strokeWidth={1.7} />
                    Keluar dari akun
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="relative z-10 min-w-0 lg:pl-[260px]">{renderContent()}</main>
    </div>
  );
}
