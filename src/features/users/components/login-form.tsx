"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error || !result.ok) {
        setErrorMessage("Email atau password yang kamu masukkan salah.");
        return;
      }

      const session = await getSession();

      if (!session?.user) {
        setErrorMessage("Sesi login belum tersedia. Silakan coba kembali.");
        return;
      }

      const role = session.user.role;

      if (role === "super_admin") {
        router.replace("/admin/super-admin");
      } else if (role === "admin") {
        router.replace("/admin");
      } else {
        setErrorMessage("Akun ini tidak memiliki akses ke area internal Kopilogi.");

        return;
      }

      router.refresh();
    } catch {
      setErrorMessage("Terjadi kesalahan. Silakan coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Mobile heading */}
      <div className="mb-6 lg:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#96704b]">
          Akses internal
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#211b16]">
          Login owner & karyawan
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#776d62]">
          Masuk menggunakan akun internal yang telah diberikan oleh pengelola Kopilogi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#40362c]">
            Alamat email
          </label>

          <div className="group relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-[#a09689] transition-colors group-focus-within:text-[#8b6845]"
            />

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? "login-error" : undefined}
              className="h-11 rounded-xl border-[#e7e0d7] bg-[#faf8f4]/80 pl-10 text-sm shadow-none transition-all placeholder:text-[#b3a99d] hover:border-[#d4c7b7] focus-visible:border-[#96704b] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#96704b]/10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password" className="text-sm font-medium text-[#40362c]">
              Password
            </label>

            <span className="text-[11px] text-[#a09689]">Jaga kerahasiaannya</span>
          </div>

          <div className="group relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-[#a09689] transition-colors group-focus-within:text-[#8b6845]"
            />

            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isLoading}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? "login-error" : undefined}
              className="h-11 rounded-xl border-[#e7e0d7] bg-[#faf8f4]/80 pl-10 pr-11 text-sm shadow-none transition-all placeholder:text-[#b3a99d] hover:border-[#d4c7b7] focus-visible:border-[#96704b] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#96704b]/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isLoading}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              aria-pressed={showPassword}
              className="absolute right-2.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#a09689] transition-colors hover:bg-[#211b16]/5 hover:text-[#40362c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96704b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="size-[17px]" /> : <Eye className="size-[17px]" />}
            </button>
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <div
            id="login-error"
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold">
              !
            </span>

            <p className="leading-5">{errorMessage}</p>
          </div>
        )}

        {/* Login button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="group relative mt-1 h-11 w-full overflow-hidden rounded-xl bg-[#211b16] text-sm font-semibold text-white shadow-md shadow-[#211b16]/10 transition-all duration-300 hover:bg-[#493323] hover:shadow-lg hover:shadow-[#211b16]/15 focus-visible:ring-4 focus-visible:ring-[#96704b]/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Memproses login...
              </>
            ) : (
              <>
                Login ke Dashboard
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </span>
        </Button>

        {/* Security */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5 text-[11px] text-[#9a8f82]">
          <ShieldCheck className="size-3.5 shrink-0 text-emerald-700/70" />
          <span>Akses khusus owner dan karyawan Kopilogi</span>
        </div>
      </form>

      {/* Customer information */}
      <div className="mt-6 rounded-xl border border-[#e7e0d7] bg-[#faf8f4]/70 p-4">
        <p className="text-sm font-medium text-[#40362c]">Ingin melihat menu Kopilogi?</p>

        <p className="mt-1 text-xs leading-5 text-[#776d62]">
          Pelanggan tidak perlu membuat akun atau login. Kamu bisa langsung mengunjungi website
          untuk melihat menu dan informasi cabang.
        </p>

        <Link
          href="/"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8b6845] transition-colors hover:text-[#493323]"
        >
          Kunjungi website
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
