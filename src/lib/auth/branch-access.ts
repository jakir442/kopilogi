import { Types } from "mongoose";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Branch } from "@/features/branches/models/branch.model";
import { User } from "@/features/users/models/user.model";
import type { BranchConcept, BranchDocument } from "@/features/branches/types";
import type { AppRole } from "./authorization";

export type AdminBranchAccess = {
  role: AppRole;
  isSuperAdmin: boolean;
  branch: BranchDocument | null;
  concept: BranchConcept | null;
};

export async function getAdminBranchAccess(requestedSlug?: string): Promise<AdminBranchAccess> {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const role = session.user.role;

  /**
   * ============================================================
   * SUPER ADMIN
   * ============================================================
   *
   * Super Admin tidak memiliki branchId.
   *
   * Jika requestedSlug diberikan, ambil cabang berdasarkan slug.
   * Ini memungkinkan Super Admin membuka:
   *
   * /admin/cabang-1
   * /admin/cabang-2
   * /admin/cabang-3
   *
   * Tanpa harus memiliki branchId pada user.
   */
  if (role === "super_admin") {
    if (!requestedSlug) {
      return {
        role,
        isSuperAdmin: true,
        branch: null,
        concept: null,
      };
    }

    const branch = await Branch.findOne({
      slug: requestedSlug,
    })
      .lean()
      .exec();

    if (!branch) {
      throw new Error("Cabang tidak ditemukan.");
    }

    return {
      role,
      isSuperAdmin: true,
      branch: {
        _id: branch._id.toString(),
        name: branch.name,
        slug: branch.slug,
        concept: branch.concept,
        address: branch.address,
        phone: branch.phone ?? undefined,
        googleMapsUrl: branch.googleMapsUrl ?? undefined,
        openingHours: branch.openingHours ?? undefined,
        image: branch.image ?? undefined,
        isActive: branch.isActive,
        createdAt: new Date(branch.createdAt),
        updatedAt: new Date(branch.updatedAt),
      },
      concept: branch.concept,
    };
  }

  /**
   * ============================================================
   * ADMIN CABANG
   * ============================================================
   */
  if (role !== "admin") {
    throw new Error("Akses admin tidak valid.");
  }

  if (!session.user.id || !Types.ObjectId.isValid(session.user.id)) {
    throw new Error("User ID tidak valid.");
  }

  const user = await User.findById(session.user.id).select("role branchId").lean().exec();

  if (!user) {
    throw new Error("Data user tidak ditemukan.");
  }

  if (user.role !== "admin") {
    throw new Error("User bukan admin cabang.");
  }

  if (!user.branchId) {
    throw new Error("Admin belum memiliki cabang.");
  }

  const branchId = user.branchId.toString();

  if (!Types.ObjectId.isValid(branchId)) {
    throw new Error("Branch ID tidak valid.");
  }

  const branch = await Branch.findOne({
    _id: branchId,
    isActive: true,
  })
    .lean()
    .exec();

  if (!branch) {
    throw new Error("Cabang tidak ditemukan atau tidak aktif.");
  }

  /**
   * Admin biasa hanya boleh menggunakan cabangnya sendiri.
   *
   * Kalau requestedSlug dikirim, pastikan slug tersebut
   * benar-benar sama dengan cabang milik admin.
   */
  if (requestedSlug && branch.slug !== requestedSlug) {
    throw new Error("Anda tidak memiliki akses ke cabang ini.");
  }

  return {
    role,
    isSuperAdmin: false,
    branch: {
      _id: branch._id.toString(),
      name: branch.name,
      slug: branch.slug,
      concept: branch.concept,
      address: branch.address,
      phone: branch.phone ?? undefined,
      googleMapsUrl: branch.googleMapsUrl ?? undefined,
      openingHours: branch.openingHours ?? undefined,
      image: branch.image ?? undefined,
      isActive: branch.isActive,
      createdAt: new Date(branch.createdAt),
      updatedAt: new Date(branch.updatedAt),
    },
    concept: branch.concept,
  };
}
