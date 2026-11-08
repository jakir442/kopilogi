"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import {
  createMenuReview,
  deleteMenuReview,
  deleteMenuReviewReply,
  findReviewMenuSlug,
  findReviewsByBranch,
  getReviewSummary,
  saveMenuReviewReply,
  updateReviewStatus,
} from "../repositories/menu-review.repository";
import type { MenuReviewReplyRole, MenuReviewStatus } from "../models/menu-review.model";

type ReviewStatus = MenuReviewStatus;

interface BranchReviewInput {
  branchId: string;
  branchSlug: string;
}

interface UpdateReviewInput extends BranchReviewInput {
  reviewId: string;
  status: ReviewStatus;
}

interface DeleteReviewInput extends BranchReviewInput {
  reviewId: string;
}

interface MenuReviewReplyInput extends BranchReviewInput {
  reviewId: string;
  message: string;
}

interface CreateMenuReviewInput {
  menuId: string;
  branchId: string;
  branchSlug: string;
  menuSlug: string;
  rating: number;
  comment: string;
}

export interface CustomerReviewItem {
  id: string;
  menuId: string;
  menuName: string;
  customerName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  adminReply: {
    message: string;
    repliedByName?: string;
    repliedByRole?: MenuReviewReplyRole;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface CustomerReviewSummary {
  total: number;
  pending: number;
  rejected: number;
  approved: number;
  averageRating: number;
}

type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

const isValidObjectId = (value: string) => Types.ObjectId.isValid(value);

const isValidBranchSlug = (value: string) => /^cabang-[1-4]$/.test(value);

async function requireCustomerReviewPermission() {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false as const,
      message: "Silakan login terlebih dahulu.",
    };
  }

  const role = session.user.role;

  if (role !== "admin" && role !== "super_admin") {
    return {
      success: false as const,
      message: "Anda tidak memiliki izin untuk mengelola review.",
    };
  }

  return {
    success: true as const,
    session,
  };
}

function revalidateCustomerReviewPaths(branchSlug: string, menuSlug?: string | null) {
  revalidatePath(`/admin/${branchSlug}`);
  revalidatePath(`/admin/${branchSlug}?tab=customers`);

  if (menuSlug) {
    revalidatePath(`/${branchSlug}/${menuSlug}`);
  }
}

/**
 * Mengambil review pelanggan untuk halaman admin.
 */
export async function getCustomerReviewsAction(input: BranchReviewInput): Promise<
  ActionResult<{
    reviews: CustomerReviewItem[];
    summary: CustomerReviewSummary;
  }>
> {
  const permission = await requireCustomerReviewPermission();

  if (!permission.success) {
    return {
      success: false,
      message: permission.message,
    };
  }

  const { branchId, branchSlug } = input;

  if (!isValidObjectId(branchId) || !isValidBranchSlug(branchSlug)) {
    return {
      success: false,
      message: "Data cabang tidak valid.",
    };
  }

  try {
    await connectToDatabase();

    const [reviews, summary] = await Promise.all([
      findReviewsByBranch(branchId),
      getReviewSummary(branchId),
    ]);

    const serializedReviews: CustomerReviewItem[] = reviews.map((review) => {
      const populatedMenu = review.menuId as unknown as {
        _id?: Types.ObjectId;
        name?: string;
        slug?: string;
      };

      const adminReply = review.adminReply;

      return {
        id: review._id.toString(),
        menuId: populatedMenu?._id?.toString() ?? "",
        menuName: populatedMenu?.name ?? "Menu tidak tersedia",
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
        createdAt: new Date(review.createdAt).toISOString(),
        adminReply: adminReply
          ? {
              message: adminReply.message,
              repliedByName: adminReply.repliedByName,
              repliedByRole: adminReply.repliedByRole,
              createdAt: new Date(adminReply.createdAt).toISOString(),
              updatedAt: new Date(adminReply.updatedAt).toISOString(),
            }
          : null,
      };
    });

    return {
      success: true,
      message: "Review pelanggan berhasil dimuat.",
      data: {
        reviews: serializedReviews,
        summary: {
          total: summary.total,
          pending: summary.pending,
          rejected: summary.rejected,
          approved: summary.approved,
          averageRating: summary.averageRating,
        },
      },
    };
  } catch (error) {
    console.error("[getCustomerReviewsAction]", error);

    return {
      success: false,
      message: "Gagal memuat review pelanggan.",
    };
  }
}

/**
 * Mengubah status review pelanggan.
 */
export async function updateMenuReviewStatusAction(
  input: UpdateReviewInput,
): Promise<ActionResult> {
  const permission = await requireCustomerReviewPermission();

  if (!permission.success) {
    return {
      success: false,
      message: permission.message,
    };
  }

  const { reviewId, branchId, branchSlug, status } = input;

  if (!isValidObjectId(reviewId) || !isValidObjectId(branchId) || !isValidBranchSlug(branchSlug)) {
    return {
      success: false,
      message: "Data review atau cabang tidak valid.",
    };
  }

  if (!["pending", "approved", "rejected"].includes(status)) {
    return {
      success: false,
      message: "Status review tidak valid.",
    };
  }

  try {
    await connectToDatabase();

    const menuSlug = await findReviewMenuSlug(reviewId, branchId);

    const updatedReview = await updateReviewStatus(reviewId, status, branchId);

    if (!updatedReview) {
      return {
        success: false,
        message: "Review tidak ditemukan pada cabang ini.",
      };
    }

    revalidateCustomerReviewPaths(branchSlug, menuSlug);

    return {
      success: true,
      message: "Status review berhasil diperbarui.",
    };
  } catch (error) {
    console.error("[updateMenuReviewStatusAction]", error);

    return {
      success: false,
      message: "Gagal memperbarui status review.",
    };
  }
}

/**
 * Menghapus review pelanggan beserta balasan yang melekat padanya.
 */
export async function removeMenuReviewAction(input: DeleteReviewInput): Promise<ActionResult> {
  const permission = await requireCustomerReviewPermission();

  if (!permission.success) {
    return {
      success: false,
      message: permission.message,
    };
  }

  const { reviewId, branchId, branchSlug } = input;

  if (!isValidObjectId(reviewId) || !isValidObjectId(branchId) || !isValidBranchSlug(branchSlug)) {
    return {
      success: false,
      message: "Data review atau cabang tidak valid.",
    };
  }

  try {
    await connectToDatabase();

    const menuSlug = await findReviewMenuSlug(reviewId, branchId);

    const deletedReview = await deleteMenuReview(reviewId, branchId);

    if (!deletedReview) {
      return {
        success: false,
        message: "Review tidak ditemukan pada cabang ini.",
      };
    }

    revalidateCustomerReviewPaths(branchSlug, menuSlug);

    return {
      success: true,
      message: "Review pelanggan berhasil dihapus.",
    };
  } catch (error) {
    console.error("[removeMenuReviewAction]", error);

    return {
      success: false,
      message: "Gagal menghapus review pelanggan.",
    };
  }
}

/**
 * Membuat atau mengedit balasan admin.
 *
 * Identitas penjawab diambil dari session login.
 * Frontend tidak dapat menentukan nama maupun role penjawab.
 */
export async function saveMenuReviewReplyAction(
  input: MenuReviewReplyInput,
): Promise<ActionResult> {
  const permission = await requireCustomerReviewPermission();

  if (!permission.success) {
    return {
      success: false,
      message: permission.message,
    };
  }

  const { reviewId, branchId, branchSlug } = input;

  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!isValidObjectId(reviewId) || !isValidObjectId(branchId) || !isValidBranchSlug(branchSlug)) {
    return {
      success: false,
      message: "Data review atau cabang tidak valid.",
    };
  }

  if (!message) {
    return {
      success: false,
      message: "Balasan admin tidak boleh kosong.",
    };
  }

  if (message.length > 1000) {
    return {
      success: false,
      message: "Balasan maksimal 1000 karakter.",
    };
  }

  const role = permission.session.user.role;

  if (role !== "admin" && role !== "super_admin") {
    return {
      success: false,
      message: "Role akun tidak diizinkan membalas review.",
    };
  }

  const repliedByRole: MenuReviewReplyRole = role;

  const repliedByName =
    permission.session.user.name?.trim() ||
    (repliedByRole === "super_admin" ? "Owner Kopilogi" : "Admin Kopilogi");

  try {
    await connectToDatabase();

    const menuSlug = await findReviewMenuSlug(reviewId, branchId);

    if (!menuSlug) {
      return {
        success: false,
        message: "Menu terkait review tidak ditemukan.",
      };
    }

    const updatedReview = await saveMenuReviewReply(
      reviewId,
      branchId,
      message,
      repliedByName,
      repliedByRole,
    );

    if (!updatedReview) {
      return {
        success: false,
        message:
          "Review tidak ditemukan atau belum disetujui. Hanya review yang disetujui yang dapat dibalas.",
      };
    }

    revalidateCustomerReviewPaths(branchSlug, menuSlug);

    return {
      success: true,
      message: "Balasan admin berhasil disimpan.",
    };
  } catch (error) {
    console.error("[saveMenuReviewReplyAction]", error);

    return {
      success: false,
      message: "Gagal menyimpan balasan admin.",
    };
  }
}

/**
 * Menghapus balasan admin tanpa menghapus review pelanggan.
 */
export async function deleteMenuReviewReplyAction(
  input: BranchReviewInput & { reviewId: string },
): Promise<ActionResult> {
  const permission = await requireCustomerReviewPermission();

  if (!permission.success) {
    return {
      success: false,
      message: permission.message,
    };
  }

  const { reviewId, branchId, branchSlug } = input;

  if (!isValidObjectId(reviewId) || !isValidObjectId(branchId) || !isValidBranchSlug(branchSlug)) {
    return {
      success: false,
      message: "Data review atau cabang tidak valid.",
    };
  }

  try {
    await connectToDatabase();

    const menuSlug = await findReviewMenuSlug(reviewId, branchId);

    const updatedReview = await deleteMenuReviewReply(reviewId, branchId);

    if (!updatedReview) {
      return {
        success: false,
        message: "Balasan tidak ditemukan pada review ini.",
      };
    }

    revalidateCustomerReviewPaths(branchSlug, menuSlug);

    return {
      success: true,
      message: "Balasan admin berhasil dihapus.",
    };
  } catch (error) {
    console.error("[deleteMenuReviewReplyAction]", error);

    return {
      success: false,
      message: "Gagal menghapus balasan admin.",
    };
  }
}

/**
 * Mengirim review baru dari pelanggan.
 */
export async function createMenuReviewAction(input: CreateMenuReviewInput): Promise<ActionResult> {
  const { menuId, branchId, branchSlug, menuSlug, rating, comment } = input;

  if (!isValidObjectId(menuId) || !isValidObjectId(branchId) || !isValidBranchSlug(branchSlug)) {
    return {
      success: false,
      message: "Data menu atau cabang tidak valid.",
    };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      success: false,
      message: "Rating harus berupa angka 1 sampai 5.",
    };
  }

  const trimmedComment = typeof comment === "string" ? comment.trim() : "";

  if (!trimmedComment) {
    return {
      success: false,
      message: "Komentar review tidak boleh kosong.",
    };
  }

  if (trimmedComment.length > 500) {
    return {
      success: false,
      message: "Komentar maksimal 500 karakter.",
    };
  }

  if (typeof menuSlug !== "string" || !menuSlug.trim() || menuSlug.length > 200) {
    return {
      success: false,
      message: "Slug menu tidak valid.",
    };
  }

  try {
    await connectToDatabase();

    const session = await auth();
    const customerName = session?.user?.name?.trim() || "Pelanggan";

    await createMenuReview({
      menuId,
      branchId,
      customerName,
      rating,
      comment: trimmedComment,
    });

    revalidatePath(`/${branchSlug}/${menuSlug}`);

    return {
      success: true,
      message: "Review berhasil dikirim dan menunggu persetujuan admin.",
    };
  } catch (error) {
    console.error("[createMenuReviewAction]", error);

    return {
      success: false,
      message: "Gagal mengirim review. Silakan coba kembali.",
    };
  }
}
