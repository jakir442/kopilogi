import { model, models, Schema } from "mongoose";
import type { UserRole } from "../types";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "admin", "super_admin"] satisfies UserRole[],
      default: "customer",
      required: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },

    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const User = models.User || model("User", userSchema);
