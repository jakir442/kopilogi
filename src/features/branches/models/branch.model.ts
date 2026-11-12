import { model, models, Schema } from "mongoose";

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    concept: {
      type: String,
      enum: ["modern-futuristic", "traditional-heritage", "contemporary-cozy"],
      required: true,
      default: "contemporary-cozy",
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: null,
    },

    googleMapsUrl: {
      type: String,
      trim: true,
      default: null,
    },

    openingHours: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },

    image: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Branch = models.Branch || model("Branch", branchSchema);
