"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

import {
  deleteMenuReview,
  findReviewsByBranch,
  getReviewSummary,
  updateReviewStatus,
  createMenuReview,
} from "../repositories/menu-review.repository";

type ReviewStatus = "pending" | "approved" | "rejected";

type BranchReviewInput = {
  branchId: string;
  branchSlug: string;
};

type UpdateReviewInput = BranchReviewInput & {
  reviewId: string;
  status: ReviewStatus;
};

type DeleteReviewInput = BranchReviewInput & {
  reviewId: string;
};

export interface CustomerReviewItem {
  id: string;
  menuId: string;
  menuName: string;
  customerName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface CustomerReviewSummary {
  totalReviews: number;
  averageRating: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
}

async function requireCustomerReviewPermission() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Anda harus login untuk melakukan tindakan ini.");
  }

  const role = session.user.role;

  if (role !== "admin" && role !== "super_admin") {
    throw new Error("Anda tidak memiliki izin untuk mengelola ulasan pelanggan.");
  }

  return session;
}

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

function revalidateCustomerReviewPaths(branchSlug: string) {
  revalidatePath(`/admin/${branchSlug}`);
  revalidatePath(`/admin/${branchSlug}?tab=customers`);
}

export async function getCustomerReviewsAction({ branchId, branchSlug }: BranchReviewInput) {
  try {
    await requireCustomerReviewPermission();

    if (!branchId || !isValidObjectId(branchId)) {
      return {
        success: false,
        message: "Branch ID tidak valid.",
        data: null,
      };
    }

    await connectToDatabase();

    const [reviews, summary] = await Promise.all([
      findReviewsByBranch(branchId),
      getReviewSummary(branchId),
    ]);

    const serializedReviews: CustomerReviewItem[] = reviews.map((review) => {
      const populatedMenu = review.menuId;

      return {
        id: String(review._id),
        menuId:
          populatedMenu && typeof populatedMenu === "object" && "_id" in populatedMenu
            ? String(populatedMenu._id)
            : "",
        menuName:
          populatedMenu && typeof populatedMenu === "object" && "name" in populatedMenu
            ? String(populatedMenu.name)
            : "Menu tidak ditemukan",
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
        createdAt: new Date(review.createdAt).toISOString(),
      };
    });

    return {
      success: true,
      message: "Data ulasan berhasil dimuat.",
      data: {
        reviews: serializedReviews,
        summary,
      },
    };
  } catch (error) {
    console.error("[getCustomerReviewsAction]", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memuat data ulasan.",
      data: null,
    };
  }
}

export async function updateMenuReviewStatusAction({
  reviewId,
  status,
  branchId,
  branchSlug,
}: UpdateReviewInput) {
  try {
    await requireCustomerReviewPermission();

    if (!reviewId || !isValidObjectId(reviewId)) {
      return {
        success: false,
        message: "ID ulasan tidak valid.",
      };
    }

    if (!branchId || !isValidObjectId(branchId)) {
      return {
        success: false,
        message: "Branch ID tidak valid.",
      };
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return {
        success: false,
        message: "Status ulasan tidak valid.",
      };
    }

    await connectToDatabase();

    const review = await updateReviewStatus(reviewId, status, branchId);

    if (!review) {
      return {
        success: false,
        message: "Ulasan tidak ditemukan pada cabang ini.",
      };
    }

    revalidateCustomerReviewPaths(branchSlug);

    return {
      success: true,
      message:
        status === "approved"
          ? "Ulasan berhasil disetujui."
          : status === "rejected"
            ? "Ulasan berhasil ditolak."
            : "Status ulasan berhasil diperbarui.",
    };
  } catch (error) {
    console.error("[updateMenuReviewStatusAction]", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui status ulasan.",
    };
  }
}

export async function removeMenuReviewAction({
  reviewId,
  branchId,
  branchSlug,
}: DeleteReviewInput) {
  try {
    await requireCustomerReviewPermission();

    if (!reviewId || !isValidObjectId(reviewId)) {
      return {
        success: false,
        message: "ID ulasan tidak valid.",
      };
    }

    if (!branchId || !isValidObjectId(branchId)) {
      return {
        success: false,
        message: "Branch ID tidak valid.",
      };
    }

    await connectToDatabase();

    const review = await deleteMenuReview(reviewId, branchId);

    if (!review) {
      return {
        success: false,
        message: "Ulasan tidak ditemukan pada cabang ini.",
      };
    }

    revalidateCustomerReviewPaths(branchSlug);

    return {
      success: true,
      message: "Ulasan berhasil dihapus.",
    };
  } catch (error) {
    console.error("[removeMenuReviewAction]", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus ulasan.",
    };
  }
}

type CreateMenuReviewInput = {
  menuId: string;
  branchId: string;
  branchSlug: string;
  menuSlug: string;
  rating: number;
  comment: string;
};

export async function createMenuReviewAction({
  menuId,
  branchId,
  branchSlug,
  menuSlug,
  rating,
  comment,
}: CreateMenuReviewInput) {
  try {
    if (!Types.ObjectId.isValid(menuId)) {
      return {
        success: false,
        message: "ID menu tidak valid.",
      };
    }

    if (!Types.ObjectId.isValid(branchId)) {
      return {
        success: false,
        message: "ID cabang tidak valid.",
      };
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        message: "Rating harus antara 1 sampai 5 bintang.",
      };
    }

    if (typeof comment !== "string" || comment.length > 500) {
      return {
        success: false,
        message: "Komentar maksimal 500 karakter.",
      };
    }

    await connectToDatabase();

    const session = await auth();
    const customerName = session?.user?.name?.trim() || "Pelanggan";

    await createMenuReview({
      menuId,
      branchId,
      customerName,
      rating,
      comment: comment.trim(),
    });

    revalidatePath(`/${branchSlug}/${menuSlug}`);

    return {
      success: true,
      message: "Ulasan berhasil dikirim dan menunggu persetujuan admin.",
    };
  } catch (error) {
    console.error("[createMenuReviewAction]", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengirim ulasan. Silakan coba lagi.",
    };
  }
}
