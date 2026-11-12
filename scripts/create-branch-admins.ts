import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Branch } from "../src/features/branches/models/branch.model";
import { User } from "../src/features/users/models/user.model";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI belum dikonfigurasi di .env.local");
}

const MONGODB_URI_VALUE: string = MONGODB_URI;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD belum dikonfigurasi di .env.local");
}

const ADMIN_PASSWORD_VALUE: string = ADMIN_PASSWORD;

const branchAdmins = [
  {
    name: "Admin Kopilogi Cabang 1",
    email: "admin.cabang1@kopilogi.com",
    slug: "cabang-1",
  },
  {
    name: "Admin Kopilogi Cabang 2",
    email: "admin.cabang2@kopilogi.com",
    slug: "cabang-2",
  },
  {
    name: "Admin Kopilogi Cabang 3",
    email: "admin.cabang3@kopilogi.com",
    slug: "cabang-3",
  },
];

async function createBranchAdmins() {
  try {
    await mongoose.connect(MONGODB_URI_VALUE);

    console.log("Terhubung ke MongoDB.");

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD_VALUE, 12);

    for (const admin of branchAdmins) {
      const branch = await Branch.findOne({
        slug: admin.slug,
      });

      if (!branch) {
        console.log(`Branch ${admin.slug} tidak ditemukan.`);
        continue;
      }

      const existingUser = await User.findOne({
        email: admin.email,
      });

      if (existingUser) {
        console.log(`Admin ${admin.email} sudah tersedia.`);
        continue;
      }

      await User.create({
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: "admin",
        branchId: branch._id,
      });

      console.log(`Admin ${admin.email} berhasil dibuat untuk ${branch.name}.`);
    }

    console.log("Proses pembuatan admin cabang selesai.");
  } catch (error) {
    console.error("Gagal membuat admin cabang:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createBranchAdmins();
