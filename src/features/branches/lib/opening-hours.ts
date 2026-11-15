import type { WeeklyOpeningHours } from "@/features/branches/types";

export type DayKey = keyof WeeklyOpeningHours;

// Urutan sesuai Date.getDay(): 0 = Minggu
const DAY_KEYS_BY_INDEX: DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const WEEK_DAYS: { key: DayKey; label: string }[] = [
  { key: "monday", label: "Senin" },
  { key: "tuesday", label: "Selasa" },
  { key: "wednesday", label: "Rabu" },
  { key: "thursday", label: "Kamis" },
  { key: "friday", label: "Jumat" },
  { key: "saturday", label: "Sabtu" },
  { key: "sunday", label: "Minggu" },
];

const DAY_LABEL = Object.fromEntries(
  WEEK_DAYS.map((day) => [day.key, day.label]),
) as Record<DayKey, string>;

const TIME_ZONE = "Asia/Jakarta";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export type OpeningSource = {
  weekly?: WeeklyOpeningHours | null;
  openingTime?: string | null;
  closingTime?: string | null;
};

export type OpeningStatus = {
  isOpen: boolean;
  label: "Buka" | "Tutup";
  detail: string;
};

function getZonedParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    dayIndex: WEEKDAY_INDEX[get("weekday")] ?? 0,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function toMinutes(value?: string | null): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value ?? "");
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatMinutes(total: number) {
  const hours = String(Math.floor(total / 60)).padStart(2, "0");
  const mins = String(total % 60).padStart(2, "0");
  return `${hours}.${mins}`;
}

function getRange(day?: WeeklyOpeningHours[DayKey] | null) {
  if (!day || !day.isOpen) return null;
  const open = toMinutes(day.open);
  const close = toMinutes(day.close);
  if (open === null || close === null || open === close) return null;
  return { open, close };
}

export function getTodayKey(date: Date = new Date()): DayKey {
  return DAY_KEYS_BY_INDEX[getZonedParts(date).dayIndex];
}

/**
 * Jadwal mingguan dipakai kalau ada. Jam lama (openingTime/closingTime)
 * hanya jadi cadangan kalau jadwal mingguan belum pernah disimpan.
 */
export function resolveSchedule(
  source: OpeningSource,
): WeeklyOpeningHours | null {
  if (source.weekly) return source.weekly;

  if (source.openingTime && source.closingTime) {
    const day = {
      isOpen: true,
      open: source.openingTime,
      close: source.closingTime,
    };
    return {
      monday: { ...day },
      tuesday: { ...day },
      wednesday: { ...day },
      thursday: { ...day },
      friday: { ...day },
      saturday: { ...day },
      sunday: { ...day },
    };
  }

  return null;
}

export function getOpeningStatus(
  source: OpeningSource,
  date: Date = new Date(),
): OpeningStatus | null {
  const schedule = resolveSchedule(source);
  if (!schedule) return null;

  const { dayIndex, minutes } = getZonedParts(date);
  const todayKey = DAY_KEYS_BY_INDEX[dayIndex];
  const yesterdayKey = DAY_KEYS_BY_INDEX[(dayIndex + 6) % 7];

  const today = getRange(schedule[todayKey]);
  const yesterday = getRange(schedule[yesterdayKey]);

  // Jadwal kemarin melewati tengah malam (mis. 18:00-02:00)
  if (yesterday && yesterday.close < yesterday.open && minutes < yesterday.close) {
    return {
      isOpen: true,
      label: "Buka",
      detail: `Tutup pukul ${formatMinutes(yesterday.close)}`,
    };
  }

  if (today) {
    const overnight = today.close < today.open;
    const openNow = overnight
      ? minutes >= today.open
      : minutes >= today.open && minutes < today.close;

    if (openNow) {
      return {
        isOpen: true,
        label: "Buka",
        detail: `Tutup pukul ${formatMinutes(today.close)}`,
      };
    }

    if (minutes < today.open) {
      return {
        isOpen: false,
        label: "Tutup",
        detail: `Buka hari ini pukul ${formatMinutes(today.open)}`,
      };
    }
  }

  for (let i = 1; i <= 7; i += 1) {
    const key = DAY_KEYS_BY_INDEX[(dayIndex + i) % 7];
    const range = getRange(schedule[key]);
    if (range) {
      return {
        isOpen: false,
        label: "Tutup",
        detail: `Buka ${DAY_LABEL[key]}, pukul ${formatMinutes(range.open)}`,
      };
    }
  }

  return { isOpen: false, label: "Tutup", detail: "Tutup sepanjang minggu" };
}