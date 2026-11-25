
import { createHmac, randomInt } from "node:crypto";
import { createTransport } from "nodemailer";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/models/user.model";
import { PasswordReset } from "@/features/users/models/password-reset.model";

export const runtime = "nodejs";

const genericMessage =
  "Jika email terdaftar sebagai akun internal, kode verifikasi akan dikirim.";

const OTP_EXPIRY_MS = 5 * 60_000;
const OTP_COOLDOWN_MS = 60_000;

function hashOtp(email: string, otp: string, secret: string) {
  return createHmac("sha256", secret)
    .update(`${email}:${otp}`)
    .digest("hex");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json({ message: genericMessage });
    }

    const secret = process.env.PASSWORD_RESET_SECRET;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_APP_PASSWORD;

    if (
      !secret ||
      !smtpHost ||
      !Number.isInteger(smtpPort) ||
      smtpPort < 1 ||
      smtpPort > 65535 ||
      !smtpUser ||
      !smtpPassword
    ) {
      console.error(
        "Konfigurasi SMTP atau pemulihan password belum lengkap.",
      );

      return NextResponse.json(
        { message: "Layanan pemulihan password belum tersedia." },
        { status: 500 },
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      email,
      role: { $in: ["admin", "super_admin"] },
    }).select("_id name email role branchId");

    // Tidak mengirim OTP jika akun internal tidak ditemukan.
    if (!user) {
      return NextResponse.json(
        {
          message:
            "Email tidak terdaftar sebagai akun internal Kopilogi Kita.",
        },
        { status: 404 },
      );
    }

    const now = new Date();
    const existing = await PasswordReset.findOne({ email });

    // Cooldown pengiriman ulang: 60 detik.
    if (
      existing?.lastSentAt &&
      now.getTime() - existing.lastSentAt.getTime() < OTP_COOLDOWN_MS
    ) {
      return NextResponse.json(
        { message: genericMessage },
        { status: 429 },
      );
    }

    const otp = randomInt(0, 1_000_000)
      .toString()
      .padStart(6, "0");

    const otpHash = hashOtp(email, otp, secret);

    // Simpan OTP dan masa berlaku sebelum pengiriman email.
    await PasswordReset.findOneAndUpdate(
      { email },
      {
        $set: {
          userId: user._id,
          otpHash,
          attempts: 0,
          lastSentAt: now,
          expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
          verifiedAt: null,
          resetTokenHash: null,
          resetExpiresAt: null,
        },
      },
      {
        upsert: true,
        runValidators: true,
      },
    );

    const transporter = createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const safeName = escapeHtml(user.name || "Pengguna");
    const safeOtp = escapeHtml(otp);

    try {
      const info = await transporter.sendMail({
        from: {
          name: "Kopilogi Kita",
          address: smtpUser,
        },
        to: user.email,
        subject: "Kode Verifikasi Password Kopilogi Kita",
        text: [
          `Halo ${user.name || "Pengguna"},`,
          "",
          `Kode verifikasi pemulihan password kamu: ${otp}`,
          "",
          "Kode berlaku selama 5 menit dan hanya dapat digunakan sekali.",
          "Jika kamu tidak meminta pemulihan password, abaikan email ini.",
          "",
          "Kopilogi Kita",
        ].join("\n"),
        html: `
          <!DOCTYPE html>
          <html lang="id">
            <body style="margin:0;padding:24px;background:#f5f2ec;font-family:Arial,sans-serif;color:#211b16">
              <div style="max-width:520px;margin:0 auto;padding:32px;background:#ffffff;border-radius:16px">
                <h2 style="margin-top:0">Pemulihan Password</h2>

                <p>Halo ${safeName},</p>

                <p>
                  Gunakan kode berikut untuk memverifikasi akun internal
                  Anda di Kopilogi Kita:
                </p>

                <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:20px;background:#faf8f4;border-radius:12px;text-align:center">
                  ${safeOtp}
                </div>

                <p>
                  Kode berlaku selama <strong>5 menit</strong> dan hanya
                  dapat digunakan sekali.
                </p>

                <p>
                  Jika kamu tidak meminta pemulihan password,
                  abaikan email ini.
                </p>

                <p style="margin-bottom:0">Kopilogi Kita</p>
              </div>
            </body>
          </html>
        `,
      });

      console.info("Email OTP berhasil dikirim:", {
        email: user.email,
        messageId: info.messageId,
      });
    } catch (error) {
      console.error("Gmail SMTP gagal mengirim email OTP:", error);

      // Hapus OTP yang gagal dikirim agar tidak memblokir permintaan ulang.
      await PasswordReset.deleteOne({ email }).catch((deleteError) => {
        console.error(
          "Gagal membersihkan data OTP setelah pengiriman gagal:",
          deleteError,
        );
      });

      return NextResponse.json(
        {
          message:
            "Email belum dapat dikirim. Silakan coba kembali nanti.",
        },
        { status: 502 },
      );
    } finally {
      transporter.close();
    }

    return NextResponse.json({ message: genericMessage });
  } catch (error) {
    console.error("Permintaan pemulihan password gagal:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan. Silakan coba kembali nanti." },
      { status: 500 },
    );
  }
}