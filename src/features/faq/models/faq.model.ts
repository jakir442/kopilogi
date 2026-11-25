import mongoose, { model, models, Schema } from "mongoose";

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
      index: true,
    },

    // Hanya FAQ "Published" yang tampil di halaman publik
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const faqCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
  },
  {
    timestamps: true,
  },
);

// Di mode dev, buang model lama yang ter-cache supaya perubahan schema terbaca
if (process.env.NODE_ENV !== "production") {
  if (models.Faq) mongoose.deleteModel("Faq");
  if (models.FaqCategory) mongoose.deleteModel("FaqCategory");
}

export const Faq = models.Faq || model("Faq", faqSchema);
export const FaqCategory =
  models.FaqCategory || model("FaqCategory", faqCategorySchema);