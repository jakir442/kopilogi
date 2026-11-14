import mongoose from "mongoose";
import {
  MenuReview,
  type MenuReviewDocument,
  type MenuReviewReplyRole,
  type MenuReviewStatus,
} from "../models/menu-review.model";

type CreateMenuReviewData = {
  menuId: string;
  branchId: string;
  customerName: string;
  rating: number;
  comment: string;
};

const toObjectId = (value: string) => new mongoose.Types.ObjectId(value);

export async function findReviewsByBranch(branchId: string): Promise<MenuReviewDocument[]> {
  return MenuReview.find({
    branchId: toObjectId(branchId),
  })
    .populate("menuId", "name slug")
    .sort({ createdAt: -1 })
    .lean<MenuReviewDocument[]>();
}

export async function findApprovedReviewsByMenu(menuId: string): Promise<MenuReviewDocument[]> {
  return MenuReview.find({
    menuId: toObjectId(menuId),
    status: "approved",
  })
    .sort({ createdAt: -1 })
    .lean<MenuReviewDocument[]>();
}

export async function createMenuReview(data: CreateMenuReviewData): Promise<MenuReviewDocument> {
  return MenuReview.create({
    menuId: toObjectId(data.menuId),
    branchId: toObjectId(data.branchId),
    customerName: data.customerName,
    rating: data.rating,
    comment: data.comment,
  });
}

export async function updateReviewStatus(
  reviewId: string,
  status: MenuReviewStatus,
  branchId: string,
): Promise<MenuReviewDocument | null> {
  return MenuReview.findOneAndUpdate(
    {
      _id: toObjectId(reviewId),
      branchId: toObjectId(branchId),
    },
    {
      $set: {
        status,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function deleteMenuReview(
  reviewId: string,
  branchId: string,
): Promise<MenuReviewDocument | null> {
  return MenuReview.findOneAndDelete({
    _id: toObjectId(reviewId),
    branchId: toObjectId(branchId),
  });
}

export async function getReviewSummary(branchId: string) {
  const branchObjectId = toObjectId(branchId);

  const [summary] = await MenuReview.aggregate([
    {
      $match: {
        branchId: branchObjectId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalApproved: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const [total, pending, rejected] = await Promise.all([
    MenuReview.countDocuments({
      branchId: branchObjectId,
    }),
    MenuReview.countDocuments({
      branchId: branchObjectId,
      status: "pending",
    }),
    MenuReview.countDocuments({
      branchId: branchObjectId,
      status: "rejected",
    }),
  ]);

  return {
    total,
    pending,
    rejected,
    approved: summary?.totalApproved ?? 0,
    averageRating: summary?.averageRating ?? 0,
  };
}

/**
 * Menyimpan atau memperbarui balasan admin pada review.
 *
 * Review harus:
 * - berada pada branch yang sama
 * - berstatus approved
 *
 * Jika sudah ada balasan, hanya message dan updatedAt yang diperbarui.
 * Jika belum ada, dibuat dengan createdAt dan updatedAt baru.
 */
export async function saveMenuReviewReply(
  reviewId: string,
  branchId: string,
  message: string,
  repliedByName: string,
  repliedByRole: MenuReviewReplyRole,
): Promise<MenuReviewDocument | null> {
  const review = await MenuReview.findOne({
    _id: toObjectId(reviewId),
    branchId: toObjectId(branchId),
  });

  if (!review) {
    return null;
  }

  if (review.status !== "approved") {
    return null;
  }

  const now = new Date();
  const trimmedMessage = message.trim();

  if (review.adminReply) {
    review.adminReply.message = trimmedMessage;
    review.adminReply.updatedAt = now;

    // Jangan mengganti identitas penjawab ketika balasan diedit.
    // Jika data balasan lama belum memiliki identitas, isi dengan
    // akun yang sedang melakukan edit sebagai fallback.
    review.adminReply.repliedByName ??= repliedByName;
    review.adminReply.repliedByRole ??= repliedByRole;
  } else {
    review.adminReply = {
      message: trimmedMessage,
      repliedByName,
      repliedByRole,
      createdAt: now,
      updatedAt: now,
    };
  }

  await review.save();

  return review;
}

/**
 * Menghapus balasan admin tanpa menghapus review pelanggan.
 */
export async function deleteMenuReviewReply(
  reviewId: string,
  branchId: string,
): Promise<MenuReviewDocument | null> {
  return MenuReview.findOneAndUpdate(
    {
      _id: toObjectId(reviewId),
      branchId: toObjectId(branchId),
      "adminReply.message": {
        $exists: true,
      },
    },
    {
      $unset: {
        adminReply: 1,
      },
    },
    {
      new: true,
    },
  );
}

/**
 * Mengambil slug menu dari review.
 *
 * Dipakai oleh Server Action untuk menentukan halaman
 * menu publik yang perlu direvalidasi setelah admin
 * membuat, mengubah, atau menghapus balasan.
 */
export async function findReviewMenuSlug(
  reviewId: string,
  branchId: string,
): Promise<string | null> {
  const review = await MenuReview.findOne({
    _id: toObjectId(reviewId),
    branchId: toObjectId(branchId),
  })
    .populate("menuId", "slug")
    .lean<{
      menuId?: {
        slug?: string;
      };
    }>();

  return review?.menuId?.slug ?? null;
}
