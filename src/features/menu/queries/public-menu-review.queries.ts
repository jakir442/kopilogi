import { connectToDatabase } from "@/lib/mongodb";

import { findApprovedReviewsByMenu } from "@/features/customers/repositories/menu-review.repository";

export async function getApprovedReviewsByMenu(menuId: string) {
  await connectToDatabase();

  const reviews = await findApprovedReviewsByMenu(menuId);

  return reviews.map((review) => ({
    id: String(review._id),
    customerName: review.customerName,
    rating: review.rating,
    comment: review.comment,
    createdAt: new Date(review.createdAt).toISOString(),
    adminReply: review.adminReply
      ? {
          message: review.adminReply.message,
          repliedByName: review.adminReply.repliedByName ?? null,
          repliedByRole: review.adminReply.repliedByRole ?? null,
          createdAt: new Date(review.adminReply.createdAt).toISOString(),
          updatedAt: new Date(review.adminReply.updatedAt).toISOString(),
        }
      : null,
  }));
}
