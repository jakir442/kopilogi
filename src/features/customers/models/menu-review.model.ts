import mongoose, { Schema, type Document, type Model } from "mongoose";

export type MenuReviewStatus = "pending" | "approved" | "rejected";

export interface MenuReviewDocument extends Document {
  menuId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  customerName: string;
  rating: number;
  comment: string;
  status: MenuReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

const menuReviewSchema = new Schema<MenuReviewDocument>(
  {
    menuId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

menuReviewSchema.index({ branchId: 1, status: 1, createdAt: -1 });
menuReviewSchema.index({ menuId: 1, status: 1, createdAt: -1 });

export const MenuReview =
  (mongoose.models.MenuReview as Model<MenuReviewDocument>) ||
  mongoose.model<MenuReviewDocument>("MenuReview", menuReviewSchema);
