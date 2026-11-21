
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserRound,
  ShieldCheck,
  KeyRound,
  Mail,
  Save,
  Eye,
  EyeOff,
  ArrowLeft,
  Settings,
} from "lucide-react";

import {
  updateSuperAdminProfile,
  updateSuperAdminPassword,
} from "@/app/admin/super-admin/actions";

type SuperAdminSettingsProps = {
  name: string;
  email: string;
};

export function SuperAdminSettings({
  name,
  email,
}: SuperAdminSettingsProps) {
  const [fullName, setFullName] = useState(name);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [message, setMessage] = useState("");

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none transition focus:border-[#9a7956] focus:ring-4 focus:ring-[#9a7956]/10";

  async function handleSaveProfile() {
    setLoadingProfile(true);
    setMessage("");

    try {
      const result = await updateSuperAdminProfile(fullName);
      setMessage(result.message);

      if (result.success) {
        setFullName(fullName.trim());
      }
    } catch {
      setMessage("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handleChangePassword() {
    setLoadingPassword(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Konfirmasi password baru tidak cocok.");
      setLoadingPassword(false);
      return;
    }

    try {
      const result = await updateSuperAdminPassword(
        oldPassword,
        newPassword,
      );

      setMessage(result.message);

      if (result.success) {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage("Terjadi kesalahan saat mengubah password.");
    } finally {
      setLoadingPassword(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-[#22221f]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/admin/super-admin"
            className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 shadow-sm transition hover:border-[#9a7956]/30 hover:bg-[#f3f1ec] hover:text-[#806646]"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#f3f1ec]">
            <Settings className="size-6 text-[#806646]" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7956]">
            Account Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Pengaturan
          </h1>

          <p className="mt-2 text-sm text-neutral-500 sm:text-base">
            Kelola profil dan keamanan akun Super Admin Kopilogi.
          </p>
        </div>

        {/* Feedback Message */}
        {message && (
          <div className="mb-5 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-sm">
            {message}
          </div>
        )}

        {/* Profile Section */}
        <section className="mb-6 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#f3f1ec]">
              <UserRound className="size-5 text-[#806646]" />
            </div>

            <div>
              <h2 className="font-semibold">Profil</h2>
              <p className="text-xs text-neutral-400">
                Informasi profil Super Admin
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="text-sm font-medium"
            >
              Nama lengkap
            </label>

            <input
              id="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClass}
              placeholder="Masukkan nama lengkap"
              maxLength={100}
            />
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={
              loadingProfile ||
              !fullName.trim() ||
              fullName.trim() === name
            }
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#171715] px-5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save className="size-4" />
            {loadingProfile ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </section>

        {/* Security Section */}
        <section className="mb-6 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#f3f1ec]">
              <KeyRound className="size-5 text-[#806646]" />
            </div>

            <div>
              <h2 className="font-semibold">Keamanan Akun</h2>
              <p className="text-xs text-neutral-400">
                Perbarui password akun Super Admin
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Old Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="text-sm font-medium"
              >
                Password lama
              </label>

              <div className="relative">
                <input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                  className={inputClass}
                  placeholder="Masukkan password lama"
                />

                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label={
                    showOldPassword
                      ? "Sembunyikan password lama"
                      : "Tampilkan password lama"
                  }
                >
                  {showOldPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="text-sm font-medium"
              >
                Password baru
              </label>

              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className={inputClass}
                  placeholder="Minimal 8 karakter"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label={
                    showNewPassword
                      ? "Sembunyikan password baru"
                      : "Tampilkan password baru"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Konfirmasi password baru
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                className={inputClass}
                placeholder="Ulangi password baru"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleChangePassword}
            disabled={
              loadingPassword ||
              !oldPassword ||
              newPassword.length < 8 ||
              newPassword !== confirmPassword
            }
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#171715] px-5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShieldCheck className="size-4" />
            {loadingPassword ? "Memproses..." : "Ubah Password"}
          </button>
        </section>

        {/* Account Information */}
        <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#f3f1ec]">
              <ShieldCheck className="size-5 text-[#806646]" />
            </div>

            <div>
              <h2 className="font-semibold">Informasi Akun</h2>
              <p className="text-xs text-neutral-400">
                Detail akses akun saat ini
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs text-neutral-400">
                Email
              </label>

              <div className="mt-2 flex h-11 items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4">
                <Mail className="size-4 text-neutral-400" />
                <span className="text-sm">{email}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400">
                Role
              </label>

              <div className="mt-2 flex h-11 items-center rounded-xl border border-neutral-200 bg-neutral-50 px-4">
                <span className="text-sm font-medium">
                  Super Admin
                </span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-neutral-400">
            Email dan role hanya dapat dilihat, tidak dapat diubah melalui halaman ini.
          </p>
        </section>
      </div>
    </div>
  );
}
