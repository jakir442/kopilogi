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

type UpdateBranchSettingsInput = BranchSettingsInput & {
  slug: string;
};

export async function updateBranchSettings(
  input: UpdateBranchSettingsInput,
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

    const access = await getAdminBranchAccess(input.slug);

    if (!access.branch) {
      return {
        success: false,
        message: "Data cabang tidak ditemukan.",
      };
    }

    // [DEBUG] input mentah dari form, sebelum Zod
    console.log(
      "[SETTINGS] input mentah weeklyOpeningHours:",
      JSON.stringify(
        (input as { weeklyOpeningHours?: unknown }).weeklyOpeningHours,
      ),
    );

    const validation = branchSettingsSchema.safeParse(input);

    if (!validation.success) {
      console.log(
        "[SETTINGS] validasi Zod GAGAL:",
        JSON.stringify(validation.error.flatten().fieldErrors),
      );
      return {
        success: false,
        message: "Data pengaturan cabang tidak valid.",
        errors: validation.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const {
      phone,
      googleMapsUrl,
      weeklyOpeningHours,
      partnerships,
    } = validation.data;

    // [DEBUG] setelah Zod
    console.log(
      "[SETTINGS] weeklyOpeningHours setelah Zod:",
      JSON.stringify(weeklyOpeningHours),
    );
    console.log(
      "[SETTINGS] schema Mongoose punya field ini?:",
      Boolean(Branch.schema.path("weeklyOpeningHours")),
    );

    await connectToDatabase();

    const updatedBranch = await Branch.findByIdAndUpdate(
      access.branch._id,
      {
        $set: {
          phone: phone || null,
          googleMapsUrl: googleMapsUrl || null,
          weeklyOpeningHours,
          partnerships,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select(
        "_id name slug address phone googleMapsUrl weeklyOpeningHours partnerships",
      )
      .lean()
      .exec();

    if (!updatedBranch) {
      return {
        success: false,
        message: "Cabang tidak ditemukan atau gagal diperbarui.",
      };
    }

    // [DEBUG] hasil yang benar-benar tersimpan di DB
    console.log(
      "[SETTINGS] hasil tersimpan di DB:",
      JSON.stringify(
        (updatedBranch as { weeklyOpeningHours?: unknown }).weeklyOpeningHours,
      ),
    );
    console.log("[SETTINGS] _id yang diupdate:", String(updatedBranch._id));

    revalidatePath(`/admin/${input.slug}`);
    revalidatePath(`/admin/${input.slug}/settings`);

    return {
      success: true,
      message: "Pengaturan cabang berhasil diperbarui.",
    };
  } catch (error: unknown) {
    console.error("updateBranchSettings error:", error);

    return {
      success: false,
      message: "Gagal memperbarui pengaturan cabang. Silakan coba lagi.",
    };
  }
}