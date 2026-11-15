
import { z } from "zod";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function normalizeHttpUrl(raw: string): string | null {
  const value = raw.trim();

  if (!value) return null;

  const withProtocol = /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;

  try {
    const url = new URL(withProtocol);

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

const optionalHttpUrl = z
  .string()
  .trim()
  .max(500, "URL terlalu panjang.")
  .refine(
    (value) => value === "" || normalizeHttpUrl(value) !== null,
    "URL tidak valid. Gunakan alamat yang diawali http:// atau https://.",
  )
  .transform((value) =>
    value === "" ? "" : normalizeHttpUrl(value) as string
  );

const dailyOpeningHoursSchema = z
  .object({
    isOpen: z.boolean(),
    open: z.string().regex(TIME_PATTERN, "Format jam buka tidak valid."),
    close: z.string().regex(TIME_PATTERN, "Format jam tutup tidak valid."),
  })
  .refine(
    (data) => !data.isOpen || data.open !== data.close,
    {
      message: "Jam buka dan jam tutup tidak boleh sama.",
      path: ["close"],
    },
  );

export const weeklyOpeningHoursSchema = z.object({
  monday: dailyOpeningHoursSchema,
  tuesday: dailyOpeningHoursSchema,
  wednesday: dailyOpeningHoursSchema,
  thursday: dailyOpeningHoursSchema,
  friday: dailyOpeningHoursSchema,
  saturday: dailyOpeningHoursSchema,
  sunday: dailyOpeningHoursSchema,
});

const partnershipSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama media kerja sama wajib diisi.")
    .max(60, "Nama media kerja sama maksimal 60 karakter."),
  url: optionalHttpUrl,
});

export const branchSettingsSchema = z.object({
  phone: z
    .string()
    .trim()
    .max(30, "Nomor telepon maksimal 30 karakter.")
    .regex(
      /^[0-9+\-\s()]*$/,
      "Nomor telepon hanya boleh berisi angka, spasi, +, -, dan tanda kurung.",
    )
    .default(""),

  googleMapsUrl: z
    .string()
    .trim()
    .max(1000, "URL Google Maps terlalu panjang.")
    .refine(
      (value) => value === "" || /^https:\/\/\S+$/i.test(value),
      "URL Google Maps harus menggunakan HTTPS.",
    )
    .default(""),

  weeklyOpeningHours: weeklyOpeningHoursSchema,

  partnerships: z
    .array(partnershipSchema)
    .max(10, "Maksimal 10 media kerja sama."),
});

export type BranchSettingsData = z.output<typeof branchSettingsSchema>;
export type BranchSettingsInput = z.input<typeof branchSettingsSchema>;

export type WeeklyOpeningHours = z.infer<typeof weeklyOpeningHoursSchema>;
export type DailyOpeningHours = z.infer<typeof dailyOpeningHoursSchema>;
