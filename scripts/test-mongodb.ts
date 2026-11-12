import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI tidak ditemukan.");
}

const MONGODB_URI_VALUE: string = MONGODB_URI;

async function testMongoDB() {
  try {
    console.log("Mencoba koneksi ke MongoDB Atlas...");
    console.log(
      "Host:",
      MONGODB_URI_VALUE.match(/@([^/?]+)/)?.[1] ?? "Tidak ditemukan",
    );

    await mongoose.connect(MONGODB_URI_VALUE, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Atlas BERHASIL terhubung.");
  } catch (error) {
    console.error("MongoDB Atlas GAGAL terhubung.");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

testMongoDB();