
import { z } from "zod";

export const menuCategorySchema = z.enum(["Kopi", "Minuman", "Makanan"]);

const imageSchema = z
  .string()
  .trim()
  .max(1000, "URL gambar terlalu panjang.")
  .refine((value) => {
    if (!value) return true;

    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Masukkan URL gambar yang valid.")
  .transform((value) => value || null);

const menuFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama menu minimal 2 karakter.")
    .max(100, "Nama menu maksimal 100 karakter."),

  description: z
    .string()
    .trim()
    .min(1, "Deskripsi menu wajib diisi.")
    .max(1000, "Deskripsi maksimal 1000 karakter."),

  category: menuCategorySchema,

  price: z
    .number()
    .int("Harga harus berupa bilangan bulat.")
    .min(0, "Harga tidak boleh negatif.")
    .max(Number.MAX_SAFE_INTEGER, "Harga terlalu besar."),

  image: imageSchema,
  isAvailable: z.boolean(),
  featured: z.boolean(),
  priceVerified: z.boolean(),
});

const optionalBranchIdSchema = {
  // Dipakai Super Admin untuk menentukan cabang.
  // Admin cabang tetap menggunakan branchId dari sesi login.
  branchId: z.string().optional(),
};

export const createMenuSchema = menuFieldsSchema.extend({
  ...optionalBranchIdSchema,
});

export const updateMenuSchema = menuFieldsSchema.extend({
  id: z.string().min(1, "ID menu wajib diisi."),
  ...optionalBranchIdSchema,
});

export const deleteMenuSchema = z.object({
  id: z.string().min(1, "ID menu wajib diisi."),
  ...optionalBranchIdSchema,
});

export type CreateMenuInput = z.input<typeof createMenuSchema>;
export type UpdateMenuInput = z.input<typeof updateMenuSchema>;
export type DeleteMenuInput = z.infer<typeof deleteMenuSchema>;
