import { z } from "zod";

export const createAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(100, "Nama maksimal 100 karakter."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Format email tidak valid.")
    .max(254, "Email terlalu panjang."),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .max(72, "Password maksimal 72 karakter."),

  branchId: z.string().trim().min(1, "Cabang wajib dipilih."),
});

export const updateAdminSchema = z.object({
  id: z.string().trim().min(1, "ID administrator wajib diisi."),
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(100, "Nama maksimal 100 karakter."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Format email tidak valid.")
    .max(254, "Email terlalu panjang."),
  branchId: z.string().trim().min(1, "Cabang wajib dipilih."),
});

export const deleteAdminSchema = z.object({
  id: z.string().trim().min(1, "ID administrator wajib diisi."),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type DeleteAdminInput = z.infer<typeof deleteAdminSchema>;
