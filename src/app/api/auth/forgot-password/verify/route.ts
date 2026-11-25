import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/models/user.model";
import { PasswordReset } from "@/features/users/models/password-reset.model";

export const runtime = "nodejs";

function hashOtp(email: string, otp: string, secret: string) {
  return createHmac("sha256", secret).update(`${email}:${otp}`).digest("hex");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");

  return left.length === right.length && left.length > 0 && timingSafeEqual(left, right);
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");

  if (!local || !domain) return "Email tersamarkan";

  const visible = local.length > 1 ? local.slice(0, 1) : "";
  return `${visible}${"*".repeat(Math.max(3, local.length - 1))}@${domain}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const otp = typeof body?.otp === "string" ? body.otp.trim() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "Kode verifikasi tidak valid atau sudah kedaluwarsa." },
        { status: 400 },
      );
    }

    const secret = process.env.PASSWORD_RESET_SECRET;

    if (!secret) {
      return NextResponse.json(
        { message: "Layanan pemulihan password belum tersedia." },
        { status: 500 },
      );
    }

    await connectToDatabase();

    const now = new Date();

    const record = await PasswordReset.findOne({
      email,
      expiresAt: { $gt: now },
      verifiedAt: null,
      attempts: { $lt: 5 },
    }).select("+otpHash");

    if (!record) {
      return NextResponse.json(
        { message: "Kode verifikasi tidak valid atau sudah kedaluwarsa." },
        { status: 400 },
      );
    }

    // Hitung setiap percobaan agar OTP tidak bisa ditebak tanpa batas.
    await PasswordReset.updateOne(
      { _id: record._id, attempts: { $lt: 5 } },
      { $inc: { attempts: 1 } },
    );

    const expectedHash = hashOtp(email, otp, secret);

    if (!safeEqual(record.otpHash, expectedHash)) {
      return NextResponse.json(
        { message: "Kode verifikasi tidak valid atau sudah kedaluwarsa." },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      _id: record.userId,
      email,
      role: { $in: ["admin", "super_admin"] },
    }).select("_id name email role branchId");

    if (!user) {
      await PasswordReset.deleteOne({ _id: record._id });

      return NextResponse.json({ message: "Akun tidak dapat dipulihkan." }, { status: 400 });
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenHash = hashToken(resetToken);
    const verifiedAt = new Date();
    const resetExpiresAt = new Date(verifiedAt.getTime() + 10 * 60_000);

    // Kondisi verifiedAt:null mencegah OTP yang sama dipakai kembali.
    const updated = await PasswordReset.updateOne(
      {
        _id: record._id,
        verifiedAt: null,
        expiresAt: { $gt: verifiedAt },
        attempts: { $lte: 5 },
      },
      {
        $set: {
          verifiedAt,
          resetTokenHash,
          resetExpiresAt,
        },
      },
    );

    if (updated.modifiedCount !== 1) {
      return NextResponse.json(
        { message: "Kode verifikasi tidak valid atau sudah kedaluwarsa." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "Email berhasil diverifikasi.",
      resetToken,
      account: {
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error("Verifikasi OTP gagal.", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan. Silakan coba kembali nanti." },
      { status: 500 },
    );
  }
}
