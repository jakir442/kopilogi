import { Types } from "mongoose";

import { MenuReview } from "../models/menu-review.model";

function toObjectId(value: string) {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error("ID MongoDB tidak valid.");
  }

  return new Types.ObjectId(value);
}

export async function findReviewsByBranch(branchId: string) {
  const branchObjectId = toObjectId(branchId);

  return MenuReview.find({
    branchId: branchObjectId,
  })
    .populate("menuId", "name slug")
    .sort({ createdAt: -1 })
    .lean();
}

export async function findApprovedReviewsByMenu(menuId: string) {
  const menuObjectId = toObjectId(menuId);

  return MenuReview.find({
    menuId: menuObjectId,
    status: "approved",
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function createMenuReview(data: {
  menuId: string;
  branchId: string;
  customerName: string;
  rating: number;
  comment: string;
}) {
  return MenuReview.create({
    ...data,
    menuId: toObjectId(data.menuId),
    branchId: toObjectId(data.branchId),
  });
}

export async function updateReviewStatus(
  reviewId: string,
  status: "pending" | "approved" | "rejected",
  branchId: string,
) {
  return MenuReview.findOneAndUpdate(
    {
      _id: toObjectId(reviewId),
      branchId: toObjectId(branchId),
    },
    { $set: { status } },
    { new: true, runValidators: true },
  );
}

export async function deleteMenuReview(reviewId: string, branchId: string) {
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
        approvedReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const [totalReviews, pendingReviews, rejectedReviews] = await Promise.all([
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
    totalReviews,
    approvedReviews: summary?.approvedReviews ?? 0,
    averageRating: summary?.averageRating ? Number(summary.averageRating.toFixed(1)) : 0,
    pendingReviews,
    rejectedReviews,
  };
}
