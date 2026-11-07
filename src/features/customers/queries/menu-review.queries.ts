import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";

import { findReviewsByBranch, getReviewSummary } from "../repositories/menu-review.repository";

export async function getCustomerReviews(branchId?: string) {
  if (!branchId || !Types.ObjectId.isValid(branchId)) {
    return [];
  }

  try {
    await connectToDatabase();

    const reviews = await findReviewsByBranch(branchId);

    return reviews.map((review) => {
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
  } catch (error) {
    console.error("[getCustomerReviews]", error);
    return [];
  }
}

export async function getCustomerReviewSummary(branchId?: string) {
  const emptySummary = {
    totalReviews: 0,
    approvedReviews: 0,
    averageRating: 0,
    pendingReviews: 0,
    rejectedReviews: 0,
  };

  if (!branchId || !Types.ObjectId.isValid(branchId)) {
    return emptySummary;
  }

  try {
    await connectToDatabase();

    return await getReviewSummary(branchId);
  } catch (error) {
    console.error("[getCustomerReviewSummary]", error);
    return emptySummary;
  }
}
