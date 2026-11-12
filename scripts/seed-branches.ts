import dotenv from "dotenv";
import mongoose from "mongoose";

import { Branch } from "../src/features/branches/models/branch.model";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI belum dikonfigurasi di .env.local");
}

const MONGODB_URI_VALUE: string = MONGODB_URI;

const branches = [
  {
    name: "KOPILOGI",
    slug: "cabang-1",
    concept: "modern-futuristic",
    address: "Jl. Cikuray No.42, Regol, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44114",
    isActive: true,
  },
  {
    name: "Waroeng kopilogi",
    slug: "cabang-2",
    concept: "traditional-heritage",
    address: "Jl. Guntur No.14, Paminggir, Kec. Garut Kota, Kabupaten Garut, Jawa Barat 44118",
    isActive: true,
  },
  {
    name: "Kopilogi Hallway",
    slug: "cabang-3",
    concept: "contemporary-cozy",
    address: "Jl. Pembangunan, Sukagalih, Kec. Tarogong Kidul, Kabupaten Garut, Jawa Barat 44151",
    isActive: false,
  },
  {
    name: "Kopilogi Tasik",
    slug: "cabang-4",
    concept: "contemporary-cozy",
    address: "Jl. Dr. Sukarjo, Tawangsari, Kec. Tawang, Kab. Tasikmalaya, Jawa Barat 46112",
    isActive: true,
  },
] as const;

async function seedBranches() {
  try {
    await mongoose.connect(MONGODB_URI_VALUE);

    console.log("Terhubung ke MongoDB.");

    for (const branch of branches) {
      const result = await Branch.findOneAndUpdate(
        { slug: branch.slug },
        { $set: branch },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        },
      ).exec();

      if (!result) {
        throw new Error(`Gagal menyimpan cabang dengan slug ${branch.slug}.`);
      }

      console.log(
        `${result.name} berhasil disimpan | ` +
          `Konsep: ${result.concept} | ` +
          `Status: ${result.isActive ? "Aktif" : "Tutup permanen"}`,
      );
    }

    console.log("Seed 4 cabang Kopilogi selesai.");
  } catch (error) {
    console.error("Gagal melakukan seed branch:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedBranches();
