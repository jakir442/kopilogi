
"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { Branch } from "@/features/branches/models/branch.model";
import { getAdminBranchAccess } from "@/lib/auth/branch-access";
import { connectToDatabase } from "@/lib/mongodb";

import {
  branchSettingsSchema,
  type BranchSettingsInput,
} from "../schemas/branch-settings.schema";

export type BranchSettingsResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function updateBranchSettings(
  input: BranchSettingsInput,
): Promise<BranchSettingsResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "Anda harus login terlebih dahulu.",
      };
    }

    if (
      session.user.role !== "admin" &&
      session.user.role !== "super_admin"
    ) {
      return {
        success: false,
        message: "Anda tidak memiliki akses.",
      };
    }

    const validation = branchSettingsSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        message: "Data pengaturan cabang tidak valid.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const {
      slug,
      name,
      address,
      phone,
      googleMapsUrl,
      openingHours,
    } = validation.data;

    const access = await getAdminBranchAccess(slug);

    if (!access.branch) {
      return {
        success: false,
        message: "Data cabang tidak ditemukan.",
      };
    }

    await connectToDatabase();

    const updatedBranch = await Branch.findByIdAndUpdate(
      access.branch._id,
      {
        $set: {
          name,
          address,
          phone: phone || null,
          googleMapsUrl: googleMapsUrl || null,
          openingHours: openingHours || null,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("_id name slug address phone googleMapsUrl openingHours")
      .lean()
      .exec();

    if (!updatedBranch) {
      return {
        success: false,
        message: "Cabang tidak ditemukan atau gagal diperbarui.",
      };
    }

    revalidatePath(`/admin/${slug}`);
    revalidatePath(`/admin/${slug}/settings`);

    return {
      success: true,
      message: "Informasi cabang berhasil diperbarui.",
    };
  } catch (error: unknown) {
    console.error("updateBranchSettings error:", error);

    return {
      success: false,
      message: "Gagal memperbarui informasi cabang. Silakan coba lagi.",
    };
  }
}
