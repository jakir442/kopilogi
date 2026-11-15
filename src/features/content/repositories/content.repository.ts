import { Types } from "mongoose";
import { Branch } from "@/features/branches/models/branch.model";
import { BranchContent } from "../models/branch-content.model";
import type { ValidContentInput } from "../schemas/content.schema";

const toObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("ID MongoDB tidak valid.");
  return new Types.ObjectId(id);
};

function toDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalize(data: ValidContentInput) {
  return {
    ...data,
    branchId: toObjectId(data.branchId ?? ""),
    publishedAt: toDate(data.publishedAt),
    expiresAt: toDate(data.expiresAt),
    startAt: toDate(data.startAt),
    endAt: toDate(data.endAt),
  };
}

export async function findContentsByBranch(branchId: string) {
  return BranchContent.find({ branchId: toObjectId(branchId) }).sort({ sortOrder: 1, createdAt: -1 }).lean();
}

export async function findContentBySlug(branchId: string, slug: string, excludeId?: string) {
  return BranchContent.findOne({
    branchId: toObjectId(branchId),
    slug,
    ...(excludeId && Types.ObjectId.isValid(excludeId) ? { _id: { $ne: toObjectId(excludeId) } } : {}),
  }).lean();
}

export async function insertContent(data: ValidContentInput & { slug: string }) {
  return BranchContent.create({ ...normalize(data), slug: data.slug });
}

export async function updateContent(id: string, branchId: string, data: ValidContentInput & { slug: string }) {
  const normalized = normalize(data);
  return BranchContent.findOneAndUpdate(
    { _id: toObjectId(id), branchId: toObjectId(branchId) },
    { $set: { ...normalized, slug: data.slug } },
    { new: true, runValidators: true },
  ).lean();
}

export async function removeContent(id: string, branchId: string) {
  return BranchContent.findOneAndDelete({ _id: toObjectId(id), branchId: toObjectId(branchId) }).lean();
}

export async function findPublishedContentsByBranchSlug(branchSlug: string) {
  const branch = await Branch.findOne({ slug: branchSlug, isActive: true }).select("_id").lean();
  if (!branch) return [];
  const now = new Date();
  return BranchContent.find({
    branchId: branch._id,
    status: "published",
    $and: [
      { $or: [{ publishedAt: null }, { publishedAt: { $lte: now } }] },
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
      { $or: [{ endAt: null }, { endAt: { $gt: now } }] },
    ],
  }).sort({ featured: -1, sortOrder: 1, publishedAt: -1, createdAt: -1 }).lean();
}
