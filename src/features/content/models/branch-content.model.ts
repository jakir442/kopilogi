import { model, models, Schema, Types, type Document, type Model } from "mongoose";
import type { ContentStatus, ContentType } from "../types";

export interface BranchContentDocument extends Document {
  branchId: Types.ObjectId;
  type: ContentType;
  title: string;
  slug: string;
  description: string;
  image: string;
  media: string[];
  category: string;
  tags: string[];
  layoutSize: "auto" | "small" | "medium" | "large" | "wide";
  featured: boolean;
  status: ContentStatus;
  publishedAt: Date | null;
  expiresAt: Date | null;
  startAt: Date | null;
  endAt: Date | null;
  location: string;
  communityName: string;
  collaborationType: string;
  ctaLabel: string;
  ctaUrl: string;
  platform: string;
  externalUrl: string;
  author: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const branchContentSchema = new Schema<BranchContentDocument>(
  {
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    type: { type: String, enum: ["gallery", "event", "promotion", "community", "news", "social"], required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, trim: true },
    description: { type: String, default: "", maxlength: 2000 },
    image: { type: String, default: "" },
    media: { type: [String], default: [] },
    category: { type: String, default: "", maxlength: 80 },
    tags: { type: [String], default: [] },
    layoutSize: { type: String, enum: ["auto", "small", "medium", "large", "wide"], default: "auto" },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    publishedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
    location: { type: String, default: "" },
    communityName: { type: String, default: "" },
    collaborationType: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaUrl: { type: String, default: "" },
    platform: { type: String, default: "" },
    externalUrl: { type: String, default: "" },
    author: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

branchContentSchema.index({ branchId: 1, slug: 1 }, { unique: true });
branchContentSchema.index({ branchId: 1, type: 1, status: 1, publishedAt: -1, sortOrder: 1 });

export const BranchContent =
  (models.BranchContent as Model<BranchContentDocument>) ||
  model<BranchContentDocument>("BranchContent", branchContentSchema);
