"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { Branch } from "@/features/branches/models/branch.model";
import { connectToDatabase } from "@/lib/mongodb";

import {
  createMenuSchema,
  updateMenuSchema,
  deleteMenuSchema,
  type CreateMenuInput,
  type UpdateMenuInput,
  type DeleteMenuInput,
} from "../schemas/menu.schema";

import type { MenuDocument } from "../types";

import {
  createMenu as createMenuRepository,
  deleteMenuByIdAndBranch,
  findMenuByIdAndBranch,
  findMenuBySlug,
  findMenusByBranch,
  updateMenuByIdAndBranch,
} from "../repositories/menu.repository";

export type MenuActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export type GetMenusResult = {
  success: boolean;
  message: string;
  data?: MenuDocument[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Memastikan branch valid dan aktif.
 *
 * Semua operasi CRUD menu harus melewati pengecekan ini.
 */
async function ensureActiveBranch(branchId: string) {
  if (!Types.ObjectId.isValid(branchId)) {
    return {
      success: false as const,
      message: "ID cabang tidak valid.",
    };
  }

  const branch = await Branch.findById(branchId)
    .select("_id name slug isActive")
    .lean();

  if (!branch) {
    return {
      success: false as const,
      message: "Cabang tidak ditemukan.",
    };
  }

  if (!branch.isActive) {
    return {
      success: false as const,
      message:
        "Cabang belum aktif. Aktivasi cabang diperlukan sebelum menu dapat dikelola.",
    };
  }

  return {
    success: true as const,
    branch,
  };
}

/**
 * Menentukan branchId berdasarkan role.
 *
 * Admin:
 * - SELALU menggunakan branchId dari session.
 * - branchId dari client diabaikan.
 *
 * Super Admin:
 * - wajib menentukan branchId dari halaman cabang yang sedang dikelola.
 */
async function getAuthorizedBranchId(requestedBranchId?: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false as const,
      message: "Sesi login tidak ditemukan.",
    };
  }

  const role = session.user.role;

  if (role !== "admin" && role !== "super_admin") {
    return {
      success: false as const,
      message: "Kamu tidak memiliki akses untuk mengelola menu.",
    };
  }

  /**
   * Admin tidak boleh menentukan cabang dari client.
   * Selalu gunakan branchId yang berasal dari session.
   */
  if (role === "admin") {
    const sessionBranchId = session.user.branchId;

    if (!sessionBranchId) {
      return {
        success: false as const,
        message: "Akun admin belum memiliki cabang.",
      };
    }

    return {
      success: true as const,
      branchId: sessionBranchId,
      role,
    };
  }

  /**
   * Super Admin dapat memilih cabang yang ingin dikelola.
   */
  if (!requestedBranchId) {
    return {
      success: false as const,
      message: "Cabang tujuan wajib dipilih oleh Super Admin.",
    };
  }

  if (!Types.ObjectId.isValid(requestedBranchId)) {
    return {
      success: false as const,
      message: "ID cabang tidak valid.",
    };
  }

  return {
    success: true as const,
    branchId: requestedBranchId,
    role,
  };
}

/**
 * Revalidate halaman admin berdasarkan cabang.
 */
async function revalidateMenuPaths(branchId: string) {
  const branch = await Branch.findById(branchId)
    .select("slug")
    .lean();

  if (branch?.slug) {
    revalidatePath(`/admin/${branch.slug}/menu`);
    revalidatePath(`/admin/${branch.slug}`);
  }

  /**
   * Halaman publik menu.
   */
  revalidatePath("/menu");
}

/**
 * GET MENUS
 */
export async function getMenus(
  branchId?: string,
): Promise<GetMenusResult> {
  try {
    await connectToDatabase();

    const authorization = await getAuthorizedBranchId(branchId);

    if (!authorization.success) {
      return {
        success: false,
        message: authorization.message,
        data: [],
      };
    }

    const activeBranch = await ensureActiveBranch(
      authorization.branchId,
    );

    if (!activeBranch.success) {
      return {
        success: false,
        message: activeBranch.message,
        data: [],
      };
    }

    const menus = await findMenusByBranch(
      authorization.branchId,
    );

    /**
     * Mongoose document perlu diserialisasi agar aman
     * dikirim dari Server Action ke Client Component.
     */
    const data = JSON.parse(
      JSON.stringify(menus),
    ) as MenuDocument[];

    return {
      success: true,
      message: "Data menu berhasil dimuat.",
      data,
    };
  } catch (error) {
    console.error("[getMenus]", error);

    return {
      success: false,
      message: "Gagal memuat data menu.",
      data: [],
    };
  }
}

/**
 * CREATE MENU
 */
export async function createMenu(
  input: CreateMenuInput,
): Promise<MenuActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "Sesi login tidak ditemukan.",
      };
    }

    if (
      session.user.role !== "admin" &&
      session.user.role !== "super_admin"
    ) {
      return {
        success: false,
        message:
          "Kamu tidak memiliki akses untuk menambahkan menu.",
      };
    }

    const validation = createMenuSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        message: "Data menu tidak valid.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const {
      name,
      description,
      category,
      price,
      image,
      isAvailable,
      featured,
      priceVerified,
      branchId: requestedBranchId,
    } = validation.data;

    await connectToDatabase();

    const authorization = await getAuthorizedBranchId(
      requestedBranchId,
    );

    if (!authorization.success) {
      return {
        success: false,
        message: authorization.message,
      };
    }

    const activeBranch = await ensureActiveBranch(
      authorization.branchId,
    );

    if (!activeBranch.success) {
      return {
        success: false,
        message: activeBranch.message,
      };
    }

    const slug = slugify(name);

    const existingMenu = await findMenuBySlug(
      authorization.branchId,
      slug,
    );

    if (existingMenu) {
      return {
        success: false,
        message:
          "Menu dengan nama tersebut sudah tersedia di cabang ini.",
      };
    }

    await createMenuRepository({
      name,
      slug,
      description,
      category,
      price,
      image,
      isAvailable,
      featured,
      priceVerified,
      branchId: authorization.branchId,
    });

    await revalidateMenuPaths(authorization.branchId);

    return {
      success: true,
      message: "Menu berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("[createMenu]", error);

    return {
      success: false,
      message: "Gagal menambahkan menu.",
    };
  }
}

/**
 * UPDATE MENU
 */
export async function updateMenu(
  input: UpdateMenuInput,
): Promise<MenuActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "Sesi login tidak ditemukan.",
      };
    }

    if (
      session.user.role !== "admin" &&
      session.user.role !== "super_admin"
    ) {
      return {
        success: false,
        message:
          "Kamu tidak memiliki akses untuk memperbarui menu.",
      };
    }

    const validation = updateMenuSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        message: "Data menu tidak valid.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const {
      id,
      name,
      description,
      category,
      price,
      image,
      isAvailable,
      featured,
      priceVerified,
      branchId: requestedBranchId,
    } = validation.data;

    if (!Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "ID menu tidak valid.",
      };
    }

    await connectToDatabase();

    const authorization = await getAuthorizedBranchId(
      requestedBranchId,
    );

    if (!authorization.success) {
      return {
        success: false,
        message: authorization.message,
      };
    }

    const activeBranch = await ensureActiveBranch(
      authorization.branchId,
    );

    if (!activeBranch.success) {
      return {
        success: false,
        message: activeBranch.message,
      };
    }

    /**
     * Pastikan menu benar-benar milik cabang yang sedang
     * dikelola.
     */
    const existingMenu = await findMenuByIdAndBranch(
      id,
      authorization.branchId,
    );

    if (!existingMenu) {
      return {
        success: false,
        message:
          "Menu tidak ditemukan pada cabang tersebut.",
      };
    }

    const slug = slugify(name);

    /**
     * Pastikan slug baru tidak bentrok dengan menu lain
     * pada cabang yang sama.
     */
    const duplicateMenu = await findMenuBySlug(
      authorization.branchId,
      slug,
    );

    if (
      duplicateMenu &&
      String(duplicateMenu._id) !== String(id)
    ) {
      return {
        success: false,
        message:
          "Menu dengan nama tersebut sudah tersedia di cabang ini.",
      };
    }

    const updatedMenu = await updateMenuByIdAndBranch(
      id,
      authorization.branchId,
      {
        name,
        slug,
        description,
        category,
        price,
        image,
        isAvailable,
        featured,
        priceVerified,
      },
    );

    if (!updatedMenu) {
      return {
        success: false,
        message: "Menu gagal diperbarui.",
      };
    }

    await revalidateMenuPaths(authorization.branchId);

    return {
      success: true,
      message: "Menu berhasil diperbarui.",
    };
  } catch (error) {
    console.error("[updateMenu]", error);

    return {
      success: false,
      message: "Gagal memperbarui menu.",
    };
  }
}

/**
 * DELETE MENU
 */
export async function deleteMenu(
  input: DeleteMenuInput,
): Promise<MenuActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "Sesi login tidak ditemukan.",
      };
    }

    if (
      session.user.role !== "admin" &&
      session.user.role !== "super_admin"
    ) {
      return {
        success: false,
        message:
          "Kamu tidak memiliki akses untuk menghapus menu.",
      };
    }

    const validation = deleteMenuSchema.safeParse(input);

    if (!validation.success) {
      return {
        success: false,
        message:
          "Data penghapusan menu tidak valid.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const {
      id,
      branchId: requestedBranchId,
    } = validation.data;

    if (!Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: "ID menu tidak valid.",
      };
    }

    await connectToDatabase();

    const authorization = await getAuthorizedBranchId(
      requestedBranchId,
    );

    if (!authorization.success) {
      return {
        success: false,
        message: authorization.message,
      };
    }

    const activeBranch = await ensureActiveBranch(
      authorization.branchId,
    );

    if (!activeBranch.success) {
      return {
        success: false,
        message: activeBranch.message,
      };
    }

    /**
     * Pastikan menu benar-benar milik cabang yang sedang
     * dikelola sebelum menghapus.
     */
    const existingMenu = await findMenuByIdAndBranch(
      id,
      authorization.branchId,
    );

    if (!existingMenu) {
      return {
        success: false,
        message:
          "Menu tidak ditemukan pada cabang tersebut.",
      };
    }

    const deletedMenu = await deleteMenuByIdAndBranch(
      id,
      authorization.branchId,
    );

    if (!deletedMenu) {
      return {
        success: false,
        message: "Menu gagal dihapus.",
      };
    }

    await revalidateMenuPaths(authorization.branchId);

    return {
      success: true,
      message: `Menu "${existingMenu.name}" berhasil dihapus.`,
    };
  } catch (error) {
    console.error("[deleteMenu]", error);

    return {
      success: false,
      message: "Gagal menghapus menu.",
    };
  }
}