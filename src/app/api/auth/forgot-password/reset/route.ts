import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/models/user.model";
import { PasswordReset } from "@/features/users/models/password-reset.model";

export const runtime = "nodejs";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const resetToken = typeof body?.resetToken === "string" ? body.resetToken : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const confirmPassword = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[a-f0-9]{64}$/i.test(resetToken)) {
      return NextResponse.json(
        { message: "Sesi reset tidak valid. Silakan mulai kembali." },
        { status: 400 },
      );
    }

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return NextResponse.json(
        { message: "Password harus minimal 8 karakter dan maksimal 72 byte." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Konfirmasi password tidak cocok." }, { status: 400 });
    }

    await connectToDatabase();

    const now = new Date();
    const tokenHash = hashToken(resetToken);

    const record = await PasswordReset.findOne({
      email,
      verifiedAt: { $ne: null },
      resetExpiresAt: { $gt: now },
    }).select("+resetTokenHash");

    if (!record || !record.resetTokenHash || record.resetTokenHash !== tokenHash) {
      return NextResponse.json(
        { message: "Sesi reset tidak valid atau sudah kedaluwarsa." },
        { status: 400 },
      );
    }

    // Konsumsi token secara atomik sebelum mengubah password.
    // Hanya satu permintaan yang dapat berhasil menggunakan token ini.
    const consumed = await PasswordReset.deleteOne({
      _id: record._id,
      email,
      verifiedAt: { $ne: null },
      resetTokenHash: tokenHash,
      resetExpiresAt: { $gt: now },
    });

    if (consumed.deletedCount !== 1) {
      return NextResponse.json(
        { message: "Sesi reset sudah digunakan atau kedaluwarsa." },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      _id: record.userId,
      email,
      role: { $in: ["admin", "super_admin"] },
    }).select("_id");

    if (!user) {
      return NextResponse.json({ message: "Akun tidak dapat dipulihkan." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const updateResult = await User.updateOne(
      {
        _id: user._id,
        email,
        role: { $in: ["admin", "super_admin"] },
      },
      { $set: { password: passwordHash } },
    );

    if (updateResult.matchedCount !== 1) {
      return NextResponse.json(
        { message: "Akun tidak ditemukan atau tidak dapat diperbarui." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "Password berhasil diperbarui. Silakan login kembali.",
    });
  } catch (error) {
    console.error("Reset password gagal.", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan. Silakan coba kembali nanti." },
      { status: 500 },
    );
  }
}
