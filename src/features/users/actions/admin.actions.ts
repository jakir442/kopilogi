"use server";

import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { Branch } from "@/features/branches/models/branch.model";
import { User } from "@/features/users/models/user.model";
import { connectToDatabase } from "@/lib/mongodb";

import {
  createAdminSchema,
  updateAdminSchema,
  deleteAdminSchema,
  type CreateAdminInput,
  type UpdateAdminInput,
  type DeleteAdminInput,
} from "../schemas/admin.schema";

export type CreateAdminResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createAdmin(input: CreateAdminInput): Promise<CreateAdminResult> {
  try {
    // ==========================================
    // 1. AUTHORIZATION
    // ==========================================

    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "Anda harus login terlebih dahulu.",
      };
    }

    if (session.user.role !== "super_admin") {
      return {
        success: false,
        message: "Anda tidak memiliki akses untuk membuat administrator.",
      };
    }

    // ==========================================
    // 2. VALIDATION
    // ==========================================

    const validation = createAdminSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        message: "Data administrator tidak valid.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const { name, email, password, branchId } = validation.data;

    // ==========================================
    // 3. DATABASE CONNECTION
    // ==========================================

    await connectToDatabase();

    // ==========================================
    // 4. VALIDATE BRANCH ID
    // ==========================================

    if (!Types.ObjectId.isValid(branchId)) {
      return {
        success: false,
        message: "ID cabang tidak valid.",
      };
    }

    // ==========================================
    // 5. CHECK BRANCH
    // ==========================================

    const branch = await Branch.findById(branchId).select("_id name slug isActive").lean().exec();

    if (!branch) {
      return {
        success: false,
        message: "Cabang tidak ditemukan.",
      };
    }

    if (!branch.isActive) {
      return {
        success: false,
        message: "Cabang belum aktif. Aktivasi harus dilakukan terlebih dahulu oleh developer.",
      };
    }

    // ==========================================
    // 6. CHECK DUPLICATE EMAIL
    // ==========================================

    const existingUser = await User.findOne({
      email,
    })
      .select("_id")
      .lean()
      .exec();

    if (existingUser) {
      return {
        success: false,
        message: "Email tersebut sudah digunakan.",
      };
    }

    // ==========================================
    // 7. HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(password, 12);

    // ==========================================
    // 8. CREATE ADMIN
    // ==========================================

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      branchId: branch._id,
    });

    // ==========================================
    // 9. REVALIDATE SUPER ADMIN PAGE
    // ==========================================

    revalidatePath("/admin/super-admin");

    return {
      success: true,
      message: `Administrator untuk ${branch.name} berhasil dibuat.`,
    };
  } catch (error: unknown) {
    console.error("createAdmin error:", error);

    // Handle duplicate email race condition
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return {
        success: false,
        message: "Email tersebut sudah digunakan.",
      };
    }

    return {
      success: false,
      message: "Gagal membuat administrator. Silakan coba lagi.",
    };
  }
}

export async function updateAdmin(input: UpdateAdminInput): Promise<CreateAdminResult> {
  try {
    // 1. Authorization
    const session = await auth();

    if (!session?.user || session.user.role !== "super_admin") {
      return {
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah administrator.",
      };
    }

    // 2. Validation
    const validation = updateAdminSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        message: "Data administrator tidak valid.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const { id, name, email, branchId } = validation.data;

    await connectToDatabase();

    // 3. Validate IDs
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(branchId)) {
      return {
        success: false,
        message: "ID administrator atau cabang tidak valid.",
      };
    }

    // 4. Ensure target is an admin, never a super_admin
    const admin = await User.findById(id).select("_id role").exec();

    if (!admin || admin.role !== "admin") {
      return {
        success: false,
        message: "Administrator tidak ditemukan.",
      };
    }

    // 5. Ensure the selected branch is active
    const branch = await Branch.findById(branchId).select("_id name slug isActive").lean().exec();

    if (!branch) {
      return {
        success: false,
        message: "Cabang tidak ditemukan.",
      };
    }

    if (!branch.isActive) {
      return {
        success: false,
        message: "Cabang belum aktif. Aktivasi harus dilakukan terlebih dahulu oleh developer.",
      };
    }

    // 6. Ensure email is unique, excluding the current admin
    const existingUser = await User.findOne({
      email,
      _id: { $ne: id },
    })
      .select("_id")
      .lean()
      .exec();

    if (existingUser) {
      return {
        success: false,
        message: "Email tersebut sudah digunakan oleh akun lain.",
      };
    }

    // 7. Update allowed fields only
    admin.set({
      name,
      email,
      branchId: branch._id,
    });

    await admin.save();

    revalidatePath("/admin/super-admin");

    return {
      success: true,
      message: `Data administrator berhasil diperbarui.`,
    };
  } catch (error: unknown) {
    console.error("updateAdmin error:", error);

    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return {
        success: false,
        message: "Email tersebut sudah digunakan oleh akun lain.",
      };
    }

    return {
      success: false,
      message: "Gagal memperbarui administrator. Silakan coba lagi.",
    };
  }
}

export async function deleteAdmin(input: DeleteAdminInput): Promise<CreateAdminResult> {
  try {
    // 1. Authorization
    const session = await auth();

    if (!session?.user || session.user.role !== "super_admin") {
      return {
        success: false,
        message: "Anda tidak memiliki akses untuk menghapus administrator.",
      };
    }

    // 2. Validation
    const validation = deleteAdminSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        message: "ID administrator tidak valid.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const { id } = validation.data;

    if (!Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "ID administrator tidak valid.",
      };
    }

    await connectToDatabase();

    // 3. Only delete accounts with role "admin"
    const admin = await User.findOne({
      _id: id,
      role: "admin",
    })
      .select("_id name email")
      .exec();

    if (!admin) {
      return {
        success: false,
        message: "Administrator tidak ditemukan atau sudah dihapus.",
      };
    }

    // 4. Delete account
    await User.deleteOne({
      _id: admin._id,
      role: "admin",
    }).exec();

    revalidatePath("/admin/super-admin");

    return {
      success: true,
      message: `Administrator ${admin.name} berhasil dihapus.`,
    };
  } catch (error: unknown) {
    console.error("deleteAdmin error:", error);

    return {
      success: false,
      message: "Gagal menghapus administrator. Silakan coba lagi.",
    };
  }
}
