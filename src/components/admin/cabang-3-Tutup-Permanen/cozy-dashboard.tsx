"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  CircleUserRound,
  Coffee,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import type { BranchDocument } from "@/features/branches/types";

type CozyDashboardProps = {
  name: string;
  email: string;
  branch: BranchDocument | null;
  onSignOut: () => Promise<void>;
};

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  delay?: number;
};

const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin/cabang-3",
    icon: LayoutDashboard,
  },
  {
    label: "Kelola Menu",
    href: "/admin/cabang-3/menu",
    icon: Coffee,
  },
  {
    label: "Profil Cabang",
    href: "#",
    icon: Building2,
    disabled: true,
  },
  {
    label: "Pengaturan",
    href: "#",
    icon: Settings,
    disabled: true,
  },
];

function StatCard({ icon, label, value, description, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className='group relative overflow-hidden rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]'
    >
      <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-black/[0.025] transition-transform duration-500 group-hover:scale-150' />

      <div className='relative flex items-start justify-between'>
        <div>
          <p className='text-xs font-medium uppercase tracking-[0.14em] text-neutral-500'>
            {label}
          </p>

          <p className='mt-3 text-3xl font-semibold tracking-tight text-neutral-950'>{value}</p>

          <p className='mt-1 text-sm text-neutral-500'>{description}</p>
        </div>

        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white'>
          {icon}
        </div>
      </div>
    </motion.div>
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
      <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500'>
        {eyebrow}
      </p>

      <h2 className='mt-1 text-xl font-semibold tracking-tight text-neutral-950'>{title}</h2>

      <p className='mt-1 max-w-2xl text-sm leading-6 text-neutral-500'>{description}</p>
    </div>
  );
}

export function CozyDashboard({ name, email, branch, onSignOut }: CozyDashboardProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const branchName = branch?.name ?? "Kopilogi Cabang 3";
  const branchAddress = branch?.address ?? "Informasi alamat cabang belum tersedia.";

  const firstName = name.split(" ")[0];

  return (
    <div className='min-h-screen bg-[#f5f5f3] text-neutral-950'>
      {/* Desktop Sidebar */}
      <aside className='fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/10 bg-[#111111] text-white lg:flex lg:flex-col'>
        <div className='flex h-full flex-col'>
          {/* Brand */}
          <div className='flex h-20 items-center border-b border-white/8 px-6'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black'>
                <Coffee className='h-5 w-5' strokeWidth={2.2} />
              </div>

              <div>
                <p className='text-sm font-semibold tracking-[0.08em]'>KOPILOGI</p>

                <p className='mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/40'>
                  Hallway / Branch 03
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className='flex-1 px-4 py-6'>
            <p className='mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30'>
              Workspace
            </p>

            <nav className='space-y-1'>
              {navigationItems.map((item) => {
                const Icon = item.icon;

                if (item.disabled) {
                  return (
                    <div
                      key={item.label}
                      className='flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/25'
                    >
                      <Icon className='h-[18px] w-[18px]' />
                      <span>{item.label}</span>

                      <span className='ml-auto text-[9px] uppercase tracking-wider'>Soon</span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                      item.label === "Dashboard"
                        ? "bg-white text-black"
                        : "text-white/55 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <Icon className='h-[18px] w-[18px]' />

                    <span>{item.label}</span>

                    {item.label === "Dashboard" && <ChevronRight className='ml-auto h-4 w-4' />}
                  </Link>
                );
              })}
            </nav>

            {/* Branch identity */}
            <div className='mt-8 rounded-2xl border border-white/8 bg-white/[0.035] p-4'>
              <div className='flex items-center gap-2 text-white/40'>
                <MapPin className='h-3.5 w-3.5' />

                <span className='text-[10px] font-semibold uppercase tracking-[0.16em]'>
                  Current Branch
                </span>
              </div>

              <p className='mt-2 text-sm font-medium text-white'>{branchName}</p>

              <p className='mt-1 line-clamp-2 text-xs leading-5 text-white/35'>{branchAddress}</p>
            </div>
          </div>

          {/* Bottom */}
          <div className='border-t border-white/8 p-4'>
            <div className='mb-3 flex items-center gap-3 rounded-xl px-2 py-2'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10'>
                <CircleUserRound className='h-4.5 w-4.5 text-white/70' />
              </div>

              <div className='min-w-0'>
                <p className='truncate text-sm font-medium text-white'>{name}</p>

                <p className='truncate text-xs text-white/35'>{email}</p>
              </div>
            </div>

            <form action={onSignOut}>
              <button
                type='submit'
                className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/45 transition-colors hover:bg-white/6 hover:text-white'
              >
                <LogOut className='h-[18px] w-[18px]' />
                <span>Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className='sticky top-0 z-30 border-b border-black/8 bg-white/90 backdrop-blur-xl lg:hidden'>
        <div className='flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white'>
              <Coffee className='h-4 w-4' />
            </div>

            <div>
              <p className='text-sm font-semibold tracking-wide'>KOPILOGI</p>
              <p className='text-[9px] uppercase tracking-[0.16em] text-neutral-400'>Branch 03</p>
            </div>
          </div>

          <button
            type='button'
            onClick={() => setMobileOpen((value) => !value)}
            className='flex h-10 w-10 items-center justify-center rounded-xl border border-black/8 bg-white text-neutral-900'
            aria-label='Buka menu'
          >
            {mobileOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className='border-t border-black/8 bg-white px-4 py-4'
          >
            <nav className='space-y-1'>
              {navigationItems.map((item) => {
                const Icon = item.icon;

                if (item.disabled) {
                  return (
                    <div
                      key={item.label}
                      className='flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-300'
                    >
                      <Icon className='h-[18px] w-[18px]' />
                      <span>{item.label}</span>

                      <span className='ml-auto text-[9px] uppercase tracking-wider'>Soon</span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                      item.label === "Dashboard"
                        ? "bg-neutral-950 text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className='h-[18px] w-[18px]' />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className='mt-4 border-t border-black/8 pt-4'>
              <form action={onSignOut}>
                <button
                  type='submit'
                  className='flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-600 hover:bg-neutral-100'
                >
                  <LogOut className='h-[18px] w-[18px]' />
                  Keluar
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main */}
      <main className='lg:pl-[260px]'>
        <div className='mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8'>
          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='mb-8 hidden items-center justify-between lg:flex'
          >
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.18em] text-neutral-400'>
                Admin Workspace
              </p>

              <p className='mt-1 text-sm text-neutral-500'>{branchName} · Branch 03</p>
            </div>

            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='flex h-10 w-10 items-center justify-center rounded-xl border border-black/8 bg-white text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-950'
              >
                <Bell className='h-4 w-4' />
              </button>

              <div className='flex items-center gap-3 rounded-xl border border-black/8 bg-white px-3 py-2'>
                <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-white'>
                  <CircleUserRound className='h-4 w-4' />
                </div>

                <div className='hidden xl:block'>
                  <p className='text-xs font-semibold text-neutral-900'>{name}</p>

                  <p className='text-[10px] text-neutral-400'>Administrator</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='relative overflow-hidden rounded-[28px] bg-[#111111] px-6 py-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:px-8 sm:py-10 lg:px-10 lg:py-12'
          >
            {/* Decorative geometry */}
            <div className='absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10' />
            <div className='absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/8' />
            <div className='absolute bottom-[-90px] right-[22%] h-48 w-48 rounded-full border border-white/6' />

            <div className='absolute right-8 top-8 hidden h-24 w-24 grid-cols-3 gap-2 opacity-20 sm:grid'>
              {Array.from({ length: 9 }).map((_, index) => (
                <span key={index} className='h-1.5 w-1.5 rounded-full bg-white' />
              ))}
            </div>

            <div className='relative max-w-3xl'>
              <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5'>
                <Sparkles className='h-3.5 w-3.5 text-white/70' />

                <span className='text-[10px] font-medium uppercase tracking-[0.18em] text-white/65'>
                  Kopilogi Hallway
                </span>
              </div>

              <p className='text-sm font-medium uppercase tracking-[0.18em] text-white/40'>
                Selamat datang, {firstName}.
              </p>

              <h1 className='mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl'>
                A Different Space,
                <br />
                <span className='text-white/45'>A Better Experience.</span>
              </h1>

              <p className='mt-5 max-w-xl text-sm leading-6 text-white/55 sm:text-base'>
                Kelola informasi dan pengalaman digital Kopilogi Cabang 3 melalui workspace yang
                sederhana, bersih, dan terstruktur.
              </p>

              <div className='mt-7 flex flex-wrap gap-3'>
                <Link
                  href='/admin/cabang-3/menu'
                  className='inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition-transform hover:-translate-y-0.5'
                >
                  <Coffee className='h-4 w-4' />
                  Kelola Menu
                  <ArrowUpRight className='h-3.5 w-3.5' />
                </Link>

                {branch?.googleMapsUrl && (
                  <a
                    href={branch.googleMapsUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white'
                  >
                    <MapPin className='h-4 w-4' />
                    Lihat Lokasi
                    <ExternalLink className='h-3.5 w-3.5' />
                  </a>
                )}
              </div>
            </div>

            {/* Branch number */}
            <div className='absolute bottom-7 right-8 hidden text-right sm:block'>
              <p className='text-[9px] uppercase tracking-[0.25em] text-white/25'>Branch</p>

              <p className='mt-1 text-6xl font-semibold leading-none tracking-[-0.08em] text-white/8'>
                03
              </p>
            </div>
          </motion.section>

          {/* Stats */}
          <section className='mt-8'>
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              <StatCard
                icon={<Coffee className='h-4 w-4' />}
                label='Menu'
                value='—'
                description='Data menu tersedia'
                delay={0.1}
              />

              <StatCard
                icon={<ShoppingBag className='h-4 w-4' />}
                label='Pesanan'
                value='—'
                description='Belum terhubung'
                delay={0.15}
              />

              <StatCard
                icon={<Users className='h-4 w-4' />}
                label='Pelanggan'
                value='—'
                description='Belum tersedia'
                delay={0.2}
              />

              <StatCard
                icon={<BarChart3 className='h-4 w-4' />}
                label='Performa'
                value='—'
                description='Belum tersedia'
                delay={0.25}
              />
            </div>
          </section>

          {/* Content */}
          <section className='mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]'>
            {/* Branch information */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className='rounded-2xl border border-black/8 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]'
            >
              <SectionTitle
                eyebrow='Branch Information'
                title='Identitas Cabang'
                description='Informasi utama yang digunakan untuk merepresentasikan Kopilogi Cabang 3.'
              />

              <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                <div className='rounded-xl bg-[#f5f5f3] p-4'>
                  <div className='flex items-center gap-2 text-neutral-400'>
                    <Building2 className='h-4 w-4' />

                    <span className='text-[10px] font-semibold uppercase tracking-[0.15em]'>
                      Nama Cabang
                    </span>
                  </div>

                  <p className='mt-2 text-sm font-semibold text-neutral-900'>{branchName}</p>
                </div>

                <div className='rounded-xl bg-[#f5f5f3] p-4'>
                  <div className='flex items-center gap-2 text-neutral-400'>
                    <MapPin className='h-4 w-4' />

                    <span className='text-[10px] font-semibold uppercase tracking-[0.15em]'>
                      Lokasi
                    </span>
                  </div>

                  <p className='mt-2 line-clamp-2 text-sm font-medium leading-5 text-neutral-800'>
                    {branchAddress}
                  </p>
                </div>

                <div className='rounded-xl bg-[#f5f5f3] p-4'>
                  <div className='flex items-center gap-2 text-neutral-400'>
                    <Coffee className='h-4 w-4' />

                    <span className='text-[10px] font-semibold uppercase tracking-[0.15em]'>
                      Konsep
                    </span>
                  </div>

                  <p className='mt-2 text-sm font-semibold capitalize text-neutral-900'>
                    Contemporary Cozy
                  </p>
                </div>

                <div className='rounded-xl bg-[#f5f5f3] p-4'>
                  <div className='flex items-center gap-2 text-neutral-400'>
                    <CircleUserRound className='h-4 w-4' />

                    <span className='text-[10px] font-semibold uppercase tracking-[0.15em]'>
                      Administrator
                    </span>
                  </div>

                  <p className='mt-2 truncate text-sm font-semibold text-neutral-900'>{email}</p>
                </div>
              </div>
            </motion.div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className='rounded-2xl border border-black/8 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]'
            >
              <SectionTitle
                eyebrow='Quick Actions'
                title='Aksi Cepat'
                description='Akses fitur yang paling sering digunakan.'
              />

              <div className='mt-6 space-y-3'>
                <Link
                  href='/admin/cabang-3/menu'
                  className='group flex items-center gap-4 rounded-xl border border-black/8 p-4 transition-all hover:border-black/15 hover:bg-neutral-50'
                >
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white'>
                    <Coffee className='h-4 w-4' />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-semibold text-neutral-900'>Kelola Menu</p>

                    <p className='mt-0.5 text-xs text-neutral-400'>
                      Tambah dan kelola informasi menu
                    </p>
                  </div>

                  <ChevronRight className='h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-neutral-700' />
                </Link>

                <div className='flex items-center gap-4 rounded-xl border border-dashed border-black/10 p-4'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400'>
                    <Building2 className='h-4 w-4' />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-semibold text-neutral-400'>Profil Cabang</p>

                    <p className='mt-0.5 text-xs text-neutral-300'>
                      Akan tersedia pada tahap berikutnya
                    </p>
                  </div>

                  <span className='rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-neutral-400'>
                    Soon
                  </span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className='mt-10 flex flex-col gap-2 border-t border-black/8 py-6 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between'>
            <p>© 2026 Kopilogi · Admin Workspace</p>

            <p className='flex items-center gap-1.5'>
              <span className='h-1.5 w-1.5 rounded-full bg-green-500' />
              System operational
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
