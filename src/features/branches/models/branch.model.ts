
import { model, models, Schema } from "mongoose";

const dailyOpeningHoursSchema = new Schema(
  {
    isOpen: {
      type: Boolean,
      default: true,
    },
    open: {
      type: String,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam buka harus HH:mm."],
      default: "08:00",
    },
    close: {
      type: String,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tutup harus HH:mm."],
      default: "22:00",
    },
  },
  { _id: false },
);

const weeklyOpeningHoursSchema = new Schema(
  {
    monday: { type: dailyOpeningHoursSchema, default: () => ({}) },
    tuesday: { type: dailyOpeningHoursSchema, default: () => ({}) },
    wednesday: { type: dailyOpeningHoursSchema, default: () => ({}) },
    thursday: { type: dailyOpeningHoursSchema, default: () => ({}) },
    friday: { type: dailyOpeningHoursSchema, default: () => ({}) },
    saturday: { type: dailyOpeningHoursSchema, default: () => ({}) },
    sunday: { type: dailyOpeningHoursSchema, default: () => ({}) },
  },
  { _id: false },
);

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

    // Jadwal operasional mingguan
    weeklyOpeningHours: {
      type: weeklyOpeningHoursSchema,
      default: () => ({}),
    },

    // Field lama dipertahankan untuk kompatibilitas data
    openingHours: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },

    openingTime: {
      type: String,
      trim: true,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam buka harus HH:mm."],
      default: null,
    },

    closingTime: {
      type: String,
      trim: true,
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam tutup harus HH:mm."],
      default: null,
    },

    partnerships: {
      type: [
        new Schema(
          {
            name: { type: String, required: true, trim: true, maxlength: 60 },
            url: { type: String, trim: true, maxlength: 500 },
          },
          { _id: false },
        ),
      ],
      default: [],
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
