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
  }));
}
