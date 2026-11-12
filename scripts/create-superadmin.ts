import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { User } from "../src/features/users/models/user.model";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
const SUPERADMIN_NAME = process.env.SUPERADMIN_NAME;
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL;
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI belum dikonfigurasi di .env.local");
}

if (!SUPERADMIN_NAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
  throw new Error(
    "SUPERADMIN_NAME, SUPERADMIN_EMAIL, dan SUPERADMIN_PASSWORD wajib dikonfigurasi di .env.local",
  );
}

// Setelah validasi, TypeScript mengetahui semuanya sebagai string.
const MONGODB_URI_VALUE: string = MONGODB_URI;
const SUPERADMIN_NAME_VALUE: string = SUPERADMIN_NAME;
const SUPERADMIN_EMAIL_VALUE: string = SUPERADMIN_EMAIL;
const SUPERADMIN_PASSWORD_VALUE: string = SUPERADMIN_PASSWORD;

async function createSuperAdmin() {
  try {
    await mongoose.connect(MONGODB_URI_VALUE);

    console.log("Terhubung ke MongoDB.");

    const name = SUPERADMIN_NAME_VALUE.trim();
    const email = SUPERADMIN_EMAIL_VALUE.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === "super_admin") {
        console.log(`Super admin dengan email ${email} sudah tersedia.`);
        return;
      }

      throw new Error(
        `Email ${email} sudah digunakan oleh user dengan role "${existingUser.role}". ` +
          "Gunakan email lain untuk membuat super admin.",
      );
    }

    const hashedPassword = await bcrypt.hash(
      SUPERADMIN_PASSWORD_VALUE,
      12,
    );

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "super_admin",
      branchId: null,
    });

    console.log("");
    console.log("========================================");
    console.log("SUPER ADMIN BERHASIL DIBUAT");
    console.log("========================================");
    console.log(`Nama  : ${name}`);
    console.log(`Email : ${email}`);
    console.log("Role  : super_admin");
    console.log("Password disimpan dalam bentuk hash.");
    console.log("========================================");
  } catch (error) {
    console.error("");
    console.error("Gagal membuat super admin:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createSuperAdmin();