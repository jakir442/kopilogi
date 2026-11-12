"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Building2,
  ChevronRight,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CreateAdminDialog } from "./create-admin-dialog";
import { EditAdminDialog } from "./edit-admin-dialog";
import { DeleteAdminDialog } from "./delete-admin-dialog";
import { ScrollbarTheme } from "@/components/layout/scrollbar-theme";
import { toast } from "sonner";
import Image from "next/image";

type AdminBranch = {
  id: string;
  name: string;
  slug: string;
  concept: "modern-futuristic" | "traditional-heritage" | "contemporary-cozy";
  isActive: boolean;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin";
  image?: string;
  branch: AdminBranch | null;
  createdAt: Date;
  updatedAt: Date;
};

type DashboardBranch = {
  id: string;
  name: string;
  slug: string;
  concept: "modern-futuristic" | "traditional-heritage" | "contemporary-cozy";
  address: string;
  phone?: string;
  googleMapsUrl?: string;
  openingHours?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type SuperAdminDashboardProps = {
  name: string;
  email: string;
  branches: DashboardBranch[];
  admins: AdminUser[];
  onSignOut: () => Promise<void>;
};

const branchMeta = [
  {
    slug: "cabang-1",
    label: "Cabang 1",
    concept: "Modern Futuristic",
    description: "Industrial, modern, dan futuristik.",
    className: "from-neutral-950 via-neutral-800 to-neutral-600 text-white",
    accent: "bg-white/15",
  },
  {
    slug: "cabang-2",
    label: "Cabang 2",
    concept: "Traditional Heritage",
    description: "Hangat, klasik, dan penuh karakter.",
    className: "from-[#4a3526] via-[#765239] to-[#a98461] text-white",
    accent: "bg-white/15",
  },
  {
    slug: "cabang-3",
    label: "Cabang 3",
    concept: "Contemporary Cozy",
    description: "Kopilogi Hallway — sementara tidak aktif.",
    className: "from-black via-neutral-800 to-neutral-500 text-white",
    accent: "bg-white/15",
  },
  {
    slug: "cabang-4",
    label: "Cabang 4",
    concept: "Contemporary Cozy",
    description: "Minimalis, clean, dan nyaman.",
    className: "from-stone-800 via-stone-600 to-stone-400 text-white",
    accent: "bg-white/15",
  },
] as const;

export function SuperAdminDashboard({
  name,
  email,
  branches,
  admins,
  onSignOut,
}: SuperAdminDashboardProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");

  const activeBranches = branches.filter((branch) => branch.isActive).length;

  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = window.scrollY + 180;
      const branches = document.getElementById("branches");
      const administrators = document.getElementById("administrators");

      if (administrators && marker >= administrators.offsetTop) {
        setActiveSection("administrators");
      } else if (branches && marker >= branches.offsetTop) {
        setActiveSection("branches");
      } else {
        setActiveSection("overview");
      }
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  const filteredAdmins = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return admins.filter((admin) => {
      const matchesSearch =
        !query ||
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query);

      const matchesBranch = selectedBranch === "all" || admin.branch?.id === selectedBranch;

      return matchesSearch && matchesBranch;
    });
  }, [admins, searchQuery, selectedBranch]);

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await onSignOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <ScrollbarTheme theme='super-admin-theme' />

      <div className='min-h-screen bg-[#f6f5f2] text-[#22221f]'>
        <aside className='fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-white/[0.06] bg-[#171715] text-white lg:flex lg:flex-col'>
          {/* Sidebar Header */}
          <div className='flex h-20 shrink-0 items-center border-b border-white/[0.08] px-6'>
            <div className='flex items-center gap-3'>
              <div className='relative flex size-10 items-center justify-center rounded-xl bg-white p-1.5'>
                <Image
                  src='/logo/kopilogi-no-bg.png'
                  alt='Logo Kopilogi'
                  fill
                  sizes='40px'
                  className='object-contain p-1 transition-transform duration-300 group-hover:scale-105'
                  priority
                />
              </div>

              <div>
                <p className='text-sm font-bold tracking-[0.2em]'>KOPILOGI</p>

                <p className='mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/45'>
                  Control Center
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className='min-h-0 flex-1 overflow-y-auto p-4'>
            <p className='mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35'>
              Workspace
            </p>

            <div className='space-y-1'>
              <Link
                href='/admin/super-admin'
                aria-current={activeSection === "overview" ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeSection === "overview"
                    ? "bg-white/[0.09] text-white"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <LayoutDashboard className='size-4 shrink-0' />
                Overview
              </Link>

              <Link
                href='#branches'
                aria-current={activeSection === "branches" ? "location" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeSection === "branches"
                    ? "bg-white/[0.09] text-white"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Building2 className='size-4 shrink-0' />
                Cabang
              </Link>

              <Link
                href='#administrators'
                aria-current={activeSection === "administrators" ? "location" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeSection === "administrators"
                    ? "bg-white/[0.09] text-white"
                    : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Users className='size-4 shrink-0' />
                Administrator
              </Link>
            </div>

            <p className='mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35'>
              System
            </p>

            <div className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45'>
              <ShieldCheck className='size-4' />
              Super Admin
            </div>
          </nav>

          {/* Sidebar User */}
          <div className='shrink-0 border-t border-white/[0.08] p-4'>
            <div className='mb-3 rounded-xl bg-white/[0.05] p-3'>
              <div className='flex items-center gap-3'>
                <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10'>
                  <CircleUserRound className='size-4 text-white/70' />
                </div>

                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>{name}</p>
                  <p className='truncate text-[11px] text-white/40'>{email}</p>
                </div>
              </div>
            </div>

            <button
              type='button'
              onClick={handleSignOut}
              disabled={isSigningOut}
              className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
            >
              <LogOut className='size-4' />

              {isSigningOut ? "Keluar..." : "Keluar"}
            </button>
          </div>
        </aside>

        {/* =========================================================
          MOBILE HEADER
      ========================================================== */}
        <header className='fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-black/[0.06] bg-[#f6f5f2]/95 px-4 backdrop-blur-xl lg:hidden'>
          <div className='flex items-center gap-2.5'>
            <div className='relative flex size-8 shrink-0 items-center justify-center'>
              <Image
                src='/logo/kopilogi-no-bg.png'
                alt='Logo Kopilogi'
                fill
                sizes='32px'
                className='object-contain'
                priority
              />
            </div>

            <div className='space-y-0.5'>
              <p className='text-xs font-bold tracking-[0.16em] text-[#171715]'>KOPILOGI</p>
              <p className='text-[9px] font-medium uppercase tracking-[0.12em] text-black/40'>
                Control Center
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={() => setMobileOpen((current) => !current)}
            className='flex size-10 items-center justify-center rounded-xl border border-black/[0.08] bg-white'
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className='size-5' /> : <Menu className='size-5' />}
          </button>
        </header>

        {/* MOBILE NAVIGATION */}
        {mobileOpen && (
          <>
            <button
              type='button'
              aria-label='Tutup navigasi'
              onClick={closeMobileMenu}
              className='fixed inset-0 z-20 bg-black/20 lg:hidden'
            />

            <div className='fixed inset-x-0 top-16 z-30 border-b border-black/[0.06] bg-[#f6f5f2] p-4 shadow-xl backdrop-blur-xl lg:hidden'>
              <nav className='space-y-1'>
                <Link
                  href='/admin/super-admin'
                  onClick={closeMobileMenu}
                  aria-current={activeSection === "overview" ? "page" : undefined}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeSection === "overview"
                      ? "bg-[#171715]/[0.08] text-[#171715]"
                      : "text-black/60 hover:bg-[#171715]/[0.06] hover:text-[#171715] active:bg-[#171715]/[0.10]"
                  }`}
                >
                  <LayoutDashboard className='size-4 shrink-0' />
                  Overview
                </Link>

                <Link
                  href='#branches'
                  onClick={closeMobileMenu}
                  aria-current={activeSection === "branches" ? "location" : undefined}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeSection === "branches"
                      ? "bg-[#171715]/[0.08] text-[#171715]"
                      : "text-black/60 hover:bg-[#171715]/[0.06] hover:text-[#171715] active:bg-[#171715]/[0.10]"
                  }`}
                >
                  <Building2 className='size-4 shrink-0' />
                  Cabang
                </Link>

                <Link
                  href='#administrators'
                  onClick={closeMobileMenu}
                  aria-current={activeSection === "administrators" ? "location" : undefined}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeSection === "administrators"
                      ? "bg-[#171715]/[0.08] text-[#171715]"
                      : "text-black/60 hover:bg-[#171715]/[0.06] hover:text-[#171715] active:bg-[#171715]/[0.10]"
                  }`}
                >
                  <Users className='size-4 shrink-0' />
                  Administrator
                </Link>

                <button
                  type='button'
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black/60 transition-all duration-200 hover:bg-[#171715]/[0.06] hover:text-[#171715] active:bg-[#171715]/[0.10] disabled:pointer-events-none disabled:opacity-50'
                >
                  <LogOut className='size-4 shrink-0' />
                  {isSigningOut ? "Keluar..." : "Keluar"}
                </button>
              </nav>
            </div>
          </>
        )}

        {/* MAIN CONTENT */}
        <main className='min-w-0 lg:pl-64'>
          <div className='mx-auto max-w-[1600px] px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pt-8'>
            {/* Page Header */}
            <header className='mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
              <div>
                <p className='mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7956]'>
                  Super Admin
                </p>

                <h1 className='text-3xl font-semibold tracking-[-0.03em] sm:text-4xl'>
                  Selamat datang, {getFirstName(name)}.
                </h1>

                <p className='mt-2 max-w-xl text-sm leading-6 text-neutral-500'>
                  Pantau dan kelola seluruh ekosistem digital Kopilogi dari satu tempat.
                </p>
              </div>

              <div className='flex w-fit items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-2 shadow-sm'>
                <span className='relative flex size-2.5'>
                  <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60' />
                  <span className='relative inline-flex size-2.5 rounded-full bg-emerald-500' />
                </span>

                <span className='text-xs font-medium text-neutral-600'>System operational</span>
              </div>
            </header>

            {/* Statistics */}
            <section
              aria-label='Statistik sistem'
              className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'
            >
              <StatCard
                icon={Building2}
                label='Total Cabang'
                value={branches.length}
                description='Cabang terdaftar'
              />

              <StatCard
                icon={Activity}
                label='Cabang Aktif'
                value={activeBranches}
                description='Cabang berstatus aktif'
              />

              <StatCard
                icon={Users}
                label='Administrator'
                value={admins.length}
                description='Admin cabang terdaftar'
              />

              <StatCard
                icon={ShieldCheck}
                label='System Access'
                value='Full'
                description='Akses Super Admin'
              />
            </section>

            {/* =====================================================
              KARTU CABANG
          ====================================================== */}
            <section>
              <div className='mb-5 mt-10 flex items-end justify-between gap-4'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400'>
                    Branch Management
                  </p>

                  <h2 className='mt-1 text-xl font-semibold tracking-tight text-[#22221f]'>
                    Cabang Kopilogi
                  </h2>

                  <p className='mt-1 text-sm text-neutral-500'>
                    Kelola dan pantau administrator pada setiap cabang.
                  </p>
                </div>

                <div className='hidden rounded-xl border border-black/[0.06] bg-white px-3.5 py-2 sm:block'>
                  <p className='text-xs text-neutral-400'>Total Cabang</p>

                  <p className='mt-0.5 text-lg font-semibold text-[#22221f]'>{branches.length}</p>
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {branches.map((branch) => {
                  const adminCount = admins.filter(
                    (admin) => admin.branch?.id === branch.id,
                  ).length;

                  return (
                    <div
                      key={branch.id}
                      className='group overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black/[0.1] hover:shadow-lg hover:shadow-black/[0.04]'
                    >
                      <div className='relative h-32 overflow-hidden bg-neutral-100'>
                        {branch.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={branch.image}
                            alt={branch.name}
                            className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
                          />
                        ) : (
                          <div className='flex size-full items-center justify-center bg-[#171715]'>
                            <span className='text-4xl font-semibold tracking-tight text-white/90'>
                              {branch.name.charAt(0)}
                            </span>
                          </div>
                        )}

                        <div className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent' />

                        <div className='absolute left-4 top-4'>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              branch.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {branch.isActive ? "Aktif" : "Tutup permanen"}
                          </span>
                        </div>

                        <div className='absolute bottom-4 left-4 right-4'>
                          <h3 className='truncate text-lg font-semibold text-white'>
                            {branch.name}
                          </h3>
                        </div>
                      </div>

                      <div className='p-5'>
                        <div className='flex items-center justify-between gap-3'>
                          <div>
                            <p className='text-[10px] font-semibold uppercase tracking-wider text-neutral-400'>
                              Konsep
                            </p>

                            <p className='mt-1 text-sm font-medium capitalize text-[#22221f]'>
                              {formatConcept(branch.concept)}
                            </p>
                          </div>

                          <div className='text-right'>
                            <p className='text-[10px] font-semibold uppercase tracking-wider text-neutral-400'>
                              Administrator
                            </p>

                            <p className='mt-1 text-sm font-semibold text-[#22221f]'>
                              {adminCount} admin
                            </p>
                          </div>
                        </div>

                        <div className='mt-4 border-t border-black/[0.06] pt-4'>
                          <p className='text-[10px] font-semibold uppercase tracking-wider text-neutral-400'>
                            Alamat
                          </p>

                          <p className='mt-1 line-clamp-2 text-sm leading-5 text-neutral-600'>
                            {branch.address}
                          </p>
                        </div>

                        <div className='mt-4 flex items-center justify-between'>
                          <span className='text-xs text-neutral-400'>
                            {adminCount === 0
                              ? "Belum ada administrator"
                              : `${adminCount} administrator ditugaskan`}
                          </span>

                          <span className='inline-flex size-8 items-center justify-center rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-600'>
                            {adminCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* =====================================================
              BRANCH NETWORK
          ====================================================== */}
            <section id='branches' className='mt-10 scroll-mt-8'>
              <div className='mb-5 flex items-end justify-between gap-4'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400'>
                    Branch Network
                  </p>

                  <h2 className='mt-1 text-xl font-semibold tracking-tight'>Cabang Kopilogi</h2>
                </div>

                <span className='text-xs text-neutral-400'>{branches.length} lokasi</span>
              </div>

              <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {branchMeta.map((meta) => {
                  const branch = branches.find((item) => item.slug === meta.slug);

                  return <BranchCard key={meta.slug} meta={meta} branch={branch ?? null} />;
                })}
              </div>
            </section>

            {/* =====================================================
              ADMINISTRATOR MANAGEMENT
          ====================================================== */}
            <section id='administrators' className='mt-10 scroll-mt-8'>
              <div className='mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400'>
                    Access Management
                  </p>

                  <h2 className='mt-1 text-xl font-semibold tracking-tight'>Administrator</h2>

                  <p className='mt-1 text-sm text-neutral-500'>
                    Pantau akun administrator yang ditugaskan pada setiap cabang.
                  </p>
                </div>

                <div className='flex items-center gap-2'>
                  <CreateAdminDialog branches={branches} />

                  <button
                    type='button'
                    disabled
                    className='h-10 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-400'
                  >
                    Kelola Admin
                  </button>
                </div>
              </div>

              <div className='overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm'>
                <div className='flex flex-col gap-3 border-b border-black/[0.05] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
                  <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-xl bg-[#f3f1ec]'>
                      <Users className='size-4 text-[#806646]' />
                    </div>

                    <div>
                      <p className='text-sm font-semibold'>Administrator Cabang</p>

                      <p className='text-xs text-neutral-400'>Data akun dari database Kopilogi.</p>
                    </div>
                  </div>

                  <span className='w-fit rounded-full bg-[#f3f1ec] px-3 py-1.5 text-xs font-medium text-[#806646]'>
                    {admins.length} administrator
                  </span>
                </div>

                {admins.length === 0 ? (
                  <div className='px-5 py-12 text-center sm:px-6'>
                    <div className='mx-auto flex size-12 items-center justify-center rounded-2xl bg-neutral-50'>
                      <Users className='size-5 text-neutral-400' />
                    </div>

                    <h3 className='mt-4 text-sm font-semibold'>Belum ada administrator cabang</h3>

                    <p className='mx-auto mt-1 max-w-md text-xs leading-5 text-neutral-400'>
                      Belum ditemukan akun dengan role admin. Akun super_admin tidak termasuk dalam
                      daftar ini.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className='hidden grid-cols-[1.5fr_1.2fr_1fr] gap-4 border-b border-black/[0.05] bg-neutral-50/70 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 md:grid'>
                      <span>Administrator</span>
                      <span>Cabang</span>
                      <span>Bergabung</span>
                    </div>

                    <div className='flex flex-col gap-3 border-b border-black/[0.05] p-5 sm:flex-row sm:items-center sm:justify-between md:px-6'>
                      <div className='relative w-full sm:max-w-sm'>
                        <Search className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400' />

                        <input
                          type='search'
                          value={searchQuery}
                          onChange={(event) => setSearchQuery(event.target.value)}
                          placeholder='Cari nama atau email admin...'
                          aria-label='Cari administrator'
                          className='h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-10 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100'
                        />

                        {searchQuery && (
                          <button
                            type='button'
                            onClick={() => setSearchQuery("")}
                            aria-label='Hapus pencarian'
                            className='absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-neutral-400 hover:text-neutral-700'
                          >
                            <X className='size-4' />
                          </button>
                        )}
                      </div>

                      <div className='flex items-center gap-2'>
                        <SlidersHorizontal className='size-4 shrink-0 text-neutral-400' />

                        <select
                          value={selectedBranch}
                          onChange={(event) => setSelectedBranch(event.target.value)}
                          aria-label='Filter berdasarkan cabang'
                          className='h-11 min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 sm:min-w-48'
                        >
                          <option value='all'>Semua cabang</option>

                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                              {!branch.isActive ? " — Tidak aktif" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className='px-5 py-3 md:px-6'>
                      <p className='text-xs text-neutral-500'>
                        Menampilkan{" "}
                        <span className='font-semibold text-neutral-800'>
                          {filteredAdmins.length}
                        </span>{" "}
                        dari {admins.length} administrator
                      </p>
                    </div>

                    <div className='divide-y divide-black/[0.05]'>
                      {filteredAdmins.map((admin) => (
                        <div
                          key={admin.id}
                          className='grid gap-4 px-5 py-4 transition-colors hover:bg-neutral-50/70 md:grid-cols-[1.5fr_1.2fr_1fr_auto] md:items-center md:px-6'
                        >
                          <div className='flex min-w-0 items-center gap-3'>
                            <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#171715] text-sm font-semibold text-white'>
                              {admin.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={admin.image}
                                  alt={`Foto ${admin.name}`}
                                  className='size-full object-cover'
                                />
                              ) : (
                                getInitials(admin.name)
                              )}
                            </div>

                            <div className='min-w-0'>
                              <p className='truncate text-sm font-semibold text-[#22221f]'>
                                {admin.name}
                              </p>

                              <p className='truncate text-xs text-neutral-400'>{admin.email}</p>

                              <span className='mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700'>
                                Administrator
                              </span>
                            </div>
                          </div>

                          <div className='min-w-0'>
                            <p className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:hidden'>
                              Cabang
                            </p>

                            {admin.branch ? (
                              <>
                                <p className='truncate text-sm font-medium text-[#22221f]'>
                                  {admin.branch.name}
                                </p>

                                <p className='mt-0.5 text-xs capitalize text-neutral-400'>
                                  {formatConcept(admin.branch.concept)}
                                </p>

                                <span
                                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                    admin.branch.isActive
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-neutral-100 text-neutral-500"
                                  }`}
                                >
                                  {admin.branch.isActive ? "Cabang aktif" : "Cabang tidak aktif"}
                                </span>
                              </>
                            ) : (
                              <span className='text-sm text-amber-700'>Belum ditugaskan</span>
                            )}
                          </div>

                          <div>
                            <p className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:hidden'>
                              Bergabung
                            </p>

                            <p className='text-sm text-neutral-600'>
                              {formatDate(admin.createdAt)}
                            </p>
                          </div>

                          <div className='flex items-center justify-start gap-1 md:justify-end'>
                            <EditAdminDialog admin={admin} branches={branches} />

                            <DeleteAdminDialog adminId={admin.id} adminName={admin.name} />
                          </div>
                        </div>
                      ))}

                      {filteredAdmins.length === 0 && (
                        <div className='px-6 py-12 text-center'>
                          <div className='mx-auto flex size-12 items-center justify-center rounded-2xl bg-neutral-100'>
                            <Search className='size-5 text-neutral-400' />
                          </div>

                          <h3 className='mt-4 text-sm font-semibold text-neutral-900'>
                            Administrator tidak ditemukan
                          </h3>

                          <p className='mt-1 text-sm text-neutral-500'>
                            Coba gunakan kata kunci lain atau ubah filter cabang.
                          </p>

                          <button
                            type='button'
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedBranch("all");
                            }}
                            className='mt-4 text-sm font-semibold text-neutral-900 underline underline-offset-4'
                          >
                            Reset pencarian dan filter
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Footer */}
            <footer className='mt-12 border-t border-black/[0.06] pt-6'>
              <div className='flex flex-col justify-between gap-2 text-xs text-neutral-400 sm:flex-row'>
                <p>Kopilogi Control Center</p>
                <p>Super Admin · Secure Management Area</p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}

type StatCardProps = {
  icon: typeof Building2;
  label: string;
  value: string | number;
  description: string;
};

function StatCard({ icon: Icon, label, value, description }: StatCardProps) {
  return (
    <div className='rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex size-10 items-center justify-center rounded-xl bg-[#f3f1ec]'>
          <Icon className='size-4 text-[#806646]' />
        </div>

        <ChevronRight className='size-4 text-neutral-300' />
      </div>

      <div className='mt-6'>
        <p className='text-xs font-medium text-neutral-400'>{label}</p>

        <p className='mt-1 text-3xl font-semibold tracking-tight'>{value}</p>

        <p className='mt-1 text-xs text-neutral-400'>{description}</p>
      </div>
    </div>
  );
}

type BranchCardProps = {
  meta: (typeof branchMeta)[number];
  branch: DashboardBranch | null;
};

function BranchCard({ meta, branch }: BranchCardProps) {
  const isActive = branch?.isActive ?? false;

  function handleInactiveClick() {
    toast.error("Aktivasi Cabang Diperlukan", {
      description:
        "Cabang ini sedang tidak aktif. Silakan aktivasi cabang terlebih dahulu melalui developer.",
      duration: 5000,
    });
  }

  const cardContent = (
    <>
      <div className={`relative min-h-44 overflow-hidden bg-gradient-to-br ${meta.className}`}>
        <div className='absolute -right-10 -top-10 size-40 rounded-full bg-white/[0.06]' />

        <div className='absolute -bottom-16 -left-10 size-40 rounded-full bg-black/[0.08]' />

        <div className='relative flex min-h-44 flex-col justify-between p-5'>
          <div className='flex items-start justify-between gap-4'>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${meta.accent}`}
            >
              {meta.concept}
            </span>

            <ArrowUpRight
              className={`size-4 opacity-60 transition-transform duration-300 ${
                isActive ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : ""
              }`}
            />
          </div>

          <div>
            <p className='text-2xl font-semibold tracking-tight'>{meta.label}</p>

            <p className='mt-1 text-xs text-white/60'>{meta.description}</p>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between gap-4 px-5 py-4'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium'>{branch?.name ?? meta.label}</p>

          <p className='mt-0.5 line-clamp-1 text-xs text-neutral-400'>
            {branch?.address ?? "Data cabang belum tersedia"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {isActive ? "Aktif" : "Tidak aktif"}
        </span>
      </div>
    </>
  );

  if (!isActive) {
    return (
      <button
        type='button'
        onClick={handleInactiveClick}
        className='group block w-full cursor-not-allowed overflow-hidden rounded-2xl border border-black/[0.06] bg-white text-left shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-md'
        aria-label={`Aktivasi ${branch?.name ?? meta.label} diperlukan`}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      href={`/admin/${meta.slug}`}
      className='group block overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
    >
      {cardContent}
    </Link>
  );
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Super Admin";
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "A"
  );
}

function formatConcept(concept: AdminBranch["concept"]) {
  const labels: Record<AdminBranch["concept"], string> = {
    "modern-futuristic": "Modern Futuristic",
    "traditional-heritage": "Traditional Heritage",
    "contemporary-cozy": "Contemporary Cozy",
  };

  return labels[concept];
}

function formatDate(value: Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
