
"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminBranchAccess } from "@/lib/auth/branch-access";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/features/users/models/user.model";

async function verifySuperAdmin() {
  const session = await requireAdmin();
  const access = await getAdminBranchAccess();

  if (session.user.role !== "super_admin" || !access.isSuperAdmin) {
    throw new Error("Akses hanya untuk Super Admin.");
  }

  if (!session.user.id) {
    throw new Error("Sesi pengguna tidak valid.");
  }

  return session.user.id;
}

export async function updateSuperAdminProfile(name: string) {
  try {
    const userId = await verifySuperAdmin();

    const cleanName = name.trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return {
        success: false,
        message: "Nama harus terdiri dari 2–100 karakter.",
      };
    }

    await connectToDatabase();

    await User.updateOne(
      { _id: userId, role: "super_admin" },
      { $set: { name: cleanName } },
    );

    revalidatePath("/admin/super-admin");
    revalidatePath("/admin/super-admin/settings");

    return {
      success: true,
      message: "Profil berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui profil.",
    };
  }
}

export async function updateSuperAdminPassword(
  oldPassword: string,
  newPassword: string,
) {
  try {
    const userId = await verifySuperAdmin();

    if (!oldPassword || newPassword.length < 8) {
      return {
        success: false,
        message: "Password baru minimal 8 karakter.",
      };
    }

    await connectToDatabase();

    const user = await User.findOne({
      _id: userId,
      role: "super_admin",
    }).select("+password");

    if (!user) {
      return {
        success: false,
        message: "Akun Super Admin tidak ditemukan.",
      };
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);

    if (!isValid) {
      return {
        success: false,
        message: "Password lama yang kamu masukkan salah.",
      };
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return {
      success: true,
      message: "Password berhasil diperbarui.",
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui password.",
    };
  }
}
