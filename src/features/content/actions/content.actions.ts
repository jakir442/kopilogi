"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Branch } from "@/features/branches/models/branch.model";
import { User } from "@/features/users/models/user.model";
import { connectToDatabase } from "@/lib/mongodb";
import { createContentSchema, updateContentSchema, deleteContentSchema } from "../schemas/content.schema";
import {
  findContentsByBranch,
  findContentBySlug,
  insertContent,
  updateContent as updateContentRepository,
  removeContent,
} from "../repositories/content.repository";
import type { BranchContent } from "../types";

export type ContentActionResult = {
  success: boolean;
  message: string;
  data?: BranchContent[];
  errors?: Record<string, string[]>;
};

async function resolveAuthorizedBranch(requestedBranchId?: string) {
  const session = await auth();
  if (!session?.user) return { success: false as const, message: "Sesi login tidak ditemukan." };

  await connectToDatabase();
  let branchId = "";

  if (session.user.role === "admin") {
    if (!session.user.id || !Types.ObjectId.isValid(session.user.id)) {
      return { success: false as const, message: "Identitas admin tidak valid." };
    }
    const user = await User.findById(session.user.id).select("role branchId").lean();
    if (!user || user.role !== "admin" || !user.branchId) {
      return { success: false as const, message: "Akun admin belum memiliki akses cabang." };
    }
    branchId = String(user.branchId);
  } else if (session.user.role === "super_admin") {
    if (!requestedBranchId || !Types.ObjectId.isValid(requestedBranchId)) {
      return { success: false as const, message: "Cabang tujuan tidak valid." };
    }
    branchId = requestedBranchId;
  } else {
    return { success: false as const, message: "Kamu tidak memiliki akses mengelola konten." };
  }

  const branch = await Branch.findOne({ _id: branchId, isActive: true }).select("_id slug name isActive").lean();
  if (!branch) return { success: false as const, message: "Cabang tidak ditemukan atau tidak aktif." };

  return { success: true as const, branchId: String(branch._id), branchSlug: branch.slug };
}

function slugify(value: string) {
  return value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "konten";
}

function revalidateContentPaths(branchSlug: string) {
  revalidatePath(`/admin/${branchSlug}`);
  revalidatePath(`/${branchSlug}`);
}

function serializeContent(items: unknown[]): BranchContent[] {
  return JSON.parse(JSON.stringify(items)) as BranchContent[];
}

export async function getBranchContentsAction(requestedBranchId?: string): Promise<ContentActionResult> {
  try {
    const access = await resolveAuthorizedBranch(requestedBranchId);
    if (!access.success) return { success: false, message: access.message, data: [] };
    const items = await findContentsByBranch(access.branchId);
    return { success: true, message: "Konten berhasil dimuat.", data: serializeContent(items) };
  } catch (error) {
    console.error("[getBranchContentsAction]", error);
    return { success: false, message: "Gagal memuat konten website.", data: [] };
  }
}

export async function createBranchContentAction(input: unknown): Promise<ContentActionResult> {
  try {
    const validation = createContentSchema.safeParse(input);
    if (!validation.success) return { success: false, message: "Periksa kembali data konten.", errors: validation.error.flatten().fieldErrors };

    const access = await resolveAuthorizedBranch(validation.data.branchId);
    if (!access.success) return { success: false, message: access.message };

    const slug = slugify(validation.data.title);
    if (await findContentBySlug(access.branchId, slug)) {
      return { success: false, message: "Judul tersebut sudah digunakan. Coba judul yang berbeda." };
    }

    await insertContent({ ...validation.data, branchId: access.branchId, slug });
    revalidateContentPaths(access.branchSlug);
    return { success: true, message: "Konten berhasil ditambahkan." };
  } catch (error) {
    console.error("[createBranchContentAction]", error);
    return { success: false, message: "Gagal menambahkan konten." };
  }
}

export async function updateBranchContentAction(input: unknown): Promise<ContentActionResult> {
  try {
    const validation = updateContentSchema.safeParse(input);
    if (!validation.success) return { success: false, message: "Periksa kembali data konten.", errors: validation.error.flatten().fieldErrors };

    const access = await resolveAuthorizedBranch(validation.data.branchId);
    if (!access.success) return { success: false, message: access.message };

    if (!Types.ObjectId.isValid(validation.data.id)) return { success: false, message: "ID konten tidak valid." };
    const slug = slugify(validation.data.title);
    if (await findContentBySlug(access.branchId, slug, validation.data.id)) {
      return { success: false, message: "Judul tersebut sudah digunakan oleh konten lain." };
    }

    const { id, ...data } = validation.data;
    const updated = await updateContentRepository(id, access.branchId, { ...data, branchId: access.branchId, slug });
    if (!updated) return { success: false, message: "Konten tidak ditemukan pada cabang ini." };

    revalidateContentPaths(access.branchSlug);
    return { success: true, message: "Konten berhasil diperbarui." };
  } catch (error) {
    console.error("[updateBranchContentAction]", error);
    return { success: false, message: "Gagal memperbarui konten." };
  }
}

export async function deleteBranchContentAction(input: unknown): Promise<ContentActionResult> {
  try {
    const validation = deleteContentSchema.safeParse(input);
    if (!validation.success) return { success: false, message: "Data penghapusan tidak valid." };
    const access = await resolveAuthorizedBranch(validation.data.branchId);
    if (!access.success) return { success: false, message: access.message };
    if (!Types.ObjectId.isValid(validation.data.id)) return { success: false, message: "ID konten tidak valid." };

    const deleted = await removeContent(validation.data.id, access.branchId);
    if (!deleted) return { success: false, message: "Konten tidak ditemukan pada cabang ini." };
    revalidateContentPaths(access.branchSlug);
    return { success: true, message: "Konten berhasil dihapus." };
  } catch (error) {
    console.error("[deleteBranchContentAction]", error);
    return { success: false, message: "Gagal menghapus konten." };
  }
}
