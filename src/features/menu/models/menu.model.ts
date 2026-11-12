import { model, models, Schema } from "mongoose";

export const MENU_CATEGORIES = ["Kopi", "Minuman", "Makanan"] as const;

const menuSchema = new Schema(
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
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    category: {
      type: String,
      enum: MENU_CATEGORIES,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Harga harus berupa bilangan bulat yang valid.",
      },
    },

    image: {
      type: String,
      trim: true,
      default: null,
    },

    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      required: true,
    },

    priceVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Slug boleh sama di cabang berbeda, tetapi tidak dalam cabang yang sama.
menuSchema.index({ branchId: 1, slug: 1 }, { unique: true });

// Membantu pengambilan menu berdasarkan cabang dan kategori.
menuSchema.index({ branchId: 1, category: 1 });

export const Menu = models.Menu || model("Menu", menuSchema);
