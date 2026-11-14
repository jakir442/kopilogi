
import { z } from "zod";

export const branchSettingsSchema = z.object({
  slug: z.string().trim().min(1, "Slug cabang wajib diisi."),

  name: z
    .string()
    .trim()
    .min(2, "Nama cabang minimal 2 karakter.")
    .max(100, "Nama cabang maksimal 100 karakter."),

  address: z
    .string()
    .trim()
    .min(1, "Alamat cabang wajib diisi.")
    .max(500, "Alamat maksimal 500 karakter."),

  phone: z
    .string()
    .trim()
    .max(30, "Nomor telepon maksimal 30 karakter.")
    .optional()
    .default(""),

  googleMapsUrl: z
    .string()
    .trim()
    .max(1000, "URL Google Maps terlalu panjang.")
    .refine(
      (value) => value === "" || /^https:\/\/\S+$/i.test(value),
      "URL Google Maps harus menggunakan HTTPS.",
    )
    .optional()
    .default(""),

  openingHours: z
    .string()
    .trim()
    .max(200, "Jam operasional maksimal 200 karakter.")
    .optional()
    .default(""),
});

export type BranchSettingsInput = z.infer<
  typeof branchSettingsSchema
>;
