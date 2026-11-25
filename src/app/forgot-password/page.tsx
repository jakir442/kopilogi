"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "email" | "otp" | "password";

type Account = {
  name: string;
  email: string;
  role: "admin" | "super_admin";
  branchId: string | null;
};

type ApiResponse = {
  message?: string;
  resetToken?: string;
  account?: Account;
};

const OTP_DURATION_SECONDS = 5 * 60;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [account, setAccount] = useState<Account | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(OTP_DURATION_SECONDS);

  useEffect(() => {
    if (step !== "otp" || otpExpiresAt === null) {
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));

      setRemainingSeconds(remaining);
    };

    updateTimer();

    const intervalId = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(intervalId);
  }, [step, otpExpiresAt]);

  const formattedTimer = `${String(Math.floor(remainingSeconds / 60)).padStart(
    2,
    "0",
  )}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  const timerColor =
    remainingSeconds === 0 || remainingSeconds <= 15
      ? "border-red-200 bg-red-50 text-red-700"
      : remainingSeconds <= 60
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  const timerDotColor =
    remainingSeconds === 0 || remainingSeconds <= 15
      ? "bg-red-500"
      : remainingSeconds <= 60
        ? "bg-amber-500"
        : "bg-emerald-500";

  async function postJson(url: string, body: Record<string, string>): Promise<ApiResponse> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = (await response.json().catch(() => ({}))) as ApiResponse;

    if (!response.ok) {
      throw new Error(result.message || "Permintaan belum berhasil.");
    }

    return result;
  }

  function startOtpTimer() {
    setRemainingSeconds(OTP_DURATION_SECONDS);
    setOtpExpiresAt(Date.now() + OTP_DURATION_SECONDS * 1000);
  }

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await postJson("/api/auth/forgot-password/request", {
        email: email.trim().toLowerCase(),
      });

      setEmail(email.trim().toLowerCase());
      setOtp("");
      setResetToken("");
      setAccount(null);
      startOtpTimer();

      setSuccessMessage(
        result.message ||
          "Jika email terdaftar sebagai akun internal pihak Kopilogi Kita, kode verifikasi akan dikirim.",
      );

      setStep("otp");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal meminta kode verifikasi.");
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOtp() {
    if (isResendingOtp || isLoading) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsResendingOtp(true);

    try {
      const result = await postJson("/api/auth/forgot-password/request", {
        email: email.trim().toLowerCase(),
      });

      setOtp("");
      startOtpTimer();

      setSuccessMessage(
        result.message ||
          "Jika email terdaftar sebagai akun internal pihak Kopilogi Kita, kode verifikasi akan dikirim.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengirim ulang kode OTP. Silakan coba kembali.",
      );
    } finally {
      setIsResendingOtp(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (remainingSeconds <= 0) {
      setErrorMessage("Waktu verifikasi telah habis. Silakan kirim ulang OTP terlebih dahulu.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await postJson("/api/auth/forgot-password/verify", {
        email: email.trim().toLowerCase(),
        otp,
      });

      if (!result.resetToken || !result.account) {
        throw new Error("Respons verifikasi tidak lengkap.");
      }

      setResetToken(result.resetToken);
      setAccount(result.account);
      setSuccessMessage("Email berhasil diverifikasi.");
      setStep("password");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Verifikasi OTP gagal.");
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await postJson("/api/auth/forgot-password/reset", {
        email: email.trim().toLowerCase(),
        resetToken,
        password,
        confirmPassword,
      });

      setSuccessMessage(result.message || "Password berhasil diperbarui.");
      setPassword("");
      setConfirmPassword("");
      setResetToken("");
      setOtp("");
      setAccount(null);
      setOtpExpiresAt(null);
      setRemainingSeconds(OTP_DURATION_SECONDS);
      setStep("email");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memperbarui password.");
    } finally {
      setIsLoading(false);
    }
  }

  function useAnotherEmail() {
    setStep("email");
    setOtp("");
    setResetToken("");
    setAccount(null);
    setOtpExpiresAt(null);
    setRemainingSeconds(OTP_DURATION_SECONDS);
    setErrorMessage("");
    setSuccessMessage("");
  }

  const stepNumber = step === "email" ? 1 : step === "otp" ? 2 : 3;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f3ed] px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-28 size-72 rounded-full bg-[#96704b]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 size-80 rounded-full bg-[#c9a77f]/15 blur-3xl"
      />

      <section className="relative w-full max-w-md rounded-3xl border border-[#e7e0d7] bg-white/95 p-6 shadow-xl shadow-[#211b16]/5 sm:p-8">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#776d62] transition-colors hover:text-[#493323]"
        >
          <ArrowLeft className="size-4" />
          Kembali ke login
        </Link>

        {/* Header: judul di kiri, logo di kanan */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#96704b]">
              Pemulihan akun internal
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#211b16]">
              {step === "email"
                ? "Lupa password?"
                : step === "otp"
                  ? "Verifikasi email"
                  : "Buat password baru"}
            </h1>
          </div>

          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#211b16] text-white shadow-lg shadow-[#211b16]/10">
            {step === "email" ? (
              <Mail className="size-5" />
            ) : step === "otp" ? (
              <ShieldCheck className="size-5" />
            ) : (
              <KeyRound className="size-5" />
            )}
          </div>
        </div>

        <p className="text-sm leading-6 text-[#776d62]">
          {step === "email"
            ? "Masukkan email akun internal pihak Kopilogi Kita yang terdaftar."
            : step === "otp"
              ? `Masukkan kode enam digit yang dikirim ke email ${email}.`
              : "Verifikasi berhasil. Sekarang kamu dapat membuat password baru."}
        </p>

        {/* Indikator langkah */}
        <div className="mt-6 flex gap-2" aria-label={`Langkah ${stepNumber} dari 3`}>
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              className={`h-1.5 flex-1 rounded-full ${
                number <= stepNumber ? "bg-[#8b6845]" : "bg-[#eee8df]"
              }`}
            />
          ))}
        </div>

        {/* Informasi akun terverifikasi */}
        {account && step === "password" && (
          <div className="mt-6 rounded-2xl border border-[#e7e0d7] bg-[#faf8f4] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#40362c]">
              <UserRound className="size-4 text-[#8b6845]" />
              Akun terverifikasi
            </div>

            <p className="mt-3 text-sm font-medium text-[#211b16]">{account.name}</p>

            <p className="mt-1 break-all text-sm text-[#776d62]">{account.email}</p>

            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                  account.role === "super_admin"
                    ? "border-[#b99a70] bg-[#eee0c9] text-[#68451f]"
                    : "border-[#d8c8b5] bg-[#f1ebe3] text-[#765239]"
                }`}
              >
                <ShieldCheck className="size-3.5" />
                {account.role === "super_admin" ? "Super Admin" : "Admin"}
              </span>
            </div>
          </div>
        )}

        {/* Pesan error */}
        {errorMessage && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {/* Pesan berhasil */}
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Langkah 1: email */}
        {step === "email" && (
          <form onSubmit={requestOtp} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#40362c]">
                Alamat email
              </label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={254}
                disabled={isLoading}
                className="h-11 rounded-xl border-[#e7e0d7] bg-[#faf8f4]/80 focus-visible:ring-[#96704b]/20"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-xl bg-[#211b16] font-semibold text-white hover:bg-[#493323]"
            >
              {isLoading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <>
                  Kirim kode verifikasi
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* Langkah 2: OTP */}
        {step === "otp" && (
          <form onSubmit={verifyOtp} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              {/* Label OTP dan timer sejajar */}
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="otp" className="text-sm font-medium text-[#40362c]">
                  Kode OTP
                </label>

                <div
                  role="timer"
                  aria-label={
                    remainingSeconds > 0
                      ? `Kode OTP tersisa ${formattedTimer}`
                      : "Kode OTP kedaluwarsa"
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tabular-nums transition-colors ${timerColor}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${timerDotColor} ${
                      remainingSeconds > 0 && remainingSeconds <= 15 ? "animate-pulse" : ""
                    }`}
                  />

                  {remainingSeconds > 0 ? formattedTimer : "Kedaluwarsa"}
                </div>
              </div>

              <Input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                pattern="[0-9]{6}"
                maxLength={6}
                disabled={isLoading || remainingSeconds === 0}
                className="h-12 rounded-xl border-[#e7e0d7] text-center text-xl tracking-[0.35em] focus-visible:ring-[#96704b]/20"
              />

              <p
                aria-live="polite"
                className={`text-xs leading-5 ${
                  remainingSeconds === 0 ? "text-red-600" : "text-[#8a7e71]"
                }`}
              >
                {remainingSeconds === 0
                  ? "Kode OTP telah kedaluwarsa. Kirim ulang kode untuk melanjutkan."
                  : "Kode berlaku lima menit. Jangan bagikan kode ini kepada siapa pun."}
              </p>

              {/* Kirim ulang muncul setelah timer habis */}
              {remainingSeconds === 0 && (
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={isLoading || isResendingOtp}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d8c8b5] bg-[#faf8f4] px-4 py-3 text-sm font-semibold text-[#765239] transition-colors hover:bg-[#f1ebe3] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResendingOtp ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Mengirim ulang OTP...
                    </>
                  ) : (
                    <>
                      <Mail className="size-4" />
                      Kirim ulang OTP
                    </>
                  )}
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || isResendingOtp || otp.length !== 6 || remainingSeconds === 0}
              className="h-11 w-full rounded-xl bg-[#211b16] font-semibold text-white hover:bg-[#493323]"
            >
              {isLoading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <>
                  Verifikasi kode
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={useAnotherEmail}
              disabled={isLoading || isResendingOtp}
              className="w-full text-center text-sm font-medium text-[#8b6845] hover:text-[#493323] disabled:opacity-60"
            >
              Gunakan email lain
            </button>
          </form>
        )}

        {/* Langkah 3: password baru */}
        {step === "password" && (
          <form onSubmit={resetPassword} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-sm font-medium text-[#40362c]">
                Password baru
              </label>

              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                maxLength={72}
                disabled={isLoading}
                className="h-11 rounded-xl border-[#e7e0d7] focus-visible:ring-[#96704b]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-sm font-medium text-[#40362c]">
                Konfirmasi password baru
              </label>

              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                maxLength={72}
                disabled={isLoading}
                className="h-11 rounded-xl border-[#e7e0d7] focus-visible:ring-[#96704b]/20"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-xl bg-[#211b16] font-semibold text-white hover:bg-[#493323]"
            >
              {isLoading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <>
                  Simpan password baru
                  <LockKeyhole className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* Catatan keamanan */}
        <div className="mt-7 flex items-start gap-2 border-t border-[#eee8df] pt-5 text-xs leading-5 text-[#8a7e71]">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#8b6845]" />
          <p>
            Fitur ini khusus akun internal Kopilogi Kita. Pelanggan tidak perlu membuat akun untuk
            melihat menu dan informasi cabang.
          </p>
        </div>
      </section>
    </main>
  );
}
