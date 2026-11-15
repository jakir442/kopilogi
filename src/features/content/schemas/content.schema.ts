import { z } from "zod";
import { CONTENT_TYPES } from "../types";

const optionalUrl = z
  .string()
  .trim()
  .max(1500, "URL terlalu panjang.")
  .refine((value) => {
    if (!value) return true;
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Masukkan URL http atau https yang valid.");

const optionalDate = z.string().trim().max(40).optional().default("");

export const contentFieldsSchema = z.object({
  type: z.enum(CONTENT_TYPES),
  title: z.string().trim().min(2, "Judul minimal 2 karakter.").max(120),
  description: z.string().trim().max(2000, "Deskripsi maksimal 2.000 karakter.").default(""),
  image: optionalUrl,
  media: z.array(optionalUrl).max(20).default([]),
  category: z.string().trim().max(80).default(""),
  tags: z.array(z.string().trim().min(1).max(30)).max(15).default([]),
  layoutSize: z.enum(["auto", "small", "medium", "large", "wide"]).default("auto"),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishedAt: optionalDate,
  expiresAt: optionalDate,
  startAt: optionalDate,
  endAt: optionalDate,
  location: z.string().trim().max(180).default(""),
  communityName: z.string().trim().max(120).default(""),
  collaborationType: z.string().trim().max(100).default(""),
  ctaLabel: z.string().trim().max(50).default(""),
  ctaUrl: optionalUrl,
  platform: z.string().trim().max(40).default(""),
  externalUrl: optionalUrl,
  author: z.string().trim().max(100).default(""),
  sortOrder: z.number().int().min(0).max(100000).default(0),
  branchId: z.string().optional(),
});

export const createContentSchema = contentFieldsSchema;
export const updateContentSchema = contentFieldsSchema.extend({ id: z.string().min(1) });
export const deleteContentSchema = z.object({ id: z.string().min(1), branchId: z.string().optional() });

export type ContentFormInput = z.input<typeof contentFieldsSchema>;
export type ValidContentInput = z.output<typeof contentFieldsSchema>;
